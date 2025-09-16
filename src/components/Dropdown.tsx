import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  subtitle?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      ref={dropdownRef} 
      className={`relative ${className}`}
    >
      <button
        type="button"
        className="w-full bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border rounded-lg px-4 py-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 transform hover:-translate-y-0.5"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            {selectedOption ? (
              <div className="min-w-0">
                <div className="font-medium text-gray-900 dark:text-white truncate">{selectedOption.label}</div>
                {selectedOption.subtitle && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{selectedOption.subtitle}</div>
                )}
              </div>
            ) : (
              <span className="text-gray-500 dark:text-gray-400 truncate">{placeholder}</span>
            )}
          </div>
          <div className="ml-2 flex-shrink-0">
            <svg
              className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      <div 
        className={`absolute w-full mt-1 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg shadow-2xl max-h-60 overflow-auto transition-all duration-300 ease-in-out z-50 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        role="listbox"
      >
        {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 transition-colors duration-150 ${
                option.value === value ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500' : ''
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              <div className="min-w-0">
                <div className="font-medium text-gray-900 dark:text-white truncate">{option.label}</div>
                {option.subtitle && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{option.subtitle}</div>
                )}
              </div>
            </button>
          ))}
        </div>
    </div>
  );
};

export default Dropdown;
