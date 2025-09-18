import React from 'react';
import { PatientMetrics } from '../types/finance';
import { formatNumber, formatPercentage } from '../utils/formatters';

interface PatientMetricsCardProps {
  metrics: PatientMetrics;
}

/**
 * Renders a card displaying key patient metrics.
 *
 * @param {PatientMetricsCardProps} props The component props.
 * @param {PatientMetrics} props.metrics The patient metrics to display.
 * @returns {React.ReactElement} The rendered card.
 */
const PatientMetricsCard: React.FC<PatientMetricsCardProps> = ({ metrics }) => {
  const metricItems = [
    {
      label: 'Total Patients',
      value: formatNumber(metrics.totalPatients),
      icon: '👥',
      color: 'text-primary-600'
    },
    {
      label: 'Inpatients',
      value: formatNumber(metrics.inpatients),
      icon: '🏥',
      color: 'text-success-600'
    },
    {
      label: 'Outpatients',
      value: formatNumber(metrics.outpatients),
      icon: '🚶',
      color: 'text-warning-600'
    },
    {
      label: 'Emergency Visits',
      value: formatNumber(metrics.emergencyVisits),
      icon: '🚨',
      color: 'text-danger-600'
    },
    {
      label: 'Avg Stay Duration',
      value: `${metrics.averageStayDuration} days`,
      icon: '📅',
      color: 'text-blue-500'
    },
    {
      label: 'Occupancy Rate',
      value: formatPercentage(metrics.occupancyRate),
      icon: '📊',
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="chart-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h2 className="mobile-heading-scale font-bold gradient-text">Patient Metrics</h2>
        <button 
          className="btn-base btn-secondary btn-sm w-full sm:w-auto"
          aria-label="View detailed patient metrics report"
        >
          View Report
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4" role="grid" aria-label="Patient metrics overview">
        {metricItems.map((item, index) => (
          <div 
            key={index} 
            className="text-center glass-card interactive"
            style={{ padding: 'var(--space-4)' }}
            role="gridcell"
            aria-labelledby={`metric-label-${index}`}
            aria-describedby={`metric-value-${index}`}
          >
            <div className="text-xl sm:text-2xl mb-2" aria-hidden="true">{item.icon}</div>
            <div 
              id={`metric-value-${index}`}
              className="text-base sm:text-lg font-bold text-white"
              aria-label={`${item.label}: ${item.value}`}
            >
              {item.value}
            </div>
            <div 
              id={`metric-label-${index}`}
              className="text-xs sm:text-sm text-white/70 mt-1"
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientMetricsCard;

