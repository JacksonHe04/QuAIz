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