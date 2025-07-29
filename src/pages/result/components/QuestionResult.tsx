import React from 'react';
import type { Question } from '@/types';
import { QuestionRenderer } from '@/components/Question/QuestionRenderer';

interface Props {
  question: Question;
  questionIndex: number;
  score: number;
  feedback: string;
}

/**
 * 题目批改结果组件
 * 显示题目内容、得分和反馈
 */
export const QuestionResult: React.FC<Props> = ({
  question,
  questionIndex,
  score,
  feedback,
}) => {
  const isCorrect = score === 10;
  const isPartial = score > 0 && score < 10;

  return (
    <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
      {/* 题目头部 */}
      <div
        className={`px-6 py-4 border-l-4 ${
          isCorrect
            ? 'border-green-500 bg-green-50'
            : isPartial
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-red-500 bg-red-50'
        }`}
      >
        <div className='flex items-center justify-between'>
          <h3 className='font-medium text-gray-900'>
            第 {questionIndex + 1} 题
          </h3>
          <div className='flex items-center gap-3'>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isCorrect
                  ? 'bg-green-100 text-green-800'
                  : isPartial
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {score} / 10 分
            </span>
            <span
              className={`text-lg ${
                isCorrect
                  ? 'text-green-600'
                  : isPartial
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {isCorrect ? '✓' : isPartial ? '◐' : '✗'}
            </span>
          </div>
        </div>
        {feedback && (
          <p
            className={`mt-2 text-sm ${
              isCorrect
                ? 'text-green-700'
                : isPartial
                  ? 'text-yellow-700'
                  : 'text-red-700'
            }`}
          >
            {feedback}
          </p>
        )}
      </div>

      {/* 题目内容 */}
      <div className='p-6'>
        <QuestionRenderer
          question={question}
          onAnswerChange={() => {}} // 只读模式
          disabled={true}
          showCorrectAnswer={true}
        />
      </div>
    </div>
  );
};
