/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Dark mode specific colors
        dark: {
          background: '#0f172a',
          surface: '#1e293b',
          card: '#334155',
          border: '#475569',
          text: {
            primary: '#f1f5f9',
            secondary: '#cbd5e1',
            muted: '#94a3b8',
          }
        }
      },
      backgroundColor: {
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-card': '#334155',
      },
      textColor: {
        'dark-primary': '#f1f5f9',
        'dark-secondary': '#cbd5e1',
        'dark-muted': '#94a3b8',
      },
      borderColor: {
        'dark-border': '#475569',
      }
    },
  },
  plugins: [],
}

