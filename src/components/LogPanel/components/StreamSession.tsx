import React from 'react';
import type { StreamSession } from '@/stores/useLogStore';
import { formatTimestamp, formatDuration } from '../utils/utils';
import { CopyButton } from './CopyButton';

/**
 * 流式会话组件属性
 */
interface StreamSessionProps {
  /** 流式会话数据 */
  session: StreamSession;
}

/**
 * 流式会话组件
 * 显示AI流式回复的会话信息
 */
export const StreamSessionComponent: React.FC<StreamSessionProps> = ({
  session,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className='border border-gray-200 rounded-lg mb-3 overflow-hidden'>
      {/* 会话头部 */}
      <div className='bg-gray-50 p-3 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-lg'>🤖</span>
            <div>
              <div className='text-sm font-medium'>
                {session.operation || '大模型对话'}
                {session.endTime ? (
                  <span className='ml-2 text-xs text-green-600'>✅ 已完成</span>
                ) : (
                  <span className='ml-2 text-xs text-blue-600'>🔄 进行中</span>
                )}
              </div>
              <div className='text-xs text-gray-500'>
                {formatTimestamp(session.startTime)} • 持续{' '}
                {formatDuration(session.startTime, session.endTime)} •
                {session.chunks.length} 片段
              </div>
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <CopyButton text={session.totalContent} title='复制全部内容' />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='p-1 rounded text-xs bg-gray-200 hover:bg-gray-300'
              title={isExpanded ? '收起详情' : '展开详情'}
            >
              {isExpanded ? '🔼' : '🔽'}
            </button>
          </div>
        </div>
      </div>

      {/* 会话内容 */}
      <div className='p-3'>
        {isExpanded ? (
          /* 详细模式：显示所有片段 */
          <div className='space-y-2'>
            {session.chunks.map((chunk, index) => (
              <div key={chunk.id} className='text-xs'>
                <div className='text-gray-400 mb-1'>
                  片段 {index + 1} • {formatTimestamp(chunk.timestamp)}
                </div>
                <div className='bg-gray-50 p-2 rounded font-mono text-sm whitespace-pre-wrap'>
                  {chunk.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 简洁模式：显示完整内容 */
          <div className='bg-gray-50 p-3 rounded font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto'>
            {session.totalContent || '暂无内容...'}
          </div>
        )}
      </div>
    </div>
  );
};
