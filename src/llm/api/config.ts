/**
 * LLM API配置文件
 * 管理大模型API的基础配置信息
 */

export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
  stream: boolean;
}

/**
 * 默认LLM配置
 */
export const DEFAULT_LLM_CONFIG: LLMConfig = {
  apiKey: import.meta.env.VITE_LLM_API_KEY || '',
  baseUrl:
    import.meta.env.VITE_LLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',
  model: import.meta.env.VITE_LLM_MODEL || 'glm-4-flash-250414',
  maxTokens: Number(import.meta.env.VITE_LLM_MAX_TOKENS) || 4000,
  temperature: Number(import.meta.env.VITE_LLM_TEMPERATURE) || 0.7,
  stream: true,
};

/**
 * 支持的LLM提供商配置
 */
export const LLM_PROVIDERS = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-sonnet', 'claude-3-opus'],
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-coder'],
  },
} as const;

/**
 * API响应接口定义
 */
export interface LLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

/**
 * 流式响应接口定义
 */
export interface LLMStreamResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason?: string;
  }[];
}

/**
 * API错误接口定义
 */
export interface LLMError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}
