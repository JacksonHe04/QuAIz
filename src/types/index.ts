// ================================
// MVP 基础类型定义
// ================================

/** MVP 题目类型 */
export enum QuestionType {
  SINGLE_CHOICE = 'single-choice', // 单选题
  MULTIPLE_CHOICE = 'multiple-choice', // 多选题
  FILL_BLANK = 'fill-blank', // 填空题
  SHORT_ANSWER = 'short-answer', // 简答题
  CODE_OUTPUT = 'code-output', // 看代码写输出题
  CODE_WRITING = 'code-writing', // 代码手写题
}

// ================================
// 用户生成请求
// ================================

/** 题型数量配置 */
export interface QuestionConfig {
  type: QuestionType;
  count: number;
}

/** 用户生成请求 */
export interface GenerationRequest {
  subject: string; // 学科/主题
  description: string; // 用户描述
  questionConfigs: QuestionConfig[]; // 题型配置
}

// ================================
// 预设方案
// ================================

/** 题型方案预设 */
export interface QuestionPreset {
  id: string; // 预设唯一标识
  name: string; // 预设名称
  description?: string; // 预设描述
  subject: string; // 学科/主题
  description_content?: string; // 详细描述内容
  questionConfigs: QuestionConfig[]; // 题型配置
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

// ================================
// 题目定义
// ================================

/** 单选题 */
export interface SingleChoiceQuestion {
  id: string;
  type: QuestionType.SINGLE_CHOICE;
  question: string; // 题目内容
  options: string[]; // 选项数组
  correctAnswer: number; // 正确答案索引
  userAnswer?: number; // 用户答案索引
}

/** 多选题 */
export interface MultipleChoiceQuestion {
  id: string;
  type: QuestionType.MULTIPLE_CHOICE;
  question: string;
  options: string[];
  correctAnswers: number[]; // 正确答案索引数组
  userAnswer?: number[]; // 用户答案索引数组
}

/** 填空题 */
export interface FillBlankQuestion {
  id: string;
  type: QuestionType.FILL_BLANK;
  question: string; // 带 ___ 的题目内容
  correctAnswers: string[]; // 按顺序的正确答案
  userAnswer?: string[]; // 用户填写的答案
}

/** 简答题 */
export interface ShortAnswerQuestion {
  id: string;
  type: QuestionType.SHORT_ANSWER;
  question: string;
  referenceAnswer: string; // 参考答案
  userAnswer?: string; // 用户答案
}

/** 看代码写输出题 */
export interface CodeOutputQuestion {
  id: string;
  type: QuestionType.CODE_OUTPUT;
  question: string; // 题目描述
  code: string; // 代码内容
  correctOutput: string; // 正确输出
  userAnswer?: string; // 用户答案
}

/** 代码手写题 */
export interface CodeWritingQuestion {
  id: string;
  type: QuestionType.CODE_WRITING;
  question: string; // 题目要求
  language: string; // 编程语言
  referenceCode: string; // 参考代码
  userAnswer?: string; // 用户代码
}

/** 联合题目类型 */
export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | FillBlankQuestion
  | ShortAnswerQuestion
  | CodeOutputQuestion
  | CodeWritingQuestion;

// ================================
// 试卷和会话
// ================================

/** 试卷 */
export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: number;
}

/** 批改结果 */
export interface GradingResult {
  totalScore: number; // 总得分
  maxScore: number; // 总分
  results: {
    questionId: string;
    score: number;
    feedback: string;
  }[];
  overallFeedback: string; // 总体评价
}

// ================================
// 应用状态
// ================================

/** 生成状态 */
export interface GenerationState {
  status: 'idle' | 'generating' | 'complete' | 'error';
  currentQuiz: Quiz | null;
  error: string | null;
  progress?: number; // 生成进度 0-100
  streamingQuestions?: Question[]; // 流式生成的题目
  completedQuestionCount?: number; // 已完成的题目数量
}

/** 答题状态 */
export interface AnsweringState {
  currentQuestionIndex: number;
  isSubmitted: boolean;
}

/** 批改状态 */
export interface GradingState {
  status: 'idle' | 'grading' | 'complete' | 'error';
  result: GradingResult | null;
  error: string | null;
  progress?: number; // 批改进度 0-100
}

/** 全局状态 */
export interface AppState {
  generation: GenerationState;
  answering: AnsweringState;
  grading: GradingState;
}

// ================================
// API 响应格式
// ================================

/** LLM 生成响应 */
export interface LLMQuizResponse {
  quiz: Quiz;
}

/** LLM 批改响应 */
export interface LLMGradingResponse {
  grading: GradingResult;
}

// ================================
// 工具类型
// ================================

// 流式输出回调类型
export type StreamCallback<T = Quiz | GradingResult> = (
  partialData: T,
  progress: number
) => void;

/** 题目类型判断 */
export const isQuestionType = <T extends QuestionType>(
  question: Question,
  type: T
): question is Extract<Question, { type: T }> => {
  return question.type === type;
};

// 所有类型已通过 export interface 直接导出
