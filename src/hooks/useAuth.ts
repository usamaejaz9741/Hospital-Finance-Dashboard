import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../types/auth';

/**
 * Custom hook to access the authentication context.
 * 
 * @description This hook provides access to the current authentication state and methods
 * for signing in, signing up, and signing out users. It also provides utilities for
 * checking user permissions and accessible hospitals.
 * 
 * @returns {AuthContextType} The authentication context containing:
 *   - user: Current authenticated user or null
 *   - isAuthenticated: Boolean indicating if user is authenticated
 *   - isLoading: Boolean indicating if authentication is in progress
 *   - signIn: Function to authenticate a user
 *   - signUp: Function to register a new user
 *   - signOut: Function to sign out the current user
 *   - canAccessHospital: Function to check if user can access a specific hospital
 *   - getAccessibleHospitals: Function to get list of hospitals user can access
 * 
 * @throws {Error} Throws an error if used outside of an AuthProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, signOut } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <div>Please sign in</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       Welcome, {user?.name}!
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

