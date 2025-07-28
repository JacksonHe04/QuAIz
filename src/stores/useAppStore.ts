import { create } from 'zustand';
import type { AppState } from '@/types';
import { createGenerationActions, type GenerationActions, type GenerationState } from './generationActions';
import { createAnsweringActions, type AnsweringActions } from './answeringActions';
import { createGradingActions, type GradingActions } from './gradingActions';

/**
 * 应用主状态管理store
 * 管理题目生成、答题和批改的全流程状态
 */
interface AppStore extends GenerationActions, AnsweringActions, GradingActions {
  generation: GenerationState;
  answering: AppState['answering'];
  grading: AppState['grading'];
  
  // 全局重置
  resetApp: () => void;
  
  // 索引签名以兼容类型系统
  [key: string]: unknown;
}



export const useAppStore = create<AppStore>((set, get) => ({
  // 初始状态
  generation: {
    status: 'idle',
    currentQuiz: null,
    error: null
  },
  answering: {
    currentQuestionIndex: 0,
    isSubmitted: false
  },
  grading: {
    status: 'idle',
    result: null,
    error: null
  },
  
  // 合并模块化的actions
    ...createGenerationActions(set),
    ...createAnsweringActions(set, get),
    ...createGradingActions(set, get),
  
  // 重置整个应用状态
  resetApp: () => {
    set(() => ({
      generation: {
        status: 'idle',
        currentQuiz: null,
        error: null
      },
      answering: {
        currentQuestionIndex: 0,
        isSubmitted: false
      },
      grading: {
        status: 'idle',
        result: null,
        error: null
      }
    }));
  }
}));