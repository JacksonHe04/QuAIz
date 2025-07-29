import React from 'react';

interface Props {
  onReset: () => void;
}

/**
 * 空批改结果状态组件
 * 当未找到批改结果时显示
 */
export const EmptyResultState: React.FC<Props> = ({ onReset }) => {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>
          未找到批改结果
        </h2>
        <p className='text-gray-600 mb-4'>请先完成答题并提交</p>
        <button
          onClick={onReset}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          返回首页
        </button>
      </div>
    </div>
  );
};
