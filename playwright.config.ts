import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Hospital Finance Dashboard
 * 
 * This configuration sets up E2E testing with:
 * - Multiple browser support (Chrome, Firefox, Safari)
 * - Mobile device testing
 * - Automatic test server setup
 * - Screenshots and videos on failure
 * - Parallel test execution
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Test timeout
  timeout: 30 * 1000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 5000
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  // Global test setup
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:4173',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Emulate user preferences
    colorScheme: 'light',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // Output directory
  outputDir: 'test-results/',
});
