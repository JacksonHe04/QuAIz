/**
 * 流式处理类型定义模块
 */

import type { JSONExtractionResult } from '../json';

/**
 * 流式处理进度回调类型
 */
export type ProgressCallback<T> = (
  partialData: T | undefined,
  progress: number
) => void;

/**
 * JSON验证结果接口
 */
export interface ValidationResult<T> {
  isValid: boolean;
  error?: string;
  data?: T;
}

/**
 * 流式请求选项接口
 */
export interface StreamRequestOptions<T> {
  temperature?: number;
  maxTokens?: number;
  extractJSON: (content: string) => JSONExtractionResult;
  validateJSON: (json: string) => ValidationResult<T>;
  parsePartial?: (json: string) => T | undefined;
  onProgress: ProgressCallback<T>;
}

/**
 * 文本流式请求选项接口
 */
export interface TextStreamOptions {
  temperature?: number;
  maxTokens?: number;
  onProgress?: (content: string, chunk: string) => void;
}

/**
 * 基础请求选项接口
 */
export interface BaseRequestOptions {
  temperature?: number;
  maxTokens?: number;
}

/**
 * 流式处理状态
 */
export interface StreamState<T = unknown> {
  accumulatedContent: string;
  chunkCount: number;
  finalResult: T | null;
  streamSessionId: string;
}
