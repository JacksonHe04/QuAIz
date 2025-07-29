/**
 * 试卷生成Actions模块
 */

import type { GenerationRequest } from '@/types';
import type { GenerationActions, StreamingQuestion } from './types';
import { GenerationStateManager } from './stateManager';
import { generateQuiz } from './generators';

/**
 * 应用状态接口
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
type StateUpdater = (fn: (state: any) => any) => void;

/**
 * 创建生成相关的Actions
 * @param set Zustand的set函数
 */
export const createGenerationActions = (
  set: StateUpdater
): GenerationActions => {
  const stateManager = new GenerationStateManager(set);

  return {
    /**
     * 开始生成试卷
     * @param request 生成请求参数
     */
    startGeneration: async (request: GenerationRequest) => {
      await generateQuiz(request, stateManager);
    },

    /**
     * 设置生成错误
     * @param error 错误信息
     */
    setGenerationError: (error: string) => {
      stateManager.setError(error);
    },

    /**
     * 重置生成状态
     */
    resetGeneration: () => {
      stateManager.reset();
    },

    /**
     * 添加流式问题
     * @param question 流式问题数据
     */
    addStreamingQuestion: (question: StreamingQuestion) => {
      stateManager.addStreamingQuestion(question);
    },

    /**
     * 更新流式问题
     * @param index 问题索引
     * @param question 问题数据
     */
    updateStreamingQuestion: (index: number, question: StreamingQuestion) => {
      stateManager.updateStreamingQuestion(index, question);
    },
  };
};
