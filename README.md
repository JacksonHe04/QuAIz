# QuAIz - 基于大模型的的智能试卷生成+刷题+批改

> Quiz You by AI Zipply - 基于AI的智能试卷生成与批改系统

## 📖 项目简介

QuAIz是一个现代化的AI驱动的在线出题系统，支持多种题型的智能生成、在线答题和自动批改。用户只需简单配置需求，AI就能生成个性化的试卷，并在答题完成后提供详细的批改反馈。

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
- **React 19** - 现代化UI框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **TailwindCSS 4** - 实用优先的CSS框架
- **Zustand** - 轻量级状态管理

### 开发工具
- **ESLint** - 代码质量检查
- **pnpm** - 高效的包管理器
- **Vercel** - 部署平台

## 📁 项目结构

```
src/
├── components/           # 可复用组件
│   ├── QuestionRenderer.tsx    # 题目渲染器
│   └── questions/              # 各类题型组件
│       ├── SingleChoiceQuestion.tsx
│       ├── MultipleChoiceQuestion.tsx
│       ├── FillBlankQuestion.tsx
│       ├── ShortAnswerQuestion.tsx
│       ├── CodeOutputQuestion.tsx
│       └── CodeWritingQuestion.tsx
├── pages/                # 页面组件
│   ├── GenerationPage.tsx     # 题目生成页面
│   ├── QuizPage.tsx           # 答题页面
│   └── ResultPage.tsx         # 结果展示页面
├── stores/               # 状态管理
│   └── useAppStore.ts         # 全局状态store
├── llm/                  # AI服务模块
│   ├── api/                   # API客户端
│   ├── services/              # 业务服务
│   └── prompt/                # 提示词模板
├── types/                # TypeScript类型定义
├── config/               # 应用配置
├── router/               # 路由管理
└── styles/               # 样式文件
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8

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

### 状态管理

项目使用Zustand进行状态管理，主要包含三个状态模块：

- **GenerationState**: 管理试卷生成流程
- **AnsweringState**: 管理答题进度和状态
- **GradingState**: 管理批改过程和结果

### 流式渲染技术

项目实现了创新的流式渲染技术，在AI生成试卷的过程中：
- 实时解析AI输出的JSON片段
- 动态渲染已完成的题目组件
- 提供流畅的用户体验，无需等待完整生成

## 🔧 配置说明

### 环境变量
复制 `.env.example` 为 `.env` 并配置：

```env
# AI API配置
VITE_LLM_API_KEY=your_api_key
VITE_LLM_BASE_URL=your_api_base_url

# 应用配置
VITE_APP_NAME=QuAIz
VITE_APP_VERSION=1.0.0
```

### 应用配置

<!-- 在 <mcfile name="app.ts" path="/Users/jackson/Codes/QuAIz/src/config/app.ts"></mcfile> 中可以调整： -->
在 [app.ts](/src/config/app.ts) 中可以调整：
- 题目数量限制
- 默认分值设置
- UI动画配置
- API模拟延迟

## 📊 数据结构

### 核心类型定义

```typescript
// 题目类型枚举
enum QuestionType {
  SINGLE_CHOICE = 'single-choice',
  MULTIPLE_CHOICE = 'multiple-choice', 
  FILL_BLANK = 'fill-blank',
  SHORT_ANSWER = 'short-answer',
  CODE_OUTPUT = 'code-output',
  CODE_WRITING = 'code-writing'
}

// 试卷结构
interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: number;
}

// 批改结果
interface GradingResult {
  totalScore: number;
  maxScore: number;
  results: QuestionResult[];
  overallFeedback: string;
}
```

<!-- 详细的类型定义请参考 <mcfile name="index.ts" path="/Users/jackson/Codes/QuAIz/src/types/index.ts"></mcfile> -->
详细的类型定义请参考 [index.ts](/src/types/index.ts)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 配置的代码规范
- 为组件和函数添加 JSDoc 注释
- 保持组件的单一职责原则

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- React 团队提供的优秀框架
- Vite 提供的快速构建工具
- TailwindCSS 提供的实用CSS框架
- 所有开源贡献者的无私奉献

---

**QuAIz** - 让AI为教育赋能，让学习更加智能高效！