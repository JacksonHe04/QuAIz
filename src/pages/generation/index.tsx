import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { useGenerationForm, usePresetManager } from './hooks';
import { GenerationForm, PresetModal, SavePresetModal } from './components';
import { OptimizedFloatingTimeRecorder } from '@/components/TimeRecorder';

/**
 * 题目生成页面
 * 用户在此页面配置生成参数并提交生成请求
 */
export const GenerationPage: React.FC = () => {
  // 全局状态
  const store = useAppStore();
  const generation = store.generation;
  const startGeneration = store.startGeneration;

  // 表单状态管理
  const {
    formData,
    setFormData,
    handleSubjectChange,
    handleDescriptionChange,
    handleQuestionConfigChange,
    getTotalQuestions,
    getQuestionCount,
  } = useGenerationForm();

  // 预设管理
  const {
    presets,
    showPresetModal,
    setShowPresetModal,
    showSaveModal,
    setShowSaveModal,
    presetName,
    setPresetName,
    presetDescription,
    setPresetDescription,
    applyPreset,
    handleSavePreset,
    confirmSavePreset,
    handleDeletePreset,
  } = usePresetManager(formData, setFormData);

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      alert('请输入学科/主题');
      return;
    }

    if (formData.questionConfigs.length === 0) {
      alert('请至少选择一种题型');
      return;
    }

    await startGeneration(formData);
  };

  // 移除加载状态显示，让用户在生成过程中也能看到表单

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          {/* 页面头部 */}
          <div className='bg-white px-8 py-6 border-b border-gray-200'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>
              QuAIz AI 刷题
            </h1>
            <p className='text-gray-500'>Quiz You By AI Zipply</p>
          </div>

          {/* 生成表单 */}
          <GenerationForm
            formData={formData}
            onSubjectChange={handleSubjectChange}
            onDescriptionChange={handleDescriptionChange}
            onQuestionConfigChange={handleQuestionConfigChange}
            getQuestionCount={getQuestionCount}
            getTotalQuestions={getTotalQuestions}
            onSavePreset={handleSavePreset}
            onLoadPreset={() => setShowPresetModal(true)}
            onSubmit={handleSubmit}
            isGenerating={generation.status === 'generating'}
            error={generation.error}
          />
        </div>
      </div>

      {/* 浮动时间记录组件 */}
      <OptimizedFloatingTimeRecorder />

      {/* 预设选择模态框 */}
      <PresetModal
        show={showPresetModal}
        presets={presets}
        onClose={() => setShowPresetModal(false)}
        onApply={applyPreset}
        onDelete={handleDeletePreset}
      />

      {/* 保存预设模态框 */}
      <SavePresetModal
        show={showSaveModal}
        presetName={presetName}
        presetDescription={presetDescription}
        formData={formData}
        getTotalQuestions={getTotalQuestions}
        onPresetNameChange={setPresetName}
        onPresetDescriptionChange={setPresetDescription}
        onSave={confirmSavePreset}
        onCancel={() => setShowSaveModal(false)}
      />
    </div>
  );
};
