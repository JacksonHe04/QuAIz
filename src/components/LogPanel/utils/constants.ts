/**
 * 日志面板相关常量定义
 */

/**
 * 日志级别样式映射
 */
export const LOG_LEVEL_STYLES = {
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  success: 'text-green-600 bg-green-50 border-green-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  default: 'text-gray-600 bg-gray-50 border-gray-200',
} as const;

/**
 * 日志级别徽章样式映射
 */
export const LOG_LEVEL_BADGE_STYLES = {
  error: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  success: 'bg-green-100 text-green-700',
  default: 'bg-blue-100 text-blue-700',
} as const;

/**
 * 日志分类图标映射
 */
export const CATEGORY_ICONS = {
  llm: '🤖',
  api: '🌐',
  system: '⚙️',
  user: '👤',
  default: '📝',
} as const;

/**
 * 标签页配置
 */
export const TAB_CONFIG = {
  logs: {
    icon: '📊',
    title: '系统日志',
    emptyIcon: '📝',
    emptyTitle: '暂无日志记录',
    emptyDescription: '系统活动将在这里显示',
  },
  stream: {
    icon: '🤖',
    title: '实时回复',
    emptyIcon: '🤖',
    emptyTitle: '暂无流式回复记录',
    emptyDescription: '大模型的实时回复将在这里显示',
  },
} as const;

/**
 * 复制状态持续时间（毫秒）
 */
export const COPY_SUCCESS_DURATION = 2000;

/**
 * 自动滚动检测阈值（像素）
 */
export const AUTO_SCROLL_THRESHOLD = 10;
