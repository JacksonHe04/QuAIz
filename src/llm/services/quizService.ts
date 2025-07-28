/**
 * 试卷相关LLM服务
 * 整合API客户端和提示词模板，提供高级的试卷生成和批改功能
 */

import type { GenerationRequest, Quiz, GradingResult, Question } from '@/types';
import { LLMClient } from '../api/client';
import { generateQuizPrompt, validateQuizJSON, extractJSONFromStream } from '../prompt/quizGeneration';
import { generateGradingPrompt, validateGradingJSON, extractGradingJSONFromStream } from '../prompt/quizGrading';
import { logger } from '@/stores/useLogStore';

/**
 * 流式生成回调函数类型
 */
export type StreamCallback = (content: string, isComplete: boolean, quiz?: Quiz) => void;

/**
 * 试卷生成服务类
 */
export class QuizGenerationService {
  private llmClient: LLMClient;

  constructor(llmClient?: LLMClient) {
    this.llmClient = llmClient || new LLMClient();
  }

  /**
   * 生成试卷（非流式）
   */
  async generateQuiz(request: GenerationRequest): Promise<Quiz> {
    const requestId = `quiz-gen-${Date.now()}`;
    logger.llm.info(`开始生成试卷: ${request.subject}`, { requestId, request });
    
    const messages = generateQuizPrompt(request);
    
    try {
      logger.llm.info('发送试卷生成请求到LLM', { requestId, messageCount: messages.length });
      
      const response = await this.llmClient.chat({
        messages,
        temperature: 0.7,
        max_tokens: 4000
      });
      
      logger.llm.info('收到LLM响应，开始验证试卷格式', { requestId });
      
      const validation = validateQuizJSON(response);
      if (!validation.isValid) {
        logger.llm.error('试卷格式验证失败', { requestId, error: validation.error });
        throw new Error(`生成的试卷格式错误: ${validation.error}`);
      }
      
      // 为每个题目添加userAnswer字段
      const quiz = validation.quiz!;
      quiz.questions = quiz.questions.map((question: Question) => ({
        ...question,
        userAnswer: undefined
      }));
      
      logger.llm.success(`试卷生成成功: ${quiz.title}`, { requestId, questionCount: quiz.questions.length });
      
      return quiz;
    } catch (error) {
      logger.llm.error('试卷生成失败', { requestId, error: error instanceof Error ? error.message : '未知错误' });
      if (error instanceof Error) {
        throw new Error(`试卷生成失败: ${error.message}`);
      }
      throw new Error('试卷生成失败: 未知错误');
    }
  }

  /**
   * 流式生成试卷
   */
  async generateQuizStream(
    request: GenerationRequest, 
    onProgress: (partialQuiz: Quiz | undefined, progress: number) => void
  ): Promise<Quiz> {
    const requestId = `quiz-stream-${Date.now()}`;
    logger.llm.info(`开始流式生成试卷: ${request.subject}`, { requestId, request });
    
    const messages = generateQuizPrompt(request);
    let accumulatedContent = '';
    let finalQuiz: Quiz | null = null;
    let chunkCount = 0;
    
    try {
      logger.llm.info('开始流式请求', { requestId, messageCount: messages.length });
      
      for await (const chunk of this.llmClient.chatStream({
        messages,
        temperature: 0.7,
        max_tokens: 4000
      })) {
        chunkCount++;
        accumulatedContent += chunk;
        
        if (chunkCount % 10 === 0) {
          logger.llm.info(`接收流式数据块`, { requestId, chunkCount, contentLength: accumulatedContent.length });
        }
        
        // 尝试提取JSON
        const { json, isComplete } = extractJSONFromStream(accumulatedContent);
        
        if (json) {
          // 如果JSON完整，验证并解析
          if (isComplete) {
            logger.llm.info('检测到完整JSON，开始验证', { requestId });
            const validation = validateQuizJSON(json);
            if (validation.isValid) {
              // 为每个题目添加userAnswer字段
              const quiz = validation.quiz!;
              quiz.questions = quiz.questions.map((question: Question) => ({
                ...question,
                userAnswer: undefined
              }));
              finalQuiz = quiz;
              logger.llm.success(`流式试卷生成完成: ${quiz.title}`, { requestId, questionCount: quiz.questions.length, totalChunks: chunkCount });
              onProgress(quiz, 100);
              break;
            } else {
              logger.llm.warning('JSON验证失败，继续接收数据', { requestId, error: validation.error });
            }
          }
          
          // 尝试解析部分JSON以提供实时预览
          try {
            const partialQuiz = this.parsePartialQuiz(json);
            if (partialQuiz) {
              logger.llm.info('解析到部分试卷内容', { requestId, questionCount: partialQuiz.questions.length });
            }
            onProgress(partialQuiz, 50);
          } catch {
            // 部分解析失败，只传递内容
            onProgress(undefined, 25);
          }
        } else {
          onProgress(undefined, 10);
        }
      }
      
      if (!finalQuiz) {
        logger.llm.warning('流式生成结束但未获得完整试卷，尝试最终解析', { requestId });
        // 最后尝试解析完整内容
        const { json } = extractJSONFromStream(accumulatedContent);
        if (json) {
          const validation = validateQuizJSON(json);
          if (validation.isValid) {
            const quiz = validation.quiz!;
            quiz.questions = quiz.questions.map((question: Question) => ({
              ...question,
              userAnswer: undefined
            }));
            finalQuiz = quiz;
            logger.llm.success(`最终解析成功: ${quiz.title}`, { requestId });
          }
        }
      }
      
      if (!finalQuiz) {
        logger.llm.error('无法从LLM响应中提取有效的试卷JSON', { requestId, contentLength: accumulatedContent.length });
        throw new Error('无法从LLM响应中提取有效的试卷JSON');
      }
      
      return finalQuiz;
    } catch (error) {
      logger.llm.error('流式试卷生成失败', { requestId, error: error instanceof Error ? error.message : '未知错误', chunkCount });
      if (error instanceof Error) {
        throw new Error(`流式试卷生成失败: ${error.message}`);
      }
      throw new Error('流式试卷生成失败: 未知错误');
    }
  }

