/**
 * 答题相关的Actions
 * 从useAppStore中提取出来，提高代码可维护性
 */

import type { Quiz, Question } from '@/types';

/**
 * 答题Actions的类型定义
 */
export interface AnsweringActions {
  setCurrentQuestionIndex: (index: number) => void;
  setCurrentQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  updateUserAnswer: (questionId: string, answer: unknown) => void;
  submitAnswers: () => void;
  submitQuiz: () => Promise<void>;
  resetAnswering: () => void;
}

/**
 * 创建答题相关的Actions
 * @param set Zustand的set函数
 * @param get Zustand的get函数
 */
export const createAnsweringActions = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (fn: (state: any) => any) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: () => any
): AnsweringActions => ({
  /**
   * 设置当前题目索引
   * @param index 题目索引
   */
  setCurrentQuestionIndex: (index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      answering: {
        ...state.answering,
        currentQuestionIndex: index,
      },
    }));
  },

  /**
   * 设置当前题目（兼容旧API）
   * @param index 题目索引
   */
  setCurrentQuestion: (index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      answering: {
        ...state.answering,
        currentQuestionIndex: index,
      },
    }));
  },

  /**
   * 下一题
   */
  nextQuestion: () => {
    const state = get();
    const currentQuiz = state.generation.currentQuiz;

    if (!currentQuiz) return;

    const currentIndex = state.answering.currentQuestionIndex;
    const nextIndex = Math.min(
      currentIndex + 1,
      currentQuiz.questions.length - 1
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      answering: {
        ...state.answering,
        currentQuestionIndex: nextIndex,
      },
    }));
  },

  /**
   * 上一题
   */
  previousQuestion: () => {
    const state = get();
    const currentIndex = state.answering.currentQuestionIndex;
    const prevIndex = Math.max(currentIndex - 1, 0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      answering: {
        ...state.answering,
        currentQuestionIndex: prevIndex,
      },
    }));
  },

  /**
   * 更新用户答案
   * @param questionId 题目ID
   * @param answer 用户答案
   */
  updateUserAnswer: (questionId: string, answer: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => {
      const currentQuiz = state.generation.currentQuiz;
      if (!currentQuiz) return state;

      const updatedQuestions = currentQuiz.questions.map((q: Question) => {
        if (q.id === questionId) {
          // 使用类型断言来处理复杂的联合类型
          return { ...q, userAnswer: answer } as Question;
        }
        return q;
      });

      return {
        ...state,
        generation: {
          ...state.generation,
          currentQuiz: {
            ...currentQuiz,
            questions: updatedQuestions,
          },
        },
      };
    });
  },

  /**
   * 提交答案
   */
  submitAnswers: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      answering: {
        ...state.answering,
        isSubmitted: true,
      },
    }));
  },

  /**
   * 提交试卷（兼容旧API）
   */
  submitQuiz: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      answering: {
        ...state.answering,
        isSubmitted: true,
      },
    }));
  },

  /**
   * 重置答题状态
   */
  resetAnswering: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set((state: any) => ({
      ...state,
      answering: {
        currentQuestionIndex: 0,
        isSubmitted: false,
      },
    }));
  },
});

/**
 * 答题相关的工具函数
 */
export const answeringUtils = {
  /**
   * 检查是否所有题目都已回答
   * @param quiz 试卷
   */
  isAllQuestionsAnswered: (quiz: Quiz): boolean => {
    return quiz.questions.every(question => {
      return question.userAnswer !== undefined && question.userAnswer !== null;
    });
  },

  /**
   * 获取已回答题目数量
   * @param quiz 试卷
   */
  getAnsweredQuestionCount: (quiz: Quiz): number => {
    return quiz.questions.filter(question => {
      return question.userAnswer !== undefined && question.userAnswer !== null;
    }).length;
  },

  /**
   * 获取答题进度百分比
   * @param quiz 试卷
   */
  getAnsweringProgress: (quiz: Quiz): number => {
    const answeredCount = answeringUtils.getAnsweredQuestionCount(quiz);
    const totalCount = quiz.questions.length;
    return totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  },

  /**
   * 检查当前题目是否已回答
   * @param question 题目
   */
  isQuestionAnswered: (question: Question): boolean => {
    return question.userAnswer !== undefined && question.userAnswer !== null;
  },
};
