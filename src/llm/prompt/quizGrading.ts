/**
 * 试卷批改提示词模板
 * 用于指导LLM批改试卷并生成评分结果
 */

import type { Quiz, Question, GradingResult } from '@/types';
import { safeParseJSON } from '../utils/jsonUtils';

/**
 * 题型批改说明
 */
const GRADING_INSTRUCTIONS = {
  'single-choice': {
    name: '单选题',
    instruction:
      '对于单选题，如果用户选择的答案索引与正确答案索引完全一致，给满分；否则给0分。',
    scoring: '满分10分，答对得10分，答错得0分',
  },
  'multiple-choice': {
    name: '多选题',
    instruction:
      '对于多选题，如果用户选择的所有答案索引与正确答案索引完全一致，给满分；部分正确给部分分数；完全错误给0分。',
    scoring: '满分10分，全对得10分，部分对得5分，全错得0分',
  },
  'fill-blank': {
    name: '填空题',
    instruction:
      '对于填空题，逐个比较用户填写的答案与标准答案，可以适当考虑同义词、不同表达方式。每个空白按比例给分。',
    scoring: '满分10分，按空白数量平均分配，每个空白答对得相应分数',
  },
  'short-answer': {
    name: '简答题',
    instruction:
      '对于简答题，需要综合评估答案的准确性、完整性和逻辑性。参考标准答案，但允许合理的不同表达。',
    scoring:
      '满分10分，根据答案质量给分：优秀(9-10分)、良好(7-8分)、一般(5-6分)、较差(1-4分)、未答(0分)',
  },
  'code-output': {
    name: '代码输出题',
    instruction:
      '对于代码输出题，严格比较用户答案与正确输出，注意格式、换行、空格等细节。',
    scoring:
      '满分10分，输出完全正确得10分，格式有小问题得8分，部分正确得5分，完全错误得0分',
  },
  'code-writing': {
    name: '代码编写题',
    instruction:
      '对于代码编写题，评估代码的正确性、逻辑性、代码风格。即使实现方式不同，只要逻辑正确就应该给分。',
    scoring:
      '满分10分，功能完全正确且代码优雅(9-10分)、功能正确但代码一般(7-8分)、部分功能正确(5-6分)、逻辑有问题(1-4分)、未答或完全错误(0分)',
  },
} as const;

/**
 * 生成系统提示词
 */
function generateGradingSystemPrompt(): string {
  return `你是一个专业的教育评估专家，负责批改学生的试卷答案。

你的任务是：
1. 仔细分析每道题的用户答案
2. 与标准答案或参考答案进行比较
3. 给出合理的分数和详细的反馈
4. 生成总体评价

评分原则：
- 客观公正，严格按照评分标准
- 鼓励学生，给出建设性反馈
- 对于主观题，允许合理的不同观点和表达方式
- 注重答案的准确性、完整性和逻辑性

输出要求：
- 必须严格按照指定的JSON格式输出
- 每道题都要给出分数和反馈
- 总体反馈要有针对性和指导意义
- 只输出JSON数据，不要包含其他文字`;
}

/**
 * 生成题目详情字符串
 */
function generateQuestionDetails(question: Question): string {
  let details = `题目ID: ${question.id}\n题目类型: ${question.type}\n题目内容: ${question.question}\n`;

  switch (question.type) {
    case 'single-choice':
      details += `选项: ${question.options.join(', ')}\n`;
      details += `正确答案: 选项${question.correctAnswer} (${question.options[question.correctAnswer]})\n`;
      details += `用户答案: ${question.userAnswer !== undefined ? `选项${question.userAnswer} (${question.options[question.userAnswer] || '无效选项'})` : '未作答'}\n`;
      break;

    case 'multiple-choice':
      details += `选项: ${question.options.join(', ')}\n`;
      details += `正确答案: ${question.correctAnswers.map(i => `选项${i} (${question.options[i]})`).join(', ')}\n`;
      details += `用户答案: ${question.userAnswer && question.userAnswer.length > 0 ? question.userAnswer.map(i => `选项${i} (${question.options[i] || '无效选项'})`).join(', ') : '未作答'}\n`;
      break;

    case 'fill-blank':
      details += `正确答案: ${question.correctAnswers.join(', ')}\n`;
      details += `用户答案: ${question.userAnswer && question.userAnswer.length > 0 ? question.userAnswer.join(', ') : '未作答'}\n`;
      break;

    case 'short-answer':
      details += `参考答案: ${question.referenceAnswer}\n`;
      details += `用户答案: ${question.userAnswer || '未作答'}\n`;
      break;

    case 'code-output':
      details += `代码:\n${question.code}\n`;
      details += `正确输出: ${question.correctOutput}\n`;
      details += `用户答案: ${question.userAnswer || '未作答'}\n`;
      break;

    case 'code-writing':
      details += `编程语言: ${question.language}\n`;
      details += `参考代码:\n${question.referenceCode}\n`;
      details += `用户代码:\n${question.userAnswer || '未作答'}\n`;
      break;
  }

  return details;
}

