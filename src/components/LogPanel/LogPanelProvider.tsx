import React from 'react';
import { OptimizedLogPanel } from './optimized/OptimizedLogPanel';
import { useLogStore } from '@/stores/useLogStore';

/**
 * 日志面板提供者组件
 * 在应用的根级别提供全局日志面板功能，使用flex布局实现挤压效果
 */
export const LogPanelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isVisible } = useLogStore();

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* 日志面板 */}
      <OptimizedLogPanel />

      {/* 主内容区域 */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out overflow-auto ${
          isVisible ? 'ml-0' : '-ml-96'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
