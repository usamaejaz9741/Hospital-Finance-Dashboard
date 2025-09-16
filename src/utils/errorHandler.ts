/**
 * Comprehensive error handling system for the Hospital Finance Dashboard
 */

import { 
  AppError, 
  ErrorSeverity, 
  ErrorContext, 
  RecoverableError, 
  ErrorRecoveryStrategy,
  AuthenticationError,
  ValidationError,
  DataError,
  NetworkError,
  ApplicationError
} from '../types/errors';
import { logger } from './logger';

/**
 * Generate a unique correlation ID for error tracking
 */
function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current error context
 */
function getErrorContext(): ErrorContext {
  return {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    buildVersion: import.meta.env.VITE_BUILD_VERSION || 'unknown'
  };
}

/**
 * Error factory functions
 */
export const ErrorFactory = {
  authentication: (
    code: AuthenticationError['code'],
    message: string,
    context?: Record<string, unknown>
  ): AuthenticationError => {
    const error: AuthenticationError = {
      type: 'authentication',
      code,
      message,
      timestamp: new Date().toISOString()
    };
    if (context !== undefined) {
      error.context = context;
    }
    return error;
  },

  validation: (
    code: ValidationError['code'],
    message: string,
    field?: string,
    context?: Record<string, unknown>
  ): ValidationError => {
    const error: ValidationError = {
      type: 'validation',
      code,
      message,
      timestamp: new Date().toISOString()
    };
    if (field !== undefined) {
      error.field = field;
    }
    if (context !== undefined) {
      error.context = context;
    }
    return error;
  },

  data: (
    code: DataError['code'],
    message: string,
    resourceId?: string,
    resourceType?: string,
    context?: Record<string, unknown>
  ): DataError => {
    const error: DataError = {
      type: 'data',
      code,
      message,
      timestamp: new Date().toISOString()
    };
    if (resourceId !== undefined) {
      error.resourceId = resourceId;
    }
    if (resourceType !== undefined) {
      error.resourceType = resourceType;
    }
    if (context !== undefined) {
      error.context = context;
    }
    return error;
  },

  network: (
    code: NetworkError['code'],
    message: string,
    statusCode?: number,
    endpoint?: string,
    context?: Record<string, unknown>
  ): NetworkError => {
    const error: NetworkError = {
      type: 'network',
      code,
      message,
      timestamp: new Date().toISOString()
    };
    if (statusCode !== undefined) {
      error.statusCode = statusCode;
    }
    if (endpoint !== undefined) {
      error.endpoint = endpoint;
    }
    if (context !== undefined) {
      error.context = context;
    }
    return error;
  },

  application: (
    code: ApplicationError['code'],
    message: string,
    componentName?: string,
    stackTrace?: string,
    context?: Record<string, unknown>
  ): ApplicationError => {
    const error: ApplicationError = {
      type: 'application',
      code,
      message,
      timestamp: new Date().toISOString()
    };
    if (componentName !== undefined) {
      error.componentName = componentName;
    }
    if (stackTrace !== undefined) {
      error.stackTrace = stackTrace;
    }
    if (context !== undefined) {
      error.context = context;
    }
    return error;
  }
};

/**
 * Recovery strategies for different error types
 */
const defaultRecoveryStrategies: Record<string, ErrorRecoveryStrategy> = {
  // Authentication errors
  'AUTH_INVALID_CREDENTIALS': {
    canRetry: true,
    maxRetries: 3,
    userMessage: 'Invalid email or password. Please try again.',
    technicianMessage: 'User provided invalid credentials'
  },
  'AUTH_ACCOUNT_LOCKED': {
    canRetry: false,
    userMessage: 'Your account has been temporarily locked. Please try again later.',
    technicianMessage: 'Account locked due to multiple failed attempts'
  },
  'AUTH_SESSION_EXPIRED': {
    canRetry: false,
    userMessage: 'Your session has expired. Please sign in again.',
    technicianMessage: 'User session expired',
    fallbackAction: () => window.location.href = '/sign-in'
  },

  // Data errors
  'DATA_NOT_FOUND': {
    canRetry: true,
    maxRetries: 2,
    retryDelay: 1000,
    userMessage: 'The requested data could not be found. Please try refreshing the page.',
    technicianMessage: 'Requested resource not found'
  },
  'DATA_PROCESSING_ERROR': {
    canRetry: true,
    maxRetries: 3,
    retryDelay: 2000,
    userMessage: 'There was an error processing your data. Please try again.',
    technicianMessage: 'Data processing failed'
  },

  // Network errors
  'NETWORK_CONNECTION_FAILED': {
    canRetry: true,
    maxRetries: 5,
    retryDelay: 3000,
    userMessage: 'Connection failed. Please check your internet connection and try again.',
    technicianMessage: 'Network connection failed'
  },
  'NETWORK_TIMEOUT': {
    canRetry: true,
    maxRetries: 3,
    retryDelay: 5000,
    userMessage: 'The request timed out. Please try again.',
    technicianMessage: 'Request timeout'
  },

  // Application errors
  'APP_COMPONENT_ERROR': {
    canRetry: true,
    maxRetries: 2,
    userMessage: 'A component error occurred. The page will reload automatically.',
    technicianMessage: 'Component rendering error',
    fallbackAction: () => window.location.reload()
  }
};

/**
 * Determine error severity based on error type and code
 */
