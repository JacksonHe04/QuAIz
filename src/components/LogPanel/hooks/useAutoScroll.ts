import { useEffect, useRef, useState } from 'react';
import { isScrolledToBottom, scrollToBottom } from '../utils/utils';
import { AUTO_SCROLL_THRESHOLD } from '../utils/constants';

/**
 * 自动滚动Hook
 * 管理滚动容器的自动滚动行为
 */
export const useAutoScroll = <T extends HTMLElement = HTMLDivElement>(
  /** 依赖数组，当这些值变化时触发滚动检查 */
  dependencies: unknown[]
) => {
  const scrollRef = useRef<T>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // 当依赖变化且开启自动滚动时，滚动到底部
  useEffect(() => {
    if (isAutoScroll && scrollRef.current) {
      scrollToBottom(scrollRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoScroll, ...dependencies]);

  /**
   * 处理滚动事件，检测用户是否手动滚动
   */
  const handleScroll = () => {
    if (scrollRef.current) {
      const atBottom = isScrolledToBottom(
        scrollRef.current,
        AUTO_SCROLL_THRESHOLD
      );
      setIsAutoScroll(atBottom);
    }
  };

  /**
   * 强制滚动到底部并开启自动滚动
   */
  const forceScrollToBottom = () => {
    setIsAutoScroll(true);
    if (scrollRef.current) {
      scrollToBottom(scrollRef.current);
    }
  };

  return {
    scrollRef,
    isAutoScroll,
    handleScroll,
    forceScrollToBottom,
  };
};
