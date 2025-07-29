import React from 'react';
import type { QuestionConfig } from '@/types';
import { QUESTION_TYPE_OPTIONS } from '../constants';

interface GenerationPreviewProps {
  questionConfigs: QuestionConfig[];
  totalQuestions: number;
  error: string | null | undefined;
}

/**
 * 生成预览组件
 * 显示当前配置的题型统计信息和错误信息
 */
export const GenerationPreview: React.FC<GenerationPreviewProps> = ({
  questionConfigs,
  totalQuestions,
  error,
}) => {
  if (questionConfigs.length === 0 && !error) {
    return null;
  }

  return (
    <>
      {/* 统计信息 */}
      {questionConfigs.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
          <h4 className='font-medium text-blue-900 mb-2'>生成预览</h4>
          <div className='space-y-1 text-sm text-blue-800'>
            <p>总题目数量: {totalQuestions} 题</p>
            <div className='flex flex-wrap gap-4'>
              {questionConfigs.map(config => {
                const option = QUESTION_TYPE_OPTIONS.find(
                  opt => opt.type === config.type
                );
                return (
                  <span key={config.type}>
                    {option?.label}: {config.count} 题
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
          <p className='text-red-800'>{error}</p>
        </div>
      )}
    </>
  );
};
