/**
 * LLM API客户端
 * 提供与大模型API交互的核心功能
 */

import type { LLMConfig, LLMResponse, LLMStreamResponse, LLMError } from './config';
import { DEFAULT_LLM_CONFIG } from './config';
import { logger } from '@/stores/useLogStore';

/**
 * 消息接口定义
 */
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * API请求参数接口
 */
export interface LLMRequest {
  messages: Message[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

/**
 * LLM API客户端类
 */
export class LLMClient {
  private config: LLMConfig;

  constructor(config?: Partial<LLMConfig>) {
    this.config = { ...DEFAULT_LLM_CONFIG, ...config };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<LLMConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 获取当前配置
   */
  getConfig(): LLMConfig {
    return { ...this.config };
  }

  /**
   * 验证API配置
   */
  validateConfig(): boolean {
    return Boolean(this.config.apiKey && this.config.baseUrl && this.config.model);
  }

  /**
   * 构建请求头
   */
  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };
  }

  /**
   * 构建请求体
   */
  private buildRequestBody(request: LLMRequest): string {
    const body = {
      model: request.model || this.config.model,
      messages: request.messages,
      max_tokens: request.max_tokens || this.config.maxTokens,
      temperature: request.temperature ?? this.config.temperature,
      stream: request.stream ?? this.config.stream,
    };
    return JSON.stringify(body);
  }

  /**
   * 处理API错误响应
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `API请求失败: ${response.status} ${response.statusText}`;
    
    try {
      const errorData: LLMError = await response.json();
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch {
      // 如果无法解析错误响应，使用默认错误消息
    }
    
    throw new Error(errorMessage);
  }

  /**
   * 发送普通API请求（非流式）
   */
  async chat(request: LLMRequest): Promise<string> {
    const requestId = Math.random().toString(36).substr(2, 9);
    
    logger.info(`开始发送API请求 [${requestId}]`, 'llm', {
      model: request.model || this.config.model,
      messageCount: request.messages.length,
      maxTokens: request.max_tokens || this.config.maxTokens,
      temperature: request.temperature ?? this.config.temperature
    });

    if (!this.validateConfig()) {
      const error = 'LLM API配置不完整，请检查apiKey、baseUrl和model配置';
      logger.error(`配置验证失败 [${requestId}]`, 'llm', { error });
      throw new Error(error);
    }

    const requestBody = this.buildRequestBody({ ...request, stream: false });
    
    try {
      logger.info(`发送HTTP请求 [${requestId}]`, 'api', {
        url: `${this.config.baseUrl}/chat/completions`,
        method: 'POST'
      });

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: requestBody,
      });

      logger.info(`收到HTTP响应 [${requestId}]`, 'api', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        logger.error(`API请求失败 [${requestId}]`, 'api', {
          status: response.status,
          statusText: response.statusText
        });
        await this.handleErrorResponse(response);
      }

      const data: LLMResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        const error = 'API响应格式错误：缺少choices字段';
        logger.error(`响应解析失败 [${requestId}]`, 'llm', { error, response: data });
        throw new Error(error);
      }

      const content = data.choices[0].message.content || '';
      logger.success(`API请求完成 [${requestId}]`, 'llm', {
        responseLength: content.length
      });

      return content;
    } catch (error) {
      logger.error(`API请求异常 [${requestId}]`, 'llm', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('API请求失败：网络错误或未知错误');
    }
  }

  /**
   * 发送流式API请求
   */
  async *chatStream(request: LLMRequest): AsyncGenerator<string, void, unknown> {
    const requestId = Math.random().toString(36).substr(2, 9);
    let totalChunks = 0;
    let totalLength = 0;
    
    logger.info(`开始发送流式API请求 [${requestId}]`, 'llm', {
      model: request.model || this.config.model,
      messageCount: request.messages.length,
      maxTokens: request.max_tokens || this.config.maxTokens,
      temperature: request.temperature ?? this.config.temperature
    });

    if (!this.validateConfig()) {
      const error = 'LLM API配置不完整，请检查apiKey、baseUrl和model配置';
      logger.error(`配置验证失败 [${requestId}]`, 'llm', { error });
      throw new Error(error);
    }

    const requestBody = this.buildRequestBody({ ...request, stream: true });
    
    try {
      logger.info(`发送流式HTTP请求 [${requestId}]`, 'api', {
        url: `${this.config.baseUrl}/chat/completions`,
        method: 'POST'
      });

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: requestBody,
      });

      logger.info(`收到流式HTTP响应 [${requestId}]`, 'api', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        logger.error(`流式API请求失败 [${requestId}]`, 'api', {
          status: response.status,
          statusText: response.statusText
        });
        await this.handleErrorResponse(response);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        const error = '无法获取响应流';
        logger.error(`流式响应初始化失败 [${requestId}]`, 'llm', { error });
        throw new Error(error);
      }

      logger.info(`开始接收流式数据 [${requestId}]`, 'llm');
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            logger.success(`流式请求完成 [${requestId}]`, 'llm', {
              totalChunks,
              totalLength,
              avgChunkSize: totalChunks > 0 ? Math.round(totalLength / totalChunks) : 0
            });
            break;
          }
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;
            
            const dataStr = trimmedLine.slice(6);
            if (dataStr === '[DONE]') {
              logger.info(`收到流式结束标记 [${requestId}]`, 'llm');
              return;
            }
            
            try {
              const data: LLMStreamResponse = JSON.parse(dataStr);
              const content = data.choices?.[0]?.delta?.content;
              if (content) {
                totalChunks++;
                totalLength += content.length;
                
                if (totalChunks % 10 === 0) {
                  logger.info(`流式数据进度 [${requestId}]`, 'llm', {
                    chunks: totalChunks,
                    length: totalLength
                  });
                }
                
                yield content;
              }
            } catch (parseError) {
              logger.warning(`解析流式响应失败 [${requestId}]`, 'llm', {
                error: parseError instanceof Error ? parseError.message : String(parseError),
                dataStr: dataStr.substring(0, 100)
              });
              continue;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      logger.error(`流式API请求异常 [${requestId}]`, 'llm', {
        error: error instanceof Error ? error.message : String(error),
        totalChunks,
        totalLength
      });
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('流式API请求失败：网络错误或未知错误');
    }
  }
}

/**
 * 默认LLM客户端实例
 */
export const defaultLLMClient = new LLMClient();

/**
 * 创建新的LLM客户端实例
 */
export function createLLMClient(config?: Partial<LLMConfig>): LLMClient {
  return new LLMClient(config);
}