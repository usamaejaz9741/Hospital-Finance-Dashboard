/**
 * Performance monitoring and optimization utilities
 * 
 * This module provides tools for monitoring application performance,
 * optimizing bundle size, and implementing performance best practices.
 */

import { logger } from './logger';

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
  // private observers: PerformanceObserver[] = []; // TODO: Implement performance observers

  /**
   * Starts timing a performance metric
   * 
   * @param name - Unique name for the metric
   * @param metadata - Additional metadata to store
   * @returns void
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
   * 
   * @param name - Name of the metric to end
   * @returns PerformanceMetrics | undefined
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

    // Log performance metric
    logger.info(`Performance metric completed: ${name}`, {
      context: 'PerformanceMonitor',
      data: {
        name,
        duration: `${duration.toFixed(2)}ms`,
        metadata: metric.metadata
      }
    });

    return completedMetric;
  }

  /**
   * Gets a performance metric
   * 
   * @param name - Name of the metric
   * @returns PerformanceMetrics | undefined
   */
  getMetric(name: string): PerformanceMetrics | undefined {
    return this.metrics.get(name);
  }

  /**
   * Gets all performance metrics
   * 
   * @returns PerformanceMetrics[]
   */
  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clears all performance metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Gets performance summary
   * 
   * @returns object with performance statistics
   */
  getSummary(): {
    totalMetrics: number;
    averageDuration: number;
    slowestMetric: PerformanceMetrics | null;
    fastestMetric: PerformanceMetrics | null;
  } {
    const completedMetrics = this.getAllMetrics().filter(m => m.duration !== undefined);
    
    if (completedMetrics.length === 0) {
      return {
        totalMetrics: 0,
        averageDuration: 0,
        slowestMetric: null,
        fastestMetric: null
      };
    }

    const durations = completedMetrics.map(m => m.duration!);
    const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
    
    const slowestMetric = completedMetrics.reduce((slowest, current) => 
      current.duration! > slowest.duration! ? current : slowest
    );
    
    const fastestMetric = completedMetrics.reduce((fastest, current) => 
      current.duration! < fastest.duration! ? current : fastest
    );

    return {
      totalMetrics: completedMetrics.length,
      averageDuration,
      slowestMetric,
      fastestMetric
    };
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Higher-order function for measuring function performance
 * 
 * @param fn - Function to measure
 * @param name - Name for the performance metric
 * @returns Wrapped function with performance measurement
 * 
 * @example
 * ```typescript
 * const expensiveFunction = (data: any[]) => {
 *   // Expensive operation
 *   return data.map(item => item.value * 2);
 * };
 * 
 * const measuredFunction = measurePerformance(expensiveFunction, 'dataProcessing');
 * const result = measuredFunction(largeDataset);
 * ```
 */
export function measurePerformance<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    performanceMonitor.startTiming(name, { args: args.length });
    const result = fn(...args);
    
    // Handle both sync and async functions
    if (result instanceof Promise) {
      return result.finally(() => {
        performanceMonitor.endTiming(name);
      });
    } else {
      performanceMonitor.endTiming(name);
      return result;
    }
  }) as T;
}

/**
 * React hook for measuring component render performance
 * 
 * @param componentName - Name of the component
 * @returns void
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   useRenderPerformance('MyComponent');
 *   // Component logic
 * }
 * ```
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

/**
 * Debounce function for performance optimization
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @param immediate - Whether to call immediately on first invocation
 * @returns Debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   performSearch(query);
 * }, 300);
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function for performance optimization
 * 
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 * 
 * @example
 * ```typescript
 * const throttledScroll = throttle((event: Event) => {
 *   handleScroll(event);
 * }, 100);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Memoization function for expensive calculations
 * 
 * @param fn - Function to memoize
 * @param keyFn - Function to generate cache key from arguments
 * @returns Memoized function
 * 
 * @example
 * ```typescript
 * const expensiveCalculation = (data: any[]) => {
 *   return data.reduce((sum, item) => sum + item.value, 0);
 * };
 * 
 * const memoizedCalculation = memoize(expensiveCalculation, (data) => 
 *   data.map(item => item.id).join(',')
 * );
 * ```
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Bundle size analyzer
 */
export class BundleAnalyzer {
  /**
   * Analyzes bundle size and provides recommendations
   * 
   * @returns Bundle analysis report
   */
  static analyze(): {
    totalSize: number;
    chunkSizes: Record<string, number>;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    
    // This would typically analyze the actual bundle
    // For now, we'll provide static recommendations
    recommendations.push('Consider code splitting for large components');
    recommendations.push('Use dynamic imports for non-critical features');
    recommendations.push('Optimize images and assets');
    recommendations.push('Remove unused dependencies');
    
    return {
      totalSize: 0, // Would be calculated from actual bundle
      chunkSizes: {}, // Would be calculated from actual bundle
      recommendations
    };
  }
}

/**
 * Memory usage monitor
 */
export class MemoryMonitor {
  /**
   * Gets current memory usage
   * 
   * @returns Memory usage information
   */
  static getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return { used: 0, total: 0, percentage: 0 };
    }
    
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
    
    if (!memory) {
      return { used: 0, total: 0, percentage: 0 };
    }
    
    const used = memory.usedJSHeapSize;
    const total = memory.totalJSHeapSize;
    const percentage = (used / total) * 100;
    
    return { used, total, percentage };
  }
  
  /**
   * Monitors memory usage and logs warnings
   */
  static startMonitoring(threshold = 80): void {
    setInterval(() => {
      const usage = this.getMemoryUsage();
      
      if (usage.percentage > threshold) {
        logger.warn('High memory usage detected', {
          context: 'MemoryMonitor',
          data: {
            percentage: usage.percentage.toFixed(2),
            used: `${(usage.used / 1024 / 1024).toFixed(2)}MB`,
            total: `${(usage.total / 1024 / 1024).toFixed(2)}MB`
          }
        });
      }
    }, 30000); // Check every 30 seconds
  }
}

/**
 * Performance optimization utilities
 */
export const performanceUtils = {
  /**
   * Lazy loads a component
   * 
   * @param importFn - Function that imports the component
   * @returns Lazy-loaded component
   */
  lazyLoad: <T extends React.ComponentType<unknown>>(
    importFn: () => Promise<{ default: T }>
  ) => {
    return React.lazy(importFn);
  },
  
  /**
   * Preloads a resource
   * 
   * @param url - URL to preload
   * @param type - Resource type
   */
  preload: (url: string, type: 'script' | 'style' | 'image' | 'font' = 'script') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    document.head.appendChild(link);
  },
  
  /**
   * Prefetches a resource
   * 
   * @param url - URL to prefetch
   */
  prefetch: (url: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
};

// Import React for hooks (this would be at the top in a real file)
import React from 'react';