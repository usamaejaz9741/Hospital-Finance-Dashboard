/**
 * Performance optimization utilities for the Hospital Finance Dashboard
 */

import { useMemo, useCallback } from 'react';
import { RevenueData, ExpenseBreakdown, CashFlowData, HospitalData } from '../types/finance';

/**
 * Debounce function to limit the rate of function execution
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to ensure function is called at most once per specified time
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Memoized data processor for revenue chart data
 */
export const useProcessedRevenueData = (data: RevenueData[]) => {
  return useMemo(() => {
    if (!data?.length) return [];
    
    return data.map(item => ({
      ...item,
      // Pre-calculate profit margin for better performance
      profitMargin: ((item.netIncome / item.revenue) * 100).toFixed(1),
      // Format values for display
      formattedRevenue: (item.revenue / 1000000).toFixed(1) + 'M',
      formattedExpenses: (item.expenses / 1000000).toFixed(1) + 'M',
      formattedNetIncome: (item.netIncome / 1000000).toFixed(1) + 'M'
    }));
  }, [data]);
};

/**
 * Memoized expense breakdown processor
 */
export const useProcessedExpenseData = (data: ExpenseBreakdown[]) => {
  return useMemo(() => {
    if (!data?.length) return [];
    
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    
    return data.map(item => ({
      ...item,
      // Ensure percentages are accurate
      actualPercentage: ((item.amount / total) * 100).toFixed(1),
      formattedAmount: (item.amount / 1000000).toFixed(1) + 'M'
    }));
  }, [data]);
};

/**
 * Memoized cash flow data processor
 */
export const useProcessedCashFlowData = (data: CashFlowData[]) => {
  return useMemo(() => {
    if (!data?.length) return [];
    
    return data.map(item => ({
      ...item,
      // Format month display
      month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
      // Format values in millions
      operatingFormatted: (item.operatingCashFlow / 1000000).toFixed(1),
      investingFormatted: (item.investingCashFlow / 1000000).toFixed(1),
      financingFormatted: (item.financingCashFlow / 1000000).toFixed(1),
      netFormatted: (item.netCashFlow / 1000000).toFixed(1)
    }));
  }, [data]);
};

/**
 * Optimized hospital data aggregator
 */
export const useHospitalAggregates = (data: HospitalData | null) => {
  return useMemo(() => {
    if (!data) return null;
    
    const totalRevenue = data.revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = data.revenueData.reduce((sum, item) => sum + item.expenses, 0);
    const totalNetIncome = data.revenueData.reduce((sum, item) => sum + item.netIncome, 0);
    
    const avgProfitMargin = totalRevenue > 0 ? (totalNetIncome / totalRevenue) * 100 : 0;
    
    // Department performance metrics
    const departmentTotals = data.departmentFinances.reduce((acc, dept) => ({
      revenue: acc.revenue + dept.revenue,
      expenses: acc.expenses + dept.expenses,
      profit: acc.profit + dept.profit
    }), { revenue: 0, expenses: 0, profit: 0 });
    
    // Monthly trends
    const monthlyGrowth = data.revenueData.length >= 2 
      ? ((data.revenueData[data.revenueData.length - 1]?.revenue || 0) - (data.revenueData[0]?.revenue || 0)) / (data.revenueData[0]?.revenue || 1) * 100
      : 0;
    
    return {
      totalRevenue,
      totalExpenses,
      totalNetIncome,
      avgProfitMargin,
      departmentTotals,
      monthlyGrowth,
      // Performance indicators
      isRevenueTrendPositive: monthlyGrowth > 0,
      isProfitable: totalNetIncome > 0,
      operationalEfficiency: departmentTotals.revenue > 0 ? (departmentTotals.profit / departmentTotals.revenue) * 100 : 0
    };
  }, [data]);
};

/**
 * Optimized search and filter utilities
 */
export const useFilteredData = <T>(
  data: T[],
  searchTerm: string,
  searchKey: keyof T,
  additionalFilters?: (item: T) => boolean
) => {
  return useMemo(() => {
    if (!data?.length) return [];
    
    let filtered = data;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        const value = item[searchKey];
        return value && String(value).toLowerCase().includes(lowercaseSearch);
      });
    }
    
    // Apply additional filters
    if (additionalFilters) {
      filtered = filtered.filter(additionalFilters);
    }
    
    return filtered;
  }, [data, searchTerm, searchKey, additionalFilters]);
};

/**
 * Memoized sort utility
 */
export const useSortedData = <T>(
  data: T[],
  sortKey: keyof T,
  sortDirection: 'asc' | 'desc' = 'asc'
) => {
  return useMemo(() => {
    if (!data?.length) return [];
    
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);
};

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useMemo(() => performance.now(), []);
  
  const logRenderTime = useCallback(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Only log in development and if render time is concerning
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName, startTime]);
  
  return { logRenderTime };
};

/**
 * Virtualization utility for large lists
 */
export const useVirtualization = (
  itemHeight: number,
  containerHeight: number,
  totalItems: number,
  scrollTop: number
) => {
  return useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      totalItems
    );
    
    const offsetY = visibleStart * itemHeight;
    const visibleItems = visibleEnd - visibleStart;
    
    return {
      visibleStart,
      visibleEnd,
      offsetY,
      visibleItems,
      totalHeight: totalItems * itemHeight
    };
  }, [itemHeight, containerHeight, totalItems, scrollTop]);
};

/**
 * Intersection Observer hook for lazy loading
 */
export const useIntersectionObserver = (
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        callback();
      }
    }, options);
    
    observer.observe(node);
    
    return () => observer.disconnect();
  }, [callback, options]);
  
  return ref;
};
