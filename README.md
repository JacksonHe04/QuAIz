# QuAIz - 基于大模型的智能试卷生成+刷题+批改

> Quiz You by AI Zipply - 基于AI的智能试卷生成与批改系统
在线链接：[https://quaiz-ai.vercel.app](https://quaiz-ai.vercel.app)

## 📖 项目简介

QuAIz是一个现代化的AI驱动的在线出题系统，支持多种题型的智能生成、在线答题和自动批改。用户只需简单配置需求，AI就能生成个性化的试卷，并在答题完成后提供详细的批改反馈。项目采用React 19 + TypeScript + Vite技术栈，具备完整的流式渲染能力和响应式设计。

## ✨ 核心特性

### 🤖 AI智能出题
- **多题型支持**：单选题、多选题、填空题、简答题、代码输出题、代码编写题
- **个性化配置**：自定义学科主题、题目数量、难度要求
- **流式生成**：实时显示AI生成过程，提升用户体验
- **智能提示词**：优化的prompt模板确保高质量题目生成

### 📝 在线答题系统
- **响应式设计**：支持桌面端和移动端答题
- **题目导航**：快速跳转到任意题目，实时显示答题进度
- **自动保存**：答案实时保存，防止数据丢失
- **多样化组件**：针对不同题型提供专门的答题界面

### 🎯 AI智能批改
- **自动评分**：AI根据标准答案和评分规则自动打分
- **详细反馈**：每道题提供具体的批改意见和改进建议
- **综合评价**：生成整体学习报告和建议

## 🛠️ 技术栈

### 前端技术
- **React 19** - 现代化 Web 框架，支持最新特性
- **TypeScript 5.8** - 类型安全的JavaScript超集
- **Vite 7** - 极速的前端构建工具
- **TailwindCSS 4** - 实用优先的CSS框架，支持最新语法
- **Zustand 5** - 轻量级状态管理库

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
│   ├── components/            # 可复用组件
│   │   ├── LogPanel/         # 日志面板组件
│   │   ├── LogPanelProvider.tsx  # 日志面板上下文
│   │   └── questions/        # 题型组件库
│   │       ├── QuestionRenderer.tsx  # 题目渲染器
│   │       ├── SingleChoiceQuestion.tsx
│   │       ├── MultipleChoiceQuestion.tsx
│   │       ├── FillBlankQuestion.tsx
│   │       ├── ShortAnswerQuestion.tsx
│   │       ├── CodeOutputQuestion.tsx
│   │       └── CodeWritingQuestion.tsx
│   ├── pages/                 # 页面组件
│   │   ├── generation/        # 题目生成页面模块
│   │   │   ├── index.tsx     # 生成页面主组件
│   │   │   ├── components/   # 生成页面子组件
│   │   │   ├── hooks/        # 生成页面hooks
│   │   │   └── constants/    # 生成页面常量
│   │   ├── quiz/             # 答题页面模块
│   │   │   ├── index.tsx     # 答题页面主组件
│   │   │   ├── components/   # 答题页面子组件
│   │   │   └── hooks/        # 答题页面hooks
│   │   └── result/           # 结果页面模块
│   │       ├── index.tsx     # 结果页面主组件
│   │       ├── components/   # 结果页面子组件
│   │       └── hooks/        # 结果页面hooks
│   ├── stores/               # 状态管理
│   │   ├── useAppStore.ts    # 主应用状态
│   │   └── useLogStore.ts    # 日志状态
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
│   ├── utils/                # 工具函数
│   │   └── presetStorage.ts  # 预设存储工具
│   ├── styles/               # 样式文件
│   │   └── index.css         # 全局样式
│   ├── App.tsx               # 根组件
│   ├── main.tsx              # 应用入口
│   └── vite-env.d.ts         # Vite类型声明
├── docs/                     # 项目文档
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
- **LogStore**: 管理系统日志和调试信息

### 智能路由系统

基于状态的自动路由切换，无需手动导航：
- 根据应用状态自动切换页面（生成→答题→结果）
- 支持流式生成过程中的实时页面跳转
- 完整的状态恢复和错误处理机制

### 流式渲染技术

项目实现了创新的流式渲染技术，提供极致的用户体验：
- **实时解析**：动态解析AI输出的JSON片段
- **增量渲染**：已完成的题目立即显示，无需等待
- **进度反馈**：实时显示生成和批改进度
- **错误恢复**：支持网络中断后的状态恢复

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

### 智能题目生成

- **多模型支持**：兼容多种LLM API（默认支持智谱AI GLM-4）
- **流式生成**：支持实时流式输出，边生成边显示
- **备用机制**：LLM配置缺失时自动切换到模拟API
- **预设管理**：支持保存和加载常用的题目配置方案

### 答题体验优化

- **智能导航**：题目导航栏实时显示答题状态
- **自动保存**：答案实时保存到状态管理中
- **进度追踪**：可视化答题进度和完成状态
- **滚动定位**：点击导航自动滚动到对应题目

### 批改系统

- **多维度评分**：支持不同题型的专门评分逻辑
- **详细反馈**：每道题提供具体的批改意见
- **统计分析**：生成答题统计和学习建议
- **结果导出**：支持打印和保存批改结果

### 开发者友好

- **组件化设计**：高度模块化的组件架构
- **Hook封装**：业务逻辑封装为可复用的Hook
- **类型安全**：完整的TypeScript类型定义
- **调试支持**：内置日志系统和开发工具

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
</div>