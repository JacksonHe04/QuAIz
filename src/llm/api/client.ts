/**
 * LLM API客户端
 * 提供与大模型API交互的核心功能
 */

import type { LLMConfig, LLMResponse, LLMStreamResponse, LLMError } from './config';
import { DEFAULT_LLM_CONFIG } from './config';

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
    if (!this.validateConfig()) {
      throw new Error('LLM API配置不完整，请检查apiKey、baseUrl和model配置');
    }

    const requestBody = this.buildRequestBody({ ...request, stream: false });
    
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: requestBody,
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data: LLMResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('API响应格式错误：缺少choices字段');
      }

      return data.choices[0].message.content || '';
    } catch (error) {
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
    if (!this.validateConfig()) {
      throw new Error('LLM API配置不完整，请检查apiKey、baseUrl和model配置');
    }

    const requestBody = this.buildRequestBody({ ...request, stream: true });
    
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: requestBody,
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;
            
            const dataStr = trimmedLine.slice(6);
            if (dataStr === '[DONE]') return;
            
            try {
              const data: LLMStreamResponse = JSON.parse(dataStr);
              const content = data.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (parseError) {
              console.warn('解析流式响应失败:', parseError);
              continue;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
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