import React from 'react';
import type { Quiz } from '@/types';

interface Props {
  quiz: Quiz;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  isQuestionAnswered: (index: number) => boolean;
  showBackground?: boolean;
}

/**
 * 题目导航组件
 * 显示所有题目的导航按钮，并根据答题状态显示不同颜色
 */
export const QuizNavigation: React.FC<Props> = ({
  quiz,
  currentQuestionIndex,
  onQuestionSelect,
  isQuestionAnswered,
  showBackground = false,
}) => {
  return (
    <div className={showBackground ? 'bg-white rounded-lg shadow-sm p-4' : ''}>
      <h3 className='font-medium text-gray-900 mb-3'>题目导航</h3>
      <div className='grid grid-cols-5 lg:grid-cols-4 gap-2'>
        {quiz.questions.map((question, index) => {
          const isAnswered = isQuestionAnswered(index);

          return (
            <button
              key={question.id}
              onClick={() => onQuestionSelect(index)}
              className={`
                w-8 h-8 rounded text-sm font-medium transition-colors
                ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : isAnswered
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
