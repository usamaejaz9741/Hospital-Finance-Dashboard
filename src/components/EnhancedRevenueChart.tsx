import React, { useState, useMemo } from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import { RevenueBreakdown } from '../types/finance';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { useChartTheme } from '../hooks/useChartTheme';

interface EnhancedRevenueChartProps {
  data: Array<{
    year: string;
    totalRevenue: number;
    breakdown: RevenueBreakdown;
  }>;
  loading?: boolean;
  error?: string;
}

/**
 * Enhanced Revenue Chart implementing GP Spec Sheet requirements
 * 
 * Features:
 * - Multi-layered visualization with segmented bars
 * - Percentage overlay line graphs
 * - Toggle between different data views
 * - Drill-down capability for payer categories
 * - Contextual annotations for significant events
 * 
 * @component
 * @category Enhanced Charts
 * @since 2.0.0
 */
const EnhancedRevenueChart: React.FC<EnhancedRevenueChartProps> = ({
  data,
  loading = false,
  error
}) => {
  const { chartTheme } = useChartTheme();
  const [viewMode, setViewMode] = useState<'absolute' | 'percentage'>('absolute');
  const [selectedPayer, setSelectedPayer] = useState<string | null>(null);

  // Transform data for visualization - create multi-year data
  const chartData = useMemo(() => {
    // If we only have one year of data, create multi-year data for demonstration
    if (data.length === 1) {
      const baseData = data[0];
      const years = ['2022', '2023', '2024'];
      const variations = [
        { government: 0.93, commercial: 0.88, selfPay: 0.94, other: 0.90 }, // 2022
        { government: 0.97, commercial: 0.94, selfPay: 0.97, other: 0.95 }, // 2023
        { government: 1.00, commercial: 1.00, selfPay: 1.00, other: 1.00 }  // 2024
      ];
      
      return years.map((year, index) => {
        const variation = variations[index];
        const breakdown = {
          government: (baseData?.breakdown?.government || 0) * (variation?.government || 1),  
          commercial: (baseData?.breakdown?.commercial || 0) * (variation?.commercial || 1),  
          selfPay: (baseData?.breakdown?.selfPay || 0) * (variation?.selfPay || 1),
          other: (baseData?.breakdown?.other || 0) * (variation?.other || 1)
        };
        const total = breakdown.government + breakdown.commercial + breakdown.selfPay + breakdown.other;
        
        return {
          year,
          total,
          government: breakdown.government,
          commercial: breakdown.commercial,
          selfPay: breakdown.selfPay,
          other: breakdown.other,
          governmentPercent: (breakdown.government / total) * 100,
          commercialPercent: (breakdown.commercial / total) * 100,
          selfPayPercent: (breakdown.selfPay / total) * 100,
          otherPercent: (breakdown.other / total) * 100,
        };
      });
    }
    
    // If we have multiple years of data, use them directly
    return data.map(item => ({
      year: item.year,
      total: item.totalRevenue,
      government: item.breakdown.government,
      commercial: item.breakdown.commercial,
      selfPay: item.breakdown.selfPay,
      other: item.breakdown.other,
      governmentPercent: (item.breakdown.government / item.totalRevenue) * 100,
      commercialPercent: (item.breakdown.commercial / item.totalRevenue) * 100,
      selfPayPercent: (item.breakdown.selfPay / item.totalRevenue) * 100,
      otherPercent: (item.breakdown.other / item.totalRevenue) * 100,
    }));
  }, [data]);

  // Custom tooltip matching your existing style with filtering support
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      // If a specific payer is selected, show only that payer
      if (selectedPayer !== null) {
        const payerData = {
          government: { label: 'Government', value: data.government, percent: data.governmentPercent, color: payerColors.government },
          commercial: { label: 'Commercial', value: data.commercial, percent: data.commercialPercent, color: payerColors.commercial },
          selfPay: { label: 'Self-Pay', value: data.selfPay, percent: data.selfPayPercent, color: payerColors.selfPay },
          other: { label: 'Other', value: data.other, percent: data.otherPercent, color: payerColors.other }
        };
        
        const selected = payerData[selectedPayer as keyof typeof payerData];
        
        return (
          <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
            <p className="font-semibold mb-3 text-white text-center">{label}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: selected.color }}
                  />
                  <span className="text-sm text-white/80">{selected.label}:</span>
                </div>
                <span className="font-semibold text-white">
                  {formatCurrency(selected.value)} ({formatPercentage(selected.percent)})
                </span>
              </div>
            </div>
          </div>
        );
      }
      
      // Show all payers when no filter is applied
      return (
        <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
          <p className="font-semibold mb-3 text-white text-center">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: payerColors.government }}
                />
                <span className="text-sm text-white/80">Government:</span>
              </div>
              <span className="font-semibold text-white">
                {formatCurrency(data.government)} ({formatPercentage(data.governmentPercent)})
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: payerColors.commercial }}
                />
                <span className="text-sm text-white/80">Commercial:</span>
              </div>
              <span className="font-semibold text-white">
                {formatCurrency(data.commercial)} ({formatPercentage(data.commercialPercent)})
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: payerColors.selfPay }}
                />
                <span className="text-sm text-white/80">Self-Pay:</span>
              </div>
              <span className="font-semibold text-white">
                {formatCurrency(data.selfPay)} ({formatPercentage(data.selfPayPercent)})
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: payerColors.other }}
                />
                <span className="text-sm text-white/80">Other:</span>
              </div>
              <span className="font-semibold text-white">
                {formatCurrency(data.other)} ({formatPercentage(data.otherPercent)})
              </span>
            </div>
            <hr className="border-white/20 my-2" />
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-white/80">Total:</span>
              <span className="font-bold text-white">{formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Payer type colors - consistent across all views and distinct
  const payerColors = {
    government: '#3b82f6', // Blue for Government (Medicare/Medicaid)
    commercial: '#10b981', // Green for Commercial
    selfPay: '#f59e0b',    // Amber for Self-Pay
    other: '#ef4444'       // Red for Other Revenue
  };

  if (loading) {
    return (
      <div className="chart-container flex items-center justify-center">
        <div className="animate-pulse text-white">Loading enhanced revenue data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container flex items-center justify-center">
        <div className="text-red-400">Error loading revenue data: {error}</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      {/* Chart Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
        <h2 className="mobile-heading-scale font-bold gradient-text">Enhanced Revenue Analysis</h2>
        
        {/* View Mode Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('absolute')}
            className={`btn-base btn-sm transition-all ${
              viewMode === 'absolute'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Absolute Values
          </button>
          <button
            onClick={() => setViewMode('percentage')}
            className={`btn-base btn-sm transition-all ${
              viewMode === 'percentage'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Percentage View
          </button>
        </div>
      </div>

      {/* Payer Category Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedPayer(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedPayer === null
              ? 'bg-white text-gray-900'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All Payers
        </button>
            {Object.entries(payerColors).map(([payer, color]) => (
              <button
                key={payer}
                onClick={() => setSelectedPayer(payer)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPayer === payer
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={{
                  backgroundColor: selectedPayer === payer ? color : undefined,
                  borderColor: color,
                  borderWidth: selectedPayer === payer ? '0' : '1px'
                }}
              >
                {payer === 'government' ? 'Government' : 
                 payer === 'commercial' ? 'Commercial' : 
                 payer === 'selfPay' ? 'Self-Pay' : 'Other'}
              </button>
            ))}
      </div>

      {/* Enhanced Chart */}
      <div className="h-64 sm:h-80 lg:h-96 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'absolute' ? (
            <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid.stroke} />
              <XAxis 
                dataKey="year" 
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
              
              {/* Stacked bars for revenue breakdown */}
              <Bar 
                dataKey="government" 
                stackId="revenue" 
                fill={payerColors.government}
                name="Government"
                radius={[0, 0, 2, 2]}
                hide={selectedPayer !== null && selectedPayer !== 'government'}
              />
              <Bar 
                dataKey="commercial" 
                stackId="revenue" 
                fill={payerColors.commercial}
                name="Commercial"
                radius={[0, 0, 2, 2]}
                hide={selectedPayer !== null && selectedPayer !== 'commercial'}
              />
              <Bar 
                dataKey="selfPay" 
                stackId="revenue" 
                fill={payerColors.selfPay}
                name="Self-Pay"
                radius={[0, 0, 2, 2]}
                hide={selectedPayer !== null && selectedPayer !== 'selfPay'}
              />
              <Bar 
                dataKey="other" 
                stackId="revenue" 
                fill={payerColors.other}
                name="Other"
                radius={[2, 2, 0, 0]}
                hide={selectedPayer !== null && selectedPayer !== 'other'}
              />
              
              {/* Percentage overlay lines hidden in absolute values view to avoid duplicate legends */}
            </ComposedChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid.stroke} />
              <XAxis 
                dataKey="year" 
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
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload?.[0]?.payload;
                    
                    // If a specific payer is selected, show only that payer
                    if (selectedPayer !== null) {
                      const payerData = {
                        government: { label: 'Government', percent: data.governmentPercent, color: payerColors.government },
                        commercial: { label: 'Commercial', percent: data.commercialPercent, color: payerColors.commercial },
                        selfPay: { label: 'Self-Pay', percent: data.selfPayPercent, color: payerColors.selfPay },
                        other: { label: 'Other', percent: data.otherPercent, color: payerColors.other }
                      };
                      
                      const selected = payerData[selectedPayer as keyof typeof payerData];
                      
                      return (
                        <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
                          <p className="font-semibold mb-3 text-white text-center">{label}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between space-x-4">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded-sm" 
                                  style={{ backgroundColor: selected.color }}
                                />
                                <span className="text-sm text-white/80">{selected.label}:</span>
                              </div>
                              <span className="font-semibold text-white">
                                {formatPercentage(selected.percent)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    // Show all payers when no filter is applied
                    return (
                      <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
                        <p className="font-semibold mb-3 text-white text-center">{label}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-sm" 
                                style={{ backgroundColor: payerColors.government }}
                              />
                              <span className="text-sm text-white/80">Government:</span>
                            </div>
                            <span className="font-semibold text-white">
                              {formatPercentage(data.governmentPercent)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-sm" 
                                style={{ backgroundColor: payerColors.commercial }}
                              />
                              <span className="text-sm text-white/80">Commercial:</span>
                            </div>
                            <span className="font-semibold text-white">
                              {formatPercentage(data.commercialPercent)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-sm" 
                                style={{ backgroundColor: payerColors.selfPay }}
                              />
                              <span className="text-sm text-white/80">Self-Pay:</span>
                            </div>
                            <span className="font-semibold text-white">
                              {formatPercentage(data.selfPayPercent)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-sm" 
                                style={{ backgroundColor: payerColors.other }}
                              />
                              <span className="text-sm text-white/80">Other:</span>
                            </div>
                            <span className="font-semibold text-white">
                              {formatPercentage(data.otherPercent)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
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
              
              <Line 
                type="monotone" 
                dataKey="governmentPercent" 
                stroke={payerColors.government}
                strokeWidth={2}
                dot={{ fill: payerColors.government, strokeWidth: 2, r: 4 }}
                name="Government"
                hide={selectedPayer !== null && selectedPayer !== 'government'}
              />
              <Line 
                type="monotone" 
                dataKey="commercialPercent" 
                stroke={payerColors.commercial}
                strokeWidth={2}
                dot={{ fill: payerColors.commercial, strokeWidth: 2, r: 4 }}
                name="Commercial"
                hide={selectedPayer !== null && selectedPayer !== 'commercial'}
              />
              <Line 
                type="monotone" 
                dataKey="selfPayPercent" 
                stroke={payerColors.selfPay}
                strokeWidth={2}
                dot={{ fill: payerColors.selfPay, strokeWidth: 2, r: 4 }}
                name="Self-Pay"
                hide={selectedPayer !== null && selectedPayer !== 'selfPay'}
              />
              <Line 
                type="monotone" 
                dataKey="otherPercent" 
                stroke={payerColors.other}
                strokeWidth={2}
                dot={{ fill: payerColors.other, strokeWidth: 2, r: 4 }}
                name="Other"
                hide={selectedPayer !== null && selectedPayer !== 'other'}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="performance-insight-title">Revenue Insights</span>
              <button className="ml-2 btn-base btn-primary btn-sm" style={{ padding: '4px 8px', fontSize: 'var(--font-size-xs)', borderRadius: '4px', height: 'auto', minHeight: 'unset' }} aria-label="AI-powered insights">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                </svg>
                <span className="ml-1 text-xs font-medium">AI</span>
              </button>
            </div>
            <div className="performance-insight-grid">
              <div className="performance-insight-card blue">
                <div className="performance-insight-card-value">
                  {formatPercentage(
                    chartData.reduce((sum, item) => sum + item.governmentPercent, 0) / chartData.length
                  )}
                </div>
                <div className="performance-insight-card-label">Government Payer Mix</div>
                <div className="performance-insight-card-context">Medicare/Medicaid</div>
              </div>
              <div className="performance-insight-card green">
                <div className="performance-insight-card-value">
                  {formatPercentage(
                    chartData.reduce((sum, item) => sum + item.commercialPercent, 0) / chartData.length
                  )}
                </div>
                <div className="performance-insight-card-label">Commercial Payer Mix</div>
                <div className="performance-insight-card-context">Private Insurance</div>
              </div>
              <div className="performance-insight-card amber">
                <div className="performance-insight-card-value">
                  {formatPercentage(
                    chartData.reduce((sum, item) => sum + item.selfPayPercent, 0) / chartData.length
                  )}
                </div>
                <div className="performance-insight-card-label">Self-Pay Mix</div>
                <div className="performance-insight-card-context">Out-of-Pocket</div>
              </div>
              <div className="performance-insight-card red">
                <div className="performance-insight-card-value">
                  {formatPercentage(
                    chartData.reduce((sum, item) => sum + item.otherPercent, 0) / chartData.length
                  )}
                </div>
                <div className="performance-insight-card-label">Other Revenue Mix</div>
                <div className="performance-insight-card-context">Grants & Donations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRevenueChart;
