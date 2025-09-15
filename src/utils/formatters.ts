/**
 * Formats a number as a US currency string.
 * @param value The number to format.
 * @returns A string representing the formatted currency (e.g., "$1,500").
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats a number as a percentage string.
 * @param value The number to format.
 * @returns A string representing the formatted percentage (e.g., "15.4%").
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Formats a number with commas as thousands separators.
 * @param value The number to format.
 * @returns A string representing the formatted number (e.g., "1,500,000").
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Formats a number into a compact currency string with 'M' for millions or 'K' for thousands.
 * @param value The number to format.
 * @returns A compact currency string (e.g., "$1.5M", "$1.5K").
 */
export const formatCompactCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return formatCurrency(value);
};

/**
 * Returns the Tailwind CSS color class based on the change type.
 * @param changeType The type of change, either 'increase' or 'decrease'.
 * @returns A Tailwind CSS class string for the color.
 */
export const getChangeColor = (changeType: 'increase' | 'decrease'): string => {
  return changeType === 'increase' ? 'text-success-600' : 'text-danger-600';
};

/**
 * Returns an icon representing the change type.
 * @param changeType The type of change, either 'increase' or 'decrease'.
 * @returns An arrow icon string ('↗' for increase, '↘' for decrease).
 */
export const getChangeIcon = (changeType: 'increase' | 'decrease'): string => {
  return changeType === 'increase' ? '↗' : '↘';
};

