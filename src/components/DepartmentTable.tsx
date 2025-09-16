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
    <div className="bg-white dark:bg-dark-surface p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-dark-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Department Performance</h2>
        <button className="btn-secondary text-sm w-full sm:w-auto">
          View Details
        </button>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-dark-border">
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-dark-muted">Department</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-dark-muted">Revenue</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-dark-muted">Expenses</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-dark-muted">Profit</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-dark-muted">Margin</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={dept.department} className={`${index !== departments.length - 1 ? 'border-b border-gray-100 dark:border-dark-border' : ''} hover:bg-gray-50 dark:hover:bg-dark-hover-surface`}>
                <td className="py-3 px-4">
                  <div className="font-medium">{dept.department}</div>
                </td>
                <td className="py-3 px-4 text-right">
                  {formatCurrency(dept.revenue)}
                </td>
                <td className="py-3 px-4 text-right">
                  {formatCurrency(dept.expenses)}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-medium ${dept.profit > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {formatCurrency(dept.profit)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-medium ${dept.profitMargin > 20 ? 'text-success-600' : dept.profitMargin > 10 ? 'text-warning-600' : 'text-danger-600'}`}>
                    {formatPercentage(dept.profitMargin)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {departments.map((dept) => (
          <div key={dept.department} className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4">
            <div className="font-medium mb-3 text-lg">
              {dept.department}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-dark-muted">Revenue</div>
                <div className="font-medium">
                  {formatCurrency(dept.revenue)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-dark-muted">Expenses</div>
                <div className="font-medium">
                  {formatCurrency(dept.expenses)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-dark-muted">Profit</div>
                <div className={`font-medium ${dept.profit > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {formatCurrency(dept.profit)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-dark-muted">Margin</div>
                <div className={`font-medium ${dept.profitMargin > 20 ? 'text-success-600' : dept.profitMargin > 10 ? 'text-warning-600' : 'text-danger-600'}`}>
                  {formatPercentage(dept.profitMargin)}
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

