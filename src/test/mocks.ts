/**
 * Test Mocks and Utilities
 * 
 * This file provides mock implementations and test utilities for the Hospital Finance Dashboard.
 * It includes mock context values, observer implementations, and helper functions for testing.
 * 
 * Key Features:
 * - Pre-configured context mocks for consistent testing
 * - Browser API mock implementations
 * - Type-safe mock interfaces
 * - Reusable test data structures
 */

import { AuthContextType } from "../types/auth";
import { ThemeContextType } from "../types/theme";

/**
 * Mock interface for ResizeObserver used in tests.
 * Provides type safety for ResizeObserver mock implementations.
 */
export interface MockResizeObserver {
  /** Mock method to observe element resize events */
  observe(target: Element): void;
  
  /** Mock method to stop observing element resize events */
  unobserve(target: Element): void;
  
  /** Mock method to disconnect all observations */
  disconnect(): void;
}

/**
 * Mock interface for IntersectionObserver used in tests.
 * Extends the native IntersectionObserver interface with mock implementations.
 */
export interface MockIntersectionObserver extends IntersectionObserver {
  /** Mock method to observe element intersection events */
  observe(target: Element): void;
  
  /** Mock method to stop observing element intersection events */
  unobserve(target: Element): void;
  
  /** Mock method to disconnect all observations */
  disconnect(): void;
  
  /** Mock method to get recorded intersection entries */
  takeRecords(): IntersectionObserverEntry[];
}

/**
 * Mock implementation of ResizeObserver for testing.
 * Provides empty implementations of all required methods.
 */
export class MockResizeObserverImpl implements MockResizeObserver {
  /** No-op implementation of observe method */
  observe(): void {}
  
  /** No-op implementation of unobserve method */
  unobserve(): void {}
  
  /** No-op implementation of disconnect method */
  disconnect(): void {}
}

/**
 * Mock implementation of IntersectionObserver for testing.
 * Provides empty implementations with proper interface compliance.
 */
export class MockIntersectionObserverImpl implements MockIntersectionObserver {
  readonly root: Element | null = null;               // No root element by default
  readonly rootMargin: string = '0px';                // Default root margin
  readonly thresholds: ReadonlyArray<number> = [0];   // Default threshold

  /** No-op implementation of observe method */
  observe(): void {}
  
  /** No-op implementation of unobserve method */
  unobserve(): void {}
  
  /** No-op implementation of disconnect method */
  disconnect(): void {}
  
  /** Returns empty array as no real intersections occur in tests */
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

/**
 * Mock theme context value for testing theme-related functionality.
 * Provides a light theme setup with mock functions for theme manipulation.
 * 
 * @example
 * ```tsx
 * // Use in component tests that require theme context
 * <ThemeContext.Provider value={mockThemeContextValue}>
 *   <ComponentUnderTest />
 * </ThemeContext.Provider>
 * ```
 */
export const mockThemeContextValue: ThemeContextType = {
  theme: 'light',           // Default to light theme
  resolvedTheme: 'light',   // Resolved theme matches preference
  isTransitioning: false,   // Not transitioning in tests
  toggleTheme: jest.fn(),   // Mock toggle function
  setTheme: jest.fn(),      // Mock setTheme function
};

/**
 * Mock authentication context value for testing auth-related functionality.
 * Provides an authenticated admin user with full access permissions.
 * 
 * @example
 * ```tsx
 * // Use in component tests that require authentication
 * <AuthContext.Provider value={mockAuthContextValue}>
 *   <ProtectedComponent />
 * </AuthContext.Provider>
 * 
 * // For testing unauthenticated state
 * const unauthenticatedMock = {
 *   ...mockAuthContextValue,
 *   user: null,
 *   isAuthenticated: false
 * };
 * ```
 */
export const mockAuthContextValue: AuthContextType = {
  // Mock authenticated admin user
  user: { 
    id: '1', 
    name: 'Test User', 
    email: 'test@example.com', 
    role: 'admin', 
    hospitalIds: ['1'], 
    createdAt: '2024-01-01T00:00:00Z' 
  },
  isAuthenticated: true,                                  // User is authenticated
  isLoading: false,                                       // Not in loading state
  signIn: jest.fn(),                                      // Mock sign in function
  signOut: jest.fn(),                                     // Mock sign out function
  signUp: jest.fn(),                                      // Mock sign up function
  getAccessibleHospitals: jest.fn(() => ['1']),          // Mock hospital access (returns hospital '1')
  canAccessHospital: jest.fn(() => true),                // Mock permission check (always returns true)
};