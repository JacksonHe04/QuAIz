import { useState } from 'react';
import type { GenerationRequest } from '@/types';
import { QuestionType } from '@/types';

/**
 * 表单状态管理钩子
 * 处理生成表单的状态和操作
 */
export function useGenerationForm() {
  // 表单数据状态
  const [formData, setFormData] = useState<GenerationRequest>({
    subject: '',
    description: '',
    questionConfigs: [],
  });

  /**
   * 更新学科/主题字段
   * @param value 新的学科/主题值
   */
  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };

  /**
   * 更新详细描述字段
   * @param value 新的详细描述值
   */
  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  /**
   * 更新题型配置
   * @param type 题型类型
   * @param count 题目数量
   */
  const handleQuestionConfigChange = (type: QuestionType, count: number) => {
    setFormData(prev => {
      const existingIndex = prev.questionConfigs.findIndex(
        config => config.type === type
      );
      const newConfigs = [...prev.questionConfigs];

      if (count === 0) {
        // 移除该题型
        if (existingIndex !== -1) {
          newConfigs.splice(existingIndex, 1);
        }
      } else {
        // 更新或添加题型配置
        if (existingIndex !== -1) {
          newConfigs[existingIndex] = { type, count };
        } else {
          newConfigs.push({ type, count });
        }
      }

      return { ...prev, questionConfigs: newConfigs };
    });
  };

  /**
   * 计算总题目数量
   * @returns 总题目数量
   */
  const getTotalQuestions = () => {
    return formData.questionConfigs.reduce(
      (total, config) => total + config.count,
      0
    );
  };

  /**
   * 获取指定题型的数量
   * @param type 题型类型
   * @returns 题目数量
   */
  const getQuestionCount = (type: QuestionType) => {
    const config = formData.questionConfigs.find(c => c.type === type);
    return config ? config.count : 0;
  };

  return {
    formData,
    setFormData,
    handleSubjectChange,
    handleDescriptionChange,
    handleQuestionConfigChange,
    getTotalQuestions,
    getQuestionCount,
  };
}
