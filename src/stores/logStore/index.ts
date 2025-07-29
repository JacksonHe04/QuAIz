/**
 * 日志模块统一导出
 */

// 导出类型定义
export type { LogEntry, StreamChunk, StreamSession, LogState } from './types';

// 导出操作接口
export type { LogActions, StreamActions } from './actions';

// 导出创建函数
export { createLogActions, createStreamActions } from './actions';

// 导出工具函数
export {
  generateId,
  getCurrentTimestamp,
  limitArrayLength,
  removeFromArray,
} from './utils';

// 导出日志器
export { createLogger } from './logger';
