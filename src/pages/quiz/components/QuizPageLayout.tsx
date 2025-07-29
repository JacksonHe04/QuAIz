import React, { memo } from 'react';
import type { ReactNode } from 'react';

interface QuizPageLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
  contentClassName?: string;
  showPadding?: boolean;
}

/**
 * 统一的答题页面布局组件
 * 为所有答题页面提供一致的布局结构和样式
 */
export const QuizPageLayout: React.FC<QuizPageLayoutProps> = memo(
  ({
    children,
    header,
    className = '',
    contentClassName = '',
    showPadding = true,
  }) => {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        {/* 头部区域 */}
        {header}

        {/* 主内容区域 */}
        <div
          className={`
        max-w-4xl mx-auto px-4 py-8
        ${showPadding ? 'pt-32' : ''}
        ${contentClassName}
      `}
        >
          {children}
        </div>
      </div>
    );
  }
);

QuizPageLayout.displayName = 'QuizPageLayout';
