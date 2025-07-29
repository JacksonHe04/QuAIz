import React from 'react';
import { TAB_CONFIG } from '../utils/constants';

/**
 * 标签页头部组件属性
 */
interface TabHeaderProps {
  /** 当前活动标签 */
  activeTab: 'logs' | 'stream';
  /** 标签切换回调 */
  onTabChange: (tab: 'logs' | 'stream') => void;
  /** 日志数量 */
  logsCount: number;
  /** 会话数量 */
  sessionsCount: number;
}

/**
 * 标签页头部组件
 * 提供日志和流式回复之间的切换功能
 */
export const TabHeader: React.FC<TabHeaderProps> = ({
  activeTab,
  onTabChange,
  logsCount,
  sessionsCount,
}) => {
  /**
   * 获取标签按钮样式
   */
  const getTabButtonClass = (tabKey: 'logs' | 'stream') => {
    const baseClass = 'flex-1 px-4 py-3 text-sm font-medium transition-colors';
    const activeClass = 'text-blue-600 border-b-2 border-blue-600 bg-blue-50';
    const inactiveClass = 'text-gray-600 hover:text-gray-800 hover:bg-gray-50';

    return `${baseClass} ${activeTab === tabKey ? activeClass : inactiveClass}`;
  };

  return (
    <div className='flex border-b border-gray-200'>
      {/* 系统日志标签 */}
      <button
        onClick={() => onTabChange('logs')}
        className={getTabButtonClass('logs')}
      >
        {TAB_CONFIG.logs.icon} {TAB_CONFIG.logs.title}
        <span className='ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full'>
          {logsCount}
        </span>
      </button>

      {/* 实时回复标签 */}
      <button
        onClick={() => onTabChange('stream')}
        className={getTabButtonClass('stream')}
      >
        {TAB_CONFIG.stream.icon} {TAB_CONFIG.stream.title}
        <span className='ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full'>
          {sessionsCount}
        </span>
      </button>
    </div>
  );
};
