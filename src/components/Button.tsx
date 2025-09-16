import React from 'react';

/**
 * Button variant types defining the visual style and semantic meaning.
 * 
 * @type ButtonVariant
 * - `primary`: Main action button with brand colors
 * - `secondary`: Secondary action with muted styling  
 * - `danger`: Destructive actions with red coloring
 * - `ghost`: Minimal styling for subtle actions
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * Button size variants for different use cases.
 * 
 * @type ButtonSize
 * - `sm`: Small button for compact spaces
 * - `md`: Default medium size for most use cases
 * - `lg`: Large button for prominent actions
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Button component extending standard HTML button attributes.
 * 
 * @interface ButtonProps
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button (default: 'primary') */
  variant?: ButtonVariant;
  
  /** Size of the button (default: 'md') */
  size?: ButtonSize;
  
  /** Whether the button is in a loading state with spinner */
  isLoading?: boolean;
  
  /** Whether the button should take full width of its container */
  fullWidth?: boolean;
  
  /** Button content (text, icons, or other React elements) */
  children: React.ReactNode;
}

/**
 * Flexible button component with multiple variants, sizes, and states.
 * 
 * Features:
 * - Multiple visual variants (primary, secondary, danger, ghost)
 * - Responsive sizing options
 * - Loading state with spinner animation
 * - Full width option
 * - Hover and focus animations
 * - Dark mode support
 * - Accessibility compliant with proper focus states
 * 
 * @component
 * @example
 * ```tsx
 * // Primary action button
 * <Button variant="primary" size="lg">
 *   Save Changes
 * </Button>
 * 
 * // Secondary button with loading state
 * <Button variant="secondary" isLoading={isSubmitting}>
 *   Cancel
 * </Button>
 * 
 * // Danger button for destructive actions
 * <Button variant="danger" onClick={handleDelete}>
 *   Delete Item
 * </Button>
 * 
 * // Ghost button with custom styling
 * <Button variant="ghost" className="text-blue-600">
 *   Learn More
 * </Button>
 * 
 * // Full width button for forms
 * <Button fullWidth size="lg">
 *   Submit Form
 * </Button>
 * ```
 * 
 * @param props - Button component props
 * @returns React functional component
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  // Base styling applied to all button variants (typography, transitions, focus states)
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0';
  
  // Variant-specific styling with dark mode support
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white focus:ring-primary-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-dark-surface dark:hover:bg-dark-hover-surface text-gray-800 dark:text-dark-primary focus:ring-gray-500 border border-gray-300 dark:border-dark-border shadow-sm hover:shadow-md',
    danger: 'bg-danger-600 hover:bg-danger-700 disabled:bg-danger-400 text-white focus:ring-danger-500 shadow-md hover:shadow-lg',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-dark-surface text-gray-700 dark:text-dark-primary focus:ring-gray-500'
  };

  // Size-specific padding and text scaling
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  // Optional full width styling
  const widthClass = fullWidth ? 'w-full' : '';

  // Combine all CSS classes for the button element
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading} // Disable during loading or when explicitly disabled
      {...props} // Spread remaining HTML button attributes
    >
      {isLoading ? (
        // Loading state: show spinner and loading text
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
          Loading...
        </>
      ) : (
        // Normal state: show provided children content
        children
      )}
    </button>
  );
};

export default Button;
