import { 
  FinancialMetric, 
  RevenueData, 
  DepartmentFinance, 
  PatientMetrics, 
  ExpenseBreakdown, 
  CashFlowData,
  Hospital,
  HospitalData
} from '../types/finance';

export const financialMetrics: FinancialMetric[] = [
  {
    id: 'total-revenue',
    title: 'Total Revenue',
    value: 12500000,
    change: 8.5,
    changeType: 'increase',
    period: 'vs last month',
    format: 'currency'
  },
  {
    id: 'net-profit',
    title: 'Net Profit',
    value: 2100000,
    change: 12.3,
    changeType: 'increase',
    period: 'vs last month',
    format: 'currency'
  },
  {
    id: 'profit-margin',
    title: 'Profit Margin',
    value: 16.8,
    change: 2.1,
    changeType: 'increase',
    period: 'vs last month',
    format: 'percentage'
  },
  {
    id: 'operating-expenses',
    title: 'Operating Expenses',
    value: 9800000,
    change: 3.2,
    changeType: 'increase',
    period: 'vs last month',
    format: 'currency'
  }
];

export const revenueData: RevenueData[] = [
  { month: 'Jan', revenue: 8500000, expenses: 6200000, netIncome: 2300000 },
  { month: 'Feb', revenue: 9200000, expenses: 7100000, netIncome: 2100000 },
  { month: 'Mar', revenue: 15600000, expenses: 11800000, netIncome: 3800000 },
  { month: 'Apr', revenue: 7800000, expenses: 5900000, netIncome: 1900000 },
  { month: 'May', revenue: 18200000, expenses: 13500000, netIncome: 4700000 },
  { month: 'Jun', revenue: 6900000, expenses: 5400000, netIncome: 1500000 },
  { month: 'Jul', revenue: 21400000, expenses: 15800000, netIncome: 5600000 },
  { month: 'Aug', revenue: 11200000, expenses: 8600000, netIncome: 2600000 },
  { month: 'Sep', revenue: 16800000, expenses: 12200000, netIncome: 4600000 },
  { month: 'Oct', revenue: 9600000, expenses: 7300000, netIncome: 2300000 },
  { month: 'Nov', revenue: 19500000, expenses: 14100000, netIncome: 5400000 },
  { month: 'Dec', revenue: 13700000, expenses: 10200000, netIncome: 3500000 }
];

export const departmentFinances: DepartmentFinance[] = [
  {
    department: 'Emergency',
    revenue: 3200000,
    expenses: 2400000,
    profit: 800000,
    profitMargin: 25.0
  },
  {
    department: 'Surgery',
    revenue: 4500000,
    expenses: 3100000,
    profit: 1400000,
    profitMargin: 31.1
  },
  {
    department: 'Cardiology',
    revenue: 2800000,
    expenses: 1900000,
    profit: 900000,
    profitMargin: 32.1
  },
  {
    department: 'Oncology',
    revenue: 1900000,
    expenses: 1400000,
    profit: 500000,
    profitMargin: 26.3
  },
  {
    department: 'Pediatrics',
    revenue: 1100000,
    expenses: 800000,
    profit: 300000,
    profitMargin: 27.3
  }
];

export const patientMetrics: PatientMetrics = {
  totalPatients: 15420,
  inpatients: 2180,
  outpatients: 11850,
  emergencyVisits: 1390,
  averageStayDuration: 4.2,
  occupancyRate: 87.5
};

export const expenseBreakdown: ExpenseBreakdown[] = [
  { category: 'Salaries & Benefits', amount: 5200000, percentage: 53.1, color: '#f59e0b' }, // Amber - main expense
  { category: 'Medical Supplies', amount: 1800000, percentage: 18.4, color: '#3b82f6' }, // Blue - medical
  { category: 'Equipment', amount: 1200000, percentage: 12.2, color: '#22c55e' }, // Green - equipment
  { category: 'Utilities', amount: 600000, percentage: 6.1, color: '#06b6d4' }, // Cyan - utilities
  { category: 'Maintenance', amount: 500000, percentage: 5.1, color: '#ef4444' }, // Red - maintenance
  { category: 'Other', amount: 500000, percentage: 5.1, color: '#14b8a6' } // Teal - other
];

export const cashFlowData: CashFlowData[] = [
  {
    date: '2024-01',
    operatingCashFlow: 2100000,
    investingCashFlow: -800000,
    financingCashFlow: -300000,
    netCashFlow: 1000000
  },
  {
    date: '2024-02',
    operatingCashFlow: 1950000,
    investingCashFlow: -200000,
    financingCashFlow: -400000,
    netCashFlow: 1350000
  },
  {
    date: '2024-03',
    operatingCashFlow: 2300000,
    investingCashFlow: -1200000,
    financingCashFlow: -200000,
    netCashFlow: 900000
  },
  {
    date: '2024-04',
    operatingCashFlow: 2200000,
    investingCashFlow: -300000,
    financingCashFlow: -350000,
    netCashFlow: 1550000
  },
  {
    date: '2024-05',
    operatingCashFlow: 2500000,
    investingCashFlow: -150000,
    financingCashFlow: -300000,
    netCashFlow: 2050000
  },
  {
    date: '2024-06',
    operatingCashFlow: 2350000,
    investingCashFlow: -600000,
    financingCashFlow: -250000,
    netCashFlow: 1500000
  }
];