/**
 * 生成用户提示词
 */
function generateGradingUserPrompt(quiz: Quiz): string {
  const questionsDetails = quiz.questions
    .map((question, index) => {
      const typeInstruction = GRADING_INSTRUCTIONS[question.type];
      return `=== 第${index + 1}题 (${typeInstruction.name}) ===\n${generateQuestionDetails(question)}\n评分说明: ${typeInstruction.instruction}\n${typeInstruction.scoring}`;
    })
    .join('\n\n');

  const totalQuestions = quiz.questions.length;
  const maxScore = totalQuestions * 10;

  return `请批改以下试卷：

试卷标题: ${quiz.title}
总题数: ${totalQuestions}道
总分: ${maxScore}分

题目详情:
${questionsDetails}

请按照以下JSON格式输出批改结果：
{
  "totalScore": 总得分(数字),
  "maxScore": ${maxScore},
  "results": [
    {
      "questionId": "题目ID",
      "score": 得分(数字),
      "feedback": "详细反馈(字符串)"
    }
    // ... 每道题一个对象
  ],
  "overallFeedback": "总体评价和建议(字符串)"
}

注意事项：
1. 严格按照各题型的评分标准给分
2. 反馈要具体、有建设性
3. 总体评价要综合学生的整体表现
4. 只输出JSON格式，不要包含其他文字
5. 确保JSON格式正确，可以被直接解析
6. 分数必须是数字类型，不要用字符串`;
}

/**
 * 生成完整的批改提示词消息数组
 */
export function generateGradingPrompt(quiz: Quiz) {
  return [
    {
      role: 'system' as const,
      content: generateGradingSystemPrompt(),
    },
    {
      role: 'user' as const,
      content: generateGradingUserPrompt(quiz),
    },
  ];
}

/**
 * 验证批改结果JSON格式
 */
export function validateGradingJSON(jsonStr: string): {
  isValid: boolean;
  error?: string;
  result?: GradingResult;
} {
  const result = safeParseJSON<Record<string, unknown>>(jsonStr);

  if (!result) {
    return {
      isValid: false,
      error: 'JSON解析失败：无效的JSON格式或包含markdown代码块标记',
    };
  }

  try {
    // 基础字段验证
    if (
      typeof result.totalScore !== 'number' ||
      typeof result.maxScore !== 'number' ||
      !Array.isArray(result.results) ||
      typeof result.overallFeedback !== 'string'
    ) {
      return {
        isValid: false,
        error:
          '批改结果JSON缺少必要字段或字段类型错误：totalScore(number), maxScore(number), results(array), overallFeedback(string)',
      };
    }

    // 验证每个题目的批改结果
    for (let i = 0; i < result.results.length; i++) {
      const questionResult = result.results[i];
      if (
        !questionResult.questionId ||
        typeof questionResult.score !== 'number' ||
        typeof questionResult.feedback !== 'string'
      ) {
        return {
          isValid: false,
          error: `第${i + 1}道题的批改结果格式错误：缺少questionId, score(number), feedback(string)字段`,
        };
      }

      // 验证分数范围
      if (questionResult.score < 0 || questionResult.score > 10) {
        return {
          isValid: false,
          error: `第${i + 1}道题的分数超出范围(0-10)：${questionResult.score}`,
        };
      }
    }

    // 验证总分计算
    const calculatedTotal = result.results.reduce(
      (sum: number, r: { score: number }) => sum + r.score,
      0
    );
    if (Math.abs(calculatedTotal - result.totalScore) > 0.1) {
      return {
        isValid: false,
        error: `总分计算错误：期望${calculatedTotal}，实际${result.totalScore}`,
      };
    }

    return {
      isValid: true,
      result: result as unknown as GradingResult,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `JSON解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
}
