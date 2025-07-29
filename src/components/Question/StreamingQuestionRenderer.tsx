import React from 'react';
import { QuestionRenderer } from './QuestionRenderer';
import type { Question } from '@/types';
import type { StreamingQuestion } from '@/stores/generation';

/**
 * 流式题目渲染器属性
 */
interface StreamingQuestionProps {
  question: StreamingQuestion;
  questionNumber: number;
  onAnswerChange: (questionId: string, answer: unknown) => void;
  disabled?: boolean;
}

/**
 * 流式题目渲染器
 * 支持部分内容显示和加载状态
 */
export const StreamingQuestionRenderer: React.FC<StreamingQuestionProps> = ({
  question,
  questionNumber,
  onAnswerChange,
  disabled = false,
}) => {
  // 如果是部分题目，显示加载状态
  if (question.isPartial) {
    return (
      <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
        <div className='flex items-center gap-2 mb-4'>
          <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
            第 {questionNumber} 题
          </span>
          <span className='text-gray-500 text-sm flex items-center gap-1'>
            <div className='animate-spin h-3 w-3 border border-blue-500 border-t-transparent rounded-full'></div>
            生成中...
          </span>
        </div>

        <div className='space-y-4'>
          <div className='text-lg font-medium text-gray-800'>
            {question.question || '正在生成题目...'}
          </div>

          {/* 显示生成中的占位符 */}
          <div className='space-y-2'>
            <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-4 bg-gray-200 rounded animate-pulse w-3/4'></div>
            <div className='h-4 bg-gray-200 rounded animate-pulse w-1/2'></div>
          </div>
        </div>
      </div>
    );
  }

  // 完整题目，使用标准渲染器
  return (
    <QuestionRenderer
      question={question as unknown as Question}
      onAnswerChange={onAnswerChange}
      disabled={disabled}
      questionNumber={questionNumber}
    />
  );
};
