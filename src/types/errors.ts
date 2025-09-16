/**
 * Comprehensive error types for the Hospital Finance Dashboard
 */

export interface BaseError {
  code: string;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export interface AuthenticationError extends BaseError {
  type: 'authentication';
  code: 'AUTH_INVALID_CREDENTIALS' | 'AUTH_ACCOUNT_LOCKED' | 'AUTH_SESSION_EXPIRED' | 'AUTH_RATE_LIMITED';
  retryAfter?: number; // For rate limiting
}

export interface AuthorizationError extends BaseError {
  type: 'authorization';
  code: 'AUTH_INSUFFICIENT_PERMISSIONS' | 'AUTH_HOSPITAL_ACCESS_DENIED' | 'AUTH_RESOURCE_FORBIDDEN';
  requiredRole?: string;
  requiredPermissions?: string[];
}

export interface ValidationError extends BaseError {
  type: 'validation';
  code: 'VALIDATION_REQUIRED_FIELD' | 'VALIDATION_INVALID_FORMAT' | 'VALIDATION_PASSWORD_WEAK';
  field?: string;
  validationRules?: string[];
}

export interface DataError extends BaseError {
  type: 'data';
  code: 'DATA_NOT_FOUND' | 'DATA_INVALID_FORMAT' | 'DATA_PROCESSING_ERROR';
  resourceId?: string;
  resourceType?: string;
}

export interface NetworkError extends BaseError {
  type: 'network';
  code: 'NETWORK_CONNECTION_FAILED' | 'NETWORK_TIMEOUT' | 'NETWORK_RATE_LIMITED' | 'NETWORK_SERVER_ERROR';
  statusCode?: number;
  endpoint?: string;
}

export interface ApplicationError extends BaseError {
  type: 'application';
  code: 'APP_COMPONENT_ERROR' | 'APP_RENDER_ERROR' | 'APP_PERFORMANCE_WARNING' | 'APP_MEMORY_WARNING';
  componentName?: string;
  stackTrace?: string;
}

export type AppError = 
  | AuthenticationError 
  | AuthorizationError 
  | ValidationError 
  | DataError 
  | NetworkError 
  | ApplicationError;

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Error context for better debugging
 */
export interface ErrorContext {
  userId?: string;
  hospitalId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp: string;
  buildVersion?: string;
}

/**
 * Error reporting configuration
 */
export interface ErrorReportingConfig {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  includeSensitiveData: boolean;
  reportingThreshold: ErrorSeverity;
}

/**
 * Recovery strategy for different error types
 */
export interface ErrorRecoveryStrategy {
  canRetry: boolean;
  maxRetries?: number;
  retryDelay?: number; // milliseconds
  fallbackAction?: () => void;
  userMessage?: string;
  technicianMessage?: string;
}

/**
 * Comprehensive error with recovery strategy
 */
export interface RecoverableError {
  error: AppError;
  severity: ErrorSeverity;
  errorContext: ErrorContext;
  recoveryStrategy: ErrorRecoveryStrategy;
  correlationId: string;
}
