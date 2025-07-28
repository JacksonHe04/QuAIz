/**
 * JSON 处理工具模块
 * 提供通用的 JSON 提取、修复和验证功能
 */

/**
 * JSON 提取结果接口
 */
export interface JSONExtractionResult {
  json: string | null;
  isComplete: boolean;
}

/**
 * 从流式输出中提取 JSON
 * @param content 流式内容
 * @returns JSON 提取结果
 */
export function extractJSONFromStream(content: string): JSONExtractionResult {
  // 寻找JSON开始标记
  const jsonStart = content.indexOf('{');
  if (jsonStart === -1) {
    return { json: null, isComplete: false };
  }
  
  // 从JSON开始位置截取内容
  const jsonContent = content.slice(jsonStart);
  
  // 尝试找到完整的JSON结构
  let braceCount = 0;
  let jsonEnd = -1;
  
  for (let i = 0; i < jsonContent.length; i++) {
    const char = jsonContent[i];
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0) {
        jsonEnd = i;
        break;
      }
    }
  }
  
  if (jsonEnd === -1) {
    // JSON还未完整
    return { json: jsonContent, isComplete: false };
  }
  
  // 提取完整的JSON
  const completeJSON = jsonContent.slice(0, jsonEnd + 1);
  return { json: completeJSON, isComplete: true };
}

/**
 * 修复不完整的 JSON 字符串
 * @param jsonStr 待修复的 JSON 字符串
 * @param arrayField 可选的数组字段名，用于特殊处理数组闭合
 * @returns 修复后的 JSON 字符串
 */
export function fixIncompleteJSON(jsonStr: string, arrayField?: string): string {
  let fixedJson = jsonStr;
  
  // 移除末尾逗号
  fixedJson = fixedJson.replace(/,\s*$/, '');
  
  // 如果指定了数组字段，尝试闭合数组
  if (arrayField && fixedJson.includes(`"${arrayField}": [`)) {
    if (!fixedJson.includes(']}')) {
      // 简单的数组闭合逻辑
      const arrayStart = fixedJson.indexOf(`"${arrayField}": [`);
      const afterArray = fixedJson.slice(arrayStart + arrayField.length + 5);
      
      // 计算未闭合的括号
      let bracketCount = 1;
      let lastValidPos = arrayStart + arrayField.length + 5;
      
      for (let i = 0; i < afterArray.length; i++) {
        const char = afterArray[i];
        if (char === '[') bracketCount++;
        else if (char === ']') {
          bracketCount--;
          if (bracketCount === 0) {
            lastValidPos = arrayStart + arrayField.length + 5 + i;
            break;
          }
        }
      }
      
      if (bracketCount > 0) {
        fixedJson = fixedJson.slice(0, lastValidPos + 1) + ']}';
      }
    }
  }
  
  return fixedJson;
}

/**
 * 安全解析 JSON 字符串
 * @param jsonStr JSON 字符串
 * @returns 解析结果，失败时返回 null
 */
export function safeParseJSON<T = unknown>(jsonStr: string): T | null {
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}

/**
 * 验证 JSON 对象是否包含必需字段
 * @param obj 待验证的对象
 * @param requiredFields 必需字段列表
 * @returns 验证结果
 */
export function validateRequiredFields(
  obj: Record<string, unknown>, 
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * 题目完整性检测结果接口
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
export function extractCompleteQuestions(content: string): QuestionExtractionResult {
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
            if (question.id && question.type && question.question) {
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
    partialQuestion
  };
}

/**
 * 从部分JSON中提取可显示的文本
 * @param partialJson 部分JSON字符串
 * @returns 可显示的文本
 */
export function extractPartialText(partialJson: string): string {
  const questionMatch = partialJson.match(/"question":\s*"([^"]*)/)
  return questionMatch ? questionMatch[1] : '正在生成题目...';
}

/**
 * 计算题目总数
 * @param request 生成请求
 * @returns 题目总数
 */
export function getTotalQuestionCount(request: Record<string, unknown>): number {
  const questionConfigs = request.questionConfigs as Array<{ count: number }> | undefined;
  return questionConfigs?.reduce((sum: number, config: { count: number }) => sum + config.count, 0) || 0;
}