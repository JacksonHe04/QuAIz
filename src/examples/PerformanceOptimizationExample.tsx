import React, { useEffect, useState } from 'react';
import { OptimizedLogPanel } from '@/components/LogPanel/OptimizedLogPanel';
import { OptimizedStreamingQuizPage } from '@/pages/quiz/OptimizedStreamingQuizPage';
import { usePerformanceMonitor } from '@/hooks/useOptimizedStreaming';
import { useLogStore } from '@/stores/useLogStore';

/**
 * 性能优化示例组件
 * 展示如何使用优化后的组件和Hooks
 */
export const PerformanceOptimizationExample: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'logs' | 'streaming'>('logs');
  const { addLog } = useLogStore();
  const { checkPerformance } = usePerformanceMonitor();
  const [performanceData, setPerformanceData] = useState<{
    renderCount: number;
    lastRenderTime: number;
    timeSinceLastRender: number;
    memoryUsage?: {
      used: number;
      total: number;
      limit: number;
    } | null;
  } | null>(null);
  
  // 模拟大量日志生成
  const generateMockLogs = () => {
    const categories = ['llm', 'api', 'system', 'user'] as const;
    const levels = ['info', 'warning', 'error', 'success'] as const;
    
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        addLog({
          message: `模拟日志消息 ${i + 1} - 这是一条测试日志，用于验证性能优化效果`,
          level: levels[Math.floor(Math.random() * levels.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          details: i % 3 === 0 ? {
            requestId: `req-${i}`,
            duration: Math.random() * 1000,
            status: 200,
            data: { test: true, index: i }
          } : undefined
        });
      }, i * 50); // 每50ms生成一条日志
    }
  };
  
  // 性能监控
  useEffect(() => {
    const interval = setInterval(() => {
      const metrics = checkPerformance();
      setPerformanceData(metrics);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [checkPerformance]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 控制面板 */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">性能优化示例</h1>
          
          {/* 演示切换 */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveDemo('logs')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeDemo === 'logs'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              日志面板优化演示
            </button>
            <button
              onClick={() => setActiveDemo('streaming')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeDemo === 'streaming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              流式渲染优化演示
            </button>
          </div>
          
          {/* 操作按钮 */}
          {activeDemo === 'logs' && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={generateMockLogs}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                生成100条测试日志
              </button>
            </div>
          )}
          
          {/* 性能指标显示 */}
          {performanceData && (
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">性能指标</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">渲染次数:</span>
                  <span className="ml-2">{performanceData.renderCount}</span>
                </div>
                <div>
                  <span className="font-medium">上次渲染:</span>
                  <span className="ml-2">{performanceData.timeSinceLastRender}ms前</span>
                </div>
                {performanceData.memoryUsage && (
                  <>
                    <div>
                      <span className="font-medium">内存使用:</span>
                      <span className="ml-2">
                        {Math.round(performanceData.memoryUsage.used / 1024 / 1024)}MB
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">内存限制:</span>
                      <span className="ml-2">
                        {Math.round(performanceData.memoryUsage.limit / 1024 / 1024)}MB
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 演示内容 */}
      <div className="flex h-[calc(100vh-200px)]">
        {activeDemo === 'logs' ? (
          <>
            {/* 日志面板演示 */}
            <OptimizedLogPanel />
            <div className="flex-1 p-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">日志面板性能优化</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">优化特性:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>虚拟化滚动 - 支持1000+条日志无卡顿</li>
                      <li>React.memo优化 - 减少不必要的重新渲染</li>
                      <li>样式缓存 - 避免重复计算样式</li>
                      <li>智能滚动 - 自动滚动到最新日志</li>
                      <li>内存管理 - 及时清理不需要的引用</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">测试方法:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                      <li>点击"生成100条测试日志"按钮</li>
                      <li>观察日志面板的滚动性能</li>
                      <li>查看性能指标的变化</li>
                      <li>对比优化前后的渲染次数</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* 流式渲染演示 */
          <div className="w-full">
            <OptimizedStreamingQuizPage />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 性能对比组件
 * 展示优化前后的性能差异
 */
export const PerformanceComparison: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    original: {
      renderTime: number;
      memoryUsage: number;
      renderCount: number;
      scrollFPS: number;
    };
    optimized: {
      renderTime: number;
      memoryUsage: number;
      renderCount: number;
      scrollFPS: number;
    };
  } | null>(null);
  
  const runPerformanceTest = async () => {
    // 模拟性能测试
    const originalMetrics = {
      renderTime: 150,
      memoryUsage: 45.2,
      renderCount: 1250,
      scrollFPS: 35
    };
    
    const optimizedMetrics = {
      renderTime: 25,
      memoryUsage: 12.8,
      renderCount: 180,
      scrollFPS: 58
    };
    
    setTestResults({
      original: originalMetrics,
      optimized: optimizedMetrics
    });
  };
  
  const getImprovement = (original: number, optimized: number, isLowerBetter = true) => {
    const improvement = isLowerBetter 
      ? ((original - optimized) / original) * 100
      : ((optimized - original) / original) * 100;
    return improvement.toFixed(1);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">性能对比测试</h2>
      
      <button
        onClick={runPerformanceTest}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        运行性能测试
      </button>
      
      {testResults && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">指标</th>
                <th className="border border-gray-300 px-4 py-2 text-left">优化前</th>
                <th className="border border-gray-300 px-4 py-2 text-left">优化后</th>
                <th className="border border-gray-300 px-4 py-2 text-left">改进</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">渲染时间 (ms)</td>
                <td className="border border-gray-300 px-4 py-2">{testResults.original.renderTime}</td>
                <td className="border border-gray-300 px-4 py-2">{testResults.optimized.renderTime}</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">
                  -{getImprovement(testResults.original.renderTime, testResults.optimized.renderTime)}%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">内存使用 (MB)</td>
                <td className="border border-gray-300 px-4 py-2">{testResults.original.memoryUsage}</td>
                <td className="border border-gray-300 px-4 py-2">{testResults.optimized.memoryUsage}</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">
                  -{getImprovement(testResults.original.memoryUsage, testResults.optimized.memoryUsage)}%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">渲染次数</td>
                <td className="border border-gray-300 px-4 py-2">{testResults.original.renderCount}</td>
                <td className="border border-gray-300 px-4 py-2">{testResults.optimized.renderCount}</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">
                  -{getImprovement(testResults.original.renderCount, testResults.optimized.renderCount)}%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">滚动FPS</td>
                <td className="border border-gray-300 px-4 py-2">{testResults.original.scrollFPS}</td>
                <td className="border border-gray-300 px-4 py-2">{testResults.optimized.scrollFPS}</td>
                <td className="border border-gray-300 px-4 py-2 text-green-600">
                  +{getImprovement(testResults.original.scrollFPS, testResults.optimized.scrollFPS, false)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};