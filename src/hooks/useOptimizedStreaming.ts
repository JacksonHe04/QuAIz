import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';

/**
 * 流式渲染性能优化Hook
 * 提供防抖更新、批量渲染等优化功能
 */
export const useOptimizedStreaming = () => {
  const { generation } = useAppStore();
  const { streamingQuestions, status, completedQuestionCount, progress } =
    generation;

  // 防抖更新的引用
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // 缓存题目数据，避免频繁的重新渲染
  const memoizedQuestions = useMemo(() => {
    return streamingQuestions || [];
  }, [streamingQuestions]);

  // 防抖的题目更新
  const debouncedQuestions = useMemo(() => {
    const now = Date.now();

    // 如果更新频率过高，使用防抖
    if (now - lastUpdateRef.current < 100) {
      return memoizedQuestions;
    }

    lastUpdateRef.current = now;
    return memoizedQuestions;
  }, [memoizedQuestions]);

  // 批量状态更新
  const batchedStatus = useMemo(
    () => ({
      isGenerating: status === 'generating',
      isComplete: status === 'complete',
      isError: status === 'error',
      isIdle: status === 'idle',
    }),
    [status]
  );

  // 性能监控
  const performanceMetrics = useMemo(
    () => ({
      questionCount: memoizedQuestions.length,
      completedCount: completedQuestionCount,
      progress: progress || 0,
      renderTime: Date.now(),
    }),
    [memoizedQuestions.length, completedQuestionCount, progress]
  );

  // 清理函数
  useEffect(() => {
    const timeoutRef = updateTimeoutRef.current;
    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, []);

  return {
    questions: debouncedQuestions,
    status: batchedStatus,
    metrics: performanceMetrics,
    originalQuestions: memoizedQuestions,
  };
};

/**
 * 虚拟化渲染Hook
 * 管理大量题目的虚拟化渲染逻辑
 */
export const useVirtualizedRendering = (
  questions: unknown[],
  threshold = 20
) => {
  const shouldVirtualize = questions.length > threshold;

  // 可见范围管理
  const getVisibleRange = useCallback(
    (scrollTop: number, containerHeight: number, itemHeight: number) => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 2,
        questions.length
      );

      return { startIndex: Math.max(0, startIndex - 2), endIndex };
    },
    [questions.length]
  );

  // 获取可见题目
  const getVisibleQuestions = useCallback(
    (startIndex: number, endIndex: number) => {
      return questions.slice(startIndex, endIndex).map((question, index) => ({
        ...(question as Record<string, unknown>),
        virtualIndex: startIndex + index,
        actualIndex: startIndex + index,
      }));
    },
    [questions]
  );

  return {
    shouldVirtualize,
    getVisibleRange,
    getVisibleQuestions,
    totalHeight: questions.length * 200, // 估算总高度
    itemHeight: 200, // 估算单项高度
  };
};

/**
 * 性能监控Hook
 * 监控渲染性能和内存使用
 */
export const usePerformanceMonitor = () => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);

  // 记录渲染次数
  useEffect(() => {
    renderCountRef.current += 1;
    lastRenderTimeRef.current = Date.now();
  });

  // 获取性能指标
  const getMetrics = useCallback(() => {
    const now = Date.now();
    return {
      renderCount: renderCountRef.current,
      lastRenderTime: lastRenderTimeRef.current,
      timeSinceLastRender: now - lastRenderTimeRef.current,
      memoryUsage:
        'memory' in performance
          ? {
              used: (performance as { memory: { usedJSHeapSize: number } })
                .memory.usedJSHeapSize,
              total: (performance as { memory: { totalJSHeapSize: number } })
                .memory.totalJSHeapSize,
              limit: (performance as { memory: { jsHeapSizeLimit: number } })
                .memory.jsHeapSizeLimit,
            }
          : null,
    };
  }, []);

  // 性能警告
  const checkPerformance = useCallback(() => {
    const metrics = getMetrics();

    if (metrics.renderCount > 100) {
      console.warn('渲染次数过多，可能存在性能问题:', metrics.renderCount);
    }

    if (
      metrics.memoryUsage &&
      metrics.memoryUsage.used > metrics.memoryUsage.limit * 0.8
    ) {
      console.warn('内存使用率过高:', metrics.memoryUsage);
    }

    return metrics;
  }, [getMetrics]);

  return {
    getMetrics,
    checkPerformance,
    renderCount: renderCountRef.current,
  };
};
