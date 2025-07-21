import React from 'react';

/**
 * 加载状态组件
 * 显示生成中的加载动画和提示信息
 */
export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">正在生成试卷...</h2>
          <p className="text-gray-600">AI正在为您精心准备题目，请稍候</p>
          <div className="mt-4 bg-gray-100 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};