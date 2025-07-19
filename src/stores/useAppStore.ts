import { create } from 'zustand';
import type { 
  AppState, 
  GenerationRequest, 
  Quiz, 
  Question, 
  GradingResult 
} from '@/types';
import { QuestionType } from '@/types';

/**
 * 应用主状态管理store
 * 管理题目生成、答题和批改的全流程状态
 */
interface AppStore extends AppState {
  // 生成相关actions
  startGeneration: (request: GenerationRequest) => Promise<void>;
  setGenerationError: (error: string) => void;
  resetGeneration: () => void;
  
  // 答题相关actions
  updateUserAnswer: (questionId: string, answer: unknown) => void;
  setCurrentQuestion: (index: number) => void;
  submitQuiz: () => Promise<void>;
  
  // 批改相关actions
  startGrading: () => Promise<void>;
  setGradingError: (error: string) => void;
  resetGrading: () => void;
  
  // 重置整个应用状态
  resetApp: () => void;
}

/**
 * 模拟LLM API调用 - 生成试卷
 * 在实际项目中，这里会调用真实的LLM API
 */
const mockGenerateQuiz = async (request: GenerationRequest): Promise<Quiz> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const questions: Question[] = [];
  let questionId = 1;
  
  // 根据配置生成不同类型的题目
  for (const config of request.questionConfigs) {
    for (let i = 0; i < config.count; i++) {
      const id = `q${questionId++}`;
      
      switch (config.type) {
        case 'single-choice': {
          questions.push({
            id,
            type: QuestionType.SINGLE_CHOICE,
            question: `关于${request.subject}的单选题 ${i + 1}：以下哪个选项是正确的？`,
            options: ['选项A', '选项B', '选项C', '选项D'],
            correctAnswer: 0
          });
          break;
        }
          
        case 'multiple-choice': {
          questions.push({
            id,
            type: QuestionType.MULTIPLE_CHOICE,
            question: `关于${request.subject}的多选题 ${i + 1}：以下哪些选项是正确的？`,
            options: ['选项A', '选项B', '选项C', '选项D'],
            correctAnswers: [0, 2]
          });
          break;
        }
          
        case 'fill-blank': {
          questions.push({
            id,
            type: QuestionType.FILL_BLANK,
            question: `关于${request.subject}的填空题 ${i + 1}：请填写空白处：___是重要的概念，它的作用是___。`,
            correctAnswers: ['概念A', '作用B']
          });
          break;
        }
          
        case 'short-answer': {
          questions.push({
            id,
            type: QuestionType.SHORT_ANSWER,
            question: `关于${request.subject}的简答题 ${i + 1}：请简述相关概念的重要性。`,
            referenceAnswer: '这是一个参考答案，说明了概念的重要性和应用场景。'
          });
          break;
        }
          
        case 'code-output': {
          questions.push({
            id,
            type: QuestionType.CODE_OUTPUT,
            question: `代码输出题 ${i + 1}：请写出以下代码的输出结果`,
            code: `console.log('Hello, ${request.subject}!');\nconsole.log(1 + 2);`,
            correctOutput: `Hello, ${request.subject}!\n3`
          });
          break;
        }
          
        case 'code-writing': {
          questions.push({
            id,
            type: QuestionType.CODE_WRITING,
            question: `代码编写题 ${i + 1}：请编写一个函数实现指定功能`,
            language: 'javascript',
            referenceCode: 'function example() {\n  return "Hello World";\n}'
          });
          break;
        }
      }
    }
  }
  
  return {
    id: `quiz_${Date.now()}`,
    title: `${request.subject} - 练习题`,
    questions,
    createdAt: Date.now()
  };
};

/**
 * 模拟LLM API调用 - 批改试卷
 * 在实际项目中，这里会调用真实的LLM API
 */
