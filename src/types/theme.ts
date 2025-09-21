/**
 * Theme preference type including system preference option.
 * 
 * @type Theme
 * 
 * **Options:**
 * - `light`: Always use light theme
 * - `dark`: Always use dark theme  
 * - `auto`: Use system preference (light/dark based on OS setting)
 * 
 * @example
 * ```typescript
 * const userTheme: Theme = 'auto'; // Follow system preference
 * ```
 */
export type Theme = 'light' | 'dark' | 'auto';
/**
 * Resolved theme type representing the actual active theme.
 * This is the computed theme when 'auto' is resolved to either light or dark.
 * 
 * @type ResolvedTheme
 * @example
 * ```typescript
 * const activeTheme: ResolvedTheme = 'dark'; // Currently using dark theme
 * ```
 */
export type ResolvedTheme = 'light' | 'dark';

/**
 * Theme context type providing theme state and control methods.
 * Used by the ThemeProvider to manage application-wide theming.
 * 
 * @interface ThemeContextType
 * @example
 * ```typescript
 * const { theme, resolvedTheme, toggleTheme, setTheme } = useTheme();
 * 
 * // Toggle between light and dark
 * toggleTheme();
 * 
 * // Set specific theme
 * setTheme('auto');
 * 
 * // Check current active theme
 * if (resolvedTheme === 'dark') {
 *   console.log('Dark mode is active');
 * }
 * ```
 */
export interface ThemeContextType {
  /** Current theme preference ('light', 'dark', or 'auto') */
  theme: Theme;
  
  /** Actual resolved theme being used ('light' or 'dark') */
  resolvedTheme: ResolvedTheme;
  
  /** Whether a theme transition is currently in progress */
  isTransitioning: boolean;
  
  /** Toggle between light and dark themes (ignores 'auto') */
  toggleTheme: () => void;
  
  /** 
   * Set a specific theme preference.
   * @param theme - Theme to set ('light', 'dark', or 'auto')
   */
  setTheme: (theme: Theme) => void;
}

/**
 * Color palette structure for theme customization.
 * Defines all the colors used throughout the application for consistent theming.
 * 
 * @interface ThemeColors
 * @example
 * ```typescript
 * const lightColors: ThemeColors = {
 *   background: '#ffffff',
 *   surface: '#f8fafc',
 *   primary: '#a855f7',
 *   secondary: '#6b7280',
 *   text: {
 *     primary: '#2d1b69',
 *     secondary: '#6b7280',
 *     muted: '#9ca3af'
 *   },
 *   border: '#e5e7eb',
 *   accent: '#8b5cf6'
 * };
 * ```
 */
export interface ThemeColors {
  /** Main background color for pages */
  background: string;
  
  /** Surface color for cards and elevated elements */
  surface: string;
  
  /** Primary brand color for buttons and accents */
  primary: string;
  
  /** Secondary color for supporting elements */
  secondary: string;
  
  /** Text color variations for different content types */
  text: {
    /** Primary text color for headings and important content */
    primary: string;
    
    /** Secondary text color for supporting content */
    secondary: string;
    
    /** Muted text color for placeholders and disabled content */
    muted: string;
  };
  
  /** Border color for dividers and element outlines */
  border: string;
  
  /** Accent color for highlights and special elements */
  accent: string;
}

