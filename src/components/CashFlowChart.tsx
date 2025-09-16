import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CashFlowData } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import { useChartTheme } from '../hooks/useChartTheme';

interface CashFlowChartProps {
  data: CashFlowData[];
}

/**
 * Renders a bar chart displaying cash flow analysis.
 *
 * @param {CashFlowChartProps} props The component props.
 * @param {CashFlowData[]} props.data The data to display in the chart.
 * @returns {React.ReactElement} The rendered bar chart.
 */
const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
  const { chartTheme } = useChartTheme();
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
          <p className="font-medium mb-2" style={{ color: chartTheme.tooltip.textColor }}>{label}</p>
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
    <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cash Flow Analysis</h2>
      </div>
      
      <div className="h-64 sm:h-80 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid.stroke} />
            <XAxis 
              dataKey="date" 
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
            <Bar 
              dataKey="operatingCashFlow" 
              fill={chartTheme.colors.primary} 
              name="Operating"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="investingCashFlow" 
              fill={chartTheme.colors.warning} 
              name="Investing"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="financingCashFlow" 
              fill={chartTheme.colors.secondary} 
              name="Financing"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="netCashFlow" 
              fill={chartTheme.colors.success} 
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
