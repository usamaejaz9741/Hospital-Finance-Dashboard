/**
 * Jest Test Setup Configuration
 * 
 * This file configures the testing environment for the Hospital Finance Dashboard.
 * It sets up necessary mocks, cleanup procedures, and global test utilities.
 * 
 * Key Features:
 * - Jest DOM matchers for improved assertions
 * - Automatic cleanup after each test
 * - Browser API mocks (ResizeObserver, IntersectionObserver, matchMedia)
 * - Storage cleanup (localStorage, sessionStorage)
 * - Console error filtering for cleaner test output
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, jest } from '@jest/globals';

/**
 * Cleanup function that runs after each test to ensure test isolation.
 * Cleans up DOM, localStorage, and sessionStorage to prevent test interference.
 */
afterEach(() => {
  cleanup();              // Clean up React components from DOM
  localStorage.clear();   // Clear localStorage data between tests
  sessionStorage.clear(); // Clear sessionStorage data between tests
});

/**
 * Mock implementation of MediaQueryList for window.matchMedia
 * Required for testing responsive components that use media queries
 */
const mockMediaQueryList: Partial<MediaQueryList> = {
  matches: false,                           // Default to not matching
  media: '',                               // Media query string
  onchange: null,                          // Change event handler
  addListener: jest.fn(),                  // Legacy listener method
  removeListener: jest.fn(),               // Legacy listener removal
  addEventListener: jest.fn(),             // Modern event listener
  removeEventListener: jest.fn(),          // Modern event listener removal
  dispatchEvent: jest.fn((_: Event) => true), // Event dispatching
};

/**
 * Mock implementation of ResizeObserver for testing components that observe element resizing.
 * Required for charts and responsive components.
 */
class MockResizeObserver implements ResizeObserver {
  observe = jest.fn();    // Mock observe method
  unobserve = jest.fn();  // Mock unobserve method
  disconnect = jest.fn(); // Mock disconnect method
}

/**
 * Mock implementation of IntersectionObserver for testing components that observe element visibility.
 * Required for lazy loading and scroll-based animations.
 */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  private readonly mockEntries: IntersectionObserverEntry[] = [];

  constructor(
    _callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    // Initialize with provided options or defaults
    if (options) {
      if (options.root instanceof Element) {
        this.root = options.root;
      }
      if (options.rootMargin) {
        this.rootMargin = options.rootMargin;
      }
      if (options.threshold) {
        this.thresholds = Array.isArray(options.threshold)
          ? options.threshold
          : [options.threshold];
      }
    }
  }

  observe = jest.fn();    // Mock observe method
  unobserve = jest.fn();  // Mock unobserve method
  disconnect = jest.fn(); // Mock disconnect method
  
  /**
   * Mock implementation of takeRecords method.
   * Returns empty array as no real intersection events are generated in tests.
   */
  takeRecords(): IntersectionObserverEntry[] {
    return this.mockEntries;
  }
}

/**
 * Set up global window object mocks for browser APIs.
 * These mocks are required for components that use modern browser APIs.
 */
Object.defineProperties(window, {
  // Mock matchMedia for responsive components and media query tests
  matchMedia: {
    writable: true,
    configurable: true,
    value: jest.fn((query: string) => ({
      ...mockMediaQueryList,
      media: query, // Return the query string for verification in tests
    })),
  },
  
  // Mock ResizeObserver for chart components and responsive layouts
  ResizeObserver: {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  },
  
  // Mock IntersectionObserver for lazy loading and scroll-based features
  IntersectionObserver: {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  },
});

/**
 * Filter console errors to reduce noise in test output.
 * Suppresses React's "not wrapped in act" warnings which are often unavoidable in tests.
 */
const originalError = console.error;
console.error = (...args) => {
  // Suppress React Testing Library act() warnings during tests
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  // Allow all other console errors to display normally
  originalError.call(console, ...args);
};