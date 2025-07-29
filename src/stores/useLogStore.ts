import { create } from 'zustand';
import type { LogState, LogActions, StreamActions } from './logStore';
import {
  createLogActions,
  createStreamActions,
  createLogger,
} from './logStore';

// 重新导出类型以保持向后兼容
export type { LogEntry, StreamChunk, StreamSession } from './logStore';

/**
 * 完整的日志Store类型
 */
type LogStore = LogState & LogActions & StreamActions;

/**
 * 日志管理Store
 * 用于管理全局日志记录和显示
 */
export const useLogStore = create<LogStore>(set => {
  // 配置常量
  const MAX_LOGS = 1000000;
  const MAX_STREAM_SESSIONS = 50;

  // 创建actions
  const logActions = createLogActions(set, MAX_LOGS);
  const streamActions = createStreamActions(set, MAX_STREAM_SESSIONS);

  return {
    // 初始状态
    logs: [],
    isVisible: false,
    maxLogs: MAX_LOGS,
    streamSessions: [],
    currentStreamSession: null,
    activeTab: 'logs' as const,
    maxStreamSessions: MAX_STREAM_SESSIONS,

    // 合并所有actions
    ...logActions,
    ...streamActions,
  };
});

/**
 * 日志记录辅助函数
 * 提供便捷的日志记录API
 */
export const logger = createLogger(useLogStore.getState().addLog, {
  startStreamSession: useLogStore.getState().startStreamSession,
  addStreamChunk: useLogStore.getState().addStreamChunk,
  endStreamSession: useLogStore.getState().endStreamSession,
  clearStreamSessions: useLogStore.getState().clearStreamSessions,
});
