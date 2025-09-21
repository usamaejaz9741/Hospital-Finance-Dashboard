/**
 * ResponsiveChartWrapper - Enhanced responsive wrapper for chart components
 * 
 * This component provides:
 * - Responsive sizing based on screen size
 * - Mobile-optimized chart configurations
 * - Touch gesture support
 * - Accessibility enhancements
 * - Loading states with skeleton screens
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import useResponsive from '../hooks/useResponsive';
import { screenReader } from '../utils/accessibility';
// import LoadingSpinner from './LoadingSpinner'; // Removed unused import

interface ResponsiveChartWrapperProps {
  children: ReactNode;
  title: string;
  description?: string;
  minHeight?: number;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const ResponsiveChartWrapper: React.FC<ResponsiveChartWrapperProps> = ({
  children,
  title,
  description,
  minHeight = 300,
  loading = false,
  error,
  onRetry,
  className = ''
}) => {
  const { isMd, isLg } = useResponsive();
  const isMobile = !isMd;
  const isTablet = isMd && !isLg;
  const isDesktop = isLg;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: 0,
    height: 0,
    margin: { top: 20, right: 20, bottom: 40, left: 40 }
  });

  // Calculate responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      
      let height = minHeight;
      let margin = { top: 20, right: 20, bottom: 40, left: 40 };

      // Adjust dimensions based on screen size
      if (isMobile) {
        height = Math.max(250, minHeight * 0.8);
        margin = { top: 15, right: 15, bottom: 35, left: 35 };
      } else if (isTablet) {
        height = Math.max(280, minHeight * 0.9);
        margin = { top: 18, right: 18, bottom: 38, left: 38 };
      } else if (isDesktop) {
        height = minHeight;
        margin = { top: 20, right: 20, bottom: 40, left: 40 };
      }

      setDimensions({
        width: containerWidth,
        height,
        margin
      });
    };

    // Initial calculation
    updateDimensions();

    // Set up resize observer for responsive updates
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isMobile, isTablet, isDesktop, minHeight]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div 
      className="animate-pulse"
      style={{ height: dimensions.height }}
      role="img"
      aria-label={`Loading ${title} chart`}
    >
      <div className="h-full rounded-lg bg-gradient-to-r from-white/5 to-white/10"></div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div 
      className="flex flex-col items-center justify-center text-center p-6"
      style={{ height: dimensions.height }}
      role="alert"
      aria-live="assertive"
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-500/10 border border-red-500/20">
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        Unable to load {title}
      </h3>
      
      <p className="text-white/70 mb-4 max-w-sm">
        {error || 'There was an error loading the chart data. Please try again.'}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-base btn-secondary btn-sm"
          aria-label={`Retry loading ${title} chart`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry
        </button>
      )}
    </div>
  );

  // Announce chart loading state changes to screen readers
  useEffect(() => {
    if (loading) {
      screenReader.announce(`Loading ${title} chart`, 'polite');
    } else if (error) {
      screenReader.announceError(`Failed to load ${title} chart: ${error}`);
    } else {
      screenReader.announce(`${title} chart loaded successfully`, 'polite');
    }
  }, [loading, error, title]);

  return (
    <div className={`chart-container ${className}`}>
      {/* Chart Header */}
      <div className="mb-4">
        <h3 
          className="text-lg font-semibold text-white mb-1"
          id={`chart-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {title}
        </h3>
        
        {description && (
          <p 
            className="text-sm text-white/70"
            id={`chart-desc-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {description}
          </p>
        )}
      </div>

      {/* Chart Content */}
      <div 
        ref={containerRef}
        className="relative w-full"
        style={{ minHeight: dimensions.height }}
        role="img"
        aria-labelledby={`chart-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
        aria-describedby={description ? `chart-desc-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            screenReader.announce(`Viewing ${title} chart. Use arrow keys to navigate data points.`, 'polite');
          }
        }}
      >
        {loading && <LoadingSkeleton />}
        {error && <ErrorState />}
        
        {!loading && !error && (
          <div className="w-full h-full">
            {/* Clone children with responsive props */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
                  width: dimensions.width,
                  height: dimensions.height,
                  margin: dimensions.margin,
                  responsive: true,
                  isMobile,
                  isTablet,
                  isDesktop,
                  ...child.props
                });
              }
              return child;
            })}
          </div>
        )}
      </div>

      {/* Mobile-specific touch instructions */}
      {isMobile && !loading && !error && (
        <div className="mt-2 text-xs text-white/50 text-center">
          <span role="img" aria-label="Touch gesture">👆</span> Tap and drag to explore data
        </div>
      )}
    </div>
  );
};

export default ResponsiveChartWrapper;
