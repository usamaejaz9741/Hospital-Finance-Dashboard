import React from 'react';
import { logger } from './logger';

/**
 * Creates a debounced function that delays invoking the target function
 * until after wait milliseconds have elapsed since the last time it was invoked.
 * 
 * @param fn - Function to debounce
 * @param wait - Number of milliseconds to delay
 * @param options - Configuration options
 * @returns Debounced function
 */
export function debounce<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  wait = 100,
  options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Args) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Args | null = null;

  const debouncedFn = function(this: unknown, ...args: Args) {
    lastArgs = args;

    const later = () => {
      timeout = null;
      // Only make trailing call if leading is false and trailing is not explicitly false
      if (!options.leading && options.trailing !== false && lastArgs) {
        fn.apply(this, lastArgs);
        lastArgs = null;
      }
    };

    if (timeout) {
      clearTimeout(timeout);
    } else if (options.leading) {
      fn.apply(this, args);
    }

    timeout = setTimeout(later, wait);
  };

  Object.defineProperty(debouncedFn, 'cancel', {
    value: () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
        lastArgs = null;
      }
    },
    enumerable: false,
    writable: false,
    configurable: true
  });

  return debouncedFn as ((...args: Args) => void) & { cancel: () => void };
}

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private webVitalsStarted = false;

  /**
   * Starts timing a performance metric
   */
  startTiming(name: string, metadata?: Record<string, unknown>): void {
    if (this.metrics.has(name)) {
      logger.warn(`Performance metric '${name}' already exists`, {
        context: 'PerformanceMonitor',
        data: { name }
      });
      return;
    }

    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata: metadata || {}
    });
  }

  /**
   * Ends timing a performance metric
   */
  endTiming(name: string): PerformanceMetrics | undefined {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`Performance metric '${name}' not found`, {
        context: 'PerformanceMonitor',
        data: { name }
      });
      return undefined;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetrics = {
      ...metric,
      endTime,
      duration
    };

    this.metrics.set(name, completedMetric);
    return completedMetric;
  }

  /**
   * Gets all metrics
   */
  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clears all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Starts web vitals monitoring
   */
  startWebVitalsMonitoring(): void {
    if (this.webVitalsStarted) return;

    import('./webVitals').then(({ webVitals }) => {
      webVitals.startMonitoring();
      this.webVitalsStarted = true;
    }).catch(error => {
      logger.error('Failed to start web vitals monitoring', {
        context: 'PerformanceMonitor',
        data: { error }
      });
    });
  }

  /**
   * Stops web vitals monitoring
   */
  stopWebVitalsMonitoring(): void {
    if (!this.webVitalsStarted) return;

    import('./webVitals').then(({ webVitals }) => {
      webVitals.stopMonitoring();
      this.webVitalsStarted = false;
    }).catch(error => {
      logger.error('Failed to stop web vitals monitoring', {
        context: 'PerformanceMonitor',
        data: { error }
      });
    });
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

export * from './performanceUtils';

/**
 * React hook for measuring component render performance
 */
export function useRenderPerformance(componentName: string): void {
  React.useEffect(() => {
    // SSR check - don't run performance monitoring on server
    if (typeof window === 'undefined') return;
    
    performanceMonitor.startTiming(`${componentName}-render`);
    
    return () => {
      performanceMonitor.endTiming(`${componentName}-render`);
    };
  });
}