const mockGradeQuiz = async (quiz: Quiz): Promise<GradingResult> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const results = quiz.questions.map(question => {
    let score = 0;
    let feedback = '';
    
    // 简单的评分逻辑
    switch (question.type) {
      case 'single-choice': {
        if (question.userAnswer === question.correctAnswer) {
          score = 10;
          feedback = '回答正确！';
        } else {
          score = 0;
          feedback = `回答错误，正确答案是选项${String.fromCharCode(65 + question.correctAnswer)}`;
        }
        break;
      }
        
      case 'multiple-choice': {
        const userAnswers = question.userAnswer || [];
        const correctAnswers = question.correctAnswers;
        if (JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswers.sort())) {
          score = 10;
          feedback = '回答完全正确！';
        } else {
          score = 5;
          feedback = '部分正确，请检查答案';
        }
        break;
      }
        
      default:
        score = question.userAnswer ? 8 : 0;
        feedback = question.userAnswer ? '回答合理，给予部分分数' : '未作答';
    }
    
    return {
      questionId: question.id,
      score,
      feedback
    };
  });
  
  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const maxScore = quiz.questions.length * 10;
  
  return {
    totalScore,
    maxScore,
    results,
    overallFeedback: `总体表现${totalScore >= maxScore * 0.8 ? '优秀' : totalScore >= maxScore * 0.6 ? '良好' : '需要改进'}，继续努力！`
  };
};

export const useAppStore = create<AppStore>((set, get) => ({
  // 初始状态
  generation: {
    status: 'idle' as const,
    currentQuiz: null,
    error: null
  } as AppState['generation'],
  answering: {
    currentQuestionIndex: 0,
    isSubmitted: false
  },
  grading: {
    status: 'idle',
    result: null,
    error: null
  },
  
  // 生成相关actions
  startGeneration: async (request: GenerationRequest) => {
    set((state) => ({
      ...state,
      generation: { ...state.generation, status: 'generating', error: null }
    }));
    
    try {
      const quiz = await mockGenerateQuiz(request);
      set((state) => ({
          ...state,
          generation: {
            status: 'complete',
            currentQuiz: quiz,
            error: null
          },
          answering: {
            currentQuestionIndex: 0,
            isSubmitted: false
          }
        }));
    } catch (error) {
      set((state) => ({
          ...state,
          generation: {
            ...state.generation,
            status: 'error',
            error: error instanceof Error ? error.message : '生成失败'
          }
        }));
    }
  },
  
  setGenerationError: (error: string) => {
    set((state) => ({
      ...state,
      generation: { ...state.generation, status: 'error', error }
    }));
  },
  
  resetGeneration: () => {
      set((state) => ({
        ...state,
        generation: {
          status: 'idle',
          currentQuiz: null,
          error: null
        }
      }));
  },
  
  // 答题相关actions
  updateUserAnswer: (questionId: string, answer: unknown) => {
    const { generation } = get();
    if (!generation.currentQuiz) return;
    
    const updatedQuestions = generation.currentQuiz.questions.map(q => 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      q.id === questionId ? { ...q, userAnswer: answer as any } : q
    );
    
    set(state => ({
      ...state,
      generation: {
        ...state.generation,
        currentQuiz: {
          ...state.generation.currentQuiz!,
          questions: updatedQuestions
        }
      }
    }));
  },
  
  setCurrentQuestion: (index: number) => {
    set(state => ({
      ...state,
      answering: { ...state.answering, currentQuestionIndex: index }
    }));
  },
  
  submitQuiz: async () => {
    set(state => ({
      ...state,
      answering: { ...state.answering, isSubmitted: true }
    }));
  },
  
  // 批改相关actions
  startGrading: async () => {
    const { generation } = get();
    if (!generation.currentQuiz) return;
    
    set((state) => ({
      ...state,
      grading: { ...state.grading, status: 'grading', error: null }
    }));
    
    try {
      const result = await mockGradeQuiz(generation.currentQuiz);
      set((state) => ({
        ...state,
        grading: {
          status: 'complete',
          result,
          error: null
        }
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        grading: {
          ...state.grading,
          status: 'error',
          error: error instanceof Error ? error.message : '批改失败'
        }
      }));
    }
  },
  
  setGradingError: (error: string) => {
    set((state) => ({
      ...state,
      grading: { ...state.grading, status: 'error', error }
    }));
  },
  
  resetGrading: () => {
    set((state) => ({
      ...state,
      grading: {
        status: 'idle',
        result: null,
        error: null
      }
    }));
  },
  
  // 重置整个应用状态
  resetApp: () => {
    set(() => ({
      generation: {
        status: 'idle',
        currentQuiz: null,
        error: null
      },
      answering: {
        currentQuestionIndex: 0,
        isSubmitted: false
      },
      grading: {
        status: 'idle',
        result: null,
        error: null
      }
    }));
  }
}));