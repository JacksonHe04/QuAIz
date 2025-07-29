import React, { memo, useMemo, useCallback, useState } from 'react';
import { OptimizedStreamingQuestionRenderer } from '@/components/Question/OptimizedStreamingQuestionRenderer';
import type { StreamingQuestion } from '@/stores/generation';

interface VirtualizedQuestionListProps {
  questions: StreamingQuestion[];
  onAnswerChange: (questionId: string, answer: unknown) => void;
  disabled: boolean;
  virtualizationThreshold?: number;
  loadMoreStep?: number;
}

/**
 * 虚拟化题目列表组件
 * 当题目数量较多时使用虚拟化渲染以提升性能
 */
export const VirtualizedQuestionList: React.FC<VirtualizedQuestionListProps> =
  memo(
    ({
      questions,
      onAnswerChange,
      disabled,
      virtualizationThreshold = 20,
      loadMoreStep = 10,
    }) => {
      // 当题目数量超过阈值时启用虚拟化
      const shouldUseVirtualization =
        questions.length > virtualizationThreshold;
      const [visibleCount, setVisibleCount] = useState(loadMoreStep);

      /**
       * 加载更多题目
       */
      const loadMore = useCallback(() => {
        setVisibleCount(prev =>
          Math.min(prev + loadMoreStep, questions.length)
        );
      }, [questions.length, loadMoreStep]);

      /**
       * 获取当前可见的题目列表
       */
      const visibleQuestions = useMemo(() => {
        if (shouldUseVirtualization) {
          return questions.slice(0, visibleCount);
        }
        return questions;
      }, [questions, visibleCount, shouldUseVirtualization]);

      /**
       * 渲染虚拟化列表
       */
      const renderVirtualizedList = () => (
        <div className='space-y-6'>
          {/* 题目列表 */}
          {visibleQuestions.map((question, index) => (
            <OptimizedStreamingQuestionRenderer
              key={question.id || `streaming-${index}`}
              question={question}
              questionNumber={index + 1}
              onAnswerChange={onAnswerChange}
              disabled={disabled}
            />
          ))}

          {/* 加载更多按钮 */}
          {visibleCount < questions.length && (
            <div className='text-center py-4'>
              <button
                onClick={loadMore}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
              >
                加载更多题目 ({visibleCount}/{questions.length})
              </button>
            </div>
          )}
        </div>
      );

      /**
       * 渲染普通列表
       */
      const renderNormalList = () => (
        <div className='space-y-6'>
          {questions.map((question, index) => (
            <OptimizedStreamingQuestionRenderer
              key={question.id || `streaming-${index}`}
              question={question}
              questionNumber={index + 1}
              onAnswerChange={onAnswerChange}
              disabled={disabled}
            />
          ))}
        </div>
      );

      // 根据是否需要虚拟化选择渲染方式
      return shouldUseVirtualization
        ? renderVirtualizedList()
        : renderNormalList();
    }
  );

VirtualizedQuestionList.displayName = 'VirtualizedQuestionList';
