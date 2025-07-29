/**
 * 试卷生成状态管理模块
 */

import type { GenerationState, StreamingQuestion, StateUpdater } from './types';
import type { Quiz } from '@/types';

/**
 * 应用状态接口
 */
interface AppState {
  generation: GenerationState;
  answering?: {
    currentQuestionIndex: number;
    isSubmitted: boolean;
  };
  [key: string]: unknown;
}

/**
 * 创建初始生成状态
 */
export const createInitialGenerationState = (): GenerationState => ({
  status: 'idle',
  currentQuiz: null,
  error: null,
});

/**
 * 状态更新工具类
 */
export class GenerationStateManager {
  constructor(private set: StateUpdater<AppState>) {}

  /**
   * 设置生成中状态
   */
  setGenerating(): void {
    const startTime = Date.now();
    this.set((state: AppState) => ({
      ...state,
      generation: {
        status: 'generating',
        currentQuiz: null,
        error: null,
        progress: 0,
        streamingQuestions: [],
        completedQuestionCount: 0,
        startTime,
        endTime: undefined,
        duration: undefined,
      },
    }));
  }

  /**
   * 设置错误状态
   */
  setError(error: string): void {
    const endTime = Date.now();
    this.set((state: AppState) => {
      const startTime = state.generation.startTime;
      const duration = startTime ? endTime - startTime : undefined;

      return {
        ...state,
        generation: {
          ...state.generation,
          status: 'error',
          error,
          endTime,
          duration,
        },
      };
    });
  }

  /**
   * 重置生成状态
   */
  reset(): void {
    this.set((state: AppState) => ({
      ...state,
      generation: createInitialGenerationState(),
    }));
  }

  /**
   * 更新进度
   */
  updateProgress(progress: number, currentQuiz?: Quiz): void {
    this.set((state: AppState) => ({
      ...state,
      generation: {
        ...state.generation,
        currentQuiz: currentQuiz || state.generation.currentQuiz,
        progress,
      },
    }));
  }

  /**
   * 添加流式问题
   */
  addStreamingQuestion(question: StreamingQuestion): void {
    this.set((state: AppState) => ({
      ...state,
      generation: {
        ...state.generation,
        streamingQuestions: [
          ...(state.generation.streamingQuestions || []),
          question,
        ],
      },
    }));
  }

  /**
   * 更新流式问题
   */
  updateStreamingQuestion(index: number, question: StreamingQuestion): void {
    this.set((state: AppState) => {
      const currentQuestions = state.generation.streamingQuestions || [];
      const newStreamingQuestions = [...currentQuestions];
      newStreamingQuestions[index] = question;

      return {
        ...state,
        generation: {
          ...state.generation,
          streamingQuestions: newStreamingQuestions,
        },
      };
    });
  }

  /**
   * 更新完成的问题数量
   */
  updateCompletedQuestionCount(count: number): void {
    this.set((state: AppState) => ({
      ...state,
      generation: {
        ...state.generation,
        completedQuestionCount: count,
      },
    }));
  }

  /**
   * 设置完成状态
   */
  setComplete(quiz: Quiz): void {
    const endTime = Date.now();
    this.set((state: AppState) => {
      const startTime = state.generation.startTime;
      const duration = startTime ? endTime - startTime : undefined;

      return {
        ...state,
        generation: {
          ...state.generation,
          status: 'complete',
          currentQuiz: quiz,
          progress: 100,
          endTime,
          duration,
        },
        answering: {
          currentQuestionIndex: 0,
          isSubmitted: false,
        },
      };
    });
  }
}
