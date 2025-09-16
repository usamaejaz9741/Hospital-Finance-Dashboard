import { useTheme } from './useTheme';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

// Resolve Tailwind configuration to access theme colors at runtime
const fullConfig = resolveConfig(tailwindConfig);

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
  const themeColors: any = fullConfig.theme.colors;

  // Define theme-aware color palette for chart elements
  // Dark mode uses lighter shades (400) for better contrast, light mode uses standard shades (500)
  const colors = {
    primary: resolvedTheme === 'dark' ? themeColors.primary[400] : themeColors.primary[500],
    secondary: resolvedTheme === 'dark' ? themeColors.purple[400] : themeColors.purple[500],
    success: resolvedTheme === 'dark' ? themeColors.success[400] : themeColors.success[500],
    danger: resolvedTheme === 'dark' ? themeColors.danger[400] : themeColors.danger[500],
    warning: resolvedTheme === 'dark' ? themeColors.warning[400] : themeColors.warning[500],
    info: resolvedTheme === 'dark' ? themeColors.indigo[400] : themeColors.indigo[500],
  };

  // Comprehensive theme configuration for all chart elements
  const chartTheme = {
    colors,
    
    // Grid line styling for chart backgrounds
    grid: {
      stroke: resolvedTheme === 'dark' ? themeColors.dark.border : '#f1f5f9',
    },
    
    // Axis line and tick styling
    axis: {
      stroke: resolvedTheme === 'dark' ? themeColors.dark.text.muted : '#64748b',
    },
    
    // Tooltip appearance and styling
    tooltip: {
      backgroundColor: resolvedTheme === 'dark' ? themeColors.dark.surface : '#ffffff',
      border: resolvedTheme === 'dark' ? themeColors.dark.border : '#e5e7eb',
      textColor: resolvedTheme === 'dark' ? themeColors.dark.text.primary : '#111827',
      shadowColor: resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
    },
    
    // Legend text styling
    legend: {
      color: resolvedTheme === 'dark' ? themeColors.dark.text.secondary : '#6b7280',
    },
  };

  return { chartTheme, resolvedTheme };
};
