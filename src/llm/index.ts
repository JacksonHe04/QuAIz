/**
 * LLM模块入口文件
 * 统一导出所有LLM相关功能
 */

// API相关
export * from './api/config';
export * from './api/client';

// 提示词相关
export * from './prompt/quizGeneration';
export * from './prompt/quizGrading';

// 服务相关
export * from './services/baseService';
export * from './services/quizGenerationService';
export * from './services/quizGradingService';
export * from './services/serviceFactory';
export * from './services/quizService'; // 保持向后兼容

// 便捷导出
export { defaultLLMClient, createLLMClient } from './api/client';
export {
  quizGenerationService,
  quizGradingService,
  createQuizServices,
  getDefaultServices,
  updateDefaultLLMClient,
} from './services/serviceFactory';

/**
 * LLM模块配置检查
 */
export function checkLLMConfig(): {
  isConfigured: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  if (!import.meta.env.VITE_LLM_API_KEY) {
    missingFields.push('VITE_LLM_API_KEY');
  }

  if (!import.meta.env.VITE_LLM_BASE_URL) {
    missingFields.push('VITE_LLM_BASE_URL');
  }

  if (!import.meta.env.VITE_LLM_MODEL) {
    missingFields.push('VITE_LLM_MODEL');
  }

  return {
    isConfigured: missingFields.length === 0,
    missingFields,
  };
}

/**
 * 获取LLM配置状态
 */
export function getLLMConfigStatus(): string {
  const { isConfigured, missingFields } = checkLLMConfig();

  if (isConfigured) {
    return 'LLM配置完整，可以使用真实API';
  }

  return `LLM配置不完整，缺少环境变量: ${missingFields.join(', ')}。当前将使用模拟API。`;
}
