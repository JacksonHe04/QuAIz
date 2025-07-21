import { useAppStore } from '@/stores/useAppStore';

/**
 * 题目导航钩子
 * 处理题目切换、上一题/下一题导航等功能
 */
export function useQuizNavigation() {
  const { answering, setCurrentQuestion } = useAppStore();

  /**
   * 切换到上一题
   * @returns 是否成功切换
   */
  const goToPrevQuestion = () => {
    if (answering.currentQuestionIndex > 0) {
      setCurrentQuestion(answering.currentQuestionIndex - 1);
      return true;
    }
    return false;
  };

  /**
   * 切换到下一题
   * @param totalQuestions 总题目数量
   * @returns 是否成功切换
   */
  const goToNextQuestion = (totalQuestions: number) => {
    if (answering.currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestion(answering.currentQuestionIndex + 1);
      return true;
    }
    return false;
  };

  /**
   * 切换到指定题目
   * @param index 题目索引
   */
  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  return {
    currentQuestionIndex: answering.currentQuestionIndex,
    goToPrevQuestion,
    goToNextQuestion,
    goToQuestion
  };
}