export const hospitals: Hospital[] = [
  {
    id: 'general-1',
    name: 'Metro General Hospital',
    location: 'Downtown',
    type: 'General'
  },
  {
    id: 'cardio-1',
    name: 'Heart & Vascular Institute',
    location: 'Midtown',
    type: 'Specialty'
  },
  {
    id: 'pediatric-1',
    name: 'Children\'s Medical Center',
    location: 'Westside',
    type: 'Pediatric'
  },
  {
    id: 'trauma-1',
    name: 'Regional Trauma Center',
    location: 'Northside',
    type: 'Trauma'
  }
];

export const availableYears = [2021, 2022, 2023, 2024];

/**
 * Generates a random variation of a base value within a specified percentage range.
 * 
 * @description This function creates realistic variations in financial data by applying
 * a random percentage change to a base value. The variation is symmetrical (both positive
 * and negative changes are possible).
 * 
 * @param {number} baseValue - The base value to vary
 * @param {number} [variationPercent=15] - The maximum percentage variation (default: 15%)
 * @returns {number} A rounded number representing the varied value
 * 
 * @example
 * ```typescript
 * const baseRevenue = 1000000;
 * const variedRevenue = generateVariation(baseRevenue, 20); // Could be between 800,000 and 1,200,000
 * ```
 */
const generateVariation = (baseValue: number, variationPercent: number = 15): number => {
  const variation = baseValue * (variationPercent / 100);
  return Math.round(baseValue + (Math.random() - 0.5) * 2 * variation);
};

// Generate hospital data for all combinations
export const hospitalDataByYear: HospitalData[] = [];

