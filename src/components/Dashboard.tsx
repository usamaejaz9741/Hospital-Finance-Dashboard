import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import Header from './Header';
import MetricCard from './MetricCard';
import { logger } from '../utils/logger';
import {
  hospitals,
  availableYears,
  getHospitalData
} from '../data/mockData';
import { HospitalData } from '../types/finance';
import { useAuth } from '../hooks/useAuth';
import Dropdown from './Dropdown';
import DashboardLoading from './DashboardLoading';
import DashboardNoData from './DashboardNoData';
import LoadingSpinner from './LoadingSpinner';

const RevenueChart = lazy(() => import('./RevenueChart'));
const ExpensePieChart = lazy(() => import('./ExpensePieChart'));
const CashFlowChart = lazy(() => import('./CashFlowChart'));
const PatientMetricsCard = lazy(() => import('./PatientMetricsCard'));
const DepartmentTable = lazy(() => import('./DepartmentTable'));

// Enhanced GP Spec components
const EnhancedRevenueChart = lazy(() => import('./EnhancedRevenueChart'));
const EBIDACalculator = lazy(() => import('./EBIDACalculator'));
const ContextualEventsTimeline = lazy(() => import('./ContextualEventsTimeline'));
const EnhancedExpenseAnalysis = lazy(() => import('./EnhancedExpenseAnalysis'));
const FinancialAssetsDashboard = lazy(() => import('./FinancialAssetsDashboard'));
const EnhancedDonationTracking = lazy(() => import('./EnhancedDonationTracking'));
const PeerComparison = lazy(() => import('./PeerComparison'));
const DrillDownAnalysis = lazy(() => import('./DrillDownAnalysis'));

/**
 * Main dashboard component providing a comprehensive financial overview for hospitals.
 * Features a modern glassmorphism design with responsive layout and role-based data access.
 * 
 * @component
 * @category Core Components
 * @since 1.0.0
 * 
 * @example
 * Basic usage within router:
 * ```tsx
 * <Route path="/dashboard">
 *   <Dashboard />
 * </Route>
 * ```
 * 
 * @remarks
 * This component serves as the main interface for the Hospital Finance Dashboard.
 * It manages:
 * - Hospital selection based on user permissions
 * - Year-based data filtering
 * - Dynamic loading of financial metrics and charts
 * - Responsive layout with mobile-friendly filters
 * - Error handling and loading states
 * 
 * Performance optimizations:
 * - Lazy loading of heavy chart components
 * - Memoization of filtered hospital list
 * - Debounced data loading
 * - Suspense boundaries for code splitting
 * 
 * Accessibility features:
 * - ARIA labels for interactive elements
 * - Keyboard navigation support
 * - Screen reader announcements for data updates
 * - High contrast mode compatibility
 */
