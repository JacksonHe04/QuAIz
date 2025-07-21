import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { QuestionRenderer } from '@/componets/QuestionRenderer';
import {
  QuizHeader,
  QuizNavigation,
  QuizControls,
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

  // 题目导航
  const {
    currentQuestionIndex,
    goToPrevQuestion,
    goToNextQuestion,
    goToQuestion
  } = useQuizNavigation();

  // 答题提交
  const {
    handleAnswerChange,
    handleSubmitQuiz,
    isSubmitted
  } = useQuizSubmission();

  // 答题状态
  const {
    answeredCount,
    totalQuestions,
    isQuestionAnswered
  } = useQuizStatus(quiz, currentQuestionIndex);

  // 当前题目
  const currentQuestion = quiz?.questions[currentQuestionIndex];

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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 题目导航 */}
          <div className="lg:col-span-1">
            <QuizNavigation
              quiz={quiz}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={goToQuestion}
              isQuestionAnswered={isQuestionAnswered}
            />
          </div>

          {/* 题目内容 */}
          <div className="lg:col-span-3">
            {currentQuestion && (
              <QuestionRenderer
                question={currentQuestion}
                onAnswerChange={handleAnswerChange}
                disabled={isSubmitted}
                questionNumber={currentQuestionIndex + 1}
              />
            )}

            {/* 导航按钮 */}
            <QuizControls
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              isSubmitted={isSubmitted}
              onPrevQuestion={goToPrevQuestion}
              onNextQuestion={() => goToNextQuestion(totalQuestions)}
              onSubmitQuiz={() => handleSubmitQuiz(quiz)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};