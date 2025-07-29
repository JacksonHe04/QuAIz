/**
 * 试卷相关LLM服务 - 重构后的入口文件
 * 提供向后兼容的API，同时使用新的模块化架构
 */

// 导出新的服务类和类型
export { QuizGenerationService } from './quizGenerationService';
export { QuizGradingService } from './quizGradingService';
export { BaseLLMService } from './baseService';
export type {
  ProgressCallback,
  ValidationResult,
  JSONExtractionResult,
} from './baseService';
export type { QuizProgressCallback } from './quizGenerationService';
export type { GradingProgressCallback } from './quizGradingService';

// 导出服务工厂和默认实例（保持向后兼容）
export {
  createQuizServices,
  getDefaultServices,
  updateDefaultLLMClient,
  quizGenerationService,
  quizGradingService,
} from './serviceFactory';

// 保持向后兼容的类型定义
import type { Quiz } from '@/types';
export type StreamCallback = (
  content: string,
  isComplete: boolean,
  quiz?: Quiz
) => void;
