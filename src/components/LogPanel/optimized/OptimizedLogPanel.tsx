import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { VariableSizeList as List } from 'react-window';
import type { ListOnScrollProps } from 'react-window';
import { useLogStore } from '@/stores/useLogStore';
import { VirtualizedLogList } from './VirtualizedLogList';
import { StreamSessionComponent } from '../components/StreamSession';
import { TabHeader } from '../components/TabHeader';
import { EmptyState } from '../components/EmptyState';
import { PanelHeader } from '../components/PanelHeader';
import { BottomControls } from '../components/BottomControls';
import { FloatingToggle } from '../components/FloatingToggle';

/**
 * 优化后的日志面板组件
 * 集成虚拟化滚动和性能优化
 */
export const OptimizedLogPanel: React.FC = () => {
  const {
    logs,
    isVisible,
    toggleVisibility,
    clearLogs,
    streamSessions,
    currentStreamSession,
    activeTab,
    setActiveTab,
    clearStreamSessions,
  } = useLogStore();

  // 虚拟化列表的引用
  const logsListRef = useRef<List>(null);
  const streamListRef = useRef<HTMLDivElement>(null);

  // 自动滚动状态
  const [isAutoScroll, setIsAutoScroll] = React.useState(true);
  const [userScrolling, setUserScrolling] = React.useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 缓存处理函数，避免不必要的重新渲染
  const handleClearCurrent = useCallback(() => {
    if (activeTab === 'logs') {
      clearLogs();
    } else {
      clearStreamSessions();
    }
  }, [activeTab, clearLogs, clearStreamSessions]);

  const getCurrentCount = useCallback(() => {
    return activeTab === 'logs' ? logs.length : streamSessions.length;
  }, [activeTab, logs.length, streamSessions.length]);

  // 强制滚动到底部
  const forceScrollToBottom = useCallback(() => {
    if (activeTab === 'logs' && logsListRef.current && logs.length > 0) {
      logsListRef.current.scrollToItem(logs.length - 1, 'end');
    } else if (activeTab === 'stream' && streamListRef.current) {
      streamListRef.current.scrollTop = streamListRef.current.scrollHeight;
    }
    setIsAutoScroll(true);
  }, [activeTab, logs.length]);

  // 当有新日志时自动滚动到底部（仅在用户未主动滚动时）
  useEffect(() => {
    if (
      isAutoScroll &&
      !userScrolling &&
      activeTab === 'logs' &&
      logs.length > 0
    ) {
      // 使用requestAnimationFrame确保DOM更新后再滚动
      requestAnimationFrame(() => {
        if (logsListRef.current) {
          logsListRef.current.scrollToItem(logs.length - 1, 'end');
        }
      });
    }
  }, [logs.length, isAutoScroll, userScrolling, activeTab]);

  // 当有新的流式会话时自动滚动到底部
  useEffect(() => {
    if (isAutoScroll && activeTab === 'stream' && streamListRef.current) {
      requestAnimationFrame(() => {
        if (streamListRef.current) {
          streamListRef.current.scrollTop = streamListRef.current.scrollHeight;
        }
      });
    }
  }, [streamSessions.length, currentStreamSession, isAutoScroll, activeTab]);

  // 处理react-window的滚动事件
  const handleVirtualizedScroll = useCallback((props: ListOnScrollProps) => {
    const { scrollDirection } = props;

    // 标记用户正在滚动
    setUserScrolling(true);

    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 500ms后重置用户滚动状态
    scrollTimeoutRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 500);

    // 对于react-window，我们简化逻辑：向上滚动时禁用自动滚动
    if (scrollDirection === 'backward') {
      setIsAutoScroll(false);
    }
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 处理普通DOM滚动事件（用于流式内容）
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    // 标记用户正在滚动
    setUserScrolling(true);

    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 500ms后重置用户滚动状态
    scrollTimeoutRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 500);

    setIsAutoScroll(isAtBottom);
  }, []);

  // 渲染日志标签页内容
  const renderLogsContent = useMemo(() => {
    if (logs.length === 0) {
      return <EmptyState tabType='logs' />;
    }

    return (
      <div className='h-full overflow-hidden'>
        <VirtualizedLogList
          ref={logsListRef}
          logs={logs}
          height={0} // 将通过CSS控制高度
          onScroll={handleVirtualizedScroll}
        />
      </div>
    );
  }, [logs, handleVirtualizedScroll]);

  // 渲染流式回复标签页内容
  const renderStreamContent = useMemo(() => {
    if (streamSessions.length === 0) {
      return (
        <EmptyState
          tabType='stream'
          currentStreamSession={currentStreamSession}
        />
      );
    }

    return (
      <>
        {/* 显示历史会话 */}
        {streamSessions.map(session => (
          <StreamSessionComponent key={session.id} session={session} />
        ))}

        {/* 显示当前进行中的会话 */}
        {currentStreamSession &&
          !streamSessions.find(s => s.id === currentStreamSession.id) && (
            <div className='border-2 border-blue-200 border-dashed rounded-lg'>
              <StreamSessionComponent session={currentStreamSession} />
            </div>
          )}
      </>
    );
  }, [streamSessions, currentStreamSession]);

  return (
    <>
      {/* 侧边栏面板 */}
      <div
        id='log-panel-sidebar'
        className={`
          h-full bg-white shadow-2xl border-r border-gray-200
          w-96 transform transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col overflow-hidden z-40
        `}
      >
        {/* 头部 */}
        <PanelHeader
          activeTab={activeTab}
          currentCount={getCurrentCount()}
          onClearCurrent={handleClearCurrent}
          onToggleVisibility={toggleVisibility}
        />

        {/* 标签页头部 */}
        <TabHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          logsCount={logs.length}
          sessionsCount={streamSessions.length}
        />

        {/* 内容区域 */}
        <div className='flex-1 overflow-hidden'>
          {activeTab === 'logs' ? (
            renderLogsContent
          ) : (
            <div
              ref={streamListRef}
              onScroll={handleScroll}
              className='h-full overflow-y-auto p-4 space-y-2'
            >
              {renderStreamContent}
            </div>
          )}
        </div>

        {/* 底部控制栏 */}
        <BottomControls
          isAutoScroll={isAutoScroll}
          onScrollToBottom={forceScrollToBottom}
        />
      </div>

      {/* 浮动切换按钮 - 当面板关闭时显示 */}
      {!isVisible && <FloatingToggle onClick={toggleVisibility} />}
    </>
  );
};
