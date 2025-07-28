/**
 * 试卷生成相关的Actions
 * 从useAppStore中提取出来，提高代码可维护性
 */

import type { GenerationRequest, Quiz, Question } from '@/types';
import { quizGenerationService, checkLLMConfig } from '@/llm';
import type { StreamingOptions } from '@/llm/services/quizGenerationService';
import { mockGenerateQuiz } from './mockServices';

// 移除未使用的函数

/**
 * 流式题目状态接口
 */
interface StreamingQuestion {
  id: string;
  question?: string;
  type?: Question['type'];
  isPartial?: boolean;
  [key: string]: unknown;
}

/**
 * 生成Actions的类型定义
 */
export interface GenerationActions {
  startGeneration: (request: GenerationRequest) => Promise<void>;
  setGenerationError: (error: string) => void;
  resetGeneration: () => void;
  addStreamingQuestion: (question: StreamingQuestion) => void;
  updateStreamingQuestion: (index: number, question: StreamingQuestion) => void;
}

/**
 * 创建生成相关的Actions
 * @param set Zustand的set函数
 */
export const createGenerationActions = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (fn: (state: any) => any) => void
): GenerationActions => ({
  /**
   * 开始生成试卷
   * @param request 生成请求参数
   */
  startGeneration: async (request: GenerationRequest) => {
    // 设置生成中状态
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      generation: {
        status: 'generating',
        currentQuiz: null,
        error: null,
        progress: 0,
        streamingQuestions: [],
        completedQuestionCount: 0
      }
    }));
    
    try {
      // 检查LLM配置是否完整
      const { isConfigured } = checkLLMConfig();
      
      if (isConfigured) {
        // 使用真实LLM API生成试卷，支持流式渲染
        await generateWithLLM(request, set);
      } else {
        // 使用模拟API作为备用方案
        await generateWithMock(request, set);
      }
    } catch (error) {
      console.error('生成试卷失败:', error);
      const errorMessage = error instanceof Error ? error.message : '生成试卷时发生未知错误';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set((state: any) => ({
        ...state,
        generation: {
          ...state.generation,
          status: 'error',
          error: errorMessage
        }
      }));
    }
  },
  
  /**
   * 设置生成错误
   * @param error 错误信息
   */
  setGenerationError: (error: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      generation: {
        ...state.generation,
        status: 'error',
        error
      }
    }));
  },
  
  /**
   * 重置生成状态
   */
  resetGeneration: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      generation: {
        status: 'idle',
        currentQuiz: null,
        error: null,
        progress: 0,
        streamingQuestions: [],
        completedQuestionCount: 0
      }
    }));
  },
  
  /**
   * 添加流式问题
   * @param question 流式问题数据
   */
  addStreamingQuestion: (question: StreamingQuestion) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      generation: {
        ...state.generation,
        streamingQuestions: [...state.generation.streamingQuestions, question]
      }
    }));
  },
  
  /**
   * 更新流式问题
   * @param index 问题索引
   * @param question 问题数据
   */
  updateStreamingQuestion: (index: number, question: StreamingQuestion) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => {
      const newStreamingQuestions = [...state.generation.streamingQuestions];
      newStreamingQuestions[index] = question;
      
      return {
        ...state,
        generation: {
          ...state.generation,
          streamingQuestions: newStreamingQuestions
        }
      };
    });
  }
});

/**
 * 使用LLM API生成试卷
 * @param request 生成请求
 * @param set 状态更新函数
 */
const generateWithLLM = async (
  request: GenerationRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (fn: (state: any) => any) => void
) => {
  const streamingOptions: StreamingOptions = {
    onProgress: (partialQuiz: Quiz | undefined, progress: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set((state: any) => ({
        ...state,
        generation: {
          ...state.generation,
          currentQuiz: partialQuiz || state.generation.currentQuiz,
          progress
        }
      }));
    },
    
    onQuestionComplete: (question: Question, questionIndex: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set((state: any) => {
        const newStreamingQuestions = [...state.generation.streamingQuestions];
        newStreamingQuestions[questionIndex] = { ...question, isPartial: false };
        
        return {
          ...state,
          generation: {
            ...state.generation,
            streamingQuestions: newStreamingQuestions,
            completedQuestionCount: questionIndex + 1
          }
        };
      });
    },
    
    onQuestionPartial: (partialQuestion: Question & { isPartial?: boolean }, questionIndex: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set((state: any) => {
        const newStreamingQuestions = [...state.generation.streamingQuestions];
        newStreamingQuestions[questionIndex] = { ...partialQuestion, isPartial: true };
        
        return {
          ...state,
          generation: {
            ...state.generation,
            streamingQuestions: newStreamingQuestions
          }
        };
      });
    }
  };
  
  const quiz = await quizGenerationService.generateQuizStream(request, streamingOptions);
  
  // 设置完成状态
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set((state: any) => ({
    ...state,
    generation: {
      ...state.generation,
      status: 'complete',
      currentQuiz: quiz,
      progress: 100
    },
    answering: {
      currentQuestionIndex: 0,
      isSubmitted: false
    }
  }));
};

/**
 * 使用模拟API生成试卷
 * @param request 生成请求
 * @param set 状态更新函数
 */
const generateWithMock = async (
  request: GenerationRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (fn: (state: any) => any) => void
) => {
  console.warn('LLM配置不完整，使用模拟API生成试卷');
  
  const quiz = await mockGenerateQuiz(request);
  
  // 设置完成状态
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set((state: any) => ({
    ...state,
    generation: {
      ...state.generation,
      status: 'complete',
      currentQuiz: quiz,
      progress: 100
    },
    answering: {
      currentQuestionIndex: 0,
      isSubmitted: false
    }
  }));
};