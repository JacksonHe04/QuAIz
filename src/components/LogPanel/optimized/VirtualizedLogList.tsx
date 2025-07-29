import React, { memo, useMemo, useCallback, forwardRef, useEffect, useState, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import type { ListOnScrollProps } from 'react-window';
import type { LogEntry } from '@/stores/useLogStore';
import { OptimizedLogEntry } from './OptimizedLogEntry';

/**
 * 虚拟化日志列表属性
 */
interface VirtualizedLogListProps {
  /** 日志条目数组 */
  logs: LogEntry[];
  /** 容器高度 */
  height: number;
  /** 单个条目的估计高度 */
  itemHeight?: number;
  /** 滚动事件处理器 */
  onScroll?: (props: ListOnScrollProps) => void;
}

/**
 * 日志条目渲染器属性
 */
interface LogItemProps {
  index: number;
  style: React.CSSProperties;
  data: LogEntry[];
}

/**
 * 单个日志条目渲染器
 * 用于react-window的虚拟化列表
 */
const LogItem: React.FC<LogItemProps> = memo(({ index, style, data }) => {
  const log = data[index];
  
  return (
    <div style={style}>
      <div className="px-4 py-1">
        <OptimizedLogEntry log={log} />
      </div>
    </div>
  );
});

LogItem.displayName = 'LogItem';

/**
 * 虚拟化日志列表组件
 * 使用react-window实现高性能的大量日志渲染
 */
export const VirtualizedLogList = memo(forwardRef<List, VirtualizedLogListProps>((
  { logs, height, itemHeight = 120, onScroll },
  ref
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(400);
  
  // 动态计算容器高度
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerHeight(rect.height || 400);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);
  // 缓存日志数据，避免不必要的重新渲染
  const memoizedLogs = useMemo(() => logs, [logs]);
  
  // 缓存条目数据，用于传递给List组件
  const itemData = useMemo(() => memoizedLogs, [memoizedLogs]);
  
  // 动态计算条目高度的回调
  const getItemSize = useCallback((index: number) => {
    const log = memoizedLogs[index];
    if (!log) return itemHeight;
    
    // 基础高度
    let height = 80;
    
    // 根据消息长度调整高度
    if (log.message.length > 50) {
      height += Math.ceil(log.message.length / 50) * 20;
    }
    
    // 如果有详细信息，增加高度
    if (log.details) {
      height += 40;
    }
    
    return Math.max(height, itemHeight);
  }, [memoizedLogs, itemHeight]);
  
  if (memoizedLogs.length === 0) {
    return (
      <div ref={containerRef} className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📝</div>
          <div>暂无日志记录</div>
        </div>
      </div>
    );
  }
  
  const actualHeight = height > 0 ? height : containerHeight;
  
  return (
    <div ref={containerRef} className="h-full">
      <List
        ref={ref}
        height={actualHeight}
        width="100%"
        itemCount={memoizedLogs.length}
        itemSize={getItemSize}
        itemData={itemData}
        overscanCount={5} // 预渲染5个条目以提升滚动体验
        onScroll={onScroll}
      >
        {LogItem}
      </List>
    </div>
  );
}));

VirtualizedLogList.displayName = 'VirtualizedLogList';