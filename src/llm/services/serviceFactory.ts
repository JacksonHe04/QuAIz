/**
 * LLM服务工厂
 * 统一管理和创建各种LLM服务实例
 */

import type { LLMClient } from '../api/client';
import {
  QuizGenerationService,
  createQuizGenerationService,
} from './quizGenerationService';
import {
  QuizGradingService,
  createQuizGradingService,
} from './quizGradingService';

/**
 * 服务集合接口
 */
export interface QuizServices {
  generation: QuizGenerationService;
  grading: QuizGradingService;
}

/**
 * 创建完整的试卷服务集合
 */
export function createQuizServices(llmClient?: LLMClient): QuizServices {
  return {
    generation: createQuizGenerationService(llmClient),
    grading: createQuizGradingService(llmClient),
  };
}

/**
 * 默认服务实例（单例模式）
 */
class ServiceManager {
  private static instance: ServiceManager;
  private services: QuizServices;

  private constructor() {
    this.services = createQuizServices();
  }

  /**
   * 获取服务管理器实例
   */
  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  /**
   * 获取服务集合
   */
  getServices(): QuizServices {
    return this.services;
  }

  /**
   * 更新LLM客户端
   */
  updateLLMClient(llmClient: LLMClient): void {
    this.services = createQuizServices(llmClient);
  }
}

/**
 * 获取默认服务实例
 */
export function getDefaultServices(): QuizServices {
  return ServiceManager.getInstance().getServices();
}

/**
 * 更新默认服务的LLM客户端
 */
export function updateDefaultLLMClient(llmClient: LLMClient): void {
  ServiceManager.getInstance().updateLLMClient(llmClient);
}

// 导出默认服务实例（保持向后兼容）
const defaultServices = getDefaultServices();
export const quizGenerationService = defaultServices.generation;
export const quizGradingService = defaultServices.grading;
