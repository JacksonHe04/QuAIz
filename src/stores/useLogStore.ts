import { create } from 'zustand';

/**
 * 日志条目接口
 */
export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'success' | 'warning' | 'error';
  category: 'llm' | 'api' | 'system' | 'user';
  message: string;
  details?: unknown;
}

/**
 * 流式回复片段接口
 */
export interface StreamChunk {
  id: string;
  timestamp: number;
  content: string;
  requestId?: string;
  isComplete?: boolean;
}

/**
 * 流式会话接口
 */
export interface StreamSession {
  id: string;
  startTime: number;
  endTime?: number;
  chunks: StreamChunk[];
  totalContent: string;
  requestId?: string;
  operation?: string;
}

/**
 * 日志状态接口
 */
interface LogState {
  logs: LogEntry[];
  isVisible: boolean;
  maxLogs: number;
  // 流式回复相关状态
  streamSessions: StreamSession[];
  currentStreamSession: StreamSession | null;
  activeTab: 'logs' | 'stream';
  maxStreamSessions: number;
}

/**
 * 日志操作接口
 */
interface LogActions {
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  toggleVisibility: () => void;
  setVisibility: (visible: boolean) => void;
  removeLogs: (count: number) => void;
  // 流式回复相关操作
  startStreamSession: (requestId?: string, operation?: string) => string;
  addStreamChunk: (sessionId: string, content: string, requestId?: string) => void;
  endStreamSession: (sessionId: string) => void;
  clearStreamSessions: () => void;
  setActiveTab: (tab: 'logs' | 'stream') => void;
  removeStreamSessions: (count: number) => void;
}

/**
 * 日志管理Store
 * 用于管理全局日志记录和显示
 */
export const useLogStore = create<LogState & LogActions>((set) => ({
  logs: [],
  isVisible: false,
  maxLogs: 10000,
  // 流式回复相关状态初始值
  streamSessions: [],
  currentStreamSession: null,
  activeTab: 'logs',
  maxStreamSessions: 50,

  /**
   * 添加日志条目
   * @param entry 日志条目（不包含id和timestamp）
   */
  addLog: (entry) => {
    const newLog: LogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    set((state) => {
      const newLogs = [...state.logs, newLog];
      // 保持日志数量在限制范围内
      if (newLogs.length > state.maxLogs) {
        newLogs.splice(0, newLogs.length - state.maxLogs);
      }
      return { logs: newLogs };
    });
  },

  /**
   * 清空所有日志
   */
  clearLogs: () => {
    set({ logs: [] });
  },

  /**
   * 切换日志面板可见性
   */
  toggleVisibility: () => {
    set((state) => ({ isVisible: !state.isVisible }));
  },

  /**
   * 设置日志面板可见性
   * @param visible 是否可见
   */
  setVisibility: (visible) => {
    set({ isVisible: visible });
  },

  /**
   * 移除指定数量的旧日志
   * @param count 要移除的日志数量
   */
  removeLogs: (count) => {
    set((state) => ({
      logs: state.logs.slice(count)
    }));
  },

  /**
   * 开始新的流式会话
   * @param requestId 请求ID
   * @param operation 操作名称
   * @returns 会话ID
   */
  startStreamSession: (requestId, operation) => {
    const sessionId = `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: StreamSession = {
      id: sessionId,
      startTime: Date.now(),
      chunks: [],
      totalContent: '',
      requestId,
      operation
    };

    set((state) => {
      const newSessions = [...state.streamSessions, newSession];
      // 保持会话数量在限制范围内
      if (newSessions.length > state.maxStreamSessions) {
        newSessions.splice(0, newSessions.length - state.maxStreamSessions);
      }
      return {
        streamSessions: newSessions,
        currentStreamSession: newSession
      };
    });

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
      id: `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      content,
      requestId
    };

    set((state) => {
      const updatedSessions = state.streamSessions.map(session => {
        if (session.id === sessionId) {
          const updatedSession = {
            ...session,
            chunks: [...session.chunks, chunk],
            totalContent: session.totalContent + content
          };
          return updatedSession;
        }
        return session;
      });

      const currentSession = updatedSessions.find(s => s.id === sessionId) || null;

      return {
        streamSessions: updatedSessions,
        currentStreamSession: currentSession
      };
    });
  },

  /**
   * 结束流式会话
   * @param sessionId 会话ID
   */
  endStreamSession: (sessionId) => {
    set((state) => {
      const updatedSessions = state.streamSessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            endTime: Date.now()
          };
        }
        return session;
      });

      return {
        streamSessions: updatedSessions,
        currentStreamSession: null
      };
    });
  },

  /**
   * 清空所有流式会话
   */
  clearStreamSessions: () => {
    set({ 
      streamSessions: [],
      currentStreamSession: null
    });
  },

  /**
   * 设置活动标签页
   * @param tab 标签页类型
   */
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  /**
   * 移除指定数量的旧流式会话
   * @param count 要移除的会话数量
   */
  removeStreamSessions: (count) => {
    set((state) => ({
      streamSessions: state.streamSessions.slice(count)
    }));
  }
}));

/**
 * 日志记录辅助函数
 */
export const logger = {
  /**
   * 记录信息日志
   */
  info: (message: string, category: LogEntry['category'] = 'system', details?: unknown) => {
    useLogStore.getState().addLog({ level: 'info', category, message, details });
  },

  /**
   * 记录成功日志
   */
  success: (message: string, category: LogEntry['category'] = 'system', details?: unknown) => {
    useLogStore.getState().addLog({ level: 'success', category, message, details });
  },

  /**
   * 记录警告日志
   */
  warning: (message: string, category: LogEntry['category'] = 'system', details?: unknown) => {
    useLogStore.getState().addLog({ level: 'warning', category, message, details });
  },

  /**
   * 记录错误日志
   */
  error: (message: string, category: LogEntry['category'] = 'system', details?: unknown) => {
    useLogStore.getState().addLog({ level: 'error', category, message, details });
  },

  /**
   * 记录LLM相关日志
   */
  llm: {
    info: (message: string, details?: unknown) => logger.info(message, 'llm', details),
    success: (message: string, details?: unknown) => logger.success(message, 'llm', details),
    warning: (message: string, details?: unknown) => logger.warning(message, 'llm', details),
    error: (message: string, details?: unknown) => logger.error(message, 'llm', details)
  },

  /**
   * 记录API相关日志
   */
  api: {
    info: (message: string, details?: unknown) => logger.info(message, 'api', details),
    success: (message: string, details?: unknown) => logger.success(message, 'api', details),
    warning: (message: string, details?: unknown) => logger.warning(message, 'api', details),
    error: (message: string, details?: unknown) => logger.error(message, 'api', details)
  },

  /**
   * 流式回复相关操作
   */
  stream: {
    /**
     * 开始新的流式会话
     * @param requestId 请求ID
     * @param operation 操作名称
     * @returns 会话ID
     */
    start: (requestId?: string, operation?: string) => {
      return useLogStore.getState().startStreamSession(requestId, operation);
    },

    /**
     * 添加流式内容片段
     * @param sessionId 会话ID
     * @param content 内容片段
     * @param requestId 请求ID
     */
    chunk: (sessionId: string, content: string, requestId?: string) => {
      useLogStore.getState().addStreamChunk(sessionId, content, requestId);
    },

    /**
     * 结束流式会话
     * @param sessionId 会话ID
     */
    end: (sessionId: string) => {
      useLogStore.getState().endStreamSession(sessionId);
    },

    /**
     * 清空所有流式会话
     */
    clear: () => {
      useLogStore.getState().clearStreamSessions();
    }
  }
};