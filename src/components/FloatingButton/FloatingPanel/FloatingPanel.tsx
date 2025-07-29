import React from 'react';
import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * 浮动面板位置类型
 */
export type FloatingPanelPosition = 'left' | 'right';

/**
 * 浮动面板组件属性
 */
export interface FloatingPanelProps {
  /** 是否显示面板 */
  isVisible: boolean;
  /** 关闭面板的处理函数 */
  onClose: () => void;
  /** 面板标题 */
  title: string;
  /** 标题图标 */
  titleIcon?: LucideIcon;
  /** 面板位置 */
  position: FloatingPanelPosition;
  /** 面板宽度 */
  width?: string;
  /** 距离顶部的位置 */
  top?: string;
  /** 最大高度 */
  maxHeight?: string;
  /** 子组件 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
}

/**
 * 通用浮动展示面板组件
 * 支持左右定位，响应式设计
 */
export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  isVisible,
  onClose,
  title,
  titleIcon: TitleIcon,
  position,
  width = 'w-64',
  top = 'top-32',
  maxHeight = 'max-h-[calc(100vh-12rem)]',
  children,
  className = '',
  showCloseButton = true,
}) => {
  if (!isVisible) {
    return null;
  }

  /**
   * 获取位置相关的样式类
   */
  const getPositionClasses = () => {
    const baseClasses = `fixed ${top} z-40 ${width}`;

    if (position === 'left') {
      return `${baseClasses} lg:left-4 left-2`;
    } else {
      return `${baseClasses} lg:right-4 right-2`;
    }
  };

  return (
    <div
      className={`${getPositionClasses()} bg-white rounded-lg shadow-xl overflow-hidden ${className}`}
    >
      {/* 面板头部 */}
      <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
        <h3 className='font-medium text-gray-900 flex items-center gap-2'>
          {TitleIcon && <TitleIcon className='w-4 h-4' />}
          {title}
        </h3>
        {showCloseButton && (
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
            title='关闭'
          >
            <X className='w-5 h-5' />
          </button>
        )}
      </div>

      {/* 面板内容 */}
      <div className={`p-4 overflow-y-auto ${maxHeight}`}>{children}</div>
    </div>
  );
};
