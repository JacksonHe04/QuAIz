import { QuestionType } from '@/types';

/**
 * 题型选项配置
 */
export const QUESTION_TYPE_OPTIONS = [
  {
    type: QuestionType.SINGLE_CHOICE,
    label: '单选题',
    description: '从多个选项中选择一个正确答案',
  },
  {
    type: QuestionType.MULTIPLE_CHOICE,
    label: '多选题',
    description: '从多个选项中选择多个正确答案',
  },
  {
    type: QuestionType.FILL_BLANK,
    label: '填空题',
    description: '在空白处填写正确答案',
  },
  {
    type: QuestionType.SHORT_ANSWER,
    label: '简答题',
    description: '用文字回答问题',
  },
  {
    type: QuestionType.CODE_OUTPUT,
    label: '代码输出题',
    description: '根据代码写出运行结果',
  },
  {
    type: QuestionType.CODE_WRITING,
    label: '代码编写题',
    description: '编写代码实现指定功能',
  },
];
