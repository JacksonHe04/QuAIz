/**
 * LLM API 客户端模块
 * 负责与大模型API进行通信，支持普通和流式请求
 */

import type { LLMConfig, LLMResponse } from './config';
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
 * LLM请求接口
 */
export interface LLMRequest {
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  model?: string;
}

/**
 * 简化的响应接口
 */
export interface SimpleLLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * LLM API 客户端
 * 负责与大模型API进行通信
 */
export class LLMClient {
  private config: LLMConfig;

  constructor(config?: Partial<LLMConfig>) {
    this.config = { ...DEFAULT_LLM_CONFIG, ...config };
  }

  /**
   * 构建请求头
   */
  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.apiKey}`,
    };
  }

  /**
   * 构建请求体
   */
  private buildRequestBody(
    messages: Message[],
    options: {
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    }
  ): string {
    return JSON.stringify({
      model: this.config.model,
      messages,
      temperature: options.temperature ?? this.config.temperature,
      max_tokens: options.max_tokens ?? this.config.maxTokens,
      stream: options.stream ?? true,
    });
  }

  /**
   * 处理错误响应
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    const errorText = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${response.statusText}. ${errorText}`
    );
  }

  /**
   * 验证配置是否完整
   */
  private validateConfig(): boolean {
    return !!(this.config.apiKey && this.config.baseUrl && this.config.model);
  }

  /**
   * 获取当前配置信息
   */
  getConfig(): LLMConfig {
    return { ...this.config };
  }

  /**
   * 普通聊天请求
   */
  async chat(options: {
    messages: Message[];
    temperature?: number;
    max_tokens?: number;
  }): Promise<SimpleLLMResponse> {
    const requestId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 构建实际请求参数
    const requestParams = {
      model: this.config.model,
      messages: options.messages,
      temperature: options.temperature ?? this.config.temperature,
      max_tokens: options.max_tokens ?? this.config.maxTokens,
      stream: false,
    };

    try {
      if (!this.validateConfig()) {
        const error = 'LLM API配置不完整，请检查apiKey、baseUrl和model配置';
        logger.llm.error('配置验证失败', { requestId, error });
        throw new Error(error);
      }

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: this.buildRequestBody(requestParams.messages, {
          temperature: requestParams.temperature,
          max_tokens: requestParams.max_tokens,
          stream: requestParams.stream,
        }),
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data: LLMResponse = await response.json();

      if (
        !data.choices ||
        !Array.isArray(data.choices) ||
        data.choices.length === 0
      ) {
        throw new Error('API响应格式错误：缺少choices字段');
      }

      const result: SimpleLLMResponse = {
        content: data.choices[0].message.content,
      };

      logger.llm.success('普通聊天请求成功', {
        requestId,
        contentLength: result.content.length,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      logger.llm.error('普通聊天请求失败', { requestId, error: errorMessage });
      throw new Error(`聊天请求失败: ${errorMessage}`);
    }
  }

  /**
   * 流式聊天请求
   */
  async *chatStream(options: {
    messages: Message[];
    temperature?: number;
    max_tokens?: number;
  }): AsyncGenerator<string, void, unknown> {
    const requestId = `chat-stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 构建实际请求参数
    const requestParams = {
      model: this.config.model,
      messages: options.messages,
      temperature: options.temperature ?? this.config.temperature,
      max_tokens: options.max_tokens ?? this.config.maxTokens,
      stream: true,
    };

    try {
      if (!this.validateConfig()) {
        const error = 'LLM API配置不完整，请检查apiKey、baseUrl和model配置';
        logger.llm.error('配置验证失败', { requestId, error });
        throw new Error(error);
      }

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: this.buildRequestBody(requestParams.messages, {
          temperature: requestParams.temperature,
          max_tokens: requestParams.max_tokens,
          stream: requestParams.stream,
        }),
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      if (!response.body) {
        throw new Error('响应体为空');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let totalChunks = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine === 'data: [DONE]') {
              continue;
            }

            if (trimmedLine.startsWith('data: ')) {
              try {
                const jsonStr = trimmedLine.slice(6);
                const data = JSON.parse(jsonStr);

                if (
                  data.choices &&
                  data.choices[0] &&
                  data.choices[0].delta &&
                  data.choices[0].delta.content
                ) {
                  const chunk = data.choices[0].delta.content;
                  totalChunks++;
                  yield chunk;
                }
              } catch (parseError) {
                logger.llm.error('解析流式数据失败', {
                  requestId,
                  line: trimmedLine,
                  error: parseError,
                });
              }
            }
          }
        }

        logger.llm.success('流式聊天请求完成', { requestId, totalChunks });
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      logger.llm.error('流式聊天请求失败', { requestId, error: errorMessage });
      throw new Error(`流式聊天请求失败: ${errorMessage}`);
    }
  }
}

/**
 * 默认LLM客户端实例
 */
export const defaultLLMClient = new LLMClient();

/**
 * 创建LLM客户端实例
 * @param config 配置选项
 * @returns LLM客户端实例
 */
export function createLLMClient(config?: Partial<LLMConfig>): LLMClient {
  return new LLMClient(config);
}
