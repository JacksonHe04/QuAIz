/**
 * 文本流式处理器模块
 * 专门处理纯文本流式请求
 */

import type { LLMClient, Message } from '../../api/client';
import { DEFAULT_LLM_CONFIG } from '../../api/config';
import { logger } from '@/stores/useLogStore';
import { handleLLMError } from '../errorUtils';
import type { TextStreamOptions } from './types';

/**
 * 执行纯文本流式LLM请求
 * @param llmClient LLM客户端实例
 * @param messages 消息数组
 * @param requestId 请求ID
 * @param operation 操作名称
 * @param options 请求选项
 * @returns LLM响应内容
 */
export async function executeTextStreamLLMRequest(
  llmClient: LLMClient,
  messages: Message[],
  requestId: string,
  operation: string,
  options: TextStreamOptions = {}
): Promise<string> {
  const {
    temperature = DEFAULT_LLM_CONFIG.temperature,
    maxTokens = DEFAULT_LLM_CONFIG.maxTokens,
    onProgress,
  } = options;

  let accumulatedContent = '';
  let chunkCount = 0;

  // 开始流式会话记录
  const streamSessionId = logger.stream.start(requestId, operation);

  try {
    for await (const chunk of llmClient.chatStream({
      messages,
      temperature,
      max_tokens: maxTokens,
    })) {
      chunkCount++;
      accumulatedContent += chunk;

      // 将每个chunk添加到流式会话中
      logger.stream.chunk(streamSessionId, chunk, requestId);

      // 调用进度回调
      if (onProgress) {
        onProgress(accumulatedContent, chunk);
      }

      if (chunkCount % 10 === 0) {
        logger.llm.info(`接收${operation}数据块`, {
          requestId,
          chunkCount,
          contentLength: accumulatedContent.length,
        });
      }
    }

    // 成功完成，结束流式会话
    logger.stream.end(streamSessionId);
    logger.llm.success(`流式${operation}完成`, {
      requestId,
      totalChunks: chunkCount,
      contentLength: accumulatedContent.length,
    });

    return accumulatedContent;
  } catch (error) {
    // 发生错误，结束流式会话
    logger.stream.end(streamSessionId);
    logger.llm.error(`流式${operation}失败`, {
      requestId,
      error: error instanceof Error ? error.message : '未知错误',
      chunkCount,
    });
    return handleLLMError(error, requestId, `流式${operation}`);
  }
}
