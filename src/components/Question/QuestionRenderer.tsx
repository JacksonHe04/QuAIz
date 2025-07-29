import React from 'react';
import type { Question } from '@/types';
import { QuestionType } from '@/types';
import {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  FillBlankQuestion,
  ShortAnswerQuestion,
  CodeOutputQuestion,
  CodeWritingQuestion,
} from './questions';

interface Props {
  question: Question;
  onAnswerChange: (questionId: string, answer: unknown) => void;
  disabled?: boolean;
  showCorrectAnswer?: boolean;
  questionNumber?: number;
}

/**
 * 题目渲染器组件
 * 根据题目类型动态渲染对应的题目组件
 */
export const QuestionRenderer: React.FC<Props> = ({
  question,
  onAnswerChange,
  disabled = false,
  showCorrectAnswer = false,
  questionNumber,
}) => {
  const handleAnswerChange = (answer: unknown) => {
    onAnswerChange(question.id, answer);
  };

  const renderQuestion = () => {
    switch (question.type) {
      case QuestionType.SINGLE_CHOICE:
        return (
          <SingleChoiceQuestion
            question={question}
            onAnswerChange={handleAnswerChange}
            disabled={disabled}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case QuestionType.MULTIPLE_CHOICE:
        return (
          <MultipleChoiceQuestion
            question={question}
            onAnswerChange={handleAnswerChange}
            disabled={disabled}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case QuestionType.FILL_BLANK:
        return (
          <FillBlankQuestion
            question={question}
            onAnswerChange={handleAnswerChange}
            disabled={disabled}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case QuestionType.SHORT_ANSWER:
        return (
          <ShortAnswerQuestion
            question={question}
            onAnswerChange={handleAnswerChange}
            disabled={disabled}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case QuestionType.CODE_OUTPUT:
        return (
          <CodeOutputQuestion
            question={question}
            onAnswerChange={handleAnswerChange}
            disabled={disabled}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      case QuestionType.CODE_WRITING:
        return (
          <CodeWritingQuestion
            question={question}
            onAnswerChange={handleAnswerChange}
            disabled={disabled}
            showCorrectAnswer={showCorrectAnswer}
          />
        );

      default:
        return (
          <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-800'>
              未知题目类型: {(question as { type: string }).type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
      {questionNumber && (
        <div className='flex items-center gap-2 mb-4'>
          <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
            第 {questionNumber} 题
          </span>
          <span className='text-gray-500 text-sm'>
            {getQuestionTypeLabel(question.type)}
          </span>
        </div>
      )}

      {renderQuestion()}
    </div>
  );
};

/**
 * 获取题目类型的中文标签
 */
function getQuestionTypeLabel(type: QuestionType): string {
  const labels: Record<QuestionType, string> = {
    [QuestionType.SINGLE_CHOICE]: '单选题',
    [QuestionType.MULTIPLE_CHOICE]: '多选题',
    [QuestionType.FILL_BLANK]: '填空题',
    [QuestionType.SHORT_ANSWER]: '简答题',
    [QuestionType.CODE_OUTPUT]: '代码输出题',
    [QuestionType.CODE_WRITING]: '代码编写题',
  };

  return labels[type] || '未知题型';
}
