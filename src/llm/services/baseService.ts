/**
 * LLM服务基类
 * 提供通用的LLM服务功能，包括错误处理、日志记录、流式处理等
 */

import { LLMClient } from '../api/client';
import { logger } from '@/stores/useLogStore';
import type { Message } from '../api/client';

/**
 * 流式处理进度回调类型
 */
export type ProgressCallback<T> = (partialData: T | undefined, progress: number) => void;

/**
 * JSON提取结果接口
 */
export interface JSONExtractionResult {
  json: string | null;
  isComplete: boolean;
}

/**
 * JSON验证结果接口
 */
export interface ValidationResult<T> {
  isValid: boolean;
  error?: string;
  data?: T;
}

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
    return `${prefix}-${Date.now()}`;
  }

  /**
   * 处理LLM错误
   */
  protected handleLLMError(error: unknown, requestId: string, operation: string): never {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    logger.llm.error(`${operation}失败`, { requestId, error: errorMessage });
    
    if (error instanceof Error) {
      throw new Error(`${operation}失败: ${error.message}`);
    }
    throw new Error(`${operation}失败: 未知错误`);
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
    const { temperature = 0.7, maxTokens = 4000 } = options;
    
    try {
      logger.llm.info(`发送${operation}请求到LLM`, { requestId, messageCount: messages.length });
      
      const response = await this.llmClient.chat({
        messages,
        temperature,
        max_tokens: maxTokens
      });
      
      logger.llm.info(`收到LLM响应，开始验证格式`, { requestId });
      return response;
    } catch (error) {
      this.handleLLMError(error, requestId, operation);
    }
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
      extractJSON: (content: string) => JSONExtractionResult;
      validateJSON: (json: string) => ValidationResult<T>;
      parsePartial?: (json: string) => T | undefined;
      onProgress: ProgressCallback<T>;
    }
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
      
      for await (const chunk of this.llmClient.chatStream({
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
      this.handleLLMError(error, requestId, `流式${operation}`);
    }
  }

  /**
   * 通用JSON修复工具
   */
  protected fixIncompleteJSON(jsonStr: string, arrayField?: string): string {
    let fixedJson = jsonStr;
    
    // 移除末尾逗号
    fixedJson = fixedJson.replace(/,\s*$/, '');
    
    // 如果指定了数组字段，尝试闭合数组
    if (arrayField && fixedJson.includes(`"${arrayField}": [`)) {
      if (!fixedJson.includes(']}')) {
        // 简单的数组闭合逻辑
        const arrayStart = fixedJson.indexOf(`"${arrayField}": [`);
        const afterArray = fixedJson.slice(arrayStart + arrayField.length + 5);
        
        // 计算未闭合的括号
        let bracketCount = 1;
        let lastValidPos = arrayStart + arrayField.length + 5;
        
        for (let i = 0; i < afterArray.length; i++) {
          const char = afterArray[i];
          if (char === '[') bracketCount++;
          else if (char === ']') {
            bracketCount--;
            if (bracketCount === 0) {
              lastValidPos = arrayStart + arrayField.length + 5 + i;
              break;
            }
          }
        }
        
        if (bracketCount > 0) {
          fixedJson = fixedJson.slice(0, lastValidPos + 1) + ']}';
        }
      }
    }
    
    return fixedJson;
  }
}