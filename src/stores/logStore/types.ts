/**
 * 日志相关类型定义
 */

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
export interface LogState {
  logs: LogEntry[];
  isVisible: boolean;
  maxLogs: number;
  // 流式回复相关状态
  streamSessions: StreamSession[];
  currentStreamSession: StreamSession | null;
  activeTab: 'logs' | 'stream';
  maxStreamSessions: number;
}
