import React from 'react';
import type { GradingResult } from '@/types';

interface Props {
  result: GradingResult;
  scorePercentage: number;
  scoreLevel: string;
  scoreColor: string;
}

/**
 * 批改结果头部组件
 * 显示总分、百分比和评级
 */
export const GradingHeader: React.FC<Props> = ({
  result,
  scorePercentage,
  scoreLevel,
  scoreColor,
}) => {
  return (
    <div className='bg-white text-gray-800 border-b border-gray-200'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold mb-4'>批改完成！</h1>
          <div className='bg-gray-50 rounded-lg p-6 max-w-md mx-auto border border-gray-200'>
            <div className={`text-4xl font-bold mb-2 ${scoreColor}`}>
              {result.totalScore} / {result.maxScore}
            </div>
            <div className='text-xl mb-2 text-gray-700'>
              {scorePercentage.toFixed(1)}% - {scoreLevel}
            </div>
            <div className='bg-gray-200 rounded-full h-3 mb-2'>
              <div
                className='bg-blue-500 h-3 rounded-full transition-all duration-1000'
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>
            <p className='text-gray-600'>{result.overallFeedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
