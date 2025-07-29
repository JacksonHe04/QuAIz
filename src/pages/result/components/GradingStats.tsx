import React from 'react';

interface Props {
  totalQuestions: number;
  correctCount: number;
  partialCount: number;
  wrongCount: number;
}

/**
 * 成绩统计组件
 * 显示总题数、完全正确、部分正确和错误的题目数量
 */
export const GradingStats: React.FC<Props> = ({
  totalQuestions,
  correctCount,
  partialCount,
  wrongCount,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
      <div className='bg-white rounded-lg p-4 text-center shadow-sm'>
        <div className='text-2xl font-bold text-blue-600'>{totalQuestions}</div>
        <div className='text-gray-600'>总题数</div>
      </div>
      <div className='bg-white rounded-lg p-4 text-center shadow-sm'>
        <div className='text-2xl font-bold text-green-600'>{correctCount}</div>
        <div className='text-gray-600'>完全正确</div>
      </div>
      <div className='bg-white rounded-lg p-4 text-center shadow-sm'>
        <div className='text-2xl font-bold text-yellow-600'>{partialCount}</div>
        <div className='text-gray-600'>部分正确</div>
      </div>
      <div className='bg-white rounded-lg p-4 text-center shadow-sm'>
        <div className='text-2xl font-bold text-red-600'>{wrongCount}</div>
        <div className='text-gray-600'>错误</div>
      </div>
    </div>
  );
};
