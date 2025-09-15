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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-dark-bg dark:to-slate-900 text-gray-900 dark:text-dark-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-gray-600 dark:text-dark-muted">Sign in to your Hospital Finance Dashboard</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Demo Accounts:</h3>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => fillDemo(account.email, account.password)}
                className="block w-full text-left text-xs bg-white dark:bg-dark-surface hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-dark-border rounded px-2 py-1 transition-colors"
              >
                <span className="font-medium text-blue-900 dark:text-blue-200">{account.role}</span>
                <br />
                <span className="text-blue-700 dark:text-blue-300">{account.email}</span>
              </button>
            ))}
          </div>
        </div>

        <Card>
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

        <div className="text-center text-xs text-gray-500 dark:text-dark-muted">
          <p>© 2024 Hospital Finance Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
