import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Theme, ThemeContextType, ResolvedTheme } from '../types/theme';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Get system preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Apply theme to DOM with smooth transition
  const applyTheme = useCallback((newResolvedTheme: ResolvedTheme) => {
    const root = document.documentElement;
    
    // Add transition class for smooth theme switching
    root.classList.add('transitioning');
    
    if (newResolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Remove transition class after animation completes
    setTimeout(() => {
      root.classList.remove('transitioning');
    }, 300);
  }, []);

  // Resolve the actual theme (light/dark) from the theme setting
  const resolveTheme = useCallback((themeValue: Theme): ResolvedTheme => {
    if (themeValue === 'auto') {
      return getSystemTheme();
    }
    return themeValue as ResolvedTheme;
  }, [getSystemTheme]);

  // Initialize theme from localStorage or default to auto
  useEffect(() => {
    const storedTheme = localStorage.getItem('hospitalFinanceTheme') as Theme;
    const initialTheme = storedTheme || 'auto';
    const initialResolvedTheme = resolveTheme(initialTheme);
    
    setThemeState(initialTheme);
    setResolvedTheme(initialResolvedTheme);
    applyTheme(initialResolvedTheme);
  }, [resolveTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? 'dark' : 'light';
      
      // Only update if current theme is 'auto'
      if (theme === 'auto') {
        setResolvedTheme(systemTheme);
        applyTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    const newResolvedTheme = resolveTheme(newTheme);
    
    setThemeState(newTheme);
    setResolvedTheme(newResolvedTheme);
    localStorage.setItem('hospitalFinanceTheme', newTheme);
    applyTheme(newResolvedTheme);
  }, [resolveTheme, applyTheme]);

  const toggleTheme = useCallback(() => {
    if (theme === 'auto') {
      // If auto, switch to the opposite of current resolved theme
      const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    } else {
      // Toggle between light and dark
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    }
  }, [theme, resolvedTheme, setTheme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

