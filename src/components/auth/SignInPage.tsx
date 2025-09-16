import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validatePassword, formatAuthError } from '../../utils/auth';
import { demoAccounts } from '../../config/demo';
import { logger } from '../../utils/logger';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Button from '../Button';

interface SignInPageProps {
  onSwitchToSignUp: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onSwitchToSignUp }: SignInPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn, isLoading } = useAuth();

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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2v10m0-10l3 3m-3-3l-3 3" />
              <path d="M12 18v2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              <path d="M4 12h2m8 0h2m-4 0h-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-gray-600 dark:text-dark-muted">Sign in to your Hospital Finance Dashboard</p>
        </div>

        <Card className="mb-6 animate-fade-in-up">
          <div className="p-2 sm:p-4">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 text-center">
              Or sign in with a demo account:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => fillDemo(account.email, account.password)}
                  className="w-full text-center text-xs bg-white dark:bg-dark-surface hover:bg-gray-100 dark:hover:bg-dark-hover-surface border border-gray-200 dark:border-dark-border rounded-lg px-2 py-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="font-semibold text-primary-600 dark:text-primary-400 capitalize">
                    {account.role.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in-up animation-delay-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
            <Input
              id="email"
              type="email"
              label="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <Input
              id="password"
              type="password"
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <Button type="submit" isLoading={isLoading} fullWidth>
              Sign In
            </Button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-dark-muted">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </Card>

        <div className="text-center text-xs text-gray-500 dark:text-dark-muted mt-8 animate-fade-in-up animation-delay-400">
          <p>© 2024 Hospital Finance Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
