import { logger } from '../logger';

describe('Logger', () => {
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  
  beforeEach(() => {
    // Spy on console methods
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
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
});
