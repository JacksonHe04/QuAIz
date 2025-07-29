import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { OptimizedStreamingQuestionRenderer } from '@/components/Question/OptimizedStreamingQuestionRenderer';
import {
  QuizStatusPage,
  StreamingQuizHeader,
  QuizPageLayout,
} from './components';

/**
 * 流式试卷页面组件
 * 展示流式生成的试卷，支持实时渲染和部分内容显示
 */
export const StreamingQuizPage: React.FC = () => {
  const { generation, resetApp } = useAppStore();

  const {
    status,
    error,
    streamingQuestions,
    completedQuestionCount,
    progress,
  } = generation;

  // 处理返回按钮
  const handleGoBack = () => {
    resetApp();
  };

  // 处理重新开始
  const handleRestart = () => {
    resetApp();
  };

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
    <QuizPageLayout
      header={
        <StreamingQuizHeader
          onGoBack={handleGoBack}
          status={status}
          completedQuestionCount={completedQuestionCount || 0}
          progress={progress ?? undefined}
        />
      }
    >
      {/* 主内容区域 */}
      <div>
        {streamingQuestions && streamingQuestions.length > 0 ? (
          <div className='space-y-6'>
            {streamingQuestions.map((question, index) => (
              <OptimizedStreamingQuestionRenderer
                key={question.id || `streaming-${index}`}
                question={question}
                questionNumber={index + 1}
                onAnswerChange={() => {}}
                disabled={status === 'generating'}
              />
            ))}
          </div>
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

        {/* 生成完成后的操作按钮 */}
        {status === 'complete' &&
          streamingQuestions &&
          streamingQuestions.length > 0 && (
            <div className='mt-8 bg-white rounded-lg shadow-lg'>
              <div className='p-6 text-center'>
                <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-green-600 text-xl'>✓</span>
                </div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  试卷生成完成！
                </h3>
                <p className='text-gray-600 mb-6'>
                  共生成 {streamingQuestions.length}{' '}
                  道题目，现在可以开始答题了。
                </p>
                <div className='flex gap-3 justify-center'>
                  <button
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                    onClick={() => {
                      /* 跳转到答题页面 */
                    }}
                  >
                    开始答题
                  </button>
                  <button
                    onClick={handleRestart}
                    className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    重新生成
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </QuizPageLayout>
  );
};
