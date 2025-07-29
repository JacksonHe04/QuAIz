import React from 'react';
import { formatDuration, formatTimestamp } from '@/utils/timeUtils';

/**
 * 时间记录组件属性
 */
interface TimeRecorderProps {
  /** 开始时间戳（毫秒） */
  startTime?: number;
  /** 结束时间戳（毫秒） */
  endTime?: number;
  /** 总耗时（毫秒） */
  duration?: number;
  /** 当前状态 */
  status: 'idle' | 'generating' | 'complete' | 'error';
  /** 是否显示详细信息 */
  showDetails?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 时间记录组件
 * 显示题目生成过程的时间信息，包括开始时间、结束时间和总耗时
 */
export const TimeRecorder: React.FC<TimeRecorderProps> = ({
  startTime,
  endTime,
  duration,
  status,
  showDetails = false,
  className = '',
}) => {
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
  const getDisplayDuration = (): number => {
    if (duration !== undefined) {
      return duration;
    }
    if (status === 'generating' && startTime) {
      return currentDuration;
    }
    return 0;
  };

  /**
   * 获取状态颜色
   */
  const getStatusColor = (): string => {
    switch (status) {
      case 'generating':
        return 'text-blue-600';
      case 'complete':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  /**
   * 获取状态图标
   */
  const getStatusIcon = (): string => {
    switch (status) {
      case 'generating':
        return '⏱️';
      case 'complete':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏰';
    }
  };

  /**
   * 获取状态文本
   */
  const getStatusText = (): string => {
    switch (status) {
      case 'generating':
        return '生成中';
      case 'complete':
        return '已完成';
      case 'error':
        return '生成失败';
      default:
        return '等待开始';
    }
  };

  const displayDuration = getDisplayDuration();

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className='flex items-center gap-2 mb-2'>
        <span className='text-lg'>{getStatusIcon()}</span>
        <span className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* 耗时显示 */}
      {(displayDuration > 0 || status === 'generating') && (
        <div className='text-2xl font-bold text-gray-900 mb-2'>
          {formatDuration(displayDuration)}
        </div>
      )}

      {/* 详细信息 */}
      {showDetails && (
        <div className='space-y-1 text-sm text-gray-600'>
          {startTime && (
            <div className='flex justify-between'>
              <span>开始时间:</span>
              <span>{formatTimestamp(startTime)}</span>
            </div>
          )}
          {endTime && (
            <div className='flex justify-between'>
              <span>结束时间:</span>
              <span>{formatTimestamp(endTime)}</span>
            </div>
          )}
          {duration !== undefined && (
            <div className='flex justify-between font-medium'>
              <span>总耗时:</span>
              <span>{formatDuration(duration)}</span>
            </div>
          )}
        </div>
      )}

      {/* 性能提示 */}
      {status === 'complete' && duration && (
        <div className='mt-2 text-xs text-gray-500'>
          {duration < 5000 && '⚡ 生成速度很快！'}
          {duration >= 5000 && duration < 15000 && '👍 生成速度正常'}
          {duration >= 15000 && duration < 30000 && '⏳ 生成速度较慢'}
          {duration >= 30000 && '🐌 生成速度很慢，建议检查网络或减少题目数量'}
        </div>
      )}
    </div>
  );
};
