import React, { createContext, useState, useEffect } from 'react';
import { User, AuthContextType, SignUpData } from '../types/auth';
import { authService } from '../data/mockUsers';

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
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('hospitalFinanceUser');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userData = await authService.signIn(email, password);
      setUser(userData);
      localStorage.setItem('hospitalFinanceUser', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: SignUpData): Promise<void> => {
    setIsLoading(true);
    try {
      const newUser = await authService.signUp(userData);
      setUser(newUser);
      localStorage.setItem('hospitalFinanceUser', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
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
