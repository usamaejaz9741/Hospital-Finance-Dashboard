import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole, SignUpData } from '../../types/auth';
import { hospitals } from '../../data/mockData';
import { roleDescriptions } from '../../data/mockUsers';

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
  const { signUp, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Join the Hospital Finance Dashboard</p>
        </div>

        {/* Sign Up Form */}
        <form className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Account Type
            </label>
            <div className="space-y-3">
              {(Object.keys(roleDescriptions) as UserRole[]).map((role) => (
                <div key={role} className="flex items-start">
                  <input
                    id={role}
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    disabled={role === 'admin'} // Admin accounts are created differently
                  />
                  <div className="ml-3">
                    <label htmlFor={role} className="block text-sm font-medium text-gray-900 dark:text-white">
                      {roleDescriptions[role].title}
                      {role === 'admin' && <span className="text-gray-400 dark:text-gray-500 ml-2">(Contact admin)</span>}
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {roleDescriptions[role].description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital Selection */}
          {formData.role === 'branch_owner' && (
            <div>
              <label htmlFor="hospitalId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Hospital
              </label>
              <div className="relative">
                <select
                  id="hospitalId"
                  value={formData.hospitalId}
                  onChange={(e) => handleInputChange('hospitalId', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                  required
                >
                  <option value="">Choose a hospital...</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name} ({hospital.type} • {hospital.location})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {formData.role === 'hospital_owner' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Hospitals (you can select multiple)
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                {hospitals.map((hospital) => (
                  <div key={hospital.id} className="flex items-center">
                    <input
                      id={`hospital-${hospital.id}`}
                      type="checkbox"
                      checked={formData.hospitalIds.includes(hospital.id)}
                      onChange={(e) => handleHospitalSelection(hospital.id, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded"
                    />
                    <label htmlFor={`hospital-${hospital.id}`} className="ml-2 text-sm text-gray-900 dark:text-white">
                      {hospital.name}
                      <span className="text-gray-500 dark:text-gray-400 ml-1">({hospital.type} • {hospital.location})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© 2024 Hospital Finance Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
