export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatCompactCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
};

export const getChangeColor = (changeType: 'increase' | 'decrease'): string => {
  return changeType === 'increase' ? 'text-success-600' : 'text-danger-600';
};

export const getChangeIcon = (changeType: 'increase' | 'decrease'): string => {
  return changeType === 'increase' ? '↗' : '↘';
};

