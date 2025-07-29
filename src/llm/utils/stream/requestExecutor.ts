/**
 * 基础请求执行器模块
 * 处理非流式LLM请求
 */

import type { LLMClient, Message } from '../../api/client';
import { DEFAULT_LLM_CONFIG } from '../../api/config';
import { logger } from '@/stores/useLogStore';
import { handleLLMError } from '../errorUtils';
import type { BaseRequestOptions } from './types';

/**
 * 执行非流式LLM请求
 * @param llmClient LLM客户端实例
 * @param messages 消息数组
 * @param requestId 请求ID
 * @param operation 操作名称
 * @param options 请求选项
 * @returns LLM响应内容
 */
export async function executeLLMRequest(
  llmClient: LLMClient,
  messages: Message[],
  requestId: string,
  operation: string,
  options: BaseRequestOptions = {}
): Promise<string> {
  const {
    temperature = DEFAULT_LLM_CONFIG.temperature,
    maxTokens = DEFAULT_LLM_CONFIG.maxTokens,
  } = options;

  try {
    const response = await llmClient.chat({
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    logger.llm.info(`收到LLM响应，开始验证格式`, { requestId });
    return response.content;
  } catch (error) {
    return handleLLMError(error, requestId, operation);
  }
}
