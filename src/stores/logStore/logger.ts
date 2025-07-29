import type { LogEntry } from './types';

/**
 * 日志记录器接口
 */
interface Logger {
  info: (
    message: string,
    category?: LogEntry['category'],
    details?: unknown
  ) => void;
  success: (
    message: string,
    category?: LogEntry['category'],
    details?: unknown
  ) => void;
  warning: (
    message: string,
    category?: LogEntry['category'],
    details?: unknown
  ) => void;
  error: (
    message: string,
    category?: LogEntry['category'],
    details?: unknown
  ) => void;
  llm: {
    info: (message: string, details?: unknown) => void;
    success: (message: string, details?: unknown) => void;
    warning: (message: string, details?: unknown) => void;
    error: (message: string, details?: unknown) => void;
  };
  api: {
    info: (message: string, details?: unknown) => void;
    success: (message: string, details?: unknown) => void;
    warning: (message: string, details?: unknown) => void;
    error: (message: string, details?: unknown) => void;
  };
  stream: {
    start: (requestId?: string, operation?: string) => string;
    chunk: (sessionId: string, content: string, requestId?: string) => void;
    end: (sessionId: string) => void;
    clear: () => void;
  };
}

/**
 * 创建日志记录器
 * @param addLog 添加日志的函数
 * @param streamActions 流式操作对象
 * @returns 日志记录器实例
 */
export const createLogger = (
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void,
  streamActions: {
    startStreamSession: (requestId?: string, operation?: string) => string;
    addStreamChunk: (
      sessionId: string,
      content: string,
      requestId?: string
    ) => void;
    endStreamSession: (sessionId: string) => void;
    clearStreamSessions: () => void;
  }
): Logger => {
  const logger: Logger = {
    /**
     * 记录信息日志
     */
    info: (
      message: string,
      category: LogEntry['category'] = 'system',
      details?: unknown
    ) => {
      addLog({ level: 'info', category, message, details });
    },

    /**
     * 记录成功日志
     */
    success: (
      message: string,
      category: LogEntry['category'] = 'system',
      details?: unknown
    ) => {
      addLog({ level: 'success', category, message, details });
    },

    /**
     * 记录警告日志
     */
    warning: (
      message: string,
      category: LogEntry['category'] = 'system',
      details?: unknown
    ) => {
      addLog({ level: 'warning', category, message, details });
    },

    /**
     * 记录错误日志
     */
    error: (
      message: string,
      category: LogEntry['category'] = 'system',
      details?: unknown
    ) => {
      addLog({ level: 'error', category, message, details });
    },

    /**
     * 记录LLM相关日志
     */
    llm: {
      info: (message: string, details?: unknown) =>
        logger.info(message, 'llm', details),
      success: (message: string, details?: unknown) =>
        logger.success(message, 'llm', details),
      warning: (message: string, details?: unknown) =>
        logger.warning(message, 'llm', details),
      error: (message: string, details?: unknown) =>
        logger.error(message, 'llm', details),
    },

    /**
     * 记录API相关日志
     */
    api: {
      info: (message: string, details?: unknown) =>
        logger.info(message, 'api', details),
      success: (message: string, details?: unknown) =>
        logger.success(message, 'api', details),
      warning: (message: string, details?: unknown) =>
        logger.warning(message, 'api', details),
      error: (message: string, details?: unknown) =>
        logger.error(message, 'api', details),
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
        return streamActions.startStreamSession(requestId, operation);
      },

      /**
       * 添加流式内容片段
       * @param sessionId 会话ID
       * @param content 内容片段
       * @param requestId 请求ID
       */
      chunk: (sessionId: string, content: string, requestId?: string) => {
        streamActions.addStreamChunk(sessionId, content, requestId);
      },

      /**
       * 结束流式会话
       * @param sessionId 会话ID
       */
      end: (sessionId: string) => {
        streamActions.endStreamSession(sessionId);
      },

      /**
       * 清空所有流式会话
       */
      clear: () => {
        streamActions.clearStreamSessions();
      },
    },
  };

  return logger;
};
