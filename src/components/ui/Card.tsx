import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-dark-surface rounded-lg shadow-lg p-8 space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
