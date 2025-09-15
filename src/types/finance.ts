export interface FinancialMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
  format: 'currency' | 'percentage' | 'number';
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  netIncome: number;
}

export interface DepartmentFinance {
  department: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
}

export interface PatientMetrics {
  totalPatients: number;
  inpatients: number;
  outpatients: number;
  emergencyVisits: number;
  averageStayDuration: number;
  occupancyRate: number;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface CashFlowData {
  date: string;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  type: string;
}

export interface HospitalData {
  hospitalId: string;
  year: number;
  financialMetrics: FinancialMetric[];
  revenueData: RevenueData[];
  departmentFinances: DepartmentFinance[];
  patientMetrics: PatientMetrics;
  expenseBreakdown: ExpenseBreakdown[];
  cashFlowData: CashFlowData[];
}

