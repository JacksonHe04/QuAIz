/**
 * 试卷生成模块统一导出
 */

// 导出类型定义
export type {
  StreamingQuestion,
  GenerationStatus,
  GenerationState,
  GenerationActions,
  StateUpdater,
} from './types';

// 导出主要功能
export { createGenerationActions } from './actions';
export {
  GenerationStateManager,
  createInitialGenerationState,
} from './stateManager';
export { generateWithLLM, generateWithMock, generateQuiz } from './generators';
