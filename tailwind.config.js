/**
 * Tailwind CSS Configuration for Hospital Finance Dashboard
 * 
 * This configuration extends Tailwind's default theme with:
 * - Custom color palette for medical/financial themes
 * - Dark mode support with optimized colors
 * - Custom animations and keyframes
 * - Responsive breakpoints matching design system
 * - Semantic color naming for better maintainability
 * 
 * @type {import('tailwindcss').Config}
 */
export default {
  // Content sources for Tailwind to scan for classes
  content: [
    "./index.html",                    // Main HTML entry point
    "./src/**/*.{js,ts,jsx,tsx}",     // All source files with these extensions
  ],
  
  // Enable class-based dark mode (controlled via 'dark' class on html/body)
  darkMode: 'class',
  theme: {
    // Custom responsive breakpoints (extending defaults)
    screens: {
      'xs': '475px',      // Extra small: mobile landscape
      'sm': '640px',      // Small: small tablets
      'md': '768px',      // Medium: tablets
      'lg': '1024px',     // Large: laptops
      'xl': '1280px',     // Extra large: desktops
      '2xl': '1536px',    // 2x extra large: large desktops
    },
    
    extend: {
      // Extended color palette for the dashboard - Purple main with indicative colors
      colors: {
        // Primary brand color (purple) - used for main actions and branding
        primary: {
          50: '#faf5ff',   // Very light purple for backgrounds
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc', // Used in dark mode
          500: '#a855f7', // Main brand color
          600: '#9333ea', // Default button color
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87', // Darkest shade
        },
        // Success/positive color (green) - for positive metrics, success states
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main success color
          600: '#16a34a', // Default success actions
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Warning color (amber/orange) - for warnings and alerts
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Main warning color
          600: '#d97706', // Default warning actions
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Danger/error color (red) - for negative metrics, error states, destructive actions
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Main error color
          600: '#dc2626', // Default error actions
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Info color (blue) - for informational content and neutral states
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main info color
          600: '#2563eb', // Default info actions
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Core purple palette
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Purple indigo variants for richer tones
        indigo: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Dark mode specific colors - carefully chosen for optimal contrast and readability
        dark: {
          background: '#1a0b2e',    // Deep purple for main background
          surface: '#2d1b69',       // Lighter purple for cards and surfaces
          card: '#3b2a6b',          // Card backgrounds
          border: '#4c3d7a',        // Border color with subtle contrast
          text: {
            primary: '#f8fafc',     // High contrast white for headings
            secondary: '#e2e8f0',   // Slightly muted for body text
            muted: '#c4b5fd',       // Purple-tinted muted text
          },
          hover: {
            surface: '#3b2a6b',     // Hover states for interactive elements
            card: '#4c3d7a',
          }
        }
      },
      // Utility classes for dark mode (legacy support)
      backgroundColor: {
        'dark-bg': '#1a0b2e',      // Main dark purple background
        'dark-surface': '#2d1b69', // Dark purple surface background
        'dark-card': '#3b2a6b',    // Dark purple card background
      },
      textColor: {
        'dark-primary': '#f1f5f9',   // Primary dark mode text
        'dark-secondary': '#cbd5e1', // Secondary dark mode text
        'dark-muted': '#94a3b8',     // Muted dark mode text
      },
      borderColor: {
        'dark-border': '#475569',    // Dark mode border color
      },
      // Enhanced backdrop blur utilities
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      // Custom animations for enhanced user experience
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',        // Slide up with fade
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',    // Slide down with fade  
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both', // Shake for error states
        'float': 'float 6s ease-in-out infinite',               // Floating animation
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite alternate', // Enhanced pulse glow
        'gradient-shift': 'gradientShift 8s ease-in-out infinite', // Gradient text animation
      },
      // Custom keyframe definitions for animations
      keyframes: {
        // Fade in from bottom - used for loading content
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        // Fade in from top - used for notifications
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        // Shake animation - used for error states and invalid inputs
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
        // Floating animation
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // Enhanced pulse glow animation
        'pulse-glow': {
          'from': {
            boxShadow: '0 0 20px rgba(102, 126, 234, 0.4), 0 0 10px rgba(118, 75, 162, 0.3)',
          },
          'to': {
            boxShadow: '0 0 30px rgba(102, 126, 234, 0.6), 0 0 40px rgba(118, 75, 162, 0.4), 0 0 20px rgba(240, 147, 251, 0.3)',
          },
        },
        // Gradient text animation
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  
  // Additional Tailwind plugins (none currently used)
  // Future plugins could include: forms, typography, aspect-ratio, etc.
  plugins: [],
}

