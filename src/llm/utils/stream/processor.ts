/**
 * 流式处理器核心模块
 * 处理流式数据的解析和验证逻辑
 */

import type { LLMClient, Message } from '../../api/client';
import { DEFAULT_LLM_CONFIG } from '../../api/config';
import { logger } from '@/stores/useLogStore';
import { handleLLMError } from '../errorUtils';
import type { StreamRequestOptions, StreamState } from './types';

/**
 * 流式处理器类
 */
export class StreamProcessor<T> {
  private state: StreamState<T>;
  private options: StreamRequestOptions<T>;
  private requestId: string;
  private operation: string;

  constructor(
    requestId: string,
    operation: string,
    options: StreamRequestOptions<T>
  ) {
    this.requestId = requestId;
    this.operation = operation;
    this.options = options;
    this.state = {
      accumulatedContent: '',
      chunkCount: 0,
      finalResult: null,
      streamSessionId: logger.stream.start(requestId, operation),
    };
  }

  /**
   * 处理单个数据块
   * @param chunk 数据块
   * @returns 是否已完成处理
   */
  processChunk(chunk: string): boolean {
    this.state.chunkCount++;
    this.state.accumulatedContent += chunk;

    // 记录数据块
    logger.stream.chunk(this.state.streamSessionId, chunk, this.requestId);

    // 定期记录进度
    if (this.state.chunkCount % 10 === 0) {
      logger.llm.info(`接收${this.operation}数据块`, {
        requestId: this.requestId,
        chunkCount: this.state.chunkCount,
        contentLength: this.state.accumulatedContent.length,
      });
    }

    // 尝试提取和验证JSON
    return this.tryExtractAndValidate();
  }

  /**
   * 尝试提取和验证JSON
   * @returns 是否已完成处理
   */
  private tryExtractAndValidate(): boolean {
    const { extractJSON, validateJSON, parsePartial, onProgress } =
      this.options;
    const { json, isComplete } = extractJSON(this.state.accumulatedContent);

    if (json) {
      // 如果JSON完整，验证并解析
      if (isComplete) {
        logger.llm.info(`检测到完整JSON，开始验证`, {
          requestId: this.requestId,
        });
        const validation = validateJSON(json);
        if (validation.isValid && validation.data) {
          this.state.finalResult = validation.data;
          logger.llm.success(`流式${this.operation}完成`, {
            requestId: this.requestId,
            totalChunks: this.state.chunkCount,
          });
          onProgress(this.state.finalResult, 100);
          return true;
        } else {
          logger.llm.warning(`JSON验证失败，继续接收数据`, {
            requestId: this.requestId,
            error: validation.error,
          });
        }
      }

      // 尝试解析部分JSON以提供实时预览
      if (parsePartial) {
        try {
          const partialResult = parsePartial(json);
          if (partialResult) {
            logger.llm.info(`解析到部分${this.operation}内容`, {
              requestId: this.requestId,
            });
          }
          onProgress(partialResult, 50);
        } catch {
          // 部分解析失败，只传递进度
          onProgress(undefined, 25);
        }
      } else {
        onProgress(undefined, 50);
      }
    } else {
      onProgress(undefined, 10);
    }

    return false;
  }

  /**
   * 最终处理，尝试解析剩余内容
   * @returns 最终结果
   */
  finalize(): T {
    if (!this.state.finalResult) {
      logger.llm.warning(
        `流式${this.operation}结束但未获得完整结果，尝试最终解析`,
        {
          requestId: this.requestId,
        }
      );

      const { json } = this.options.extractJSON(this.state.accumulatedContent);
      if (json) {
        const validation = this.options.validateJSON(json);
        if (validation.isValid && validation.data) {
          this.state.finalResult = validation.data;
          logger.llm.success(`最终${this.operation}解析成功`, {
            requestId: this.requestId,
          });
        }
      }
    }

    if (!this.state.finalResult) {
      logger.llm.error(`无法从LLM响应中提取有效的${this.operation}JSON`, {
        requestId: this.requestId,
        contentLength: this.state.accumulatedContent.length,
      });
      throw new Error(`无法从LLM响应中提取有效的${this.operation}JSON`);
    }

    return this.state.finalResult;
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    logger.stream.end(this.state.streamSessionId);
  }

  /**
   * 处理错误
   * @param error 错误对象
   */
  handleError(error: unknown): never {
    this.cleanup();
    logger.llm.error(`流式${this.operation}失败`, {
      requestId: this.requestId,
      error: error instanceof Error ? error.message : '未知错误',
      chunkCount: this.state.chunkCount,
    });
    return handleLLMError(error, this.requestId, `流式${this.operation}`);
  }
}

/**
 * 执行流式LLM请求
 * @param llmClient LLM客户端实例
 * @param messages 消息数组
 * @param requestId 请求ID
 * @param operation 操作名称
 * @param options 流式请求选项
 * @returns 解析后的结果
 */
export async function executeStreamLLMRequest<T>(
  llmClient: LLMClient,
  messages: Message[],
  requestId: string,
  operation: string,
  options: StreamRequestOptions<T>
): Promise<T> {
  const {
    temperature = DEFAULT_LLM_CONFIG.temperature,
    maxTokens = DEFAULT_LLM_CONFIG.maxTokens,
  } = options;
  const processor = new StreamProcessor(requestId, operation, options);

  try {
    for await (const chunk of llmClient.chatStream({
      messages,
      temperature,
      max_tokens: maxTokens,
    })) {
      if (processor.processChunk(chunk)) {
        break;
      }
    }

    const result = processor.finalize();
    processor.cleanup();
    return result;
  } catch (error) {
    processor.handleError(error);
    // handleError throws, so this line is never reached
    throw error;
  }
}
