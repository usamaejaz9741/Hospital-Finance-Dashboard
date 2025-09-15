// Logging levels
export type LogLevel = 'info' | 'warn' | 'error';

interface LogOptions {
  context?: string;
  data?: unknown;
}

class Logger {
  private isDev = import.meta.env.DEV;

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${context} ${message}`;
  }

  private log(level: LogLevel, message: string, options?: LogOptions): void {
    // Only log in development unless it's an error
    if (!this.isDev && level !== 'error') return;

    const formattedMessage = this.formatMessage(level, message, options);

    switch (level) {
      case 'info':
        if (this.isDev) console.log(formattedMessage, options?.data || '');
        break;
      case 'warn':
        if (this.isDev) console.warn(formattedMessage, options?.data || '');
        break;
      case 'error':
        // Always log errors, but handle them appropriately in production
        if (this.isDev) {
          console.error(formattedMessage, options?.data || '');
        } else {
          // In production, we could send this to an error tracking service
          // e.g., Sentry, LogRocket, etc.
          this.handleProductionError(message, options?.data);
        }
        break;
    }
  }

  private handleProductionError(message: string, data?: unknown): void {
    // TODO: Integrate with error tracking service
    // For now, we'll just log to console in a structured way
    console.error({
      message,
      timestamp: new Date().toISOString(),
      data
    });
  }

  info(message: string, options?: LogOptions): void {
    this.log('info', message, options);
  }

  warn(message: string, options?: LogOptions): void {
    this.log('warn', message, options);
  }

  error(message: string, options?: LogOptions): void {
    this.log('error', message, options);
  }
}

export const logger = new Logger();