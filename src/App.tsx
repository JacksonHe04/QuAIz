import { AppRouter } from '@/router/AppRouter';
import { LogPanelProvider } from '@/components/LogPanelProvider';

/**
 * 主应用组件
 * QuAIz - AI智能出题系统
 */
function App() {
  return (
    <LogPanelProvider>
      <div className="App">
        <AppRouter />
      </div>
    </LogPanelProvider>
  );
}

export default App;
