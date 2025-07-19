import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { GenerationPage, QuizPage, ResultPage } from '@/pages';

/**
 * 应用路由组件
 * 根据应用状态自动切换页面
 */
export const AppRouter: React.FC = () => {
  const { generation, answering, grading } = useAppStore();

  // 根据应用状态决定显示哪个页面
  const getCurrentPage = () => {
    // 如果有批改结果，显示结果页面
    if (grading.status === 'complete' && grading.result) {
      return <ResultPage />;
    }
    
    // 如果正在批改，显示结果页面（会显示加载状态）
    if (grading.status === 'grading') {
      return <ResultPage />;
    }
    
    // 如果试卷已生成且已提交，等待批改
    if (generation.currentQuiz && answering.isSubmitted) {
      return <ResultPage />;
    }
    
    // 如果试卷已生成，显示答题页面
    if (generation.status === 'complete' && generation.currentQuiz) {
      return <QuizPage />;
    }
    
    // 如果正在生成试卷，显示生成页面（会显示加载状态）
    if (generation.status === 'generating') {
      return <GenerationPage />;
    }
    
    // 默认显示生成页面
    return <GenerationPage />;
  };

  return (
    <div className="min-h-screen">
      {getCurrentPage()}
    </div>
  );
};