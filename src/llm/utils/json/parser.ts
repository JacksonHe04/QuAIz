/**
 * JSON 解析器模块
 * 提供基础的 JSON 解析和修复功能
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
 * @param content 流式内容（可能包含markdown代码块标记）
 * @returns JSON 提取结果
 */
export function extractJSONFromStream(content: string): JSONExtractionResult {
  // 预处理：移除可能的markdown代码块标记
  let processedContent = content;

  // 检查是否包含```json标记
  const jsonBlockStart = processedContent.indexOf('```json');
  if (jsonBlockStart !== -1) {
    // 找到```json后的内容
    processedContent = processedContent.slice(jsonBlockStart + 7);

    // 查找结束的```标记
    const blockEnd = processedContent.indexOf('```');
    if (blockEnd !== -1) {
      processedContent = processedContent.slice(0, blockEnd);
    }
  } else {
    // 检查是否有普通的```标记
    const blockStart = processedContent.indexOf('```');
    if (blockStart !== -1) {
      processedContent = processedContent.slice(blockStart + 3);
      const blockEnd = processedContent.indexOf('```');
      if (blockEnd !== -1) {
        processedContent = processedContent.slice(0, blockEnd);
      }
    }
  }

  // 寻找JSON开始标记
  const jsonStart = processedContent.indexOf('{');
  if (jsonStart === -1) {
    return { json: null, isComplete: false };
  }

  // 从JSON开始位置截取内容
  const jsonContent = processedContent.slice(jsonStart);

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
export function fixIncompleteJSON(
  jsonStr: string,
  arrayField?: string
): string {
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
 * 清理大模型返回的JSON字符串，移除markdown代码块标记
 * @param content 可能包含markdown代码块的内容
 * @returns 清理后的JSON字符串
 */
export function cleanLLMResponse(content: string): string {
  let cleanedContent = content.trim();

  // 移除```json开头和```结尾
  if (cleanedContent.startsWith('```json')) {
    cleanedContent = cleanedContent.slice(7);
  } else if (cleanedContent.startsWith('```')) {
    cleanedContent = cleanedContent.slice(3);
  }

  if (cleanedContent.endsWith('```')) {
    cleanedContent = cleanedContent.slice(0, -3);
  }

  return cleanedContent.trim();
}

/**
 * 安全解析 JSON 字符串
 * @param jsonStr JSON 字符串（可能被```json和```包装）
 * @returns 解析结果，失败时返回 null
 */
export function safeParseJSON<T = unknown>(jsonStr: string): T | null {
  try {
    // 使用cleanLLMResponse函数清理内容
    const cleanedJson = cleanLLMResponse(jsonStr);
    return JSON.parse(cleanedJson) as T;
  } catch {
    return null;
  }
}
