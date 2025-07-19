import React, { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import type { GenerationRequest } from '@/types';
import { QuestionType } from '@/types';

/**
 * 题目生成页面
 * 用户在此页面配置生成参数并提交生成请求
 */
export const GenerationPage: React.FC = () => {
  const store = useAppStore();
  const generation = store.generation;
  const startGeneration = store.startGeneration;
  const [formData, setFormData] = useState<GenerationRequest>({
    subject: '',
    description: '',
    questionConfigs: []
  });

  // 题型选项配置
  const questionTypeOptions = [
    { type: QuestionType.SINGLE_CHOICE, label: '单选题', description: '从多个选项中选择一个正确答案' },
    { type: QuestionType.MULTIPLE_CHOICE, label: '多选题', description: '从多个选项中选择多个正确答案' },
    { type: QuestionType.FILL_BLANK, label: '填空题', description: '在空白处填写正确答案' },
    { type: QuestionType.SHORT_ANSWER, label: '简答题', description: '用文字回答问题' },
    { type: QuestionType.CODE_OUTPUT, label: '代码输出题', description: '根据代码写出运行结果' },
    { type: QuestionType.CODE_WRITING, label: '代码编写题', description: '编写代码实现指定功能' }
  ];

  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({ ...prev, subject: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleQuestionConfigChange = (type: QuestionType, count: number) => {
    setFormData(prev => {
      const existingIndex = prev.questionConfigs.findIndex(config => config.type === type);
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

  const getTotalQuestions = () => {
    return formData.questionConfigs.reduce((total, config) => total + config.count, 0);
  };

  const getQuestionCount = (type: QuestionType) => {
    const config = formData.questionConfigs.find(c => c.type === type);
    return config ? config.count : 0;
  };

  if (generation.status === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">正在生成试卷...</h2>
            <p className="text-gray-600">AI正在为您精心准备题目，请稍候</p>
            <div className="mt-4 bg-gray-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 页面头部 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">QuAIz - AI智能出题</h1>
            <p className="text-blue-100">配置您的需求，让AI为您生成个性化试卷</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* 基础信息 */}
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  学科/主题 *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  placeholder="例如：JavaScript基础、数据结构、机器学习等"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  详细描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="请描述您希望生成的题目内容、难度要求、重点知识点等..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 题型配置 */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">题型配置</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questionTypeOptions.map((option) => {
                  const count = getQuestionCount(option.type);
                  return (
                    <div key={option.type} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{option.label}</h4>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuestionConfigChange(option.type, Math.max(0, count - 1))}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{count}</span>
                          <button
                            type="button"
                            onClick={() => handleQuestionConfigChange(option.type, count + 1)}
                            className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 统计信息 */}
            {formData.questionConfigs.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">生成预览</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>总题目数量: {getTotalQuestions()} 题</p>
                  <div className="flex flex-wrap gap-4">
                    {formData.questionConfigs.map((config) => {
                      const option = questionTypeOptions.find(opt => opt.type === config.type);
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
            {generation.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{generation.error}</p>
              </div>
            )}

            {/* 提交按钮 */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={(generation.status as 'idle' | 'generating' | 'complete' | 'error') === 'generating' || !formData.subject.trim() || formData.questionConfigs.length === 0}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {(generation.status as 'idle' | 'generating' | 'complete' | 'error') === 'generating' ? '生成中...' : '开始生成试卷'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};