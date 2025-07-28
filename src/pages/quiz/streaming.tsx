import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { StreamingQuestionRenderer } from '@/components/Question/StreamingQuestionRenderer';

/**
 * 流式试卷页面组件
 * 展示流式生成的试卷，支持实时渲染和部分内容显示
 */
export const StreamingQuizPage: React.FC = () => {
  const {
    generation,
    resetApp
  } = useAppStore();

  const { status, error, streamingQuestions, completedQuestionCount, progress } = generation;

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
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg">
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-xl">⏰</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">等待开始生成</h2>
          <p className="text-gray-600 mb-6">请先配置试卷参数并开始生成</p>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← 返回配置
          </button>
        </div>
      </div>
    );
  }

  // 错误状态
  if (status === 'error') {
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg">
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">✕</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">生成失败</h2>
          <p className="text-gray-600 mb-6">{error || '试卷生成过程中出现错误'}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleRestart}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← 重新开始
            </button>
          </div>
        </div>
      </div>
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
                  {status === 'generating' ? '正在生成中...' : '生成完成'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* 进度信息 */}
              <div className="text-sm text-gray-600">
                已完成: {completedQuestionCount} 题
              </div>
              
              {status === 'generating' && (
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-sm">⏰</span>
                  <span className="text-sm text-blue-600">生成中</span>
                </div>
              )}
              
              {status === 'complete' && (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-sm">✓</span>
                  <span className="text-sm text-green-600">已完成</span>
                </div>
              )}
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
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-4xl mx-auto px-4 py-8 pt-32">
        {streamingQuestions && streamingQuestions.length > 0 ? (
          <div className="space-y-6">
            {streamingQuestions.map((question, index) => (
               <StreamingQuestionRenderer
                 key={question.id || `streaming-${index}`}
                 question={question}
                 questionNumber={index + 1}
                 onAnswerChange={() => {}}
                 disabled={status === 'generating'}
               />
             ))}
          </div>
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
        {status === 'complete' && streamingQuestions && streamingQuestions.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">试卷生成完成！</h3>
              <p className="text-gray-600 mb-6">
                共生成 {streamingQuestions.length} 道题目，现在可以开始答题了。
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