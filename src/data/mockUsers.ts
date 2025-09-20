import { User, UserRole } from '../types/auth';
import { validatePassword } from '../utils/auth';

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@hospitalfinance.com',
    name: 'System Administrator',
    role: 'admin',
    createdAt: '2024-01-15T08:00:00Z',
    lastLogin: '2024-12-15T10:30:00Z'
  },
  {
    id: 'owner-1',
    email: 'owner@metrogeneral.com',
    name: 'Sarah Johnson',
    role: 'hospital_owner',
    hospitalIds: ['general-1', 'cardio-1'], // Owns multiple hospitals
    createdAt: '2024-02-01T09:00:00Z',
    lastLogin: '2024-12-14T15:45:00Z'
  },
  {
    id: 'owner-2',
    email: 'owner@childrensmed.com',
    name: 'Dr. Michael Chen',
    role: 'hospital_owner',
    hospitalIds: ['pediatric-1'],
    createdAt: '2024-02-15T10:00:00Z',
    lastLogin: '2024-12-13T12:20:00Z'
  },
  {
    id: 'branch-1',
    email: 'manager@metrogeneral.com',
    name: 'John Doe',
    role: 'branch_owner',
    hospitalId: 'general-1',
    createdAt: '2024-03-01T11:00:00Z',
    lastLogin: '2024-12-15T08:15:00Z'
  },
  {
    id: 'branch-2',
    email: 'manager@heartcenter.com',
    name: 'Dr. Emily Rodriguez',
    role: 'branch_owner',
    hospitalId: 'cardio-1',
    createdAt: '2024-03-10T12:00:00Z',
    lastLogin: '2024-12-14T16:30:00Z'
  },
  {
    id: 'branch-3',
    email: 'manager@childrensmed.com',
    name: 'Lisa Thompson',
    role: 'branch_owner',
    hospitalId: 'pediatric-1',
    createdAt: '2024-03-20T13:00:00Z',
    lastLogin: '2024-12-12T14:45:00Z'
  },
  {
    id: 'branch-4',
    email: 'manager@traumacenter.com',
    name: 'Dr. Robert Kim',
    role: 'branch_owner',
    hospitalId: 'trauma-1',
    createdAt: '2024-04-01T14:00:00Z',
    lastLogin: '2024-12-11T11:20:00Z'
  },
  {
    id: 'admin-2',
    email: 'usama@alviglobal.com',
    name: 'Usama',
    role: 'admin',
    createdAt: '2024-01-10T08:00:00Z',
    lastLogin: '2024-12-18T10:00:00Z'
  }
];

// Mock authentication service
export const authService = {
  signIn: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check password strength using proper validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('No account found with this email address');
    }
    
    // Simulate rate limiting (in real app, this would be server-side)
    const attemptKey = `login_attempts_${email}`;
    const attempts = parseInt(localStorage.getItem(attemptKey) || '0');
    if (attempts >= 5) {
      const lockoutTime = localStorage.getItem(`lockout_${email}`);
      if (lockoutTime && Date.now() - parseInt(lockoutTime) < 15 * 60 * 1000) {
        throw new Error('Account temporarily locked due to too many failed attempts. Try again in 15 minutes.');
      } else {
        // Reset attempts after lockout period
        localStorage.removeItem(attemptKey);
        localStorage.removeItem(`lockout_${email}`);
      }
    }
    
    // For demo purposes, we'll accept any password that meets strength requirements
    // In a real app, you would hash and verify against stored password hash
    const demoPasswords = [
      'UsamaHF2024!',
      'OwnerMG2024!', 
      'ManagerMG2024!',
      'Demo123!@#' // Added a demo password that meets requirements
    ];
    
    if (!demoPasswords.includes(password)) {
      // Increment failed attempts
      localStorage.setItem(attemptKey, (attempts + 1).toString());
      if (attempts + 1 >= 5) {
        localStorage.setItem(`lockout_${email}`, Date.now().toString());
      }
      throw new Error('Incorrect password');
    }
    
    // Clear failed attempts on successful login
    localStorage.removeItem(attemptKey);
    localStorage.removeItem(`lockout_${email}`);
    
    // Update last login time
    user.lastLogin = new Date().toISOString();
    return user;
  },
  
  signUp: async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    hospitalId?: string;
    hospitalIds?: string[];
  }): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user with proper handling of optional properties
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      ...(userData.hospitalId && { hospitalId: userData.hospitalId }),
      ...(userData.hospitalIds && { hospitalIds: userData.hospitalIds })
    };
    
    // Add to mock users (in real app, this would be API call)
    mockUsers.push(newUser);
    
    return newUser;
  }
};

// Role descriptions for UI
export const roleDescriptions = {
  admin: {
    title: 'System Administrator',
    description: 'Full access to all hospitals and system-wide analytics',
    permissions: ['View all hospitals', 'Manage users', 'System configuration']
  },
  hospital_owner: {
    title: 'Hospital Owner',
    description: 'Access to owned hospitals across multiple locations',
    permissions: ['Manage owned hospitals', 'View financial reports', 'Manage branch managers']
  },
  // Internal role name is branch_owner but displayed as Branch Manager for consistency
  branch_owner: {
    title: 'Branch Manager',
    description: 'Access to specific hospital location data only',
    permissions: ['View branch data', 'Generate reports', 'Monitor performance']
  }
};

