/**
 * 流式处理服务模块
 * 专门处理 LLM 流式请求的通用逻辑
 */

import type { LLMClient, Message } from '../api/client';
import { logger } from '@/stores/useLogStore';
import { handleLLMError } from './errorUtils';
import type { JSONExtractionResult } from './jsonUtils';

/**
 * 流式处理进度回调类型
 */
export type ProgressCallback<T> = (partialData: T | undefined, progress: number) => void;

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
    temperature = 0.7, 
    maxTokens = 4000, 
    extractJSON, 
    validateJSON, 
    parsePartial,
    onProgress 
  } = options;
  
  let accumulatedContent = '';
  let finalResult: T | null = null;
  let chunkCount = 0;
  
  try {
    logger.llm.info(`开始流式${operation}请求`, { requestId, messageCount: messages.length });
    
    for await (const chunk of llmClient.chatStream({
      messages,
      temperature,
      max_tokens: maxTokens
    })) {
      chunkCount++;
      accumulatedContent += chunk;
      
      if (chunkCount % 10 === 0) {
        logger.llm.info(`接收${operation}数据块`, { requestId, chunkCount, contentLength: accumulatedContent.length });
      }
      
      // 尝试提取JSON
      const { json, isComplete } = extractJSON(accumulatedContent);
      
      if (json) {
        // 如果JSON完整，验证并解析
        if (isComplete) {
          logger.llm.info(`检测到完整JSON，开始验证`, { requestId });
          const validation = validateJSON(json);
          if (validation.isValid && validation.data) {
            finalResult = validation.data;
            logger.llm.success(`流式${operation}完成`, { requestId, totalChunks: chunkCount });
            onProgress(finalResult, 100);
            break;
          } else {
            logger.llm.warning(`JSON验证失败，继续接收数据`, { requestId, error: validation.error });
          }
        }
        
        // 尝试解析部分JSON以提供实时预览
        if (parsePartial) {
          try {
            const partialResult = parsePartial(json);
            if (partialResult) {
              logger.llm.info(`解析到部分${operation}内容`, { requestId });
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
    }
    
    // 最终尝试解析
    if (!finalResult) {
      logger.llm.warning(`流式${operation}结束但未获得完整结果，尝试最终解析`, { requestId });
      const { json } = extractJSON(accumulatedContent);
      if (json) {
        const validation = validateJSON(json);
        if (validation.isValid && validation.data) {
          finalResult = validation.data;
          logger.llm.success(`最终${operation}解析成功`, { requestId });
        }
      }
    }
    
    if (!finalResult) {
      logger.llm.error(`无法从LLM响应中提取有效的${operation}JSON`, { requestId, contentLength: accumulatedContent.length });
      throw new Error(`无法从LLM响应中提取有效的${operation}JSON`);
    }
    
    return finalResult;
  } catch (error) {
    logger.llm.error(`流式${operation}失败`, { requestId, error: error instanceof Error ? error.message : '未知错误', chunkCount });
    handleLLMError(error, requestId, `流式${operation}`);
  }
}

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
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
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
    return response;
  } catch (error) {
    handleLLMError(error, requestId, operation);
  }
}