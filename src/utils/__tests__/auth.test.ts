import { validatePassword, formatAuthError } from '../auth';

describe('Auth Utilities', () => {
  describe('validatePassword', () => {
    test('validates empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });

    test('validates password length', () => {
      const shortPassword = validatePassword('1234567');
      expect(shortPassword.isValid).toBe(false);
      expect(shortPassword.errors).toContain('Password must be at least 8 characters long');

      const longPassword = validatePassword('a'.repeat(129));
      expect(longPassword.isValid).toBe(false);
      expect(longPassword.errors).toContain('Password cannot be longer than 128 characters');
    });

    test('validates character requirements', () => {
      const noUppercase = validatePassword('lowercase123!');
      expect(noUppercase.isValid).toBe(false);
      expect(noUppercase.errors).toContain('Password must contain at least one uppercase letter');

      const noLowercase = validatePassword('UPPERCASE123!');
      expect(noLowercase.isValid).toBe(false);
      expect(noLowercase.errors).toContain('Password must contain at least one lowercase letter');

      const noNumbers = validatePassword('Password!');
      expect(noNumbers.isValid).toBe(false);
      expect(noNumbers.errors).toContain('Password must contain at least one number');

      const noSpecial = validatePassword('Password123');
      expect(noSpecial.isValid).toBe(false);
      expect(noSpecial.errors).toContain('Password must contain at least one special character');
    });

    test('validates against repeating characters', () => {
      const repeating = validatePassword('Passsword123!');
      expect(repeating.isValid).toBe(false);
      expect(repeating.errors).toContain('Password cannot contain repeating characters (3 or more times)');
    });

    test('validates against common patterns', () => {
      const patterns = ['Password123!', 'Admin123!', '12345678!A', 'Qwerty123!'];
      
      patterns.forEach(password => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Password contains a common pattern');
      });
    });

    test('validates strong password', () => {
      const result = validatePassword('StrongP@ssw0rd');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('returns multiple errors for weak password', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('formatAuthError', () => {
    test('formats invalid credentials error', () => {
      const error = new Error('Invalid credentials provided');
      const result = formatAuthError(error);
      expect(result).toBe('Invalid email or password');
    });

    test('formats rate limit error', () => {
      const error = new Error('Rate limit exceeded');
      const result = formatAuthError(error);
      expect(result).toBe('Too many attempts. Please try again later');
    });

    test('formats generic error message', () => {
      const error = new Error('Something went wrong');
      const result = formatAuthError(error);
      expect(result).toBe('An error occurred during authentication');
    });

    test('handles non-Error objects', () => {
      const result = formatAuthError('string error');
      expect(result).toBe('An unexpected error occurred');
    });

    test('handles null/undefined errors', () => {
      expect(formatAuthError(null)).toBe('An unexpected error occurred');
      expect(formatAuthError(undefined)).toBe('An unexpected error occurred');
    });
  });
});
