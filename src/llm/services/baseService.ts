/**
 * LLM服务基类
 * 提供通用的LLM服务功能，包括错误处理、日志记录、流式处理等
 */

import { LLMClient } from '../api/client';
import { generateRequestId } from '../utils/errorUtils';
import { fixIncompleteJSON } from '../utils/jsonUtils';
import {
  executeStreamLLMRequest,
  executeTextStreamLLMRequest,
  executeLLMRequest,
  type ProgressCallback,
  type ValidationResult,
} from '../utils/streamService';
import type { Message } from '../api/client';

// 重新导出类型以保持向后兼容
export type {
  ProgressCallback,
  ValidationResult,
} from '../utils/streamService';
export type { JSONExtractionResult } from '../utils/jsonUtils';

/**
 * LLM服务基类
 * 提供通用的LLM交互功能
 */
export abstract class BaseLLMService {
  protected llmClient: LLMClient;

  constructor(llmClient?: LLMClient) {
    this.llmClient = llmClient || new LLMClient();
  }

  /**
   * 生成请求ID
   */
  protected generateRequestId(prefix: string): string {
    return generateRequestId(prefix);
  }

  /**
   * 执行非流式LLM请求
   */
  protected async executeLLMRequest(
    messages: Message[],
    requestId: string,
    operation: string,
    options: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    return executeLLMRequest(
      this.llmClient,
      messages,
      requestId,
      operation,
      options
    );
  }

  /**
   * 执行流式LLM请求
   */
  protected async executeStreamLLMRequest<T>(
    messages: Message[],
    requestId: string,
    operation: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      extractJSON: (
        content: string
      ) => import('../utils/jsonUtils').JSONExtractionResult;
      validateJSON: (json: string) => ValidationResult<T>;
      parsePartial?: (json: string) => T | undefined;
      onProgress: ProgressCallback<T>;
    }
  ): Promise<T> {
    return executeStreamLLMRequest(
      this.llmClient,
      messages,
      requestId,
      operation,
      options
    );
  }

  /**
   * 执行纯文本流式LLM请求
   */
  protected async executeTextStreamLLMRequest(
    messages: Message[],
    requestId: string,
    operation: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      onProgress?: (content: string, chunk: string) => void;
    } = {}
  ): Promise<string> {
    return executeTextStreamLLMRequest(
      this.llmClient,
      messages,
      requestId,
      operation,
      options
    );
  }

  /**
   * 通用JSON修复工具
   */
  protected fixIncompleteJSON(jsonStr: string, arrayField?: string): string {
    return fixIncompleteJSON(jsonStr, arrayField);
  }
}
