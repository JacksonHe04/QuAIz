import React from 'react';

/**
 * 底部控制栏组件属性
 */
interface BottomControlsProps {
  /** 是否开启自动滚动 */
  isAutoScroll: boolean;
  /** 滚动到底部的处理函数 */
  onScrollToBottom: () => void;
}

/**
 * 底部控制栏组件
 * 显示自动滚动状态和提供滚动控制
 */
export const BottomControls: React.FC<BottomControlsProps> = ({
  isAutoScroll,
  onScrollToBottom,
}) => {
  return (
    <div className='border-t bg-gray-50 p-3'>
      <div className='flex items-center justify-between text-xs text-gray-600'>
        {/* 自动滚动状态指示器 */}
        <div className='flex items-center gap-2'>
          <span
            className={`w-2 h-2 rounded-full ${
              isAutoScroll ? 'bg-green-500' : 'bg-gray-400'
            }`}
          ></span>
          <span>{isAutoScroll ? '自动滚动' : '手动模式'}</span>
        </div>

        {/* 滚动到底部按钮 */}
        <button
          onClick={onScrollToBottom}
          className='px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors'
        >
          滚动到底部
        </button>
      </div>
    </div>
  );
};
