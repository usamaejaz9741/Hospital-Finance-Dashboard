import { useState, useEffect } from 'react';

/**
 * Responsive breakpoint state interface containing viewport information.
 * 
 * @interface BreakpointState
 */
interface BreakpointState {
  /** True if viewport width >= 475px (extra small) */
  isXs: boolean;
  
  /** True if viewport width >= 640px (small) */
  isSm: boolean;
  
  /** True if viewport width >= 768px (medium) */
  isMd: boolean;
  
  /** True if viewport width >= 1024px (large) */
  isLg: boolean;
  
  /** True if viewport width >= 1280px (extra large) */
  isXl: boolean;
  
  /** True if viewport width >= 1536px (2x extra large) */
  is2Xl: boolean;
  
  /** Current viewport width in pixels */
  width: number;
  
  /** Current viewport height in pixels */
  height: number;
}

/**
 * Custom hook for responsive design that tracks viewport size and breakpoints.
 * 
 * This hook provides real-time information about the current viewport dimensions
 * and which Tailwind CSS breakpoints are currently active. It automatically
 * updates when the window is resized, making it ideal for responsive components
 * and conditional rendering based on screen size.
 * 
 * @description Features:
 * - Real-time viewport width and height tracking
 * - Tailwind CSS breakpoint detection (xs, sm, md, lg, xl, 2xl)
 * - Automatic resize event handling
 * - Memory leak prevention with proper cleanup
 * - TypeScript support with comprehensive type definitions
 * - Performance optimized with single event listener
 * 
 * **Breakpoint Reference:**
 * - xs: >= 475px (mobile landscape and up)
 * - sm: >= 640px (small tablets and up)
 * - md: >= 768px (tablets and up)
 * - lg: >= 1024px (laptops and up)
 * - xl: >= 1280px (desktops and up)
 * - 2xl: >= 1536px (large desktops and up)
 * 
 * @returns {BreakpointState} Object containing current breakpoint states and dimensions
 * 
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const { isMd, isLg, width, height } = useResponsive();
 *   
 *   return (
 *     <div>
 *       <p>Viewport: {width} x {height}</p>
 *       
 *       {isMd ? (
 *         <div>Desktop layout (>= 768px)</div>
 *       ) : (
 *         <div>Mobile layout (< 768px)</div>
 *       )}
 *       
 *       {isLg && (
 *         <div>Large screen features (>= 1024px)</div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * function AdaptiveGrid() {
 *   const { isSm, isMd, isLg } = useResponsive();
 *   
 *   const getColumns = () => {
 *     if (isLg) return 4;
 *     if (isMd) return 3;
 *     if (isSm) return 2;
 *     return 1;
 *   };
 *   
 *   return (
 *     <div className={`grid grid-cols-${getColumns()} gap-4`}>
 *       {items.map(item => <GridItem key={item.id} {...item} />)}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * function ConditionalNavigation() {
 *   const { isMd } = useResponsive();
 *   
 *   return (
 *     <nav>
 *       {isMd ? (
 *         // Desktop navigation
 *         <div className="flex space-x-6">
 *           {navItems.map(item => <NavLink key={item.id} {...item} />)}
 *         </div>
 *       ) : (
 *         // Mobile hamburger menu
 *         <MobileMenu items={navItems} />
 *       )}
 *     </nav>
 *   );
 * }
 * ```
 */
const useResponsive = (): BreakpointState => {
  // Initialize state with default values (all breakpoints false, zero dimensions)
  const [state, setState] = useState<BreakpointState>({
    isXs: false,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2Xl: false,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    /**
     * Updates the breakpoint state based on current window dimensions.
     * Calculates which Tailwind breakpoints are active for the current viewport.
     */
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update state with current dimensions and active breakpoints
      setState({
        isXs: width >= 475,   // Mobile landscape and larger
        isSm: width >= 640,   // Small tablets and larger
        isMd: width >= 768,   // Tablets and larger
        isLg: width >= 1024,  // Laptops and larger
        isXl: width >= 1280,  // Desktops and larger
        is2Xl: width >= 1536, // Large desktops and larger
        width,
        height,
      });
    };

    // Set initial dimensions on mount
    updateSize();

    // Listen for window resize events
    window.addEventListener('resize', updateSize);

    // Cleanup: remove event listener to prevent memory leaks
    return () => window.removeEventListener('resize', updateSize);
  }, []); // Empty dependency array - only run on mount and unmount

  return state;
};

export default useResponsive;
