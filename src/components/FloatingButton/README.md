# FloatingButton 浮动按钮组件模块

FloatingButton 模块是 QuAIz 应用中提供浮动按钮和浮动面板功能的通用 UI 组件模块，为应用提供一致的浮动交互体验。

## 📁 目录结构

```
FloatingButton/
├── FloatingButton.tsx      # 浮动按钮主组件
├── FloatingPanel/           # 浮动面板子模块
│   ├── FloatingPanel.tsx   # 浮动面板组件
│   └── index.ts             # 面板模块导出
└── index.ts                 # 模块统一导出
```

## 🎯 核心功能

### 1. 通用浮动按钮
- **位置灵活**: 支持左右两侧定位
- **响应式设计**: 桌面端圆形，移动端半圆形
- **状态管理**: 支持禁用状态和悬停效果
- **主题定制**: 可自定义颜色和样式
- **无障碍**: 完整的无障碍支持

### 2. 浮动展示面板
- **配套使用**: 与浮动按钮配套的展示面板
- **位置对应**: 支持左右定位，与按钮位置对应
- **内容灵活**: 支持任意内容的展示
- **交互完整**: 标题栏、关闭按钮、滚动支持
- **响应式**: 适配不同屏幕尺寸

## 📋 主要组件

### FloatingButton - 浮动按钮组件
- **文件**: `./FloatingButton.tsx`
- **功能**: 通用的浮动按钮组件
- **特性**:
  - 支持左右定位
  - 响应式形状变化
  - 可自定义图标和颜色
  - 悬停动画效果
  - 禁用状态支持

#### 组件属性
```typescript
interface FloatingButtonProps {
  /** 图标组件 */
  icon: LucideIcon;
  /** 点击处理函数 */
  onClick: () => void;
  /** 按钮位置 */
  position: 'left' | 'right';
  /** 按钮颜色主题 */
  color?: string;
  /** 悬停时的颜色 */
  hoverColor?: string;
  /** 提示文本 */
  title?: string;
  /** 距离顶部的位置 */
  top?: string;
  /** 自定义类名 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
}
```

#### 设计特点
- **桌面端**: 12x12 的圆形按钮，位于屏幕边缘
- **移动端**: 8x16 的半圆形按钮，贴合屏幕边缘
- **动画效果**: 悬停时 1.1 倍缩放和颜色变化
- **阴影效果**: 提供立体感的阴影

### FloatingPanel - 浮动面板组件
- **文件**: `./FloatingPanel/FloatingPanel.tsx`
- **功能**: 与浮动按钮配套的展示面板
- **特性**:
  - 可控制显示/隐藏
  - 标题栏和关闭按钮
  - 内容区域滚动支持
  - 位置与按钮对应
  - 响应式宽度调整

#### 组件属性
```typescript
interface FloatingPanelProps {
  /** 是否显示面板 */
  isVisible: boolean;
  /** 关闭面板的处理函数 */
  onClose: () => void;
  /** 面板标题 */
  title: string;
  /** 标题图标 */
  titleIcon?: LucideIcon;
  /** 面板位置 */
  position: 'left' | 'right';
  /** 面板宽度 */
  width?: string;
  /** 距离顶部的位置 */
  top?: string;
  /** 最大高度 */
  maxHeight?: string;
  /** 子组件 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
}
```

#### 设计特点
- **白色背景**: 清晰的白色背景和圆角设计
- **阴影效果**: 提供浮动感的阴影
- **标题栏**: 包含图标、标题和关闭按钮
- **内容区域**: 支持滚动的内容展示区域
- **响应式**: 桌面端和移动端的边距适配

## 🎨 设计特点

### 响应式设计
- **桌面端 (lg+)**:
  - 按钮: 圆形设计，距离边缘 16px
  - 面板: 固定宽度，距离边缘 16px
- **移动端 (< lg)**:
  - 按钮: 半圆形设计，贴合屏幕边缘
  - 面板: 适配宽度，距离边缘 8px

### 视觉一致性
- **位置对应**: 按钮和面板位置保持一致
- **颜色主题**: 支持自定义主题色彩
- **动画效果**: 统一的过渡动画
- **阴影层次**: 一致的阴影效果

### 交互体验
- **即时反馈**: 点击和悬停的即时反馈
- **平滑动画**: 200ms 的平滑过渡动画
- **无障碍**: 完整的键盘导航和屏幕阅读器支持
- **触摸友好**: 移动端优化的触摸体验

## 🔧 使用方式

### 基础浮动按钮
```typescript
import { FloatingButton } from '@/components/FloatingButton';
import { Settings } from 'lucide-react';

const MyComponent = () => {
  const handleClick = () => {
    console.log('按钮被点击');
  };

  return (
    <FloatingButton
      icon={Settings}
      onClick={handleClick}
      position="right"
      title="设置"
    />
  );
};
```

### 自定义样式按钮
```typescript
<FloatingButton
  icon={Bell}
  onClick={handleNotification}
  position="left"
  color="bg-blue-600"
  hoverColor="hover:bg-blue-700"
  title="通知"
  top="top-20"
/>
```

