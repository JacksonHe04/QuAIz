import React from 'react';
import type { FillBlankQuestion as FillBlankQuestionType } from '@/types';

interface Props {
  question: FillBlankQuestionType;
  onAnswerChange: (answer: string[]) => void;
  disabled?: boolean;
  showCorrectAnswer?: boolean;
}

/**
 * 填空题组件
 * 渲染填空题并处理用户输入
 */
export const FillBlankQuestion: React.FC<Props> = ({
  question,
  onAnswerChange,
  disabled = false,
  showCorrectAnswer = false,
}) => {
  const userAnswers = question.userAnswer || [];
  const blankCount = question.correctAnswers.length;

  const handleInputChange = (index: number, value: string) => {
    if (disabled) return;

    const newAnswers = [...userAnswers];
    newAnswers[index] = value;

    // 确保数组长度与空白数量一致
    while (newAnswers.length < blankCount) {
      newAnswers.push('');
    }

    onAnswerChange(newAnswers);
  };

  // 解析题目文本，将 ___ 替换为输入框
  const renderQuestionWithBlanks = () => {
    const parts = question.question.split('___');
    const elements: React.ReactNode[] = [];

    parts.forEach((part, index) => {
      elements.push(
        <span key={`text-${index}`} className='text-gray-900'>
          {part}
        </span>
      );

      if (index < parts.length - 1) {
        const blankIndex = index;
        const userAnswer = userAnswers[blankIndex] || '';
        const correctAnswer = question.correctAnswers[blankIndex];
        const isCorrect =
          showCorrectAnswer &&
          userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
        const isWrong =
          showCorrectAnswer && userAnswer.trim() !== '' && !isCorrect;

        elements.push(
          <span key={`blank-${index}`} className='inline-block mx-1'>
            <input
              type='text'
              value={userAnswer}
              onChange={e => handleInputChange(blankIndex, e.target.value)}
              disabled={disabled}
              placeholder='请填写答案'
              className={`
                px-2 py-1 border-b-2 bg-transparent text-center min-w-[100px] focus:outline-none
                ${disabled ? 'cursor-not-allowed' : ''}
                ${isCorrect ? 'border-green-500 text-green-700' : ''}
                ${isWrong ? 'border-red-500 text-red-700' : 'border-blue-300 focus:border-blue-500'}
              `}
            />
            {showCorrectAnswer && (
              <div className='text-xs mt-1'>
                {isCorrect && <span className='text-green-600'>✓ 正确</span>}
                {isWrong && (
                  <span className='text-red-600'>
                    ✗ 正确答案: {correctAnswer}
                  </span>
                )}
                {!userAnswer.trim() && (
                  <span className='text-gray-500'>答案: {correctAnswer}</span>
                )}
              </div>
            )}
          </span>
        );
      }
    });

    return elements;
  };

  return (
    <div className='space-y-4'>
      <div className='text-lg font-medium leading-relaxed'>
        {renderQuestionWithBlanks()}
      </div>

      <p className='text-sm text-gray-600'>请在空白处填写答案</p>

      {showCorrectAnswer && (
        <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
          <h4 className='font-medium text-gray-900 mb-2'>参考答案：</h4>
          <div className='space-y-1'>
            {question.correctAnswers.map((answer, index) => (
              <div key={index} className='text-sm text-gray-700'>
                空白 {index + 1}: {answer}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
