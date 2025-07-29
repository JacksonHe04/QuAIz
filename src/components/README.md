# Components 组件模块

本目录包含 QuAIz 应用的共享 UI 组件，提供可复用的界面元素和功能组件。

## 📁 目录结构

```
components/
├── FloatingButton/         # 浮动按钮组件模块
│   ├── FloatingButton.tsx  # 通用浮动按钮
│   ├── FloatingPanel/      # 浮动展示面板
│   │   ├── FloatingPanel.tsx # 面板组件
│   │   └── index.ts        # 面板导出
│   ├── index.ts            # 模块导出
│   └── README.md           # 模块文档
├── LogPanel/               # 日志面板组件模块
│   ├── LogPanelProvider.tsx # 全局日志面板提供者
│   ├── components/         # 基础 UI 组件
│   │   ├── BottomControls.tsx   # 底部控制栏
│   │   ├── CopyButton.tsx       # 复制按钮
│   │   ├── EmptyState.tsx       # 空状态显示
│   │   ├── FloatingToggle.tsx   # 浮动切换按钮
│   │   ├── LogEntry.tsx         # 日志条目
│   │   ├── LogPanel.tsx         # 主面板组件
│   │   ├── PanelHeader.tsx      # 面板头部
│   │   ├── StreamSession.tsx    # 流式会话
│   │   └── TabHeader.tsx        # 标签页头部
│   ├── optimized/          # 性能优化组件
│   │   ├── OptimizedLogEntry.tsx    # 优化日志条目
│   │   ├── OptimizedLogPanel.tsx    # 优化日志面板
│   │   └── VirtualizedLogList.tsx   # 虚拟化列表
│   ├── hooks/              # 自定义 Hooks
│   │   └── useAutoScroll.ts # 自动滚动逻辑
│   ├── utils/              # 工具函数和常量
│   │   ├── constants.ts    # 常量定义
│   │   └── utils.ts        # 工具函数
│   ├── docs/               # 文档
│   ├── index.ts            # 模块导出
│   └── README.md           # 模块文档
├── Question/               # 题目组件模块
│   ├── QuestionRenderer.tsx        # 题目渲染器
│   ├── StreamingQuestionRenderer.tsx # 流式题目渲染器
│   └── questions/          # 各类题型组件
│       ├── CodeOutputQuestion.tsx   # 代码输出题
│       ├── CodeWritingQuestion.tsx  # 代码编写题
│       ├── FillBlankQuestion.tsx    # 填空题
│       ├── MultipleChoiceQuestion.tsx # 多选题
│       ├── ShortAnswerQuestion.tsx  # 简答题
│       ├── SingleChoiceQuestion.tsx # 单选题
│       └── index.ts        # 题型组件导出
├── TimeRecorder/           # 时间记录组件模块
│   ├── TimeRecorder.tsx            # 基础时间记录组件
│   ├── FloatingTimeRecorder.tsx    # 浮动时间记录组件
│   ├── OptimizedFloatingTimeRecorder.tsx # 优化版浮动组件
│   ├── index.ts            # 模块导出
│   └── README.md           # 模块文档
└── LogPanelProvider.tsx    # 日志面板提供者
```

## 🎯 核心组件

### 1. FloatingButton 浮动按钮
- **路径**: `./FloatingButton/`
- **功能**: 通用浮动交互组件系统
- **特性**:
  - 通用浮动按钮组件
  - 浮动展示面板组件
  - 响应式设计（桌面/移动端适配）
  - 多种形状和位置支持
  - 完整的类型定义

### 2. LogPanel 日志面板
- **路径**: `./LogPanel/`
- **功能**: 全局日志记录和流式回复显示
- **特性**:
  - 高性能虚拟化渲染
  - 侧边栏弹出式设计
  - 双标签页切换（系统日志 / 流式回复）
  - 智能自动滚动
  - 内容复制和清空功能
  - 响应式布局适配

### 3. Question 题目组件
- **路径**: `./Question/`
- **功能**: 题目渲染和交互处理
- **特性**:
  - 支持 6 种题型
  - 流式渲染支持
  - 答案状态管理
  - 正确答案显示
  - 禁用状态处理

### 4. TimeRecorder 时间记录
- **路径**: `./TimeRecorder/`
- **功能**: 时间记录和性能监控组件
- **特性**:
  - 精确的时间记录
  - 浮动时间记录器
  - 独立状态管理
  - 实时状态更新
  - 性能优化版本

## 📊 LogPanel 组件详解

### 主要组件

#### LogPanel.tsx - 主面板
- **功能**: 日志面板的主容器组件
- **特性**:
  - 侧边栏弹出效果
  - 双标签页管理
  - 自动滚动控制
  - 响应式设计

#### LogEntry.tsx - 日志条目
- **功能**: 单个日志条目的显示
- **特性**:
  - 多级别日志样式
  - 时间戳格式化
  - 详细信息展开
  - 内容复制功能

