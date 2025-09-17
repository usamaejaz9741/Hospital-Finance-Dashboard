/**
 * Optimized Revenue Chart Component
 * 
 * This component provides performance optimizations including:
 * - Memoized calculations
 * - Optimized re-renders
 * - Efficient data processing
 * - Lazy loading support
 */

import React, { memo, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RevenueData } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';
import { useChartTheme } from '../../hooks/useChartTheme';
import { measurePerformance } from '../../utils/performance';
import ChartNoData from '../ChartNoData';

interface RevenueChartProps {
  data: RevenueData[];
  isLoading?: boolean;
  onDataPointClick?: (data: RevenueData) => void;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

/**
 * Memoized tooltip component to prevent unnecessary re-renders
 */
const CustomTooltip = memo<CustomTooltipProps>(({ active, payload, label }) => {
  const { chartTheme } = useChartTheme();
  
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div 
      className="p-4 rounded-lg shadow-lg border backdrop-blur-sm"
      style={{ 
        backgroundColor: chartTheme.tooltip.backgroundColor,
        borderColor: chartTheme.tooltip.border,
        color: chartTheme.tooltip.textColor,
        boxShadow: `0 10px 15px -3px ${chartTheme.tooltip.shadowColor}`
      }}
    >
      <p className="font-medium mb-2" style={{ color: chartTheme.tooltip.textColor }}>
        {`${label} 2024`}
      </p>
      {payload.map((entry, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {`${entry.name}: ${formatCurrency(entry.value)}`}
        </p>
      ))}
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

/**
 * Chart theme type definition
 */
interface ChartTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
  };
  grid: { stroke: string };
  axis: { stroke: string };
  tooltip: {
    backgroundColor: string;
    border: string;
    textColor: string;
    shadowColor: string;
  };
  legend: { color: string };
}

/**
 * Memoized chart lines to prevent unnecessary re-renders
 */
const ChartLines = memo<{ chartTheme: ChartTheme }>(({ chartTheme }) => (
  <>
    <Line 
      type="monotone" 
      dataKey="revenue" 
      stroke={chartTheme.colors.primary} 
      strokeWidth={3}
      name="Revenue"
      dot={{ fill: chartTheme.colors.primary, strokeWidth: 0, r: 4 }}
      activeDot={{ r: 6, fill: chartTheme.colors.primary, stroke: 'white', strokeWidth: 2 }}
    />
    <Line 
      type="monotone" 
      dataKey="expenses" 
      stroke={chartTheme.colors.danger} 
      strokeWidth={3}
      name="Expenses"
      dot={{ fill: chartTheme.colors.danger, strokeWidth: 0, r: 4 }}
      activeDot={{ r: 6, fill: chartTheme.colors.danger, stroke: 'white', strokeWidth: 2 }}
    />
    <Line 
      type="monotone" 
      dataKey="netIncome" 
      stroke={chartTheme.colors.success} 
      strokeWidth={3}
      name="Net Income"
      dot={{ fill: chartTheme.colors.success, strokeWidth: 0, r: 4 }}
      activeDot={{ r: 6, fill: chartTheme.colors.success, stroke: 'white', strokeWidth: 2 }}
    />
  </>
));

ChartLines.displayName = 'ChartLines';

/**
 * Optimized Revenue Chart Component
 * 
 * Features:
 * - Memoized calculations and components
 * - Optimized re-renders
 * - Performance monitoring
 * - Efficient data processing
 * - Lazy loading support
 */
const OptimizedRevenueChart: React.FC<RevenueChartProps> = memo(({ 
  data, 
  isLoading = false, 
  onDataPointClick 
}) => {
  const { chartTheme } = useChartTheme();

  // Memoize data processing to prevent unnecessary recalculations
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const processData = measurePerformance(() => {
      return data.map(item => ({
        ...item,
        // Add any data transformations here
        revenue: Math.round(item.revenue),
        expenses: Math.round(item.expenses),
        netIncome: Math.round(item.netIncome)
      }));
    }, 'revenueDataProcessing');
    
    return processData();
  }, [data]);

  // Memoize chart configuration
  const chartConfig = useMemo(() => ({
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
    cartesianGrid: { strokeDasharray: "3 3", stroke: chartTheme.grid.stroke },
    xAxis: { 
      dataKey: "month", 
      stroke: chartTheme.axis.stroke,
      fontSize: 12
    },
    yAxis: { 
      stroke: chartTheme.axis.stroke,
      fontSize: 12,
      tickFormatter: (value: number) => `$${(value / 1000000).toFixed(1)}M`
    }
  }), [chartTheme]);

  // Memoize click handler
  const handleDataPointClick = useCallback((data: unknown) => {
    if (onDataPointClick && data && typeof data === 'object' && data !== null && 'payload' in data) {
      const payload = (data as { payload: RevenueData }).payload;
      onDataPointClick(payload);
    }
  }, [onDataPointClick]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue & Expenses Trend</h2>
        </div>
        <div className="h-64 sm:h-80 lg:h-96 flex items-center justify-center">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">
            Loading chart data...
          </div>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!processedData || processedData.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue & Expenses Trend</h2>
        </div>
        <ChartNoData
          title="No Data Available"
          message="There is no revenue data to display for the selected period."
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Revenue & Expenses Trend</h2>
      </div>
      
      <div className="h-64 sm:h-80 lg:h-96 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={processedData} 
            margin={chartConfig.margin}
            onClick={handleDataPointClick}
          >
            <CartesianGrid 
              strokeDasharray={chartConfig.cartesianGrid.strokeDasharray} 
              stroke={chartConfig.cartesianGrid.stroke} 
            />
            <XAxis 
              dataKey={chartConfig.xAxis.dataKey}
              stroke={chartConfig.xAxis.stroke}
              fontSize={chartConfig.xAxis.fontSize}
            />
            <YAxis 
              stroke={chartConfig.yAxis.stroke}
              fontSize={chartConfig.yAxis.fontSize}
              tickFormatter={chartConfig.yAxis.tickFormatter}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: chartTheme.legend.color }}
            />
            <ChartLines chartTheme={chartTheme} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

OptimizedRevenueChart.displayName = 'OptimizedRevenueChart';

export default OptimizedRevenueChart;