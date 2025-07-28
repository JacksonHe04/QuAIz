# LLM 模块

> 作者：JacksonHe04

QuAIz 项目的大语言模型（LLM）集成模块，提供完整的 AI 驱动的试卷生成和批改功能。该模块采用模块化架构设计，支持多种 LLM 提供商，具备流式处理、错误处理、日志记录等企业级功能。

## 📁 目录结构

```
src/llm/
├── api/                    # API 客户端层
│   ├── client.ts          # LLM 客户端核心实现
│   ├── config.ts          # 配置管理和类型定义
│   ├── errorHandler.ts    # API 错误处理器
│   ├── index.ts           # API 模块统一导出
│   ├── requestLogger.ts   # 请求日志记录器
│   └── streamProcessor.ts # 流式数据处理器
├── prompt/                 # 提示词模板
│   ├── quizGeneration.ts  # 试卷生成提示词
│   └── quizGrading.ts     # 试卷批改提示词
├── services/              # 业务服务层
│   ├── __tests__/         # 单元测试
│   ├── baseService.ts     # 服务基类
│   ├── quizGenerationService.ts # 试卷生成服务
│   ├── quizGradingService.ts    # 试卷批改服务
│   ├── quizService.ts     # 向后兼容的服务入口
│   └── serviceFactory.ts # 服务工厂和单例管理
├── utils/                 # 工具函数
│   ├── json/             # JSON 处理工具
│   │   ├── index.ts      # JSON 模块统一导出
│   │   ├── parser.ts     # JSON 解析和修复
│   │   ├── questionExtractor.ts # 题目提取器
│   │   └── validator.ts  # JSON 验证器
│   ├── stream/           # 流式处理工具
│   │   ├── index.ts      # 流式模块统一导出
│   │   ├── processor.ts  # 流式数据处理器
│   │   ├── requestExecutor.ts # 请求执行器
│   │   ├── textProcessor.ts   # 文本流处理器
│   │   └── types.ts      # 类型定义
│   ├── errorUtils.ts     # 错误处理工具
│   ├── jsonUtils.ts      # JSON 工具（向后兼容）
│   └── streamService.ts  # 流式服务工具
└── index.ts              # 模块主入口
```

## 🚀 核心功能

### 1. 试卷生成服务

支持多种题型的智能试卷生成：

- **单选题**：从多个选项中选择一个正确答案
- **多选题**：从多个选项中选择多个正确答案
- **填空题**：在指定位置填写正确答案
- **简答题**：用文字回答问题
- **代码输出题**：根据给定代码写出运行结果
- **代码编写题**：编写代码实现指定功能

### 2. 试卷批改服务

智能批改系统，支持：

- **自动评分**：根据题型特点进行智能评分
- **详细反馈**：提供具体的批改意见和建议
- **多维度评估**：考虑答案的准确性、完整性和逻辑性
- **灵活评分**：支持部分分数和同义词识别

### 3. 流式处理

- **实时响应**：支持流式数据处理，提供实时反馈
- **进度回调**：提供详细的生成和批改进度信息
- **错误恢复**：具备完善的错误处理和重试机制

## 🔧 使用方法

### 基础配置

```typescript
// 检查 LLM 配置状态
import { checkLLMConfig, getLLMConfigStatus } from './src/llm';

const configStatus = checkLLMConfig();
console.log(getLLMConfigStatus());
```

### 试卷生成

```typescript
import { quizGenerationService } from './src/llm';
import type { GenerationRequest } from '@/types';

const request: GenerationRequest = {
  topic: 'JavaScript 基础',
  questionCount: 10,
  questionTypes: ['single-choice', 'multiple-choice', 'fill-blank'],
  difficulty: 'medium'
};

// 流式生成
const quiz = await quizGenerationService.generateQuizStream(request, {
  onProgress: (quiz, isComplete) => {
    console.log('生成进度:', quiz.questions.length);
  }
});

// 非流式生成
const quiz2 = await quizGenerationService.generateQuiz(request);
```

