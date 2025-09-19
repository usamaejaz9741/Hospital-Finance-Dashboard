import { authService } from '../authService';
import { hashPassword, verifyPassword, rateLimiter, validateInput } from '../../utils/security';
import { logger } from '../../utils/logger';

// Mock dependencies
jest.mock('../../utils/security', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  rateLimiter: {
    isAllowed: jest.fn(),
    getTimeUntilReset: jest.fn(),
    reset: jest.fn()
  },
  validateInput: jest.fn(),
  validationSchemas: {
    signIn: { email: 'string', password: 'string' },
    password: { password: 'string' },
    user: { email: 'string', password: 'string', role: 'string' }
  }
}));

jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mocked responses
    (validateInput as jest.Mock).mockReturnValue({ success: true });
    (rateLimiter.isAllowed as jest.Mock).mockReturnValue(true);
    (hashPassword as jest.Mock).mockResolvedValue('hashedPassword123');
    (verifyPassword as jest.Mock).mockResolvedValue(true);
  });

  describe('signIn', () => {
    const validCredentials = {
      email: 'admin@hospitalfinance.com',
      password: 'UsamaHF2024!'
    };

    test('signs in successfully with valid credentials', async () => {
      const user = await authService.signIn(validCredentials.email, validCredentials.password);

      expect(user.email).toBe(validCredentials.email);
      expect(user.role).toBe('admin');
      expect(user.passwordHash).toBeUndefined();
      expect(logger.info).toHaveBeenCalledWith(
        'User signed in successfully',
        expect.any(Object)
      );
    });

    test('throws error on invalid email', async () => {
      const invalidEmail = 'nonexistent@hospitalfinance.com';
      
      await expect(
        authService.signIn(invalidEmail, validCredentials.password)
      ).rejects.toThrow('No account found with this email address');

      expect(rateLimiter.isAllowed).toHaveBeenCalledTimes(2);
    });

    test('throws error on invalid password', async () => {
      (verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.signIn(validCredentials.email, 'wrongpassword')
      ).rejects.toThrow('Incorrect password');

      expect(rateLimiter.isAllowed).toHaveBeenCalledTimes(2);
    });

    test('throws error when rate limited', async () => {
      (rateLimiter.isAllowed as jest.Mock).mockReturnValue(false);
      (rateLimiter.getTimeUntilReset as jest.Mock).mockReturnValue(300000); // 5 minutes

      await expect(
        authService.signIn(validCredentials.email, validCredentials.password)
      ).rejects.toThrow('Too many login attempts. Please try again in 5 minutes');
    });

    test('resets rate limiter on successful login', async () => {
      await authService.signIn(validCredentials.email, validCredentials.password);

      expect(rateLimiter.reset).toHaveBeenCalledWith(validCredentials.email);
    });
  });

  describe('signUp', () => {
    const validUserData = {
      name: 'Test User',
      email: 'test@hospitalfinance.com',
      password: 'TestPassword123!',
      role: 'branch_owner' as const,
      hospitalId: 'test-hospital-1'
    };

    test('registers new user successfully', async () => {
      const newUser = await authService.signUp(validUserData);

      expect(newUser.email).toBe(validUserData.email);
      expect(newUser.role).toBe(validUserData.role);
      expect(newUser.hospitalId).toBe(validUserData.hospitalId);
      expect(newUser.passwordHash).toBeUndefined();
      expect(logger.info).toHaveBeenCalledWith(
        'User registered successfully',
        expect.any(Object)
      );
    });

    test('throws error if user already exists', async () => {
      // Register with admin email (exists in mockUsers)
      const existingUserData = {
        ...validUserData,
        email: 'admin@hospitalfinance.com'
      };
      
      await expect(
        authService.signUp(existingUserData)
      ).rejects.toThrow('User with this email already exists');
    });

    test('handles hospital owner registration with multiple hospitals', async () => {
      const ownerData = {
        ...validUserData,
        email: 'newowner@hospitalfinance.com',
        role: 'hospital_owner' as const,
        hospitalIds: ['hospital-1', 'hospital-2']
      };

      const newUser = await authService.signUp(ownerData);

      expect(newUser.hospitalIds).toEqual(ownerData.hospitalIds);
    });
  });

  describe('changePassword', () => {
    test('changes password successfully', async () => {
      const userId = 'admin-1';
      const currentPassword = 'UsamaHF2024!';
      const newPassword = 'NewPassword123!';

      await authService.changePassword(userId, currentPassword, newPassword);

      expect(verifyPassword).toHaveBeenCalled();
      expect(hashPassword).toHaveBeenCalledWith(newPassword);
      expect(logger.info).toHaveBeenCalledWith(
        'Password changed successfully',
        expect.any(Object)
      );
    });

    test('throws error if user not found', async () => {
      await expect(
        authService.changePassword('nonexistent-id', 'current', 'new')
      ).rejects.toThrow('User not found');
    });

    test('throws error if current password is incorrect', async () => {
      (verifyPassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.changePassword('admin-1', 'wrongpassword', 'newpassword')
      ).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('resetPassword', () => {
    test('resets password successfully', async () => {
      const userId = 'admin-1';
      const newPassword = 'NewPassword123!';

      await authService.resetPassword(userId, newPassword);

      expect(hashPassword).toHaveBeenCalledWith(newPassword);
      expect(logger.info).toHaveBeenCalledWith(
        'Password reset successfully',
        expect.any(Object)
      );
    });

    test('throws error if user not found', async () => {
      await expect(
        authService.resetPassword('nonexistent-id', 'newpassword')
      ).rejects.toThrow('User not found');
    });

    test('throws error if new password is invalid', async () => {
      (validateInput as jest.Mock).mockReturnValue({ success: false, errors: ['Invalid password'] });

      await expect(
        authService.resetPassword('admin-1', 'weak')
      ).rejects.toThrow('Invalid password');
    });
  });
});