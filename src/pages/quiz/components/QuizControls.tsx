import React from 'react';

interface Props {
  currentQuestionIndex: number;
  totalQuestions: number;
  isSubmitted: boolean;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onSubmitQuiz: () => void;
}

/**
 * 答题控制组件
 * 提供上一题、下一题和提交试卷按钮
 */
export const QuizControls: React.FC<Props> = ({
  currentQuestionIndex,
  totalQuestions,
  isSubmitted,
  onPrevQuestion,
  onNextQuestion,
  onSubmitQuiz
}) => {
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        onClick={onPrevQuestion}
        disabled={isFirstQuestion}
        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上一题
      </button>

      <div className="flex gap-3">
        {!isLastQuestion ? (
          <button
            onClick={onNextQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            下一题
          </button>
        ) : (
          <button
            onClick={onSubmitQuiz}
            disabled={isSubmitted}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitted ? '已提交' : '提交试卷'}
          </button>
        )}
      </div>
    </div>
  );
};