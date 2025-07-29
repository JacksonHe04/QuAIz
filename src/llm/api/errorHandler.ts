/**
 * 错误处理器
 * 专门处理LLM API请求的错误处理逻辑
 */

import type { LLMError } from './config';
import type { RequestLogger } from './requestLogger';

/**
 * 错误处理器类
 */
export class ErrorHandler {
  private logger: RequestLogger;

  constructor(logger: RequestLogger) {
    this.logger = logger;
  }

  /**
   * 处理API错误响应
   */
  async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `API请求失败: ${response.status} ${response.statusText}`;

    try {
      const errorData: LLMError = await response.json();
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch {
      // 如果无法解析错误响应，使用默认错误消息
    }

    this.logger.logApiError(response.status, response.statusText);
    throw new Error(errorMessage);
  }

  /**
   * 处理配置验证错误
   */
  handleConfigError(): never {
    const error = 'LLM API配置不完整，请检查apiKey、baseUrl和model配置';
    this.logger.logConfigError(error);
    throw new Error(error);
  }

  /**
   * 处理响应格式错误
   */
  handleResponseFormatError(data: unknown): never {
    const error = 'API响应格式错误：缺少choices字段';
    this.logger.logParseError(error, data);
    throw new Error(error);
  }

  /**
   * 处理流式响应初始化错误
   */
  handleStreamInitError(): never {
    const error = '无法获取响应流';
    this.logger.logError(error);
    throw new Error(error);
  }

  /**
   * 处理通用错误
   */
  handleGenericError(error: unknown, defaultMessage: string): never {
    this.logger.logError(
      error instanceof Error ? error.message : String(error)
    );

    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultMessage);
  }
}
