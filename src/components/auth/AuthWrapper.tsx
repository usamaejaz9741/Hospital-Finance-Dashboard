import React, { useState } from 'react';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import LoadingSpinner from '../LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingSpinner
        size="md"
        text="Loading..."
        className="min-h-screen"
      />
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
