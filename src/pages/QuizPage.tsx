import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { QuestionRenderer } from '@/componets/QuestionRenderer';

/**
 * 答题页面
 * 用户在此页面进行答题操作
 */
export const QuizPage: React.FC = () => {
  const {
    generation,
    answering,
    updateUserAnswer,
    setCurrentQuestion,
    submitQuiz,
    startGrading,
    resetApp
  } = useAppStore();

  const quiz = generation.currentQuiz;
  const currentQuestion = quiz?.questions[answering.currentQuestionIndex];

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">未找到试卷</h2>
          <p className="text-gray-600 mb-4">请先生成试卷</p>
          <button
            onClick={resetApp}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, answer: unknown) => {
    updateUserAnswer(questionId, answer);
  };

  const handlePrevQuestion = () => {
    if (answering.currentQuestionIndex > 0) {
      setCurrentQuestion(answering.currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (answering.currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestion(answering.currentQuestionIndex + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const unansweredQuestions = quiz.questions.filter(q => {
      switch (q.type) {
        case 'single-choice':
          return q.userAnswer === undefined;
        case 'multiple-choice':
          return !q.userAnswer || q.userAnswer.length === 0;
        case 'fill-blank':
          return !q.userAnswer || q.userAnswer.some(answer => !answer?.trim());
        case 'short-answer':
        case 'code-output':
        case 'code-writing':
          return !q.userAnswer?.trim();
        default:
          return true;
      }
    });

    if (unansweredQuestions.length > 0) {
      const confirmSubmit = window.confirm(
        `还有 ${unansweredQuestions.length} 道题未完成，确定要提交吗？`
      );
      if (!confirmSubmit) return;
    }

    await submitQuiz();
    await startGrading();
  };

  const getAnsweredCount = () => {
    return quiz.questions.filter(q => {
      switch (q.type) {
        case 'single-choice':
          return q.userAnswer !== undefined;
        case 'multiple-choice':
          return q.userAnswer && q.userAnswer.length > 0;
        case 'fill-blank':
          return q.userAnswer && q.userAnswer.some(answer => answer?.trim());
        case 'short-answer':
        case 'code-output':
        case 'code-writing':
          return q.userAnswer?.trim();
        default:
          return false;
      }
    }).length;
  };

  const progress = ((answering.currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = getAnsweredCount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600">
                第 {answering.currentQuestionIndex + 1} 题 / 共 {quiz.questions.length} 题
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                已答题: {answeredCount} / {quiz.questions.length}
              </div>
              <button
                onClick={resetApp}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                重新开始
              </button>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="mt-3">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 题目导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="font-medium text-gray-900 mb-3">题目导航</h3>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {quiz.questions.map((question, index) => {
                  const isAnswered = (() => {
                    switch (question.type) {
                      case 'single-choice':
                        return question.userAnswer !== undefined;
                      case 'multiple-choice':
                        return question.userAnswer && question.userAnswer.length > 0;
                      case 'fill-blank':
                        return question.userAnswer && question.userAnswer.some(answer => answer?.trim());
                      case 'short-answer':
                      case 'code-output':
                      case 'code-writing':
                        return question.userAnswer?.trim();
                      default:
                        return false;
                    }
                  })();
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestion(index)}
                      className={`
                        w-8 h-8 rounded text-sm font-medium transition-colors
                        ${index === answering.currentQuestionIndex 
                          ? 'bg-blue-600 text-white' 
                          : isAnswered 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 题目内容 */}
          <div className="lg:col-span-3">
            {currentQuestion && (
              <QuestionRenderer
                question={currentQuestion}
                onAnswerChange={handleAnswerChange}
                disabled={answering.isSubmitted}
                questionNumber={answering.currentQuestionIndex + 1}
              />
            )}

            {/* 导航按钮 */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePrevQuestion}
                disabled={answering.currentQuestionIndex === 0}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一题
              </button>

              <div className="flex gap-3">
                {answering.currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    下一题
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={answering.isSubmitted}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {answering.isSubmitted ? '已提交' : '提交试卷'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};