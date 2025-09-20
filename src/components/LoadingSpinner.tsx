import React from 'react';

/**
 * Props for the LoadingSpinner component.
 * 
 * @interface LoadingSpinnerProps
 */
interface LoadingSpinnerProps {
  /** Size variant of the spinner (default: 'md') */
  size?: 'sm' | 'md' | 'lg';
  
  /** Main loading text displayed below the spinner (default: 'Loading...') */
  text?: string;
  
  /** Optional secondary text for additional context */
  subtext?: string;
  
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * Customizable loading spinner component with text and animations.
 * 
 * Features:
 * - Multiple size options (small, medium, large)
 * - Customizable loading text and subtext
 * - Smooth spinning animation
 * - Dark mode support
 * - Responsive typography
 * - Centered layout with proper spacing
 * - Accessible with proper ARIA attributes
 * 
 * Used throughout the application for loading states, data fetching,
 * and async operations to provide visual feedback to users.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic spinner
 * <LoadingSpinner />
 * 
 * // Large spinner with custom text
 * <LoadingSpinner 
 *   size="lg" 
 *   text="Loading Dashboard..." 
 *   subtext="Please wait while we fetch your data"
 * />
 * 
 * // Small spinner for inline loading
 * <LoadingSpinner 
 *   size="sm" 
 *   text="Saving..." 
 *   className="py-2"
 * />
 * 
 * // Full screen loading overlay
 * <LoadingSpinner 
 *   size="lg"
 *   text="Initializing Application"
 *   className="min-h-screen bg-gray-50 dark:bg-dark-bg"
 * />
 * ```
 * 
 * @param props - Component props
 * @returns React functional component rendering the loading spinner
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  subtext,
  className = '' 
}) => {
  // Size mapping for spinner dimensions
  const sizeClasses = {
    sm: 'h-6 w-6',   // 24x24px for inline/small spaces
    md: 'h-12 w-12', // 48x48px for standard loading states
    lg: 'h-16 w-16'  // 64x64px for prominent loading states
  };

  const spinnerSize = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center p-4 ${className}`} role="status" aria-live="polite">
      <div className="text-center">
        {/* Animated spinner circle */}
        <div 
          className={`animate-spin rounded-full ${spinnerSize} mx-auto mb-4`}
          style={{
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderBottomColor: 'rgba(255, 255, 255, 0.8)'
          }}
          aria-hidden="true" // Decorative element, screen readers will use the text
        />
        
        {/* Main loading text */}
        {text && (
          <p className="font-medium text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {text}
          </p>
        )}
        
        {/* Optional secondary text for additional context */}
        {subtext && (
          <p className="text-xs sm:text-sm mt-1 max-w-xs mx-auto" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
