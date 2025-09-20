import { logger } from '../logger';
import { captureError, addBreadcrumb } from '../sentry';

// Mock Sentry methods
jest.mock('../sentry', () => ({
  captureError: jest.fn(),
  addBreadcrumb: jest.fn()
}));

describe('Logger', () => {
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let originalEnv: NodeJS.ProcessEnv;
  
  beforeEach(() => {
    // Spy on console methods
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Store original env
    originalEnv = process.env;
    // Mock import.meta.env.DEV
    Object.defineProperty(import.meta, 'env', {
      value: { DEV: true }
    });

    // Clear mock calls
    jest.clearAllMocks();
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
    
    // Restore original env
    process.env = originalEnv;
  });

  test('logger has required methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  test('logger methods can be called without throwing', () => {
    expect(() => logger.info('Test info message')).not.toThrow();
    expect(() => logger.warn('Test warning message')).not.toThrow();
    expect(() => logger.error('Test error message')).not.toThrow();
  });

  test('logger methods accept options', () => {
    expect(() => logger.info('Test message', { context: 'TestComponent' })).not.toThrow();
    expect(() => logger.warn('Test message', { context: 'TestComponent' })).not.toThrow();
    expect(() => logger.error('Test message', { context: 'TestComponent' })).not.toThrow();
  });

  test('logger error method calls console.error', () => {
    logger.error('Test error message');
    
    // Error messages should always be logged
    expect(errorSpy).toHaveBeenCalled();
  });

  test('logger handles different data types', () => {
    expect(() => logger.info('String message')).not.toThrow();
    expect(() => logger.info('Message with data', { data: { key: 'value' } })).not.toThrow();
    expect(() => logger.info('Message with context', { context: 'TestContext' })).not.toThrow();
  });

  // Test Sentry integration
  describe('Sentry Integration', () => {
    beforeEach(() => {
      // Mock production environment
      Object.defineProperty(import.meta, 'env', {
        value: { DEV: false }
      });
    });

    test('captures errors in production', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', { data: error });
      expect(captureError).toHaveBeenCalledWith(error, { message: 'Error occurred' });
    });

    test('captures error message when no error object provided', () => {
      logger.error('Custom error message', { data: { foo: 'bar' } });
      expect(captureError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          data: { foo: 'bar' }
        })
      );
    });

    test('adds breadcrumbs for warnings in production', () => {
      const context = 'TestComponent';
      const data = { foo: 'bar' };
      logger.warn('Warning message', { context, data });
      
      expect(addBreadcrumb).toHaveBeenCalledWith(
        'Warning message',
        context,
        data
      );
    });

    test('adds breadcrumbs for info logs in production', () => {
      const context = 'TestComponent';
      const data = { foo: 'bar' };
      logger.info('Info message', { context, data });
      
      expect(addBreadcrumb).toHaveBeenCalledWith(
        'Info message',
        context,
        data
      );
    });

    test('does not log to console in production except errors', () => {
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(logSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
