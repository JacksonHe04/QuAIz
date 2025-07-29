import React from 'react';
import type { StreamSession } from '@/stores/useLogStore';
import { TAB_CONFIG } from '../utils/constants';

/**
 * 空状态组件属性
 */
interface EmptyStateProps {
  /** 标签页类型 */
  tabType: 'logs' | 'stream';
  /** 当前流式会话（仅在stream标签页时使用） */
  currentStreamSession?: StreamSession | null;
}

/**
 * 空状态组件
 * 显示当前标签页没有数据时的提示信息
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  tabType,
  currentStreamSession,
}) => {
  const config = TAB_CONFIG[tabType];

  return (
    <div className='text-center text-gray-500 py-8'>
      <div className='text-4xl mb-2'>{config.emptyIcon}</div>
      <p>{config.emptyTitle}</p>
      <p className='text-sm mt-1'>{config.emptyDescription}</p>

      {/* 流式回复标签页的特殊状态：显示正在进行的会话 */}
      {tabType === 'stream' && currentStreamSession && (
        <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
          <div className='text-sm text-blue-700 mb-2'>🔄 正在接收回复...</div>
          <div className='text-xs text-blue-600'>
            已接收 {currentStreamSession.chunks.length} 个片段
          </div>
        </div>
      )}
    </div>
  );
};
