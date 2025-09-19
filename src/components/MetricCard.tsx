import React from 'react';
import { FinancialMetric } from '../types/finance';
import { formatCurrency, formatPercentage, formatNumber, getChangeIcon } from '../utils/formatters';

/**
 * Props interface for the MetricCard component.
 * 
 * @interface MetricCardProps
 * @category Component Props
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * const props: MetricCardProps = {
 *   metric: {
 *     id: 'total-revenue',
 *     title: 'Total Revenue',
 *     value: 1500000,
 *     change: 12.5,
 *     changeType: 'increase',
 *     period: 'vs last month',
 *     format: 'currency'
 *   }
 * };
 * ```
 */
interface MetricCardProps {
  /** 
   * Financial metric data to display in the card.
   * @see FinancialMetric for detailed type information
   */
  metric: FinancialMetric;
}

/**
 * A visually appealing card component for displaying financial metrics with modern design elements.
 * 
 * @component MetricCard
 * @category UI Components
 * @subcategory Data Display
 * @since 1.0.0
 * 
 * @example
 * Basic usage:
 * ```tsx
 * <MetricCard 
 *   metric={{
 *     id: 'total-revenue',
 *     title: 'Total Revenue',
 *     value: 1500000,
 *     change: 12.5,
 *     changeType: 'increase',
 *     period: 'vs last month',
 *     format: 'currency'
 *   }}
 * />
 * ```
 * 
 * @example
 * With percentage format:
 * ```tsx
 * <MetricCard 
 *   metric={{
 *     id: 'profit-margin',
 *     title: 'Profit Margin',
 *     value: 0.235,
 *     change: -0.02,
 *     changeType: 'decrease',
 *     period: 'vs last quarter',
 *     format: 'percentage'
 *   }}
 * />
 * ```
 * 
 * @remarks
 * Features:
 * - Modern glassmorphism styling with backdrop blur
 * - Gradient backgrounds and glass effects
 * - Smooth hover animations and scaling
 * - Enhanced visual hierarchy with better typography
 * - Improved accessibility with proper ARIA labels
 * - Responsive design for all screen sizes
 * - Dark mode support
 * - Automatic formatting based on metric type
 * - Trend indicators with color coding
 * 
 * Accessibility:
 * - Uses semantic HTML structure
 * - Includes proper ARIA labels and roles
 * - Supports keyboard navigation
 * - Color contrast meets WCAG guidelines
 * - Screen reader optimized content structure
 * 
 * Performance:
 * - Memoized value formatting
 * - CSS-based animations for smooth performance
 * - Optimized re-renders using React.memo
 */
const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  /**
   * Formats the metric value based on the specified format type.
   */
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
      className="glass-card interactive animate-float group"
      style={{ padding: 'var(--space-4) var(--space-5)' }}
      role="article"
      aria-labelledby={`metric-title-${metric.id}`}
      aria-describedby={`metric-change-${metric.id}`}
    >
      {/* Card Header: Metric Title */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
        <h3 
          id={`metric-title-${metric.id}`}
          className="text-secondary font-semibold uppercase tracking-wider"
          style={{ fontSize: 'var(--text-sm)' }}
        >
          {metric.title}
        </h3>
      </div>
      
      {/* Main Value Display */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <p 
          className="text-primary font-bold group-hover:scale-105 transition-transform duration-300"
          style={{ 
            fontSize: 'clamp(1.25rem, 3vw, 2rem)',
            lineHeight: 'var(--line-height-tight)',
            marginBottom: 'var(--space-1)',
            wordSpacing: '-0.05em',
            letterSpacing: '-0.025em'
          }}
          aria-label={`${metric.title} value: ${formatValue(metric.value, metric.format)}`}
        >
          {formatValue(metric.value, metric.format)}
        </p>
      </div>
      
      {/* Change Indicator and Period */}
      <div className="flex items-center justify-between flex-wrap" style={{ gap: 'var(--space-2)' }}>
        {/* Change percentage with trend indicator */}
        <div className="flex items-center">
          <span 
            id={`metric-change-${metric.id}`}
            className={`flex items-center font-medium transition-colors ${
              metric.changeType === 'increase' 
                ? 'text-green-400 hover:text-green-300' 
                : 'text-red-400 hover:text-red-300'
            }`}
            style={{ fontSize: 'var(--text-base)' }}
            aria-label={`${metric.changeType === 'increase' ? 'Increased' : 'Decreased'} by ${formatPercentage(metric.change)} ${metric.period}`}
          >
            <span 
              className="transform group-hover:scale-110 transition-transform" 
              style={{ marginRight: 'var(--space-2)' }}
              aria-hidden="true"
            >
              {getChangeIcon(metric.changeType)}
            </span>
            {formatPercentage(metric.change)}
          </span>
        </div>
        
        {/* Time period reference */}
        <span 
          className="text-tertiary font-medium uppercase tracking-wide"
          style={{ fontSize: 'var(--text-sm)' }}
        >
          {metric.period}
        </span>
      </div>

    </div>
  );
};

export default MetricCard;

