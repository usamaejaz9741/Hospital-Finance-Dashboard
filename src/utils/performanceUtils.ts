import { performanceMonitor } from './performance';

declare global {
  interface Performance {
    memory?: {
      totalJSHeapSize: number;
      usedJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

/**
 * Measures the performance of a function
 */
export function measurePerformance<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    performanceMonitor.startTiming(name, { args: args.length });
    const result = fn(...args);
    
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
 * Throttles a function to limit its execution frequency
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait = 100,
): T {
  let lastExec = 0;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastExec >= wait) {
      lastExec = now;
      return fn(...args);
    }
    return undefined;
  }) as T;
}

/**
 * Memoizes a function to cache its results
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options?: { maxSize?: number; keyFn?: (...args: Parameters<T>) => string }
): T {
  const cache = new Map<string, ReturnType<T>>();
  const maxSize = options?.maxSize ?? 1000;
  const keyFn = options?.keyFn ?? ((...args) => JSON.stringify(args));

  return ((...args: Parameters<T>) => {
    const key = keyFn(...args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result as ReturnType<T>);

    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }

    return result;
  }) as T;
}

/**
 * Analyzes bundle size
 */
export class BundleAnalyzer {
  static analyze() {
    // Mock data - in a real app, this would analyze the build stats
    const mockChunks = [
      { name: 'main', size: 1024 * 1024 },
      { name: 'vendor', size: 2048 * 1024 },
      { name: 'runtime', size: 256 * 1024 }
    ];

    const mockModules = [
      { name: 'react', size: 512 * 1024 },
      { name: 'recharts', size: 768 * 1024 },
      { name: '@typescript/lib', size: 384 * 1024 }
    ];

    const totalSize = mockChunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const chunkSizes = mockChunks.map(({ name, size }) => ({ name, size }));

    return {
      totalSize,
      chunkSizes,
      modules: mockModules,
      chunks: mockChunks,
      recommendations: [
        'Consider code splitting for large dependencies',
        'Enable tree-shaking for unused exports',
        'Analyze third-party dependencies for size impact'
      ]
    };
  }
}

/**
 * Monitors memory usage
 */
export class MemoryMonitor {
  static getMemoryUsage(): { total: number; used: number; limit: number; percentage: number } {
    if (typeof performance === 'undefined' || !performance.memory) {
      return { total: 0, used: 0, limit: 0, percentage: 0 };
    }

    const memory = performance.memory;
    const used = memory.usedJSHeapSize;
    const total = memory.totalJSHeapSize;
    const limit = memory.jsHeapSizeLimit;
    const percentage = (used / total) * 100;

    return { total, used, limit, percentage };
  }
}

/**
 * Performance utility functions
 */
export const performanceUtils = {
  getMetrics: () => performanceMonitor.getAllMetrics(),
  clearMetrics: () => {
    performanceMonitor.clearMetrics();
  }
};