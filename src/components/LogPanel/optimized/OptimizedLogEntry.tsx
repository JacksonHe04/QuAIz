import React, { memo, useMemo, useState, useCallback } from 'react';
import type { LogEntry } from '@/stores/useLogStore';
import {
  getLogLevelStyles,
  getLogLevelBadgeStyles,
  getCategoryIcon,
  formatTimestamp,
  formatDetails,
} from '../utils/utils';
import { CopyButton } from '../components/CopyButton';

/**
 * 日志条目组件属性
 */
interface LogEntryProps {
  /** 日志条目数据 */
  log: LogEntry;
  /** 高度变化回调函数 */
  onHeightChange?: (logId: string, newHeight: number) => void;
}

/**
 * 优化后的日志条目组件
 * 使用React.memo和useMemo进行性能优化
 */
const OptimizedLogEntry: React.FC<LogEntryProps> = memo(
  ({ log, onHeightChange }) => {
    // 展开状态管理
    const [isExpanded, setIsExpanded] = useState(false);

    // 缓存样式计算结果
    const styles = useMemo(
      () => ({
        levelStyles: getLogLevelStyles(log.level),
        badgeStyles: getLogLevelBadgeStyles(log.level),
        categoryIcon: getCategoryIcon(log.category),
      }),
      [log.level, log.category]
    );

    // 缓存格式化结果
    const formattedData = useMemo(
      () => ({
        timestamp: formatTimestamp(log.timestamp),
        details: log.details != null ? formatDetails(log.details) : null,
      }),
      [log.timestamp, log.details]
    );

    // 处理展开状态变化
    const handleToggle = useCallback(() => {
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);

      // 通知父组件高度变化
      if (onHeightChange) {
        // 计算新的高度
        let newHeight = 80; // 基础高度

        // 根据消息长度调整高度
        if (log.message.length > 50) {
          newHeight += Math.ceil(log.message.length / 50) * 20;
        }

        // 如果展开了详细信息，增加额外高度
        if (newExpanded && formattedData.details) {
          const detailsLines = formattedData.details.split('\n').length;
          newHeight += Math.max(100, detailsLines * 16 + 60); // 详细信息区域高度
        }

        onHeightChange(log.id, newHeight);
      }
    }, [
      isExpanded,
      onHeightChange,
      log.id,
      log.message.length,
      formattedData.details,
    ]);

    return (
      <div className={`p-3 border-l-4 mb-2 rounded-r ${styles.levelStyles}`}>
        {/* 日志头部信息 */}
        <div className='flex items-start justify-between mb-1'>
          <div className='flex items-center gap-2'>
            <span className='text-sm'>{styles.categoryIcon}</span>
            <span className='text-xs font-medium uppercase tracking-wide'>
              {log.category}
            </span>
            <span className='text-xs opacity-75'>
              {formattedData.timestamp}
            </span>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${styles.badgeStyles}`}
          >
            {log.level.toUpperCase()}
          </span>
        </div>

        {/* 日志消息 */}
        <div className='text-sm font-medium mb-1'>{log.message}</div>

        {/* 详细信息（可选） */}
        {formattedData.details && (
          <div className='text-xs opacity-75'>
            <div
              className='cursor-pointer hover:opacity-100 flex items-center gap-1'
              onClick={handleToggle}
            >
              <span
                className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              >
                ▶
              </span>
              <span>详细信息</span>
            </div>
            {isExpanded && (
              <div className='mt-1 relative'>
                <pre className='p-2 bg-black bg-opacity-10 rounded text-xs overflow-x-auto pr-10'>
                  {formattedData.details}
                </pre>
                <div className='absolute top-1 right-1'>
                  <CopyButton
                    text={formattedData.details}
                    title='复制详细信息'
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // 自定义比较函数，只有当log对象真正改变时才重新渲染
    return (
      prevProps.log.id === nextProps.log.id &&
      prevProps.log.message === nextProps.log.message &&
      prevProps.log.level === nextProps.log.level &&
      prevProps.log.category === nextProps.log.category &&
      prevProps.log.timestamp === nextProps.log.timestamp &&
      prevProps.log.details === nextProps.log.details
    );
  }
);

OptimizedLogEntry.displayName = 'OptimizedLogEntry';

export { OptimizedLogEntry };
