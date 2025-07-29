/**
 * 试卷生成相关的Actions
 * @deprecated 请直接从 './generation' 模块导入相关功能
 * 此文件保留用于向后兼容性
 */

// 重新导出新模块的所有功能
export * from './generation';

// 为了完全向后兼容，保留原有的导入方式
export type { GenerationActions, StreamingQuestion } from './generation';
export { createGenerationActions } from './generation';
