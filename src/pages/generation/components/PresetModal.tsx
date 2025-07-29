import React from 'react';
import type { QuestionPreset } from '@/types';
import { QUESTION_TYPE_OPTIONS } from '../constants';

interface PresetModalProps {
  show: boolean;
  presets: QuestionPreset[];
  onClose: () => void;
  onApply: (preset: QuestionPreset) => void;
  onDelete: (presetId: string, presetName: string) => void;
}

/**
 * 预设选择模态框组件
 * 用于显示和选择已保存的预设方案
 */
export const PresetModal: React.FC<PresetModalProps> = ({
  show,
  presets,
  onClose,
  onApply,
  onDelete,
}) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden border border-gray-200'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900'>选择预设方案</h3>
        </div>

        <div className='p-6 overflow-y-auto max-h-[60vh]'>
          {presets.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <p>暂无保存的预设方案</p>
              <p className='text-sm mt-2'>
                配置题型后点击"保存预设"来创建您的第一个预设
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {presets.map(preset => {
                return (
                  <div
                    key={preset.id}
                    className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <h4 className='font-medium text-gray-900 mb-1'>
                          {preset.name}
                        </h4>
                        {preset.description && (
                          <p className='text-sm text-gray-600 mb-2'>
                            {preset.description}
                          </p>
                        )}
                        {preset.subject && (
                          <p className='text-sm text-gray-700 mb-1'>
                            <span className='font-medium'>学科/主题:</span>{' '}
                            {preset.subject}
                          </p>
                        )}
                        {preset.description_content && (
                          <p className='text-sm text-gray-600 mb-2 line-clamp-2'>
                            <span className='font-medium'>详细描述:</span>{' '}
                            {preset.description_content}
                          </p>
                        )}
                        <div className='flex flex-wrap gap-2 text-xs'>
                          {preset.questionConfigs.map(config => {
                            const option = QUESTION_TYPE_OPTIONS.find(
                              opt => opt.type === config.type
                            );
                            return (
                              <span
                                key={config.type}
                                className='bg-blue-100 text-blue-800 px-2 py-1 rounded'
                              >
                                {option?.label}: {config.count}题
                              </span>
                            );
                          })}
                        </div>
                        <p className='text-xs text-gray-500 mt-2'>
                          总计{' '}
                          {preset.questionConfigs.reduce(
                            (sum, config) => sum + config.count,
                            0
                          )}{' '}
                          题 • 创建于{' '}
                          {new Date(preset.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className='flex gap-2 ml-4'>
                        <button
                          type='button'
                          onClick={() => onApply(preset)}
                          className='px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'
                        >
                          应用
                        </button>
                        <button
                          type='button'
                          onClick={() => onDelete(preset.id, preset.name)}
                          className='px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200'
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className='px-6 py-4 border-t border-gray-200 flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 text-gray-600 hover:text-gray-800'
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
