/**
 * Performance utilities test suite
 * 
 * Tests for performance monitoring, optimization functions,
 * and performance-related utilities.
 */

import React from 'react';
import {
  PerformanceMonitor,
  measurePerformance,
  debounce,
  throttle,
  memoize,
  BundleAnalyzer,
  MemoryMonitor,
  performanceUtils
} from '../performance';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024, // 50MB
    totalJSHeapSize: 100 * 1024 * 1024 // 100MB
  }
};

// Mock window.performance
Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
});

describe('Performance Utilities', () => {
  describe('PerformanceMonitor', () => {
    let monitor: PerformanceMonitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
      jest.clearAllMocks();
    });

    test('starts timing correctly', () => {
      monitor.startTiming('test-metric', { test: 'data' });
      
      const metric = monitor.getMetric('test-metric');
      expect(metric).toBeDefined();
      expect(metric?.name).toBe('test-metric');
      expect(metric?.startTime).toBeDefined();
      expect(metric?.metadata).toEqual({ test: 'data' });
    });

    test('ends timing correctly', () => {
      monitor.startTiming('test-metric');
      const result = monitor.endTiming('test-metric');
      
      expect(result).toBeDefined();
      expect(result?.endTime).toBeDefined();
      expect(result?.duration).toBeDefined();
      expect(result?.duration).toBeGreaterThanOrEqual(0);
    });

    test('handles non-existent metric', () => {
      const result = monitor.endTiming('non-existent');
      expect(result).toBeUndefined();
    });

    test('prevents duplicate metric names', () => {
      monitor.startTiming('test-metric');
      monitor.startTiming('test-metric'); // Should not overwrite
      
      const metrics = monitor.getAllMetrics();
      expect(metrics).toHaveLength(1);
    });

    test('clears all metrics', () => {
      monitor.startTiming('metric1');
      monitor.startTiming('metric2');
      
      expect(monitor.getAllMetrics()).toHaveLength(2);
      
      monitor.clearMetrics();
      expect(monitor.getAllMetrics()).toHaveLength(0);
    });

    test('generates performance summary', () => {
      monitor.startTiming('fast-metric');
      monitor.endTiming('fast-metric');
      
      monitor.startTiming('slow-metric');
      // Simulate some time passing
      mockPerformance.now.mockReturnValueOnce(Date.now() + 100);
      monitor.endTiming('slow-metric');
      
      const summary = monitor.getSummary();
      
      expect(summary.totalMetrics).toBe(2);
      expect(summary.averageDuration).toBeGreaterThan(0);
      expect(summary.slowestMetric).toBeDefined();
      expect(summary.fastestMetric).toBeDefined();
    });
  });

  describe('measurePerformance', () => {
    test('measures synchronous function performance', () => {
      const mockFn = jest.fn((x: number) => x * 2);
      const measuredFn = measurePerformance(mockFn as (...args: unknown[]) => unknown, 'test-function');
      
      const result = measuredFn(5);
      
      expect(result).toBe(10);
      expect(mockFn).toHaveBeenCalledWith(5);
    });

    test('measures asynchronous function performance', async () => {
      const mockAsyncFn = jest.fn(async (x: number) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return x * 2;
      });
      
      const measuredFn = measurePerformance(mockAsyncFn as (...args: unknown[]) => unknown, 'test-async-function');
      
      const result = await measuredFn(5);
      
      expect(result).toBe(10);
      expect(mockAsyncFn).toHaveBeenCalledWith(5);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('debounces function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('calls function immediately when immediate is true', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, true);
      
      debouncedFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Call again after some time - this should not call immediately
      jest.advanceTimersByTime(50);
      debouncedFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // After the full delay, it should call again
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledTimes(1); // Only called once because immediate=true only calls on first call
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('throttles function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(100);
      
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('memoize', () => {
    test('memoizes function results', () => {
      const mockFn = jest.fn((x: number) => x * 2);
      const memoizedFn = memoize(mockFn as (...args: unknown[]) => unknown);
      
      const result1 = memoizedFn(5);
      const result2 = memoizedFn(5);
      
      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('uses custom key function', () => {
      const mockFn = jest.fn((obj: { id: number; name: string }) => obj.id);
      const memoizedFn = memoize(mockFn as (...args: unknown[]) => unknown, (obj: unknown) => (obj as { id: number }).id.toString());
      
      const obj1 = { id: 1, name: 'test1' };
      const obj2 = { id: 1, name: 'test2' };
      
      const result1 = memoizedFn(obj1);
      const result2 = memoizedFn(obj2);
      
      expect(result1).toBe(1);
      expect(result2).toBe(1);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('handles different arguments', () => {
      const mockFn = jest.fn((x: number) => x * 2);
      const memoizedFn = memoize(mockFn as (...args: unknown[]) => unknown);
      
      const result1 = memoizedFn(5);
      const result2 = memoizedFn(10);
      
      expect(result1).toBe(10);
      expect(result2).toBe(20);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('BundleAnalyzer', () => {
    test('analyzes bundle and provides recommendations', () => {
      const analysis = BundleAnalyzer.analyze();
      
      expect(analysis).toHaveProperty('totalSize');
      expect(analysis).toHaveProperty('chunkSizes');
      expect(analysis).toHaveProperty('recommendations');
      expect(Array.isArray(analysis.recommendations)).toBe(true);
      expect(analysis.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('MemoryMonitor', () => {
    test('gets memory usage information', () => {
      const usage = MemoryMonitor.getMemoryUsage();
      
      expect(usage).toHaveProperty('used');
      expect(usage).toHaveProperty('total');
      expect(usage).toHaveProperty('percentage');
      expect(usage.used).toBeGreaterThan(0);
      expect(usage.total).toBeGreaterThan(0);
      expect(usage.percentage).toBeGreaterThan(0);
    });

    test('handles missing performance.memory', () => {
      // Mock missing memory API
      const originalMemory = (performance as Performance & { memory?: unknown }).memory;
      delete (performance as Performance & { memory?: unknown }).memory;
      
      const usage = MemoryMonitor.getMemoryUsage();
      
      expect(usage.used).toBe(0);
      expect(usage.total).toBe(0);
      expect(usage.percentage).toBe(0);
      
      // Restore
      (performance as Performance & { memory?: unknown }).memory = originalMemory;
    });
  });

  describe('performanceUtils', () => {
    test('lazyLoad creates lazy component', () => {
      const mockImportFn = jest.fn(() => Promise.resolve({ default: () => React.createElement('div', null, 'Test') }));
      const lazyComponent = performanceUtils.lazyLoad(mockImportFn);
      
      expect(lazyComponent).toBeDefined();
      expect(typeof lazyComponent).toBe('object');
    });

    test('preload creates preload link', () => {
      const mockAppendChild = jest.fn();
      const mockLink = {
        rel: '',
        href: '',
        as: ''
      };
      const mockCreateElement = jest.fn(() => mockLink);
      
      // Mock document.createElement
      const originalCreateElement = document.createElement;
      document.createElement = mockCreateElement as unknown as typeof document.createElement;
      
      // Mock document.head.appendChild
      const originalAppendChild = document.head.appendChild;
      document.head.appendChild = mockAppendChild as typeof document.head.appendChild;
      
      performanceUtils.preload('/test.js', 'script');
      
      expect(mockCreateElement).toHaveBeenCalledWith('link');
      expect(mockLink.rel).toBe('preload');
      expect(mockLink.href).toBe('/test.js');
      expect(mockLink.as).toBe('script');
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
      
      // Restore
      document.createElement = originalCreateElement;
      document.head.appendChild = originalAppendChild;
    });

    test('prefetch creates prefetch link', () => {
      const mockAppendChild = jest.fn();
      const mockLink = {
        rel: '',
        href: ''
      };
      const mockCreateElement = jest.fn(() => mockLink);
      
      // Mock document.createElement
      const originalCreateElement = document.createElement;
      document.createElement = mockCreateElement as unknown as typeof document.createElement;
      
      // Mock document.head.appendChild
      const originalAppendChild = document.head.appendChild;
      document.head.appendChild = mockAppendChild as typeof document.head.appendChild;
      
      performanceUtils.prefetch('/test.js');
      
      expect(mockCreateElement).toHaveBeenCalledWith('link');
      expect(mockLink.rel).toBe('prefetch');
      expect(mockLink.href).toBe('/test.js');
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
      
      // Restore
      document.createElement = originalCreateElement;
      document.head.appendChild = originalAppendChild;
    });
  });
});
