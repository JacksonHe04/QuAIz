import { useEffect } from 'react';
import { AppRouter } from '@/router/AppRouter';
import { LogPanelProvider } from '@/components/LogPanel/LogPanelProvider';
import { useAppStore } from '@/stores/useAppStore';
import { syncTimeRecorderWithAppState } from '@/stores/timeRecorderStore';

/**
 * 主应用组件
 * QuAIz - AI智能出题系统
 */
function App() {
  const { generation } = useAppStore();

  // 同步时间记录状态
  useEffect(() => {
    syncTimeRecorderWithAppState(generation);
  }, [generation]);

  return (
    <LogPanelProvider>
      <div className='App'>
        <AppRouter />
      </div>
    </LogPanelProvider>
  );
}

export default App;
