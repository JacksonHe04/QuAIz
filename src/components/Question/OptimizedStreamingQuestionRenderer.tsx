import React, { memo, useMemo, useCallback } from 'react';
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
 * 加载状态组件
 * 显示题目生成中的占位符
 */
const LoadingPlaceholder: React.FC<{
  questionNumber: number;
  question?: string;
}> = memo(({ questionNumber, question }) => {
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
          {question || '正在生成题目...'}
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
});

LoadingPlaceholder.displayName = 'LoadingPlaceholder';

/**
 * 优化后的流式题目渲染器
 * 使用React.memo和性能优化技术
 */
export const OptimizedStreamingQuestionRenderer: React.FC<StreamingQuestionProps> =
  memo(
    ({ question, questionNumber, onAnswerChange, disabled = false }) => {
      // 缓存回调函数，避免子组件不必要的重新渲染
      const handleAnswerChange = useCallback(
        (questionId: string, answer: unknown) => {
          onAnswerChange(questionId, answer);
        },
        [onAnswerChange]
      );

      // 缓存题目数据转换结果
      const questionData = useMemo(() => {
        if (question.isPartial) {
          return null;
        }
        return question as unknown as Question;
      }, [question]);

      // 如果是部分题目，显示加载状态
      if (question.isPartial) {
        return (
          <LoadingPlaceholder
            questionNumber={questionNumber}
            question={question.question}
          />
        );
      }

      // 完整题目，使用标准渲染器
      if (questionData) {
        return (
          <QuestionRenderer
            question={questionData}
            onAnswerChange={handleAnswerChange}
            disabled={disabled}
            questionNumber={questionNumber}
          />
        );
      }

      // 兜底情况
      return (
        <LoadingPlaceholder
          questionNumber={questionNumber}
          question='题目数据异常'
        />
      );
    },
    (prevProps, nextProps) => {
      // 自定义比较函数，优化重新渲染条件
      return (
        prevProps.questionNumber === nextProps.questionNumber &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.question.id === nextProps.question.id &&
        prevProps.question.isPartial === nextProps.question.isPartial &&
        prevProps.question.question === nextProps.question.question &&
        prevProps.question.type === nextProps.question.type &&
        // 只有当题目完整时才比较完整内容
        (!nextProps.question.isPartial
          ? JSON.stringify(prevProps.question) ===
            JSON.stringify(nextProps.question)
          : true)
      );
    }
  );

OptimizedStreamingQuestionRenderer.displayName =
  'OptimizedStreamingQuestionRenderer';
