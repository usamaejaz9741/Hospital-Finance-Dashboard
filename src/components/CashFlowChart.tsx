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
        <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
          <p className="font-semibold mb-3 text-white text-center">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index: number) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-white/80">{entry.name}:</span>
                </div>
                <span className="font-semibold text-white">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
        <h2 className="mobile-heading-scale font-bold gradient-text">Cash Flow Analysis</h2>
      </div>
      
      <div className="h-64 sm:h-80 lg:h-96 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid.stroke} />
            <XAxis 
              dataKey="date" 
              stroke={chartTheme.axis.stroke}
              fontSize={12}
              fontWeight={500}
              axisLine={true}
              tickLine={true}
              tick={{ fill: chartTheme.axis.stroke, fontSize: 12 }}
              height={60}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis 
              stroke={chartTheme.axis.stroke}
              fontSize={12}
              fontWeight={500}
              axisLine={true}
              tickLine={true}
              tick={{ fill: chartTheme.axis.stroke, fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              // width={95}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{
                fill: chartTheme.cursor.fill,
                stroke: chartTheme.cursor.stroke,
                strokeWidth: 1
              }}
            />
            <Legend 
              wrapperStyle={{
                position: 'absolute',
                bottom: '15px',
                left: '0',
                right: '0',
                width: '100%',
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              content={({ payload }) => (
                <div className="w-full flex justify-center">
                  <div className="chart-legend-container">
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                      {payload?.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-sm flex-shrink-0" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="legend-text text-sm font-medium whitespace-nowrap">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            />
            <Bar 
              dataKey="operatingCashFlow" 
              fill={chartTheme.colors.success} 
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
      
      {/* Redesigned Performance Insight Section - Card Style */}
      <div className="mt-6">
        <div className="glass-card rounded-xl mobile-card-padding bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/30">
          <div className="performance-insight-container">
            <div className="performance-insight-header">
              <div style={{ 
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)'
              }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="performance-insight-title">Cash Flow Insights</span>
              {/* AI Indicator - Button Style */}
              <button className="ml-2 btn-base btn-primary btn-sm" style={{ padding: '4px 8px', fontSize: 'var(--font-size-xs)', borderRadius: '4px', height: 'auto', minHeight: 'unset' }} aria-label="AI-powered insights">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                </svg>
                <span className="ml-1 text-xs font-medium">AI</span>
              </button>
            </div>
            <div className="performance-insight-grid">
              <div className="performance-insight-card amber">
                <div className="performance-insight-card-value">$8.2M</div>
                <div className="performance-insight-card-label">Operating Flow</div>
                <div className="performance-insight-card-context">Strong Performance</div>
              </div>
              <div className="performance-insight-card blue">
                <div className="performance-insight-card-value">$5.1M</div>
                <div className="performance-insight-card-label">Net Cash Flow</div>
                <div className="performance-insight-card-context">Positive Trend</div>
              </div>
              <div className="performance-insight-card red">
                <div className="performance-insight-card-value">-$2.8M</div>
                <div className="performance-insight-card-label">Investing Flow</div>
                <div className="performance-insight-card-context">Capital Expansion</div>
              </div>
              <div className="performance-insight-card green">
                <div className="performance-insight-card-value">$1.2M</div>
                <div className="performance-insight-card-label">Financing Flow</div>
                <div className="performance-insight-card-context">Debt Management</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowChart;