hospitals.forEach(hospital => {
  availableYears.forEach(year => {
    const yearMultiplier = year === 2024 ? 1 : year === 2023 ? 0.92 : year === 2022 ? 0.85 : 0.78;
    const hospitalMultiplier = hospital.type === 'General' ? 1 : 
                               hospital.type === 'Specialty' ? 0.7 : 
                               hospital.type === 'Pediatric' ? 0.5 : 0.8;

    const baseMultiplier = yearMultiplier * hospitalMultiplier;

    const hospitalData: HospitalData = {
      hospitalId: hospital.id,
      year: year,
      lastUpdated: new Date(year, 11, 31).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      financialMetrics: [
        {
          id: 'total-revenue',
          title: 'Total Revenue',
          value: generateVariation(12500000 * baseMultiplier),
          change: generateVariation(8.5, 50),
          changeType: Math.random() > 0.3 ? 'increase' : 'decrease',
          period: 'vs last month',
          format: 'currency'
        },
        {
          id: 'net-profit',
          title: 'Net Profit',
          value: generateVariation(2100000 * baseMultiplier),
          change: generateVariation(12.3, 60),
          changeType: Math.random() > 0.25 ? 'increase' : 'decrease',
          period: 'vs last month',
          format: 'currency'
        },
        {
          id: 'profit-margin',
          title: 'Profit Margin',
          value: generateVariation(16.8, 25),
          change: generateVariation(2.1, 80),
          changeType: Math.random() > 0.4 ? 'increase' : 'decrease',
          period: 'vs last month',
          format: 'percentage'
        },
        {
          id: 'operating-expenses',
          title: 'Operating Expenses',
          value: generateVariation(9800000 * baseMultiplier),
          change: generateVariation(3.2, 40),
          changeType: Math.random() > 0.6 ? 'increase' : 'decrease',
          period: 'vs last month',
          format: 'currency'
        }
      ],
      revenueData: [
        { month: 'Jan', revenue: generateVariation(8500000 * baseMultiplier), expenses: generateVariation(6200000 * baseMultiplier), netIncome: generateVariation(2300000 * baseMultiplier) },
        { month: 'Feb', revenue: generateVariation(9200000 * baseMultiplier), expenses: generateVariation(7100000 * baseMultiplier), netIncome: generateVariation(2100000 * baseMultiplier) },
        { month: 'Mar', revenue: generateVariation(15600000 * baseMultiplier), expenses: generateVariation(11800000 * baseMultiplier), netIncome: generateVariation(3800000 * baseMultiplier) },
        { month: 'Apr', revenue: generateVariation(7800000 * baseMultiplier), expenses: generateVariation(5900000 * baseMultiplier), netIncome: generateVariation(1900000 * baseMultiplier) },
        { month: 'May', revenue: generateVariation(18200000 * baseMultiplier), expenses: generateVariation(13500000 * baseMultiplier), netIncome: generateVariation(4700000 * baseMultiplier) },
        { month: 'Jun', revenue: generateVariation(6900000 * baseMultiplier), expenses: generateVariation(5400000 * baseMultiplier), netIncome: generateVariation(1500000 * baseMultiplier) },
        { month: 'Jul', revenue: generateVariation(21400000 * baseMultiplier), expenses: generateVariation(15800000 * baseMultiplier), netIncome: generateVariation(5600000 * baseMultiplier) },
        { month: 'Aug', revenue: generateVariation(11200000 * baseMultiplier), expenses: generateVariation(8600000 * baseMultiplier), netIncome: generateVariation(2600000 * baseMultiplier) },
        { month: 'Sep', revenue: generateVariation(16800000 * baseMultiplier), expenses: generateVariation(12200000 * baseMultiplier), netIncome: generateVariation(4600000 * baseMultiplier) },
        { month: 'Oct', revenue: generateVariation(9600000 * baseMultiplier), expenses: generateVariation(7300000 * baseMultiplier), netIncome: generateVariation(2300000 * baseMultiplier) },
        { month: 'Nov', revenue: generateVariation(19500000 * baseMultiplier), expenses: generateVariation(14100000 * baseMultiplier), netIncome: generateVariation(5400000 * baseMultiplier) },
        { month: 'Dec', revenue: generateVariation(13700000 * baseMultiplier), expenses: generateVariation(10200000 * baseMultiplier), netIncome: generateVariation(3500000 * baseMultiplier) }
      ],
      departmentFinances: (() => {
        const emergencyRevenue = generateVariation(3200000 * baseMultiplier);
        const emergencyExpenses = generateVariation(2400000 * baseMultiplier);
        const emergencyProfit = emergencyRevenue - emergencyExpenses;
        
        return [
        {
          department: 'Emergency',
          revenue: emergencyRevenue,
          expenses: emergencyExpenses,
          profit: emergencyProfit,
          profitMargin: (emergencyProfit / emergencyRevenue) * 100
        },
        (() => {
          const surgeryRevenue = generateVariation(4500000 * baseMultiplier);
          const surgeryExpenses = generateVariation(3100000 * baseMultiplier);
          const surgeryProfit = surgeryRevenue - surgeryExpenses;
          
          return {
            department: 'Surgery',
            revenue: surgeryRevenue,
            expenses: surgeryExpenses,
            profit: surgeryProfit,
            profitMargin: (surgeryProfit / surgeryRevenue) * 100
          };
        })(),
        (() => {
          const cardiologyRevenue = generateVariation(2800000 * baseMultiplier);
          const cardiologyExpenses = generateVariation(1900000 * baseMultiplier);
          const cardiologyProfit = cardiologyRevenue - cardiologyExpenses;
          
          return {
            department: 'Cardiology',
            revenue: cardiologyRevenue,
            expenses: cardiologyExpenses,
            profit: cardiologyProfit,
            profitMargin: (cardiologyProfit / cardiologyRevenue) * 100
          };
        })(),
        (() => {
          const deptRevenue = generateVariation(1900000 * baseMultiplier);
          const deptExpenses = generateVariation(1400000 * baseMultiplier);
          const deptProfit = deptRevenue - deptExpenses;
          
          return {
            department: hospital.type === 'Pediatric' ? 'Pediatrics' : 'Oncology',
            revenue: deptRevenue,
            expenses: deptExpenses,
            profit: deptProfit,
            profitMargin: (deptProfit / deptRevenue) * 100
          };
        })(),
        (() => {
          const orthoRevenue = generateVariation(1100000 * baseMultiplier);
          const orthoExpenses = generateVariation(800000 * baseMultiplier);
          const orthoProfit = orthoRevenue - orthoExpenses;
          
          return {
            department: hospital.type === 'Trauma' ? 'Trauma' : 'Orthopedics',
            revenue: orthoRevenue,
            expenses: orthoExpenses,
            profit: orthoProfit,
            profitMargin: (orthoProfit / orthoRevenue) * 100
          };
        })()
      ]; })(),
      patientMetrics: {
        totalPatients: generateVariation(15420 * baseMultiplier, 20),
        inpatients: generateVariation(2180 * baseMultiplier, 25),
        outpatients: generateVariation(11850 * baseMultiplier, 20),
        emergencyVisits: generateVariation(1390 * baseMultiplier, 30),
        averageStayDuration: generateVariation(4.2 * 10, 15) / 10,
        occupancyRate: generateVariation(87.5, 10)
      },
      expenseBreakdown: (() => {
        const salariesAmount = generateVariation(5200000 * baseMultiplier);
        const suppliesAmount = generateVariation(1800000 * baseMultiplier);
        const equipmentAmount = generateVariation(1200000 * baseMultiplier);
        const utilitiesAmount = generateVariation(600000 * baseMultiplier);
        const maintenanceAmount = generateVariation(500000 * baseMultiplier);
        const otherAmount = generateVariation(500000 * baseMultiplier);
        
        const totalAmount = salariesAmount + suppliesAmount + equipmentAmount + utilitiesAmount + maintenanceAmount + otherAmount;
        
        return [
          { category: 'Salaries & Benefits', amount: salariesAmount, percentage: Math.round((salariesAmount / totalAmount) * 100 * 10) / 10, color: '#f59e0b' },
          { category: 'Medical Supplies', amount: suppliesAmount, percentage: Math.round((suppliesAmount / totalAmount) * 100 * 10) / 10, color: '#3b82f6' },
          { category: 'Equipment', amount: equipmentAmount, percentage: Math.round((equipmentAmount / totalAmount) * 100 * 10) / 10, color: '#22c55e' },
          { category: 'Utilities', amount: utilitiesAmount, percentage: Math.round((utilitiesAmount / totalAmount) * 100 * 10) / 10, color: '#06b6d4' },
          { category: 'Maintenance', amount: maintenanceAmount, percentage: Math.round((maintenanceAmount / totalAmount) * 100 * 10) / 10, color: '#ef4444' },
          { category: 'Other', amount: otherAmount, percentage: Math.round((otherAmount / totalAmount) * 100 * 10) / 10, color: '#14b8a6' }
        ];
      })(),
      cashFlowData: [
        {
          date: `${year}-01`,
          operatingCashFlow: generateVariation(2100000 * baseMultiplier),
          investingCashFlow: generateVariation(-800000 * baseMultiplier),
          financingCashFlow: generateVariation(-300000 * baseMultiplier),
          netCashFlow: generateVariation(1000000 * baseMultiplier)
        },
        {
          date: `${year}-02`,
          operatingCashFlow: generateVariation(1950000 * baseMultiplier),
          investingCashFlow: generateVariation(-200000 * baseMultiplier),
          financingCashFlow: generateVariation(-400000 * baseMultiplier),
          netCashFlow: generateVariation(1350000 * baseMultiplier)
        },
        {
          date: `${year}-03`,
          operatingCashFlow: generateVariation(2300000 * baseMultiplier),
          investingCashFlow: generateVariation(-1200000 * baseMultiplier),
          financingCashFlow: generateVariation(-200000 * baseMultiplier),
          netCashFlow: generateVariation(900000 * baseMultiplier)
        },
        {
          date: `${year}-04`,
          operatingCashFlow: generateVariation(2200000 * baseMultiplier),
          investingCashFlow: generateVariation(-300000 * baseMultiplier),
          financingCashFlow: generateVariation(-350000 * baseMultiplier),
          netCashFlow: generateVariation(1550000 * baseMultiplier)
        },
        {
          date: `${year}-05`,
          operatingCashFlow: generateVariation(2500000 * baseMultiplier),
          investingCashFlow: generateVariation(-150000 * baseMultiplier),
          financingCashFlow: generateVariation(-300000 * baseMultiplier),
          netCashFlow: generateVariation(2050000 * baseMultiplier)
        },
        {
          date: `${year}-06`,
          operatingCashFlow: generateVariation(2350000 * baseMultiplier),
          investingCashFlow: generateVariation(-600000 * baseMultiplier),
          financingCashFlow: generateVariation(-250000 * baseMultiplier),
          netCashFlow: generateVariation(1500000 * baseMultiplier)
        }
      ]
    };

    hospitalDataByYear.push(hospitalData);
  });
});

/**
 * Retrieves hospital financial data for a specific hospital and year.
 * 
 * @description This function searches through the generated hospital data to find
 * matching records for a specific hospital ID and year combination. The data includes
 * financial metrics, revenue data, department finances, patient metrics, expense breakdown,
 * and cash flow data.
 * 
 * @param {string} hospitalId - The unique identifier of the hospital
 * @param {number} year - The year for which to retrieve data (e.g., 2024)
 * @returns {HospitalData | undefined} The hospital data object if found, undefined otherwise
 * 
 * @example
 * ```typescript
 * const hospitalData = getHospitalData('general-1', 2024);
 * if (hospitalData) {
 *   console.log('Total Revenue:', hospitalData.financialMetrics[0].value);
 *   console.log('Last Updated:', hospitalData.lastUpdated);
 * }
 * ```
 */
export const getHospitalData = (hospitalId: string, year: number): HospitalData | undefined => {
  return hospitalDataByYear.find(data => data.hospitalId === hospitalId && data.year === year);
};

