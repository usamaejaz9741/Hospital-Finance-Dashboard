import React, { memo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RevenueData } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';
import { useProcessedRevenueData, usePerformanceMonitor } from '../../utils/performance';
import ChartNoData from '../ChartNoData';

interface OptimizedRevenueChartProps {
  data: RevenueData[];
  className?: string;
}

/**
 * Optimized Revenue Chart component with memoization and performance monitoring.
 * 
 * @param {RevenueData[]} data - Revenue data array
 * @param {string} className - Additional CSS classes
 * @returns {React.ReactElement} The optimized revenue chart component
 */
const OptimizedRevenueChart: React.FC<OptimizedRevenueChartProps> = memo(({ 
  data, 
  className = '' 
}) => {
  const { logRenderTime } = usePerformanceMonitor('OptimizedRevenueChart');
  const processedData = useProcessedRevenueData(data);

  // Memoized tooltip formatter
  const formatTooltip = useCallback((value: number, name: string) => {
    switch (name) {
      case 'revenue':
        return [formatCurrency(value), 'Revenue'];
      case 'expenses':
        return [formatCurrency(value), 'Expenses'];
      case 'netIncome':
        return [formatCurrency(value), 'Net Income'];
      default:
        return [formatCurrency(value), name];
    }
  }, []);

  // Memoized label formatter
  const formatLabel = useCallback((label: string) => {
    return `Month: ${label}`;
  }, []);

  React.useEffect(() => {
    logRenderTime();
  });

  if (!processedData?.length) {
    return <ChartNoData title="No Revenue Data" message="No revenue data available for the selected period." />;
  }

  return (
    <div className={`bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-dark-border ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Revenue Trends
      </h2>
      <div className="h-80 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={formatLabel}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="netIncome" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

OptimizedRevenueChart.displayName = 'OptimizedRevenueChart';

export default OptimizedRevenueChart;
