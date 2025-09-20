import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { validatePassword, formatAuthError } from '../../utils/auth';
import { demoAccounts } from '../../config/demo';
import { logger } from '../../utils/logger';

interface SignInPageProps {
  onSwitchToSignUp: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onSwitchToSignUp }: SignInPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn, isLoading } = useAuth();
  const { resolvedTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setErrorMessage(validation.errors[0] || 'Invalid password');
      return;
    }

    try {
      logger.info('Sign in attempt', { context: 'SignInPage', data: { email } });
      await signIn(email, password);
      logger.info('Sign in successful', { context: 'SignInPage', data: { email } });
    } catch (error) {
      logger.error('Sign in failed', { context: 'SignInPage', data: { email, error } });
      setErrorMessage(formatAuthError(error));
    }
  };

  const fillDemo = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen text-white dark:text-white relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background with glassmorphism */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob-container">
          <div className="blob blob-center"></div>
        </div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="flex justify-center mb-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center animate-pulse-glow shadow-lg transition-all duration-300 interactive-element"
              style={{
                background: resolvedTheme === 'light' 
                  ? 'white' 
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.3))',
                border: resolvedTheme === 'light' 
                  ? '2px solid rgba(139, 92, 246, 0.2)' 
                  : '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <svg className="w-8 h-8 relative z-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="logo-gradient-signin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  stroke={resolvedTheme === 'light' ? "url(#logo-gradient-signin)" : "white"} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Welcome back</h2>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Sign in to your Hospital Finance Dashboard</p>
        </div>

        <div className="glass-card rounded-xl mb-6 animate-fade-in-up" style={{ padding: 'var(--space-4)' }}>
          <h3 className="text-sm font-medium mb-3 text-center" style={{ color: 'var(--color-text-secondary)' }}>
            Quick Demo Access:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => fillDemo(account.email, account.password)}
                className="btn-base btn-secondary btn-sm text-xs interactive"
              >
                <span className="capitalize font-medium">
                  {account.role.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl animate-fade-in-up animation-delay-200 component-spacing-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {errorMessage && (
              <div className="glass-card rounded-lg p-4" style={{ 
                background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'rgba(239, 68, 68, 0.9)'
              }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="body-small font-medium">{errorMessage}</span>
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 form-input-focus interactive"
                  style={{
                    border: '1px solid var(--border-secondary)',
                  }}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 rounded-lg border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 form-input-focus interactive"
                    style={{
                      border: '1px solid var(--border-secondary)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn-base btn-primary btn-lg w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span style={{ color: 'white' }}>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="glass-card rounded-lg p-4">
              <p className="text-sm mb-3 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                Don't have an account?
              </p>
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="btn-base btn-secondary btn-md w-full interactive"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs mt-8 animate-fade-in-up animation-delay-400" style={{ color: 'var(--color-text-muted)' }}>
          <p>© 2024 Hospital Finance Dashboard.<br />All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