function determineErrorSeverity(error: AppError): ErrorSeverity {
  switch (error.type) {
    case 'authentication':
      return error.code === 'AUTH_SESSION_EXPIRED' ? ErrorSeverity.MEDIUM : ErrorSeverity.LOW;
    
    case 'authorization':
      return ErrorSeverity.MEDIUM;
    
    case 'validation':
      return ErrorSeverity.LOW;
    
    case 'data':
      return error.code === 'DATA_NOT_FOUND' ? ErrorSeverity.LOW : ErrorSeverity.MEDIUM;
    
    case 'network':
      return error.code === 'NETWORK_CONNECTION_FAILED' ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM;
    
    case 'application':
      return error.code === 'APP_COMPONENT_ERROR' ? ErrorSeverity.HIGH : ErrorSeverity.CRITICAL;
    
    default:
      return ErrorSeverity.MEDIUM;
  }
}

/**
 * Enhanced error handler class
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private retryAttempts: Map<string, number> = new Map();
  private reportedErrors: Set<string> = new Set();

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle an error with full context and recovery
   */
  handleError(error: AppError | Error | unknown): RecoverableError {
    // Convert unknown errors to application errors
    let appError: AppError;
    
    if (error instanceof Error) {
      appError = ErrorFactory.application(
        'APP_COMPONENT_ERROR',
        error.message,
        'Unknown',
        error.stack
      );
    } else if (this.isAppError(error)) {
      appError = error;
    } else {
      appError = ErrorFactory.application(
        'APP_COMPONENT_ERROR',
        'An unknown error occurred',
        'Unknown',
        String(error)
      );
    }

    const correlationId = generateCorrelationId();
    const severity = determineErrorSeverity(appError);
    const errorContext = getErrorContext();
    const recoveryStrategy = defaultRecoveryStrategies[appError.code] || {
      canRetry: false,
      userMessage: 'An unexpected error occurred. Please refresh the page.',
      technicianMessage: 'Unknown error type'
    };

    const recoverableError: RecoverableError = {
      error: appError,
      severity,
      errorContext,
      recoveryStrategy,
      correlationId
    };

    // Log the error
    this.logError(recoverableError);

    // Report the error if it meets criteria
    this.reportError(recoverableError);

    return recoverableError;
  }

  /**
   * Type guard for AppError
   */
  private isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'code' in error &&
      'message' in error
    );
  }

  /**
   * Log error with appropriate level
   */
  private logError(error: RecoverableError): void {
    const logMessage = `[${error.correlationId}] ${error.error.type.toUpperCase()}: ${error.error.message}`;
    const logContext = {
      correlationId: error.correlationId,
      errorCode: error.error.code,
      severity: error.severity,
      context: error.error.context,
      errorContext: error.errorContext
    };

    switch (error.severity) {
      case ErrorSeverity.LOW:
        logger.info(logMessage, { context: 'ErrorHandler', data: logContext });
        break;
      case ErrorSeverity.MEDIUM:
        logger.warn(logMessage, { context: 'ErrorHandler', data: logContext });
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        logger.error(logMessage, { context: 'ErrorHandler', data: logContext });
        break;
    }
  }

  /**
   * Report error to external service (placeholder)
   */
  private reportError(error: RecoverableError): void {
    // Only report each unique error once per session
    const errorKey = `${error.error.type}-${error.error.code}`;
    if (this.reportedErrors.has(errorKey)) {
      return;
    }

    // Only report medium severity and above
    if (error.severity === ErrorSeverity.LOW) {
      return;
    }

    this.reportedErrors.add(errorKey);

    // In a real application, you would send this to an error reporting service
    // like Sentry, LogRocket, or your custom logging endpoint
    if (import.meta.env.DEV) {
      console.group('🐛 Error Report');
      console.error('Error:', error);
      console.info('Context:', error.errorContext);
      console.info('Recovery Strategy:', error.recoveryStrategy);
      console.groupEnd();
    }
  }

  /**
   * Attempt to recover from an error
   */
  async attemptRecovery(error: RecoverableError): Promise<boolean> {
    const { recoveryStrategy, correlationId } = error;

    if (!recoveryStrategy.canRetry) {
      if (recoveryStrategy.fallbackAction) {
        recoveryStrategy.fallbackAction();
      }
      return false;
    }

    const currentAttempts = this.retryAttempts.get(correlationId) || 0;
    const maxRetries = recoveryStrategy.maxRetries || 1;

    if (currentAttempts >= maxRetries) {
      logger.warn(`Max retry attempts exceeded for error ${correlationId}`, {
        context: 'ErrorHandler',
        data: { attempts: currentAttempts, maxRetries }
      });
      
      if (recoveryStrategy.fallbackAction) {
        recoveryStrategy.fallbackAction();
      }
      return false;
    }

    this.retryAttempts.set(correlationId, currentAttempts + 1);

    if (recoveryStrategy.retryDelay) {
      await new Promise(resolve => setTimeout(resolve, recoveryStrategy.retryDelay));
    }

    logger.info(`Attempting recovery for error ${correlationId}`, {
      context: 'ErrorHandler',
      data: { attempt: currentAttempts + 1, maxRetries }
    });

    return true;
  }

  /**
   * Clear retry attempts for a specific error
   */
  clearRetryAttempts(correlationId: string): void {
    this.retryAttempts.delete(correlationId);
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: RecoverableError): string {
    return error.recoveryStrategy.userMessage || 'An unexpected error occurred.';
  }

  /**
   * Get technical error message for logging
   */
  getTechnicalMessage(error: RecoverableError): string {
    return error.recoveryStrategy.technicianMessage || error.error.message;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();
