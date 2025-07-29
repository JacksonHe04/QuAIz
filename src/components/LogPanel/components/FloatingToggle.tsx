import React from 'react';
import { BarChart3 } from 'lucide-react';
import { FloatingButton } from '@/components/FloatingButton';

/**
 * 浮动切换按钮组件属性
 */
interface FloatingToggleProps {
  /** 点击处理函数 */
  onClick: () => void;
}

/**
 * 浮动切换按钮组件
 * 当面板关闭时显示的浮动按钮
 */
export const FloatingToggle: React.FC<FloatingToggleProps> = ({ onClick }) => {
  return (
    <FloatingButton
      icon={BarChart3}
      onClick={onClick}
      position='left'
      title='打开日志面板'
    />
  );
};
