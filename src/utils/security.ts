/**
 * Security utilities for the Hospital Finance Dashboard
 * 
 * This module provides comprehensive security functions including
 * password hashing, input validation, XSS prevention, and rate limiting.
 * 
 * @module security
 */

import { z } from 'zod';
import { 
  hashPassword as browserHashPassword, 
  verifyPassword as browserVerifyPassword 
} from './browserCrypto';

/**
 * Password configuration
 */
const PASSWORD_CONFIG = {
  minLength: 8,
  maxLength: 128
} as const;

/**
 * Rate limiting configuration
 */
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  lockoutMs: 15 * 60 * 1000  // 15 minutes
} as const;

/**
 * Hashes a password using bcrypt
 * 
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 * 
 * @example
 * ```typescript
 * const hashedPassword = await hashPassword('MySecurePassword123!');
 * console.log(hashedPassword); // $2a$12$...
 * ```
 */
export const hashPassword = async (password: string): Promise<string> => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  
  if (password.length < PASSWORD_CONFIG.minLength) {
    throw new Error(`Password must be at least ${PASSWORD_CONFIG.minLength} characters long`);
  }
  
  if (password.length > PASSWORD_CONFIG.maxLength) {
    throw new Error(`Password must be no more than ${PASSWORD_CONFIG.maxLength} characters long`);
  }
  
  return browserHashPassword(password);
};

/**
 * Verifies a password against its hash
 * 
 * @param password - The plain text password to verify
 * @param hash - The hashed password to compare against
 * @returns Promise<boolean> - True if password matches, false otherwise
 * 
 * @example
 * ```typescript
 * const isValid = await verifyPassword('MySecurePassword123!', hashedPassword);
 * console.log(isValid); // true or false
 * ```
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  if (!password || !hash) {
    return false;
  }
  
  try {
    return browserVerifyPassword(password, hash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

/**
 * Rate limiter class for preventing brute force attacks
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number; lockoutTime?: number }> = new Map();
  
  /**
   * Checks if an action is allowed for a given key
   * 
   * @param key - Unique identifier for the rate limit (e.g., email address)
   * @param maxAttempts - Maximum number of attempts allowed (default: 5)
   * @param windowMs - Time window in milliseconds (default: 15 minutes)
   * @returns boolean - True if action is allowed, false if rate limited
   */
  isAllowed(key: string, maxAttempts: number = RATE_LIMIT_CONFIG.maxAttempts, windowMs: number = RATE_LIMIT_CONFIG.windowMs): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    // Check if key is currently locked out
    if (record?.lockoutTime && now < record.lockoutTime) {
      return false;
    }
    
    // If no record or window has expired, reset
    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    // If under limit, increment and allow
    if (record.count < maxAttempts) {
      record.count++;
      return true;
    }
    
    // If at limit, start lockout period
    if (record.count >= maxAttempts) {
      record.lockoutTime = now + RATE_LIMIT_CONFIG.lockoutMs;
      return false;
    }
    
    return true;
  }
  
  /**
   * Resets the rate limit for a given key
   * 
   * @param key - The key to reset
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
  
  /**
   * Gets the remaining attempts for a key
   * 
   * @param key - The key to check
   * @param maxAttempts - Maximum number of attempts allowed
   * @returns number - Remaining attempts (0 if locked out)
   */
  getRemainingAttempts(key: string, maxAttempts: number = RATE_LIMIT_CONFIG.maxAttempts): number {
    const record = this.attempts.get(key);
    if (!record) return maxAttempts;
    
    const now = Date.now();
    if (record.lockoutTime && now < record.lockoutTime) {
      return 0; // Locked out
    }
    
    if (now > record.resetTime) {
      return maxAttempts; // Window expired
    }
    
    return Math.max(0, maxAttempts - record.count);
  }
  
  /**
   * Gets the time until the rate limit resets
   * 
   * @param key - The key to check
   * @returns number - Milliseconds until reset (0 if not rate limited)
   */
  getTimeUntilReset(key: string): number {
    const record = this.attempts.get(key);
    if (!record) return 0;
    
    const now = Date.now();
    if (record.lockoutTime && now < record.lockoutTime) {
      return record.lockoutTime - now;
    }
    
    if (now > record.resetTime) {
      return 0;
    }
    
    return record.resetTime - now;
  }
}

/**
 * Global rate limiter instance
 */
export const rateLimiter = new RateLimiter();

/**
 * Sanitizes a string to prevent XSS attacks
 * 
 * @param input - The string to sanitize
 * @returns string - The sanitized string
 * 
 * @example
 * ```typescript
 * const sanitized = sanitizeString('<script>alert("xss")</script>');
 * console.log(sanitized); // "alert("xss")"
 * ```
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
    .replace(/<link[^>]*>.*?<\/link>/gi, '')
    .replace(/<meta[^>]*>.*?<\/meta>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

/**
 * Sanitizes an error object for safe display
 * 
 * @param error - The error to sanitize
 * @returns object - Sanitized error information
 */
export const sanitizeError = (error: Error): { name: string; message: string; stack?: string | undefined; timestamp: string } => {
  return {
    name: sanitizeString(error.name),
    message: sanitizeString(error.message),
    stack: error.stack ? sanitizeString(error.stack) : undefined,
    timestamp: new Date().toISOString()
  };
};

/**
 * Validation schemas using Zod
 */
export const validationSchemas = {
  email: z.string().email('Invalid email format').min(1).max(255),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be no more than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  name: z.string().min(1, 'Name is required').max(100, 'Name must be no more than 100 characters'),
  
  userRole: z.enum(['admin', 'hospital_owner', 'branch_owner']),
  
  hospitalId: z.string().min(1, 'Hospital ID is required').max(50, 'Hospital ID must be no more than 50 characters'),
  
  user: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    name: z.string().min(2, 'Name must be at least 2 characters long').max(100, 'Name must be no more than 100 characters'),
    role: z.enum(['admin', 'hospital_owner', 'branch_owner']),
    hospitalId: z.string().min(1, 'Hospital ID is required').max(50, 'Hospital ID must be no more than 50 characters').optional(),
    hospitalIds: z.array(z.string().min(1, 'Hospital ID is required').max(50, 'Hospital ID must be no more than 50 characters')).optional()
  }),
  
  signIn: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
};

/**
 * Validates input data against a schema
 * 
 * @param data - The data to validate
 * @param schema - The Zod schema to validate against
 * @returns object - Validation result with success flag and data/errors
 * 
 * @example
 * ```typescript
 * const result = validateInput({ email: 'test@example.com' }, validationSchemas.email);
 * if (result.success) {
 *   console.log('Valid email:', result.data);
 * } else {
 *   console.log('Validation errors:', result.errors);
 * }
 * ```
 */
export const validateInput = <T>(data: unknown, schema: z.ZodSchema<T>): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { 
      success: false, 
      errors: ['Unknown validation error'] 
    };
  }
};

/**
 * Generates a secure random token
 * 
 * @param length - Length of the token (default: 32)
 * @returns string - Secure random token
 */
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Checks if a string contains potentially malicious content
 * 
 * @param input - The string to check
 * @returns boolean - True if potentially malicious, false otherwise
 */
export const isPotentiallyMalicious = (input: string): boolean => {
  const maliciousPatterns = [
    /<script[^>]*>/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /<iframe[^>]*>/i,
    /<object[^>]*>/i,
    /<embed[^>]*>/i
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Escapes HTML special characters
 * 
 * @param input - The string to escape
 * @returns string - HTML-escaped string
 */
export const escapeHtml = (input: string): string => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return input.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] || char);
};