#### StreamSession.tsx - 流式会话
- **功能**: AI 流式回复的会话显示
- **特性**:
  - 会话状态指示
  - 内容片段管理
  - 展开/收起切换
  - 持续时间计算

### 工具组件

#### FloatingToggle.tsx - 浮动切换
- **功能**: 面板关闭时的浮动开启按钮
- **位置**: 固定在页面左侧

#### CopyButton.tsx - 复制按钮
- **功能**: 一键复制文本内容
- **特性**: 复制成功提示

#### EmptyState.tsx - 空状态
- **功能**: 无内容时的占位显示
- **适用**: 日志和会话为空时

### 配置和工具

#### constants.ts - 常量配置
```typescript
export const TAB_CONFIG = {
  logs: { icon: '📋', title: '系统日志' },
  stream: { icon: '🤖', title: '实时回复' }
};
```

#### utils.ts - 工具函数
- `getLogLevelStyles()` - 获取日志级别样式
- `formatTimestamp()` - 时间戳格式化
- `formatDuration()` - 持续时间格式化
- `getCategoryIcon()` - 获取分类图标

#### hooks/useAutoScroll.ts - 自动滚动
- **功能**: 管理列表的自动滚动行为
- **特性**: 智能检测用户滚动意图

## 🎮 Question 组件详解

### 渲染器组件

#### QuestionRenderer.tsx - 标准渲染器
- **功能**: 根据题目类型动态渲染对应组件
- **支持题型**: 单选、多选、填空、简答、代码输出、代码编写
- **特性**:
  - 类型安全的题目渲染
  - 统一的答案处理接口
  - 题目编号显示
  - 正确答案模式

#### StreamingQuestionRenderer.tsx - 流式渲染器
- **功能**: 支持部分内容显示的流式渲染
- **特性**:
  - 加载状态显示
  - 部分内容渲染
  - 骨架屏效果
  - 平滑过渡动画

### 题型组件

#### SingleChoiceQuestion.tsx - 单选题
- **功能**: 单选题的渲染和交互
- **特性**: 单选逻辑、选项高亮、正确答案显示

#### MultipleChoiceQuestion.tsx - 多选题
- **功能**: 多选题的渲染和交互
- **特性**: 多选逻辑、选项状态管理、部分正确处理

#### FillBlankQuestion.tsx - 填空题
- **功能**: 填空题的渲染和交互
- **特性**: 文本输入、答案验证、格式化显示

#### ShortAnswerQuestion.tsx - 简答题
- **功能**: 简答题的渲染和交互
- **特性**: 多行文本输入、字数统计、自动调整高度

#### CodeOutputQuestion.tsx - 代码输出题
- **功能**: 代码输出题的渲染和交互
- **特性**: 代码高亮显示、输出结果输入、语法提示

#### CodeWritingQuestion.tsx - 代码编写题
- **功能**: 代码编写题的渲染和交互
- **特性**: 代码编辑器、语法高亮、自动补全

## 🎨 设计特点

### LogPanel 设计
- **侧边栏模式**: 不遮挡主内容，提供挤压式布局
- **双标签页**: 系统日志和流式回复分离显示
- **自动滚动**: 智能检测用户意图，自动跟随最新内容
- **响应式**: 适配不同屏幕尺寸

### Question 设计
- **类型驱动**: 基于题目类型自动选择渲染组件
- **状态管理**: 统一的答案状态管理接口
- **可扩展**: 易于添加新的题型组件
- **一致性**: 统一的视觉风格和交互模式

## 🔧 使用方式

### LogPanel 使用
```typescript
// 在应用根组件中使用
import { LogPanelProvider } from '@/components/LogPanelProvider';

<LogPanelProvider>
  <App />
</LogPanelProvider>
```

### Question 使用
```typescript
// 渲染题目
import { QuestionRenderer } from '@/components/Question/QuestionRenderer';

<QuestionRenderer
  question={question}
  onAnswerChange={handleAnswerChange}
  questionNumber={index + 1}
/>
```

### 流式题目使用
```typescript
// 流式渲染
import { StreamingQuestionRenderer } from '@/components/Question/StreamingQuestionRenderer';

<StreamingQuestionRenderer
  question={streamingQuestion}
  questionNumber={index + 1}
  onAnswerChange={handleAnswerChange}
  disabled={isGenerating}
/>
```

## 🔗 相关模块

- **状态管理**: `../stores/` - LogStore 和 AppStore
- **页面组件**: `../pages/` - 使用这些组件的页面
- **类型定义**: `../types/` - 组件使用的类型定义
- **样式**: `../styles/` - 全局样式和主题

## 👨‍💻 开发者

- **作者**: JacksonHe04
- **项目**: QuAIz - AI 智能刷题系统
- **设计理念**: 组件化、可复用、类型安全