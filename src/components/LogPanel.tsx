import React, { useEffect, useRef } from 'react';
import { useLogStore, type LogEntry, type StreamSession } from '@/stores/useLogStore';

/**
 * 获取日志级别对应的样式类名
 * @param level 日志级别
 * @returns 样式类名
 */
const getLogLevelStyles = (level: LogEntry['level']) => {
  switch (level) {
    case 'info':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'success':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'error':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

/**
 * 获取日志分类对应的图标
 * @param category 日志分类
 * @returns 图标字符
 */
const getCategoryIcon = (category: LogEntry['category']) => {
  switch (category) {
    case 'llm':
      return '🤖';
    case 'api':
      return '🌐';
    case 'system':
      return '⚙️';
    case 'user':
      return '👤';
    default:
      return '📝';
  }
};

/**
 * 格式化时间戳
 * @param timestamp 时间戳
 * @returns 格式化的时间字符串
 */
const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + '.' + String(date.getMilliseconds()).padStart(3, '0');
};

/**
 * 日志条目组件
 * @param log 日志条目
 */
const LogEntryComponent: React.FC<{ log: LogEntry }> = ({ log }) => {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const levelStyles = getLogLevelStyles(log.level);
  const categoryIcon = getCategoryIcon(log.category);
  
  /**
   * 复制详细信息到剪贴板
   */
  const handleCopy = async () => {
    const content = (() => {
      if (typeof log.details === 'string') {
        return log.details;
      }
      try {
        return JSON.stringify(log.details, null, 2);
      } catch {
        return String(log.details);
      }
    })();
    
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };
  
  return (
    <div className={`p-3 border-l-4 mb-2 rounded-r ${levelStyles}`}>
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{categoryIcon}</span>
          <span className="text-xs font-medium uppercase tracking-wide">
            {log.category}
          </span>
          <span className="text-xs opacity-75">
            {formatTimestamp(log.timestamp)}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          log.level === 'error' ? 'bg-red-100 text-red-700' :
          log.level === 'warning' ? 'bg-yellow-100 text-yellow-700' :
          log.level === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {log.level.toUpperCase()}
        </span>
      </div>
      <div className="text-sm font-medium mb-1">
        {log.message}
      </div>
      {log.details != null && (
        <details className="text-xs opacity-75">
          <summary className="cursor-pointer hover:opacity-100">详细信息</summary>
          <div className="mt-1 relative">
            <pre className="p-2 bg-black bg-opacity-10 rounded text-xs overflow-x-auto pr-10">
              {(() => {
                if (typeof log.details === 'string') {
                  return log.details;
                }
                try {
                  return JSON.stringify(log.details, null, 2);
                } catch {
                  return String(log.details);
                }
              })()}
            </pre>
            <button
               onClick={handleCopy}
               className={`absolute top-1 right-1 p-1 rounded text-xs transition-colors ${
                 copySuccess 
                   ? 'bg-green-200 text-green-700' 
                   : 'bg-gray-200 hover:bg-gray-300'
               }`}
               title={copySuccess ? '已复制!' : '复制详细信息'}
             >
               {copySuccess ? '✅' : '📋'}
             </button>
          </div>
        </details>
      )}
    </div>
  );
};

/**
 * 流式会话组件
 * @param session 流式会话数据
 */
const StreamSessionComponent: React.FC<{ session: StreamSession }> = ({ session }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);
  
  /**
   * 复制会话内容到剪贴板
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(session.totalContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };
  
  /**
   * 格式化持续时间
   */
  const formatDuration = () => {
    const duration = (session.endTime || Date.now()) - session.startTime;
    return `${(duration / 1000).toFixed(1)}s`;
  };
  
  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
      {/* 会话头部 */}
      <div className="bg-gray-50 p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <div>
              <div className="text-sm font-medium">
                {session.operation || '大模型对话'}
                {session.endTime ? (
                  <span className="ml-2 text-xs text-green-600">✅ 已完成</span>
                ) : (
                  <span className="ml-2 text-xs text-blue-600">🔄 进行中</span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {formatTimestamp(session.startTime)} • 持续 {formatDuration()} • {session.chunks.length} 片段
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={`p-1 rounded text-xs transition-colors ${
                copySuccess 
                  ? 'bg-green-200 text-green-700' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title={copySuccess ? '已复制!' : '复制全部内容'}
            >
              {copySuccess ? '✅' : '📋'}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-xs bg-gray-200 hover:bg-gray-300"
              title={isExpanded ? '收起详情' : '展开详情'}
            >
              {isExpanded ? '🔼' : '🔽'}
            </button>
          </div>
        </div>
      </div>
      
      {/* 会话内容 */}
      <div className="p-3">
        {isExpanded ? (
          /* 详细模式：显示所有片段 */
          <div className="space-y-2">
            {session.chunks.map((chunk, index) => (
              <div key={chunk.id} className="text-xs">
                <div className="text-gray-400 mb-1">
                  片段 {index + 1} • {formatTimestamp(chunk.timestamp)}
                </div>
                <div className="bg-gray-50 p-2 rounded font-mono text-sm whitespace-pre-wrap">
                  {chunk.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 简洁模式：显示完整内容 */
          <div className="bg-gray-50 p-3 rounded font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
            {session.totalContent || '暂无内容...'}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 标签页组件
 * @param activeTab 当前活动标签
 * @param onTabChange 标签切换回调
 */
const TabHeader: React.FC<{
  activeTab: 'logs' | 'stream';
  onTabChange: (tab: 'logs' | 'stream') => void;
  logsCount: number;
  sessionsCount: number;
}> = ({ activeTab, onTabChange, logsCount, sessionsCount }) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        onClick={() => onTabChange('logs')}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
          activeTab === 'logs'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
        }`}
      >
        📊 系统日志
        <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
          {logsCount}
        </span>
      </button>
      <button
        onClick={() => onTabChange('stream')}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
          activeTab === 'stream'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
        }`}
      >
        🤖 实时回复
        <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
          {sessionsCount}
        </span>
      </button>
    </div>
  );
};

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
    clearStreamSessions
  } = useLogStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamScrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = React.useState(true);
  const [isStreamAutoScroll, setIsStreamAutoScroll] = React.useState(true);

  // 自动滚动到底部 - 日志标签页
  useEffect(() => {
    if (isAutoScroll && scrollRef.current && activeTab === 'logs') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isAutoScroll, activeTab]);
  
  // 自动滚动到底部 - 流式回复标签页
  useEffect(() => {
    if (isStreamAutoScroll && streamScrollRef.current && activeTab === 'stream') {
      streamScrollRef.current.scrollTop = streamScrollRef.current.scrollHeight;
    }
  }, [streamSessions, currentStreamSession, isStreamAutoScroll, activeTab]);

  // 移除点击外部关闭逻辑，因为现在使用挤压布局而不是覆盖层

  // 检测用户是否手动滚动 - 日志标签页
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsAutoScroll(isAtBottom);
    }
  };
  
  // 检测用户是否手动滚动 - 流式回复标签页
  const handleStreamScroll = () => {
    if (streamScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = streamScrollRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsStreamAutoScroll(isAtBottom);
    }
  };
  
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
   * 获取当前标签页的标题
   */
  const getCurrentTitle = () => {
    return activeTab === 'logs' ? '系统日志' : '实时回复';
  };

  return (
    <>
      {/* 侧边栏面板 - 使用相对定位实现挤压效果 */}
      <div 
        id="log-panel-sidebar"
        className={`
          h-full bg-white shadow-2xl border-r border-gray-200
          w-96 transform transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col overflow-hidden z-40
        `}>
        {/* 头部 */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{activeTab === 'logs' ? '📊' : '🤖'}</span>
            <div>
              <h2 className="font-semibold">{getCurrentTitle()}</h2>
              <p className="text-xs text-gray-300">
                共 {getCurrentCount()} 条记录
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearCurrent}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title={`清空${getCurrentTitle()}`}
            >
              🗑️
            </button>
            <button
              onClick={toggleVisibility}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title="关闭面板"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 标签页头部 */}
        <TabHeader 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          logsCount={logs.length}
          sessionsCount={streamSessions.length}
        />

        {/* 内容区域 */}
        {activeTab === 'logs' ? (
          /* 日志标签页内容 */
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-2"
          >
            {logs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">📝</div>
                <p>暂无日志记录</p>
                <p className="text-sm mt-1">系统活动将在这里显示</p>
              </div>
            ) : (
              logs.map((log) => (
                <LogEntryComponent key={log.id} log={log} />
              ))
            )}
          </div>
        ) : (
          /* 流式回复标签页内容 */
          <div 
            ref={streamScrollRef}
            onScroll={handleStreamScroll}
            className="flex-1 overflow-y-auto p-4 space-y-2"
          >
            {streamSessions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🤖</div>
                <p>暂无流式回复记录</p>
                <p className="text-sm mt-1">大模型的实时回复将在这里显示</p>
                {currentStreamSession && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700 mb-2">🔄 正在接收回复...</div>
                    <div className="text-xs text-blue-600">
                      已接收 {currentStreamSession.chunks.length} 个片段
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* 显示历史会话 */}
                {streamSessions.map((session) => (
                  <StreamSessionComponent key={session.id} session={session} />
                ))}
                
                {/* 显示当前进行中的会话 */}
                {currentStreamSession && !streamSessions.find(s => s.id === currentStreamSession.id) && (
                  <div className="border-2 border-blue-200 border-dashed rounded-lg">
                    <StreamSessionComponent session={currentStreamSession} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* 底部控制栏 */}
        <div className="border-t bg-gray-50 p-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                (activeTab === 'logs' ? isAutoScroll : isStreamAutoScroll) ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              <span>{(activeTab === 'logs' ? isAutoScroll : isStreamAutoScroll) ? '自动滚动' : '手动模式'}</span>
            </div>
            <button
              onClick={() => {
                if (activeTab === 'logs') {
                  setIsAutoScroll(true);
                  if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                  }
                } else {
                  setIsStreamAutoScroll(true);
                  if (streamScrollRef.current) {
                    streamScrollRef.current.scrollTop = streamScrollRef.current.scrollHeight;
                  }
                }
              }}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              滚动到底部
            </button>
          </div>
        </div>
      </div>

      {/* 浮动切换按钮 - 当面板关闭时显示 */}
      {!isVisible && (
        <div className="fixed top-4 left-4 z-50">
          <button
            id="log-panel-toggle"
            onClick={toggleVisibility}
            className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 hover:scale-110"
            title="打开日志面板"
          >
            📊
          </button>
        </div>
      )}
    </>
  );
};