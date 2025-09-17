/**
 * Lighthouse CI Configuration for Hospital Finance Dashboard
 * 
 * This configuration sets up performance, accessibility, SEO,
 * and best practices auditing with:
 * - Performance budgets
 * - Accessibility requirements
 * - SEO optimization checks
 * - PWA compliance
 */
module.exports = {
  ci: {
    // Collect configuration
    collect: {
      // Number of runs to average
      numberOfRuns: 1, // Reduced for faster CI
      
      // URLs to test
      url: [
        'http://localhost:4173'
      ],
      
      // Start server automatically
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:   http://localhost:4173',
      
      // Chrome flags for consistent testing
      chromeFlags: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--headless'
      ],
      
      // Settings
      settings: {
        // Use desktop form factor
        formFactor: 'desktop',
        
        // Throttling settings
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        },
        
        // Screen emulation
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        }
      }
    },
    
    // Upload configuration (if using Lighthouse CI server)
    upload: {
      target: 'temporary-public-storage'
    },
    
    // Assert configuration - performance budgets
    assert: {
      assertions: {
        // Performance assertions - relaxed for CI
        'categories:performance': ['warn', { minScore: 0.6 }],
        'categories:accessibility': ['error', { minScore: 0.8 }],
        'categories:best-practices': ['warn', { minScore: 0.7 }],
        'categories:seo': ['warn', { minScore: 0.7 }],
        
        // Specific metric assertions
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 5000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.2 }],
        'total-blocking-time': ['warn', { maxNumericValue: 500 }],
        
        // Resource assertions
        'unused-javascript': ['warn', { maxNumericValue: 30000 }],
        'unused-css-rules': ['warn', { maxNumericValue: 20000 }],
        
        // Security assertions
        'is-on-https': 'off', // Disabled for local testing
        'uses-https': 'off',   // Disabled for local testing
        
        // PWA assertions
        'service-worker': 'off', // Not implemented yet
        'installable-manifest': 'off', // Not implemented yet
        
        // Bundle size assertions
        'total-byte-weight': ['warn', { maxNumericValue: 1500000 }], // 1.5MB
        'dom-size': ['warn', { maxNumericValue: 1000 }]
      }
    }
  }
};
