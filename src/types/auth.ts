export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hospitalId?: string; // For hospital_owner and branch_owner
  hospitalIds?: string[]; // For hospital_owner with multiple locations
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'admin' | 'hospital_owner' | 'branch_owner';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => void;
  canAccessHospital: (hospitalId: string) => boolean;
  getAccessibleHospitals: () => string[];
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  hospitalId?: string;
  hospitalIds?: string[];
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  code: string;
}

