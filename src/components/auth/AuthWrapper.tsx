import React, { useState } from 'react';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import { useAuth } from '../../hooks/useAuth';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return isSignUp ? (
      <SignUpPage onSwitchToSignIn={() => setIsSignUp(false)} />
    ) : (
      <SignInPage onSwitchToSignUp={() => setIsSignUp(true)} />
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
