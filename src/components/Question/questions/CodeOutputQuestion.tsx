import React from 'react';
import type { CodeOutputQuestion as CodeOutputQuestionType } from '@/types';

interface Props {
  question: CodeOutputQuestionType;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
  showCorrectAnswer?: boolean;
}

/**
 * 代码输出题组件
 * 渲染代码输出题并处理用户输入
 */
export const CodeOutputQuestion: React.FC<Props> = ({
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

      {/* 代码展示区域 */}
      <div className='bg-gray-900 rounded-lg p-4 overflow-x-auto'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-gray-400 text-sm'>代码</span>
          <span className='text-gray-400 text-xs'>JavaScript</span>
        </div>
        <pre className='text-green-400 font-mono text-sm whitespace-pre-wrap'>
          <code>{question.code}</code>
        </pre>
      </div>

      {/* 答案输入区域 */}
      <div className='space-y-3'>
        <label className='block text-sm font-medium text-gray-700'>
          请写出上述代码的输出结果：
        </label>

        <div className='bg-gray-50 rounded-lg p-3'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-gray-600 text-sm'>输出结果</span>
            <span className='text-gray-500 text-xs'>请保持格式准确</span>
          </div>
          <textarea
            value={userAnswer}
            onChange={e => handleInputChange(e.target.value)}
            disabled={disabled}
            placeholder='请输入代码的输出结果...'
            rows={4}
            className={`
              w-full p-3 border rounded-lg font-mono text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              ${showCorrectAnswer && userAnswer ? 'border-blue-300' : 'border-gray-300'}
            `}
          />
        </div>

        <div className='text-xs text-gray-500'>
          💡 提示：请注意输出的格式、换行和空格
        </div>
      </div>

      {showCorrectAnswer && (
        <div className='mt-4 space-y-3'>
          <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
            <h4 className='font-medium text-green-900 mb-2'>正确输出：</h4>
            <pre className='text-green-800 font-mono text-sm whitespace-pre-wrap bg-white p-2 rounded border'>
              {question.correctOutput}
            </pre>
          </div>

          {userAnswer && (
            <div
              className={`p-4 border rounded-lg ${
                userAnswer.trim() === question.correctOutput.trim()
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <h4
                className={`font-medium mb-2 ${
                  userAnswer.trim() === question.correctOutput.trim()
                    ? 'text-green-900'
                    : 'text-red-900'
                }`}
              >
                您的答案：
                {userAnswer.trim() === question.correctOutput.trim() && (
                  <span className='ml-2 text-green-600'>✓ 正确</span>
                )}
                {userAnswer.trim() !== question.correctOutput.trim() && (
                  <span className='ml-2 text-red-600'>✗ 错误</span>
                )}
              </h4>
              <pre
                className={`font-mono text-sm whitespace-pre-wrap bg-white p-2 rounded border ${
                  userAnswer.trim() === question.correctOutput.trim()
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}
              >
                {userAnswer}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
