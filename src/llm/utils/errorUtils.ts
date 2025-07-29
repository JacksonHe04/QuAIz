/**
 * 错误处理工具模块
 * 提供统一的错误处理和日志记录功能
 */

import { logger } from '@/stores/useLogStore';

/**
 * LLM 操作错误类
 */
export class LLMOperationError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly requestId: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'LLMOperationError';
  }
}

/**
 * 处理 LLM 操作错误
 * @param error 原始错误
 * @param requestId 请求ID
 * @param operation 操作名称
 * @returns 永不返回，总是抛出错误
 */
export function handleLLMError(
  error: unknown,
  requestId: string,
  operation: string
): never {
  const errorMessage = error instanceof Error ? error.message : '未知错误';
  logger.llm.error(`${operation}失败`, { requestId, error: errorMessage });

  if (error instanceof Error) {
    throw new LLMOperationError(
      `${operation}失败: ${error.message}`,
      operation,
      requestId,
      error
    );
  }
  throw new LLMOperationError(
    `${operation}失败: 未知错误`,
    operation,
    requestId,
    error
  );
}

/**
 * 生成请求ID
 * @param prefix 前缀
 * @returns 唯一的请求ID
 */
export function generateRequestId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 安全执行异步操作，统一错误处理
 * @param operation 操作函数
 * @param requestId 请求ID
 * @param operationName 操作名称
 * @returns 操作结果
 */
export async function safeExecute<T>(
  operation: () => Promise<T>,
  requestId: string,
  operationName: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    handleLLMError(error, requestId, operationName);
  }
}

/**
 * 验证配置完整性
 * @param config 配置对象
 * @param requiredFields 必需字段
 * @param configName 配置名称
 * @throws 配置不完整时抛出错误
 */
export function validateConfig(
  config: Record<string, unknown>,
  requiredFields: string[],
  configName: string
): void {
  const missingFields = requiredFields.filter(
    field => !config[field] || config[field] === ''
  );

  if (missingFields.length > 0) {
    throw new Error(
      `${configName}配置不完整，缺少字段: ${missingFields.join(', ')}`
    );
  }
}
