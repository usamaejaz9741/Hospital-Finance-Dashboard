import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import ThemeToggle from './ThemeToggle';
import { Hospital } from '../types/finance';
import { useAuth } from '../hooks/useAuth';
import { roleDescriptions } from '../data/mockUsers';
import { getAvatarUrl, generateLocalAvatar } from '../utils/avatarGenerator';

// Generate consistent background colors for users - Purple only
const getUserAvatarColor = (name: string): string => {
  const colors = [
    'a855f7', // Bright purple
    '8b5cf6', // Purple
    'c084fc', // Light lavender
    'd8b4fe', // Pale purple
    '9333ea', // Rich purple
    '7c3aed', // Deep purple
    'e9d5ff', // Very light purple
    'f3e8ff', // Lightest purple
    '6b21a8', // Dark purple
    '581c87', // Darkest purple
    '4c1d95', // Very dark purple
    '3b0764', // Deepest purple
    '2e1065', // Ultra dark purple
    '5b4b8a', // Medium purple
    '4c3d7a', // Dark medium purple
  ];
  
  // Generate hash from name for consistent color selection
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex] || 'a855f7'; // Fallback to purple
};

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // Local filter state to prevent immediate updates
  const [localHospitalId, setLocalHospitalId] = useState(selectedHospitalId);
  const [localYear, setLocalYear] = useState(selectedYear);

  // Sync local state when props change (for initial load or external changes)
  useEffect(() => {
    setLocalHospitalId(selectedHospitalId);
  }, [selectedHospitalId]);

  useEffect(() => {
    setLocalYear(selectedYear);
  }, [selectedYear]);

  // Apply filters function
  const applyFilters = () => {
    onHospitalChange(localHospitalId);
    onYearChange(localYear);
    setIsFilterMenuOpen(false);
  };

  // Check if filters have changed
  const hasFilterChanges = localHospitalId !== selectedHospitalId || localYear !== selectedYear;

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

  // Handle click outside for user menu and filter menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isUserMenuOpen && !target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false);
      }
      if (isFilterMenuOpen && !target.closest('[data-filter-menu]')) {
        setIsFilterMenuOpen(false);
      }
    };

    if (isUserMenuOpen || isFilterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isFilterMenuOpen]);
  const hospitalOptions = hospitals.map(hospital => ({
    value: hospital.id,
    label: hospital.name,
    subtitle: `${hospital.type} • ${hospital.location}`
  }));

  const yearOptions = availableYears.map(year => ({
    value: year.toString(),
    label: year.toString()
  }));


  return (
    <header 
      className="header-glass sticky top-0 z-40 border-b-0 relative" 
    >
      <div className="page-container relative" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="flex items-center justify-between min-h-16 py-4 gap-4 relative">
          {/* Logo and Brand Name - Left Side */}
          <div className="flex items-center min-w-0 flex-shrink">
            <div className="flex items-center gap-3 min-w-0">
              {/* Enhanced Animated Logo */}
              <div className="relative flex-shrink-0">
                <div className="logo-container w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow shadow-lg transition-all duration-300 interactive-element">
                  <svg className="w-5 h-5 relative z-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              {/* Mobile-optimized branding */}
              <div className="min-w-0">
                <h1 className="heading-4 truncate block sm:hidden" style={{ color: 'var(--color-text-primary)', marginBottom: '0', fontSize: 'var(--text-lg)' }}>
                  Hospital Finance
                </h1>
                <h1 className="heading-4 truncate hidden sm:block" style={{ color: 'var(--color-text-primary)', marginBottom: '0' }}>
                  Hospital Financial Dashboard
                </h1>
                <p className="text-caption hidden lg:block truncate" style={{ color: 'var(--color-text-muted)', marginBottom: '0' }}>
                  Real-time financial insights & analytics
                </p>
              </div>
            </div>
          </div>

          {/* All Controls - Right Side */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Current Filter Indicators */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-lg" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-secondary)'
              }}>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" style={{ color: 'var(--color-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    {hospitals.find(h => h.id === selectedHospitalId)?.name || 'No Hospital'}
                  </span>
                </div>
                <div className="w-px h-4" style={{ backgroundColor: 'var(--border-secondary)' }}></div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" style={{ color: 'var(--color-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedYear}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0" data-filter-menu>
              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="btn-base btn-secondary btn-sm flex items-center gap-2"
                  aria-label="Open filters menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  <span className="hidden xl:inline">Filters</span>
                  <svg className="w-4 h-4 transition-transform" style={{ 
                    transform: isFilterMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Filter Dropdown Menu */}
                {isFilterMenuOpen && (
                  <div 
                    className="absolute left-0 top-full mt-2 min-w-max rounded-lg shadow-xl z-50 gradient-bg-primary"
                    style={{
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid var(--border-secondary)',
                      borderRadius: 'var(--radius-md)',
                      minWidth: '320px'
                    }}
                  >
                    {/* Filter Header */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-secondary)' }}>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                        </svg>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                          Filter Data
                        </span>
                      </div>
                    </div>
                    
                    {/* Filter Options */}
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="text-overline block mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                          Hospital
                        </label>
                        <Dropdown
                          options={hospitalOptions}
                          value={localHospitalId}
                          onChange={setLocalHospitalId}
                          placeholder="Select Hospital"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="text-overline block mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                          Year
                        </label>
                        <Dropdown
                          options={yearOptions}
                          value={localYear.toString()}
                          onChange={(value) => setLocalYear(parseInt(value))}
                          placeholder="Select Year"
                          className="w-full"
                        />
                      </div>
                      
                      {/* Apply Filters Button */}
                      <div className="pt-2 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
                        <button
                          onClick={applyFilters}
                          disabled={!hasFilterChanges}
                          className={`w-full btn-base ${hasFilterChanges ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'} btn-sm`}
                          aria-label="Apply selected filters"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Highlighted Generate Analysis Button */}
            <button
              className="btn-base btn-primary btn-sm"
              aria-label="Generate AI-powered financial analysis"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
              </svg>
              <span className="hidden xl:inline ml-2">Generate Analysis</span>
            </button>
            </div>
            
            {/* Theme Toggle and User Menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />
              
              {user && (
                <div className="relative" data-user-menu>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors interactive"
                    aria-label="User menu"
                  >
                    <div className="avatar-circle w-8 h-8 border-2 shadow-lg bg-white/10 backdrop-blur-sm" style={{ borderColor: 'var(--border-secondary)' }}>
                      <img 
                        src={getAvatarUrl(user.name, 32, { backgroundColor: getUserAvatarColor(user.name) })}
                        alt={`${user.name} profile picture`}
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to local avatar on error
                          const target = e.target as HTMLImageElement;
                          target.src = generateLocalAvatar(user.name, 32);
                        }}
                      />
                    </div>
                    
                    <svg className="w-4 h-4 transition-transform" style={{ 
                      color: 'var(--color-text-secondary)',
                      transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div 
                      className="absolute right-0 top-full mt-2 min-w-max rounded-lg shadow-xl z-50 gradient-bg-primary"
                      style={{
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid var(--border-secondary)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      {/* User Info */}
                      <div className="px-3 py-2.5 border-b" style={{ borderColor: 'var(--border-secondary)' }}>
                        <p className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--color-text-primary)' }}>
                          {user.name}
                        </p>
                        <p className="text-xs whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                          {roleDescriptions[user.role]?.title || user.role}
                        </p>
                      </div>
                      
                      {/* Menu Options */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-2 whitespace-nowrap"
                          style={{ color: 'var(--color-text-primary)' }}
                          aria-label="Export financial report"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Export Report
                        </button>
                        <button
                          onClick={() => {
                            signOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-2 whitespace-nowrap"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3 flex-shrink-0">
            <ThemeToggle size="sm" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn-base btn-secondary btn-sm w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-105"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1))',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
            >
              <svg className="w-5 h-5 transition-transform duration-300" style={{ 
                transform: isMobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                color: 'var(--color-text-primary)'
              }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile full-screen menu with full background */}
      <div
        className={`xl:hidden fixed inset-0 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="mobile-menu"
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.98) 0%, rgba(168, 85, 247, 0.98) 50%, rgba(196, 132, 252, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between py-4" style={{ paddingLeft: 'var(--space-4)', paddingRight: 'var(--space-4)' }}>
          {/* Logo and Brand Name - Left Side */}
          <div className="flex items-center min-w-0 flex-shrink">
            <div className="flex items-center gap-3 min-w-0">
              {/* Enhanced Animated Logo */}
              <div className="relative flex-shrink-0">
                <div className="logo-container w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow shadow-lg transition-all duration-300 interactive-element">
                  <svg className="w-5 h-5 relative z-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="logo-gradient-sidemenu" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              
              {/* Mobile-optimized branding */}
              <div className="min-w-0">
                <h1 className="heading-4 truncate" style={{ color: 'var(--color-text-primary)', marginBottom: '0', fontSize: 'var(--text-lg)' }}>
                  Hospital Finance
                </h1>
              </div>
            </div>
          </div>

          {/* Close Button - Right Side */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-base btn-secondary btn-sm w-12 h-12 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center" 
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Enhanced Content */}
        <div className="flex flex-col h-full w-full" style={{ paddingLeft: 'var(--space-4)', paddingRight: 'var(--space-4)' }}>
          <div className="flex-1 overflow-y-auto py-4 space-y-6 w-full">
            {/* Enhanced User Profile Section */}
            <div className="rounded-2xl p-6 border" style={{ borderColor: 'var(--border-secondary)' }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="avatar-gradient-border w-16 h-16 rounded-full p-0.5 shadow-2xl">
                    <div className="avatar-circle w-full h-full rounded-full" style={{ backgroundColor: '#ffffff' }}>
                      <img 
                        src={getAvatarUrl(user?.name || '', 60, { backgroundColor: getUserAvatarColor(user?.name || '') })}
                        alt={`${user?.name} profile picture`}
                        loading="lazy"
                        className="rounded-full"
                        onError={(e) => {
                          // Fallback to local avatar on error
                          const target = e.target as HTMLImageElement;
                          target.src = generateLocalAvatar(user?.name || '', 60);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</h3>
                  <p className="text-sm text-white truncate font-medium">
                    {user?.role && roleDescriptions[user.role]?.title || user?.role?.replace('_', ' ')}
                  </p>
                </div>
              </div>
                  
              {/* Enhanced Sign Out Button */}
              <button
                onClick={signOut}
                className="btn-base btn-secondary btn-md w-full flex items-center justify-center group"
                aria-label="Sign out of your account"
              >
                <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>

            {/* Enhanced Actions Section */}
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 gap-4">
                <button 
                  className="btn-base btn-secondary btn-sm w-full flex items-center justify-center"
                  aria-label="Export financial report"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Report
                </button>
                
            <button
              className="btn-base btn-secondary btn-sm w-full flex items-center justify-center"
              aria-label="Generate AI-powered financial analysis"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
              </svg>
              Generate Analysis
            </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

