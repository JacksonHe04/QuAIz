import React from 'react';
import type { Quiz } from '@/types';

interface Props {
  quiz: Quiz;
  currentQuestionIndex: number;
  answeredCount: number;
  onReset: () => void;
}

/**
 * 答题页面顶部导航栏组件
 * 显示试卷标题、当前题目、已答题数量和重置按钮
 */
export const QuizHeader: React.FC<Props> = ({
  quiz,
  currentQuestionIndex,
  answeredCount,
  onReset,
}) => {
  return (
    <div className='bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-30'>
      <div className='max-w-6xl mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-semibold text-gray-900'>
              {quiz.title}
            </h1>
            <p className='text-sm text-gray-600'>
              第 {currentQuestionIndex + 1} 题 / 共 {quiz.questions.length} 题
            </p>
          </div>

          <div className='flex items-center gap-4'>
            <div className='text-sm text-gray-600'>
              已答题: {answeredCount} / {quiz.questions.length}
            </div>
            <button
              onClick={onReset}
              className='px-3 py-1 text-sm text-gray-600 hover:text-gray-900'
            >
              重新开始
            </button>
          </div>
        </div>

        {/* 进度条 */}
        <div className='mt-3'>
          <div className='bg-gray-200 rounded-full h-2'>
            <div
              className='bg-blue-600 h-2 rounded-full transition-all duration-300'
              style={{
                width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
