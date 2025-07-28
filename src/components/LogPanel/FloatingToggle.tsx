import React from 'react';
import { BarChart3 } from 'lucide-react';

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
    <div className="fixed top-40 z-50 lg:left-4 left-0">
      <button
        id="log-panel-toggle"
        onClick={onClick}
        className="bg-gray-900 text-white shadow-lg hover:bg-gray-700 hover:scale-110 transition-all duration-200 flex items-center justify-center
                  lg:w-12 lg:h-12 lg:rounded-full
                  w-8 h-16 rounded-r-full"
        title="打开日志面板"
      >
        <BarChart3 className="w-5 h-5" />
      </button>
    </div>
  );
};