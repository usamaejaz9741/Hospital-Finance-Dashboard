import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExpenseBreakdown } from '../types/finance';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { useChartTheme } from '../hooks/useChartTheme';
import ChartNoData from './ChartNoData';

interface ExpensePieChartProps {
  data: ExpenseBreakdown[];
}

/**
 * Renders a pie chart displaying the breakdown of expenses.
 *
 * @param {ExpensePieChartProps} props The component props.
 * @param {ExpenseBreakdown[]} props.data The data to display in the chart.
 * @returns {React.ReactElement} The rendered pie chart.
 */
const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data }) => {
  const { chartTheme } = useChartTheme();
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Expense Breakdown</h2>
        </div>
        <ChartNoData
          title="No Data Available"
          message="There is no expense data to display for the selected period."
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          }
        />
      </div>
    );
  }

  if (data.reduce((sum, item) => sum + item.amount, 0) === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-dark-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Expense Breakdown</h2>
        </div>
        <ChartNoData
          title="Zero Expenses"
          message="No expenses have been recorded for the selected period."
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>
    );
  }

  interface TooltipPayload {
    payload: ExpenseBreakdown;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
  }

  interface LegendPayload {
    value: string;
    color: string;
  }

  interface CustomLegendProps {
    payload?: LegendPayload[];
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload?.[0]?.payload) {
      const data = payload[0].payload;
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
          <p className="font-medium mb-1" style={{ color: chartTheme.tooltip.textColor }}>
            {data.category}
          </p>
          <p className="text-sm" style={{ color: chartTheme.tooltip.textColor }}>
            Amount: {formatCurrency(data.amount)}
          </p>
          <p className="text-sm" style={{ color: chartTheme.tooltip.textColor }}>
            Percentage: {formatPercentage(data.percentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: CustomLegendProps) => {
    if (!payload) return null;
    
    return (
      <div className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {data.map((item, index: number) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 truncate">{item.category}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Expense Breakdown</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: {formatCurrency(data.reduce((sum, item) => sum + item.amount, 0))}
        </div>
      </div>
      
      <div className="h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius="95%"
              innerRadius="47%"
              paddingAngle={2}
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensePieChart;
