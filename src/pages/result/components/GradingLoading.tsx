import React from 'react';

/**
 * 批改加载状态组件
 * 显示批改中的加载动画和提示
 */
export const GradingLoading: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            AI正在批改中...
          </h2>
          <p className='text-gray-600'>请稍候，AI正在仔细评阅您的答案</p>
          <div className='mt-4 bg-gray-100 rounded-full h-2'>
            <div
              className='bg-green-600 h-2 rounded-full animate-pulse'
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
