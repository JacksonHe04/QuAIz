import React, { useMemo, useCallback } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import {
  QuizStatusPage,
  StreamingQuizHeader,
  QuizPageLayout,
  VirtualizedQuestionList,
} from './components';

/**
 * 优化后的流式试卷页面组件
 * 集成性能优化和虚拟化渲染
 */
export const OptimizedStreamingQuizPage: React.FC = () => {
  const { generation, resetApp } = useAppStore();

  const {
    status,
    error,
    streamingQuestions,
    completedQuestionCount,
    progress,
  } = generation;

  // 缓存事件处理函数
  const handleGoBack = useCallback(() => {
    resetApp();
  }, [resetApp]);

  const handleRestart = useCallback(() => {
    resetApp();
  }, [resetApp]);

  const handleAnswerChange = useCallback(() => {
    // 答题逻辑
  }, []);

  // 缓存题目数据
  const memoizedQuestions = useMemo(
    () => streamingQuestions || [],
    [streamingQuestions]
  );

  // 缓存状态判断
  const isGenerating = useMemo(() => status === 'generating', [status]);

  // 空闲状态
  if (status === 'idle') {
    return <QuizStatusPage type='idle' onGoBack={handleGoBack} />;
  }

  // 错误状态
  if (status === 'error') {
    return (
      <QuizStatusPage
        type='error'
        error={error || undefined}
        onGoBack={handleGoBack}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <QuizPageLayout>
      <StreamingQuizHeader
        title='流式试卷生成'
        subtitle={isGenerating ? '正在生成中...' : '生成完成'}
        status={isGenerating ? 'generating' : 'complete'}
        completedQuestionCount={completedQuestionCount || 0}
        progress={progress}
        onGoBack={handleGoBack}
      />

      {/* 主内容区域 */}
      <div className='max-w-4xl mx-auto px-4 py-8 pt-32'>
        {memoizedQuestions.length > 0 ? (
          <VirtualizedQuestionList
            questions={memoizedQuestions}
            onAnswerChange={handleAnswerChange}
            disabled={isGenerating}
          />
        ) : (
          <div className='text-center py-12'>
            <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-gray-400 text-xl'>⏰</span>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              等待题目生成
            </h3>
            <p className='text-gray-600'>AI正在为您生成个性化试卷...</p>
          </div>
        )}
      </div>
    </QuizPageLayout>
  );
};
