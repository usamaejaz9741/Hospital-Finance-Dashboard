import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import type { Breadcrumb, Integration } from '@sentry/types';
import type { BrowserOptions } from '@sentry/browser';
import { logger } from './logger';

/**
 * Sentry integration cast function to handle type mismatches
 */
const asSentryIntegration = (integration: unknown): Integration => integration as Integration;

/**
 * Initialize Sentry for error tracking and performance monitoring.
 * 
 * @param dsn - Sentry DSN (Data Source Name)
 * @param environment - Current environment (development, staging, production)
 */
export const initializeSentry = (
  dsn: string,
  environment: string = process.env.NODE_ENV ?? 'development'
): void => {
  try {
    const options: BrowserOptions = {
      dsn,
      environment,
      integrations: [asSentryIntegration(new BrowserTracing())],
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
      
      // Capture errors based on environment
      beforeSend(event) {
        // Only send errors in production, or if explicitly enabled in other environments
        if (environment === 'production' || process.env.ENABLE_ERROR_TRACKING) {
          return event;
        }
        return null;
      },
      
      // Set max breadcrumbs
      maxBreadcrumbs: 50
    };

    Sentry.init(options);

    logger.info('Sentry initialized successfully', {
      context: 'Sentry',
      data: { environment }
    });
  } catch (error) {
    logger.error('Failed to initialize Sentry', {
      context: 'Sentry',
      data: { error }
    });
  }
};

/**
 * Capture an error with Sentry
 * 
 * @param error - Error object
 * @param context - Additional context
 */
export const captureError = (
  error: Error,
  context?: Record<string, unknown>
): void => {
  Sentry.withScope(scope => {
    if (context) {
      scope.setExtras(context);
    }
    Sentry.captureException(error);
  });
};

/**
 * Start a new Sentry transaction for performance monitoring
 * 
 * @param name - Transaction name
 * @param options - Additional transaction options
 */
export const startTransaction = (
  name: string,
  options?: Record<string, unknown>
): void => {
  Sentry.addBreadcrumb({
    message: `Started transaction: ${name}`,
    category: 'performance',
    level: 'info',
    data: {
      ...options,
      timestamp: Date.now()
    }
  });
};

/**
 * Track user actions with Sentry breadcrumbs
 * 
 * @param message - Breadcrumb message
 * @param category - Breadcrumb category
 * @param data - Additional data
 */
export const addBreadcrumb = (
  message: string,
  category?: string,
  data?: Record<string, unknown>
): void => {
  const breadcrumb: Breadcrumb = {
    message,
    category: category ?? 'default',
    level: 'info',
    data: data ?? {}
  };
  
  Sentry.addBreadcrumb(breadcrumb);
};