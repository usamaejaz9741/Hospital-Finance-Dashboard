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
 * <Button variant="ghost" className="text-purple-600">
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
  // Design System Button Implementation
  const baseClasses = `
    btn-base
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;
  
  // Design System Variant Classes
  const variantClasses = {
    primary: `
      btn-primary
      focus:ring-purple-400/50
    `,
    secondary: `
      btn-secondary
      focus:ring-purple-300/50
    `,
    danger: `
      btn-danger
      focus:ring-purple-500/50
    `,
    ghost: `
      btn-ghost
      focus:ring-purple-300/50
    `
  };

  // Design System Size Classes
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  };

  // Optional full width styling with proper responsive behavior
  const widthClass = fullWidth ? 'w-full' : '';

  // Combine all CSS classes for the button element
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading} // Disable during loading or when explicitly disabled
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      {...props} // Spread remaining HTML button attributes
    >
      {isLoading ? (
        // Enhanced loading state: show improved spinner and loading text
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3" />
          <span style={{ color: 'white' }}>Loading...</span>
        </>
      ) : (
        // Normal state: show provided children content
        children
      )}
    </button>
  );
};

export default Button;
