/**
 * Available logging levels for the application.
 * 
 * @type LogLevel
 * - `info`: General information and debugging
 * - `warn`: Warning messages for potential issues
 * - `error`: Error messages for failures and exceptions
 */
export type LogLevel = 'info' | 'warn' | 'error';

/**
 * Options for log entries to provide additional context and data.
 * 
 * @interface LogOptions
 */
interface LogOptions {
  /** Context identifier (e.g., component name, module) */
  context?: string;
  
  /** Additional data to log (objects, arrays, etc.) */
  data?: unknown;
}

/**
 * Centralized logging system for the Hospital Finance Dashboard.
 * 
 * Features:
 * - Environment-aware logging (development vs production)
 * - Structured log formatting with timestamps
 * - Context-aware logging with component/module identification
 * - Automatic error handling for production environments
 * - Future-ready for external logging service integration
 * - Type-safe logging methods with proper TypeScript support
 * 
 * The logger automatically adjusts behavior based on the environment:
 * - Development: All logs are output to console with full detail
 * - Production: Only errors are logged, with structured format for monitoring
 * 
 * @class Logger
 * @example
 * ```typescript
 * import { logger } from '../utils/logger';
 * 
 * // Basic logging
 * logger.info('User signed in successfully');
 * logger.warn('Slow API response detected');
 * logger.error('Failed to load user data');
 * 
 * // Contextual logging
 * logger.info('Dashboard data loaded', {
 *   context: 'Dashboard',
 *   data: { hospitalId: 'general-001', recordCount: 150 }
 * });
 * 
 * // Error logging with context
 * logger.error('Authentication failed', {
 *   context: 'AuthService',
 *   data: { email: 'user@example.com', errorCode: 'INVALID_CREDENTIALS' }
 * });
 * ```
 */
class Logger {
  /** Flag indicating if running in development mode */
  private isDev = import.meta.env.DEV;

  /**
   * Formats a log message with timestamp, level, and context.
   * 
   * @private
   * @param level - The log level
   * @param message - The log message
   * @param options - Additional logging options
   * @returns Formatted log message string
   */
  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${context} ${message}`;
  }

  /**
   * Core logging method that handles all log levels.
   * 
   * @private
   * @param level - The log level (info, warn, error)
   * @param message - The log message
   * @param options - Additional logging options
   */
  private log(level: LogLevel, message: string, options?: LogOptions): void {
    // Only log in development unless it's an error
    if (!this.isDev && level !== 'error') return;

    const formattedMessage = this.formatMessage(level, message, options);

    switch (level) {
      case 'info':
        // Info logs only in development
        if (this.isDev) console.log(formattedMessage, options?.data || '');
        break;
      case 'warn':
        // Warning logs only in development
        if (this.isDev) console.warn(formattedMessage, options?.data || '');
        break;
      case 'error':
        // Always log errors, but handle them appropriately in production
        if (this.isDev) {
          console.error(formattedMessage, options?.data || '');
        } else {
          // In production, send to error tracking service
          this.handleProductionError(message, options?.data);
        }
        break;
    }
  }

  /**
   * Handles error logging in production environment.
   * Formats errors for external monitoring services.
   * 
   * @private
   * @param message - The error message
   * @param data - Additional error data
   */
  private handleProductionError(message: string, data?: unknown): void {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    // For now, log in structured format suitable for log aggregators
    console.error({
      message,
      timestamp: new Date().toISOString(),
      environment: 'production',
      data
    });
  }

  /**
   * Logs an informational message.
   * Only outputs in development environment.
   * 
   * @param message - The message to log
   * @param options - Additional logging options
   * 
   * @example
   * ```typescript
   * logger.info('User data loaded successfully');
   * logger.info('API call completed', {
   *   context: 'DataService',
   *   data: { endpoint: '/api/users', duration: '250ms' }
   * });
   * ```
   */
  info(message: string, options?: LogOptions): void {
    this.log('info', message, options);
  }

  /**
   * Logs a warning message.
   * Only outputs in development environment.
   * 
   * @param message - The warning message to log
   * @param options - Additional logging options
   * 
   * @example
   * ```typescript
   * logger.warn('API response time is slow');
   * logger.warn('Deprecated function used', {
   *   context: 'LegacyComponent',
   *   data: { functionName: 'oldCalculateTotal' }
   * });
   * ```
   */
  warn(message: string, options?: LogOptions): void {
    this.log('warn', message, options);
  }

  /**
   * Logs an error message.
   * Outputs in both development and production environments.
   * In production, errors are formatted for external monitoring.
   * 
   * @param message - The error message to log
   * @param options - Additional logging options
   * 
   * @example
   * ```typescript
   * logger.error('Failed to authenticate user');
   * logger.error('Database connection failed', {
   *   context: 'DatabaseService',
   *   data: { connectionString: 'mongodb://localhost', error: e.message }
   * });
   * ```
   */
  error(message: string, options?: LogOptions): void {
    this.log('error', message, options);
  }
}

/**
 * Singleton logger instance for application-wide logging.
 * 
 * This is the main logger instance that should be used throughout
 * the application for consistent logging behavior.
 * 
 * @constant
 * @example
 * ```typescript
 * import { logger } from '../utils/logger';
 * 
 * // Use in any component or utility
 * logger.info('Operation completed successfully');
 * logger.error('Operation failed', { context: 'ComponentName' });
 * ```
 */
export const logger = new Logger();