import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * 时间记录状态接口
 */
interface TimeRecorderState {
  /** 开始时间 */
  startTime: number | null;
  /** 结束时间 */
  endTime: number | null;
  /** 总耗时 */
  duration: number | null;
  /** 当前状态 */
  status: 'idle' | 'generating' | 'completed' | 'error';
  /** 实时耗时（用于生成中状态） */
  currentDuration: number;
  /** 是否展开详细面板 */
  isExpanded: boolean;
}

/**
 * 时间记录操作接口
 */
interface TimeRecorderActions {
  /** 开始计时 */
  startTiming: () => void;
  /** 结束计时 */
  endTiming: () => void;
  /** 设置错误状态 */
  setError: () => void;
  /** 重置状态 */
  reset: () => void;
  /** 更新实时耗时 */
  updateCurrentDuration: (duration: number) => void;
  /** 切换展开状态 */
  toggleExpanded: () => void;
  /** 设置展开状态 */
  setExpanded: (expanded: boolean) => void;
}

/**
 * 时间记录Store类型
 */
type TimeRecorderStore = TimeRecorderState & TimeRecorderActions;

/**
 * 全局时间记录状态管理
 * 独立于其他状态，避免重新渲染导致的状态丢失
 */
export const useTimeRecorderStore = create<TimeRecorderStore>()(
  subscribeWithSelector((set, get) => ({
    // 初始状态
    startTime: null,
    endTime: null,
    duration: null,
    status: 'idle',
    currentDuration: 0,
    isExpanded: false,

    // 操作方法
    startTiming: () => {
      const now = Date.now();
      set({
        startTime: now,
        endTime: null,
        duration: null,
        status: 'generating',
        currentDuration: 0,
      });
    },

    endTiming: () => {
      const { startTime } = get();
      if (!startTime) return;

      const now = Date.now();
      const duration = now - startTime;

      set({
        endTime: now,
        duration,
        status: 'completed',
        currentDuration: duration,
      });
    },

    setError: () => {
      set({
        status: 'error',
      });
    },

    reset: () => {
      set({
        startTime: null,
        endTime: null,
        duration: null,
        status: 'idle',
        currentDuration: 0,
        isExpanded: false,
      });
    },

    updateCurrentDuration: (duration: number) => {
      // 避免过于频繁的状态更新，减少性能开销
      const currentState = get();
      if (Math.abs(duration - currentState.currentDuration) > 50) {
        set({ currentDuration: duration });
      }
    },

    toggleExpanded: () => {
      set(state => ({ isExpanded: !state.isExpanded }));
    },

    setExpanded: (expanded: boolean) => {
      set({ isExpanded: expanded });
    },
  }))
);

/**
 * 同步主应用状态到时间记录状态
 * 避免重复同步和状态冲突，优化性能
 */
export const syncTimeRecorderWithAppState = (generationState: {
  status: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
}) => {
  const { startTiming, endTiming, setError, reset } =
    useTimeRecorderStore.getState();
  const currentTimeState = useTimeRecorderStore.getState();

  // 如果时间记录已经完成，不再同步（保护已完成的记录）
  if (currentTimeState.status === 'completed' && currentTimeState.startTime) {
    return;
  }

  // 避免相同状态的重复同步
  if (currentTimeState.status === generationState.status) {
    return;
  }

  switch (generationState.status) {
    case 'generating':
      if (generationState.startTime) {
        useTimeRecorderStore.setState({
          startTime: generationState.startTime,
          endTime: null,
          duration: null,
          status: 'generating',
          currentDuration: Date.now() - generationState.startTime,
        });
      } else {
        startTiming();
      }
      break;
    case 'complete':
    case 'completed':
      if (
        generationState.startTime &&
        generationState.endTime &&
        generationState.duration
      ) {
        useTimeRecorderStore.setState({
          startTime: generationState.startTime,
          endTime: generationState.endTime,
          duration: generationState.duration,
          status: 'completed',
          currentDuration: generationState.duration,
        });
      } else {
        endTiming();
      }
      break;
    case 'error':
      setError();
      break;
    case 'idle':
    default: {
      // 只有在没有任何时间记录时才重置
      if (!currentTimeState.startTime) {
        reset();
      }
      break;
    }
  }
};
