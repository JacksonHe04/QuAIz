/**
 * 请求日志记录器
 * 专门处理LLM API请求的日志记录逻辑
 */

import { logger } from '@/stores/useLogStore';
import type { LLMRequest } from './client';

/**
 * 请求日志记录器类
 */
export class RequestLogger {
  private requestId: string;
  private operation: string;

  constructor(operation: string) {
    this.requestId = Math.random().toString(36).substr(2, 9);
    this.operation = operation;
  }

  /**
   * 获取请求ID
   */
  getRequestId(): string {
    return this.requestId;
  }

  /**
   * 记录请求开始
   */
  logRequestStart(
    request: LLMRequest,
    config: { model: string },
    isStream?: boolean
  ): void {
    logger.info(`开始发送${this.operation}请求 [${this.requestId}]`, 'llm', {
      model: request.model || config.model,
      messageCount: request.messages.length,
      maxTokens: request.max_tokens,
      temperature: request.temperature,
      stream: isStream || false,
    });
  }

  /**
   * 记录HTTP请求
   */
  logHttpRequest(url: string): void {
    logger.info(`发送HTTP请求 [${this.requestId}]`, 'api', {
      url,
      method: 'POST',
    });
  }

  /**
   * 记录HTTP响应
   */
  logHttpResponse(response: Response): void {
    logger.info(`收到HTTP响应 [${this.requestId}]`, 'api', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });
  }

  /**
   * 记录请求成功
   */
  logSuccess(contentLength: number): void {
    logger.success(`${this.operation}请求完成 [${this.requestId}]`, 'llm', {
      responseLength: contentLength,
    });
  }

  /**
   * 记录请求错误
   */
  logError(error: string | Error): void {
    const errorMessage = error instanceof Error ? error.message : error;
    logger.error(`${this.operation}请求异常 [${this.requestId}]`, 'llm', {
      error: errorMessage,
    });
  }

  /**
   * 记录配置验证失败
   */
  logConfigError(error: string): void {
    logger.error(`配置验证失败 [${this.requestId}]`, 'llm', { error });
  }

  /**
   * 记录API请求失败
   */
  logApiError(status: number, statusText: string): void {
    logger.error(`${this.operation}请求失败 [${this.requestId}]`, 'api', {
      status,
      statusText,
    });
  }

  /**
   * 记录响应解析失败
   */
  logParseError(error: string, response?: unknown): void {
    logger.error(`响应解析失败 [${this.requestId}]`, 'llm', {
      error,
      response,
    });
  }
}
