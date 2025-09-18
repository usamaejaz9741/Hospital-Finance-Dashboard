import { useTheme } from './useTheme';
// import resolveConfig from 'tailwindcss/resolveConfig';
// import tailwindConfig from '../../tailwind.config.js';

// Resolve Tailwind configuration to access theme colors at runtime
// const fullConfig = resolveConfig(tailwindConfig);

/**
 * Custom hook for providing theme-aware colors and styling for charts.
 * 
 * This hook bridges the application's theme system with chart components,
 * automatically providing appropriate colors, grid styles, tooltips, and
 * other visual elements that adapt to light/dark mode.
 * 
 * @description Features:
 * - Theme-aware color palette for chart elements
 * - Automatic light/dark mode adaptation
 * - Consistent styling with application theme
 * - Grid, axis, tooltip, and legend theming
 * - Type-safe color and style configuration
 * - Integration with Tailwind CSS design system
 * 
 * @returns Object containing:
 *   - chartTheme: Complete theme configuration for charts
 *   - resolvedTheme: Current active theme (light or dark)
 * 
 * @example
 * ```tsx
 * function CustomChart() {
 *   const { chartTheme, resolvedTheme } = useChartTheme();
 *   
 *   return (
 *     <LineChart data={data}>
 *       <Line 
 *         stroke={chartTheme.colors.primary}
 *         strokeWidth={2}
 *       />
 *       <XAxis 
 *         stroke={chartTheme.axis.stroke}
 *         tick={{ fill: chartTheme.axis.stroke }}
 *       />
 *       <Tooltip 
 *         contentStyle={{
 *           backgroundColor: chartTheme.tooltip.backgroundColor,
 *           border: `1px solid ${chartTheme.tooltip.border}`,
 *           color: chartTheme.tooltip.textColor
 *         }}
 *       />
 *     </LineChart>
 *   );
 * }
 * ```
 * 
 * @example
 * ```tsx
 * function PieChart() {
 *   const { chartTheme } = useChartTheme();
 *   
 *   const data = [
 *     { name: 'Category A', value: 400, fill: chartTheme.colors.primary },
 *     { name: 'Category B', value: 300, fill: chartTheme.colors.secondary },
 *     { name: 'Category C', value: 200, fill: chartTheme.colors.success }
 *   ];
 *   
 *   return <Pie data={data} />;
 * }
 * ```
 */
export const useChartTheme = () => {
  const { resolvedTheme } = useTheme();
  
  // Access Tailwind color configuration (TypeScript type issue with complex config structure)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const themeColors: any = fullConfig.theme.colors;

  // Enhanced theme-aware color palette for chart elements with diverse colors
  const colors = {
    primary: resolvedTheme === 'dark' ? '#a855f7' : '#a855f7', // Purple - main brand
    secondary: resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb', // Blue - secondary actions
    success: resolvedTheme === 'dark' ? '#22c55e' : '#16a34a', // Green - positive metrics
    danger: resolvedTheme === 'dark' ? '#ef4444' : '#dc2626', // Red - negative metrics
    warning: resolvedTheme === 'dark' ? '#f59e0b' : '#d97706', // Amber - warnings
    info: resolvedTheme === 'dark' ? '#06b6d4' : '#0891b2', // Cyan - info states
    accent: resolvedTheme === 'dark' ? '#8b5cf6' : '#9333ea', // Purple variant
    purple: resolvedTheme === 'dark' ? '#c084fc' : '#a855f7', // Purple - charts
    // Additional chart colors for legends and data series
    teal: resolvedTheme === 'dark' ? '#14b8a6' : '#0d9488', // Teal - data series
    emerald: resolvedTheme === 'dark' ? '#10b981' : '#059669', // Emerald - success metrics
    rose: resolvedTheme === 'dark' ? '#f43f5e' : '#e11d48', // Rose - danger metrics
    violet: resolvedTheme === 'dark' ? '#8b5cf6' : '#7c3aed', // Violet - accent
    indigo: resolvedTheme === 'dark' ? '#6366f1' : '#4f46e5', // Indigo - info metrics
    orange: resolvedTheme === 'dark' ? '#f97316' : '#ea580c', // Orange - warning metrics
  };

  // Comprehensive theme configuration for all chart elements
  const chartTheme = {
    colors,
    
    // Enhanced grid line styling with subtle glassmorphism
    grid: {
      stroke: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
    },
    
    // Enhanced axis styling with better contrast
    axis: {
      stroke: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.8)',
    },
    
    // Enhanced tooltip with glassmorphism styling
    tooltip: {
      backgroundColor: resolvedTheme === 'dark' 
        ? 'rgba(15, 23, 42, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)',
      border: resolvedTheme === 'dark' 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(255, 255, 255, 0.3)',
      textColor: resolvedTheme === 'dark' ? '#ffffff' : '#2d1b69',
      shadowColor: resolvedTheme === 'dark' 
        ? 'rgba(12, 14, 39, 0.4)' 
        : 'rgba(102, 126, 234, 0.2)',
      backdropFilter: 'blur(12px)',
    },
    
    // Enhanced legend styling
    legend: {
      color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    },
    
    // Theme-appropriate cursor styling for chart interactions
    cursor: {
      fill: resolvedTheme === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(255, 255, 255, 0.2)',
      stroke: resolvedTheme === 'dark' 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(255, 255, 255, 0.3)',
    },
  };

  return { chartTheme, resolvedTheme };
};
