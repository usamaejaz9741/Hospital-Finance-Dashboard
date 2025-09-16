import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, type, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const isPassword = type === 'password';
  const currentType = isPassword ? (isPasswordVisible ? 'text' : 'password') : type;

  return (
    <div className="relative">
      <input
        id={id}
        type={currentType}
        className="w-full px-3 py-2 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
        {...props}
        placeholder={props.placeholder || ' '}
      />
      <label 
        htmlFor={id} 
        className="absolute left-3 -top-3.5 text-sm text-gray-600 dark:text-gray-400 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary-600 dark:peer-focus:text-primary-400"
      >
        {label}
      </label>
      {isPassword && (
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          {isPasswordVisible ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m0 0l-2.14 2.14" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
