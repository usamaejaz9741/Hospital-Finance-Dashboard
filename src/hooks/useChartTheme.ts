import { useTheme } from './useTheme';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

export const useChartTheme = () => {
  const { resolvedTheme } = useTheme();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const themeColors: any = fullConfig.theme.colors;

  const colors = {
    primary: resolvedTheme === 'dark' ? themeColors.primary[400] : themeColors.primary[500],
    secondary: resolvedTheme === 'dark' ? themeColors.purple[400] : themeColors.purple[500],
    success: resolvedTheme === 'dark' ? themeColors.success[400] : themeColors.success[500],
    danger: resolvedTheme === 'dark' ? themeColors.danger[400] : themeColors.danger[500],
    warning: resolvedTheme === 'dark' ? themeColors.warning[400] : themeColors.warning[500],
    info: resolvedTheme === 'dark' ? themeColors.indigo[400] : themeColors.indigo[500],
  };

  const chartTheme = {
    colors,
    grid: {
      stroke: resolvedTheme === 'dark' ? themeColors.dark.border : '#f1f5f9',
    },
    axis: {
      stroke: resolvedTheme === 'dark' ? themeColors.dark.text.muted : '#64748b',
    },
    tooltip: {
      backgroundColor: resolvedTheme === 'dark' ? themeColors.dark.surface : '#ffffff',
      border: resolvedTheme === 'dark' ? themeColors.dark.border : '#e5e7eb',
      textColor: resolvedTheme === 'dark' ? themeColors.dark.text.primary : '#111827',
      shadowColor: resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
    },
    legend: {
      color: resolvedTheme === 'dark' ? themeColors.dark.text.secondary : '#6b7280',
    },
  };

  return { chartTheme, resolvedTheme };
};
