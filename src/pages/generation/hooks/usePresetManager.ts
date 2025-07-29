import { useState, useEffect } from 'react';
import type { GenerationRequest, QuestionPreset } from '@/types';
import {
  getPresets,
  savePreset,
  deletePreset,
  generatePresetName,
} from '@/utils/presetStorage';

/**
 * 预设管理钩子
 * 处理预设的加载、应用、保存和删除
 * @param formData 当前表单数据
 * @param setFormData 设置表单数据的函数
 */
export function usePresetManager(
  formData: GenerationRequest,
  setFormData: (data: GenerationRequest) => void
) {
  // 预设相关状态
  const [presets, setPresets] = useState<QuestionPreset[]>([]);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');

  /**
   * 加载预设列表
   */
  const loadPresets = () => {
    const savedPresets = getPresets();
    setPresets(savedPresets);
  };

  /**
   * 应用预设方案
   * @param preset 要应用的预设
   */
  const applyPreset = (preset: QuestionPreset) => {
    setFormData({
      subject: preset.subject || '',
      description: preset.description_content || '',
      questionConfigs: [...preset.questionConfigs],
    });
    setShowPresetModal(false);
  };

  /**
   * 保存当前方案为预设
   */
  const handleSavePreset = () => {
    if (formData.questionConfigs.length === 0) {
      alert('请先配置题型后再保存预设');
      return;
    }

    const suggestedName = generatePresetName(formData.questionConfigs);
    setPresetName(suggestedName);
    setPresetDescription('');
    setShowSaveModal(true);
  };

  /**
   * 确认保存预设
   */
  const confirmSavePreset = () => {
    if (!presetName.trim()) {
      alert('请输入预设名称');
      return;
    }

    try {
      savePreset({
        name: presetName.trim(),
        description: presetDescription.trim(),
        subject: formData.subject,
        description_content: formData.description,
        questionConfigs: formData.questionConfigs,
      });

      loadPresets();
      setShowSaveModal(false);
      setPresetName('');
      setPresetDescription('');
      alert('预设保存成功！');
    } catch {
      alert('保存预设失败，请重试');
    }
  };

  /**
   * 删除预设
   * @param presetId 预设ID
   * @param presetName 预设名称
   */
  const handleDeletePreset = (presetId: string, presetName: string) => {
    if (confirm(`确定要删除预设"${presetName}"吗？`)) {
      try {
        deletePreset(presetId);
        loadPresets();
      } catch {
        alert('删除预设失败，请重试');
      }
    }
  };

  // 初始加载预设
  useEffect(() => {
    loadPresets();
  }, []);

  return {
    presets,
    showPresetModal,
    setShowPresetModal,
    showSaveModal,
    setShowSaveModal,
    presetName,
    setPresetName,
    presetDescription,
    setPresetDescription,
    loadPresets,
    applyPreset,
    handleSavePreset,
    confirmSavePreset,
    handleDeletePreset,
  };
}
