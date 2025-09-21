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
      style={{ overflow: 'visible' }}
    >
      <button
        type="button"
        className="w-full dropdown-button text-secondary hover:text-primary text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 interactive"
        style={{
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-2) var(--space-4)'
        }}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            {selectedOption ? (
              <div className="min-w-0">
                <div className="body-base font-medium text-primary truncate" style={{ marginBottom: '0' }}>{selectedOption.label}</div>
                {selectedOption.subtitle && (
                  <div className="text-caption text-tertiary truncate" style={{ marginTop: 'var(--space-1)', marginBottom: '0' }}>{selectedOption.subtitle}</div>
                )}
              </div>
            ) : (
              <span className="body-base text-tertiary truncate">{placeholder}</span>
            )}
          </div>
          <div className="ml-2 flex-shrink-0">
            <svg
              className={`w-4 h-4 text-white/60 transition-transform duration-200 ${
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
        className={`dropdown-options gradient-bg-primary absolute w-full overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        role="listbox"
        style={{ 
          zIndex: 99999,
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          maxHeight: options.length > 4 ? '300px' : 'auto',
          marginTop: 'var(--space-2)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div className={options.length > 4 ? 'overflow-y-auto' : ''} style={{ maxHeight: options.length > 4 ? '300px' : 'auto' }}>
          {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`dropdown-option w-full text-left focus:outline-none transition-colors duration-150 interactive ${
                  option.value === value ? 'selected' : ''
                }`}
                style={{ padding: 'var(--space-2) var(--space-4)' }}
                onClick={() => handleOptionClick(option.value)}
                role="option"
                aria-selected={option.value === value}
              >
              <div className="min-w-0">
                <div className="font-medium truncate text-primary" style={{ fontSize: 'var(--text-base)' }}>{option.label}</div>
                {option.subtitle && (
                  <div className="text-tertiary truncate" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>{option.subtitle}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
