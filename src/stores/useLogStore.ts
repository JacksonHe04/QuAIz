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
 * 日志状态接口
 */
interface LogState {
  logs: LogEntry[];
  isVisible: boolean;
  maxLogs: number;
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
}

/**
 * 日志管理Store
 * 用于管理全局日志记录和显示
 */
export const useLogStore = create<LogState & LogActions>((set) => ({
  logs: [],
  isVisible: false,
  maxLogs: 10000,

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
  }
};