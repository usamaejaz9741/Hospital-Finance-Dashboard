import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  subtext?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  subtext,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const spinnerSize = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full ${spinnerSize} border-b-2 border-primary-600 mx-auto mb-4`}></div>
        {text && (
          <p className="text-gray-600 dark:text-gray-300 font-medium">{text}</p>
        )}
        {subtext && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
