/**
 * 日志工具函数
 */

/**
 * 生成唯一ID
 * @param prefix ID前缀
 * @returns 唯一ID字符串
 */
export const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 获取当前时间戳
 * @returns 当前时间戳
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * 限制数组长度，移除旧元素
 * @param array 原数组
 * @param maxLength 最大长度
 * @returns 处理后的数组
 */
export const limitArrayLength = <T>(array: T[], maxLength: number): T[] => {
  if (array.length <= maxLength) {
    return array;
  }
  return array.slice(array.length - maxLength);
};

/**
 * 数组切片移除指定数量的元素
 * @param array 原数组
 * @param count 要移除的数量
 * @returns 处理后的数组
 */
export const removeFromArray = <T>(array: T[], count: number): T[] => {
  return array.slice(count);
};
