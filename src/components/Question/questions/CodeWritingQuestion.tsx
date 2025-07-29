import React from 'react';
import type { CodeWritingQuestion as CodeWritingQuestionType } from '@/types';

interface Props {
  question: CodeWritingQuestionType;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
  showCorrectAnswer?: boolean;
}

/**
 * 代码编写题组件
 * 渲染代码编写题并处理用户输入
 */
export const CodeWritingQuestion: React.FC<Props> = ({
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

      <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
        <div className='flex items-center gap-2 mb-2'>
          <span className='text-blue-700 font-medium text-sm'>编程语言:</span>
          <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono'>
            {question.language}
          </span>
        </div>
      </div>

      {/* 代码编辑区域 */}
      <div className='space-y-3'>
        <label className='block text-sm font-medium text-gray-700'>
          请在下方编写代码：
        </label>

        <div className='bg-gray-900 rounded-lg overflow-hidden'>
          <div className='flex items-center justify-between px-4 py-2 bg-gray-800'>
            <span className='text-gray-300 text-sm'>代码编辑器</span>
            <div className='flex items-center gap-2'>
              <span className='text-gray-400 text-xs'>{question.language}</span>
              <div className='flex gap-1'>
                <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
              </div>
            </div>
          </div>

          <textarea
            value={userAnswer}
            onChange={e => handleInputChange(e.target.value)}
            disabled={disabled}
            placeholder={`请在此处编写${question.language}代码...`}
            rows={12}
            className={`
              w-full p-4 bg-gray-900 text-green-400 font-mono text-sm resize-vertical focus:outline-none
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            style={{
              border: 'none',
              outline: 'none',
              tabSize: 2,
            }}
          />
        </div>

        <div className='flex items-center justify-between text-sm text-gray-500'>
          <span>行数: {userAnswer.split('\n').length}</span>
          <span>字符数: {userAnswer.length}</span>
        </div>
      </div>

      {showCorrectAnswer && (
        <div className='mt-4 space-y-3'>
          <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
            <h4 className='font-medium text-green-900 mb-3'>参考代码：</h4>
            <div className='bg-gray-900 rounded-lg overflow-hidden'>
              <div className='px-4 py-2 bg-gray-800'>
                <span className='text-gray-300 text-sm'>参考实现</span>
              </div>
              <pre className='text-green-400 font-mono text-sm p-4 overflow-x-auto'>
                <code>{question.referenceCode}</code>
              </pre>
            </div>
          </div>

          {userAnswer && (
            <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
              <h4 className='font-medium text-blue-900 mb-3'>您的代码：</h4>
              <div className='bg-gray-900 rounded-lg overflow-hidden'>
                <div className='px-4 py-2 bg-gray-800'>
                  <span className='text-gray-300 text-sm'>您的实现</span>
                </div>
                <pre className='text-green-400 font-mono text-sm p-4 overflow-x-auto'>
                  <code>{userAnswer}</code>
                </pre>
              </div>
            </div>
          )}

          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
            <div className='flex items-start gap-2'>
              <span className='text-yellow-600 text-lg'>💡</span>
              <div className='text-sm text-yellow-800'>
                <p className='font-medium mb-1'>评分说明：</p>
                <ul className='list-disc list-inside space-y-1'>
                  <li>代码逻辑正确性</li>
                  <li>代码风格和可读性</li>
                  <li>是否遵循最佳实践</li>
                  <li>边界情况处理</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
