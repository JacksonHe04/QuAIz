import React from 'react';
import type { LogEntry } from '@/stores/useLogStore';
import {
  getLogLevelStyles,
  getLogLevelBadgeStyles,
  getCategoryIcon,
  formatTimestamp,
  formatDetails,
} from '../utils/utils';
import { CopyButton } from './CopyButton';

/**
 * 日志条目组件属性
 */
interface LogEntryProps {
  /** 日志条目数据 */
  log: LogEntry;
}

/**
 * 日志条目组件
 * 显示单个日志条目的完整信息
 */
export const LogEntryComponent: React.FC<LogEntryProps> = ({ log }) => {
  const levelStyles = getLogLevelStyles(log.level);
  const badgeStyles = getLogLevelBadgeStyles(log.level);
  const categoryIcon = getCategoryIcon(log.category);

  return (
    <div className={`p-3 border-l-4 mb-2 rounded-r ${levelStyles}`}>
      {/* 日志头部信息 */}
      <div className='flex items-start justify-between mb-1'>
        <div className='flex items-center gap-2'>
          <span className='text-sm'>{categoryIcon}</span>
          <span className='text-xs font-medium uppercase tracking-wide'>
            {log.category}
          </span>
          <span className='text-xs opacity-75'>
            {formatTimestamp(log.timestamp)}
          </span>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${badgeStyles}`}
        >
          {log.level.toUpperCase()}
        </span>
      </div>

      {/* 日志消息 */}
      <div className='text-sm font-medium mb-1'>{log.message}</div>

      {/* 详细信息（可选） */}
      {log.details != null && (
        <details className='text-xs opacity-75'>
          <summary className='cursor-pointer hover:opacity-100'>
            详细信息
          </summary>
          <div className='mt-1 relative'>
            <pre className='p-2 bg-black bg-opacity-10 rounded text-xs overflow-x-auto pr-10'>
              {formatDetails(log.details)}
            </pre>
            <div className='absolute top-1 right-1'>
              <CopyButton
                text={formatDetails(log.details)}
                title='复制详细信息'
              />
            </div>
          </div>
        </details>
      )}
    </div>
  );
};
