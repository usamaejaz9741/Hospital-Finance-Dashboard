import React from 'react';
import { FinancialMetric } from '../types/finance';
import { formatCurrency, formatPercentage, formatNumber, getChangeColor, getChangeIcon } from '../utils/formatters';

interface MetricCardProps {
  metric: FinancialMetric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'number':
        return formatNumber(value);
      default:
        return value.toString();
    }
  };

  return (
    <div 
      className="metric-card" 
      role="article" 
      aria-labelledby={`metric-title-${metric.id}`}
      aria-describedby={`metric-change-${metric.id}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 
          id={`metric-title-${metric.id}`}
          className="text-sm font-medium text-gray-600 dark:text-gray-400"
        >
          {metric.title}
        </h3>
      </div>
      
      <div className="mb-2">
        <p 
          className="text-2xl font-bold text-gray-900 dark:text-white"
          aria-label={`${metric.title} value: ${formatValue(metric.value, metric.format)}`}
        >
          {formatValue(metric.value, metric.format)}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span 
          id={`metric-change-${metric.id}`}
          className={`flex items-center ${getChangeColor(metric.changeType)}`}
          aria-label={`${metric.changeType === 'increase' ? 'Increased' : 'Decreased'} by ${formatPercentage(metric.change)} ${metric.period}`}
        >
          <span className="mr-1" aria-hidden="true">{getChangeIcon(metric.changeType)}</span>
          {formatPercentage(metric.change)}
        </span>
        <span className="text-gray-500 dark:text-gray-400">{metric.period}</span>
      </div>
    </div>
  );
};

export default MetricCard;

