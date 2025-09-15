import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthWrapper from './components/auth/AuthWrapper';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ErrorBoundary>
          <AuthProvider>
            <ErrorBoundary>
              <div className="App min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 overflow-x-hidden">
                <AuthWrapper>
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                </AuthWrapper>
              </div>
            </ErrorBoundary>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
