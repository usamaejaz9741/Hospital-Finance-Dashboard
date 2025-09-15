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
    <div className="metric-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</h3>
      </div>
      
      <div className="mb-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatValue(metric.value, metric.format)}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className={`flex items-center ${getChangeColor(metric.changeType)}`}>
          <span className="mr-1">{getChangeIcon(metric.changeType)}</span>
          {formatPercentage(metric.change)}
        </span>
        <span className="text-gray-500 dark:text-gray-400">{metric.period}</span>
      </div>
    </div>
  );
};

export default MetricCard;

