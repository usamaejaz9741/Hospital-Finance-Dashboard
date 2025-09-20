import React from 'react';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import { Hospital } from '../types/finance';
import { User } from '../types/auth';

interface DashboardLoadingProps {
  hospitals: Hospital[];
  selectedHospitalId: string;
  selectedYear: number;
  availableYears: number[];
  onHospitalChange: (hospitalId: string) => void;
  onYearChange: (year: number) => void;
  user: User | null;
  signOut: () => void;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({
  hospitals,
  selectedHospitalId,
  selectedYear,
  availableYears,
  onHospitalChange,
  onYearChange,
}) => {
  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId);

  return (
    <div className="text-white dark:text-white">
      <Header
        hospitals={hospitals}
        selectedHospitalId={selectedHospitalId}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onHospitalChange={onHospitalChange}
        onYearChange={onYearChange}
      />
      
      <main>
        <LoadingSpinner
          size="md"
          text="Loading dashboard data..."
          subtext={selectedHospital ? `${selectedHospital.name} • ${selectedYear}` : ''}
          className="min-h-96"
        />
      </main>
    </div>
  );
};

export default DashboardLoading;
