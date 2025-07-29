/**
 * 试卷生成提示词模板
 * 用于指导LLM生成符合项目要求的试卷JSON格式
 */

import type { GenerationRequest, Quiz } from '@/types';
import { safeParseJSON } from '../utils/jsonUtils';

/**
 * 题型说明映射
 */
const QUESTION_TYPE_DESCRIPTIONS = {
  'single-choice': {
    name: '单选题',
    description: '从多个选项中选择一个正确答案',
    format: `{
      "id": "q1",
      "type": "single-choice",
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswer": 0
    }`,
  },
  'multiple-choice': {
    name: '多选题',
    description: '从多个选项中选择多个正确答案',
    format: `{
      "id": "q2",
      "type": "multiple-choice",
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswers": [0, 2]
    }`,
  },
  'fill-blank': {
    name: '填空题',
    description: '在空白处填写正确答案，使用___表示空白',
    format: `{
      "id": "q3",
      "type": "fill-blank",
      "question": "题目内容，其中___表示需要填空的地方，可以有多个___。",
      "correctAnswers": ["答案1", "答案2"]
    }`,
  },
  'short-answer': {
    name: '简答题',
    description: '用文字回答问题',
    format: `{
      "id": "q4",
      "type": "short-answer",
      "question": "题目内容",
      "referenceAnswer": "参考答案"
    }`,
  },
  'code-output': {
    name: '代码输出题',
    description: '根据给定代码写出运行结果',
    format: `{
      "id": "q5",
      "type": "code-output",
      "question": "请写出以下代码的输出结果",
      "code": "console.log('Hello World');",
      "correctOutput": "Hello World"
    }`,
  },
  'code-writing': {
    name: '代码编写题',
    description: '编写代码实现指定功能',
    format: `{
      "id": "q6",
      "type": "code-writing",
      "question": "请编写一个函数实现指定功能",
      "language": "javascript",
      "referenceCode": "function example() {\n  return 'Hello World';\n}"
    }`,
  },
} as const;

/**
 * 生成系统提示词
 */
function generateSystemPrompt(): string {
  return `你是一个专业的教育测评专家，擅长根据用户需求生成高质量的试卷。

你的任务是根据用户提供的学科主题、描述和题型要求，生成一份完整的试卷。

重要要求：
1. 必须严格按照指定的JSON格式输出
2. 题目内容要准确、有教育价值
3. 难度适中，符合学习目标
4. 选项设计要合理，干扰项要有一定迷惑性
5. 代码题要确保语法正确，输出结果准确
6. 填空题的空白数量要与答案数组长度一致

输出格式要求：
- 只输出JSON格式的试卷数据，不要包含任何其他文字
- JSON必须是有效的，可以被直接解析
- 每个题目都必须包含id字段，格式为"q1", "q2"等
- 严格按照题型格式要求生成对应字段`;
}

/**
 * 生成用户提示词
 */
function generateUserPrompt(request: GenerationRequest): string {
  const { subject, description, questionConfigs } = request;

  // 构建题型要求说明
  const questionTypeRequirements = questionConfigs
    .map((config, index) => {
      const typeDesc = QUESTION_TYPE_DESCRIPTIONS[config.type];
      return `${index + 1}. ${typeDesc.name}：${config.count}道题
   格式示例：${typeDesc.format}`;
    })
    .join('\n\n');

  const totalQuestions = questionConfigs.reduce(
    (sum, config) => sum + config.count,
    0
  );

  return `请为以下学科主题生成试卷：

学科/主题：${subject}
用户描述：${description || '无特殊要求'}

题型要求（共${totalQuestions}道题）：
${questionTypeRequirements}

请生成符合以下JSON格式的试卷：
{
  "id": "quiz_${Date.now()}",
  "title": "${subject} - 练习题",
  "questions": [
    // 按照上述题型要求和格式生成对应数量的题目
  ],
  "createdAt": ${Date.now()}
}

注意：
1. 题目内容要与"${subject}"主题相关
2. 严格按照每种题型的JSON格式要求
3. 题目编号从q1开始递增
4. 只输出JSON数据，不要包含任何解释文字
5. 确保JSON格式正确，可以被直接解析`;
}

/**
 * 生成完整的提示词消息数组
 */
export function generateQuizPrompt(request: GenerationRequest) {
  return [
    {
      role: 'system' as const,
      content: generateSystemPrompt(),
    },
    {
      role: 'user' as const,
      content: generateUserPrompt(request),
    },
  ];
}

/**
 * 验证生成的试卷JSON格式
 */
export function validateQuizJSON(jsonStr: string): {
  isValid: boolean;
  error?: string;
  quiz?: Quiz;
} {
  const quiz = safeParseJSON<Record<string, unknown>>(jsonStr);

  if (!quiz) {
    return {
      isValid: false,
      error: 'JSON解析失败',
    };
  }

  try {
    // 基础字段验证
    if (!quiz.id || !quiz.title || !Array.isArray(quiz.questions)) {
      return {
        isValid: false,
        error: '试卷JSON缺少必要字段：id, title, questions',
      };
    }

    // 题目格式验证
    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      if (!question.id || !question.type || !question.question) {
        return {
          isValid: false,
          error: `第${i + 1}道题缺少必要字段：id, type, question`,
        };
      }

      // 根据题型验证特定字段
      switch (question.type) {
        case 'single-choice':
          if (
            !Array.isArray(question.options) ||
            typeof question.correctAnswer !== 'number'
          ) {
            return {
              isValid: false,
              error: `第${i + 1}道单选题格式错误：缺少options或correctAnswer字段`,
            };
          }
          break;
        case 'multiple-choice':
          if (
            !Array.isArray(question.options) ||
            !Array.isArray(question.correctAnswers)
          ) {
            return {
              isValid: false,
              error: `第${i + 1}道多选题格式错误：缺少options或correctAnswers字段`,
            };
          }
          break;
        case 'fill-blank':
          if (!Array.isArray(question.correctAnswers)) {
            return {
              isValid: false,
              error: `第${i + 1}道填空题格式错误：缺少correctAnswers字段`,
            };
          }
          break;
        case 'short-answer':
          if (!question.referenceAnswer) {
            return {
              isValid: false,
              error: `第${i + 1}道简答题格式错误：缺少referenceAnswer字段`,
            };
          }
          break;
        case 'code-output':
          if (!question.code || !question.correctOutput) {
            return {
              isValid: false,
              error: `第${i + 1}道代码输出题格式错误：缺少code或correctOutput字段`,
            };
          }
          break;
        case 'code-writing':
          if (!question.language || !question.referenceCode) {
            return {
              isValid: false,
              error: `第${i + 1}道代码编写题格式错误：缺少language或referenceCode字段`,
            };
          }
          break;
      }
    }

    return {
      isValid: true,
      quiz: quiz as unknown as Quiz,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `JSON解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}
