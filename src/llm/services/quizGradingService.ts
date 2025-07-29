/**
 * 试卷批改服务
 * 专门负责试卷的批改功能，包括流式和非流式批改
 */

import type { Quiz, GradingResult } from '@/types';
import {
  BaseLLMService,
  type ProgressCallback,
  type ValidationResult,
} from './baseService';
import {
  generateGradingPrompt,
  validateGradingJSON,
} from '../prompt/quizGrading';
import { extractJSONFromStream, safeParseJSON } from '../utils/jsonUtils';
import { logger } from '@/stores/useLogStore';
import type { LLMClient } from '../api/client';

/**
 * 试卷批改进度回调类型
 */
export type GradingProgressCallback = ProgressCallback<GradingResult>;

/**
 * 试卷批改服务类
 */
export class QuizGradingService extends BaseLLMService {
  /**
   * 批改试卷（非流式）
   */
  async gradeQuiz(quiz: Quiz): Promise<GradingResult> {
    const requestId = this.generateRequestId('quiz-grade');
    logger.llm.info(`开始批改试卷: ${quiz.title}`, {
      requestId,
      quizId: quiz.id,
      questionCount: quiz.questions.length,
    });

    const messages = generateGradingPrompt(quiz);

    try {
      const response = await this.executeLLMRequest(
        messages,
        requestId,
        '试卷批改',
        {
          temperature: 0.3, // 批改时使用较低的温度以保证一致性和准确性
          maxTokens: 4096, // 增加最大token数以确保完整批改
        }
      );

      const validation = this.validateGradingResponse(response);
      if (!validation.isValid || !validation.data) {
        logger.llm.error('批改结果格式验证失败', {
          requestId,
          error: validation.error,
        });
        throw new Error(`批改结果格式错误: ${validation.error}`);
      }

      const result = validation.data;
      logger.llm.success(
        `试卷批改完成，总分: ${result.totalScore}/${result.maxScore}`,
        {
          requestId,
          totalScore: result.totalScore,
          maxScore: result.maxScore,
        }
      );

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      logger.llm.error('试卷批改失败', { requestId, error: errorMessage });
      throw new Error(`试卷批改失败: ${errorMessage}`);
    }
  }

  /**
   * 流式批改试卷
   */
  async gradeQuizStream(
    quiz: Quiz,
    onProgress: GradingProgressCallback
  ): Promise<GradingResult> {
    const requestId = this.generateRequestId('quiz-grade-stream');
    logger.llm.info(`开始流式批改试卷: ${quiz.title}`, {
      requestId,
      quizId: quiz.id,
      questionCount: quiz.questions.length,
    });

    const messages = generateGradingPrompt(quiz);

    const result = await this.executeStreamLLMRequest<GradingResult>(
      messages,
      requestId,
      '试卷批改',
      {
        temperature: 0.3, // 批改时使用较低的温度以保证一致性和准确性
        maxTokens: 4096,
        extractJSON: extractJSONFromStream,
        validateJSON: (json: string) => this.validateGradingResponse(json),
        parsePartial: (json: string) => this.parsePartialGradingResult(json),
        onProgress,
      }
    );

    return result;
  }

  /**
   * 验证批改响应
   */
  private validateGradingResponse(
    response: string
  ): ValidationResult<GradingResult> {
    const validation = validateGradingJSON(response);
    return {
      isValid: validation.isValid,
      error: validation.error,
      data: validation.result,
    };
  }

  /**
   * 解析部分批改结果JSON以提供实时预览
   */
  private parsePartialGradingResult(
    jsonStr: string
  ): GradingResult | undefined {
    // 使用基类的JSON修复工具
    const fixedJson = this.fixIncompleteJSON(jsonStr, 'results');
    const parsed = safeParseJSON<Record<string, unknown>>(fixedJson);

    // 基础验证
    if (
      parsed &&
      typeof parsed.totalScore === 'number' &&
      typeof parsed.maxScore === 'number' &&
      Array.isArray(parsed.results)
    ) {
      return {
        totalScore: parsed.totalScore as number,
        maxScore: parsed.maxScore as number,
        results: parsed.results as Array<{
          questionId: string;
          score: number;
          feedback: string;
        }>,
        overallFeedback:
          typeof parsed.overallFeedback === 'string'
            ? parsed.overallFeedback
            : '正在生成总体评价...',
      };
    }

    return undefined;
  }
}

/**
 * 创建试卷批改服务实例
 */
export function createQuizGradingService(llmClient?: LLMClient) {
  return new QuizGradingService(llmClient);
}
