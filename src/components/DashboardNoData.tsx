import React from 'react';
import Header from './Header';
import { Hospital } from '../types/finance';
import { User } from '../types/auth';

interface DashboardNoDataProps {
  hospitals: Hospital[];
  selectedHospitalId: string;
  selectedYear: number;
  availableYears: number[];
  onHospitalChange: (hospitalId: string) => void;
  onYearChange: (year: number) => void;
  user: User | null;
  signOut: () => void;
}

/**
 * Renders the "no data" state of the dashboard.
 *
 * @param {DashboardNoDataProps} props The component props.
 * @returns {React.ReactElement} The rendered "no data" state.
 */
const DashboardNoData: React.FC<DashboardNoDataProps> = ({
  hospitals,
  selectedHospitalId,
  selectedYear,
  availableYears,
  onHospitalChange,
  onYearChange,
}) => {
  return (
    <div className="text-gray-900 dark:text-gray-100">
      <Header
        hospitals={hospitals}
        selectedHospitalId={selectedHospitalId}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onHospitalChange={onHospitalChange}
        onYearChange={onYearChange}
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
};

export default DashboardNoData;
