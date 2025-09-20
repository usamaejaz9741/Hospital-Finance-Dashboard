import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { UserRole, SignUpData } from '../../types/auth';
import { hospitals } from '../../data/mockData';
import { roleDescriptions } from '../../data/mockUsers';
import Dropdown from '../Dropdown';

interface SignUpPageProps {
  onSwitchToSignIn: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'branch_owner' as UserRole,
    hospitalId: '',
    hospitalIds: [] as string[]
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, isLoading } = useAuth();
  const { resolvedTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.role === 'branch_owner' && !formData.hospitalId) {
      setError('Please select a hospital for branch manager role');
      return;
    }

    if (formData.role === 'hospital_owner' && formData.hospitalIds.length === 0) {
      setError('Please select at least one hospital for hospital owner role');
      return;
    }

    try {
      const signUpData: SignUpData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'branch_owner' && formData.hospitalId) {
        signUpData.hospitalId = formData.hospitalId;
      }
      
      if (formData.role === 'hospital_owner' && formData.hospitalIds.length > 0) {
        signUpData.hospitalIds = formData.hospitalIds;
      }

      await signUp(signUpData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHospitalSelection = (hospitalId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        hospitalIds: [...prev.hospitalIds, hospitalId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        hospitalIds: prev.hospitalIds.filter(id => id !== hospitalId)
      }));
    }
  };

  return (
    <div className="min-h-screen text-white dark:text-white relative flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background with glassmorphism */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob-container">
          <div className="blob blob-center"></div>
        </div>
      </div>
      
      <div className="max-w-lg w-full relative z-10">
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="flex justify-center mb-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center animate-pulse-glow shadow-lg transition-all duration-300 interactive-element"
              style={{
                background: resolvedTheme === 'light' 
                  ? 'white' 
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.3))',
                border: resolvedTheme === 'light' 
                  ? '2px solid rgba(139, 92, 246, 0.2)' 
                  : '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <svg className="w-8 h-8 relative z-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="logo-gradient-signup" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  stroke={resolvedTheme === 'light' ? "url(#logo-gradient-signup)" : "white"} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Create an Account</h2>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Join the Hospital Finance Dashboard</p>
        </div>

        <div className="glass-card rounded-xl animate-fade-in-up component-spacing-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="glass-card rounded-lg" style={{ 
                padding: 'var(--space-4)',
                background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'rgba(239, 68, 68, 0.9)'
              }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="body-small font-medium">{error}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 form-input-focus interactive"
                  style={{
                    border: '1px solid var(--border-secondary)',
                  }}
                />
              </div>

              <div>
                <label className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 form-input-focus interactive"
                  style={{
                    border: '1px solid var(--border-secondary)',
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 pr-12 rounded-lg border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 form-input-focus interactive"
                    style={{
                      border: '1px solid var(--border-secondary)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 pr-12 rounded-lg border-0 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 form-input-focus interactive"
                    style={{
                      border: '1px solid var(--border-secondary)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', display: 'block' }}>
                Account Type
              </label>
              <div className="flex flex-col gap-3">
                {(Object.keys(roleDescriptions) as UserRole[]).map((role) => (
                  <div key={role} className="glass-card rounded-lg p-3 interactive" style={{ 
                    background: formData.role === role ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${formData.role === role ? 'var(--brand-primary)' : 'var(--border-secondary)'}`,
                    opacity: role === 'admin' ? 0.5 : 1
                  }}>
                    <div className="flex items-start">
                      <input
                        id={role}
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
                        className="custom-radio mt-1"
                        disabled={role === 'admin'}
                      />
                      <div className="ml-3">
                        <label htmlFor={role} className="body-base font-medium form-label-interactive" style={{ color: 'var(--color-text-primary)', display: 'block' }}>
                          {roleDescriptions[role].title}
                          {role === 'admin' && <span style={{ color: 'var(--color-text-muted)' }} className="ml-2">(Contact admin)</span>}
                        </label>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                          {roleDescriptions[role].description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {formData.role === 'branch_owner' && (
              <div>
                <label className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>
                  Select Hospital
                </label>
                <Dropdown
                  options={hospitals.map(hospital => ({
                    value: hospital.id,
                    label: hospital.name,
                    subtitle: `${hospital.type} • ${hospital.location}`
                  }))}
                  value={formData.hospitalId}
                  onChange={(value) => handleInputChange('hospitalId', value)}
                  placeholder="Choose a hospital..."
                  className="w-full"
                />
              </div>
            )}

            {formData.role === 'hospital_owner' && (
              <div>
                <label className="text-label" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>
                  Select Hospitals (you can select multiple)
                </label>
                <div className="flex flex-col gap-2 max-h-32 overflow-y-auto glass-card rounded-lg p-3">
                  {hospitals.map((hospital) => (
                    <div key={hospital.id} className="flex items-center p-2 rounded hover:bg-white/5 transition-colors">
                      <input
                        id={`hospital-${hospital.id}`}
                        type="checkbox"
                        checked={formData.hospitalIds.includes(hospital.id)}
                        onChange={(e) => handleHospitalSelection(hospital.id, e.target.checked)}
                        className="custom-checkbox"
                      />
                      <label htmlFor={`hospital-${hospital.id}`} className="ml-2 text-sm form-label-interactive" style={{ color: 'var(--color-text-primary)' }}>
                        {hospital.name}
                        <span style={{ color: 'var(--color-text-muted)' }} className="ml-1">({hospital.type} • {hospital.location})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-base btn-primary btn-lg w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span style={{ color: 'white' }}>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="mt-6">
              <div className="glass-card rounded-lg p-4">
                <p className="text-sm mb-3 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                  Already have an account?
                </p>
                <button
                  type="button"
                  onClick={onSwitchToSignIn}
                  className="btn-base btn-secondary btn-md w-full interactive"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="text-center text-xs mt-8 animate-fade-in-up animation-delay-200" style={{ color: 'var(--color-text-muted)' }}>
          <p>© 2024 Hospital Finance Dashboard.<br />All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
