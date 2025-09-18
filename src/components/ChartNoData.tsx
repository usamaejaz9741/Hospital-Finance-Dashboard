import React from 'react';

interface ChartNoDataProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

const ChartNoData: React.FC<ChartNoDataProps> = ({ title, message, icon }) => {
  return (
    <div className="h-80 flex items-center justify-center">
      <div className="text-center" style={{ color: 'var(--color-text-muted)' }}>
        {icon && (
          <div className="w-16 h-16 mx-auto mb-4">
            {icon}
          </div>
        )}
        <p className="text-lg font-medium mb-2">{title}</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ChartNoData;
