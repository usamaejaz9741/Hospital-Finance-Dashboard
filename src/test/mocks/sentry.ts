/**
 * Mock for @sentry/react package
 */

export const Severity = {
  Info: 'info',
  Warning: 'warning',
  Error: 'error'
};

export const captureError = jest.fn();
export const addBreadcrumb = jest.fn();

export const init = jest.fn();

export default {
  init,
  captureError,
  addBreadcrumb,
  Severity
};