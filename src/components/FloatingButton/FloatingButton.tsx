import React from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * 浮动按钮位置类型
 */
export type FloatingPosition = 'left' | 'right';

/**
 * 浮动按钮组件属性
 */
export interface FloatingButtonProps {
  /** 图标组件 */
  icon: LucideIcon;
  /** 点击处理函数 */
  onClick: () => void;
  /** 按钮位置 */
  position: FloatingPosition;
  /** 按钮颜色主题 */
  color?: string;
  /** 悬停时的颜色 */
  hoverColor?: string;
  /** 提示文本 */
  title?: string;
  /** 距离顶部的位置 */
  top?: string;
  /** 自定义类名 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 通用浮动按钮组件
 * 支持左右定位，移动端显示为半圆形状
 */
export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon: Icon,
  onClick,
  position,
  color = 'bg-gray-900',
  hoverColor = 'hover:bg-gray-700',
  title,
  top = 'top-40',
  className = '',
  disabled = false,
}) => {
  /**
   * 获取位置相关的样式类
   */
  const getPositionClasses = () => {
    const baseClasses = `fixed ${top} z-50`;

    if (position === 'left') {
      return `${baseClasses} lg:left-4 left-0`;
    } else {
      return `${baseClasses} lg:right-4 right-0`;
    }
  };

  /**
   * 获取按钮形状相关的样式类
   */
  const getShapeClasses = () => {
    if (position === 'left') {
      return 'lg:w-12 lg:h-12 lg:rounded-full w-8 h-16 rounded-r-full';
    } else {
      return 'lg:w-12 lg:h-12 lg:rounded-full w-8 h-16 rounded-l-full';
    }
  };

  return (
    <div className={getPositionClasses()}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          ${color} text-white shadow-lg ${hoverColor} hover:scale-110 
          transition-all duration-200 flex items-center justify-center
          ${getShapeClasses()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        title={title}
      >
        <Icon className='w-5 h-5' />
      </button>
    </div>
  );
};
