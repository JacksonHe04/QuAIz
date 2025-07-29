import React, { useRef, useEffect, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { QuestionRenderer } from '@/components/Question/QuestionRenderer';
import { Menu } from 'lucide-react';
import {
  QuizHeader,
  QuizNavigation,
  EmptyQuizState,
  QuizPageLayout,
} from './components';
import { useQuizNavigation, useQuizSubmission, useQuizStatus } from './hooks';
import { FloatingButton } from '@/components/FloatingButton';
import { FloatingPanel } from '@/components/FloatingButton/FloatingPanel';
import { OptimizedFloatingTimeRecorder } from '@/components/TimeRecorder';

/**
 * 答题页面
 * 用户在此页面进行答题操作
 */
export const QuizPage: React.FC = () => {
  // 全局状态
  const { generation, resetApp } = useAppStore();
  const quiz = generation.currentQuiz;

  // 导航显示状态
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);

  // 题目导航
  const { currentQuestionIndex, goToQuestion } = useQuizNavigation();

  // 题目引用数组，用于滚动定位
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 答题提交
  const { handleAnswerChange, handleSubmitQuiz, isSubmitted } =
    useQuizSubmission();

  // 答题状态
  const { answeredCount, isQuestionAnswered } = useQuizStatus(quiz);

  /**
   * 滚动到指定题目
   * @param index 题目索引
   */
  const scrollToQuestion = (index: number) => {
    const questionElement = questionRefs.current[index];
    if (questionElement) {
      questionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  /**
   * 处理题目选择，包含滚动定位
   * @param index 题目索引
   */
  const handleQuestionSelect = (index: number) => {
    goToQuestion(index);
    scrollToQuestion(index);
  };

  // 当currentQuestionIndex变化时，自动滚动到对应题目
  useEffect(() => {
    scrollToQuestion(currentQuestionIndex);
  }, [currentQuestionIndex]);

  // 如果没有试卷，显示空状态
  if (!quiz) {
    return <EmptyQuizState onReset={resetApp} />;
  }

  return (
    <QuizPageLayout>
      {/* 顶部导航栏 */}
      <QuizHeader
        quiz={quiz}
        currentQuestionIndex={currentQuestionIndex}
        answeredCount={answeredCount}
        onReset={resetApp}
      />

      <div className='max-w-4xl mx-auto px-4 py-8 relative'>
        {/* 题目导航按钮 */}
        <FloatingButton
          icon={Menu}
          onClick={() => setIsNavigationVisible(!isNavigationVisible)}
          position='right'
          color='bg-blue-600'
          hoverColor='hover:bg-blue-700'
          title='题目导航'
          top='top-40'
        />

        {/* 浮动时间记录组件 */}
        <OptimizedFloatingTimeRecorder />

        {/* 题目导航面板 */}
        <FloatingPanel
          isVisible={isNavigationVisible}
          onClose={() => setIsNavigationVisible(false)}
          title='题目导航'
          position='right'
          top='top-72'
          width='w-64'
        >
          <QuizNavigation
            quiz={quiz}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={index => {
              handleQuestionSelect(index);
              setIsNavigationVisible(false);
            }}
            isQuestionAnswered={isQuestionAnswered}
          />
        </FloatingPanel>

        {/* 主内容区域 */}
        <div className='w-full'>
          {/* 所有题目内容 */}
          <div className='space-y-8'>
            {quiz.questions.map((question, index) => (
              <div
                key={question.id}
                ref={el => {
                  questionRefs.current[index] = el;
                }}
                onClick={() => goToQuestion(index)}
                style={{ scrollMarginTop: '140px', cursor: 'pointer' }}
                className='transition-colors hover:bg-gray-50 rounded-lg p-2 -m-2'
              >
                <QuestionRenderer
                  question={question}
                  onAnswerChange={handleAnswerChange}
                  disabled={isSubmitted}
                  questionNumber={index + 1}
                />
              </div>
            ))}

            {/* 提交按钮 */}
            <div className='mt-8 flex justify-center'>
              <button
                onClick={() => handleSubmitQuiz(quiz)}
                disabled={isSubmitted}
                className='px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium'
              >
                {isSubmitted ? '已提交' : '提交试卷'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </QuizPageLayout>
  );
};
