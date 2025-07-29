/**
 * JSON 验证器模块
 * 提供 JSON 对象验证功能
 */

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
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
): ValidationResult {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === undefined || obj[field] === null) {
      missingFields.push(field);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * 验证对象是否为有效的题目对象
 * @param obj 待验证的对象
 * @returns 是否为有效题目
 */
export function isValidQuestion(obj: Record<string, unknown>): boolean {
  const requiredFields = ['id', 'type', 'question'];
  const { isValid } = validateRequiredFields(obj, requiredFields);
  return isValid;
}

/**
 * 验证数组中的所有元素是否都是有效题目
 * @param questions 题目数组
 * @returns 验证结果
 */
export function validateQuestions(questions: unknown[]): ValidationResult {
  const missingFields: string[] = [];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    if (typeof question !== 'object' || question === null) {
      missingFields.push(`questions[${i}]: 不是有效对象`);
      continue;
    }

    if (!isValidQuestion(question as Record<string, unknown>)) {
      missingFields.push(`questions[${i}]: 缺少必需字段`);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * 验证试卷JSON结构
 * @param obj 待验证的试卷对象
 * @returns 验证结果
 */
export function validateQuizStructure(
  obj: Record<string, unknown>
): ValidationResult {
  const requiredFields = ['title', 'description', 'questions'];
  const baseValidation = validateRequiredFields(obj, requiredFields);

  if (!baseValidation.isValid) {
    return baseValidation;
  }

  // 验证questions字段是否为数组
  if (!Array.isArray(obj.questions)) {
    return {
      isValid: false,
      missingFields: ['questions: 必须是数组'],
    };
  }

  // 验证题目数组
  const questionsValidation = validateQuestions(obj.questions as unknown[]);
  return questionsValidation;
}
