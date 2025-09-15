import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CashFlowData } from '../types/finance';
import { formatCurrency } from '../utils/formatters';

interface CashFlowChartProps {
  data: CashFlowData[];
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
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
          <p className="font-medium text-gray-900 mb-2">{label}</p>
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cash Flow Analysis</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
            <span>Operating</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-warning-500 rounded-full mr-2"></div>
            <span>Investing</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span>Financing</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
            <span>Net Cash Flow</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
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
            <Bar 
              dataKey="operatingCashFlow" 
              fill="#3b82f6" 
              name="Operating Cash Flow"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="investingCashFlow" 
              fill="#f59e0b" 
              name="Investing Cash Flow"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="financingCashFlow" 
              fill="#8b5cf6" 
              name="Financing Cash Flow"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="netCashFlow" 
              fill="#22c55e" 
              name="Net Cash Flow"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowChart;