### 配套面板使用
```typescript
import { FloatingButton } from '@/components/FloatingButton';
import { FloatingPanel } from '@/components/FloatingButton/FloatingPanel';
import { Menu } from 'lucide-react';

const MenuComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <FloatingButton
        icon={Menu}
        onClick={() => setIsVisible(true)}
        position="left"
        title="菜单"
      />
      
      <FloatingPanel
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        title="菜单"
        titleIcon={Menu}
        position="left"
        width="w-64"
      >
        <div className="space-y-2">
          <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
            选项 1
          </button>
          <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
            选项 2
          </button>
        </div>
      </FloatingPanel>
    </>
  );
};
```

### 禁用状态
```typescript
<FloatingButton
  icon={Save}
  onClick={handleSave}
  position="right"
  disabled={isSaving}
  title={isSaving ? '保存中...' : '保存'}
/>
```

## 🎮 实际应用场景

### 1. 日志面板切换
- **组件**: `LogPanel/FloatingToggle.tsx`
- **用途**: 当日志面板关闭时显示的浮动开启按钮
- **位置**: 左侧，使用 BarChart3 图标

### 2. 时间记录显示
- **组件**: `TimeRecorder/OptimizedFloatingTimeRecorder.tsx`
- **用途**: 显示题目生成时间记录
- **位置**: 右侧，使用 Clock 图标
- **特性**: 根据状态变化颜色

### 3. 题目导航
- **组件**: `pages/quiz/index.tsx`
- **用途**: 题目导航面板的触发按钮
- **位置**: 左侧，配合导航面板使用

## 📊 状态管理

### 按钮状态
- **正常状态**: 默认颜色和悬停效果
- **禁用状态**: 透明度降低，禁用点击
- **加载状态**: 可配合加载图标使用

### 面板状态
- **显示/隐藏**: 通过 `isVisible` 属性控制
- **内容更新**: 支持动态内容更新
- **滚动状态**: 内容超出时自动显示滚动条

## 🎨 样式定制

### 颜色主题
```typescript
// 默认灰色主题
color="bg-gray-900"
hoverColor="hover:bg-gray-700"

// 蓝色主题
color="bg-blue-600"
hoverColor="hover:bg-blue-700"

// 绿色主题
color="bg-green-600"
hoverColor="hover:bg-green-700"

// 红色主题
color="bg-red-600"
hoverColor="hover:bg-red-700"
```

### 位置定制
```typescript
// 顶部位置
top="top-20"    // 距离顶部 5rem
top="top-32"    // 距离顶部 8rem
top="top-40"    // 距离顶部 10rem
top="top-56"    // 距离顶部 14rem
```

### 面板尺寸
```typescript
// 宽度选项
width="w-64"     // 16rem
width="w-72"     // 18rem
width="w-80"     // 20rem
width="w-96"     // 24rem

// 最大高度
maxHeight="max-h-[calc(100vh-12rem)]"  // 视口高度减去 12rem
maxHeight="max-h-96"                   // 固定最大高度 24rem
```

## 🔗 类型定义

### 位置类型
```typescript
export type FloatingPosition = 'left' | 'right';
export type FloatingPanelPosition = 'left' | 'right';
```

### 图标类型
```typescript
import type { LucideIcon } from 'lucide-react';

// 支持所有 Lucide React 图标
icon: LucideIcon
```

## 🚀 性能优化

### 渲染优化
- **条件渲染**: 面板在不可见时返回 null
- **事件处理**: 使用 useCallback 优化事件处理函数
- **样式计算**: 样式类名的动态计算优化

### 内存管理
- **组件卸载**: 正确清理事件监听器
- **状态清理**: 组件卸载时清理状态
- **引用管理**: 避免内存泄漏

## 🔗 相关模块

- **日志面板**: `../LogPanel/` - 使用 FloatingToggle 组件
- **时间记录**: `../TimeRecorder/` - 使用浮动按钮和面板
- **答题页面**: `../../pages/quiz/` - 使用导航面板
- **图标库**: `lucide-react` - 提供图标支持

## 🛠️ 开发指南

### 添加新的浮动功能
1. 创建新的组件文件
2. 使用 FloatingButton 和 FloatingPanel
3. 定义状态管理逻辑
4. 添加到相应页面

### 自定义样式
1. 使用 className 属性添加自定义样式
2. 通过 color 和 hoverColor 定制主题
3. 使用 top 属性调整位置
4. 通过 width 和 maxHeight 调整面板尺寸

### 无障碍支持
1. 使用 title 属性提供提示文本
2. 确保键盘导航支持
3. 提供适当的 ARIA 标签
4. 支持屏幕阅读器

## 👨‍💻 开发者

- **作者**: JacksonHe04
- **项目**: QuAIz - AI 智能刷题系统
- **模块**: 浮动交互核心 UI 组件
- **设计理念**: 通用性、一致性、响应式