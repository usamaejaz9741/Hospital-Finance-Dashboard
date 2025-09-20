/**
 * Security utilities test suite
 * 
 * Tests for password hashing, rate limiting, input validation,
 * XSS prevention, and other security functions.
 */

import {
  hashPassword,
  verifyPassword,
  RateLimiter,
  sanitizeString,
  sanitizeError,
  validateInput,
  validationSchemas,
  generateSecureToken,
  isPotentiallyMalicious,
  escapeHtml
} from '../security';

describe('Security Utilities', () => {
  describe('Password Hashing', () => {
    test('hashes password correctly', async () => {
      const password = 'Demo123456!';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50); // bcrypt hash length
    });

    test('verifies correct password', async () => {
      const password = 'Demo123456!';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    test('rejects incorrect password', async () => {
      const password = 'Demo123456!';
      const wrongPassword = 'wrongdemo456';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });

    test('throws error for invalid password length', async () => {
      await expect(hashPassword('short')).rejects.toThrow('Password must be at least 8 characters long');
      await expect(hashPassword('a'.repeat(200))).rejects.toThrow('Password must be no more than 128 characters long');
    });

    test('throws error for empty password', async () => {
      await expect(hashPassword('')).rejects.toThrow('Password must be a non-empty string');
      await expect(hashPassword(null as never)).rejects.toThrow('Password must be a non-empty string');
    });
  });

  describe('Rate Limiter', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
      rateLimiter = new RateLimiter();
    });

    test('allows requests within limit', () => {
      const key = 'test@example.com';
      
      // Should allow first 5 attempts
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.isAllowed(key)).toBe(true);
      }
    });

    test('blocks requests after limit', () => {
      const key = 'test@example.com';
      
      // Exhaust the limit
      for (let i = 0; i < 5; i++) {
        rateLimiter.isAllowed(key);
      }
      
      // 6th attempt should be blocked
      expect(rateLimiter.isAllowed(key)).toBe(false);
    });

    test('resets after window expires', () => {
      const key = 'test@example.com';
      const shortWindow = 100; // 100ms
      
      // Exhaust the limit
      for (let i = 0; i < 5; i++) {
        rateLimiter.isAllowed(key, 5, shortWindow);
      }
      
      // Should be blocked
      expect(rateLimiter.isAllowed(key, 5, shortWindow)).toBe(false);
      
      // Wait for window to expire
      setTimeout(() => {
        expect(rateLimiter.isAllowed(key, 5, shortWindow)).toBe(true);
      }, 150);
    });

    test('resets rate limit for key', () => {
      const key = 'test@example.com';
      
      // Exhaust the limit
      for (let i = 0; i < 5; i++) {
        rateLimiter.isAllowed(key);
      }
      
      // Should be blocked
      expect(rateLimiter.isAllowed(key)).toBe(false);
      
      // Reset and should be allowed again
      rateLimiter.reset(key);
      expect(rateLimiter.isAllowed(key)).toBe(true);
    });

    test('tracks remaining attempts correctly', () => {
      const key = 'test@example.com';
      const maxAttempts = 5;
      
      expect(rateLimiter.getRemainingAttempts(key, maxAttempts)).toBe(5);
      
      rateLimiter.isAllowed(key, maxAttempts);
      expect(rateLimiter.getRemainingAttempts(key, maxAttempts)).toBe(4);
      
      // Exhaust all attempts
      for (let i = 0; i < 4; i++) {
        rateLimiter.isAllowed(key, maxAttempts);
      }
      
      expect(rateLimiter.getRemainingAttempts(key, maxAttempts)).toBe(0);
    });
  });

  describe('XSS Prevention', () => {
    test('sanitizes script tags', () => {
      const malicious = '<script>alert("xss")</script>';
      const sanitized = sanitizeString(malicious);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
    });

    test('sanitizes javascript: URLs', () => {
      const malicious = 'javascript:alert("xss")';
      const sanitized = sanitizeString(malicious);
      
      expect(sanitized).not.toContain('javascript:');
    });

    test('sanitizes event handlers', () => {
      const malicious = '<div onclick="alert(\'xss\')">Click me</div>';
      const sanitized = sanitizeString(malicious);
      
      expect(sanitized).not.toContain('onclick=');
    });

    test('sanitizes iframe tags', () => {
      const malicious = '<iframe src="javascript:alert(\'xss\')"></iframe>';
      const sanitized = sanitizeString(malicious);
      
      expect(sanitized).not.toContain('<iframe');
      expect(sanitized).not.toContain('</iframe>');
    });

    test('preserves safe content', () => {
      const safe = 'This is safe content with numbers 123 and symbols !@#';
      const sanitized = sanitizeString(safe);
      
      expect(sanitized).toBe(safe);
    });

    test('handles empty and null input', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString(null as never)).toBe('');
      expect(sanitizeString(undefined as never)).toBe('');
    });
  });

  describe('Error Sanitization', () => {
    test('sanitizes error object', () => {
      const error = new Error('<script>alert("xss")</script>');
      const sanitized = sanitizeError(error);
      
      expect(sanitized.name).toBe('Error');
      expect(sanitized.message).not.toContain('<script>');
      expect(sanitized.timestamp).toBeDefined();
    });

    test('handles error without stack', () => {
      const error = new Error('Test error');
      delete (error as Error & { stack?: string }).stack;
      const sanitized = sanitizeError(error);
      
      expect(sanitized.stack).toBeUndefined();
    });
  });

  describe('Input Validation', () => {
    test('validates email correctly', () => {
      const validEmail = 'test@example.com';
      const result = validateInput(validEmail, validationSchemas.email);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validEmail);
      }
    });

    test('rejects invalid email', () => {
      const invalidEmail = 'not-an-email';
      const result = validateInput(invalidEmail, validationSchemas.email);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]).toContain('Invalid email format');
      }
    });

    test('validates password correctly', () => {
      const validPassword = 'Demo123456!';
      const result = validateInput(validPassword, validationSchemas.password);
      
      expect(result.success).toBe(true);
    });

    test('rejects weak password', () => {
      const weakPassword = '123';
      const result = validateInput(weakPassword, validationSchemas.password);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    test('validates user object correctly', () => {
      const validUser = {
        email: 'test@example.com',
        password: 'Demo123456!',
        name: 'Test User',
        role: 'admin' as const
      };
      
      const result = validateInput(validUser, validationSchemas.user);
      expect(result.success).toBe(true);
    });

    test('rejects invalid user object', () => {
      const invalidUser = {
        email: 'not-an-email',
        password: '123',
        name: '',
        role: 'invalid-role' as never
      };
      
      const result = validateInput(invalidUser, validationSchemas.user);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Token Generation', () => {
    test('generates secure token', () => {
      const token = generateSecureToken(32);
      
      expect(token).toBeDefined();
      expect(token.length).toBe(32);
      expect(/^[A-Za-z0-9]+$/.test(token)).toBe(true);
    });

    test('generates different tokens', () => {
      const token1 = generateSecureToken(16);
      const token2 = generateSecureToken(16);
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('Malicious Content Detection', () => {
    test('detects script tags', () => {
      expect(isPotentiallyMalicious('<script>alert("xss")</script>')).toBe(true);
    });

    test('detects javascript URLs', () => {
      expect(isPotentiallyMalicious('javascript:alert("xss")')).toBe(true);
    });

    test('detects event handlers', () => {
      expect(isPotentiallyMalicious('<div onclick="alert(\'xss\')">')).toBe(true);
    });

    test('detects iframe tags', () => {
      expect(isPotentiallyMalicious('<iframe src="evil.com">')).toBe(true);
    });

    test('allows safe content', () => {
      expect(isPotentiallyMalicious('This is safe content')).toBe(false);
      expect(isPotentiallyMalicious('https://example.com')).toBe(false);
    });
  });

  describe('HTML Escaping', () => {
    test('escapes HTML special characters', () => {
      const input = '<script>alert("xss")</script>';
      const escaped = escapeHtml(input);
      
      expect(escaped).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    test('escapes all special characters', () => {
      const input = '&<>"\'/';
      const escaped = escapeHtml(input);
      
      expect(escaped).toBe('&amp;&lt;&gt;&quot;&#x27;&#x2F;');
    });

    test('preserves safe content', () => {
      const input = 'Hello World 123';
      const escaped = escapeHtml(input);
      
      expect(escaped).toBe(input);
    });
  });
});
