/**
 * Password validation configuration
 */
const passwordConfig = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecial: true,
  maxLength: 128
};

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a password against security requirements
 * @param password The password to validate
 * @returns Validation result with error messages if any
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  // Check for empty password
  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required']
    };
  }

  // Check length requirements
  if (password.length < passwordConfig.minLength) {
    errors.push(`Password must be at least ${passwordConfig.minLength} characters long`);
  }
  if (password.length > passwordConfig.maxLength) {
    errors.push(`Password cannot be longer than ${passwordConfig.maxLength} characters`);
  }

  // Check character requirements
  if (passwordConfig.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (passwordConfig.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (passwordConfig.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (passwordConfig.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeating characters (3 or more times)');
  }
  if (/12345|qwerty|password|admin/i.test(password)) {
    errors.push('Password contains a common pattern');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Ensures consistent error message formatting
 * @param error The error to format
 * @returns A user-friendly error message
 */
export const formatAuthError = (error: unknown): string => {
  if (error instanceof Error) {
    // Hide implementation details from users
    if (error.message.includes('Invalid credentials')) {
      return 'Invalid email or password';
    }
    if (error.message.includes('Rate limit')) {
      return 'Too many attempts. Please try again later';
    }
    return 'An error occurred during authentication';
  }
  return 'An unexpected error occurred';
};