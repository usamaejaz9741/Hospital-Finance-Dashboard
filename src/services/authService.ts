/**
 * Secure authentication service for the Hospital Finance Dashboard
 * 
 * This service provides secure authentication functionality including
 * password hashing, rate limiting, and input validation.
 */

import { User, UserRole } from '../types/auth';
import { hashPassword, verifyPassword, rateLimiter, validateInput, validationSchemas } from '../utils/security';
import { logger } from '../utils/logger';

/**
 * Mock user database with hashed passwords
 * In a real application, this would be a database
 */
const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@hospitalfinance.com',
    name: 'System Administrator',
    role: 'admin',
    createdAt: '2024-01-15T08:00:00Z',
    lastLogin: '2024-12-15T10:30:00Z',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2' // Demo password hash
  },
  {
    id: 'owner-1',
    email: 'owner@metrogeneral.com',
    name: 'Sarah Johnson',
    role: 'hospital_owner',
    hospitalIds: ['general-1', 'cardio-1'],
    createdAt: '2024-02-01T09:00:00Z',
    lastLogin: '2024-12-14T15:45:00Z',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2' // Demo password hash
  },
  {
    id: 'branch-1',
    email: 'manager@metrogeneral.com',
    name: 'John Doe',
    role: 'branch_owner',
    hospitalId: 'general-1',
    createdAt: '2024-03-01T11:00:00Z',
    lastLogin: '2024-12-15T08:15:00Z',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2' // Demo password hash
  }
];

/**
 * Secure authentication service
 */
export const authService = {
  /**
   * Signs in a user with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise<User> - Authenticated user data
   * @throws Error if authentication fails
   */
  signIn: async (email: string, password: string): Promise<User> => {
    // Validate input
    const validation = validateInput({ email, password }, validationSchemas.signIn);
    if (!validation.success) {
      throw new Error(validation.errors[0]);
    }

    // Check rate limiting
    if (!rateLimiter.isAllowed(email)) {
      const remainingTime = rateLimiter.getTimeUntilReset(email);
      throw new Error(`Too many login attempts. Please try again in ${Math.ceil(remainingTime / 60000)} minutes.`);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      rateLimiter.isAllowed(email); // Count failed attempt
      throw new Error('No account found with this email address');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash!);
    if (!isValidPassword) {
      rateLimiter.isAllowed(email); // Count failed attempt
      throw new Error('Incorrect password');
    }

    // Clear rate limiting on successful login
    rateLimiter.reset(email);

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Return user without password hash
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;
    
    logger.info('User signed in successfully', {
      context: 'AuthService',
      data: { userId: user.id, email: user.email }
    });

    return userWithoutPassword as User;
  },

  /**
   * Signs up a new user
   * 
   * @param userData - User registration data
   * @returns Promise<User> - New user data
   * @throws Error if registration fails
   */
  signUp: async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    hospitalId?: string;
    hospitalIds?: string[];
  }): Promise<User> => {
    // Validate input
    const validation = validateInput(userData, validationSchemas.user);
    if (!validation.success) {
      throw new Error(validation.errors[0]);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create new user
    const newUser: User & { passwordHash: string } = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      passwordHash,
      ...(userData.hospitalId && { hospitalId: userData.hospitalId }),
      ...(userData.hospitalIds && { hospitalIds: userData.hospitalIds })
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Return user without password hash
    const { passwordHash: _passwordHash, ...userWithoutPassword } = newUser;
    
    logger.info('User registered successfully', {
      context: 'AuthService',
      data: { userId: newUser.id, email: newUser.email, role: newUser.role }
    });

    return userWithoutPassword as User;
  },

  /**
   * Changes a user's password
   * 
   * @param userId - User ID
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise<void>
   * @throws Error if password change fails
   */
  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    // Validate new password
    const validation = validateInput({ password: newPassword }, validationSchemas.password);
    if (!validation.success) {
      throw new Error(validation.errors[0]);
    }

    // Find user
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidCurrentPassword = await verifyPassword(currentPassword, user.passwordHash!);
    if (!isValidCurrentPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);
    user.passwordHash = newPasswordHash;

    logger.info('Password changed successfully', {
      context: 'AuthService',
      data: { userId: user.id, email: user.email }
    });
  },

  /**
   * Resets a user's password (admin function)
   * 
   * @param userId - User ID
   * @param newPassword - New password
   * @returns Promise<void>
   * @throws Error if password reset fails
   */
  resetPassword: async (userId: string, newPassword: string): Promise<void> => {
    // Validate new password
    const validation = validateInput({ password: newPassword }, validationSchemas.password);
    if (!validation.success) {
      throw new Error(validation.errors[0]);
    }

    // Find user
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);
    user.passwordHash = newPasswordHash;

    logger.info('Password reset successfully', {
      context: 'AuthService',
      data: { userId: user.id, email: user.email }
    });
  }
};

/**
 * Role descriptions for UI
 */
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
  branch_owner: {
    title: 'Branch Manager',
    description: 'Access to specific hospital location data only',
    permissions: ['View branch data', 'Generate reports', 'Monitor performance']
  }
};
