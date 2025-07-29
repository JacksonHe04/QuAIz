/**
 * JSON 工具模块统一导出
 * 保持向后兼容性的同时提供模块化结构
 */

// 从解析器模块导出
export {
  extractJSONFromStream,
  fixIncompleteJSON,
  cleanLLMResponse,
  safeParseJSON,
  type JSONExtractionResult,
} from './parser';

// 从验证器模块导出
export {
  validateRequiredFields,
  isValidQuestion,
  validateQuestions,
  validateQuizStructure,
  type ValidationResult,
} from './validator';

// 从题目提取器模块导出
export {
  extractCompleteQuestions,
  extractPartialText,
  getTotalQuestionCount,
  extractQuestionProgress,
  type QuestionExtractionResult,
} from './questionExtractor';
