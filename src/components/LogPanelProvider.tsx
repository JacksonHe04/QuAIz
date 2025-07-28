import React from 'react';
import { LogPanel } from './LogPanel';

/**
 * 日志面板提供者组件
 * 在应用的根级别提供全局日志面板功能
 */
export const LogPanelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <LogPanel />
    </>
  );
};