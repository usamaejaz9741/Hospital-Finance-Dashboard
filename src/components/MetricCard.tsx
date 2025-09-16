import React from 'react';
import { FinancialMetric } from '../types/finance';
import { formatCurrency, formatPercentage, formatNumber, getChangeColor, getChangeIcon } from '../utils/formatters';

/**
 * Props for the MetricCard component.
 * 
 * @interface MetricCardProps
 */
interface MetricCardProps {
  /** Financial metric data to display in the card */
  metric: FinancialMetric;
}

/**
 * Financial metric card component that displays key performance indicators.
 * 
 * Features:
 * - Displays metric title, value, and change indicator
 * - Supports multiple value formats (currency, percentage, number)
 * - Visual change indicators with icons and colors
 * - Responsive typography and layout
 * - Dark mode support
 * - Full accessibility compliance with ARIA labels
 * - Hover effects for better interactivity
 * 
 * The card automatically formats values based on the metric's format type
 * and displays trend indicators with appropriate colors and icons.
 * 
 * @component
 * @example
 * ```tsx
 * const revenueMetric: FinancialMetric = {
 *   id: 'total-revenue',
 *   title: 'Total Revenue',
 *   value: 1500000,
 *   change: 12.5,
 *   changeType: 'increase',
 *   period: 'vs last month',
 *   format: 'currency'
 * };
 * 
 * <MetricCard metric={revenueMetric} />
 * ```
 * 
 * @param props - Component props
 * @param props.metric - Financial metric data to display
 * @returns React functional component rendering the metric card
 */
const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  /**
   * Formats the metric value based on the specified format type.
   * 
   * @param value - Numeric value to format
   * @param format - Format type (currency, percentage, number)
   * @returns Formatted string representation of the value
   */
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value); // Format as USD currency (e.g., "$1,500,000")
      case 'percentage':
        return formatPercentage(value); // Format as percentage (e.g., "12.5%")
      case 'number':
        return formatNumber(value); // Format with thousand separators (e.g., "1,500")
      default:
        return value.toString(); // Fallback to simple string conversion
    }
  };

  return (
    <div 
      className="bg-white dark:bg-dark-surface p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-dark-border"
      role="article" // Semantic role for accessibility
      aria-labelledby={`metric-title-${metric.id}`} // Associate with title for screen readers
      aria-describedby={`metric-change-${metric.id}`} // Associate with change indicator
    >
      {/* Card Header: Metric Title */}
      <div className="flex items-center justify-between mb-2">
        <h3 
          id={`metric-title-${metric.id}`} // Unique ID for accessibility linking
          className="text-sm font-medium text-gray-600 dark:text-gray-400"
        >
          {metric.title}
        </h3>
        {/* Future enhancement: Add info icon/tooltip for metric descriptions */}
      </div>
      
      {/* Main Value Display */}
      <div className="mb-2">
        <p 
          className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white"
          aria-label={`${metric.title} value: ${formatValue(metric.value, metric.format)}`} // Descriptive label for screen readers
        >
          {formatValue(metric.value, metric.format)}
        </p>
      </div>
      
      {/* Change Indicator and Period */}
      <div className="flex items-center justify-between text-sm">
        {/* Change percentage with trend indicator */}
        <span 
          id={`metric-change-${metric.id}`} // Unique ID for accessibility linking
          className={`flex items-center ${getChangeColor(metric.changeType)}`} // Dynamic color based on change type
          aria-label={`${metric.changeType === 'increase' ? 'Increased' : 'Decreased'} by ${formatPercentage(metric.change)} ${metric.period}`}
        >
          <span className="mr-1" aria-hidden="true">{getChangeIcon(metric.changeType)}</span> {/* Decorative icon */}
          {formatPercentage(metric.change)}
        </span>
        
        {/* Time period reference */}
        <span className="text-gray-500 dark:text-dark-muted">{metric.period}</span>
      </div>
    </div>
  );
};

export default MetricCard;

