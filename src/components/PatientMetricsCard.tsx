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
      color: 'text-purple-600'
    },
    {
      label: 'Occupancy Rate',
      value: formatPercentage(metrics.occupancyRate),
      icon: '📊',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Patient Metrics</h2>
        <button 
          className="btn-secondary text-sm"
          aria-label="View detailed patient metrics report"
        >
          View Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4" role="grid" aria-label="Patient metrics overview">
        {metricItems.map((item, index) => (
          <div 
            key={index} 
            className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            role="gridcell"
            aria-labelledby={`metric-label-${index}`}
            aria-describedby={`metric-value-${index}`}
          >
            <div className="text-2xl mb-2" aria-hidden="true">{item.icon}</div>
            <div 
              id={`metric-value-${index}`}
              className={`text-lg font-bold ${item.color}`}
              aria-label={`${item.label}: ${item.value}`}
            >
              {item.value}
            </div>
            <div 
              id={`metric-label-${index}`}
              className="text-sm text-gray-600 dark:text-gray-400 mt-1"
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

