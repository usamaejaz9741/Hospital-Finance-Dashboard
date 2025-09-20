import { renderHook } from '@testing-library/react';
import { useChartTheme } from '../useChartTheme';
import { useTheme } from '../useTheme';

// Mock the useTheme hook
jest.mock('../useTheme', () => ({
  useTheme: jest.fn()
}));

describe('useChartTheme', () => {
  const mockUseTheme = useTheme as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns light theme colors when theme is light', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'light' });

    const { result } = renderHook(() => useChartTheme());

    expect(result.current.chartTheme.colors.primary).toBe('#a855f7');
    expect(result.current.chartTheme.colors.secondary).toBe('#2563eb');
    expect(result.current.chartTheme.colors.success).toBe('#16a34a');
    expect(result.current.resolvedTheme).toBe('light');
  });

  test('returns dark theme colors when theme is dark', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'dark' });

    const { result } = renderHook(() => useChartTheme());

    expect(result.current.chartTheme.colors.primary).toBe('#a855f7');
    expect(result.current.chartTheme.colors.secondary).toBe('#3b82f6');
    expect(result.current.chartTheme.colors.success).toBe('#22c55e');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  test('returns proper grid and axis styles for light theme', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'light' });

    const { result } = renderHook(() => useChartTheme());

    expect(result.current.chartTheme.grid.stroke).toBe('rgba(255, 255, 255, 0.3)');
    expect(result.current.chartTheme.axis.stroke).toBe('rgba(255, 255, 255, 0.8)');
  });

  test('returns proper grid and axis styles for dark theme', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'dark' });

    const { result } = renderHook(() => useChartTheme());

    expect(result.current.chartTheme.grid.stroke).toBe('rgba(255, 255, 255, 0.1)');
    expect(result.current.chartTheme.axis.stroke).toBe('rgba(255, 255, 255, 0.6)');
  });

  test('returns tooltip configuration for light theme', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'light' });

    const { result } = renderHook(() => useChartTheme());

    expect(result.current.chartTheme.tooltip.backgroundColor).toBe('rgba(255, 255, 255, 0.95)');
    expect(result.current.chartTheme.tooltip.border).toBe('rgba(255, 255, 255, 0.3)');
    expect(result.current.chartTheme.tooltip.textColor).toBe('#2d1b69');
  });

  test('returns tooltip configuration for dark theme', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'dark' });

    const { result } = renderHook(() => useChartTheme());

    expect(result.current.chartTheme.tooltip.backgroundColor).toBe('rgba(15, 23, 42, 0.95)');
    expect(result.current.chartTheme.tooltip.border).toBe('rgba(255, 255, 255, 0.2)');
    expect(result.current.chartTheme.tooltip.textColor).toBe('#ffffff');
  });

  test('returns consistent colors across re-renders', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'dark' });

    const { result, rerender } = renderHook(() => useChartTheme());
    const firstColors = result.current.chartTheme.colors;

    rerender();
    const secondColors = result.current.chartTheme.colors;

    // Check that all color values remain the same
    Object.keys(firstColors).forEach(key => {
      expect(firstColors[key as keyof typeof firstColors]).toBe(secondColors[key as keyof typeof firstColors]);
    });
  });
});