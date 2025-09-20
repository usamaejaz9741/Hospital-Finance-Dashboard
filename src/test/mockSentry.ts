import { jest } from '@jest/globals';

/**
 * Interface for Sentry scope mock
 */
export interface SentryScope {
  setTag: jest.Mock;
  setExtra: jest.Mock;
  setExtras: jest.Mock;
  setLevel: jest.Mock;
}

/**
 * Interface for complete Sentry mock
 */
export interface SentryMock {
  init: jest.Mock;
  captureError: jest.Mock;
  captureException: jest.Mock;
  addBreadcrumb: jest.Mock;
  withScope: jest.Mock;  // Type assertion applied where used
  Severity: {
    Info: 'info';
    Warning: 'warning';
    Error: 'error';
  };
  getCurrentHub: jest.Mock;
  startSpan: jest.Mock;
}

// Create the mock scope
const mockScope: SentryScope = {
  setTag: jest.fn(),
  setExtra: jest.fn(),
  setExtras: jest.fn(),
  setLevel: jest.fn()
};

// Create the complete Sentry mock
export const mockSentryFunctions: SentryMock = {
  init: jest.fn(),
  captureError: jest.fn(),
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
  withScope: jest.fn().mockImplementation((callback: unknown) => {
    if (typeof callback === 'function') {
      callback(mockScope);
    }
  }),
  Severity: {
    Info: 'info',
    Warning: 'warning',
    Error: 'error'
  },
  getCurrentHub: jest.fn(),
  startSpan: jest.fn()
};

// Reset all mocks between tests
export const resetSentryMocks = (): void => {
  Object.values(mockScope).forEach(mock => mock.mockReset());
  Object.values(mockSentryFunctions)
    .filter(value => typeof value === 'function')
    .forEach((mock: jest.Mock) => mock.mockReset());
};