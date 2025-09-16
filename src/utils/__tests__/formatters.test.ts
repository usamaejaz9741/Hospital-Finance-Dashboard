import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatCompactCurrency,
  getChangeColor,
  getChangeIcon
} from '../formatters';

describe('Formatter Utilities', () => {
  describe('formatCurrency', () => {
    test('formats positive numbers correctly', () => {
      expect(formatCurrency(1234567)).toBe('$1,234,567');
      expect(formatCurrency(100)).toBe('$100');
      expect(formatCurrency(0)).toBe('$0');
    });

    test('formats negative numbers correctly', () => {
      expect(formatCurrency(-1234567)).toBe('-$1,234,567');
      expect(formatCurrency(-100)).toBe('-$100');
    });

    test('formats decimal numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235'); // Rounds to nearest dollar
      expect(formatCurrency(1234.45)).toBe('$1,234');
    });
  });

  describe('formatPercentage', () => {
    test('formats percentages with one decimal place', () => {
      expect(formatPercentage(15.4)).toBe('15.4%');
      expect(formatPercentage(0)).toBe('0.0%');
      expect(formatPercentage(100)).toBe('100.0%');
      expect(formatPercentage(-5.7)).toBe('-5.7%');
    });

    test('rounds to one decimal place', () => {
      expect(formatPercentage(15.456)).toBe('15.5%');
      expect(formatPercentage(15.444)).toBe('15.4%');
    });
  });

  describe('formatNumber', () => {
    test('formats numbers with thousand separators', () => {
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(0)).toBe('0');
    });

    test('formats negative numbers', () => {
      expect(formatNumber(-1234567)).toBe('-1,234,567');
    });

    test('formats decimal numbers', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });
  });

  describe('formatCompactCurrency', () => {
    test('formats millions correctly', () => {
      expect(formatCompactCurrency(1000000)).toBe('$1.0M');
      expect(formatCompactCurrency(1500000)).toBe('$1.5M');
      expect(formatCompactCurrency(12300000)).toBe('$12.3M');
    });

    test('formats thousands correctly', () => {
      expect(formatCompactCurrency(1000)).toBe('$1.0K');
      expect(formatCompactCurrency(1500)).toBe('$1.5K');
      expect(formatCompactCurrency(123000)).toBe('$123.0K');
    });

    test('formats small amounts using formatCurrency', () => {
      expect(formatCompactCurrency(999)).toBe('$999');
      expect(formatCompactCurrency(500)).toBe('$500');
      expect(formatCompactCurrency(0)).toBe('$0');
    });

    test('handles negative values', () => {
      // Negative values fall through to formatCurrency since the thresholds check for positive values
      expect(formatCompactCurrency(-1000000)).toBe('-$1,000,000');
      expect(formatCompactCurrency(-1500)).toBe('-$1,500');
    });
  });

  describe('getChangeColor', () => {
    test('returns correct color for increase', () => {
      expect(getChangeColor('increase')).toBe('text-success-600');
    });

    test('returns correct color for decrease', () => {
      expect(getChangeColor('decrease')).toBe('text-danger-600');
    });
  });

  describe('getChangeIcon', () => {
    test('returns correct icon for increase', () => {
      expect(getChangeIcon('increase')).toBe('↗');
    });

    test('returns correct icon for decrease', () => {
      expect(getChangeIcon('decrease')).toBe('↘');
    });
  });
});