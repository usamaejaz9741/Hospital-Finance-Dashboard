import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, jest } from '@jest/globals';

// Run cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock window.matchMedia
const mockMediaQueryList: Partial<MediaQueryList> = {
  matches: false,
  media: '',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn((_: Event) => true),
};

class MockResizeObserver implements ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  private readonly mockEntries: IntersectionObserverEntry[] = [];

  constructor(
    _callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
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

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords(): IntersectionObserverEntry[] {
    return this.mockEntries;
  }
}

// Set up test environment mocks
Object.defineProperties(window, {
  matchMedia: {
    writable: true,
    configurable: true,
    value: jest.fn((query: string) => ({
      ...mockMediaQueryList,
      media: query,
    })),
  },
  ResizeObserver: {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  },
  IntersectionObserver: {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  },
});

// Console error override for cleaner test output
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};