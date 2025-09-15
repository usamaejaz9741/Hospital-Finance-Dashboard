import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    reportCompressedSize: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2
      },
      mangle: {
        toplevel: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // Chart dependencies
          'vendor-charts': ['recharts', 'd3-shape', 'd3-scale'],
          
          // UI components and icons
          'vendor-ui': ['lucide-react'],
          
          // Utility libraries
          'vendor-utils': ['date-fns', 'tailwindcss'],
          
          // Auth-related code
          auth: [
            './src/contexts/AuthContext.tsx',
            './src/hooks/useAuth.ts',
            './src/components/auth/SignInPage.tsx',
            './src/components/auth/SignUpPage.tsx'
          ],
          
          // Dashboard components
          dashboard: [
            './src/components/Dashboard.tsx',
            './src/components/MetricCard.tsx',
            './src/components/PatientMetricsCard.tsx'
          ],
          
          // Chart components
          charts: [
            './src/components/RevenueChart.tsx',
            './src/components/ExpensePieChart.tsx',
            './src/components/CashFlowChart.tsx'
          ]
        },
        assetFileNames: 'assets/[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      },
      input: {
        main: './index.html'
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // 4kb
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts', 'lucide-react'],
  }
});
