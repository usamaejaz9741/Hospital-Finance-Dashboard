/**
 * Jest Configuration for Hospital Finance Dashboard
 * 
 * This configuration sets up Jest for testing React components and TypeScript files
 * with proper support for:
 * - TypeScript compilation with ts-jest
 * - DOM testing with jsdom environment
 * - React Testing Library setup
 * - CSS module mocking
 * - Code coverage reporting
 * - Path mapping for imports
 * 
 * @type {import('jest').Config}
 */
const config = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',
  
  // Use jsdom environment for DOM testing (React components)
  testEnvironment: 'jsdom',
  
  // Setup files to run after Jest environment is set up
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Module name mapping for imports and assets
  moduleNameMapper: {
    // Mock CSS imports (return proxy object for className access)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Path mapping for @ alias (maps to src directory)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Coverage collection configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',     // Include all TypeScript/TSX files in src
    '!src/**/*.d.ts',        // Exclude type definition files
    '!src/main.tsx',         // Exclude entry point file
    '!src/vite-env.d.ts',    // Exclude Vite environment types
  ],
  
  // Coverage thresholds - tests will fail if coverage drops below these levels
  coverageThreshold: {
    global: {
      branches: 80,     // Require 80% branch coverage
      functions: 80,    // Require 80% function coverage
      lines: 80,        // Require 80% line coverage
      statements: 80,   // Require 80% statement coverage
    },
  },
  // TypeScript file transformation configuration
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      // TypeScript diagnostic configuration
      diagnostics: {
        ignoreCodes: [1343]  // Ignore specific TypeScript error codes during testing
      },
      // AST transformers for special cases
      astTransformers: {
        before: [
          {
            // Mock import.meta for Vite compatibility in tests
            path: 'node_modules/ts-jest-mock-import-meta',
            options: { 
              metaObjectReplacement: { 
                env: { MODE: 'test' }  // Set test environment mode
              } 
            }
          }
        ]
      }
    }]
  }
};

export default config;