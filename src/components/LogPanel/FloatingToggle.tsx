import React from 'react';

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
    <div className="fixed top-4 left-4 z-50">
      <button
        id="log-panel-toggle"
        onClick={onClick}
        className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 hover:scale-110"
        title="打开日志面板"
      >
        📊
      </button>
    </div>
  );
};