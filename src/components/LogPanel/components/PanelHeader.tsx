import React from 'react';
import { TAB_CONFIG } from '../utils/constants';

/**
 * 面板头部组件属性
 */
interface PanelHeaderProps {
  /** 当前活动标签 */
  activeTab: 'logs' | 'stream';
  /** 当前记录数量 */
  currentCount: number;
  /** 清空当前标签页内容的处理函数 */
  onClearCurrent: () => void;
  /** 切换面板可见性的处理函数 */
  onToggleVisibility: () => void;
}

/**
 * 面板头部组件
 * 显示当前标签页信息和操作按钮
 */
export const PanelHeader: React.FC<PanelHeaderProps> = ({
  activeTab,
  currentCount,
  onClearCurrent,
  onToggleVisibility,
}) => {
  const config = TAB_CONFIG[activeTab];

  return (
    <div className='bg-gray-900 text-white p-4 flex items-center justify-between'>
      {/* 标题信息 */}
      <div className='flex items-center gap-3'>
        <span className='text-xl'>{config.icon}</span>
        <div>
          <h2 className='font-semibold'>{config.title}</h2>
          <p className='text-xs text-gray-300'>共 {currentCount} 条记录</p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className='flex items-center gap-2'>
        <button
          onClick={onClearCurrent}
          className='p-2 hover:bg-gray-700 rounded transition-colors'
          title={`清空${config.title}`}
        >
          🗑️
        </button>
        <button
          onClick={onToggleVisibility}
          className='p-2 hover:bg-gray-700 rounded transition-colors'
          title='关闭面板'
        >
          ✕
        </button>
      </div>
    </div>
  );
};
