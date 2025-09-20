import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RevenueData } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import { useChartTheme } from '../hooks/useChartTheme';
import ChartNoData from './ChartNoData';
import Dropdown from './Dropdown';

interface RevenueChartProps {
  data: RevenueData[];
  availableYears?: number[];
}

/**
 * Renders a modern line chart with glassmorphism styling displaying revenue and expenses trends.
 */
const RevenueChart: React.FC<RevenueChartProps> = ({ availableYears = [2021, 2022, 2023, 2024] }) => {
  const { chartTheme } = useChartTheme();
  const [startYear, setStartYear] = useState(availableYears[0] || 2021);
  const [endYear, setEndYear] = useState(availableYears[availableYears.length - 1] || 2024);

  // Generate year options from available years
  const yearOptions = useMemo(() => {
    return availableYears.map(year => ({
      value: year.toString(),
      label: year.toString()
    }));
  }, [availableYears]);

  // Generate dynamic data based on selected range
  const chartData = useMemo(() => {
    if (startYear === endYear) {
      // Same year selected - show months
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      return months.map((month) => {
        const baseRevenue = 8000000 + Math.random() * 4000000;
        const baseExpenses = 6000000 + Math.random() * 3000000;
        
        return {
          date: month,
          revenue: Math.round(baseRevenue),
          expenses: Math.round(baseExpenses),
          netIncome: Math.round(baseRevenue - baseExpenses)
        };
      });
    } else {
      // Different years selected - show years
      const years = [];
      const start = startYear || 2021;
      const end = endYear || 2024;
      for (let year = start; year <= end; year++) {
        const baseRevenue = 95000000 + Math.random() * 20000000;
        const baseExpenses = 75000000 + Math.random() * 15000000;
        
        years.push({
          date: year.toString(),
          revenue: Math.round(baseRevenue),
          expenses: Math.round(baseExpenses),
          netIncome: Math.round(baseRevenue - baseExpenses)
        });
      }
      return years;
    }
  }, [startYear, endYear]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Revenue & Expenses Trend</h2>
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
          <p className="font-semibold mb-3 text-white text-center">
            {(startYear || 2021) === (endYear || 2024) ? `${label} ${startYear || 2021}` : label}
          </p>
          <div className="space-y-2">
            {payload.map((entry, index: number) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
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
    <div className="chart-container group">
      {/* Title and Dropdowns in Same Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="flex-shrink-0">
          <h2 className="mobile-heading-scale font-bold gradient-text">
            Operating Margin Trend
          </h2>
        </div>
        
        {/* Year Range Dropdowns */}
        <div className="flex flex-row items-center gap-3 lg:flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-white/80 font-medium text-sm whitespace-nowrap">Start:</span>
            <div className="min-w-[100px]">
              <Dropdown
                options={yearOptions}
                value={(startYear || 2021).toString()}
                onChange={(value) => {
                  const newStartYear = parseInt(value);
                  setStartYear(newStartYear);
                  // Ensure end year is not before start year
                  if (newStartYear > (endYear || 2024)) {
                    setEndYear(newStartYear);
                  }
                }}
                placeholder="Start Year"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-white/80 font-medium text-sm whitespace-nowrap">End:</span>
            <div className="min-w-[100px]">
              <Dropdown
                options={yearOptions.filter(year => parseInt(year.value) >= (startYear || 2021))}
                value={(endYear || 2024).toString()}
                onChange={(value) => setEndYear(parseInt(value))}
                placeholder="End Year"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue, Expenses, and Net Income Area Chart */}
      <div className="h-64 sm:h-80 lg:h-96 group-hover:scale-[1.01] transition-transform duration-300 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              {/* Gradient definitions for lines */}
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="netIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
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
              padding={{ left: 0, right: 12 }}
            />
            <YAxis 
              stroke={chartTheme.axis.stroke}
              fontSize={12}
              fontWeight={500}
              axisLine={true}
              tickLine={true}
              tick={{ fill: chartTheme.axis.stroke, fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              // width={0}
              tickCount={6}
              domain={[0, 'dataMax + 2000000']}
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
                      {payload?.map((entry, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
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
            
            {/* Revenue Area with enhanced styling */}
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              name="Revenue"
              dot={{ 
                fill: '#10b981', 
                strokeWidth: 0, 
                r: 5,
                filter: 'drop-shadow(0px 2px 4px rgba(16, 185, 129, 0.3))'
              }}
              activeDot={{ 
                r: 8, 
                fill: '#10b981', 
                stroke: 'rgba(255, 255, 255, 0.8)', 
                strokeWidth: 3,
                filter: 'drop-shadow(0px 4px 8px rgba(16, 185, 129, 0.5))'
              }}
            />
            
            {/* Expenses Area */}
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444"
              strokeWidth={3}
              fill="url(#expenseGradient)"
              name="Expenses"
              dot={{ 
                fill: '#ef4444', 
                strokeWidth: 0, 
                r: 5,
                filter: 'drop-shadow(0px 2px 4px rgba(239, 68, 68, 0.3))'
              }}
              activeDot={{ 
                r: 8, 
                fill: '#ef4444', 
                stroke: 'rgba(255, 255, 255, 0.8)', 
                strokeWidth: 3,
                filter: 'drop-shadow(0px 4px 8px rgba(239, 68, 68, 0.5))'
              }}
            />
            
            {/* Net Income Area */}
            <Area 
              type="monotone" 
              dataKey="netIncome" 
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#netIncomeGradient)"
              name="Net Income"
              dot={{ 
                fill: '#3b82f6', 
                strokeWidth: 0, 
                r: 5,
                filter: 'drop-shadow(0px 2px 4px rgba(59, 130, 246, 0.3))'
              }}
              activeDot={{ 
                r: 8, 
                fill: '#3b82f6', 
                stroke: 'rgba(255, 255, 255, 0.8)', 
                strokeWidth: 3,
                filter: 'drop-shadow(0px 4px 8px rgba(59, 130, 246, 0.5))'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Redesigned Performance Insight Section - Card Style */}
      <div className="mt-6">
        <div className="glass-card rounded-xl mobile-card-padding bg-gradient-to-r from-green-500/5 to-blue-500/5 border border-green-500/30">
          <div className="performance-insight-container">
            <div className="performance-insight-header">
              <div style={{ 
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)'
              }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="performance-insight-title">Performance Insights</span>
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
                <div className="performance-insight-card-value">$125.2M</div>
                <div className="performance-insight-card-label">Peak Revenue</div>
                <div className="performance-insight-card-context">June 2023</div>
              </div>
              <div className="performance-insight-card blue">
                <div className="performance-insight-card-value">+15.8%</div>
                <div className="performance-insight-card-label">Growth Rate</div>
                <div className="performance-insight-card-context">Year over Year</div>
              </div>
              <div className="performance-insight-card green">
                <div className="performance-insight-card-value">18.3%</div>
                <div className="performance-insight-card-label">Profit Margin</div>
                <div className="performance-insight-card-context">Current Period</div>
              </div>
              <div className="performance-insight-card cyan">
                <div className="performance-insight-card-value">92.1%</div>
                <div className="performance-insight-card-label">Efficiency</div>
                <div className="performance-insight-card-context">Overall Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
