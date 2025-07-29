import React, { useState } from 'react';
import { Clock, X } from 'lucide-react';
import { formatDuration, formatTimestamp } from '@/utils/timeUtils';
import { useAppStore } from '@/stores/useAppStore';

/**
 * 浮动时间记录组件
 * 在页面右侧显示的浮动时间记录器，点击可展开详细信息
 */
export const FloatingTimeRecorder: React.FC = () => {
  const { generation } = useAppStore();
  const { startTime, endTime, duration, status } = generation;
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * 计算实时耗时（生成中状态）
   */
  const [currentDuration, setCurrentDuration] = React.useState<number>(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'generating' && startTime) {
      interval = setInterval(() => {
        setCurrentDuration(Date.now() - startTime);
      }, 50); // 每50ms更新一次，提高精度
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, startTime]);

  /**
   * 获取显示的耗时
   */
  const getDisplayDuration = () => {
    if (status === 'generating' && startTime) {
      return currentDuration;
    }
    return duration || 0;
  };

  /**
   * 获取状态图标和颜色
   */
  const getStatusInfo = () => {
    switch (status) {
      case 'generating':
        return { icon: '⏳', color: 'bg-blue-600', textColor: 'text-blue-600' };
      case 'complete':
        return {
          icon: '✓',
          color: 'bg-green-600',
          textColor: 'text-green-600',
        };
      case 'error':
        return { icon: '✕', color: 'bg-red-600', textColor: 'text-red-600' };
      default:
        return { icon: '⏰', color: 'bg-gray-600', textColor: 'text-gray-600' };
    }
  };

  const statusInfo = getStatusInfo();
  const displayDuration = getDisplayDuration();

  // 如果没有开始时间，不显示组件
  if (!startTime) {
    return null;
  }

  return (
    <>
      {/* 浮动按钮 */}
      {!isExpanded && (
        <div className='fixed top-56 z-50 lg:right-4 right-0'>
          <button
            onClick={() => setIsExpanded(true)}
            className={`${statusInfo.color} text-white shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center
                      lg:w-12 lg:h-12 lg:rounded-full
                      w-8 h-16 rounded-l-full`}
            title='查看时间记录'
          >
            <Clock className='w-5 h-5' />
          </button>
        </div>
      )}

      {/* 展开的详细面板 */}
      {isExpanded && (
        <div
          className='fixed top-48 z-50 w-72 bg-white rounded-lg shadow-xl overflow-hidden
                     lg:right-4 right-2'
        >
          <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
            <h3 className='font-medium text-gray-900 flex items-center gap-2'>
              <Clock className='w-4 h-4' />
              时间记录
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className='text-gray-400 hover:text-gray-600'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='p-4 space-y-3'>
            {/* 状态显示 */}
            <div className='flex items-center gap-2'>
              <span className='text-lg'>{statusInfo.icon}</span>
              <span className={`font-medium ${statusInfo.textColor}`}>
                {status === 'generating'
                  ? '生成中'
                  : status === 'complete'
                    ? '已完成'
                    : status === 'error'
                      ? '生成失败'
                      : '等待中'}
              </span>
            </div>

            {/* 开始时间 */}
            <div className='text-sm'>
              <span className='text-gray-500'>开始时间：</span>
              <span className='text-gray-900'>
                {formatTimestamp(startTime)}
              </span>
            </div>

            {/* 结束时间 */}
            {endTime && (
              <div className='text-sm'>
                <span className='text-gray-500'>结束时间：</span>
                <span className='text-gray-900'>
                  {formatTimestamp(endTime)}
                </span>
              </div>
            )}

            {/* 耗时显示 */}
            <div className='text-sm'>
              <span className='text-gray-500'>总耗时：</span>
              <span className='text-gray-900 font-medium'>
                {formatDuration(displayDuration)}
              </span>
              {status === 'generating' && (
                <span className='text-blue-600 ml-1'>(实时)</span>
              )}
            </div>

            {/* 性能提示 */}
            {status === 'complete' && duration && (
              <div
                className={`mt-3 p-2 rounded-md text-xs ${
                  duration < 5000
                    ? 'bg-green-50 text-green-700'
                    : duration < 15000
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-700'
                }`}
              >
                {duration < 5000
                  ? '⚡ 生成速度很快！'
                  : duration < 15000
                    ? '⏱️ 生成速度正常'
                    : '🐌 生成耗时较长，可考虑优化'}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
