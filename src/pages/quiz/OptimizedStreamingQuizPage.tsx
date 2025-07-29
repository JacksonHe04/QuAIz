import React, { memo, useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { OptimizedStreamingQuestionRenderer } from '@/components/Question/OptimizedStreamingQuestionRenderer';
import { OptimizedFloatingTimeRecorder } from '@/components/TimeRecorder';
import type { StreamingQuestion } from '@/stores/generation';

/**
 * 虚拟化题目列表组件
 * 当题目数量较多时使用虚拟化渲染
 */
const VirtualizedQuestionList: React.FC<{
  questions: StreamingQuestion[];
  onAnswerChange: (questionId: string, answer: unknown) => void;
  disabled: boolean;
}> = memo(({ questions, onAnswerChange, disabled }) => {
  // 当题目数量超过阈值时启用虚拟化
  const shouldUseVirtualization = questions.length > 20;
  const [visibleCount, setVisibleCount] = useState(10);
  
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 10, questions.length));
  }, [questions.length]);
  
  const visibleQuestions = useMemo(() => 
    questions.slice(0, visibleCount), 
    [questions, visibleCount]
  );
  
  if (shouldUseVirtualization) {
    
    return (
      <div className="space-y-6">
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
          <div className="text-center py-4">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              加载更多题目 ({visibleCount}/{questions.length})
            </button>
          </div>
        )}
      </div>
    );
  }
  
  // 题目数量较少时直接渲染
  return (
    <div className="space-y-6">
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
});

VirtualizedQuestionList.displayName = 'VirtualizedQuestionList';

/**
 * 状态页面组件
 * 用于显示空闲和错误状态
 */
const StatusPage: React.FC<{
  type: 'idle' | 'error';
  error?: string;
  onGoBack: () => void;
  onRestart?: () => void;
}> = memo(({ type, error, onGoBack, onRestart }) => {
  const config = useMemo(() => {
    if (type === 'idle') {
      return {
        icon: '⏰',
        bgColor: 'bg-gray-100',
        iconColor: 'text-gray-400',
        title: '等待开始生成',
        message: '请先配置试卷参数并开始生成',
        showRestart: false
      };
    }
    return {
      icon: '✕',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      title: '生成失败',
      message: error || '试卷生成过程中出现错误',
      showRestart: true
    };
  }, [type, error]);
  
  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg">
      <div className="p-8 text-center">
        <div className={`w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <span className={`${config.iconColor} text-xl`}>{config.icon}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{config.title}</h2>
        <p className="text-gray-600 mb-6">{config.message}</p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={onGoBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← {config.showRestart ? '重新开始' : '返回配置'}
          </button>
          {config.showRestart && onRestart && (
            <button 
              onClick={onRestart}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              重试
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

StatusPage.displayName = 'StatusPage';

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
    progress
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
  const memoizedQuestions = useMemo(() => 
    streamingQuestions || [], 
    [streamingQuestions]
  );
  
  // 缓存状态判断
  const isGenerating = useMemo(() => status === 'generating', [status]);
  const isComplete = useMemo(() => status === 'complete', [status]);
  
  // 空闲状态
  if (status === 'idle') {
    return (
      <StatusPage 
        type="idle" 
        onGoBack={handleGoBack} 
      />
    );
  }
  
  // 错误状态
  if (status === 'error') {
    return (
      <StatusPage 
        type="error" 
        error={error || undefined}
        onGoBack={handleGoBack}
        onRestart={handleRestart}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 返回
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">流式试卷生成</h1>
                <p className="text-sm text-gray-600">
                  {isGenerating ? '正在生成中...' : '生成完成'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* 进度信息 */}
              <div className="text-sm text-gray-600">
                已完成: {completedQuestionCount} 题
              </div>
            </div>
          </div>
          
          {/* 进度条 */}
          {progress !== undefined && (
            <div className="mt-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        
        {/* 浮动时间记录组件 */}
        <OptimizedFloatingTimeRecorder />
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-4xl mx-auto px-4 py-8 pt-32">
        {memoizedQuestions.length > 0 ? (
          <VirtualizedQuestionList
            questions={memoizedQuestions}
            onAnswerChange={handleAnswerChange}
            disabled={isGenerating}
          />
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-xl">⏰</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">等待题目生成</h3>
            <p className="text-gray-600">AI正在为您生成个性化试卷...</p>
          </div>
        )}
        
        {/* 生成完成后的操作按钮 */}
        {isComplete && memoizedQuestions.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">试卷生成完成！</h3>
              <p className="text-gray-600 mb-6">
                共生成 {memoizedQuestions.length} 道题目，现在可以开始答题了。
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => {/* 跳转到答题页面 */}}
                >
                  开始答题
                </button>
                <button 
                  onClick={handleRestart}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  重新生成
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};