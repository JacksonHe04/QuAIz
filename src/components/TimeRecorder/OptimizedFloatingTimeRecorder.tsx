import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { FloatingButton } from '@/components/FloatingButton';
import { FloatingPanel } from '@/components/FloatingButton/FloatingPanel';
import { formatDurationPrecise, formatTimestamp } from '@/utils/timeUtils';
import {
  useTimeRecorderStore,
  syncTimeRecorderWithAppState,
} from '@/stores/timeRecorderStore';
import { useAppStore } from '@/stores/useAppStore';

/**
 * 优化版浮动时间记录组件
 * 使用独立状态管理，避免重新渲染导致的状态丢失
 * 使用通用浮动按钮和面板组件
 */
export const OptimizedFloatingTimeRecorder: React.FC = () => {
  const { generation } = useAppStore();
  const {
    startTime,
    endTime,
    duration,
    status,
    currentDuration,
    isExpanded,
    updateCurrentDuration,
    toggleExpanded,
    setExpanded,
  } = useTimeRecorderStore();

  // 同步主应用状态到时间记录状态 - 优化触发条件
  useEffect(() => {
    // 只在关键状态变化时同步，避免频繁调用
    if (generation.status) {
      syncTimeRecorderWithAppState(generation);
    }
  }, [generation]); // 监听整个generation对象的变化

  // 实时更新计时器（生成中状态）- 独立于状态同步
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'generating' && startTime) {
      interval = setInterval(() => {
        const newDuration = Date.now() - startTime;
        updateCurrentDuration(newDuration);
      }, 100); // 每100ms更新一次，减少性能开销
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, startTime, updateCurrentDuration]); // 包含所有依赖项

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
   * 获取状态信息
   */
  const getStatusInfo = () => {
    switch (status) {
      case 'generating':
        return {
          text: '生成中',
          color: 'bg-blue-600',
          hoverColor: 'hover:bg-blue-700',
        };
      case 'completed':
        return {
          text: '已完成',
          color: 'bg-green-600',
          hoverColor: 'hover:bg-green-700',
        };
      case 'error':
        return {
          text: '生成失败',
          color: 'bg-red-600',
          hoverColor: 'hover:bg-red-700',
        };
      default:
        return {
          text: '未开始',
          color: 'bg-gray-600',
          hoverColor: 'hover:bg-gray-700',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const displayDuration = getDisplayDuration();

  // 如果没有开始时间且状态为idle，不显示组件
  if (!startTime && status === 'idle') {
    return null;
  }

  return (
    <>
      {/* 浮动按钮 */}
      <FloatingButton
        icon={Clock}
        onClick={toggleExpanded}
        position='right'
        color={statusInfo.color}
        hoverColor={statusInfo.hoverColor}
        title='查看时间记录'
        top='top-56'
      />

      {/* 展开的详细面板 */}
      <FloatingPanel
        isVisible={isExpanded}
        onClose={() => setExpanded(false)}
        title='时间记录'
        titleIcon={Clock}
        position='right'
        width='w-72'
        top='top-72'
      >
        <div className='space-y-3'>
          {/* 状态显示 */}
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-600'>状态</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium text-white ${
                status === 'generating'
                  ? 'bg-blue-500'
                  : status === 'completed'
                    ? 'bg-green-500'
                    : status === 'error'
                      ? 'bg-red-500'
                      : 'bg-gray-500'
              }`}
            >
              {statusInfo.text}
            </span>
          </div>

          {/* 开始时间 */}
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-600'>开始时间</span>
            <span className='text-sm font-mono'>
              {startTime ? formatTimestamp(startTime) : '--'}
            </span>
          </div>

          {/* 结束时间 */}
          {endTime && (
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>结束时间</span>
              <span className='text-sm font-mono'>
                {formatTimestamp(endTime)}
              </span>
            </div>
          )}

          {/* 耗时显示 */}
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-600'>总耗时</span>
            <span
              className={`text-sm font-mono font-medium ${
                status === 'generating' ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {formatDurationPrecise(displayDuration)}
            </span>
          </div>

          {/* 平均每题生成时间 */}
          {status === 'completed' &&
            generation.currentQuiz &&
            generation.currentQuiz.questions.length > 0 && (
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>平均每题</span>
                <span className='text-sm font-mono font-medium text-green-600'>
                  {formatDurationPrecise(
                    Math.round(
                      displayDuration / generation.currentQuiz.questions.length
                    )
                  )}
                </span>
              </div>
            )}

          {/* 题目总数显示 */}
          {generation.currentQuiz &&
            generation.currentQuiz.questions.length > 0 && (
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>题目总数</span>
                <span className='text-sm font-medium text-gray-900'>
                  {generation.currentQuiz.questions.length} 题
                </span>
              </div>
            )}

          {/* 性能提示 */}
          {displayDuration > 30000 && (
            <div className='mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800'>
              💡 生成时间较长，建议简化题目要求或减少题目数量
            </div>
          )}

          {/* 实时更新提示 */}
          {status === 'generating' && (
            <div className='mt-2 text-xs text-gray-500 text-center'>
              ⏱️ 实时更新中（精度：100ms）
            </div>
          )}
        </div>
      </FloatingPanel>
    </>
  );
};
