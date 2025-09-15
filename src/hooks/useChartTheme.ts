import { useTheme } from './useTheme';

export const useChartTheme = () => {
  const { resolvedTheme } = useTheme();

  const colors = {
    primary: resolvedTheme === 'dark' ? '#60a5fa' : '#3b82f6',
    secondary: resolvedTheme === 'dark' ? '#a78bfa' : '#8b5cf6',
    success: resolvedTheme === 'dark' ? '#4ade80' : '#10b981',
    danger: resolvedTheme === 'dark' ? '#f87171' : '#ef4444',
    warning: resolvedTheme === 'dark' ? '#fbbf24' : '#f59e0b',
    info: resolvedTheme === 'dark' ? '#38bdf8' : '#0ea5e9',
  };

  const chartTheme = {
    colors,
    grid: {
      stroke: resolvedTheme === 'dark' ? '#374151' : '#f1f5f9',
    },
    axis: {
      stroke: resolvedTheme === 'dark' ? '#9ca3af' : '#64748b',
    },
    tooltip: {
      backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
      border: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb',
      textColor: resolvedTheme === 'dark' ? '#f9fafb' : '#111827',
      shadowColor: resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
    },
    legend: {
      color: resolvedTheme === 'dark' ? '#d1d5db' : '#6b7280',
    },
  };

  return { chartTheme, resolvedTheme };
};
