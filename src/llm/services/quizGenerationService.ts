/**
 * 试卷生成服务
 * 专门负责试卷的生成功能，包括流式和非流式生成
 */

import type { GenerationRequest, Quiz, Question } from '@/types';
import { BaseLLMService, type ProgressCallback, type ValidationResult } from './baseService';
import { generateQuizPrompt, validateQuizJSON, extractJSONFromStream } from '../prompt/quizGeneration';
import { logger } from '@/stores/useLogStore';
import type { LLMClient } from '../api/client';

/**
 * 试卷生成进度回调类型
 */
export type QuizProgressCallback = ProgressCallback<Quiz>;

/**
 * 试卷生成服务类
 */
export class QuizGenerationService extends BaseLLMService {
  /**
   * 生成试卷（非流式）
   */
  async generateQuiz(request: GenerationRequest): Promise<Quiz> {
    const requestId = this.generateRequestId('quiz-gen');
    logger.llm.info(`开始生成试卷: ${request.subject}`, { requestId, request });
    
    const messages = generateQuizPrompt(request);
    
    try {
      const response = await this.executeLLMRequest(
        messages,
        requestId,
        '试卷生成',
        { temperature: 0.7, maxTokens: 4000 }
      );
      
      const validation = this.validateQuizResponse(response);
      if (!validation.isValid || !validation.data) {
        logger.llm.error('试卷格式验证失败', { requestId, error: validation.error });
        throw new Error(`生成的试卷格式错误: ${validation.error}`);
      }
      
      const quiz = this.addUserAnswerFields(validation.data);
      logger.llm.success(`试卷生成成功: ${quiz.title}`, { requestId, questionCount: quiz.questions.length });
      
      return quiz;
    } catch (error) {
      this.handleLLMError(error, requestId, '试卷生成');
    }
  }

  /**
   * 流式生成试卷
   */
  async generateQuizStream(
    request: GenerationRequest, 
    onProgress: QuizProgressCallback
  ): Promise<Quiz> {
    const requestId = this.generateRequestId('quiz-stream');
    logger.llm.info(`开始流式生成试卷: ${request.subject}`, { requestId, request });
    
    const messages = generateQuizPrompt(request);
    
    const result = await this.executeStreamLLMRequest<Quiz>(
      messages,
      requestId,
      '试卷生成',
      {
        temperature: 0.7,
        maxTokens: 4000,
        extractJSON: (content: string) => {
          const result = extractJSONFromStream(content);
          return {
            json: result.json || null,
            isComplete: result.isComplete
          };
        },
        validateJSON: (json: string) => this.validateQuizResponse(json),
        parsePartial: (json: string) => this.parsePartialQuiz(json),
        onProgress
      }
    );
    
    return this.addUserAnswerFields(result);
  }

  /**
   * 验证试卷响应
   */
  private validateQuizResponse(response: string): ValidationResult<Quiz> {
    const validation = validateQuizJSON(response);
    return {
      isValid: validation.isValid,
      error: validation.error,
      data: validation.quiz
    };
  }

  /**
   * 为试卷题目添加userAnswer字段
   */
  private addUserAnswerFields(quiz: Quiz): Quiz {
    return {
      ...quiz,
      questions: quiz.questions.map((question: Question) => ({
        ...question,
        userAnswer: undefined
      }))
    };
  }

  /**
   * 解析部分JSON以提供实时预览
   */
  private parsePartialQuiz(jsonStr: string): Quiz | undefined {
    try {
      // 使用基类的JSON修复工具
      const fixedJson = this.fixIncompleteJSON(jsonStr, 'questions');
      const parsed = JSON.parse(fixedJson);
      
      // 基础验证
      if (parsed.id && parsed.title && Array.isArray(parsed.questions)) {
        return {
          id: parsed.id,
          title: parsed.title,
          questions: parsed.questions.map((q: Question) => ({ ...q, userAnswer: undefined })),
          createdAt: parsed.createdAt || Date.now()
        };
      }
    } catch {
      // 解析失败，返回undefined
    }
    
    return undefined;
  }
}

/**
 * 创建试卷生成服务实例
 */
export function createQuizGenerationService(llmClient?: LLMClient) {
  return new QuizGenerationService(llmClient);
}