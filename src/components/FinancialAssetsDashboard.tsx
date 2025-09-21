import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { FinancialAssets, BondRatings } from '../types/finance';
import { logger } from '../utils/logger';

/**
 * Props for the FinancialAssetsDashboard component
 * 
 * @interface FinancialAssetsDashboardProps
 * @category Enhanced Financial Components
 * @since 2.0.0
 */
interface FinancialAssetsDashboardProps {
  /** Financial assets breakdown data */
  assets: FinancialAssets;
  
  /** Bond ratings and credit information */
  bondRatings: BondRatings;
  
  /** Historical assets data for trend analysis */
  historicalData?: Array<{
    year: string;
    assets: FinancialAssets;
  }>;
  
  /** Callback when asset category is selected */
  onAssetSelect?: (category: string) => void;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Financial Assets Dashboard Component
 * 
 * Provides comprehensive analysis of financial assets including cash position,
 * investments, receivables, and days cash on hand calculations.
 * 
 * Features:
 * - Complete asset breakdown by type
 * - Days cash on hand calculation and monitoring
 * - Bond ratings and credit analysis
 * - Historical trend analysis
 * - Interactive asset allocation visualization
 * - Liquidity risk assessment
 * 
 * @param {FinancialAssetsDashboardProps} props - Component properties
 * @returns {JSX.Element} Financial assets dashboard component
 * 
 * @example
 * ```tsx
 * <FinancialAssetsDashboard
 *   assets={financialAssets}
 *   bondRatings={bondRatings}
 *   historicalData={historicalAssetsData}
 *   onAssetSelect={(category) => console.log('Selected:', category)}
 * />
 * ```
 */
const FinancialAssetsDashboard: React.FC<FinancialAssetsDashboardProps> = ({
  assets,
  bondRatings,
  onAssetSelect,
  className = ''
}) => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'allocation' | 'liquidity' | 'ratings'>('allocation');

  // Calculate asset allocation percentages
  const assetAllocation = useMemo(() => {
    const total = assets.totalAssets;
    return [
      { name: 'Cash & Equivalents', value: assets.cashAndEquivalents, percentage: (assets.cashAndEquivalents / total) * 100, color: '#10B981' },
      { name: 'Short-term Investments', value: assets.shortTermInvestments, percentage: (assets.shortTermInvestments / total) * 100, color: '#3B82F6' },
      { name: 'Long-term Investments', value: assets.longTermInvestments, percentage: (assets.longTermInvestments / total) * 100, color: '#8B5CF6' },
      { name: 'Accounts Receivable', value: assets.accountsReceivable, percentage: (assets.accountsReceivable / total) * 100, color: '#F59E0B' },
      { name: 'Inventory', value: assets.inventory, percentage: (assets.inventory / total) * 100, color: '#EF4444' },
      { name: 'PP&E', value: assets.propertyPlantEquipment, percentage: (assets.propertyPlantEquipment / total) * 100, color: '#F97316' },
      { name: 'Other Assets', value: assets.otherAssets, percentage: (assets.otherAssets / total) * 100, color: '#EC4899' }
    ].filter(item => item.value > 0);
  }, [assets]);

  // Calculate liquidity metrics
  const liquidityMetrics = useMemo(() => {
    const liquidAssets = assets.cashAndEquivalents + assets.shortTermInvestments + assets.accountsReceivable;
    const totalLiabilities = assets.totalAssets * 0.6; // Estimated based on typical hospital debt ratios
    const currentRatio = liquidAssets / (totalLiabilities * 0.3); // Estimated current liabilities
    const quickRatio = (assets.cashAndEquivalents + assets.shortTermInvestments) / (totalLiabilities * 0.3);
    
    return {
      liquidAssets,
      liquidityRatio: (liquidAssets / assets.totalAssets) * 100,
      currentRatio,
      quickRatio,
      daysCashOnHand: assets.daysCashOnHand
    };
  }, [assets]);

  // Calculate credit health score
  const creditHealthScore = useMemo(() => {
    const ratings = [bondRatings.moodysRating, bondRatings.spRating, bondRatings.fitchRating];
    const ratingValues: { [key: string]: number } = {
      'AAA': 100, 'AA+': 95, 'AA': 90, 'AA-': 85, 'A+': 80, 'A': 75, 'A-': 70,
      'BBB+': 65, 'BBB': 60, 'BBB-': 55, 'BB+': 50, 'BB': 45, 'BB-': 40,
      'B+': 35, 'B': 30, 'B-': 25, 'CCC+': 20, 'CCC': 15, 'CCC-': 10,
      'CC': 5, 'C': 2, 'D': 0
    };
    
    const validRatings = ratings.filter(rating => rating && rating !== 'NR');
    if (validRatings.length === 0) return 0;
    
    const averageScore = validRatings.reduce((sum, rating) => {
      return sum + (ratingValues[rating] || 0);
    }, 0) / validRatings.length;
    
    return Math.round(averageScore);
  }, [bondRatings]);

