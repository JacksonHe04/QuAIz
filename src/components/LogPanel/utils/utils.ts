import React from 'react';
import type { LogEntry } from '@/stores/useLogStore';
import {
  LOG_LEVEL_STYLES,
  LOG_LEVEL_BADGE_STYLES,
  CATEGORY_ICONS,
  COPY_SUCCESS_DURATION,
} from './constants';

/**
 * 获取日志级别对应的样式类名
 * @param level 日志级别
 * @returns 样式类名
 */
export const getLogLevelStyles = (level: LogEntry['level']) => {
  return LOG_LEVEL_STYLES[level] || LOG_LEVEL_STYLES.default;
};

/**
 * 获取日志级别徽章样式
 * @param level 日志级别
 * @returns 徽章样式类名
 */
export const getLogLevelBadgeStyles = (level: LogEntry['level']) => {
  if (level === 'error') return LOG_LEVEL_BADGE_STYLES.error;
  if (level === 'warning') return LOG_LEVEL_BADGE_STYLES.warning;
  if (level === 'success') return LOG_LEVEL_BADGE_STYLES.success;
  return LOG_LEVEL_BADGE_STYLES.default;
};

/**
 * 获取日志分类对应的图标
 * @param category 日志分类
 * @returns 图标字符
 */
export const getCategoryIcon = (category: LogEntry['category']) => {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
};

/**
 * 格式化时间戳
 * @param timestamp 时间戳
 * @returns 格式化的时间字符串
 */
export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return (
    date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) +
    '.' +
    String(date.getMilliseconds()).padStart(3, '0')
  );
};

/**
 * 格式化持续时间
 * @param startTime 开始时间
 * @param endTime 结束时间（可选，默认为当前时间）
 * @returns 格式化的持续时间字符串
 */
export const formatDuration = (startTime: number, endTime?: number) => {
  const duration = (endTime || Date.now()) - startTime;
  return `${(duration / 1000).toFixed(1)}s`;
};

/**
 * 格式化详细信息内容
 * @param details 详细信息
 * @returns 格式化后的字符串
 */
export const formatDetails = (details: unknown): string => {
  if (typeof details === 'string') {
    return details;
  }
  try {
    return JSON.stringify(details, null, 2);
  } catch {
    return String(details);
  }
};

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @param onSuccess 成功回调
 * @param onError 错误回调
 */
export const copyToClipboard = async (
  text: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  try {
    await navigator.clipboard.writeText(text);
    onSuccess?.();
  } catch (err) {
    const error = err instanceof Error ? err : new Error('复制失败');
    console.error('复制失败:', error);
    onError?.(error);
  }
};

/**
 * 创建复制功能的Hook
 * @param getText 获取要复制的文本的函数
 * @returns 复制状态和处理函数
 */
export const useCopyFunction = (getText: () => string) => {
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleCopy = async () => {
    await copyToClipboard(getText(), () => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), COPY_SUCCESS_DURATION);
    });
  };

  return { copySuccess, handleCopy };
};

/**
 * 检测是否滚动到底部
 * @param element 滚动元素
 * @param threshold 阈值
 * @returns 是否在底部
 */
export const isScrolledToBottom = (
  element: HTMLElement,
  threshold: number = 10
): boolean => {
  const { scrollTop, scrollHeight, clientHeight } = element;
  return scrollTop + clientHeight >= scrollHeight - threshold;
};

/**
 * 滚动到底部
 * @param element 滚动元素
 */
export const scrollToBottom = (element: HTMLElement) => {
  element.scrollTop = element.scrollHeight;
};
