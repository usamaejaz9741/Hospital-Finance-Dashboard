import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType, SignUpData } from '../types/auth';
import { authService } from '../data/mockUsers';
import { logger } from '../utils/logger';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

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

  const signOut = () => {
    logger.info('User signed out', { context: 'AuthContext', data: { userId: user?.id } });
    setUser(null);
    localStorage.removeItem('hospitalFinanceUser');
  };

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

  const getAccessibleHospitals = (): string[] => {
    if (!user) return [];
    
    switch (user.role) {
      case 'admin':
        return ['general-1', 'cardio-1', 'pediatric-1', 'trauma-1']; // All hospitals
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
