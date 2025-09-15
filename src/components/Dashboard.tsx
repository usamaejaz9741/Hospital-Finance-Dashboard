import React, { useState, useEffect } from 'react';
import Header from './Header';
import MetricCard from './MetricCard';
import RevenueChart from './RevenueChart';
import DepartmentTable from './DepartmentTable';
import ExpensePieChart from './ExpensePieChart';
import PatientMetricsCard from './PatientMetricsCard';
import CashFlowChart from './CashFlowChart';
import {
  hospitals,
  availableYears,
  getHospitalData
} from '../data/mockData';
import { HospitalData } from '../types/finance';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { getAccessibleHospitals, canAccessHospital } = useAuth();
  const accessibleHospitals = getAccessibleHospitals();
  const filteredHospitals = hospitals.filter(h => accessibleHospitals.includes(h.id));
  
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(
    accessibleHospitals[0] || ''
  );
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [currentData, setCurrentData] = useState<HospitalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Update data when hospital or year changes
  useEffect(() => {
    if (selectedHospitalId && selectedYear) {
      setIsLoading(true);
      
      // Simulate loading delay for better UX
      const timeout = setTimeout(() => {
        const data = getHospitalData(selectedHospitalId, selectedYear);
        setCurrentData(data || null);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [selectedHospitalId, selectedYear]);

  const handleHospitalChange = (hospitalId: string) => {
    // Check if user has access to the selected hospital
    if (canAccessHospital(hospitalId)) {
      setSelectedHospitalId(hospitalId);
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  if (isLoading) {
    return (
      <div className="text-gray-900 dark:text-gray-100">
        <Header
          hospitals={filteredHospitals}
          selectedHospitalId={selectedHospitalId}
          selectedYear={selectedYear}
          availableYears={availableYears}
          onHospitalChange={handleHospitalChange}
          onYearChange={handleYearChange}
        />
        
        <main className="p-4 sm:p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Loading dashboard data...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {hospitals.find(h => h.id === selectedHospitalId)?.name} • {selectedYear}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentData) {
    return (
      <div className="text-gray-900 dark:text-gray-100">
        <Header
          hospitals={filteredHospitals}
          selectedHospitalId={selectedHospitalId}
          selectedYear={selectedYear}
          availableYears={availableYears}
          onHospitalChange={handleHospitalChange}
          onYearChange={handleYearChange}
        />
        
        <main className="p-4 sm:p-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data Available</h3>
            <p className="text-gray-600 dark:text-gray-300">
              No financial data found for the selected hospital and year combination.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Please select a different hospital or year.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <Header
        hospitals={filteredHospitals}
        selectedHospitalId={selectedHospitalId}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onHospitalChange={handleHospitalChange}
        onYearChange={handleYearChange}
      />
      
      <main className="p-4 sm:p-6">
        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Financial Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentData.financialMetrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RevenueChart data={currentData.revenueData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ExpensePieChart data={currentData.expenseBreakdown} />
          <CashFlowChart data={currentData.cashFlowData} />
        </div>

        {/* Patient Metrics */}
        <div className="mb-8">
          <PatientMetricsCard metrics={currentData.patientMetrics} />
        </div>

        {/* Department Performance */}
        <div className="mb-8">
          <DepartmentTable departments={currentData.departmentFinances} />
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
          <p>© 2024 Hospital Finance Dashboard. All rights reserved.</p>
          <p className="mt-1">Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;