  // Handle asset selection
  const handleAssetSelect = (category: string) => {
    setSelectedAsset(category);
    onAssetSelect?.(category);
    
    logger.info('Asset category selected', {
      context: 'FinancialAssetsDashboard',
      data: { category, selectedAsset: category }
    });
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };


  // Render asset allocation chart
  const renderAllocationChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={assetAllocation}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          onClick={(data) => handleAssetSelect(data.name)}
        >
          {assetAllocation.map((entry, index) => (
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
                <div className="grid grid-cols-3 gap-x-4 gap-y-2">
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
  );

  // Render liquidity chart
  const renderLiquidityChart = () => {
    const liquidityData = [
      { name: 'Days Cash on Hand', value: liquidityMetrics.daysCashOnHand, fill: '#10B981' },
      { name: 'Current Ratio', value: liquidityMetrics.currentRatio * 10, fill: '#3B82F6' },
      { name: 'Quick Ratio', value: liquidityMetrics.quickRatio * 10, fill: '#8B5CF6' },
      { name: 'Liquidity Ratio', value: liquidityMetrics.liquidityRatio, fill: '#F59E0B' }
    ];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={liquidityData}>
          <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
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
                            style={{ backgroundColor: '#8884d8' }}
                          />
                          <span className="text-sm text-white/80">Value:</span>
                        </div>
                        <span className="font-semibold text-white">
                          {data.name === 'Days Cash on Hand' ? `${Number(data.value).toFixed(0)} days` :
                           data.name.includes('Ratio') ? `${(Number(data.value) / 10).toFixed(2)}x` :
                           `${Number(data.value).toFixed(1)}%`}
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
        </RadialBarChart>
      </ResponsiveContainer>
    );
  };

  // Render ratings chart
  const renderRatingsChart = () => {
    const ratingsData = [
      { name: 'Moody\'s', rating: bondRatings.moodysRating, score: creditHealthScore },
      { name: 'S&P', rating: bondRatings.spRating, score: creditHealthScore },
      { name: 'Fitch', rating: bondRatings.fitchRating, score: creditHealthScore }
    ];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={ratingsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" domain={[0, 100]} />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload?.[0]?.payload;
                return (
                  <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
                    <p className="font-semibold mb-3 text-white text-center">{data?.name || 'Category'}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-sm" 
                            style={{ backgroundColor: '#8884d8' }}
                          />
                          <span className="text-sm text-white/80">Score:</span>
                        </div>
                        <span className="font-semibold text-white">
                          {Number(data.score).toFixed(0)}/100
                        </span>
                      </div>
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
          <Bar dataKey="score" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Render chart based on view mode
  const renderChart = () => {
    switch (viewMode) {
      case 'allocation': return renderAllocationChart();
      case 'liquidity': return renderLiquidityChart();
      case 'ratings': return renderRatingsChart();
      default: return renderAllocationChart();
    }
  };

  return (
    <div className={`chart-container ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
        <h2 className="mobile-heading-scale font-bold gradient-text">Financial Assets Dashboard</h2>
      </div>

      {/* Key Metrics */}
      <div className="performance-insight-grid mb-8">
        <div className="performance-insight-card green">
          <div className="performance-insight-card-value">{formatCurrency(assets.totalAssets)}</div>
          <div className="performance-insight-card-label">Total Assets</div>
          <div className="performance-insight-card-context">Total financial position</div>
        </div>

        <div className="performance-insight-card blue">
          <div className="performance-insight-card-value">{assets.daysCashOnHand.toFixed(0)}</div>
          <div className="performance-insight-card-label">Days Cash on Hand</div>
          <div className="performance-insight-card-context">
            {assets.daysCashOnHand > 90 ? 'Excellent' : assets.daysCashOnHand > 60 ? 'Good' : 'Monitor'}
          </div>
        </div>

        <div className="performance-insight-card red">
          <div className="performance-insight-card-value">{formatCurrency(liquidityMetrics.liquidAssets)}</div>
          <div className="performance-insight-card-label">Liquid Assets</div>
          <div className="performance-insight-card-context">
            {liquidityMetrics.liquidityRatio.toFixed(1)}% of total assets
          </div>
        </div>

        <div className="performance-insight-card amber">
          <div className="performance-insight-card-value">{creditHealthScore}/100</div>
          <div className="performance-insight-card-label">Credit Score</div>
          <div className="performance-insight-card-context">
            {creditHealthScore > 80 ? 'Excellent' : creditHealthScore > 60 ? 'Good' : 'Monitor'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('allocation')}
            className={`btn-base btn-sm transition-all ${
              viewMode === 'allocation'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Asset Allocation
          </button>
          <button
            onClick={() => setViewMode('liquidity')}
            className={`btn-base btn-sm transition-all ${
              viewMode === 'liquidity'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Liquidity Metrics
          </button>
          <button
            onClick={() => setViewMode('ratings')}
            className={`btn-base btn-sm transition-all ${
              viewMode === 'ratings'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Credit Ratings
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-container mb-8">
        <h3 className="text-xl font-semibold gradient-text mb-4">
          {viewMode === 'allocation' && 'Asset Allocation'}
          {viewMode === 'liquidity' && 'Liquidity Analysis'}
          {viewMode === 'ratings' && 'Credit Ratings Overview'}
        </h3>
        {renderChart()}
      </div>

      {/* Asset Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {assetAllocation.map((asset) => (
          <div
            key={asset.name}
            className={`
              glass-card rounded-xl mobile-card-padding
              border-2 transition-all duration-300 cursor-pointer
              hover:shadow-lg hover:scale-105
              ${selectedAsset === asset.name 
                ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                : 'border-white/20 hover:border-purple-500/50'
              }
            `}
            onClick={() => handleAssetSelect(asset.name)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleAssetSelect(asset.name);
              }
            }}
            aria-label={`Select ${asset.name} asset category`}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Value:</span>
                <span className="text-white font-medium">{formatCurrency(asset.value)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">% of Total:</span>
                <span className="text-purple-300 font-medium">{asset.percentage.toFixed(1)}%</span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${asset.percentage}%`,
                    backgroundColor: asset.color
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bond Ratings Section */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Bond Ratings & Credit Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="performance-insight-card blue rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Moody's</h4>
            <p className="text-2xl font-bold text-white mb-1">{bondRatings.moodysRating}</p>
            <p className="text-xs text-white/80">Last updated: {new Date(bondRatings.lastUpdated).toLocaleDateString()}</p>
          </div>

          <div className="performance-insight-card green rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">S&P</h4>
            <p className="text-2xl font-bold text-white mb-1">{bondRatings.spRating}</p>
            <p className="text-xs text-white/80">Last updated: {new Date(bondRatings.lastUpdated).toLocaleDateString()}</p>
          </div>

          <div className="performance-insight-card purple rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Fitch</h4>
            <p className="text-2xl font-bold text-white mb-1">{bondRatings.fitchRating}</p>
            <p className="text-xs text-white/80">Last updated: {new Date(bondRatings.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="performance-insight-card orange rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Credit Outlook</h4>
            <p className="text-lg font-semibold text-white mb-1">
              {bondRatings.outlook.toUpperCase()}
            </p>
          </div>

          <div className="performance-insight-card cyan rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Debt Outstanding</h4>
            <p className="text-lg font-semibold text-white mb-1">{formatCurrency(bondRatings.debtOutstanding)}</p>
          </div>
        </div>
      </div>

      {/* Liquidity Analysis */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Liquidity Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="performance-insight-card amber rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Current Ratio</h4>
            <p className="text-2xl font-bold text-white mb-1">{liquidityMetrics.currentRatio.toFixed(2)}x</p>
            <p className="text-xs text-white/80">Current assets / Current liabilities</p>
          </div>

          <div className="performance-insight-card purple rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Quick Ratio</h4>
            <p className="text-2xl font-bold text-white mb-1">{liquidityMetrics.quickRatio.toFixed(2)}x</p>
            <p className="text-xs text-white/80">Liquid assets / Current liabilities</p>
          </div>

          <div className="performance-insight-card pink rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Interest Coverage</h4>
            <p className="text-2xl font-bold text-white mb-1">{bondRatings.interestCoverageRatio.toFixed(1)}x</p>
            <p className="text-xs text-white/80">EBITDA / Interest expense</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAssetsDashboard;
