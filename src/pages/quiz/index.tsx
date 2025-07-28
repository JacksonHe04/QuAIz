import React, { useRef, useEffect, useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { QuestionRenderer } from '@/components/Question/QuestionRenderer';
import { Menu, X } from 'lucide-react';
import {
  QuizHeader,
  QuizNavigation,
  EmptyQuizState
} from './components';
import {
  useQuizNavigation,
  useQuizSubmission,
  useQuizStatus
} from './hooks';

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
  const {
    currentQuestionIndex,
    goToQuestion
  } = useQuizNavigation();

  // 题目引用数组，用于滚动定位
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 答题提交
  const {
    handleAnswerChange,
    handleSubmitQuiz,
    isSubmitted
  } = useQuizSubmission();

  // 答题状态
  const {
    answeredCount,
    isQuestionAnswered
  } = useQuizStatus(quiz);

  /**
   * 滚动到指定题目
   * @param index 题目索引
   */
  const scrollToQuestion = (index: number) => {
    const questionElement = questionRefs.current[index];
    if (questionElement) {
      questionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
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
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <QuizHeader
        quiz={quiz}
        currentQuestionIndex={currentQuestionIndex}
        answeredCount={answeredCount}
        onReset={resetApp}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 pt-32 relative">
        {/* 圆形导航按钮 - 桌面端和移动端 */}
           <div>
             <button
               onClick={() => setIsNavigationVisible(!isNavigationVisible)}
               className="fixed top-40 z-40 bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-200 flex items-center justify-center
                         lg:right-4 lg:w-12 lg:h-12 lg:rounded-full
                         right-0 w-8 h-16 rounded-l-full"
               title="题目导航"
             >
               <Menu className="w-5 h-5" />
             </button>
          
          {/* 可折叠的导航面板 */}
           {isNavigationVisible && (
                <div className="fixed top-32 z-40 w-64 bg-white rounded-lg shadow-xl overflow-hidden
                             lg:right-4 right-2">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">题目导航</h3>
                    <button
                      onClick={() => setIsNavigationVisible(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                 <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
                   <QuizNavigation
                     quiz={quiz}
                     currentQuestionIndex={currentQuestionIndex}
                     onQuestionSelect={(index) => {
                       handleQuestionSelect(index);
                       setIsNavigationVisible(false);
                     }}
                     isQuestionAnswered={isQuestionAnswered}
                   />
                 </div>
                </div>
            )}
        </div>
        


        {/* 主内容区域 */}
        <div className="w-full">
            {/* 所有题目内容 */}
            <div className="space-y-8">
              {quiz.questions.map((question, index) => (
                <div
                  key={question.id}
                  ref={(el) => { questionRefs.current[index] = el; }}
                  className={`transition-all duration-300 ${
                    index === currentQuestionIndex 
                      ? 'ring-2 ring-blue-500 ring-opacity-50' 
                      : ''
                  }`}
                  style={{ scrollMarginTop: '140px' }}
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
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => handleSubmitQuiz(quiz)}
                  disabled={isSubmitted}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
                >
                  {isSubmitted ? '已提交' : '提交试卷'}
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};