const Dashboard: React.FC = () => {
  // Authentication and access control
  const { user, signOut, getAccessibleHospitals, canAccessHospital } = useAuth();
  const accessibleHospitals = getAccessibleHospitals();
  
  // Filter hospitals based on user permissions
  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => accessibleHospitals.includes(h.id));
  }, [accessibleHospitals]);
  
  // Dashboard state management
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(
    accessibleHospitals[0] || ''
  );
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [currentData, setCurrentData] = useState<HospitalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Effect to load dashboard data when hospital or year selection changes.
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (selectedHospitalId && selectedYear) {
      setIsLoading(true);
      logger.info('Loading dashboard data', {
        context: 'Dashboard',
        data: { hospitalId: selectedHospitalId, year: selectedYear }
      });
      
      timeout = setTimeout(() => {
        const data = getHospitalData(selectedHospitalId, selectedYear);
        if (!data) {
          logger.warn('No data available for hospital and year', {
            context: 'Dashboard',
            data: { hospitalId: selectedHospitalId, year: selectedYear }
          });
        }
        setCurrentData(data || null);
        setIsLoading(false);
      }, 500);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [selectedHospitalId, selectedYear]);

  /**
   * Handles hospital selection change with access control validation.
   */
  const handleHospitalChange = useCallback((hospitalId: string) => {
    if (canAccessHospital(hospitalId)) {
      logger.info('Hospital selection changed', {
        context: 'Dashboard',
        data: { hospitalId }
      });
      setSelectedHospitalId(hospitalId);
    } else {
      logger.warn('Unauthorized hospital access attempt', {
        context: 'Dashboard',
        data: { hospitalId, userId: user?.id }
      });
    }
  }, [canAccessHospital, user?.id]);

  /**
   * Handles year selection change for financial data filtering.
   */
  const handleYearChange = useCallback((year: number) => {
    logger.info('Year selection changed', {
      context: 'Dashboard',
      data: { year, previousYear: selectedYear }
    });
    setSelectedYear(year);
  }, [selectedYear]);

  const hospitalOptions = useMemo(() => {
    return filteredHospitals.map(hospital => ({
      value: hospital.id,
      label: hospital.name,
      subtitle: `${hospital.type} • ${hospital.location}`
    }));
  }, [filteredHospitals]);

  const yearOptions = useMemo(() => {
    return availableYears.map(year => ({
      value: year.toString(),
      label: year.toString()
    }));
  }, []);

  if (isLoading) {
    return (
      <DashboardLoading 
        hospitals={filteredHospitals}
        selectedHospitalId={selectedHospitalId}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onHospitalChange={handleHospitalChange}
        onYearChange={handleYearChange}
        user={user}
        signOut={signOut}
      />
    );
  }

  if (!currentData) {
    return (
      <DashboardNoData
        hospitals={filteredHospitals}
        selectedHospitalId={selectedHospitalId}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onHospitalChange={handleHospitalChange}
        onYearChange={handleYearChange}
        user={user}
        signOut={signOut}
      />
    );
  }

  return (
    <div className="min-h-screen text-white dark:text-white relative">
      <Header
        hospitals={filteredHospitals}
        selectedHospitalId={selectedHospitalId}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onHospitalChange={handleHospitalChange}
        onYearChange={handleYearChange}
      />
      
      <main id="main-content" className="mobile-safe-area">
        <div className="page-container">
          {/* Enhanced Mobile Filter Bar */}
        <div className="xl:hidden mb-4 relative z-20">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-base btn-primary btn-md w-full flex items-center justify-center gap-3"
            aria-expanded={showFilters}
            aria-controls="mobile-filter-panel"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium" style={{ lineHeight: 'var(--line-height-snug)' }}>
              {showFilters ? 'Hide' : 'Show'} Filters
            </span>
          </button>

          {showFilters && (
            <div id="mobile-filter-panel" className="mt-4 glass-card-elevated rounded-2xl component-spacing relative z-20">
              <div className="flex flex-col gap-6 relative z-20">
                <div className="relative z-30">
                  <label className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', display: 'block' }}>
                    Hospital
                  </label>
                  <Dropdown
                    options={hospitalOptions}
                    value={selectedHospitalId}
                    onChange={handleHospitalChange}
                    placeholder="Select Hospital"
                    className="w-full"
                  />
                </div>
                
                <div className="relative z-20" style={{ overflow: 'visible' }}>
                  <label className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', display: 'block' }}>
                    Year
                  </label>
                  <Dropdown
                    options={yearOptions}
                    value={selectedYear.toString()}
                    onChange={(value) => handleYearChange(parseInt(value))}
                    placeholder="Select Year"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Key Performance Indicators Section */}
        <section aria-labelledby="kpi-heading" className="section-spacing">
          <h2 
            id="kpi-heading"
            className="heading-2 text-center mb-10"
          >
            Key Performance Indicators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive-md">
            {currentData.financialMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>

        <Suspense fallback={<LoadingSpinner text="Loading charts..." />}>
          {/* Enhanced Charts Section */}
          <section className="section-spacing" aria-labelledby="charts-heading">
            <h2 id="charts-heading" className="sr-only">Financial Data Visualization</h2>
            
            {/* Revenue Chart - Full Width */}
            <div className="w-full mb-8">
              <RevenueChart data={currentData.revenueData} availableYears={availableYears} />
            </div>

            {/* Responsive charts - stacked on mobile, side-by-side on larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-responsive-md">
              <ExpensePieChart data={currentData.expenseBreakdown} />
              <CashFlowChart data={currentData.cashFlowData} />
            </div>
          </section>

          {/* Patient Metrics Section */}
          <section className="section-spacing" aria-labelledby="patient-metrics-heading">
            <h2 id="patient-metrics-heading" className="sr-only">Patient Metrics</h2>
            <PatientMetricsCard metrics={currentData.patientMetrics} />
          </section>

          {/* Department Performance Section */}
          <section className="section-spacing" aria-labelledby="department-performance-heading">
            <h2 id="department-performance-heading" className="sr-only">Department Performance</h2>
            <DepartmentTable departments={currentData.departmentFinances} />
          </section>

          {/* Enhanced GP Spec Features Section */}
          <section className="section-spacing" aria-labelledby="enhanced-features-heading">
            <h2 
              id="enhanced-features-heading" 
              className="heading-2 text-center mb-10"
            >
              Enhanced Financial Analysis
            </h2>
            
            {/* Enhanced Revenue Analysis */}
            <div className="mb-8">
              <EnhancedRevenueChart 
                data={[{
                  year: selectedYear.toString(),
                  totalRevenue: currentData.financialMetrics[0]?.value || 0,
                  breakdown: currentData.revenueBreakdown
                }]}
              />
            </div>

            {/* EBIDA Analysis */}
            <div className="mb-8">
              <EBIDACalculator 
                data={currentData.ebidaMetrics}
                historicalData={[{
                  ...currentData.ebidaMetrics,
                  year: selectedYear.toString()
                }]}
              />
            </div>

            {/* Contextual Events Timeline */}
            <div className="mb-8">
              <ContextualEventsTimeline 
                events={currentData.contextualEvents}
                onEventSelect={(event) => {
                  logger.info('Event selected', { 
                    context: 'Dashboard', 
                    data: { eventId: event.id, eventTitle: event.title } 
                  });
                }}
              />
            </div>

            {/* Enhanced Expense Analysis */}
            <div className="mb-8">
              <EnhancedExpenseAnalysis 
                data={currentData.enhancedExpenseBreakdown}
                onCategorySelect={(category) => {
                  logger.info('Expense category selected', { 
                    context: 'Dashboard', 
                    data: { category } 
                  });
                }}
              />
            </div>

            {/* Financial Assets Dashboard */}
            <div className="mb-8">
              <FinancialAssetsDashboard 
                assets={currentData.financialAssets}
                bondRatings={currentData.bondRatings}
                onAssetSelect={(asset) => {
                  logger.info('Asset category selected', { 
                    context: 'Dashboard', 
                    data: { asset } 
                  });
                }}
              />
            </div>

            {/* Enhanced Donation Tracking */}
            <div className="mb-8">
              <EnhancedDonationTracking 
                data={currentData.donationData}
                onCategorySelect={(category) => {
                  logger.info('Donation category selected', { 
                    context: 'Dashboard', 
                    data: { category } 
                  });
                }}
              />
            </div>

            {/* Peer Comparison Analysis */}
            <div className="mb-8">
              <PeerComparison 
                currentHospitalData={currentData}
                peerHospitalData={hospitals
                  .filter(h => h.id !== selectedHospitalId)
                  .map(h => getHospitalData(h.id, selectedYear))
                  .filter(Boolean) as HospitalData[]}
              />
            </div>

            {/* Drill-Down Analysis */}
            <div className="chart-container mb-8">
              <DrillDownAnalysis 
                data={currentData}
                onDrillDown={(level, category) => {
                  logger.info('Drill-down navigation', { 
                    context: 'Dashboard', 
                    data: { level, category } 
                  });
                }}
              />
            </div>
          </section>
        </Suspense>

          {/* Enhanced Footer */}
          <footer className="section-spacing">
            <div className="chart-container footer-card" style={{ borderRadius: 'var(--radius-lg)' }}>
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-center sm:text-left">
                <p className="text-tertiary font-medium" style={{ 
                  fontSize: 'var(--text-base)', 
                  lineHeight: '1.4',
                  margin: 0 
                }}>
                  © 2024 Hospital Finance Dashboard.<br />All rights reserved.
                </p>
                <p className="text-tertiary font-medium sm:text-right sm:whitespace-nowrap" style={{ 
                  fontSize: 'var(--text-sm)', 
                  lineHeight: '1.4',
                  margin: 0 
                }}>
                  Last updated: {currentData.lastUpdated}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

