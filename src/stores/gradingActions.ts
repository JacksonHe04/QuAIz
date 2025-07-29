/**
 * 批改相关的Actions
 * 从useAppStore中提取出来，提高代码可维护性
 */

import type { Quiz, GradingResult } from '@/types';
import { quizGradingService, checkLLMConfig } from '@/llm';
import { mockGradeQuiz } from './mockServices';

/**
 * 批改Actions的类型定义
 */
export interface GradingActions {
  startGrading: (quiz?: Quiz) => Promise<void>;
  setGradingError: (error: string) => void;
  resetGrading: () => void;
}

/**
 * 创建批改相关的Actions
 * @param set Zustand的set函数
 */
export const createGradingActions = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (fn: (state: any) => any) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: () => any
): GradingActions => ({
  /**
   * 开始批改试卷
   * @param quiz 试卷数据（可选，如果不提供则使用当前试卷）
   */
  startGrading: async (quiz?: Quiz) => {
    const currentQuiz = quiz || get().generation.currentQuiz;

    if (!currentQuiz) {
      console.error('没有可批改的试卷');
      return;
    }
    // 设置批改中状态
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      grading: {
        status: 'grading',
        result: null,
        error: null,
        progress: 0,
      },
    }));

    try {
      // 检查LLM配置是否完整
      const { isConfigured } = checkLLMConfig();

      let gradingResult: GradingResult;

      if (isConfigured) {
        // 使用真实LLM API批改试卷
        console.log('使用LLM API批改试卷');
        gradingResult = await quizGradingService.gradeQuiz(currentQuiz);
      } else {
        // 使用模拟API作为备用方案
        console.warn('LLM配置不完整，使用模拟API批改试卷');
        gradingResult = await mockGradeQuiz(currentQuiz);
      }

      // 设置完成状态
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set((state: any) => ({
        ...state,
        grading: {
          status: 'complete',
          result: gradingResult,
          error: null,
          progress: 100,
        },
      }));
    } catch (error) {
      console.error('批改试卷失败:', error);
      const errorMessage =
        error instanceof Error ? error.message : '批改试卷时发生未知错误';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set((state: any) => ({
        ...state,
        grading: {
          ...state.grading,
          status: 'error',
          error: errorMessage,
        },
      }));
    }
  },

  /**
   * 设置批改错误
   * @param error 错误信息
   */
  setGradingError: (error: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      grading: {
        ...state.grading,
        status: 'error',
        error,
      },
    }));
  },

  /**
   * 重置批改状态
   */
  resetGrading: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      grading: {
        status: 'idle',
        result: null,
        error: null,
        progress: 0,
      },
    }));
  },
});

/**
 * 批改相关的工具函数
 */
export const gradingUtils = {
  /**
   * 计算得分率
   * @param result 批改结果
   */
  getScorePercentage: (result: GradingResult): number => {
    if (result.maxScore === 0) return 0;
    return Math.round((result.totalScore / result.maxScore) * 100);
  },

  /**
   * 获取等级评价
   * @param percentage 得分率
   */
  getGradeLevel: (percentage: number): string => {
    if (percentage >= 90) return '优秀';
    if (percentage >= 80) return '良好';
    if (percentage >= 70) return '中等';
    if (percentage >= 60) return '及格';
    return '不及格';
  },

  /**
   * 获取等级颜色
   * @param percentage 得分率
   */
  getGradeColor: (percentage: number): string => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  },

  /**
   * 格式化分数显示
   * @param score 得分
   * @param maxScore 总分
   */
  formatScore: (score: number, maxScore: number): string => {
    return `${score}/${maxScore}`;
  },

  /**
   * 检查是否通过
   * @param result 批改结果
   * @param passingScore 及格分数（默认60%）
   */
  isPassed: (result: GradingResult, passingScore: number = 60): boolean => {
    const percentage = gradingUtils.getScorePercentage(result);
    return percentage >= passingScore;
  },
};
