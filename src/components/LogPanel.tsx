import React, { useEffect, useRef } from 'react';
import { useLogStore, type LogEntry } from '@/stores/useLogStore';

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
  const levelStyles = getLogLevelStyles(log.level);
  const categoryIcon = getCategoryIcon(log.category);
  
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
          <pre className="mt-1 p-2 bg-black bg-opacity-10 rounded text-xs overflow-x-auto">
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
        </details>
      )}
    </div>
  );
};

/**
 * 日志面板组件
 * 从左侧弹出的侧边栏，显示实时日志信息
 */
export const LogPanel: React.FC = () => {
  const { logs, isVisible, toggleVisibility, clearLogs } = useLogStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = React.useState(true);

  // 自动滚动到底部
  useEffect(() => {
    if (isAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isAutoScroll]);

  // 移除点击外部关闭逻辑，因为现在使用挤压布局而不是覆盖层

  // 检测用户是否手动滚动
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsAutoScroll(isAtBottom);
    }
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
          flex flex-col overflow-hidden
        `}>
        {/* 头部 */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <h2 className="font-semibold">系统日志</h2>
              <p className="text-xs text-gray-300">
                共 {logs.length} 条记录
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearLogs}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title="清空日志"
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

        {/* 日志内容区域 */}
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

        {/* 底部控制栏 */}
        <div className="border-t bg-gray-50 p-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                isAutoScroll ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              <span>{isAutoScroll ? '自动滚动' : '手动模式'}</span>
            </div>
            <button
              onClick={() => setIsAutoScroll(true)}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              滚动到底部
            </button>
          </div>
        </div>
      </div>

      {/* 浮动切换按钮 - 当面板关闭时显示 */}
      {!isVisible && (
        <div className="absolute top-4 left-4 z-10">
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