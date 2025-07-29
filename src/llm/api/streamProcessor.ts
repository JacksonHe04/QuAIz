/**
 * 流式处理器
 * 专门处理LLM API流式响应的处理逻辑
 */

import type { LLMStreamResponse } from './config';
import type { RequestLogger } from './requestLogger';
import type { ErrorHandler } from './errorHandler';
import { logger } from '@/stores/useLogStore';

/**
 * 流式处理统计信息
 */
interface StreamStats {
  totalChunks: number;
  totalLength: number;
  avgChunkSize: number;
}

/**
 * 流式处理器类
 */
export class StreamProcessor {
  private requestLogger: RequestLogger;
  private errorHandler: ErrorHandler;
  private totalChunks = 0;
  private totalLength = 0;

  constructor(requestLogger: RequestLogger, errorHandler: ErrorHandler) {
    this.requestLogger = requestLogger;
    this.errorHandler = errorHandler;
  }

  /**
   * 处理流式响应
   */
  async *processStream(
    response: Response
  ): AsyncGenerator<string, void, unknown> {
    const reader = response.body?.getReader();
    if (!reader) {
      this.errorHandler.handleStreamInitError();
    }

    const requestId = this.requestLogger.getRequestId();
    logger.info(`开始接收流式数据 [${requestId}]`, 'llm');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          this.logStreamCompletion(requestId);
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const content = this.processStreamLine(line, requestId);
          if (content) {
            yield content;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * 处理单行流式数据
   */
  private processStreamLine(line: string, requestId: string): string | null {
    const trimmedLine = line.trim();
    if (!trimmedLine || !trimmedLine.startsWith('data: ')) {
      return null;
    }

    const dataStr = trimmedLine.slice(6);
    if (dataStr === '[DONE]') {
      logger.info(`收到流式结束标记 [${requestId}]`, 'llm');
      return null;
    }

    try {
      const data: LLMStreamResponse = JSON.parse(dataStr);
      const content = data.choices?.[0]?.delta?.content;

      if (content) {
        this.updateStats(content, requestId);
        return content;
      }
    } catch (parseError) {
      logger.warning(`解析流式响应失败 [${requestId}]`, 'llm', {
        error:
          parseError instanceof Error ? parseError.message : String(parseError),
        dataStr: dataStr.substring(0, 100),
      });
    }

    return null;
  }

  /**
   * 更新流式处理统计信息
   */
  private updateStats(content: string, requestId: string): void {
    this.totalChunks++;
    this.totalLength += content.length;

    if (this.totalChunks % 10 === 0) {
      logger.info(`流式数据进度 [${requestId}]`, 'llm', {
        chunks: this.totalChunks,
        length: this.totalLength,
      });
    }
  }

  /**
   * 记录流式处理完成
   */
  private logStreamCompletion(requestId: string): void {
    const stats: StreamStats = {
      totalChunks: this.totalChunks,
      totalLength: this.totalLength,
      avgChunkSize:
        this.totalChunks > 0
          ? Math.round(this.totalLength / this.totalChunks)
          : 0,
    };

    logger.success(`流式请求完成 [${requestId}]`, 'llm', stats);
  }

  /**
   * 获取统计信息
   */
  getStats(): StreamStats {
    return {
      totalChunks: this.totalChunks,
      totalLength: this.totalLength,
      avgChunkSize:
        this.totalChunks > 0
          ? Math.round(this.totalLength / this.totalChunks)
          : 0,
    };
  }
}
