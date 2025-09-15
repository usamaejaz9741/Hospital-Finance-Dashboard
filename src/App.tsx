import Dashboard from './components/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthWrapper from './components/auth/AuthWrapper';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 overflow-visible">
          <AuthWrapper>
            <Dashboard />
          </AuthWrapper>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
