import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { QuestionRenderer } from '@/componets/QuestionRenderer';

/**
 * 批改结果页面
 * 显示AI批改结果和详细解析
 */
export const ResultPage: React.FC = () => {
  const {
    generation,
    grading,
    resetApp
  } = useAppStore();

  const quiz = generation.currentQuiz;
  const result = grading.result;

  if (grading.status === 'grading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">AI正在批改中...</h2>
            <p className="text-gray-600">请稍候，AI正在仔细评阅您的答案</p>
            <div className="mt-4 bg-gray-100 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">未找到批改结果</h2>
          <p className="text-gray-600 mb-4">请先完成答题并提交</p>
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

  const scorePercentage = (result.totalScore / result.maxScore) * 100;

  const getScoreLevel = (percentage: number) => {
    if (percentage >= 90) return '优秀';
    if (percentage >= 80) return '良好';
    if (percentage >= 60) return '及格';
    return '需要改进';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部成绩概览 */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">批改完成！</h1>
            <div className="bg-white/10 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-4xl font-bold mb-2 ${getScoreColor(scorePercentage)}">
                {result.totalScore} / {result.maxScore}
              </div>
              <div className="text-xl mb-2">
                {scorePercentage.toFixed(1)}% - {getScoreLevel(scorePercentage)}
              </div>
              <div className="bg-white/20 rounded-full h-3 mb-2">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
              <p className="text-white/90">{result.overallFeedback}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 操作按钮 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">详细解析</h2>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              打印结果
            </button>
            <button
              onClick={resetApp}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              重新开始
            </button>
          </div>
        </div>

        {/* 成绩统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{quiz.questions.length}</div>
            <div className="text-gray-600">总题数</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {result.results.filter(r => r.score === 10).length}
            </div>
            <div className="text-gray-600">完全正确</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">
              {result.results.filter(r => r.score > 0 && r.score < 10).length}
            </div>
            <div className="text-gray-600">部分正确</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-600">
              {result.results.filter(r => r.score === 0).length}
            </div>
            <div className="text-gray-600">错误</div>
          </div>
        </div>

        {/* 题目详细解析 */}
        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const questionResult = result.results.find(r => r.questionId === question.id);
            const isCorrect = questionResult?.score === 10;
            const isPartial = questionResult && questionResult.score > 0 && questionResult.score < 10;
            
            return (
              <div key={question.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* 题目头部 */}
                <div className={`px-6 py-4 border-l-4 ${
                  isCorrect ? 'border-green-500 bg-green-50' :
                  isPartial ? 'border-yellow-500 bg-yellow-50' :
                  'border-red-500 bg-red-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      第 {index + 1} 题
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect ? 'bg-green-100 text-green-800' :
                        isPartial ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {questionResult?.score || 0} / 10 分
                      </span>
                      <span className={`text-lg ${
                        isCorrect ? 'text-green-600' :
                        isPartial ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {isCorrect ? '✓' : isPartial ? '◐' : '✗'}
                      </span>
                    </div>
                  </div>
                  {questionResult?.feedback && (
                    <p className={`mt-2 text-sm ${
                      isCorrect ? 'text-green-700' :
                      isPartial ? 'text-yellow-700' :
                      'text-red-700'
                    }`}>
                      {questionResult.feedback}
                    </p>
                  )}
                </div>

                {/* 题目内容 */}
                <div className="p-6">
                  <QuestionRenderer
                    question={question}
                    onAnswerChange={() => {}} // 只读模式
                    disabled={true}
                    showCorrectAnswer={true}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 总结建议 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-3">学习建议</h3>
          <div className="space-y-2 text-blue-800">
            {scorePercentage >= 90 && (
              <p>🎉 表现优秀！您已经很好地掌握了相关知识点，可以尝试更有挑战性的内容。</p>
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
      </div>
    </div>
  );
};