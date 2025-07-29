import React from 'react';
import type { MultipleChoiceQuestion as MultipleChoiceQuestionType } from '@/types';

interface Props {
  question: MultipleChoiceQuestionType;
  onAnswerChange: (answer: number[]) => void;
  disabled?: boolean;
  showCorrectAnswer?: boolean;
}

/**
 * 多选题组件
 * 渲染多选题并处理用户选择
 */
export const MultipleChoiceQuestion: React.FC<Props> = ({
  question,
  onAnswerChange,
  disabled = false,
  showCorrectAnswer = false,
}) => {
  const userAnswers = question.userAnswer || [];

  const handleOptionChange = (optionIndex: number) => {
    if (disabled) return;

    const newAnswers = userAnswers.includes(optionIndex)
      ? userAnswers.filter(index => index !== optionIndex)
      : [...userAnswers, optionIndex];

    onAnswerChange(newAnswers);
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium text-gray-900'>{question.question}</h3>
      <p className='text-sm text-gray-600'>请选择所有正确的选项（可多选）</p>

      <div className='space-y-2'>
        {question.options.map((option, index) => {
          const isSelected = userAnswers.includes(index);
          const isCorrect =
            showCorrectAnswer && question.correctAnswers.includes(index);
          const isWrong =
            showCorrectAnswer &&
            isSelected &&
            !question.correctAnswers.includes(index);
          const isMissed =
            showCorrectAnswer &&
            !isSelected &&
            question.correctAnswers.includes(index);

          return (
            <label
              key={index}
              className={`
                flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-50'}
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                ${isCorrect ? 'border-green-500 bg-green-50' : ''}
                ${isWrong ? 'border-red-500 bg-red-50' : ''}
                ${isMissed ? 'border-orange-500 bg-orange-50' : ''}
              `}
            >
              <input
                type='checkbox'
                checked={isSelected}
                onChange={() => handleOptionChange(index)}
                disabled={disabled}
                className='mr-3 text-blue-600 focus:ring-blue-500 rounded'
              />
              <span className='flex-1'>
                {String.fromCharCode(65 + index)}. {option}
              </span>
              {showCorrectAnswer && isCorrect && (
                <span className='text-green-600 font-medium'>✓ 正确</span>
              )}
              {showCorrectAnswer && isWrong && (
                <span className='text-red-600 font-medium'>✗ 多选</span>
              )}
              {showCorrectAnswer && isMissed && (
                <span className='text-orange-600 font-medium'>! 遗漏</span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};
