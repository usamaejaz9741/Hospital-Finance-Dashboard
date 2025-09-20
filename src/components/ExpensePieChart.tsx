import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExpenseBreakdown } from '../types/finance';
import { formatCurrency, formatPercentage } from '../utils/formatters';
// import { useChartTheme } from '../hooks/useChartTheme';
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
  // const { chartTheme } = useChartTheme();
  
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
          <h2 className="mobile-heading-scale font-bold gradient-text">Expense Breakdown</h2>
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
      <div className="chart-container">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
          <h2 className="mobile-heading-scale font-bold gradient-text">Expense Breakdown</h2>
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



  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload?.[0]?.payload) {
      const data = payload[0].payload;
      return (
        <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
          <div className="text-center">
            <p className="font-semibold text-white mb-2">{data.category}</p>
            <p className="text-2xl font-bold text-white mb-1">
              {formatCurrency(data.amount)}
            </p>
            <p className="text-sm text-white/70">
              {formatPercentage(data.percentage)} of total
            </p>
          </div>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="chart-container">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
        <h2 className="mobile-heading-scale font-bold gradient-text">Expense Breakdown</h2>
        <div className="lg:flex-shrink-0 flex justify-center lg:justify-start">
          {/* Highlighted Total */}
          <div className="glass-card rounded-lg px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 w-full lg:w-auto text-center lg:text-left">
            <span className="text-sm font-medium text-white/80">Total: </span>
            <span className="text-lg font-bold text-white">
              {formatCurrency(data.reduce((sum, item) => sum + item.amount, 0))}
            </span>
          </div>
        </div>
      </div>
      
      <div className="h-96 sm:h-96 lg:h-96 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
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
                justifyContent: 'center',
                paddingTop: '60px'
              }}
              content={() => (
                <div className="w-full flex justify-center">
                  <div className="chart-legend-container">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 sm:gap-y-3 sm:gap-x-6 items-center justify-items-center">
                      {data.map((entry, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="legend-text text-sm font-medium whitespace-nowrap">
                            {entry.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Redesigned Performance Insight Section - Card Style */}
      <div className="mt-6">
        <div className="glass-card rounded-xl mobile-card-padding bg-gradient-to-r from-blue-400/5 to-cyan-500/5 border border-blue-400/30">
          <div className="performance-insight-container">
            <div className="performance-insight-header">
              <div style={{ 
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)'
              }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                </svg>
              </div>
              <span className="performance-insight-title">Expense Insights</span>
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
                <div className="performance-insight-card-value">45%</div>
                <div className="performance-insight-card-label">Largest Category</div>
                <div className="performance-insight-card-context">Salaries & Benefits</div>
              </div>
              <div className="performance-insight-card red">
                <div className="performance-insight-card-value">+3.2%</div>
                <div className="performance-insight-card-label">Expense Growth</div>
                <div className="performance-insight-card-context">vs Last Year</div>
              </div>
              <div className="performance-insight-card green">
                <div className="performance-insight-card-value">$2.8M</div>
                <div className="performance-insight-card-label">Cost Savings</div>
                <div className="performance-insight-card-context">Efficiency Gains</div>
              </div>
              <div className="performance-insight-card cyan">
                <div className="performance-insight-card-value">87%</div>
                <div className="performance-insight-card-label">Budget Utilization</div>
                <div className="performance-insight-card-context">Well Managed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePieChart;
