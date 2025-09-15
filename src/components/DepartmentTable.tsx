import React from 'react';
import { DepartmentFinance } from '../types/finance';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface DepartmentTableProps {
  departments: DepartmentFinance[];
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({ departments }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Department Performance</h2>
        <button className="btn-secondary text-sm">
          View Details
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Department</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Revenue</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Expenses</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Profit</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Margin</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={dept.department} className={`${index !== departments.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''} hover:bg-gray-50 dark:hover:bg-gray-700/50`}>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">{dept.department}</div>
                </td>
                <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
                  {formatCurrency(dept.revenue)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-100">
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
    </div>
  );
};

export default DepartmentTable;

