/**
 * LLM API模块统一导出
 * 提供完整的LLM API交互功能
 */

// 主要客户端类和接口
export { LLMClient, defaultLLMClient, createLLMClient } from './client';
export type { Message, LLMRequest } from './client';

// 配置相关
export type {
  LLMConfig,
  LLMResponse,
  LLMStreamResponse,
  LLMError,
} from './config';
export { DEFAULT_LLM_CONFIG, LLM_PROVIDERS } from './config';

// 辅助工具类（可选导出，用于高级用法）
export { RequestLogger } from './requestLogger';
export { ErrorHandler } from './errorHandler';
export { StreamProcessor } from './streamProcessor';
