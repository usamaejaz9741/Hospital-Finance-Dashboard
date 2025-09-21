import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HospitalData } from '../types/finance';

/**
 * Props for the PeerComparison component
 * 
 * @interface PeerComparisonProps
 * @category Enhanced Financial Components
 * @since 2.0.0
 */
interface PeerComparisonProps {
  /** Current hospital data for comparison */
  currentHospitalData: HospitalData;
  
  /** Array of peer hospital data for comparison */
  peerHospitalData: HospitalData[];
  
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Peer Comparison Component
 * 
 * Provides comprehensive peer comparison analysis including financial metrics,
 * operational efficiency, and benchmarking against similar hospitals.
 * 
 * Features:
 * - Financial metrics benchmarking
 * - Operational efficiency comparison
 * - Peer ranking analysis
 * - Trend comparison over time
 * - Performance percentile rankings
 * - Interactive peer selection
 * 
 * @param {PeerComparisonProps} props - Component properties
 * @returns {JSX.Element} Peer comparison component
 * 
 * @example
 * ```tsx
 * <PeerComparison
 *   currentHospitalData={currentData}
 *   peerHospitalData={peerData}
 *   onPeerSelect={(hospitalId) => console.log('Selected:', hospitalId)}
 * />
 * ```
 */
const PeerComparison: React.FC<PeerComparisonProps> = ({
  currentHospitalData,
  peerHospitalData,
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('total-revenue');
  const [comparisonMode, setComparisonMode] = useState<'financial' | 'operational'>('financial');

  // Calculate peer comparison metrics
  const comparisonMetrics = useMemo(() => {
    const currentHospital = currentHospitalData;
    const peers = peerHospitalData;
    
    // Financial metrics comparison
    const financialComparison = currentHospital.financialMetrics.map(metric => {
      const peerValues = peers.map(peer => {
        const peerMetric = peer.financialMetrics.find(m => m.id === metric.id);
        return peerMetric ? peerMetric.value : 0;
      });
      
      const sortedValues = [...peerValues, metric.value].sort((a, b) => b - a);
      const percentile = ((sortedValues.length - sortedValues.indexOf(metric.value)) / sortedValues.length) * 100;
      
      return {
        metricId: metric.id,
        metricTitle: metric.title,
        currentValue: metric.value,
        peerAverage: peerValues.reduce((sum, val) => sum + val, 0) / peerValues.length,
        peerMedian: sortedValues[Math.floor(sortedValues.length / 2)],
        percentile,
        peerCount: peers.length
      };
    });

    // Operational metrics comparison
    const operationalComparison = {
      occupancyRate: {
        current: currentHospital.patientMetrics.occupancyRate,
        peerAverage: peers.reduce((sum, peer) => sum + peer.patientMetrics.occupancyRate, 0) / peers.length,
        percentile: 0
      },
      averageStayDuration: {
        current: currentHospital.patientMetrics.averageStayDuration,
        peerAverage: peers.reduce((sum, peer) => sum + peer.patientMetrics.averageStayDuration, 0) / peers.length,
        percentile: 0
      },
      totalPatients: {
        current: currentHospital.patientMetrics.totalPatients,
        peerAverage: peers.reduce((sum, peer) => sum + peer.patientMetrics.totalPatients, 0) / peers.length,
        percentile: 0
      }
    };

    // Calculate percentiles for operational metrics
    Object.keys(operationalComparison).forEach(key => {
      const metric = operationalComparison[key as keyof typeof operationalComparison];
      const peerValues = peers.map(peer => {
        switch (key) {
          case 'occupancyRate': return peer.patientMetrics.occupancyRate;
          case 'averageStayDuration': return peer.patientMetrics.averageStayDuration;
          case 'totalPatients': return peer.patientMetrics.totalPatients;
          default: return 0;
        }
      });
      
      const sortedValues = [...peerValues, metric.current].sort((a, b) => b - a);
      metric.percentile = ((sortedValues.length - sortedValues.indexOf(metric.current)) / sortedValues.length) * 100;
    });

    return {
      financial: financialComparison,
      operational: operationalComparison
    };
  }, [currentHospitalData, peerHospitalData]);

  // Prepare data for charts
  const chartData = useMemo(() => {
    const selectedMetricData = comparisonMetrics.financial.find(m => m.metricId === selectedMetric);
    if (!selectedMetricData) return [];

    return peerHospitalData.map(peer => {
      const peerMetric = peer.financialMetrics.find(m => m.id === selectedMetric);
      const peerValue = peerMetric ? peerMetric.value : 0;
      
      return {
        hospital: peer.hospitalId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: peerValue,
        current: peer.hospitalId === currentHospitalData.hospitalId,
        percentile: selectedMetricData.percentile
      };
    }).concat([{
      hospital: currentHospitalData.hospitalId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: selectedMetricData.currentValue,
      current: true,
      percentile: selectedMetricData.percentile
    }]);
  }, [selectedMetric, comparisonMetrics, peerHospitalData, currentHospitalData]);

  // Prepare operational chart data
  const operationalChartData = useMemo(() => {
    return peerHospitalData.map(peer => ({
      hospital: peer.hospitalId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      occupancyRate: peer.patientMetrics.occupancyRate,
      averageStayDuration: peer.patientMetrics.averageStayDuration,
      current: false
    })).concat([{
      hospital: currentHospitalData.hospitalId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      occupancyRate: currentHospitalData.patientMetrics.occupancyRate,
      averageStayDuration: currentHospitalData.patientMetrics.averageStayDuration,
      current: true
    }]);
  }, [peerHospitalData, currentHospitalData]);



  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };


  // Get percentile color
  const getPercentileColor = (percentile: number): string => {
    if (percentile >= 80) return 'text-green-400';
    if (percentile >= 60) return 'text-blue-400';
    if (percentile >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Get percentile background color with white text for colored cards
  const getPercentileBgColor = (percentile: number): string => {
    if (percentile >= 80) return 'bg-green-600/80 text-white border border-green-400/50';
    if (percentile >= 60) return 'bg-blue-600/80 text-white border border-blue-400/50';
    if (percentile >= 40) return 'bg-yellow-600/80 text-white border border-yellow-400/50';
    return 'bg-red-600/80 text-white border border-red-400/50';
  };

  // Render financial comparison chart
  const renderFinancialChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="hospital" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const data = payload?.[0]?.payload;
              return (
                <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
                  <p className="font-semibold mb-3 text-white text-center">{label}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-sm" 
                          style={{ backgroundColor: data.current ? '#10B981' : '#3B82F6' }}
                        />
                        <span className="text-sm text-white/80">Value:</span>
                      </div>
                      <span className="font-semibold text-white">
                        {formatCurrency(data?.value || 0)}
                      </span>
                    </div>
                    {data.current && (
                      <div className="text-center">
                        <span className="text-xs text-green-400 font-medium">Current Hospital</span>
                      </div>
                    )}
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
        <Bar 
          dataKey="value" 
          fill="#10B981"
          name={comparisonMetrics.financial.find(m => m.metricId === selectedMetric)?.metricTitle || "Financial Metric Value"}
        />
      </BarChart>
    </ResponsiveContainer>
  );


  // Render operational comparison chart
  const renderOperationalChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={operationalChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="hospital" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${value.toFixed(1)}%`} />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const data = payload?.[0]?.payload;
              return (
                <div className="gradient-bg-primary rounded-xl p-4 border border-white/30 backdrop-blur-sm shadow-2xl">
                  <p className="font-semibold mb-3 text-white text-center">{label}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-sm" 
                          style={{ backgroundColor: '#3B82F6' }}
                        />
                        <span className="text-sm text-white/80">Occupancy Rate:</span>
                      </div>
                      <span className="font-semibold text-white">
                        {data?.occupancyRate?.toFixed(1) || '0.0'}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-sm" 
                          style={{ backgroundColor: '#10B981' }}
                        />
                        <span className="text-sm text-white/80">Stay Duration:</span>
                      </div>
                      <span className="font-semibold text-white">
                        {data?.averageStayDuration?.toFixed(1) || '0.0'} days
                      </span>
                    </div>
                    {data.current && (
                      <div className="text-center">
                        <span className="text-xs text-green-400 font-medium">Current Hospital</span>
                      </div>
                    )}
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
        <Bar 
          dataKey="occupancyRate" 
          fill="#3B82F6"
          name="Occupancy Rate"
        />
        <Bar 
          dataKey="averageStayDuration" 
          fill="#10B981"
          name="Average Stay Duration"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // Render chart based on comparison mode
  const renderChart = () => {
    switch (comparisonMode) {
      case 'financial': return renderFinancialChart();
      case 'operational': return renderOperationalChart();
      default: return renderFinancialChart();
    }
  };

  return (
    <div className={`chart-container ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
        <h2 className="mobile-heading-scale font-bold gradient-text">Peer Comparison Analysis</h2>
      </div>

      {/* Key Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="performance-insight-card green">
          <div className="performance-insight-card-value">{peerHospitalData.length}</div>
          <div className="performance-insight-card-label">Peer Count</div>
          <div className="performance-insight-card-context">Similar hospitals</div>
        </div>

        <div className="performance-insight-card blue">
          <div className="performance-insight-card-value">
            {Math.round(comparisonMetrics.financial.reduce((sum, m) => sum + m.percentile, 0) / comparisonMetrics.financial.length)}
          </div>
          <div className="performance-insight-card-label">Average Percentile</div>
          <div className="performance-insight-card-context">Overall ranking</div>
        </div>

        <div className="performance-insight-card purple">
          <div className="performance-insight-card-value">
            {Math.round((comparisonMetrics.operational.occupancyRate.percentile + 
                        comparisonMetrics.operational.averageStayDuration.percentile + 
                        comparisonMetrics.operational.totalPatients.percentile) / 3)}
          </div>
          <div className="performance-insight-card-label">Operational Percentile</div>
          <div className="performance-insight-card-context">Efficiency ranking</div>
        </div>

      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setComparisonMode('financial')}
            className={`btn-base btn-sm transition-all ${
              comparisonMode === 'financial'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Financial Metrics
          </button>
          <button
            onClick={() => setComparisonMode('operational')}
            className={`btn-base btn-sm transition-all ${
              comparisonMode === 'operational'
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
          >
            Operational Efficiency
          </button>
        </div>

        {comparisonMode === 'financial' && (
          <div className="flex flex-wrap gap-2">
            {comparisonMetrics.financial.map(metric => (
              <button
                key={metric.metricId}
                onClick={() => setSelectedMetric(metric.metricId)}
                className={`btn-base btn-sm transition-all ${
                  selectedMetric === metric.metricId
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {metric.metricTitle}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          {comparisonMode === 'financial' && 'Financial Metrics Comparison'}
          {comparisonMode === 'operational' && 'Operational Efficiency Comparison'}
        </h3>
        {renderChart()}
      </div>

      {/* Financial Metrics Comparison Table */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Financial Metrics Benchmarking</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300">Metric</th>
                <th className="text-right py-3 px-4 text-gray-300">Your Value</th>
                <th className="text-right py-3 px-4 text-gray-300">Peer Average</th>
                <th className="text-right py-3 px-4 text-gray-300">Percentile</th>
                <th className="text-right py-3 px-4 text-gray-300">Performance</th>
              </tr>
            </thead>
            <tbody>
              {comparisonMetrics.financial.map(metric => (
                <tr key={metric.metricId} className="border-b border-gray-700/50">
                  <td className="py-3 px-4 text-white">{metric.metricTitle}</td>
                  <td className="py-3 px-4 text-right text-white">
                    {formatCurrency(metric.currentValue)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-300">
                    {formatCurrency(metric.peerAverage)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={getPercentileColor(metric.percentile)}>
                      {metric.percentile.toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      metric.percentile >= 80 ? 'bg-green-900 text-green-300' :
                      metric.percentile >= 60 ? 'bg-blue-900 text-blue-300' :
                      metric.percentile >= 40 ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {metric.percentile >= 80 ? 'Excellent' :
                       metric.percentile >= 60 ? 'Good' :
                       metric.percentile >= 40 ? 'Average' : 'Below Average'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Metrics Comparison */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-6">Operational Metrics Benchmarking</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="performance-insight-card blue rounded-lg p-5">
            <div className="flex flex-col h-full">
              <h4 className="text-sm font-medium text-white mb-3">Occupancy Rate</h4>
              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-3">
                  <div className="text-2xl font-bold text-white mb-1">
                    {comparisonMetrics.operational.occupancyRate.current.toFixed(1)}%
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Your Performance</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPercentileBgColor(comparisonMetrics.operational.occupancyRate.percentile)}`}>
                      {comparisonMetrics.operational.occupancyRate.percentile.toFixed(0)}th percentile
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/20">
                  <p className="text-xs text-white/80">
                    Peer average: <span className="font-medium text-white">{comparisonMetrics.operational.occupancyRate.peerAverage.toFixed(1)}%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="performance-insight-card green rounded-lg p-5">
            <div className="flex flex-col h-full">
              <h4 className="text-sm font-medium text-white mb-3">Average Stay Duration</h4>
              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-3">
                  <div className="text-2xl font-bold text-white mb-1">
                    {comparisonMetrics.operational.averageStayDuration.current.toFixed(1)} days
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Your Performance</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPercentileBgColor(comparisonMetrics.operational.averageStayDuration.percentile)}`}>
                      {comparisonMetrics.operational.averageStayDuration.percentile.toFixed(0)}th percentile
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/20">
                  <p className="text-xs text-white/80">
                    Peer average: <span className="font-medium text-white">{comparisonMetrics.operational.averageStayDuration.peerAverage.toFixed(1)} days</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="performance-insight-card purple rounded-lg p-5">
            <div className="flex flex-col h-full">
              <h4 className="text-sm font-medium text-white mb-3">Total Patients</h4>
              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-3">
                  <div className="text-2xl font-bold text-white mb-1">
                    {comparisonMetrics.operational.totalPatients.current.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Your Performance</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPercentileBgColor(comparisonMetrics.operational.totalPatients.percentile)}`}>
                      {comparisonMetrics.operational.totalPatients.percentile.toFixed(0)}th percentile
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/20">
                  <p className="text-xs text-white/80">
                    Peer average: <span className="font-medium text-white">{comparisonMetrics.operational.totalPatients.peerAverage.toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PeerComparison;
