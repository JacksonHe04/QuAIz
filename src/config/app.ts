/**
 * 应用配置文件
 * 管理应用的基本配置信息
 */

export const APP_CONFIG = {
  // 应用基本信息
  name: 'QuAIz',
  version: '1.0.0',
  description: 'AI智能出题系统 - Quiz You by AI Zipply',

  // 题目配置
  question: {
    // 每种题型的默认分值
    defaultScore: 10,
    // 最大题目数量限制
    maxQuestionsPerType: 20,
    // 总题目数量限制
    maxTotalQuestions: 50,
  },

  // UI配置
  ui: {
    // 动画持续时间
    animationDuration: 300,
    // 自动保存间隔（毫秒）
    autoSaveInterval: 30000,
  },

  // API配置（模拟）
  api: {
    // 模拟生成延迟
    mockGenerationDelay: 2000,
    // 模拟批改延迟
    mockGradingDelay: 3000,
  },
} as const;

/**
 * 题目类型配置
 */
export const QUESTION_TYPE_CONFIG = {
  'single-choice': {
    label: '单选题',
    description: '从多个选项中选择一个正确答案',
    icon: '◉',
    color: 'blue',
  },
  'multiple-choice': {
    label: '多选题',
    description: '从多个选项中选择多个正确答案',
    icon: '☑',
    color: 'green',
  },
  'fill-blank': {
    label: '填空题',
    description: '在空白处填写正确答案',
    icon: '___',
    color: 'purple',
  },
  'short-answer': {
    label: '简答题',
    description: '用文字回答问题',
    icon: '📝',
    color: 'orange',
  },
  'code-output': {
    label: '代码输出题',
    description: '根据代码写出运行结果',
    icon: '💻',
    color: 'indigo',
  },
  'code-writing': {
    label: '代码编写题',
    description: '编写代码实现指定功能',
    icon: '⌨️',
    color: 'red',
  },
} as const;
