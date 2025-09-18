import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Theme, ThemeContextType, ResolvedTheme } from '../types/theme';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get system preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Apply theme to DOM with smooth transition and loading state
  const applyTheme = useCallback((newResolvedTheme: ResolvedTheme) => {
    const root = document.documentElement;
    
    // Set loading state
    setIsTransitioning(true);
    
    // Add transition class for smooth theme switching
    root.classList.add('transitioning');
    
    // Switch theme at 1.2s (during deep black phase when opacity is 95%+)
    setTimeout(() => {
      if (newResolvedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Force a reflow to ensure DOM changes are applied instantly
      document.body.offsetHeight;
      
      // Force re-computation of all critical styles during black phase
      const criticalElements = document.querySelectorAll('.glass-card, .btn-base, .dropdown-button, .theme-toggle, .blob, .animate-float');
      criticalElements.forEach(el => {
        window.getComputedStyle(el as Element).backgroundColor;
        window.getComputedStyle(el as Element).color;
        window.getComputedStyle(el as Element).borderColor;
      });
    }, 1200); // Deep in black phase (40% of 3s animation)
    
    // Extended transition duration for three-phase transition
    setTimeout(() => {
      root.classList.remove('transitioning');
      setIsTransitioning(false);
      
      // Re-enable animations after transition is complete
      const animatedElements = document.querySelectorAll('.blob, .animate-float, [class*="animate-"]');
      animatedElements.forEach(el => {
        (el as HTMLElement).style.animationPlayState = 'running';
      });
    }, 3500); // Longer total duration for smoother fade out
  }, []);

  // Resolve the actual theme (light/dark) from the theme setting
  const resolveTheme = useCallback((themeValue: Theme): ResolvedTheme => {
    if (themeValue === 'auto') {
      return getSystemTheme();
    }
    return themeValue as ResolvedTheme;
  }, [getSystemTheme]);

  // Enhanced preload system to force both themes to be fully computed
  useEffect(() => {
    const root = document.documentElement;
    
    // Disable transitions during preload
    root.classList.add('no-transitions');
    
    // Force browser to compute and cache both light and dark mode CSS
    const forceStyleComputation = () => {
      // Create comprehensive test elements for all component types
      const componentClasses = [
        'preload-themes glass-card btn-base btn-primary btn-secondary btn-danger btn-ghost',
        'dropdown-button dropdown-options dropdown-option theme-toggle header-glass',
        'animate-float animate-pulse-glow blob blob-center performance-insight-card',
        'logo-container logo-container-inverted avatar-gradient-border',
        'interactive glass-card-hover card badge alert nav panel tooltip',
        'form-input-focus custom-radio custom-checkbox custom-select',
        'mobile-menu-overlay sidebar-glass user-profile-dropdown'
      ];
      
      componentClasses.forEach(classes => {
        const testElement = document.createElement('div');
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        testElement.style.pointerEvents = 'none';
        testElement.style.top = '-9999px';
        testElement.className = classes;
        document.body.appendChild(testElement);
        
        // Force light mode computation for all properties
        root.classList.remove('dark');
        const lightStyle = window.getComputedStyle(testElement);
        lightStyle.backgroundColor;
        lightStyle.color;
        lightStyle.borderColor;
        lightStyle.boxShadow;
        lightStyle.backgroundImage;
        lightStyle.backdropFilter;
        lightStyle.filter;
        lightStyle.textShadow;
        lightStyle.stroke;
        lightStyle.fill;
        
        // Force dark mode computation for all properties
        root.classList.add('dark');
        const darkStyle = window.getComputedStyle(testElement);
        darkStyle.backgroundColor;
        darkStyle.color;
        darkStyle.borderColor;
        darkStyle.boxShadow;
        darkStyle.backgroundImage;
        darkStyle.backdropFilter;
        darkStyle.filter;
        darkStyle.textShadow;
        darkStyle.stroke;
        darkStyle.fill;
        
        // Clean up
        document.body.removeChild(testElement);
      });
      
      // Force computation of CSS variables in both modes
      root.classList.remove('dark');
      window.getComputedStyle(root).getPropertyValue('--color-purple-500');
      window.getComputedStyle(root).getPropertyValue('--gradient-bg-primary');
      window.getComputedStyle(root).getPropertyValue('--surface-primary');
      
      root.classList.add('dark');
      window.getComputedStyle(root).getPropertyValue('--color-purple-500');
      window.getComputedStyle(root).getPropertyValue('--gradient-bg-primary');
      window.getComputedStyle(root).getPropertyValue('--surface-primary');
    };
    
    // Multiple passes to ensure complete preloading
    forceStyleComputation();
    
    // Additional delay to ensure CSS is fully processed
    setTimeout(() => {
      forceStyleComputation(); // Second pass
      
      setTimeout(() => {
        const storedTheme = localStorage.getItem('hospitalFinanceTheme') as Theme;
        const initialTheme = storedTheme || 'auto';
        const initialResolvedTheme = resolveTheme(initialTheme);
        
        // Apply initial theme without transition
        if (initialResolvedTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        
        setThemeState(initialTheme);
        setResolvedTheme(initialResolvedTheme);
        
        // Re-enable transitions after complete setup
        setTimeout(() => {
          root.classList.remove('no-transitions');
        }, 200);
      }, 100);
    }, 100);
  }, [resolveTheme]);

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
    isTransitioning,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

