/**
 * 时间工具函数
 */

/**
 * 格式化毫秒为可读的时间字符串
 * @param milliseconds 毫秒数
 * @param showMilliseconds 是否显示毫秒
 * @returns 格式化后的时间字符串
 */
export const formatDuration = (
  milliseconds: number,
  showMilliseconds: boolean = false
): string => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }

  const totalSeconds = milliseconds / 1000;
  const seconds = Math.floor(totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const ms = Math.floor(milliseconds % 1000);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    if (showMilliseconds) {
      return `${hours}h ${remainingMinutes}m ${remainingSeconds}.${ms.toString().padStart(3, '0')}s`;
    }
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    if (showMilliseconds) {
      return `${minutes}m ${remainingSeconds}.${ms.toString().padStart(3, '0')}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  }

  if (showMilliseconds) {
    return `${seconds}.${ms.toString().padStart(3, '0')}s`;
  }
  return `${seconds}s`;
};

/**
 * 格式化毫秒为精确的时间字符串（总是显示毫秒）
 * @param milliseconds 毫秒数
 * @returns 格式化后的时间字符串
 */
export const formatDurationPrecise = (milliseconds: number): string => {
  return formatDuration(milliseconds, true);
};

/**
 * 格式化时间戳为可读的日期时间字符串
 * @param timestamp 时间戳（毫秒）
 * @returns 格式化后的日期时间字符串
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * 计算两个时间戳之间的耗时
 * @param startTime 开始时间戳（毫秒）
 * @param endTime 结束时间戳（毫秒）
 * @returns 耗时（毫秒）
 */
export const calculateDuration = (
  startTime: number,
  endTime: number
): number => {
  return endTime - startTime;
};

/**
 * 获取当前时间戳
 * @returns 当前时间戳（毫秒）
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};
