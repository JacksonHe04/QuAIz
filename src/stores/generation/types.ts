/**
 * 试卷生成相关的类型定义
 */

import type { GenerationRequest, Question, Quiz } from '@/types';

/**
 * 流式题目状态接口
 */
export interface StreamingQuestion {
  id: string;
  question?: string;
  type?: Question['type'];
  isPartial?: boolean;
  [key: string]: unknown;
}

/**
 * 生成状态类型
 */
export type GenerationStatus = 'idle' | 'generating' | 'complete' | 'error';

/**
 * 生成状态接口
 */
export interface GenerationState {
  status: GenerationStatus;
  currentQuiz: Quiz | null;
  error: string | null;
  progress?: number;
  streamingQuestions?: StreamingQuestion[];
  completedQuestionCount?: number;
  // 时间记录字段
  startTime?: number;
  endTime?: number;
  duration?: number;
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
 * 状态更新函数类型
 */
export type StateUpdater<T = unknown> = (fn: (state: T) => T) => void;
