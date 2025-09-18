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
          <div className="App min-h-screen text-white dark:text-white transition-colors duration-300">
            {/* Preload theme styles to prevent first-time abrupt changes */}
            <div className="preload-themes absolute opacity-0 pointer-events-none -z-50" aria-hidden="true">
              <div className="glass-card btn-base btn-primary btn-secondary theme-toggle animate-pulse-glow">
                <div className="dropdown-button dropdown-options gradient-bg-primary"></div>
                <div className="logo-container logo-container-inverted"></div>
                <div className="avatar-gradient-border performance-insight-card"></div>
              </div>
            </div>
            
            {/* Animated Blob Background */}
            <div className="animated-blob-bg">
              <div className="blob blob-center"></div>
            </div>
            
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
