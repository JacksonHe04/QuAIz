import type { LogEntry, StreamChunk, StreamSession } from './types';
import {
  generateId,
  getCurrentTimestamp,
  limitArrayLength,
  removeFromArray,
} from './utils';

/**
 * 日志操作接口
 */
export interface LogActions {
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  toggleVisibility: () => void;
  setVisibility: (visible: boolean) => void;
  removeLogs: (count: number) => void;
}

/**
 * 流式操作接口
 */
export interface StreamActions {
  startStreamSession: (requestId?: string, operation?: string) => string;
  addStreamChunk: (
    sessionId: string,
    content: string,
    requestId?: string
  ) => void;
  endStreamSession: (sessionId: string) => void;
  clearStreamSessions: () => void;
  setActiveTab: (tab: 'logs' | 'stream') => void;
  removeStreamSessions: (count: number) => void;
}

/**
 * 创建日志操作函数
 * @param set Zustand的set函数
 * @param maxLogs 最大日志数量
 * @returns 日志操作对象
 */
export const createLogActions = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (fn: (state: any) => any) => void,
  maxLogs: number
): LogActions => ({
  /**
   * 添加日志条目
   * @param entry 日志条目（不包含id和timestamp）
   */
  addLog: entry => {
    const newLog: LogEntry = {
      ...entry,
      id: generateId('log'),
      timestamp: getCurrentTimestamp(),
    };

    set(state => ({
      ...state,
      logs: limitArrayLength([...state.logs, newLog], maxLogs),
    }));
  },

  /**
   * 清空所有日志
   */
  clearLogs: () => {
    set(state => ({ ...state, logs: [] }));
  },

  /**
   * 切换日志面板可见性
   */
  toggleVisibility: () => {
    set(state => ({ ...state, isVisible: !state.isVisible }));
  },

  /**
   * 设置日志面板可见性
   * @param visible 是否可见
   */
  setVisibility: visible => {
    set(state => ({ ...state, isVisible: visible }));
  },

  /**
   * 移除指定数量的旧日志
   * @param count 要移除的日志数量
   */
  removeLogs: count => {
    set(state => ({
      ...state,
      logs: removeFromArray(state.logs, count),
    }));
  },
});

/**
 * 创建流式操作函数
 * @param set Zustand的set函数
 * @param maxStreamSessions 最大流式会话数量
 * @returns 流式操作对象
 */
export const createStreamActions = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (fn: (state: any) => any) => void,
  maxStreamSessions: number
): StreamActions => ({
  /**
   * 开始新的流式会话
   * @param requestId 请求ID
   * @param operation 操作名称
   * @returns 会话ID
   */
  startStreamSession: (requestId, operation) => {
    const sessionId = generateId('stream');
    const newSession: StreamSession = {
      id: sessionId,
      startTime: getCurrentTimestamp(),
      chunks: [],
      totalContent: '',
      requestId,
      operation,
    };

    set(state => ({
      ...state,
      streamSessions: limitArrayLength(
        [...state.streamSessions, newSession],
        maxStreamSessions
      ),
      currentStreamSession: newSession,
    }));

    return sessionId;
  },

  /**
   * 添加流式内容片段
   * @param sessionId 会话ID
   * @param content 内容片段
   * @param requestId 请求ID
   */
  addStreamChunk: (sessionId, content, requestId) => {
    const chunk: StreamChunk = {
      id: generateId('chunk'),
      timestamp: getCurrentTimestamp(),
      content,
      requestId,
    };

    set(state => {
      const updatedSessions = state.streamSessions.map(
        (session: StreamSession) => {
          if (session.id === sessionId) {
            return {
              ...session,
              chunks: [...session.chunks, chunk],
              totalContent: session.totalContent + content,
            };
          }
          return session;
        }
      );

      const currentSession =
        updatedSessions.find((s: StreamSession) => s.id === sessionId) || null;

      return {
        ...state,
        streamSessions: updatedSessions,
        currentStreamSession: currentSession,
      };
    });
  },

  /**
   * 结束流式会话
   * @param sessionId 会话ID
   */
  endStreamSession: sessionId => {
    set(state => {
      const updatedSessions = state.streamSessions.map(
        (session: StreamSession) => {
          if (session.id === sessionId) {
            return {
              ...session,
              endTime: getCurrentTimestamp(),
            };
          }
          return session;
        }
      );

      return {
        ...state,
        streamSessions: updatedSessions,
        currentStreamSession: null,
      };
    });
  },

  /**
   * 清空所有流式会话
   */
  clearStreamSessions: () => {
    set(state => ({
      ...state,
      streamSessions: [],
      currentStreamSession: null,
    }));
  },

  /**
   * 设置活动标签页
   * @param tab 标签页类型
   */
  setActiveTab: tab => {
    set(state => ({ ...state, activeTab: tab }));
  },

  /**
   * 移除指定数量的旧流式会话
   * @param count 要移除的会话数量
   */
  removeStreamSessions: count => {
    set(state => ({
      ...state,
      streamSessions: removeFromArray(state.streamSessions, count),
    }));
  },
});
