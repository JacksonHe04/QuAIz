import React from 'react';
import { copyToClipboard } from '../utils/utils';
import { COPY_SUCCESS_DURATION } from '../utils/constants';

/**
 * 复制按钮组件属性
 */
interface CopyButtonProps {
  /** 要复制的文本 */
  text: string;
  /** 按钮标题 */
  title?: string;
  /** 成功时的标题 */
  successTitle?: string;
  /** 自定义样式类名 */
  className?: string;
  /** 是否为小尺寸 */
  size?: 'sm' | 'md';
}

/**
 * 复制按钮组件
 * 提供统一的复制功能和视觉反馈
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  title = '复制',
  successTitle = '已复制!',
  className = '',
  size = 'sm',
}) => {
  const [copySuccess, setCopySuccess] = React.useState(false);

  /**
   * 处理复制操作
   */
  const handleCopy = async () => {
    await copyToClipboard(text, () => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), COPY_SUCCESS_DURATION);
    });
  };

  const sizeClasses = {
    sm: 'p-1 text-xs',
    md: 'p-2 text-sm',
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        ${sizeClasses[size]} rounded transition-colors
        ${
          copySuccess
            ? 'bg-green-200 text-green-700'
            : 'bg-gray-200 hover:bg-gray-300'
        }
        ${className}
      `}
      title={copySuccess ? successTitle : title}
    >
      {copySuccess ? '✅' : '📋'}
    </button>
  );
};
