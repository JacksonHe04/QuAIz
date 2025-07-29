import type { QuestionPreset, QuestionConfig } from '@/types';

const PRESETS_STORAGE_KEY = 'quaiz_question_presets';

/**
 * 获取所有保存的预设方案
 */
export const getPresets = (): QuestionPreset[] => {
  try {
    const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('获取预设方案失败:', error);
    return [];
  }
};

/**
 * 保存预设方案
 */
export const savePreset = (
  preset: Omit<QuestionPreset, 'id' | 'createdAt' | 'updatedAt'>
): QuestionPreset => {
  try {
    const presets = getPresets();
    const now = Date.now();
    const newPreset: QuestionPreset = {
      ...preset,
      id: `preset_${now}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };

    presets.push(newPreset);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    return newPreset;
  } catch (error) {
    console.error('保存预设方案失败:', error);
    throw new Error('保存预设方案失败');
  }
};

/**
 * 删除预设方案
 */
export const deletePreset = (presetId: string): void => {
  try {
    const presets = getPresets();
    const filteredPresets = presets.filter(preset => preset.id !== presetId);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(filteredPresets));
  } catch (error) {
    console.error('删除预设方案失败:', error);
    throw new Error('删除预设方案失败');
  }
};

/**
 * 更新预设方案
 */
export const updatePreset = (
  presetId: string,
  updates: Partial<Omit<QuestionPreset, 'id' | 'createdAt'>>
): QuestionPreset | null => {
  try {
    const presets = getPresets();
    const presetIndex = presets.findIndex(preset => preset.id === presetId);

    if (presetIndex === -1) {
      return null;
    }

    const updatedPreset = {
      ...presets[presetIndex],
      ...updates,
      updatedAt: Date.now(),
    };

    presets[presetIndex] = updatedPreset;
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    return updatedPreset;
  } catch (error) {
    console.error('更新预设方案失败:', error);
    throw new Error('更新预设方案失败');
  }
};

/**
 * 根据题型配置生成预设名称建议
 */
export const generatePresetName = (
  questionConfigs: QuestionConfig[]
): string => {
  if (questionConfigs.length === 0) {
    return '空方案';
  }

  const typeLabels: Record<string, string> = {
    'single-choice': '单选',
    'multiple-choice': '多选',
    'fill-blank': '填空',
    'short-answer': '简答',
    'code-output': '代码输出',
    'code-writing': '代码编写',
  };

  const totalQuestions = questionConfigs.reduce(
    (sum, config) => sum + config.count,
    0
  );
  const typeNames = questionConfigs
    .map(config => typeLabels[config.type] || config.type)
    .join('+');

  return `${typeNames}(${totalQuestions}题)`;
};
