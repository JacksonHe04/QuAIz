/**
 * 时间记录状态测试文件
 * 用于调试从流式生成页面跳转到答题页面后时间记录按钮消失的问题
 */

import {
  useTimeRecorderStore,
  syncTimeRecorderWithAppState,
} from '@/stores/timeRecorderStore';

/**
 * 模拟生成状态变化的测试函数
 */
export function testTimeRecorderStateTransition() {
  console.log('=== 时间记录状态测试开始 ===');

  // 获取初始状态
  const initialState = useTimeRecorderStore.getState();
  console.log('初始状态:', initialState);

  // 模拟生成开始
  console.log('\n1. 模拟生成开始...');
  const startTime = Date.now();
  syncTimeRecorderWithAppState({
    status: 'generating',
    startTime: startTime,
  });
  const generatingState = useTimeRecorderStore.getState();
  console.log('生成中状态:', generatingState);

  // 模拟生成完成
  console.log('\n2. 模拟生成完成...');
  const endTime = startTime + 5000; // 5秒后完成
  const duration = endTime - startTime;
  syncTimeRecorderWithAppState({
    status: 'complete', // 使用正确的状态值
    startTime: startTime,
    endTime: endTime,
    duration: duration,
  });
  const completedState = useTimeRecorderStore.getState();
  console.log('完成状态:', completedState);

  // 模拟跳转到答题页面（generation状态变为idle）
  console.log('\n3. 模拟跳转到答题页面（generation状态变为idle）...');
  syncTimeRecorderWithAppState({
    status: 'idle',
  });
  const idleState = useTimeRecorderStore.getState();
  console.log('idle状态:', idleState);

  // 检查问题
  console.log('\n=== 问题分析 ===');
  if (!idleState.startTime) {
    console.error('❌ 问题确认：startTime被重置为null，导致时间记录按钮消失');
    console.log(
      '期望行为：即使generation状态为idle，时间记录状态应该保持completed状态'
    );
  } else {
    console.log('✅ 状态正常：时间记录状态得到保持');
  }

  console.log('=== 测试结束 ===');

  return {
    initialState,
    generatingState,
    completedState,
    idleState,
  };
}

/**
 * 测试组件显示逻辑
 */
export function testComponentDisplayLogic() {
  console.log('\n=== 组件显示逻辑测试 ===');

  const testCases = [
    {
      startTime: null,
      status: 'idle',
      expected: false,
      desc: '无开始时间且状态为idle',
    },
    {
      startTime: null,
      status: 'generating',
      expected: true,
      desc: '无开始时间但状态为generating',
    },
    {
      startTime: Date.now(),
      status: 'idle',
      expected: true,
      desc: '有开始时间且状态为idle',
    },
    {
      startTime: Date.now(),
      status: 'completed',
      expected: true,
      desc: '有开始时间且状态为completed',
    },
  ];

  testCases.forEach((testCase, index) => {
    const shouldShow = !(
      testCase.startTime === null && testCase.status === 'idle'
    );
    const result = shouldShow === testCase.expected ? '✅' : '❌';
    console.log(
      `${result} 测试${index + 1}: ${testCase.desc} - 应该${testCase.expected ? '显示' : '隐藏'}, 实际${shouldShow ? '显示' : '隐藏'}`
    );
  });
}

/**
 * 运行所有测试
 */
export function runAllTests() {
  console.clear();
  console.log('🧪 开始运行时间记录相关测试...');

  const stateResults = testTimeRecorderStateTransition();
  testComponentDisplayLogic();

  return stateResults;
}

// 定义测试函数对象
const testFunctions = {
  runAllTests,
  testTimeRecorderStateTransition,
  testComponentDisplayLogic,
};

// 如果在浏览器环境中，添加到全局对象以便在控制台中调用
if (typeof window !== 'undefined') {
  (
    window as typeof window & { timeRecorderTest: typeof testFunctions }
  ).timeRecorderTest = testFunctions;

  console.log('💡 测试函数已添加到全局对象，可在控制台中调用:');
  console.log('- timeRecorderTest.runAllTests()');
  console.log('- timeRecorderTest.testTimeRecorderStateTransition()');
  console.log('- timeRecorderTest.testComponentDisplayLogic()');
}
