import React from 'react';
import type { ShortAnswerQuestion as ShortAnswerQuestionType } from '@/types';

interface Props {
  question: ShortAnswerQuestionType;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
  showCorrectAnswer?: boolean;
}

/**
 * 简答题组件
 * 渲染简答题并处理用户输入
 */
export const ShortAnswerQuestion: React.FC<Props> = ({
  question,
  onAnswerChange,
  disabled = false,
  showCorrectAnswer = false,
}) => {
  const userAnswer = question.userAnswer || '';

  const handleInputChange = (value: string) => {
    if (!disabled) {
      onAnswerChange(value);
    }
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium text-gray-900'>{question.question}</h3>

      <div className='space-y-3'>
        <textarea
          value={userAnswer}
          onChange={e => handleInputChange(e.target.value)}
          disabled={disabled}
          placeholder='请在此处输入您的答案...'
          rows={6}
          className={`
            w-full p-3 border rounded-lg resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            ${showCorrectAnswer && userAnswer ? 'border-blue-300' : 'border-gray-300'}
          `}
        />

        <div className='text-sm text-gray-500'>
          字数统计: {userAnswer.length} 字符
        </div>
      </div>

      {showCorrectAnswer && (
        <div className='mt-4 space-y-3'>
          <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
            <h4 className='font-medium text-green-900 mb-2'>参考答案：</h4>
            <p className='text-green-800 whitespace-pre-wrap'>
              {question.referenceAnswer}
            </p>
          </div>

          {userAnswer && (
            <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
              <h4 className='font-medium text-blue-900 mb-2'>您的答案：</h4>
              <p className='text-blue-800 whitespace-pre-wrap'>{userAnswer}</p>
            </div>
          )}

          <div className='text-sm text-gray-600'>
            <p>💡 提示：简答题会由AI进行评分，请确保答案完整、准确。</p>
          </div>
        </div>
      )}
    </div>
  );
};
