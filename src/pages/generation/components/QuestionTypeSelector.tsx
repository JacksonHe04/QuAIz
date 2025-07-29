import React from 'react';
import { QuestionType } from '@/types';
import { QUESTION_TYPE_OPTIONS } from '../constants';

interface QuestionTypeSelectorProps {
  getQuestionCount: (type: QuestionType) => number;
  onQuestionConfigChange: (type: QuestionType, count: number) => void;
}

/**
 * 题型选择器组件
 * 用于选择和配置不同题型的数量
 */
export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  getQuestionCount,
  onQuestionConfigChange,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {QUESTION_TYPE_OPTIONS.map(option => {
        const count = getQuestionCount(option.type);
        return (
          <div
            key={option.type}
            className='border border-gray-200 rounded-lg p-4'
          >
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-medium text-gray-900'>{option.label}</h4>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() =>
                    onQuestionConfigChange(option.type, Math.max(0, count - 1))
                  }
                  className='w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600'
                >
                  -
                </button>
                <span className='w-8 text-center font-medium'>{count}</span>
                <button
                  type='button'
                  onClick={() => onQuestionConfigChange(option.type, count + 1)}
                  className='w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white'
                >
                  +
                </button>
              </div>
            </div>
            <p className='text-sm text-gray-600'>{option.description}</p>
          </div>
        );
      })}
    </div>
  );
};
