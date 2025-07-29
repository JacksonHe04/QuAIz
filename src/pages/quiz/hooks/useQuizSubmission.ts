import { useAppStore } from '@/stores/useAppStore';
import type { Quiz } from '@/types';

/**
 * 答题提交钩子
 * 处理答案更新和试卷提交逻辑
 */
export function useQuizSubmission() {
  const { updateUserAnswer, submitQuiz, startGrading, answering } =
    useAppStore();

  /**
   * 更新用户答案
   * @param questionId 题目ID
   * @param answer 用户答案
   */
  const handleAnswerChange = (questionId: string, answer: unknown) => {
    updateUserAnswer(questionId, answer);
  };

  /**
   * 提交试卷
   * @param quiz 当前试卷
   * @returns 是否成功提交
   */
  const handleSubmitQuiz = async (quiz: Quiz) => {
    // 检查未答题目
    const unansweredQuestions = quiz.questions.filter(q => {
      switch (q.type) {
        case 'single-choice':
          return q.userAnswer === undefined;
        case 'multiple-choice':
          return !q.userAnswer || q.userAnswer.length === 0;
        case 'fill-blank':
          return !q.userAnswer || q.userAnswer.some(answer => !answer?.trim());
        case 'short-answer':
        case 'code-output':
        case 'code-writing':
          return !q.userAnswer?.trim();
        default:
          return true;
      }
    });

    // 如果有未答题目，提示用户确认
    if (unansweredQuestions.length > 0) {
      const confirmSubmit = window.confirm(
        `还有 ${unansweredQuestions.length} 道题未完成，确定要提交吗？`
      );
      if (!confirmSubmit) return false;
    }

    // 提交试卷并开始批改
    await submitQuiz();
    await startGrading();
    return true;
  };

  return {
    handleAnswerChange,
    handleSubmitQuiz,
    isSubmitted: answering.isSubmitted,
  };
}
