import React from 'react';
import { useLogStore } from '@/stores/useLogStore';
import { LogEntryComponent } from './LogEntry';
import { StreamSessionComponent } from './StreamSession';
import { TabHeader } from './TabHeader';
import { EmptyState } from './EmptyState';
import { PanelHeader } from './PanelHeader';
import { BottomControls } from './BottomControls';
import { FloatingToggle } from './FloatingToggle';
import { useAutoScroll } from '../hooks/useAutoScroll';

/**
 * 日志面板组件
 * 从左侧弹出的侧边栏，显示实时日志信息和流式回复
 */
export const LogPanel: React.FC = () => {
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

  // 日志标签页的自动滚动
  const logsAutoScroll = useAutoScroll([logs]);

  // 流式回复标签页的自动滚动
  const streamAutoScroll = useAutoScroll([
    streamSessions,
    currentStreamSession,
  ]);

  // 获取当前标签页的自动滚动状态
  const currentAutoScroll =
    activeTab === 'logs' ? logsAutoScroll : streamAutoScroll;

  /**
   * 清空当前标签页内容
   */
  const handleClearCurrent = () => {
    if (activeTab === 'logs') {
      clearLogs();
    } else {
      clearStreamSessions();
    }
  };

  /**
   * 获取当前标签页的记录数量
   */
  const getCurrentCount = () => {
    return activeTab === 'logs' ? logs.length : streamSessions.length;
  };

  /**
   * 渲染日志标签页内容
   */
  const renderLogsContent = () => {
    if (logs.length === 0) {
      return <EmptyState tabType='logs' />;
    }

    return logs.map(log => <LogEntryComponent key={log.id} log={log} />);
  };

  /**
   * 渲染流式回复标签页内容
   */
  const renderStreamContent = () => {
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
  };

  return (
    <>
      {/* 侧边栏面板 - 使用相对定位实现挤压效果 */}
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
        <div
          ref={currentAutoScroll.scrollRef}
          onScroll={currentAutoScroll.handleScroll}
          className='flex-1 overflow-y-auto p-4 space-y-2'
        >
          {activeTab === 'logs' ? renderLogsContent() : renderStreamContent()}
        </div>

        {/* 底部控制栏 */}
        <BottomControls
          isAutoScroll={currentAutoScroll.isAutoScroll}
          onScrollToBottom={currentAutoScroll.forceScrollToBottom}
        />
      </div>

      {/* 浮动切换按钮 - 当面板关闭时显示 */}
      {!isVisible && <FloatingToggle onClick={toggleVisibility} />}
    </>
  );
};
