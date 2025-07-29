import React from 'react';
import type { GenerationRequest } from '@/types';
import { QuestionType } from '@/types';
import { QuestionTypeSelector } from './QuestionTypeSelector';
import { GenerationPreview } from './GenerationPreview';
import { executeTextStreamLLMRequest } from '@/llm/utils/streamService';
import { LLMClient } from '@/llm/api/client';
import { logger } from '@/stores/useLogStore';

interface GenerationFormProps {
  formData: GenerationRequest;
  onSubjectChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onQuestionConfigChange: (type: QuestionType, count: number) => void;
  getQuestionCount: (type: QuestionType) => number;
  getTotalQuestions: () => number;
  onSavePreset: () => void;
  onLoadPreset: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  error: string | null | undefined;
}

/**
 * 生成表单组件
 * 包含表单的基本字段和题型配置
 */
export const GenerationForm: React.FC<GenerationFormProps> = ({
  formData,
  onSubjectChange,
  onDescriptionChange,
  onQuestionConfigChange,
  getQuestionCount,
  getTotalQuestions,
  onSavePreset,
  onLoadPreset,
  onSubmit,
  isGenerating,
  error,
}) => {
  return (
    <form onSubmit={onSubmit} className='p-8'>
      {/* 基础信息 */}
      <div className='space-y-6 mb-8'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            学科/主题 *
          </label>
          <input
            type='text'
            value={formData.subject}
            onChange={e => onSubjectChange(e.target.value)}
            placeholder='请输入学科或主题'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            详细描述
          </label>
          <textarea
            value={formData.description}
            onChange={e => onDescriptionChange(e.target.value)}
            placeholder='请描述您希望生成的题目偏好、难度要求、重点知识点等'
            rows={4}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>

      {/* 题型配置 */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-medium text-gray-900'>题型配置</h3>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={onLoadPreset}
              className='px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors'
            >
              加载预设
            </button>
            <button
              type='button'
              onClick={onSavePreset}
              disabled={formData.questionConfigs.length === 0}
              className='px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              保存预设
            </button>
          </div>
        </div>

        <QuestionTypeSelector
          getQuestionCount={getQuestionCount}
          onQuestionConfigChange={onQuestionConfigChange}
        />
      </div>

      {/* 统计和错误信息 */}
      <GenerationPreview
        questionConfigs={formData.questionConfigs}
        totalQuestions={getTotalQuestions()}
        error={error}
      />

      {/* 提交按钮 */}
      <div className='flex justify-end gap-4'>
        <button
          type='button'
          onClick={async () => {
            try {
              const client = new LLMClient();
              const messages = [
                {
                  role: 'user' as const,
                  content:
                    '请写一首关于春天的诗，要求优美动人，大约100字左右。',
                },
              ];

              logger.info('开始测试流式LLM请求', 'system', { test: true });

              await executeTextStreamLLMRequest(
                client,
                messages,
                `test-${Date.now()}`,
                '测试流式回复',
                {
                  temperature: 0.8,
                  maxTokens: 500,
                  onProgress: (_, chunk) => {
                    console.log('收到新内容片段:', chunk);
                  },
                }
              );

              logger.success('流式测试完成', 'system', { test: true });
            } catch (error) {
              logger.error('流式测试失败', 'system', {
                error: error instanceof Error ? error.message : '未知错误',
              });
            }
          }}
          className='hidden px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors'
        >
          测试流式回复
        </button>

        <button
          type='submit'
          disabled={
            isGenerating ||
            !formData.subject.trim() ||
            formData.questionConfigs.length === 0
          }
          className='px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {isGenerating ? '生成中...' : '开始生成试卷'}
        </button>
      </div>
    </form>
  );
};
