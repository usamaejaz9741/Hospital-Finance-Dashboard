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
import Button from './Button';
import DashboardLoading from './DashboardLoading';
import DashboardNoData from './DashboardNoData';
import LoadingSpinner from './LoadingSpinner';

const RevenueChart = lazy(() => import('./RevenueChart'));
const ExpensePieChart = lazy(() => import('./ExpensePieChart'));
const CashFlowChart = lazy(() => import('./CashFlowChart'));
const PatientMetricsCard = lazy(() => import('./PatientMetricsCard'));
const DepartmentTable = lazy(() => import('./DepartmentTable'));

/**
 * Main dashboard component for displaying hospital financial data and analytics.
 * 
 * This component serves as the central hub for hospital financial management, providing:
 * - Role-based access control for multi-hospital environments
 * - Interactive financial metrics and KPIs
 * - Dynamic data visualization with charts and tables
 * - Responsive design with mobile-friendly filters
 * - Lazy-loaded components for optimal performance
 * 
 * @component
 * @example
 * ```tsx
 * // Used within the main App component after authentication
 * <Dashboard />
 * ```
 * 
 * @returns {React.ReactElement} The complete dashboard interface with financial data
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
   * Includes loading state management and error handling.
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (selectedHospitalId && selectedYear) {
      setIsLoading(true);
      logger.info('Loading dashboard data', {
        context: 'Dashboard',
        data: { hospitalId: selectedHospitalId, year: selectedYear }
      });
      
      // Simulate loading delay for better UX and to show loading states
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

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [selectedHospitalId, selectedYear]);

  /**
   * Handles hospital selection change with access control validation.
   * Only allows users to select hospitals they have permission to access.
   * 
   * @param hospitalId - The ID of the hospital to select
   */
  const handleHospitalChange = useCallback((hospitalId: string) => {
    // Validate user access before allowing hospital change
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
   * 
   * @param year - The year to select for data display
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
    <div className="text-gray-900 dark:text-dark-primary relative">
      <Header
        hospitals={filteredHospitals}
        selectedHospitalId={selectedHospitalId}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onHospitalChange={handleHospitalChange}
        onYearChange={handleYearChange}
      />
      
      <main className="p-3 sm:p-4 lg:p-6 xl:p-8 max-w-screen-2xl mx-auto">
        {/* Responsive Filter Bar */}
        <div className="xl:hidden mb-4">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
            aria-expanded={showFilters}
            aria-controls="mobile-filter-panel"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>

          {showFilters && (
            <div id="mobile-filter-panel" className="mt-4 p-4 bg-white dark:bg-dark-surface rounded-lg shadow-md border border-gray-200 dark:border-dark-border">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
        
        {/* Key Metrics */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Financial Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {currentData.financialMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner text="Loading charts..." />}>
          {/* Charts Section */}
          <div className="space-y-6 lg:space-y-8 mb-6 lg:mb-8">
            {/* Revenue Chart - Full Width */}
            <div className="w-full">
              <RevenueChart data={currentData.revenueData} />
            </div>

            {/* Side-by-side charts on larger screens */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              <ExpensePieChart data={currentData.expenseBreakdown} />
              <CashFlowChart data={currentData.cashFlowData} />
            </div>
          </div>

          {/* Patient Metrics */}
          <div className="mb-6 lg:mb-8">
            <PatientMetricsCard metrics={currentData.patientMetrics} />
          </div>

          {/* Department Performance */}
          <div className="mb-6 lg:mb-8">
            <DepartmentTable departments={currentData.departmentFinances} />
          </div>
        </Suspense>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
          <p>© 2024 Hospital Finance Dashboard. All rights reserved.</p>
          <p className="mt-1">Last updated: {currentData.lastUpdated}</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;