  /**
   * 解析部分JSON以提供实时预览
   */
  private parsePartialQuiz(jsonStr: string): Quiz | undefined {
    try {
      // 尝试修复不完整的JSON
      let fixedJson = jsonStr;
      
      // 如果JSON以逗号结尾，移除它
      fixedJson = fixedJson.replace(/,\s*$/, '');
      
      // 如果questions数组未闭合，尝试闭合
      if (fixedJson.includes('"questions": [') && !fixedJson.includes(']}')) {
        const questionsStart = fixedJson.indexOf('"questions": [');
        const afterQuestions = fixedJson.slice(questionsStart + 14);
        
        // 计算未闭合的括号
        let bracketCount = 1;
        let lastValidPos = questionsStart + 14;
        
        for (let i = 0; i < afterQuestions.length; i++) {
          const char = afterQuestions[i];
          if (char === '[') bracketCount++;
          else if (char === ']') {
            bracketCount--;
            if (bracketCount === 0) {
              lastValidPos = questionsStart + 14 + i;
              break;
            }
          }
        }
        
        if (bracketCount > 0) {
          // 添加缺失的闭合括号
          fixedJson = fixedJson.slice(0, lastValidPos + 1) + ']}';
        }
      }
      
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
 * 试卷批改服务类
 */
export class QuizGradingService {
  private llmClient: LLMClient;

  constructor(llmClient?: LLMClient) {
    this.llmClient = llmClient || new LLMClient();
  }

  /**
   * 批改试卷（非流式）
   */
  async gradeQuiz(quiz: Quiz): Promise<GradingResult> {
    const requestId = `quiz-grade-${Date.now()}`;
    logger.llm.info(`开始批改试卷: ${quiz.title}`, { requestId, quizId: quiz.id, questionCount: quiz.questions.length });
    
    const messages = generateGradingPrompt(quiz);
    
    try {
      logger.llm.info('发送试卷批改请求到LLM', { requestId, messageCount: messages.length });
      
      const response = await this.llmClient.chat({
        messages,
        temperature: 0.3, // 批改时使用较低的温度以保证一致性
        max_tokens: 3000
      });
      
      logger.llm.info('收到LLM批改响应，开始验证格式', { requestId });
      
      const validation = validateGradingJSON(response);
      if (!validation.isValid) {
        logger.llm.error('批改结果格式验证失败', { requestId, error: validation.error });
        throw new Error(`批改结果格式错误: ${validation.error}`);
      }
      
      const result = validation.result!;
      logger.llm.success(`试卷批改完成，总分: ${result.totalScore}/${result.maxScore}`, { requestId, totalScore: result.totalScore, maxScore: result.maxScore });
      
      return result;
    } catch (error) {
      logger.llm.error('试卷批改失败', { requestId, error: error instanceof Error ? error.message : '未知错误' });
      if (error instanceof Error) {
        throw new Error(`试卷批改失败: ${error.message}`);
      }
      throw new Error('试卷批改失败: 未知错误');
    }
  }

  /**
   * 流式批改试卷
   */
  async gradeQuizStream(
    quiz: Quiz,
    onProgress: (partialResult: GradingResult | undefined, progress: number) => void
  ): Promise<GradingResult> {
    const requestId = `quiz-grade-stream-${Date.now()}`;
    logger.llm.info(`开始流式批改试卷: ${quiz.title}`, { requestId, quizId: quiz.id, questionCount: quiz.questions.length });
    
    const messages = generateGradingPrompt(quiz);
    let accumulatedContent = '';
    let finalResult: GradingResult | null = null;
    let chunkCount = 0;
    
    try {
      logger.llm.info('开始流式批改请求', { requestId, messageCount: messages.length });
      
      for await (const chunk of this.llmClient.chatStream({
        messages,
        temperature: 0.3,
        max_tokens: 3000
      })) {
        chunkCount++;
        accumulatedContent += chunk;
        
        if (chunkCount % 10 === 0) {
          logger.llm.info(`接收批改数据块`, { requestId, chunkCount, contentLength: accumulatedContent.length });
        }
        
        // 尝试提取JSON
        const { json, isComplete } = extractGradingJSONFromStream(accumulatedContent);
        
        if (json) {
          // 如果JSON完整，验证并解析
          if (isComplete) {
            logger.llm.info('检测到完整批改JSON，开始验证', { requestId });
            const validation = validateGradingJSON(json);
            if (validation.isValid) {
              finalResult = validation.result!;
              logger.llm.success(`流式批改完成，总分: ${finalResult.totalScore}/${finalResult.maxScore}`, { requestId, totalScore: finalResult.totalScore, maxScore: finalResult.maxScore, totalChunks: chunkCount });
              onProgress(finalResult, 100);
              break;
            } else {
              logger.llm.warning('批改JSON验证失败，继续接收数据', { requestId, error: validation.error });
            }
          }
          
          // 尝试解析部分JSON以提供实时预览
          try {
            const partialResult = this.parsePartialGradingResult(json);
            if (partialResult) {
              logger.llm.info('解析到部分批改结果', { requestId, currentScore: partialResult.totalScore });
            }
            onProgress(partialResult, 50);
          } catch {
            // 部分解析失败，只传递内容
            onProgress(undefined, 25);
          }
        } else {
          onProgress(undefined, 10);
        }
      }
      
      if (!finalResult) {
        logger.llm.warning('流式批改结束但未获得完整结果，尝试最终解析', { requestId });
        // 最后尝试解析完整内容
        const { json } = extractGradingJSONFromStream(accumulatedContent);
        if (json) {
          const validation = validateGradingJSON(json);
          if (validation.isValid) {
            finalResult = validation.result!;
            logger.llm.success(`最终批改解析成功，总分: ${finalResult.totalScore}/${finalResult.maxScore}`, { requestId });
          }
        }
      }
      
      if (!finalResult) {
        logger.llm.error('无法从LLM响应中提取有效的批改结果JSON', { requestId, contentLength: accumulatedContent.length });
        throw new Error('无法从LLM响应中提取有效的批改结果JSON');
      }
      
      return finalResult;
    } catch (error) {
      logger.llm.error('流式试卷批改失败', { requestId, error: error instanceof Error ? error.message : '未知错误', chunkCount });
      if (error instanceof Error) {
        throw new Error(`流式试卷批改失败: ${error.message}`);
      }
      throw new Error('流式试卷批改失败: 未知错误');
    }
  }

  /**
   * 解析部分批改结果JSON以提供实时预览
   */
  private parsePartialGradingResult(jsonStr: string): GradingResult | undefined {
    try {
      // 尝试修复不完整的JSON
      let fixedJson = jsonStr;
      
      // 如果JSON以逗号结尾，移除它
      fixedJson = fixedJson.replace(/,\s*$/, '');
      
      // 如果results数组未闭合，尝试闭合
      if (fixedJson.includes('"results": [') && !fixedJson.includes(']}')) {
        fixedJson += ']}';
      }
      
      const parsed = JSON.parse(fixedJson);
      
      // 基础验证
      if (typeof parsed.totalScore === 'number' && 
          typeof parsed.maxScore === 'number' && 
          Array.isArray(parsed.results)) {
        return {
          totalScore: parsed.totalScore,
          maxScore: parsed.maxScore,
          results: parsed.results,
          overallFeedback: parsed.overallFeedback || '正在生成总体评价...'
        };
      }
    } catch {
      // 解析失败，返回undefined
    }
    
    return undefined;
  }
}

/**
 * 默认服务实例
 */
export const quizGenerationService = new QuizGenerationService();
export const quizGradingService = new QuizGradingService();

/**
 * 创建自定义服务实例
 */
export function createQuizServices(llmClient?: LLMClient) {
  return {
    generation: new QuizGenerationService(llmClient),
    grading: new QuizGradingService(llmClient)
  };
}