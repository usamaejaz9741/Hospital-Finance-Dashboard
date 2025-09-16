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
      // Extended color palette for the dashboard
      colors: {
        // Primary brand color (blue) - used for main actions and branding
        primary: {
          50: '#eff6ff',   // Very light blue for backgrounds
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa', // Used in dark mode
          500: '#3b82f6', // Main brand color
          600: '#2563eb', // Default button color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a', // Darkest shade
        },
        // Success/positive color (green) - for positive metrics, success states
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80', // Used in dark mode
          500: '#22c55e', // Main success color
          600: '#16a34a', // Default success actions
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f59e0b',
          600: '#d97706',
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
          400: '#f87171', // Used in dark mode
          500: '#ef4444', // Main error color
          600: '#dc2626', // Default error actions
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
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
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Dark mode specific colors - carefully chosen for optimal contrast and readability
        dark: {
          background: '#0f172a',    // Deep navy for main background
          surface: '#1e293b',       // Lighter navy for cards and surfaces
          card: '#334155',          // Card backgrounds
          border: '#475569',        // Border color with subtle contrast
          text: {
            primary: '#f8fafc',     // High contrast white for headings
            secondary: '#e2e8f0',   // Slightly muted for body text
            muted: '#94a3b8',       // Muted text for secondary info
          },
          hover: {
            surface: '#374151',     // Hover states for interactive elements
            card: '#475569',
          }
        }
      },
      // Utility classes for dark mode (legacy support)
      backgroundColor: {
        'dark-bg': '#0f172a',      // Main dark background
        'dark-surface': '#1e293b', // Dark surface background
        'dark-card': '#334155',    // Dark card background
      },
      textColor: {
        'dark-primary': '#f1f5f9',   // Primary dark mode text
        'dark-secondary': '#cbd5e1', // Secondary dark mode text
        'dark-muted': '#94a3b8',     // Muted dark mode text
      },
      borderColor: {
        'dark-border': '#475569',    // Dark mode border color
      },
      // Custom animations for enhanced user experience
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',        // Slide up with fade
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',    // Slide down with fade  
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both', // Shake for error states
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
      },
    },
  },
  
  // Additional Tailwind plugins (none currently used)
  // Future plugins could include: forms, typography, aspect-ratio, etc.
  plugins: [],
}

