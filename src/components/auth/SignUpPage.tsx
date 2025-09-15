import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole, SignUpData } from '../../types/auth';
import { hospitals } from '../../data/mockData';
import { roleDescriptions } from '../../data/mockUsers';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Button from '../Button';

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
  const { signUp, isLoading } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-dark-bg dark:to-slate-900 flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="mt-2 text-gray-600 dark:text-dark-muted">Join the Hospital Finance Dashboard</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              id="name"
              type="text"
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
            />

            <Input
              id="email"
              type="email"
              label="Email Address"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
            />

            <Input
              id="password"
              type="password"
              label="Password"
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a password"
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
            />

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
                      disabled={role === 'admin'}
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

            <Button type="submit" isLoading={isLoading} fullWidth>
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-dark-muted">
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
        </Card>

        <div className="text-center text-xs text-gray-500 dark:text-dark-muted">
          <p>© 2024 Hospital Finance Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
