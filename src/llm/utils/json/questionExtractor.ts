/**
 * 题目提取器模块
 * 专门处理流式内容中的题目提取和解析
 */

import { fixIncompleteJSON } from './parser';
import { isValidQuestion } from './validator';

/**
 * 题目提取结果接口
 */
export interface QuestionExtractionResult {
  completeQuestions: Record<string, unknown>[];
  remainingContent: string;
  partialQuestion?: Partial<Record<string, unknown>>;
}

/**
 * 检测并提取已完整的题目
 * @param content 流式内容
 * @returns 已完整的题目数组和剩余内容
 */
export function extractCompleteQuestions(
  content: string
): QuestionExtractionResult {
  // 寻找questions数组开始
  const questionsStart = content.indexOf('"questions": [');
  if (questionsStart === -1) {
    return { completeQuestions: [], remainingContent: content };
  }

  const questionsContent = content.slice(questionsStart + 14); // 跳过 "questions": [
  const completeQuestions: Record<string, unknown>[] = [];
  let currentPos = 0;
  let braceCount = 0;
  let inString = false;
  let questionStart = -1;
  let escapeNext = false;

  // 逐字符解析，寻找完整的题目对象
  for (let i = 0; i < questionsContent.length; i++) {
    const char = questionsContent[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
    }

    if (!inString) {
      if (char === '{') {
        if (braceCount === 0) questionStart = i;
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0 && questionStart !== -1) {
          // 找到完整题目
          const questionJson = questionsContent.slice(questionStart, i + 1);
          try {
            const question = JSON.parse(questionJson);
            if (isValidQuestion(question)) {
              completeQuestions.push(question);
              currentPos = i + 1;
            }
          } catch {
            // JSON解析失败，继续
          }
          questionStart = -1;
        }
      }
    }
  }

  // 提取部分题目（如果有）
  let partialQuestion: Partial<Record<string, unknown>> | undefined;
  if (questionStart !== -1) {
    const partialJson = questionsContent.slice(questionStart);
    try {
      // 尝试修复并解析部分JSON
      const fixedJson = fixIncompleteJSON(partialJson);
      partialQuestion = JSON.parse(fixedJson);
    } catch {
      // 解析失败，提取可显示的文本
      partialQuestion = { question: extractPartialText(partialJson) };
    }
  }

  return {
    completeQuestions,
    remainingContent: questionsContent.slice(currentPos),
    partialQuestion,
  };
}

/**
 * 从部分JSON中提取可显示的文本
 * @param partialJson 部分JSON字符串
 * @returns 可显示的文本
 */
export function extractPartialText(partialJson: string): string {
  const questionMatch = partialJson.match(/"question":\s*"([^"]*)/);
  return questionMatch ? questionMatch[1] : '正在生成题目...';
}

/**
 * 计算题目总数
 * @param request 生成请求
 * @returns 题目总数
 */
export function getTotalQuestionCount(
  request: Record<string, unknown>
): number {
  const questionConfigs = request.questionConfigs as
    | Array<{ count: number }>
    | undefined;
  return (
    questionConfigs?.reduce(
      (sum: number, config: { count: number }) => sum + config.count,
      0
    ) || 0
  );
}

/**
 * 从内容中提取题目进度信息
 * @param content 流式内容
 * @param totalCount 总题目数
 * @returns 进度信息
 */
export function extractQuestionProgress(
  content: string,
  totalCount: number
): {
  completed: number;
  total: number;
  percentage: number;
} {
  const { completeQuestions } = extractCompleteQuestions(content);
  const completed = completeQuestions.length;
  const percentage =
    totalCount > 0 ? Math.round((completed / totalCount) * 100) : 0;

  return {
    completed,
    total: totalCount,
    percentage,
  };
}
