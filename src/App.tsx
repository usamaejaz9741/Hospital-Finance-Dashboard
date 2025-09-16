import { Suspense } from 'react';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthWrapper from './components/auth/AuthWrapper';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <div className="App min-h-screen bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-dark-primary transition-colors duration-200 overflow-x-hidden">
            <AuthWrapper>
              <Suspense fallback={<LoadingSpinner text="Loading Dashboard..." className="min-h-screen" />}>
                <Dashboard />
              </Suspense>
            </AuthWrapper>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
