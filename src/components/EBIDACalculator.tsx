import React, { useState, useMemo } from 'react';
import { EBIDAMetrics } from '../types/finance';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface EBIDACalculatorProps {
  data: EBIDAMetrics;
  historicalData?: Array<EBIDAMetrics & { year: string }>;
  loading?: boolean;
  error?: string;
}

/**
 * EBIDA Calculator component implementing GP Spec Sheet requirements
 * 
 * Features:
 * - Toggle between Operating Income and EBIDA views
 * - Historical trend analysis
 * - Year-over-year comparisons
 * - Visual indicators for financial health
 * 
 * @component
 * @category Enhanced Financial Analysis
 * @since 2.0.0
 */
const EBIDACalculator: React.FC<EBIDACalculatorProps> = ({
  data,
  historicalData = [],
  loading = false,
  error
}) => {
  const [viewMode, setViewMode] = useState<'operating' | 'ebida'>('ebida');

  // Calculate financial health indicators
  const financialHealth = useMemo(() => {
    const { operatingIncome, ebida, depreciation, interest } = data;
    
    // EBIDA margin calculation (EBIDA as percentage of total revenue approximation)
    // Using a more realistic calculation based on EBIDA vs total operating metrics
    const totalOperatingMetrics = Math.abs(operatingIncome) + Math.abs(depreciation) + Math.abs(interest);
    const ebidaMargin = totalOperatingMetrics > 0 ? (ebida / totalOperatingMetrics) * 100 : 0;
    
    // Interest coverage ratio (EBIDA / Interest Expense)
    const interestCoverage = interest > 0 ? ebida / interest : 0;
    
    // Operating efficiency (Operating Income / Total Revenue approximation)
    const operatingEfficiency = operatingIncome > 0 ? 'positive' : 'negative';
    
    return {
      ebidaMargin,
      interestCoverage,
      operatingEfficiency,
      isHealthy: ebida > 0 && interestCoverage > 2.5
    };
  }, [data]);

  // Historical trend analysis
  const trendAnalysis = useMemo(() => {
    if (historicalData.length < 2) return null;
    
    const sortedData = historicalData.sort((a, b) => a.year.localeCompare(b.year));
    const latest = sortedData[sortedData.length - 1];
    const previous = sortedData[sortedData.length - 2];
    
    const ebidaChange = (latest?.ebida || 0) - (previous?.ebida || 0);
    const ebidaChangePercent = previous?.ebida !== 0 ? (ebidaChange / Math.abs(previous?.ebida || 1)) * 100 : 0;
    
    return {
      ebidaChange,
      ebidaChangePercent,
      trend: ebidaChange > 0 ? 'improving' : 'declining',
      isSignificant: Math.abs(ebidaChangePercent) > 10
    };
  }, [historicalData]);

  if (loading) {
    return (
      <div className="chart-container flex items-center justify-center">
        <div className="animate-pulse text-white">Loading EBIDA calculations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container flex items-center justify-center">
        <div className="text-red-400">Error loading EBIDA data: {error}</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
        <h2 className="mobile-heading-scale font-bold gradient-text">EBIDA Analysis</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('operating')}
            className={`btn-base btn-sm transition-all ${
              viewMode === 'operating'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Operating Income
          </button>
          <button
            onClick={() => setViewMode('ebida')}
            className={`btn-base btn-sm transition-all ${
              viewMode === 'ebida'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            EBIDA
          </button>
        </div>
      </div>

      {/* Main Metrics Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Primary Metric */}
        <div className="performance-insight-card purple w-full text-center flex flex-col justify-center items-center rounded-xl">
          <div className="performance-insight-card-value text-3xl">
            {formatCurrency(viewMode === 'ebida' ? data.ebida : data.operatingIncome)}
          </div>
          <div className="performance-insight-card-label text-lg">
            {viewMode === 'ebida' ? 'EBIDA' : 'Operating Income'}
          </div>
          <div className="performance-insight-card-context text-base">
            {(viewMode === 'ebida' ? data.ebida : data.operatingIncome) >= 0 ? 'Positive' : 'Negative'}
          </div>
          {trendAnalysis && (
            <div className="flex items-center justify-center text-base mt-2">
              <span className={`mr-2 ${
                trendAnalysis.trend === 'improving' ? 'text-green-400' : 'text-red-400'
              }`}>
                {trendAnalysis.trend === 'improving' ? '↗' : '↘'}
              </span>
              <span className="text-white/80">
                {formatPercentage(Math.abs(trendAnalysis.ebidaChangePercent))} vs previous year
              </span>
            </div>
          )}
        </div>

        {/* Financial Health Indicator */}
        <div className="performance-insight-card green w-full rounded-xl">
          <div className="performance-insight-card-value text-2xl">
            {financialHealth.isHealthy ? '✓' : '⚠'}
          </div>
          <div className="performance-insight-card-label text-lg">Financial Health</div>
          <div className="performance-insight-card-context text-base">
            {financialHealth.isHealthy ? 'Healthy' : 'Needs Attention'}
          </div>
          
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-white/70">EBIDA Margin</span>
                <span className="text-sm text-white font-medium">
                  {formatPercentage(financialHealth.ebidaMargin)}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full ${
                    financialHealth.ebidaMargin > 15 ? 'bg-white' :
                    financialHealth.ebidaMargin > 8 ? 'bg-yellow-300' : 'bg-red-300'
                  }`}
                  style={{ width: `${Math.min(financialHealth.ebidaMargin * 2, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-white/70">Interest Coverage</span>
                <span className="text-sm text-white font-medium">
                  {financialHealth.interestCoverage.toFixed(1)}x
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full ${
                    financialHealth.interestCoverage > 2.5 ? 'bg-white' :
                    financialHealth.interestCoverage > 1.5 ? 'bg-yellow-300' : 'bg-red-300'
                  }`}
                  style={{ width: `${Math.min(financialHealth.interestCoverage * 25, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EBIDA Breakdown (when in EBIDA mode) */}
      {viewMode === 'ebida' && (
        <div className="glass-card rounded-xl p-6 border border-white/20 mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">EBIDA Calculation Breakdown</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">Operating Income</span>
              <span className="text-white font-medium">
                {formatCurrency(data.operatingIncome)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">+ Depreciation</span>
              <span className="text-white font-medium">
                +{formatCurrency(data.depreciation)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">+ Interest Expense</span>
              <span className="text-white font-medium">
                +{formatCurrency(data.interest)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-4 bg-gradient-to-r from-purple-600/30 to-purple-500/30 rounded-lg px-4 border border-purple-400/30 shadow-lg">
              <span className="text-white font-bold text-lg">= EBIDA</span>
              <span className="text-white font-bold text-xl">
                {formatCurrency(data.ebida)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="glass-card rounded-xl mobile-card-padding border border-white/20">
        <div className="performance-insight-container">
            <div className="performance-insight-header">
              <div style={{ 
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
              }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="performance-insight-title">Key Insights</span>
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
                {formatCurrency(data.ebida - data.operatingIncome)}
              </div>
              <div className="performance-insight-card-label">EBIDA vs Operating Income</div>
              <div className="performance-insight-card-context">Difference</div>
            </div>
            <div className="performance-insight-card green">
              <div className="performance-insight-card-value">
                {financialHealth.interestCoverage.toFixed(1)}x
              </div>
              <div className="performance-insight-card-label">Interest Coverage Ratio</div>
              <div className="performance-insight-card-context">Target: &gt;2.5x</div>
            </div>
            <div className="performance-insight-card purple">
              <div className="performance-insight-card-value">
                {formatCurrency(data.depreciation)}
              </div>
              <div className="performance-insight-card-label">Depreciation Impact</div>
              <div className="performance-insight-card-context">Added back</div>
            </div>
            <div className="performance-insight-card amber">
              <div className="performance-insight-card-value">
                {formatCurrency(data.interest)}
              </div>
              <div className="performance-insight-card-label">Interest Impact</div>
              <div className="performance-insight-card-context">Added back</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBIDACalculator;