### 试卷批改

```typescript
import { quizGradingService } from './src/llm';
import type { Quiz } from '@/types';

// 流式批改
const result = await quizGradingService.gradeQuizStream(quiz, {
  onProgress: (result, isComplete) => {
    console.log('批改进度:', result.questionResults.length);
  }
});

// 非流式批改
const result2 = await quizGradingService.gradeQuiz(quiz);
```

### 自定义 LLM 客户端

```typescript
import { createLLMClient, createQuizServices } from './src/llm';

// 创建自定义客户端
const customClient = createLLMClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.example.com/v1',
  model: 'gpt-4',
  temperature: 0.8
});

// 创建使用自定义客户端的服务
const services = createQuizServices(customClient);
```

## 🏗️ 架构设计

### 分层架构

1. **API 层** (`./api/`)：负责与 LLM 提供商的底层通信
2. **服务层** (`./services/`)：提供高级业务逻辑和功能封装
3. **工具层** (`./utils/`)：提供通用的工具函数和辅助功能
4. **提示词层** (`./prompt/`)：管理和生成 LLM 提示词模板

### 核心组件

#### LLM 客户端 (`./api/client.ts`)
- 统一的 LLM API 接口
- 支持流式和非流式请求
- 自动错误处理和重试
- 详细的请求日志记录

#### 服务工厂 (`./services/serviceFactory.ts`)
- 单例模式管理服务实例
- 支持依赖注入和配置更新
- 提供便捷的服务创建方法

#### 流式处理器 (`./utils/stream/`)
- 高性能的流式数据处理
- 支持 JSON 增量解析
- 提供进度回调和状态管理

#### JSON 工具 (`./utils/json/`)
- 智能 JSON 修复和验证
- 支持不完整 JSON 的解析
- 提供题目提取和验证功能

## 🔌 支持的 LLM 提供商

目前支持以下 LLM 提供商：

- **OpenAI**：GPT-3.5, GPT-4 系列
- **Anthropic**：Claude 系列
- **DeepSeek**：DeepSeek Chat, DeepSeek Coder
- **智谱 AI**：GLM-4 系列（默认）

### 环境变量配置

```bash
# LLM API 配置
VITE_LLM_API_KEY=your-api-key
VITE_LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
VITE_LLM_MODEL=glm-4-flash-250414
VITE_LLM_MAX_TOKENS=4000
VITE_LLM_TEMPERATURE=0.7
```

## 🛠️ 开发指南

### 扩展新的题型

1. 在 `./prompt/quizGeneration.ts` 中添加题型定义
2. 在 `./prompt/quizGrading.ts` 中添加批改规则
3. 更新相关的类型定义

### 添加新的 LLM 提供商

1. 在 `./api/config.ts` 中添加提供商配置
2. 根据需要调整 `./api/client.ts` 中的请求格式
3. 更新相关的类型定义和文档

### 自定义服务

```typescript
import { BaseLLMService } from './src/llm/services/baseService';

class CustomService extends BaseLLMService {
  async customOperation(input: string): Promise<string> {
    const messages = [{ role: 'user', content: input }];
    return this.executeLLMRequest(messages, 'custom-op', 'Custom Operation');
  }
}
```

## 📝 注意事项

1. **API 密钥安全**：请妥善保管 API 密钥，不要提交到版本控制系统
2. **速率限制**：注意各 LLM 提供商的 API 调用频率限制
3. **成本控制**：合理设置 `max_tokens` 参数以控制 API 调用成本
4. **错误处理**：建议在生产环境中实现适当的错误处理和用户提示
5. **模型选择**：根据具体需求选择合适的模型，平衡性能和成本

## 🔗 相关文档

- [项目主文档](../../README.md)
- [类型定义](../types/index.ts)
- [应用配置](../config/app.ts)
- [状态管理](../stores/)

## 📄 许可证

本模块遵循项目整体的许可证协议。