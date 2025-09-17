import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import ThemeToggle from './ThemeToggle';
import { Hospital } from '../types/finance';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  hospitals: Hospital[];
  selectedHospitalId: string;
  selectedYear: number;
  availableYears: number[];
  onHospitalChange: (hospitalId: string) => void;
  onYearChange: (year: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  hospitals,
  selectedHospitalId,
  selectedYear,
  availableYears,
  onHospitalChange,
  onYearChange
}) => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  const hospitalOptions = hospitals.map(hospital => ({
    value: hospital.id,
    label: hospital.name,
    subtitle: `${hospital.type} • ${hospital.location}`
  }));

  const yearOptions = availableYears.map(year => ({
    value: year.toString(),
    label: year.toString()
  }));

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId);

  return (
    <header data-testid="header" className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border transition-colors duration-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        {/* Desktop Header */}
        <div className="flex items-center justify-between min-h-16 py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold">
                Hospital Finance Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-muted">
                {selectedHospital ? `${selectedHospital.name} • ${selectedYear}` : 'Real-time financial insights and analytics'}
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold">Dashboard</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-6">
            {/* Dropdowns */}
            <div className="flex items-end space-x-2 sm:space-x-4 min-w-0">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Hospital
                </label>
                <Dropdown
                  options={hospitalOptions}
                  value={selectedHospitalId}
                  onChange={onHospitalChange}
                  placeholder="Select Hospital"
                  className="w-full sm:w-64"
                />
              </div>
              
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Year
                </label>
                <Dropdown
                  options={yearOptions}
                  value={selectedYear.toString()}
                  onChange={(value) => onYearChange(parseInt(value))}
                  placeholder="Select Year"
                  className="w-full sm:w-40"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <button 
                className="btn-secondary text-sm hidden 2xl:inline-flex"
                aria-label="Export financial report"
              >
                Export Report
              </button>
              <button 
                className="btn-primary text-sm hidden 2xl:inline-flex"
                aria-label="Generate financial analysis"
              >
                Generate Analysis
              </button>
            </div>
            
            {/* User Section */}
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200 dark:border-dark-border">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-gray-500 dark:text-dark-muted capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
              <button
                onClick={signOut}
                className="ml-2 text-gray-400 hover:text-danger-600 dark:text-gray-500 dark:hover:text-danger-400 transition-colors"
                title="Sign out"
                aria-label="Sign out of your account"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center space-x-2">
            <ThemeToggle size="sm" />
            <button
              type="button"
              className="p-2 rounded-md text-gray-900 dark:text-gray-100 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 border border-gray-300 dark:border-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile full-screen menu */}
        <div
          className={`xl:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Full-screen menu */}
          <div
            className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            id="mobile-menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">Menu</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* User Info */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize truncate">
                        {user?.role.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Sign Out Button - Close to user info */}
                  <button
                    onClick={signOut}
                    className="w-full flex items-center justify-center px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium text-sm border border-red-200 dark:border-red-800"
                    aria-label="Sign out of your account"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>

                {/* Actions Section */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Actions</h3>
                  
                  <button 
                    className="w-full btn-secondary text-left justify-start"
                    aria-label="Export financial report"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Report
                  </button>
                  
                  <button 
                    className="w-full btn-primary text-left justify-start"
                    aria-label="Generate financial analysis"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Generate Analysis
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

