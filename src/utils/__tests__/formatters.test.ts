import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatCompactCurrency,
  getChangeColor,
  getChangeIcon,
} from '../formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats a number into a currency string', () => {
      expect(formatCurrency(1234567)).toBe('$1,234,567');
    });

    it('handles zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0');
    });
  });

  describe('formatPercentage', () => {
    it('formats a number into a percentage string with one decimal place', () => {
      expect(formatPercentage(15.4)).toBe('15.4%');
      expect(formatPercentage(0.123)).toBe('0.1%');
    });
  });

  describe('formatNumber', () => {
    it('formats a number with commas', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
    });
  });

  describe('formatCompactCurrency', () => {
    it('formats millions with "M"', () => {
      expect(formatCompactCurrency(1500000)).toBe('$1.5M');
    });

    it('formats thousands with "K"', () => {
      expect(formatCompactCurrency(12300)).toBe('$12.3K');
    });

    it('formats numbers less than 1000 with formatCurrency', () => {
      expect(formatCompactCurrency(500)).toBe('$500');
    });
  });

  describe('getChangeColor', () => {
    it('returns success color for increase', () => {
      expect(getChangeColor('increase')).toBe('text-success-600');
    });

    it('returns danger color for decrease', () => {
      expect(getChangeColor('decrease')).toBe('text-danger-600');
    });
  });

  describe('getChangeIcon', () => {
    it('returns up arrow for increase', () => {
      expect(getChangeIcon('increase')).toBe('↗');
    });

    it('returns down arrow for decrease', () => {
      expect(getChangeIcon('decrease')).toBe('↘');
    });
  });
});
