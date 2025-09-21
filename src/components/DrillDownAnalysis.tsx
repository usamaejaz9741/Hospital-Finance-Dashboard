import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { HospitalData } from '../types/finance';
import { logger } from '../utils/logger';
import { formatCurrency } from '../utils/formatters';
import { useChartTheme } from '../hooks/useChartTheme';

/**
 * Props for the DrillDownAnalysis component
 * 
 * @interface DrillDownAnalysisProps
 * @category Enhanced Financial Components
 * @since 2.0.0
 */
interface DrillDownAnalysisProps {
  /** Hospital data for analysis */
  data: HospitalData;
  
  /** Callback when drill-down level changes */
  onDrillDown?: (level: string, category: string) => void;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Drill-Down Analysis Component
 * 
 * Provides comprehensive drill-down capabilities for all financial metrics,
 * allowing users to explore data at multiple levels of granularity.
 * 
 * Features:
 * - Multi-level drill-down navigation
 * - Interactive data exploration
 * - Detailed breakdowns by category
 * - Time-series analysis
 * - Comparative analysis
 * - Export capabilities
 * 
 * @param {DrillDownAnalysisProps} props - Component properties
 * @returns {JSX.Element} Drill-down analysis component
 * 
 * @example
 * ```tsx
 * <DrillDownAnalysis
 *   data={hospitalData}
 *   onDrillDown={(level, category) => console.log('Drilled down:', level, category)}
 * />
 * ```
 */
const DrillDownAnalysis: React.FC<DrillDownAnalysisProps> = ({
  data,
  onDrillDown,
  className = ''
}) => {
  const { chartTheme } = useChartTheme();
  const [drillDownLevel, setDrillDownLevel] = useState<string>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  // Calculate drill-down data based on current level
  const drillDownData = useMemo(() => {
    switch (drillDownLevel) {
      case 'financial-metrics':
        return data.financialMetrics.map(metric => ({
          name: metric.title,
          value: metric.value,
          change: metric.change,
          changeType: metric.changeType,
          format: metric.format,
          id: metric.id
        }));

      case 'department-analysis':
        return data.departmentFinances.map(dept => ({
          name: dept.department,
          revenue: dept.revenue,
          expenses: dept.expenses,
          profit: dept.profit,
          margin: dept.profitMargin
        }));

      case 'expense-breakdown':
        return data.expenseBreakdown.map(expense => ({
          name: expense.category,
          amount: expense.amount,
          percentage: expense.percentage,
          color: expense.color
        }));

      case 'revenue-trends':
        return data.revenueData.map(revenue => ({
          month: revenue.month,
          revenue: revenue.revenue,
          expenses: revenue.expenses,
          netIncome: revenue.netIncome
        }));

      case 'cash-flow':
        return data.cashFlowData.map(cashFlow => ({
          period: cashFlow.date,
          operating: cashFlow.operatingCashFlow,
          investing: cashFlow.investingCashFlow,
          financing: cashFlow.financingCashFlow,
          net: cashFlow.netCashFlow
        }));

      default:
        return [];
    }
  }, [drillDownLevel, data]);

  // Calculate summary statistics for current drill-down level
  const summaryStats = useMemo(() => {
    switch (drillDownLevel) {
      case 'financial-metrics':
        const totalValue = data.financialMetrics.reduce((sum, metric) => sum + metric.value, 0);
        const avgChange = data.financialMetrics.reduce((sum, metric) => sum + metric.change, 0) / data.financialMetrics.length;
        return {
          totalValue,
          avgChange,
          metricCount: data.financialMetrics.length
        };

      case 'department-analysis':
        const totalRevenue = data.departmentFinances.reduce((sum, dept) => sum + dept.revenue, 0);
        const totalExpenses = data.departmentFinances.reduce((sum, dept) => sum + dept.expenses, 0);
        const totalProfit = data.departmentFinances.reduce((sum, dept) => sum + dept.profit, 0);
        return {
          totalRevenue,
          totalExpenses,
          totalProfit,
          departmentCount: data.departmentFinances.length
        };

      case 'expense-breakdown':
        const totalExpenseAmount = data.expenseBreakdown.reduce((sum, expense) => sum + expense.amount, 0);
        const avgPercentage = data.expenseBreakdown.reduce((sum, expense) => sum + expense.percentage, 0) / data.expenseBreakdown.length;
        return {
          totalExpenses: totalExpenseAmount,
          avgPercentage,
          categoryCount: data.expenseBreakdown.length
        };

      default:
        return {};
    }
  }, [drillDownLevel, data]);

  // Handle drill-down navigation
  const handleDrillDown = (level: string, category: string = '') => {
    setDrillDownLevel(level);
    setSelectedCategory(category);
    onDrillDown?.(level, category);
    
    logger.info('Drill-down navigation', {
      context: 'DrillDownAnalysis',
      data: { level, category, previousLevel: drillDownLevel }
    });
  };

  // Handle metric selection
  const handleMetricSelect = (metricId: string) => {
    // setSelectedMetric(metricId);
    setDrillDownLevel('metric-detail');
    
    logger.info('Metric selected for drill-down', {
      context: 'DrillDownAnalysis',
      data: { metricId, selectedMetric: metricId }
    });
  };

  // Custom tooltip component matching your existing style
  interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
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
                  {formatCurrency(entry.value as number || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // Render overview dashboard
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { id: 'financial-metrics', title: 'Financial Metrics', description: 'Key performance indicators', icon: '📊', color: 'blue' },
        { id: 'department-analysis', title: 'Department Analysis', description: 'Departmental performance', icon: '🏥', color: 'green' },
        { id: 'expense-breakdown', title: 'Expense Breakdown', description: 'Detailed expense analysis', icon: '💰', color: 'amber' },
        { id: 'revenue-trends', title: 'Revenue Trends', description: 'Revenue over time', icon: '📈', color: 'purple' },
        { id: 'cash-flow', title: 'Cash Flow Analysis', description: 'Cash flow patterns', icon: '💸', color: 'cyan' },
        { id: 'patient-metrics', title: 'Patient Metrics', description: 'Patient volume analysis', icon: '👥', color: 'orange' }
      ].map(item => (
        <div
          key={item.id}
          className="glass-card rounded-xl mobile-card-padding cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border border-white/20 hover:border-white/30"
          onClick={() => handleDrillDown(item.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDrillDown(item.id);
            }
          }}
          aria-label={`Drill down into ${item.title}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold gradient-text">{item.title}</h3>
            <div className={`performance-insight-header-icon ${item.color}`} aria-hidden="true">
              <span className="text-lg">{item.icon}</span>
            </div>
          </div>
          <p className="text-white/80 text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  );

  // Render financial metrics drill-down
  const renderFinancialMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="performance-insight-card blue">
          <div className="performance-insight-card-value">{formatCurrency(summaryStats.totalValue || 0)}</div>
          <div className="performance-insight-card-label">Total Value</div>
          <div className="performance-insight-card-context">All Metrics</div>
        </div>
        <div className="performance-insight-card green">
          <div className="performance-insight-card-value">{formatPercentage(summaryStats.avgChange || 0)}</div>
          <div className="performance-insight-card-label">Average Change</div>
          <div className="performance-insight-card-context">YoY Growth</div>
        </div>
        <div className="performance-insight-card purple">
          <div className="performance-insight-card-value">{summaryStats.metricCount || 0}</div>
          <div className="performance-insight-card-label">Metrics Count</div>
          <div className="performance-insight-card-context">Total KPIs</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drillDownData.map((metric: any) => (
          <div
            key={metric.id}
            className="glass-card rounded-xl mobile-card-padding cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border border-white/20 hover:border-white/30"
            onClick={() => handleMetricSelect(metric.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleMetricSelect(metric.id);
              }
            }}
            aria-label={`Select ${metric.name} for detailed analysis`}
          >
            <h3 className="text-lg font-semibold gradient-text mb-2">{metric.name}</h3>
            <p className="text-2xl font-bold text-white mb-2">
              {formatCurrency(metric.value)}
            </p>
            <p className={`text-sm ${metric.changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercentage(metric.change)} {metric.changeType}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  // Render department analysis
  const renderDepartmentAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="performance-insight-card blue">
          <div className="performance-insight-card-value">{formatCurrency(summaryStats.totalRevenue || 0)}</div>
          <div className="performance-insight-card-label">Total Revenue</div>
          <div className="performance-insight-card-context">All departments</div>
        </div>
        <div className="performance-insight-card red">
          <div className="performance-insight-card-value">{formatCurrency(summaryStats.totalExpenses || 0)}</div>
          <div className="performance-insight-card-label">Total Expenses</div>
          <div className="performance-insight-card-context">All departments</div>
        </div>
        <div className="performance-insight-card green">
          <div className="performance-insight-card-value">{formatCurrency(summaryStats.totalProfit || 0)}</div>
          <div className="performance-insight-card-label">Total Profit</div>
          <div className="performance-insight-card-context">All departments</div>
        </div>
      </div>

      <div className="h-64 sm:h-80 lg:h-96 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={drillDownData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid.stroke} />
            <XAxis 
              dataKey="name" 
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
            <Bar dataKey="revenue" fill={chartTheme.colors.primary} name="Revenue" radius={[2, 2, 0, 0]} />
            <Bar dataKey="expenses" fill={chartTheme.colors.danger} name="Expenses" radius={[2, 2, 0, 0]} />
            <Bar dataKey="profit" fill={chartTheme.colors.success} name="Profit" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // Render expense breakdown
  const renderExpenseBreakdown = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="performance-insight-card blue">
          <div className="performance-insight-card-value">{formatCurrency(summaryStats.totalExpenses || 0)}</div>
          <div className="performance-insight-card-label">Total Expenses</div>
          <div className="performance-insight-card-context">All categories</div>
        </div>
        <div className="performance-insight-card purple">
          <div className="performance-insight-card-value">{formatPercentage(summaryStats.avgPercentage || 0)}</div>
          <div className="performance-insight-card-label">Average %</div>
          <div className="performance-insight-card-context">Category average</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={drillDownData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="amount"
            >
              {drillDownData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload?.[0]?.payload;
                  return (
                    <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
                      <p className="font-semibold mb-3 text-white text-center">{data.name}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between space-x-4">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-sm" 
                              style={{ backgroundColor: data.color }}
                            />
                            <span className="text-sm text-white/80">Amount:</span>
                          </div>
                          <span className="font-semibold text-white">
                            {formatCurrency(data.value)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                          <span className="text-sm text-white/80">Percentage:</span>
                          <span className="font-semibold text-white">
                            {data.percentage?.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              wrapperStyle={{
                position: 'absolute',
                bottom: '-5px',
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
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-4">
          {drillDownData.map((expense: any) => (
            <div key={expense.name} className="glass-card rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-medium">{expense.name}</h4>
                <span className="text-white font-bold">{formatCurrency(expense.amount)}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${expense.percentage}%`,
                    backgroundColor: expense.color
                  }}
                />
              </div>
              <p className="text-sm text-white/80 mt-1">{formatPercentage(expense.percentage)} of total</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render revenue trends
  const renderRevenueTrends = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={drillDownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
                    <p className="font-semibold mb-3 text-white text-center">{label}</p>
                    <div className="space-y-2">
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between space-x-4">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-sm" 
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm text-white/80">{entry.name}:</span>
                          </div>
                          <span className="font-semibold text-white">
                            {formatCurrency(entry.value as number || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            wrapperStyle={{
              position: 'absolute',
              bottom: '-5px',
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
          <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue" />
          <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
          <Line type="monotone" dataKey="netIncome" stroke="#3B82F6" strokeWidth={2} name="Net Income" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  // Render cash flow analysis
  const renderCashFlow = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={drillDownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="period" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
                    <p className="font-semibold mb-3 text-white text-center">{label}</p>
                    <div className="space-y-2">
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between space-x-4">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-sm" 
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm text-white/80">{entry.name}:</span>
                          </div>
                          <span className="font-semibold text-white">
                            {formatCurrency(entry.value as number || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
            cursor={{
              fill: 'rgba(255, 255, 255, 0.1)',
              stroke: 'rgba(255, 255, 255, 0.2)',
              strokeWidth: 1
            }}
          />
          <Legend 
            wrapperStyle={{
              position: 'absolute',
              bottom: '-5px',
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
          <Bar dataKey="operating" fill="#10B981" name="Operating" />
          <Bar dataKey="investing" fill="#F59E0B" name="Investing" />
          <Bar dataKey="financing" fill="#8B5CF6" name="Financing" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  // Render current drill-down content
  const renderDrillDownContent = () => {
    switch (drillDownLevel) {
      case 'financial-metrics': return renderFinancialMetrics();
      case 'department-analysis': return renderDepartmentAnalysis();
      case 'expense-breakdown': return renderExpenseBreakdown();
      case 'revenue-trends': return renderRevenueTrends();
      case 'cash-flow': return renderCashFlow();
      default: return renderOverview();
    }
  };

  return (
    <div className={`drill-down-analysis ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
          <h2 className="mobile-heading-scale font-bold gradient-text">Drill-Down Analysis</h2>
          {drillDownLevel !== 'overview' && (
            <button
              onClick={() => handleDrillDown('overview')}
              className="btn-base btn-secondary btn-md"
              aria-label="Return to overview"
            >
              ← Back to Overview
            </button>
          )}
        </div>
        <p className="text-white/80">
          Explore detailed financial data at multiple levels of granularity
        </p>
      </div>

      {/* Breadcrumb Navigation */}
      {drillDownLevel !== 'overview' && (
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <button
              onClick={() => handleDrillDown('overview')}
              className="hover:text-white transition-colors duration-200"
              aria-label="Go to overview"
            >
              Overview
            </button>
            <span>›</span>
            <span className="text-white capitalize">
              {drillDownLevel.replace('-', ' ')}
            </span>
            {selectedCategory && (
              <>
                <span>›</span>
                <span className="text-white">{selectedCategory}</span>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Controls */}
      {drillDownLevel !== 'overview' && (
        <div className="flex flex-wrap gap-4 mb-8">
          {drillDownLevel === 'revenue-trends' && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTimeRange('monthly')}
                className={`btn-base btn-sm transition-all ${
                  timeRange === 'monthly'
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeRange('quarterly')}
                className={`btn-base btn-sm transition-all ${
                  timeRange === 'quarterly'
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                Quarterly
              </button>
              <button
                onClick={() => setTimeRange('yearly')}
                className={`btn-base btn-sm transition-all ${
                  timeRange === 'yearly'
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                Yearly
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="chart-container">
        {renderDrillDownContent()}
      </div>
    </div>
  );
};

export default DrillDownAnalysis;
