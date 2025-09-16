import React, { useState } from 'react';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import LoadingSpinner from '../LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

interface AuthWrapperProps {
  children: React.ReactNode;
}

/**
 * A component that wraps the main application and handles authentication.
 * It displays a loading spinner while checking the user's authentication status,
 * and shows the sign-in or sign-up page if the user is not authenticated.
 *
 * @param {AuthWrapperProps} props The component props.
 * @param {React.ReactNode} props.children The child components to render if the user is authenticated.
 * @returns {React.ReactElement} The rendered component.
 */
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
