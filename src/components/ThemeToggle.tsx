import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Modern glassmorphism theme toggle button with smooth animations.
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const { resolvedTheme, setTheme, isTransitioning } = useTheme();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSize = sizeClasses[size];

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      disabled={isTransitioning}
      className={`
        theme-toggle relative w-12 h-12 rounded-xl
        text-white/80 hover:text-white
        focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 
        focus:ring-offset-transparent
        group overflow-hidden
        transition-all duration-300 hover:scale-105
        ${isTransitioning ? 'animate-pulse cursor-wait' : ''}
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1))',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: '30'
      }}
      title={isTransitioning ? 'Switching theme...' : (resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode')}
      aria-label={isTransitioning ? 'Switching theme...' : (resolvedTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode')}
    >
      
      {/* Icon container with smooth transition and loading state */}
      <div className="relative z-10 flex items-center justify-center">
        {isTransitioning ? (
          /* Loading spinner during transition */
          <div className="relative">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-purple-300 rounded-full animate-spin animation-delay-200"></div>
          </div>
        ) : (
          <>
            <div className={`
              transition-all duration-500 transform
              ${resolvedTheme === 'light' ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0 absolute'}
            `}>
              <svg 
                className={`${iconSize} drop-shadow-lg`} 
                style={{ color: 'var(--color-text-primary)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
            </div>
            
            <div className={`
              transition-all duration-500 transform
              ${resolvedTheme === 'dark' ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0 absolute'}
            `}>
              <svg 
                className={`${iconSize} drop-shadow-lg`} 
                style={{ color: 'var(--color-text-primary)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            </div>
          </>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;

