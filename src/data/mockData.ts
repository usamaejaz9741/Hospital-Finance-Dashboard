import { 
  FinancialMetric, 
  RevenueData, 
  DepartmentFinance, 
  PatientMetrics, 
  ExpenseBreakdown, 
  CashFlowData,
  Hospital,
  HospitalData,
  RevenueBreakdown,
  EBIDAMetrics,
  ContextualEvent,
  DonationData,
  EnhancedExpenseBreakdown,
  FinancialAssets,
  BondRatings,
  StateProgramDependency
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

// Enhanced data structures for GP Spec implementation
export const revenueBreakdowns: RevenueBreakdown[] = [
  {
    government: 4200000,    // Medicare/Medicaid - 2022
    commercial: 2800000,    // Private insurance
    selfPay: 750000,        // Out-of-pocket
    other: 450000           // Grants, donations
  },
  {
    government: 4350000,    // Medicare/Medicaid - 2023
    commercial: 3000000,    // Private insurance
    selfPay: 775000,        // Out-of-pocket
    other: 475000           // Grants, donations
  },
  {
    government: 4500000,    // Medicare/Medicaid - 2024
    commercial: 3200000,    // Private insurance
    selfPay: 800000,        // Out-of-pocket
    other: 500000           // Grants, donations
  }
];

export const ebidaMetrics: EBIDAMetrics[] = [
  {
    operatingIncome: 1800000,
    depreciation: 450000,
    interest: 320000,
    ebida: 2570000
  }
];

export const contextualEvents: ContextualEvent[] = [
  {
    id: 'event-1',
    title: 'Major System Upgrade',
    description: 'Implemented new electronic health records system across all departments, improving efficiency and patient care coordination.',
    date: '2024-03-15',
    type: 'other',
    impact: 'medium',
    affectedMetrics: ['Operating Expenses', 'Efficiency Metrics']
  },
  {
    id: 'event-2',
    title: 'New CEO Appointment',
    description: 'Dr. Sarah Johnson appointed as new Chief Executive Officer, bringing 15 years of healthcare leadership experience.',
    date: '2024-01-10',
    type: 'leadership_change',
    impact: 'high',
    affectedMetrics: ['Strategic Initiatives', 'Operational Efficiency']
  },
  {
    id: 'event-3',
    title: 'Medicare Expansion',
    description: 'State expanded Medicare coverage, leading to increased patient volume and government payer mix.',
    date: '2023-11-20',
    type: 'regulatory',
    impact: 'high',
    affectedMetrics: ['Government Revenue', 'Patient Volume']
  },
  {
    id: 'event-4',
    title: 'Partnership with Regional Health System',
    description: 'Formed strategic partnership with Regional Health System for shared services and cost optimization.',
    date: '2023-09-05',
    type: 'merger',
    impact: 'medium',
    affectedMetrics: ['Operating Expenses', 'Service Capacity']
  }
];

export const donationData: DonationData[] = [
  {
    totalDonations: 850000,
    newDonations: 650000,
    releasedFromRestrictions: 200000,
    change: 15.2
  }
];

// Enhanced expense breakdown with inflation overlay
export const enhancedExpenseBreakdowns: EnhancedExpenseBreakdown[] = [
  {
    category: 'Personnel & Benefits',
    currentAmount: 5200000,
    previousAmount: 4800000,
    inflationAdjustedAmount: 5050000,
    percentage: 53.1,
    changePercentage: 8.3,
    inflationRate: 3.2,
    color: '#f59e0b',
    subcategories: [
      { name: 'Physician Salaries', amount: 2800000, percentage: 53.8, color: '#fbbf24' },
      { name: 'Nursing Staff', amount: 1800000, percentage: 34.6, color: '#f59e0b' },
      { name: 'Benefits & Insurance', amount: 600000, percentage: 11.5, color: '#d97706' }
    ]
  },
  {
    category: 'Medical Supplies & Pharmaceuticals',
    currentAmount: 1800000,
    previousAmount: 1650000,
    inflationAdjustedAmount: 1750000,
    percentage: 18.4,
    changePercentage: 9.1,
    inflationRate: 4.1,
    color: '#3b82f6',
    subcategories: [
      { name: 'Pharmaceuticals', amount: 900000, percentage: 50.0, color: '#60a5fa' },
      { name: 'Medical Supplies', amount: 540000, percentage: 30.0, color: '#3b82f6' },
      { name: 'Equipment Maintenance', amount: 360000, percentage: 20.0, color: '#2563eb' }
    ]
  },
  {
    category: 'Facilities & Equipment',
    currentAmount: 1200000,
    previousAmount: 1100000,
    inflationAdjustedAmount: 1150000,
    percentage: 12.2,
    changePercentage: 9.1,
    inflationRate: 2.8,
    color: '#22c55e',
    subcategories: [
      { name: 'Equipment Depreciation', amount: 720000, percentage: 60.0, color: '#4ade80' },
      { name: 'Facility Maintenance', amount: 360000, percentage: 30.0, color: '#22c55e' },
      { name: 'Utilities', amount: 120000, percentage: 10.0, color: '#16a34a' }
    ]
  },
  {
    category: 'Administrative & Support',
    currentAmount: 600000,
    previousAmount: 580000,
    inflationAdjustedAmount: 590000,
    percentage: 6.1,
    changePercentage: 3.4,
    inflationRate: 2.5,
    color: '#06b6d4',
    subcategories: [
      { name: 'Administrative Staff', amount: 360000, percentage: 60.0, color: '#22d3ee' },
      { name: 'Professional Services', amount: 180000, percentage: 30.0, color: '#06b6d4' },
      { name: 'Legal & Compliance', amount: 60000, percentage: 10.0, color: '#0891b2' }
    ]
  },
  {
    category: 'Technology & IT',
    currentAmount: 500000,
    previousAmount: 450000,
    inflationAdjustedAmount: 480000,
    percentage: 5.1,
    changePercentage: 11.1,
    inflationRate: 3.5,
    color: '#ef4444',
    subcategories: [
      { name: 'IT Infrastructure', amount: 300000, percentage: 60.0, color: '#f87171' },
      { name: 'Software Licenses', amount: 150000, percentage: 30.0, color: '#ef4444' },
      { name: 'Cybersecurity', amount: 50000, percentage: 10.0, color: '#dc2626' }
    ]
  },
  {
    category: 'Other Operating Expenses',
    currentAmount: 500000,
    previousAmount: 470000,
    inflationAdjustedAmount: 485000,
    percentage: 5.1,
    changePercentage: 6.4,
    inflationRate: 2.9,
    color: '#14b8a6',
    subcategories: [
      { name: 'Insurance', amount: 200000, percentage: 40.0, color: '#5eead4' },
      { name: 'Marketing & Outreach', amount: 150000, percentage: 30.0, color: '#14b8a6' },
      { name: 'Research & Development', amount: 100000, percentage: 20.0, color: '#0d9488' },
      { name: 'Miscellaneous', amount: 50000, percentage: 10.0, color: '#0f766e' }
    ]
  }
];

// Financial assets breakdown
export const financialAssets: FinancialAssets[] = [
  {
    cashAndEquivalents: 2500000,
    shortTermInvestments: 1800000,
    longTermInvestments: 4200000,
    accountsReceivable: 3200000,
    inventory: 850000,
    propertyPlantEquipment: 28500000,
    otherAssets: 1200000,
    totalAssets: 41800000,
    daysCashOnHand: 87
  }
];

// Bond ratings data
export const bondRatings: BondRatings[] = [
  {
    moodysRating: 'A2',
    spRating: 'A',
    fitchRating: 'A+',
    outlook: 'stable',
    lastUpdated: '2024-01-15',
    debtOutstanding: 18500000,
    interestCoverageRatio: 4.2
  }
];

// State program dependency
export const stateProgramDependencies: StateProgramDependency[] = [
  {
    medicaidPercentage: 28.5,
    medicarePercentage: 42.3,
    stateGrants: 850000,
    dshPayments: 650000,
    uplPayments: 320000,
    totalDependency: 71.2,
    riskLevel: 'medium'
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
      ],
      
      // Enhanced GP Spec features
      revenueBreakdown: {
        government: generateVariation(4500000 * baseMultiplier),    // Medicare/Medicaid
        commercial: generateVariation(3200000 * baseMultiplier),    // Private insurance
        selfPay: generateVariation(800000 * baseMultiplier),        // Out-of-pocket
        other: generateVariation(500000 * baseMultiplier)           // Grants, donations
      },
      
      ebidaMetrics: {
        operatingIncome: generateVariation(1800000 * baseMultiplier),
        depreciation: generateVariation(450000 * baseMultiplier),
        interest: generateVariation(320000 * baseMultiplier),
        ebida: generateVariation(2570000 * baseMultiplier)
      },
      
      contextualEvents: contextualEvents.filter(event => {
        const eventYear = new Date(event.date).getFullYear();
        return eventYear <= year;
      }),
      
      donationData: {
        totalDonations: generateVariation(850000 * baseMultiplier),
        newDonations: generateVariation(650000 * baseMultiplier),
        releasedFromRestrictions: generateVariation(200000 * baseMultiplier),
        change: generateVariation(15.2)
      },

      // Enhanced expense breakdown with inflation overlay
      enhancedExpenseBreakdown: enhancedExpenseBreakdowns.map(expense => ({
        ...expense,
        currentAmount: generateVariation(expense.currentAmount * baseMultiplier),
        previousAmount: generateVariation(expense.previousAmount * baseMultiplier),
        inflationAdjustedAmount: generateVariation(expense.inflationAdjustedAmount * baseMultiplier),
        changePercentage: generateVariation(expense.changePercentage, 30),
        inflationRate: generateVariation(expense.inflationRate, 20),
        subcategories: expense.subcategories?.map(sub => ({
          ...sub,
          amount: generateVariation(sub.amount * baseMultiplier),
          percentage: generateVariation(sub.percentage, 15)
        })) ?? []
      })),

      // Financial assets breakdown
      financialAssets: {
        cashAndEquivalents: generateVariation(2500000 * baseMultiplier),
        shortTermInvestments: generateVariation(1800000 * baseMultiplier),
        longTermInvestments: generateVariation(4200000 * baseMultiplier),
        accountsReceivable: generateVariation(3200000 * baseMultiplier),
        inventory: generateVariation(850000 * baseMultiplier),
        propertyPlantEquipment: generateVariation(28500000 * baseMultiplier),
        otherAssets: generateVariation(1200000 * baseMultiplier),
        totalAssets: generateVariation(41800000 * baseMultiplier),
        daysCashOnHand: generateVariation(87, 20)
      },

      // Bond ratings and credit information
      bondRatings: {
        moodysRating: 'A2',
        spRating: 'A',
        fitchRating: 'A+',
        outlook: 'stable' as const,
        lastUpdated: '2024-01-15',
        debtOutstanding: generateVariation(18500000 * baseMultiplier),
        interestCoverageRatio: generateVariation(4.2 * 10, 25) / 10
      },

      // State program dependency analysis
      stateProgramDependency: {
        medicaidPercentage: generateVariation(28.5, 15),
        medicarePercentage: generateVariation(42.3, 15),
        stateGrants: generateVariation(850000 * baseMultiplier),
        dshPayments: generateVariation(650000 * baseMultiplier),
        uplPayments: generateVariation(320000 * baseMultiplier),
        totalDependency: generateVariation(71.2, 10),
        riskLevel: 'medium' as const
      }
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

