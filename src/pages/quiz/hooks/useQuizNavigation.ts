import { useAppStore } from '@/stores/useAppStore';

/**
 * 题目导航钩子
 * 处理题目切换功能
 */
export function useQuizNavigation() {
  const { answering, setCurrentQuestion } = useAppStore();

  /**
   * 切换到指定题目
   * @param index 题目索引
   */
  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  return {
    currentQuestionIndex: answering.currentQuestionIndex,
    goToQuestion,
  };
}
