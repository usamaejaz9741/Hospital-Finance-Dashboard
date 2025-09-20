import React from 'react';
import { DepartmentFinance } from '../types/finance';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface DepartmentTableProps {
  departments: DepartmentFinance[];
}

/**
 * Renders a table displaying department financial performance.
 *
 * @param {DepartmentTableProps} props The component props.
 * @param {DepartmentFinance[]} props.departments The department data to display.
 * @returns {React.ReactElement} The rendered table.
 */
const DepartmentTable: React.FC<DepartmentTableProps> = ({ departments }) => {
  return (
    <div className="chart-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <h2 className="mobile-heading-scale font-bold gradient-text">Department Performance</h2>
        <button className="btn-base btn-secondary btn-sm w-full sm:w-auto">
          View Details
        </button>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 font-medium text-white/80">Department</th>
              <th className="text-right py-3 px-4 font-medium text-white/80">Revenue</th>
              <th className="text-right py-3 px-4 font-medium text-white/80">Expenses</th>
              <th className="text-right py-3 px-4 font-medium text-white/80">Profit</th>
              <th className="text-right py-3 px-4 font-medium text-white/80">Margin</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={dept.department} className={`${index !== departments.length - 1 ? 'border-b border-white/10' : ''} hover:bg-white/10 transition-colors duration-200`}>
                <td className="py-3 px-4">
                  <div className="font-medium text-white">{dept.department}</div>
                </td>
                <td className="py-3 px-4 text-right text-white">
                  {formatCurrency(dept.revenue)}
                </td>
                <td className="py-3 px-4 text-right text-white">
                  {formatCurrency(dept.expenses)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-medium ${dept.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(dept.profit)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-medium ${dept.profitMargin > 20 ? 'text-green-400' : dept.profitMargin > 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {formatPercentage(dept.profitMargin)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Mobile Card View */}
      <div className="lg:hidden space-y-3 sm:space-y-4">
        {departments.map((dept) => (
          <div key={dept.department} className="glass-card interactive" style={{ padding: 'var(--space-6)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-white text-base sm:text-lg">
                {dept.department}
              </div>
              <div className={`font-bold text-sm sm:text-base ${dept.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(dept.profit)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <div className="text-white/60 mb-1">Revenue</div>
                <div className="font-medium text-white">
                  {formatCurrency(dept.revenue)}
                </div>
              </div>
              <div>
                <div className="text-white/60 mb-1">Expenses</div>
                <div className="font-medium text-white">
                  {formatCurrency(dept.expenses)}
                </div>
              </div>
              <div>
                <div className="text-white/60 mb-1">Margin</div>
                <div className={`font-medium ${dept.profitMargin > 20 ? 'text-green-400' : dept.profitMargin > 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {formatPercentage(dept.profitMargin)}
                </div>
              </div>
              <div>
                <div className="text-white/60 mb-1">Status</div>
                <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                  dept.profitMargin > 20 
                    ? 'bg-green-500/20 text-green-400' 
                    : dept.profitMargin > 10 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {dept.profitMargin > 20 ? 'Excellent' : dept.profitMargin > 10 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentTable;

