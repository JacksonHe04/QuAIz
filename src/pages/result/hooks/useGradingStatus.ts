import { useMemo } from 'react';
import type { GradingResult } from '@/types';

/**
 * 批改状态钩子
 * 处理批改结果的状态和统计信息
 */
export function useGradingStatus(result: GradingResult | null) {
  /**
   * 计算得分百分比
   */
  const scorePercentage = useMemo(() => {
    if (!result) return 0;
    return (result.totalScore / result.maxScore) * 100;
  }, [result]);

  /**
   * 获取得分等级
   */
  const scoreLevel = useMemo(() => {
    if (!result) return '';

    if (scorePercentage >= 90) return '优秀';
    if (scorePercentage >= 80) return '良好';
    if (scorePercentage >= 60) return '及格';
    return '需要改进';
  }, [result, scorePercentage]);

  /**
   * 获取得分颜色
   */
  const scoreColor = useMemo(() => {
    if (!result) return '';

    if (scorePercentage >= 90) return 'text-green-600';
    if (scorePercentage >= 80) return 'text-blue-600';
    if (scorePercentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }, [result, scorePercentage]);

  /**
   * 计算完全正确的题目数量
   */
  const correctCount = useMemo(() => {
    if (!result) return 0;
    return result.results.filter(r => r.score === 10).length;
  }, [result]);

  /**
   * 计算部分正确的题目数量
   */
  const partialCount = useMemo(() => {
    if (!result) return 0;
    return result.results.filter(r => r.score > 0 && r.score < 10).length;
  }, [result]);

  /**
   * 计算错误的题目数量
   */
  const wrongCount = useMemo(() => {
    if (!result) return 0;
    return result.results.filter(r => r.score === 0).length;
  }, [result]);

  return {
    scorePercentage,
    scoreLevel,
    scoreColor,
    correctCount,
    partialCount,
    wrongCount,
  };
}
