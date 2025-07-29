/**
 * 模拟服务模块
 * 当LLM配置不完整时使用的备用方案
 * 从useAppStore中提取出来，提高代码可维护性
 */

import type { GenerationRequest, Quiz, Question, GradingResult } from '@/types';
import { QuestionType } from '@/types';

/**
 * 模拟网络延迟的工具函数
 * @param ms 延迟毫秒数
 */
const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * 生成单选题
 * @param id 题目ID
 * @param subject 学科主题
 * @param index 题目序号
 */
const createSingleChoiceQuestion = (
  id: string,
  subject: string,
  index: number
): Question => ({
  id,
  type: QuestionType.SINGLE_CHOICE,
  question: `关于${subject}的单选题 ${index + 1}：以下哪个选项是正确的？`,
  options: ['选项A', '选项B', '选项C', '选项D'],
  correctAnswer: 0,
});

/**
 * 生成多选题
 * @param id 题目ID
 * @param subject 学科主题
 * @param index 题目序号
 */
const createMultipleChoiceQuestion = (
  id: string,
  subject: string,
  index: number
): Question => ({
  id,
  type: QuestionType.MULTIPLE_CHOICE,
  question: `关于${subject}的多选题 ${index + 1}：以下哪些选项是正确的？`,
  options: ['选项A', '选项B', '选项C', '选项D'],
  correctAnswers: [0, 2],
});

/**
 * 生成填空题
 * @param id 题目ID
 * @param subject 学科主题
 * @param index 题目序号
 */
const createFillBlankQuestion = (
  id: string,
  subject: string,
  index: number
): Question => ({
  id,
  type: QuestionType.FILL_BLANK,
  question: `关于${subject}的填空题 ${index + 1}：请填写空白处：___是重要的概念，它的作用是___。`,
  correctAnswers: ['概念A', '作用B'],
});

/**
 * 生成简答题
 * @param id 题目ID
 * @param subject 学科主题
 * @param index 题目序号
 */
const createShortAnswerQuestion = (
  id: string,
  subject: string,
  index: number
): Question => ({
  id,
  type: QuestionType.SHORT_ANSWER,
  question: `关于${subject}的简答题 ${index + 1}：请简述相关概念的重要性。`,
  referenceAnswer: '这是一个参考答案，说明了概念的重要性和应用场景。',
});

/**
 * 生成代码输出题
 * @param id 题目ID
 * @param subject 学科主题
 * @param index 题目序号
 */
const createCodeOutputQuestion = (
  id: string,
  subject: string,
  index: number
): Question => ({
  id,
  type: QuestionType.CODE_OUTPUT,
  question: `代码输出题 ${index + 1}：请写出以下代码的输出结果`,
  code: `console.log('Hello, ${subject}!');
console.log(1 + 2);`,
  correctOutput: `Hello, ${subject}!
3`,
});

/**
 * 生成代码编写题
 * @param id 题目ID
 * @param subject 学科主题
 * @param index 题目序号
 */
const createCodeWritingQuestion = (
  id: string,
  _subject: string,
  index: number
): Question => ({
  id,
  type: QuestionType.CODE_WRITING,
  question: `代码编写题 ${index + 1}：请编写一个函数实现指定功能`,
  language: 'javascript',
  referenceCode: 'function example() {\n  return "Hello World";\n}',
});

/**
 * 题目生成器映射表
 */
const questionGenerators = {
  'single-choice': createSingleChoiceQuestion,
  'multiple-choice': createMultipleChoiceQuestion,
  'fill-blank': createFillBlankQuestion,
  'short-answer': createShortAnswerQuestion,
  'code-output': createCodeOutputQuestion,
  'code-writing': createCodeWritingQuestion,
} as const;

/**
 * 模拟LLM API调用 - 生成试卷
 * 当LLM配置不完整时使用的备用方案
 * @param request 生成请求参数
 * @returns 生成的试卷
 */
export const mockGenerateQuiz = async (
  request: GenerationRequest
): Promise<Quiz> => {
  // 模拟网络延迟
  await delay(2000);

  const questions: Question[] = [];
  let questionId = 1;

  // 根据配置生成不同类型的题目
  for (const config of request.questionConfigs) {
    const generator = questionGenerators[config.type];

    if (!generator) {
      console.warn(`未知的题目类型: ${config.type}`);
      continue;
    }

    for (let i = 0; i < config.count; i++) {
      const id = `q${questionId++}`;
      const question = generator(id, request.subject, i);
      questions.push(question);
    }
  }

  return {
    id: `quiz_${Date.now()}`,
    title: `${request.subject} - 练习题`,
    questions,
    createdAt: Date.now(),
  };
};

/**
 * 计算单选题得分
 * @param question 题目对象
 * @returns 得分和反馈
 */
const gradeSingleChoice = (question: Question) => {
  if (question.type !== 'single-choice')
    return { score: 0, feedback: '题目类型错误' };

  if (question.userAnswer === question.correctAnswer) {
    return { score: 10, feedback: '回答正确！' };
  }

  return {
    score: 0,
    feedback: `回答错误，正确答案是选项${String.fromCharCode(65 + question.correctAnswer)}`,
  };
};

/**
 * 计算多选题得分
 * @param question 题目对象
 * @returns 得分和反馈
 */
const gradeMultipleChoice = (question: Question) => {
  if (question.type !== 'multiple-choice')
    return { score: 0, feedback: '题目类型错误' };

  const userAnswers = question.userAnswer || [];
  const correctAnswers = question.correctAnswers;

  if (
    JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswers.sort())
  ) {
    return { score: 10, feedback: '回答完全正确！' };
  }

  return { score: 5, feedback: '部分正确，请检查答案' };
};

/**
 * 计算其他题型得分
 * @param question 题目对象
 * @returns 得分和反馈
 */
const gradeOtherQuestion = (question: Question) => {
  const score = question.userAnswer ? 8 : 0;
  const feedback = question.userAnswer ? '回答合理，给予部分分数' : '未作答';
  return { score, feedback };
};

/**
 * 题目评分器映射表
 */
const questionGraders = {
  'single-choice': gradeSingleChoice,
  'multiple-choice': gradeMultipleChoice,
} as const;

/**
 * 模拟LLM API调用 - 批改试卷
 * 当LLM配置不完整时使用的备用方案
 * @param quiz 待批改的试卷
 * @returns 批改结果
 */
export const mockGradeQuiz = async (quiz: Quiz): Promise<GradingResult> => {
  // 模拟网络延迟
  await delay(3000);

  const results = quiz.questions.map(question => {
    const grader =
      questionGraders[question.type as keyof typeof questionGraders];
    const { score, feedback } = grader
      ? grader(question)
      : gradeOtherQuestion(question);

    return {
      questionId: question.id,
      score,
      feedback,
    };
  });

  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const maxScore = quiz.questions.length * 10;

  // 生成总体评价
  const getOverallFeedback = (score: number, max: number): string => {
    const percentage = score / max;
    if (percentage >= 0.8) return '优秀';
    if (percentage >= 0.6) return '良好';
    return '需要改进';
  };

  return {
    totalScore,
    maxScore,
    results,
    overallFeedback: `总体表现${getOverallFeedback(totalScore, maxScore)}，继续努力！`,
  };
};
