import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';
import { sanitizeError } from '../utils/security';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * A component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const sanitizedError = sanitizeError(error);
    logger.error('Uncaught error in component', {
      context: 'ErrorBoundary',
      data: {
        error: sanitizedError,
        componentStack: errorInfo.componentStack
      }
    });
    this.setState({
      error,
      errorInfo
    });
  }

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center" style={{ 
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
        }}>
          {/* Animated Blob Background */}
          <div className="animated-blob-bg">
            <div className="blob blob-center"></div>
          </div>
          
          <div className="max-w-md w-full mx-4 relative z-10">
            <div className="glass-card rounded-xl p-8 text-center" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <svg className="w-8 h-8" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">
                Something went wrong
              </h2>
              
              <p className="text-white/70 mb-6">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  fullWidth
                >
                  Refresh Page
                </Button>
                
                <Button
                  onClick={() => this.setState({ hasError: false })}
                  variant="secondary"
                  fullWidth
                >
                  Try Again
                </Button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-white/50 mb-2 hover:text-white/70 transition-colors">
                    Error Details (Development)
                  </summary>
                  <div className="rounded-lg p-3 text-xs overflow-auto" style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <pre className="whitespace-pre-wrap text-red-400 font-mono">
                      {sanitizeError(this.state.error).message}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
