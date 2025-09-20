import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { ThemeContextType } from '../types/theme';

/**
 * Custom hook to access the theme context for managing light/dark mode.
 * 
 * This hook provides access to the current theme state and methods for
 * changing themes. It handles both explicit theme preferences and
 * automatic system preference detection.
 * 
 * @description Features:
 * - Get current theme preference ('light', 'dark', 'auto')
 * - Get resolved theme (actual active theme)
 * - Toggle between light and dark themes
 * - Set specific theme preference
 * - Automatic system preference detection when theme is 'auto'
 * - Persistent theme storage in localStorage
 * 
 * @throws {Error} Throws an error if used outside of a ThemeProvider
 * 
 * @returns {ThemeContextType} The theme context containing:
 *   - theme: Current theme preference setting
 *   - resolvedTheme: Actual active theme (light or dark)
 *   - toggleTheme: Function to toggle between light and dark
 *   - setTheme: Function to set a specific theme preference
 * 
 * @example
 * ```tsx
 * function ThemeToggleButton() {
 *   const { theme, resolvedTheme, toggleTheme, setTheme } = useTheme();
 *   
 *   return (
 *     <div>
 *       <p>Current theme: {theme}</p>
 *       <p>Active theme: {resolvedTheme}</p>
 *       
 *       <button onClick={toggleTheme}>
 *         Switch to {resolvedTheme === 'light' ? 'dark' : 'light'} mode
 *       </button>
 *       
 *       <button onClick={() => setTheme('auto')}>
 *         Use system preference
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * function ConditionalStyling() {
 *   const { resolvedTheme } = useTheme();
 *   
 *   const iconColor = resolvedTheme === 'dark' ? '#ffffff' : '#2d1b69';
 *   
 *   return (
 *     <div className={resolvedTheme === 'dark' ? 'dark-styles' : 'light-styles'}>
 *       <Icon color={iconColor} />
 *     </div>
 *   );
 * }
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  // Ensure hook is used within ThemeProvider
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider. Make sure to wrap your component tree with <ThemeProvider>.');
  }
  
  return context;
};

