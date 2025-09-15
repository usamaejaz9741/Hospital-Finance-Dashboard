import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RevenueData } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import { useChartTheme } from '../hooks/useChartTheme';

interface RevenueChartProps {
  data: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const { chartTheme } = useChartTheme();
  
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue & Expenses Trend</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium mb-2">No Data Available</p>
            <p className="text-sm">There is no revenue data to display for the selected period.</p>
          </div>
        </div>
      </div>
    );
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

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
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
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue & Expenses Trend</h2>
      </div>
      
      <div className="h-64 sm:h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid.stroke} />
            <XAxis 
              dataKey="month" 
              stroke={chartTheme.axis.stroke}
              fontSize={12}
            />
            <YAxis 
              stroke={chartTheme.axis.stroke}
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: chartTheme.legend.color }}
            />
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
