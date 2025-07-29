import { useMemo } from 'react';
import type { Quiz } from '@/types';

/**
 * 答题状态钩子
 * 处理答题进度、已答题数量等状态
 */
export function useQuizStatus(quiz: Quiz | null) {
  /**
   * 计算已答题数量
   */
  const answeredCount = useMemo(() => {
    if (!quiz) return 0;

    return quiz.questions.filter(q => {
      switch (q.type) {
        case 'single-choice':
          return q.userAnswer !== undefined;
        case 'multiple-choice':
          return q.userAnswer && q.userAnswer.length > 0;
        case 'fill-blank':
          return q.userAnswer && q.userAnswer.some(answer => answer?.trim());
        case 'short-answer':
        case 'code-output':
        case 'code-writing':
          return q.userAnswer?.trim();
        default:
          return false;
      }
    }).length;
  }, [quiz]);

  /**
   * 检查指定题目是否已答
   */
  const isQuestionAnswered = (questionIndex: number): boolean => {
    if (!quiz) return false;

    const question = quiz.questions[questionIndex];
    if (!question) return false;

    switch (question.type) {
      case 'single-choice':
        return question.userAnswer !== undefined;
      case 'multiple-choice':
        return (
          question.userAnswer !== undefined && question.userAnswer.length > 0
        );
      case 'fill-blank':
        return (
          question.userAnswer !== undefined &&
          question.userAnswer.some(answer => answer?.trim() !== '')
        );
      case 'short-answer':
      case 'code-output':
      case 'code-writing':
        return (
          question.userAnswer !== undefined && question.userAnswer.trim() !== ''
        );
      default:
        return false;
    }
  };

  return {
    answeredCount,
    isQuestionAnswered,
  };
}
