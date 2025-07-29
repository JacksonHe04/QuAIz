import React, { memo, useMemo } from 'react';

interface QuizStatusPageProps {
  type: 'idle' | 'error' | 'empty';
  error?: string;
  onGoBack: () => void;
  onRestart?: () => void;
  title?: string;
  message?: string;
}

/**
 * 统一的状态页面组件
 * 用于显示空闲、错误、空状态等各种状态页面
 */
export const QuizStatusPage: React.FC<QuizStatusPageProps> = memo(
  ({ type, error, onGoBack, onRestart, title, message }) => {
    // 根据状态类型生成配置
    const config = useMemo(() => {
      switch (type) {
        case 'idle':
          return {
            icon: '⏰',
            bgColor: 'bg-gray-100',
            iconColor: 'text-gray-400',
            title: title || '等待开始生成',
            message: message || '请先配置试卷参数并开始生成',
            showRestart: false,
            backButtonText: '返回配置',
          };
        case 'error':
          return {
            icon: '✕',
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600',
            title: title || '生成失败',
            message: message || error || '试卷生成过程中出现错误',
            showRestart: true,
            backButtonText: '重新开始',
          };
        case 'empty':
          return {
            icon: '📝',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            title: title || '未找到试卷',
            message: message || '请先生成试卷',
            showRestart: false,
            backButtonText: '返回首页',
          };
        default:
          return {
            icon: '❓',
            bgColor: 'bg-gray-100',
            iconColor: 'text-gray-400',
            title: '未知状态',
            message: '请刷新页面重试',
            showRestart: false,
            backButtonText: '返回',
          };
      }
    }, [type, error, title, message]);

    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg'>
          <div className='p-8 text-center'>
            {/* 状态图标 */}
            <div
              className={`w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <span className={`${config.iconColor} text-xl`}>
                {config.icon}
              </span>
            </div>

            {/* 标题和描述 */}
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              {config.title}
            </h2>
            <p className='text-gray-600 mb-6'>{config.message}</p>

            {/* 操作按钮 */}
            <div className='flex gap-3 justify-center'>
              <button
                onClick={onGoBack}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
              >
                ← {config.backButtonText}
              </button>

              {config.showRestart && onRestart && (
                <button
                  onClick={onRestart}
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                  重试
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

QuizStatusPage.displayName = 'QuizStatusPage';
