/**
 * 基础请求执行器模块
 * 处理非流式LLM请求
 */

import type { LLMClient, Message } from '../../api/client';
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
  const { temperature = 0.7, maxTokens = 4000 } = options;
  
  try {
    logger.llm.info(`发送${operation}请求到LLM`, { requestId, messageCount: messages.length });
    
    const response = await llmClient.chat({
      messages,
      temperature,
      max_tokens: maxTokens
    });
    
    logger.llm.info(`收到LLM响应，开始验证格式`, { requestId });
    return response.content;
  } catch (error) {
    return handleLLMError(error, requestId, operation);
  }
}