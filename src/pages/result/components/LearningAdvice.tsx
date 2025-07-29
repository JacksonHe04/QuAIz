import React from 'react';

interface Props {
  scorePercentage: number;
}

/**
 * 学习建议组件
 * 根据得分百分比显示不同的学习建议
 */
export const LearningAdvice: React.FC<Props> = ({ scorePercentage }) => {
  return (
    <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6'>
      <h3 className='font-medium text-blue-900 mb-3'>学习建议</h3>
      <div className='space-y-2 text-blue-800'>
        {scorePercentage >= 90 && (
          <p>
            🎉
            表现优秀！您已经很好地掌握了相关知识点，可以尝试更有挑战性的内容。
          </p>
        )}
        {scorePercentage >= 80 && scorePercentage < 90 && (
          <p>👍 表现良好！建议重点复习错误的题目，加深对相关概念的理解。</p>
        )}
        {scorePercentage >= 60 && scorePercentage < 80 && (
          <p>📚 基础掌握尚可，建议系统性地复习相关知识点，多做练习巩固。</p>
        )}
        {scorePercentage < 60 && (
          <p>💪 需要加强学习，建议从基础概念开始，逐步建立知识体系。</p>
        )}
        <p>💡 可以针对错误的题目类型，生成更多练习题进行专项训练。</p>
      </div>
    </div>
  );
};
