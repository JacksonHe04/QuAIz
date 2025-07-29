import React from 'react';
import type { GenerationRequest } from '@/types';
import { QUESTION_TYPE_OPTIONS } from '../constants';

interface SavePresetModalProps {
  show: boolean;
  presetName: string;
  presetDescription: string;
  formData: GenerationRequest;
  getTotalQuestions: () => number;
  onPresetNameChange: (value: string) => void;
  onPresetDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * 保存预设模态框组件
 * 用于保存当前配置为预设方案
 */
export const SavePresetModal: React.FC<SavePresetModalProps> = ({
  show,
  presetName,
  presetDescription,
  formData,
  getTotalQuestions,
  onPresetNameChange,
  onPresetDescriptionChange,
  onSave,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-200'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900'>保存预设方案</h3>
        </div>

        <div className='p-6'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                预设名称 *
              </label>
              <input
                type='text'
                value={presetName}
                onChange={e => onPresetNameChange(e.target.value)}
                placeholder='请输入预设名称'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                预设描述
              </label>
              <textarea
                value={presetDescription}
                onChange={e => onPresetDescriptionChange(e.target.value)}
                placeholder='可选：描述这个预设的用途或特点'
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div className='bg-gray-50 rounded-lg p-3'>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                当前配置预览：
              </h4>
              <div className='space-y-1 text-sm text-gray-600'>
                {formData.subject && (
                  <div className='mb-2'>
                    <span className='font-medium'>学科/主题:</span>{' '}
                    {formData.subject}
                  </div>
                )}
                {formData.description && (
                  <div className='mb-2'>
                    <span className='font-medium'>详细描述:</span>
                    <span className='line-clamp-2'>{formData.description}</span>
                  </div>
                )}
                {formData.questionConfigs.map(config => {
                  const option = QUESTION_TYPE_OPTIONS.find(
                    opt => opt.type === config.type
                  );
                  return (
                    <div key={config.type}>
                      {option?.label}: {config.count} 题
                    </div>
                  );
                })}
                <div className='font-medium text-gray-700 pt-1 border-t border-gray-200'>
                  总计: {getTotalQuestions()} 题
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='px-6 py-4 border-t border-gray-200 flex justify-end gap-3'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 text-gray-600 hover:text-gray-800'
          >
            取消
          </button>
          <button
            type='button'
            onClick={onSave}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
