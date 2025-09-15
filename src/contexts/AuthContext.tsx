import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType, SignUpData } from '../types/auth';
import { authService } from '../data/mockUsers';
import { logger } from '../utils/logger';
import { hospitals } from '../data/mockData';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provides authentication state and functions to its children components.
 * This component manages the user's authentication status, including sign-in,
 * sign-out, and access control checks.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored authentication on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('hospitalFinanceUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate that the parsed object has the expected User structure
        if (parsedUser && typeof parsedUser === 'object' && 'id' in parsedUser && 'email' in parsedUser) {
          setUser(parsedUser as User);
        } else {
          logger.warn('Invalid user data in localStorage, removing...', { context: 'AuthContext' });
          localStorage.removeItem('hospitalFinanceUser');
        }
      } catch (error) {
        logger.error('Failed to parse stored user data', { context: 'AuthContext', data: error });
        localStorage.removeItem('hospitalFinanceUser');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Signs in a user with the provided email and password.
   * On successful authentication, the user data is stored in state and localStorage.
   * @param email The user's email.
   * @param password The user's password.
   * @throws Will throw an error if sign-in fails.
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await authService.signIn(email, password);
      if (!userData || !userData.id || !userData.email) {
        throw new Error('Invalid user data received from authentication service');
      }
      setUser(userData);
      localStorage.setItem('hospitalFinanceUser', JSON.stringify(userData));
    } catch (error) {
      logger.error('Sign in failed', { context: 'AuthContext', data: error });
      throw error; // Re-throw to let the component handle the error
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signs up a new user with the provided data.
   * On successful registration, the new user data is stored in state and localStorage.
   * @param userData The user data for registration.
   * @throws Will throw an error if sign-up fails.
   */
  const signUp = async (userData: SignUpData): Promise<void> => {
    setIsLoading(true);
    try {
      const newUser = await authService.signUp(userData);
      if (!newUser || !newUser.id || !newUser.email) {
        throw new Error('Invalid user data received from registration service');
      }
      setUser(newUser);
      localStorage.setItem('hospitalFinanceUser', JSON.stringify(newUser));
    } catch (error) {
      logger.error('Sign up failed', { context: 'AuthContext', data: error });
      throw error; // Re-throw to let the component handle the error
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signs out the current user.
   * Clears user data from state and localStorage.
   */
  const signOut = () => {
    logger.info('User signed out', { context: 'AuthContext', data: { userId: user?.id } });
    setUser(null);
    localStorage.removeItem('hospitalFinanceUser');
  };

  /**
   * Checks if the current user can access a specific hospital.
   * @param hospitalId The ID of the hospital to check.
   * @returns `true` if the user has access, `false` otherwise.
   */
  const canAccessHospital = (hospitalId: string): boolean => {
    if (!user) return false;
    
    switch (user.role) {
      case 'admin':
        return true; // Admin can access all hospitals
      case 'hospital_owner':
        return user.hospitalIds?.includes(hospitalId) || false;
      case 'branch_owner':
        return user.hospitalId === hospitalId;
      default:
        return false;
    }
  };

  /**
   * Gets a list of hospital IDs that the current user can access.
   * @returns An array of hospital ID strings.
   */
  const getAccessibleHospitals = (): string[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'admin':
        return hospitals.map(h => h.id); // All hospitals
      case 'hospital_owner':
        return user.hospitalIds || [];
      case 'branch_owner':
        return user.hospitalId ? [user.hospitalId] : [];
      default:
        return [];
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    canAccessHospital,
    getAccessibleHospitals
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
