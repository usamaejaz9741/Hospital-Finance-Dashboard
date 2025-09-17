/**
 * Vite Configuration for Hospital Finance Dashboard
 * 
 * This configuration optimizes the build process for both development
 * and production environments with focus on performance, bundle analysis,
 * and developer experience.
 * 
 * Key Features:
 * - React support with fast refresh
 * - Automatic vendor chunk splitting for better caching
 * - Bundle analysis with visualization
 * - Production optimizations (minification, tree-shaking)
 * - Source maps for debugging
 * - Console removal in production builds
 * 
 * @see https://vitejs.dev/config/
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // React plugin with fast refresh for development
    react(),
    
    // Bundle analyzer - generates dist/stats.html with bundle visualization
    visualizer({
      filename: 'dist/stats.html',  // Output file for bundle analysis
      gzipSize: true,               // Show gzipped sizes
      brotliSize: true,             // Show brotli compressed sizes
      open: false                   // Don't auto-open in browser
    })
  ],
  
  // Development server configuration
  server: {
    port: 3000,      // Development server port
    open: true       // Automatically open browser on start
  },
  // Production build configuration
  build: {
    target: 'esnext',                    // Target modern browsers for smaller bundles
    sourcemap: true,                     // Generate source maps for debugging
    reportCompressedSize: true,          // Report compressed bundle sizes
    minify: 'terser',                    // Use Terser for minification
    
    // Terser minification options for maximum optimization
    terserOptions: {
      compress: {
        drop_console: true,              // Remove console.* calls in production
        drop_debugger: true,             // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'], // Additional console removal
        passes: 2                        // Run compression twice for better results
      },
      mangle: {
        toplevel: true                   // Mangle top-level variable names
      }
    },
    
    // Rollup-specific build options
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching strategy
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';             // Separate vendor libraries
          }
        },
        // File naming patterns with content hashes for cache busting
        assetFileNames: 'assets/[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      },
      input: {
        main: './index.html'             // Entry point for the application
      }
    },
    
    chunkSizeWarningLimit: 1000,         // Warn for chunks larger than 1MB
    assetsInlineLimit: 4096,             // Inline assets smaller than 4KB
  },
  
  // Dependency optimization for faster development
  optimizeDeps: {
    // Pre-bundle these dependencies for faster cold starts
    include: ['react', 'react-dom', 'recharts', 'lucide-react'],
  }
});
