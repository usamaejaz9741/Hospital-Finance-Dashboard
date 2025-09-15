import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RevenueData } from '../types/finance';
import { formatCurrency } from '../utils/formatters';

interface RevenueChartProps {
  data: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
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
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{`${label} 2024`}</p>
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
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
            <span>Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-danger-500 rounded-full mr-2"></div>
            <span>Expenses</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
            <span>Net Income</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Revenue"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={3}
              name="Expenses"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="netIncome" 
              stroke="#22c55e" 
              strokeWidth={3}
              name="Net Income"
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
