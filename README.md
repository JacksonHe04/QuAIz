# QuAIz - 基于大模型的智能试卷生成+刷题+批改

[![Version](https://img.shields.io/badge/version-v2.0.0-blue.svg)](https://github.com/JacksonHe04/QuAIz)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> Quiz You by AI Zipply - 基于AI的智能试卷生成与批改系统

在线链接：[https://quaiz-ai.vercel.app](https://quaiz-ai.vercel.app)

## 🆕 最新更新 (v2.0.0)

- ⚡ **性能大幅提升**: 使用 react-window 实现虚拟化渲染，支持 1000+ 条日志无卡顿
- ⏱️ **智能时间记录**: 新增浮动时间记录器，精确追踪答题时长和统计信息
- 🎨 **组件重构优化**: LogPanel 组件模块化重构，提升代码可维护性
- 🔧 **开发体验提升**: 统一 LLM 配置管理，优化日志记录和错误处理
- 📊 **性能监控**: 内置性能监控 Hook，实时跟踪渲染指标

## 📖 项目简介

QuAIz是一个现代化的AI驱动的在线出题系统，支持多种题型的智能生成、在线答题和自动批改。用户只需简单配置需求，AI就能生成个性化的试卷，并在答题完成后提供详细的批改反馈。项目采用React 19 + TypeScript + Vite技术栈，具备完整的流式渲染能力和响应式设计。

## ✨ 核心特性

### 🤖 AI智能出题
- **多题型支持**：单选题、多选题、填空题、简答题、代码输出题、代码编写题
- **个性化配置**：自定义学科主题、题目数量、难度要求
- **流式生成**：实时显示AI生成过程，提升用户体验
- **智能提示词**：优化的prompt模板确保高质量题目生成
- **预设管理**：支持保存和加载常用配置方案，提高生成效率

### 📝 在线答题系统
- **响应式设计**：支持桌面端和移动端答题
- **题目导航**：快速跳转到任意题目，实时显示答题进度
- **自动保存**：答案实时保存，防止数据丢失
- **多样化组件**：针对不同题型提供专门的答题组件
- **虚拟化渲染**：支持大量题目的高性能渲染，无卡顿体验

### 🎯 AI智能批改
- **自动评分**：AI根据标准答案和评分规则自动打分
- **详细反馈**：每道题提供具体的批改意见和改进建议
- **综合评价**：生成整体学习报告和建议

### ⏱️ 智能时间记录
- **精确计时**：自动记录题目生成时间和各题用时
- **浮动面板**：非侵入式的时间记录界面
- **性能优化**：防抖处理，减少不必要的状态更新

### 📊 实时日志系统
- **虚拟化日志**：支持1000+条日志无卡顿显示
- **多会话管理**：同时管理多个日志会话
- **智能过滤**：按类型、时间、关键词过滤日志
- **流式展示**：实时显示AI生成和批改过程
- **日志导出**：支持导出日志数据用于分析

## 🛠️ 技术栈

### 前端技术
- **React 19** - 现代化 Web 框架，支持最新特性
- **TypeScript 5.8** - 类型安全的JavaScript超集
- **Vite 7** - 极速的前端构建工具
- **TailwindCSS 4** - 实用优先的CSS框架，支持最新语法
- **Zustand 5** - 轻量级状态管理库
- **React Window** - 虚拟化滚动组件，支持大量数据渲染
- **Lucide React** - 现代化图标库

### 性能优化
- **虚拟化渲染** - 支持大量日志和题目的高性能显示
- **React.memo** - 组件记忆化，减少不必要重渲染
- **useMemo/useCallback** - Hook 优化，提升渲染性能
- **防抖处理** - 优化频繁状态更新，降低性能开销

### 开发工具
- **ESLint 9** - 代码质量检查和规范
- **pnpm** - 高效的包管理器
- **Vercel** - 现代化部署平台

## 📁 项目结构

```
QuAIz/
├── public/                    # 静态资源
│   └── quaiz-logo.svg        # 项目Logo
├── src/
│   ├── components/            # 可复用组件模块 📋
│   │   ├── FloatingButton/   # 浮动按钮组件系统
│   │   │   ├── index.tsx     # 浮动按钮主组件
│   │   │   ├── FloatingPanel.tsx     # 浮动面板组件
│   │   │   └── README.md     # 浮动按钮模块文档
│   │   ├── LogPanel/         # 日志面板组件系统
│   │   │   ├── index.tsx     # 主日志面板组件
│   │   │   ├── components/   # 日志子组件
│   │   │   │   ├── LogEntry.tsx              # 日志条目组件
│   │   │   │   ├── OptimizedLogEntry.tsx     # 优化版日志条目
│   │   │   │   ├── VirtualizedLogList.tsx    # 虚拟化日志列表
│   │   │   │   ├── StreamSession.tsx         # 流式会话组件
│   │   │   │   ├── TabHeader.tsx             # 标签头组件
│   │   │   │   ├── PanelHeader.tsx           # 面板头组件
│   │   │   │   ├── FloatingToggle.tsx        # 浮动切换按钮
│   │   │   │   ├── BottomControls.tsx        # 底部控制栏
│   │   │   │   ├── LogFilter.tsx             # 日志过滤器
│   │   │   │   ├── LogSearch.tsx             # 日志搜索
│   │   │   │   └── ExportButton.tsx          # 导出按钮
│   │   │   ├── hooks/        # 日志面板hooks
│   │   │   │   ├── useLogPanel.ts            # 日志面板状态管理
│   │   │   │   ├── useLogFilter.ts           # 日志过滤逻辑
│   │   │   │   └── useAutoScroll.ts          # 自动滚动逻辑
│   │   │   ├── utils/        # 日志工具函数
│   │   │   │   ├── constants.ts              # 日志面板常量
│   │   │   │   ├── utils.ts                  # 通用工具函数
│   │   │   │   ├── logFormatter.ts           # 日志格式化
│   │   │   │   └── logExporter.ts            # 日志导出
│   │   │   ├── docs/         # 日志面板文档
│   │   │   │   └── PERFORMANCE_OPTIMIZATION.md # 性能优化文档
│   │   │   └── README.md     # 日志面板模块文档
│   │   ├── Question/         # 题目组件系统
│   │   │   ├── index.tsx     # 题目组件入口
│   │   │   ├── QuestionRenderer.tsx      # 标准题目渲染器
│   │   │   ├── StreamingQuestionRenderer.tsx # 流式题目渲染器
│   │   │   ├── questions/    # 各类题型组件
│   │   │   │   ├── SingleChoiceQuestion.tsx   # 单选题组件
│   │   │   │   ├── MultipleChoiceQuestion.tsx # 多选题组件
│   │   │   │   ├── FillBlankQuestion.tsx      # 填空题组件
│   │   │   │   ├── ShortAnswerQuestion.tsx    # 简答题组件
│   │   │   │   ├── CodeOutputQuestion.tsx     # 代码输出题组件
│   │   │   │   └── CodeWritingQuestion.tsx    # 代码编写题组件
│   │   │   ├── hooks/        # 题目组件hooks
│   │   │   │   ├── useQuestionState.ts       # 题目状态管理
│   │   │   │   └── useAnswerValidation.ts    # 答案验证逻辑
│   │   │   ├── utils/        # 题目工具函数
│   │   │   │   ├── questionUtils.ts          # 题目处理工具
│   │   │   │   └── answerUtils.ts            # 答案处理工具
│   │   │   └── README.md     # 题目组件模块文档
│   │   ├── TimeRecorder/     # 时间记录组件系统
│   │   │   ├── index.tsx     # 时间记录主组件
│   │   │   ├── OptimizedTimeRecorder.tsx     # 优化版时间记录器
│   │   │   └── README.md     # 时间记录模块文档
│   │   ├── LogPanelProvider.tsx  # 日志面板上下文提供者
│   │   └── README.md         # 组件模块总体文档
│   ├── pages/                 # 页面组件模块 📄
│   │   ├── generation/        # 题目生成页面模块
│   │   │   ├── index.tsx     # 生成页面主组件
│   │   │   ├── components/   # 生成页面子组件
│   │   │   │   ├── GenerationForm.tsx        # 生成表单组件
│   │   │   │   ├── QuestionTypeSelector.tsx  # 题型选择器
│   │   │   │   ├── PresetModal.tsx           # 预设模态框
│   │   │   │   └── SavePresetModal.tsx       # 保存预设模态框
│   │   │   ├── hooks/        # 生成页面hooks
│   │   │   │   ├── useGenerationForm.ts      # 表单状态管理
│   │   │   │   └── usePresetManager.ts       # 预设管理逻辑
│   │   │   ├── constants/    # 生成页面常量
│   │   │   │   └── index.ts  # 题型选项配置
│   │   │   └── README.md     # 生成页面模块文档
│   │   ├── quiz/             # 答题页面模块
│   │   │   ├── index.tsx     # 答题页面主组件
│   │   │   ├── streaming.tsx # 流式答题页面
│   │   │   ├── OptimizedStreamingQuizPage.tsx # 优化版流式答题页面
│   │   │   ├── components/   # 答题页面子组件
│   │   │   │   ├── QuizHeader.tsx            # 答题页面头部
│   │   │   │   ├── QuizNavigation.tsx        # 题目导航组件
│   │   │   │   └── EmptyQuizState.tsx        # 空状态组件
│   │   │   ├── hooks/        # 答题页面hooks
│   │   │   │   ├── useQuizNavigation.ts      # 题目导航逻辑
│   │   │   │   ├── useQuizStatus.ts          # 答题状态管理
│   │   │   │   └── useQuizSubmission.ts      # 提交逻辑
│   │   │   ├── docs/         # 答题页面文档
│   │   │   │   └── PERFORMANCE_OPTIMIZATION_ANALYSIS.md # 性能优化分析
│   │   │   └── README.md     # 答题页面模块文档
│   │   ├── result/           # 结果页面模块
│   │   │   ├── index.tsx     # 结果页面主组件
│   │   │   ├── components/   # 结果页面子组件
│   │   │   │   ├── ResultHeader.tsx          # 结果页面头部
│   │   │   │   ├── ScoreOverview.tsx         # 分数概览组件
│   │   │   │   ├── QuestionResult.tsx        # 单题结果组件
│   │   │   │   ├── OverallFeedback.tsx       # 总体反馈组件
│   │   │   │   └── ActionButtons.tsx         # 操作按钮组件
│   │   │   ├── hooks/        # 结果页面hooks
│   │   │   │   ├── useGradingStatus.ts       # 批改状态管理
│   │   │   │   └── useResultActions.ts       # 结果操作逻辑
│   │   │   └── README.md     # 结果页面模块文档
│   │   └── README.md         # 页面模块总体文档
│   ├── stores/               # 状态管理模块 🗃️
│   │   ├── useAppStore.ts    # 主应用状态管理
│   │   ├── useLogStore.ts    # 日志状态管理
│   │   ├── timeRecorderStore.ts      # 时间记录状态管理
│   │   ├── answeringActions.ts       # 答题相关操作
│   │   ├── gradingActions.ts         # 批改相关操作
│   │   ├── generationActions.ts      # 生成相关操作
│   │   ├── generation/       # 题目生成状态管理
│   │   │   ├── index.ts              # 生成模块入口
│   │   │   ├── stateManager.ts       # 生成状态管理器
│   │   │   ├── actions.ts            # 生成操作集合
│   │   │   ├── generators.ts         # 题目生成器
│   │   │   ├── types.ts              # 生成相关类型
│   │   │   └── README.md             # 生成状态模块文档
│   │   ├── logStore/         # 日志状态管理
│   │   │   ├── index.ts              # 日志模块入口
│   │   │   ├── logStore.ts           # 日志存储管理
│   │   │   ├── actions.ts            # 日志操作集合
│   │   │   ├── sessionManager.ts     # 会话管理器
│   │   │   ├── logEntry.ts           # 日志条目处理
│   │   │   ├── types.ts              # 日志相关类型
│   │   │   └── README.md             # 日志状态模块文档
│   │   ├── mockServices.ts   # 模拟服务（开发/演示用）
│   │   └── README.md         # 状态管理模块总体文档
│   ├── llm/                  # AI服务模块
│   │   ├── api/              # API客户端
│   │   ├── services/         # 业务服务层
│   │   ├── prompt/           # 提示词模板
│   │   ├── utils/            # LLM工具函数
│   │   └── index.ts          # 模块入口
│   ├── types/                # TypeScript类型定义
│   │   └── index.ts          # 核心类型定义
│   ├── config/               # 应用配置
│   │   └── app.ts            # 应用配置文件
│   ├── router/               # 路由管理
│   │   └── AppRouter.tsx     # 应用路由组件
│   ├── hooks/                # 全局自定义 Hooks
│   │   └── useOptimizedStreaming.ts  # 优化流式渲染 Hook
│   ├── utils/                # 工具函数
│   │   ├── presetStorage.ts  # 预设存储工具
│   │   └── timeUtils.ts      # 时间处理工具
│   ├── test/                 # 测试文件
│   │   └── timeRecorderTest.ts       # 时间记录器测试
│   ├── styles/               # 样式文件
│   │   └── index.css         # 全局样式
│   ├── App.tsx               # 根组件
│   ├── main.tsx              # 应用入口
│   └── vite-env.d.ts         # Vite类型声明
├── docs/                     # 项目文档
│   ├── REFACTOR_REPORT.md    # 重构报告文档
│   ├── images/               # 文档图片资源
│   ├── 项目描述.md           # 项目描述文档
│   └── 数据结构设计.md       # 数据结构设计文档
├── .env.example              # 环境变量示例
├── package.json              # 项目依赖配置
├── vite.config.ts            # Vite构建配置
├── tailwind.config.js        # TailwindCSS配置
├── tsconfig.json             # TypeScript配置
└── README.md                 # 项目说明文档
```

## 🚀 快速开始

### 环境要求
- **Node.js** >= 18
- **pnpm** >= 8
- 现代浏览器（支持ES2020+）

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

访问 http://localhost:5173 开始使用

### 构建生产版本
```bash
pnpm build
```

### 代码检查
```bash
pnpm check
```

## 💡 使用指南

### 1. 生成试卷
1. 在首页输入学科主题（如：JavaScript基础、数据结构等）
2. 选择需要的题型和每种题型的数量
3. 可选择性添加详细描述来指导AI生成
4. 点击生成，AI将实时生成个性化试卷

### 2. 在线答题
1. 试卷生成完成后自动进入答题界面
2. 使用左侧导航快速跳转题目
3. 根据题型在相应界面作答
4. 系统实时保存答案，支持随时暂停

### 3. 查看结果
1. 答题完成后提交试卷
2. AI自动批改并生成详细报告
3. 查看每道题的得分和反馈
4. 获得学习建议和改进方向

## 🎨 核心功能

### 题型支持

| 题型 | 描述 | 特点 |
|------|------|------|
| 单选题 | 从多个选项中选择一个正确答案 | 自动评分，即时反馈 |
| 多选题 | 从多个选项中选择多个正确答案 | 支持部分得分 |
| 填空题 | 在指定位置填写答案 | 支持多个空白，智能匹配 |
| 简答题 | 用文字详细回答问题 | AI语义理解评分 |
| 代码输出题 | 根据给定代码写出运行结果 | 精确匹配输出格式 |
| 代码编写题 | 编写代码实现指定功能 | AI代码质量评估 |

### 状态管理架构

项目采用Zustand进行状态管理，具备完整的状态流转机制：

- **GenerationState**: 管理试卷生成流程，支持进度追踪和错误处理
- **AnsweringState**: 管理答题进度、当前题目索引和提交状态
- **GradingState**: 管理批改过程、结果展示和评分统计
- **LogStore**: 管理系统日志和调试信息，支持多会话管理
- **TimeRecorderStore**: 管理时间记录功能，精确追踪答题时长
- **模块化Actions**: 将复杂业务逻辑封装为可复用的操作函数

### 智能路由系统

基于状态的自动路由切换，无需手动导航：
- 根据应用状态自动切换页面（生成→答题→结果）
- 支持流式生成过程中的实时页面跳转
- 完整的状态恢复和错误处理机制

### 流式渲染技术

项目实现了创新的流式渲染技术，提供极致的用户体验：
- **实时解析**：动态解析AI输出的JSON片段
- **增量渲染**：已完成的题目立即显示，无需等待
- **虚拟化滚动**：使用react-window实现大量数据的高性能渲染
- **进度反馈**：实时显示生成和批改进度
- **错误恢复**：支持网络中断后的状态恢复
- **性能监控**：内置性能监控Hook，实时跟踪渲染指标

### 响应式设计

全面适配不同设备和屏幕尺寸：
- **桌面端**：固定侧边栏导航，大屏幕优化布局
- **移动端**：折叠式导航，触摸友好的交互设计
- **自适应组件**：题目组件根据屏幕尺寸自动调整

## 🔧 配置说明

### 环境变量
复制 `.env.example` 为 `.env.local` 并配置：

```env
# LLM API配置
VITE_LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
VITE_LLM_API_KEY=your_api_key_here
VITE_LLM_MODEL=glm-4-flash-250414
VITE_LLM_TEMPERATURE=0.7
VITE_LLM_MAX_TOKENS=4000
VITE_LLM_TIMEOUT=30000
```

**注意**：如果未配置LLM环境变量，系统将自动使用模拟API作为备用方案，确保功能正常运行。

### 应用配置

在 [src/config/app.ts](./src/config/app.ts) 中可以调整：

```typescript
export const APP_CONFIG = {
  // 应用基本信息
  name: 'QuAIz',
  version: '1.0.0',
  
  // 题目配置
  question: {
    defaultScore: 10,              // 每题默认分值
    maxQuestionsPerType: 20,       // 单题型最大数量
    maxTotalQuestions: 50          // 总题目数量限制
  },
  
  // UI配置
  ui: {
    animationDuration: 300,        // 动画持续时间
    autoSaveInterval: 30000        // 自动保存间隔
  },
  
  // API配置
  api: {
    mockGenerationDelay: 2000,     // 模拟生成延迟
    mockGradingDelay: 3000         // 模拟批改延迟
  }
};
```

## 📊 数据结构设计

### 核心类型定义

项目采用完整的TypeScript类型系统，确保类型安全：

```typescript
// 题目类型枚举
export enum QuestionType {
  SINGLE_CHOICE = 'single-choice',     // 单选题
  MULTIPLE_CHOICE = 'multiple-choice', // 多选题
  FILL_BLANK = 'fill-blank',           // 填空题
  SHORT_ANSWER = 'short-answer',       // 简答题
  CODE_OUTPUT = 'code-output',         // 代码输出题
  CODE_WRITING = 'code-writing'        // 代码编写题
}

// 试卷结构
export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: number;
}

// 批改结果
export interface GradingResult {
  totalScore: number;                  // 总得分
  maxScore: number;                    // 总分
  results: {
    questionId: string;
    score: number;
    feedback: string;
  }[];
  overallFeedback: string;             // 总体评价
}

// 应用状态
export interface AppState {
  generation: GenerationState;
  answering: AnsweringState;
  grading: GradingState;
}
```

### 题型接口设计

每种题型都有专门的接口定义，支持类型安全的答案处理：

```typescript
// 单选题
export interface SingleChoiceQuestion {
  id: string;
  type: QuestionType.SINGLE_CHOICE;
  question: string;
  options: string[];
  correctAnswer: number;               // 正确答案索引
  userAnswer?: number;                 // 用户答案索引
}

// 多选题
export interface MultipleChoiceQuestion {
  id: string;
  type: QuestionType.MULTIPLE_CHOICE;
  question: string;
  options: string[];
  correctAnswers: number[];            // 正确答案索引数组
  userAnswer?: number[];               // 用户答案索引数组
}

// 代码题
export interface CodeOutputQuestion {
  id: string;
  type: QuestionType.CODE_OUTPUT;
  question: string;
  code: string;                        // 代码内容
  correctOutput: string;               // 正确输出
  userAnswer?: string;                 // 用户答案
}
```

### 预设方案系统

支持保存和加载题目配置预设：

```typescript
export interface QuestionPreset {
  id: string;
  name: string;
  description?: string;
  subject: string;
  description_content?: string;
  questionConfigs: QuestionConfig[];
  createdAt: number;
  updatedAt: number;
}
```

详细的类型定义请参考 [src/types/index.ts](./src/types/index.ts)

## 🚀 核心功能实现

### 📋 智能题目生成系统

基于 [`./src/pages/generation/`](./src/pages/generation/) 和 [`./src/stores/generation/`](./src/stores/generation/) 模块实现：

- **多模型支持**：兼容多种 LLM API（默认支持智谱AI GLM-4）
- **流式生成**：支持实时流式输出，边生成边显示，提供极致用户体验
- **智能预设管理**：支持保存和加载常用的题目配置方案，提高生成效率
- **表单验证**：完整的参数验证和错误处理机制
- **备用机制**：LLM 配置缺失时自动切换到模拟 API，确保功能可用性
- **进度追踪**：实时显示生成进度和状态反馈

### 📝 智能答题系统

基于 [`./src/pages/quiz/`](./src/pages/quiz/) 和 [`./src/components/Question/`](./src/components/Question/) 模块实现：

- **多题型支持**：单选、多选、填空、简答、代码输出、代码编写六大题型
- **智能导航**：题目导航栏实时显示答题状态，支持快速跳转
- **流式答题**：支持题目边生成边答题的流式体验
- **自动保存**：答案实时保存到状态管理中，防止数据丢失
- **响应式设计**：完美适配桌面端和移动端设备
- **进度追踪**：可视化答题进度和完成状态
- **滚动定位**：点击导航自动滚动到对应题目位置

### 🎯 智能批改系统

基于 [`./src/pages/result/`](./src/pages/result/) 和 [`./src/stores/actions/`](./src/stores/actions/) 模块实现：

- **AI 智能评分**：支持不同题型的专门评分逻辑和算法
- **详细反馈**：每道题提供具体的批改意见和改进建议
- **统计分析**：生成完整的答题统计和学习报告
- **可视化展示**：直观的分数概览和结果展示界面
- **学习建议**：基于答题情况生成个性化学习建议
- **结果导出**：支持打印和保存批改结果

### 📊 实时日志系统

基于 [`./src/components/LogPanel/`](./src/components/LogPanel/) 和 [`./src/stores/logStore/`](./src/stores/logStore/) 模块实现：

- **虚拟化日志展示**：使用react-window支持1000+条日志无卡顿显示
- **实时日志收集**：自动收集系统运行日志和用户操作记录
- **多会话管理**：支持同时管理多个日志会话
- **流式日志展示**：实时显示 AI 生成和批改过程
- **智能过滤搜索**：支持按类型、时间、关键词过滤日志
- **性能优化**：React.memo和useMemo减少不必要重渲染
- **日志导出**：支持导出日志数据用于分析和调试
- **可视化界面**：美观的日志面板和交互体验

### ⏱️ 智能时间记录系统

基于 [`./src/components/TimeRecorder/`](./src/components/TimeRecorder/) 和 [`./src/stores/timeRecorderStore.ts`](./src/stores/timeRecorderStore.ts) 模块实现：

- **精确时间追踪**：自动记录题目生成开始、暂停、结束时间
- **浮动面板设计**：非侵入式界面，不影响答题体验
- **性能优化**：防抖处理和状态更新阈值检查
- **状态可视化**：直观显示当前计时状态和统计信息
- **独立状态管理**：与主应用状态解耦，提高性能

### 🗃️ 状态管理架构

基于 [`./src/stores/`](./src/stores/) 模块实现的完整状态管理系统：

- **主状态管理**：`useAppStore` 统一管理应用核心状态
- **模块化设计**：按功能模块划分状态管理（生成、答题、批改、日志）
- **操作封装**：将复杂业务逻辑封装为可复用的 Actions
- **状态持久化**：关键状态自动保存，支持页面刷新恢复
- **类型安全**：完整的 TypeScript 类型定义和约束
- **性能优化**：精细化状态更新，避免不必要的重渲染

### 🎨 组件化设计

基于 [`./src/components/`](./src/components/) 模块实现的高度模块化组件系统：

- **可复用组件**：高度抽象的通用组件，支持多场景复用
- **Hook 封装**：业务逻辑封装为可复用的自定义 Hook
- **类型安全**：完整的 TypeScript 类型定义和 Props 约束
- **响应式设计**：所有组件支持多设备适配
- **主题一致性**：统一的设计语言和视觉风格
- **性能优化**：React.memo、useMemo、useCallback 全面优化
- **虚拟化支持**：大数据量组件采用虚拟化渲染技术
- **浮动组件系统**：FloatingButton 和 FloatingPanel 通用浮动组件

### 🔧 开发者体验

- **模块化架构**：清晰的目录结构和模块划分
- **文档完善**：每个模块都有详细的 README 文档
- **类型安全**：完整的 TypeScript 类型系统
- **调试支持**：内置日志系统和开发工具
- **代码规范**：统一的代码风格和最佳实践
- **热更新**：Vite 提供的极速开发体验

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- **TypeScript优先**：所有新代码必须使用TypeScript
- **ESLint规范**：严格遵循项目ESLint配置
- **函数注释**：为所有导出的函数和组件添加JSDoc注释
- **组件设计**：遵循单一职责原则，保持组件的可复用性
- **Hook规范**：业务逻辑优先封装为自定义Hook
- **类型定义**：新增功能需要完善对应的TypeScript类型

### 开发流程
1. **Fork项目** → 创建功能分支
2. **本地开发** → 运行 `pnpm dev` 启动开发服务器
3. **代码检查** → 运行 `pnpm check` 确保代码质量
4. **功能测试** → 测试新功能在不同场景下的表现
5. **提交PR** → 提供清晰的功能描述和测试说明

## ❓ 常见问题

### Q: 如何配置LLM API？
A: 复制 `.env.example` 为 `.env.local`，填入你的API配置。如果不配置，系统会自动使用模拟API进行演示。

### Q: 支持哪些LLM模型？
A: 目前默认支持智谱AI GLM-4，理论上兼容所有OpenAI格式的API。你可以通过修改 `VITE_LLM_BASE_URL` 和 `VITE_LLM_MODEL` 来使用其他模型。

### Q: 生成的题目质量如何保证？
A: 项目内置了专门的提示词工程，针对不同题型优化了生成策略。同时支持流式输出，可以实时查看生成过程。

### Q: 可以离线使用吗？
A: 前端部分支持离线使用，但AI功能需要网络连接。未配置LLM时会使用本地模拟API。

### Q: 如何自定义题型？
A: 可以在 `src/types/index.ts` 中添加新的题型定义，然后在 `src/components/questions/` 中实现对应的组件。

## 📚 模块文档导航

为了帮助开发者更好地理解项目架构，我们为每个核心模块都提供了详细的 README 文档：

### 📄 页面模块文档
- [**页面模块总览**](./src/pages/README.md) - 页面架构和流程说明
- [**题目生成页面**](./src/pages/generation/README.md) - 智能题目生成功能详解
- [**答题页面**](./src/pages/quiz/README.md) - 多题型答题系统实现
- [**结果页面**](./src/pages/result/README.md) - 智能批改结果展示

### 🗃️ 状态管理文档
- [**状态管理总览**](./src/stores/README.md) - 状态管理架构和设计
- [**题目生成状态**](./src/stores/generation/README.md) - 生成流程状态管理
- [**日志状态管理**](./src/stores/logStore/README.md) - 日志收集和会话管理

### 📋 组件模块文档
- [**组件模块总览**](./src/components/README.md) - 组件架构和设计原则
- [**题目组件系统**](./src/components/Question/README.md) - 多题型组件实现
- [**日志面板组件**](./src/components/LogPanel/README.md) - 实时日志展示系统
- [**时间记录组件**](./src/components/TimeRecorder/README.md) - 智能时间记录系统
- [**浮动按钮组件**](./src/components/FloatingButton/README.md) - 浮动组件系统

### 📊 项目文档
- [**重构报告**](./docs/REFACTOR_REPORT.md) - 项目重构详细报告
- [**性能优化分析**](./src/pages/quiz/docs/PERFORMANCE_OPTIMIZATION_ANALYSIS.md) - 性能优化详细分析
- [**日志面板性能优化**](./src/components/LogPanel/docs/PERFORMANCE_OPTIMIZATION.md) - 日志面板性能优化文档

这些文档包含了详细的功能说明、API 接口、使用示例和最佳实践，是深入了解项目的最佳资源。

## 🔗 相关链接

- [项目文档](docs/)
- [在线演示](https://quaiz-ai.vercel.app)
- [问题反馈](https://github.com/JacksonHe04/QuAIz/issues)
- [功能建议](https://github.com/JacksonHe04/QuAIz/discussions)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和技术：

- [React](https://reactjs.org/) - 用户界面库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Zustand](https://github.com/pmndrs/zustand) - 轻量级状态管理
- [Lucide React](https://lucide.dev/) - 美观的图标库

---

<div align="center">
  <p>如果这个项目对你有帮助，请给它一个 ⭐️</p>
  <p>Made with ❤️ by JacksonHe04</p>
  <p><strong>QuAIz</strong> - 让AI为教育赋能，让学习更加智能高效！</p>
  <br>
  <p>📅 <strong>文档最后更新</strong>: 2025年7月29日</p>
  <p>🔄 <strong>最新版本</strong>: v2.0.0 (性能优化版)</p>
  <p>👨‍💻 <strong>维护者</strong>: JacksonHe04</p>
</div>