import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExpenseBreakdown } from '../types/finance';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface ExpensePieChartProps {
  data: ExpenseBreakdown[];
}

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ data }) => {
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
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{data.category}</p>
          <p className="text-sm text-gray-600">
            Amount: {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-gray-600">
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
        <div className="grid grid-cols-2 gap-2 text-sm">
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 truncate">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Breakdown</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: {formatCurrency(data.reduce((sum, item) => sum + item.amount, 0))}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              outerRadius={80}
              innerRadius={40}
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
