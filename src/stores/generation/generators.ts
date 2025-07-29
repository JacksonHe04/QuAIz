/**
 * 试卷生成器模块
 */

import type { GenerationRequest, Quiz, Question } from '@/types';
import { quizGenerationService, checkLLMConfig } from '@/llm';
import type { StreamingOptions } from '@/llm/services/quizGenerationService';
import { mockGenerateQuiz } from '../mockServices';
import { GenerationStateManager } from './stateManager';

/**
 * 使用LLM API生成试卷
 */
export const generateWithLLM = async (
  request: GenerationRequest,
  stateManager: GenerationStateManager
): Promise<void> => {
  const streamingOptions: StreamingOptions = {
    onProgress: (partialQuiz: Quiz | undefined, progress: number) => {
      stateManager.updateProgress(progress, partialQuiz);
    },

    onQuestionComplete: (question: Question, questionIndex: number) => {
      stateManager.updateStreamingQuestion(questionIndex, {
        ...question,
        isPartial: false,
      });
      stateManager.updateCompletedQuestionCount(questionIndex + 1);
    },

    onQuestionPartial: (
      partialQuestion: Question & { isPartial?: boolean },
      questionIndex: number
    ) => {
      stateManager.updateStreamingQuestion(questionIndex, {
        ...partialQuestion,
        isPartial: true,
      });
    },
  };

  const quiz = await quizGenerationService.generateQuizStream(
    request,
    streamingOptions
  );
  stateManager.setComplete(quiz);
};

/**
 * 使用模拟API生成试卷
 */
export const generateWithMock = async (
  request: GenerationRequest,
  stateManager: GenerationStateManager
): Promise<void> => {
  console.warn('LLM配置不完整，使用模拟API生成试卷');

  const quiz = await mockGenerateQuiz(request);
  stateManager.setComplete(quiz);
};

/**
 * 生成试卷的主要逻辑
 */
export const generateQuiz = async (
  request: GenerationRequest,
  stateManager: GenerationStateManager
): Promise<void> => {
  // 设置生成中状态
  stateManager.setGenerating();

  try {
    // 检查LLM配置是否完整
    const { isConfigured } = checkLLMConfig();

    if (isConfigured) {
      // 使用真实LLM API生成试卷，支持流式渲染
      await generateWithLLM(request, stateManager);
    } else {
      // 使用模拟API作为备用方案
      await generateWithMock(request, stateManager);
    }
  } catch (error) {
    console.error('生成试卷失败:', error);
    const errorMessage =
      error instanceof Error ? error.message : '生成试卷时发生未知错误';
    stateManager.setError(errorMessage);
  }
};
