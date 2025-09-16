// React import removed - not needed with modern JSX transform
import { render, screen, waitFor } from '@testing-library/react';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import Dashboard from '../Dashboard';
import { mockAuthContextValue, mockThemeContextValue } from '../../test/mocks';

// Mock child components
jest.mock('../Header', () => () => <div data-testid="header" />);
jest.mock('../LoadingSpinner', () => ({ text, subtext }: { text: string, subtext: string }) => (
  <div data-testid="loading-spinner">
    <span>{text}</span>
    <span>{subtext}</span>
  </div>
));
jest.mock('../DashboardNoData', () => () => <div data-testid="no-data" />);
jest.mock('../MetricCard', () => () => <div data-testid="metric-card" />);
jest.mock('../RevenueChart', () => () => <div data-testid="revenue-chart" />);
jest.mock('../ExpensePieChart', () => () => <div data-testid="expense-pie-chart" />);
jest.mock('../CashFlowChart', () => () => <div data-testid="cash-flow-chart" />);
jest.mock('../PatientMetricsCard', () => () => <div data-testid="patient-metrics-card" />);
jest.mock('../DepartmentTable', () => () => <div data-testid="department-table" />);

describe('Dashboard', () => {
  const renderDashboard = () => {
    return render(
      <ThemeContext.Provider value={mockThemeContextValue}>
        <AuthContext.Provider value={mockAuthContextValue}>
          <Dashboard />
        </AuthContext.Provider>
      </ThemeContext.Provider>
    );
  };

  test('renders LoadingSpinner on initial load', () => {
    renderDashboard();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  test('renders NoData component when there is no data', async () => {
    renderDashboard();

    // Wait for loading to finish and check if no-data appears
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Check if no-data component is rendered (it should be due to mock conditions)
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });

  test('renders Dashboard component structure', async () => {
    renderDashboard();

    // Initially should show loading spinner
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Should show either no-data or data components
    // Based on mock setup, it's likely showing no-data
    expect(screen.getByTestId('no-data')).toBeInTheDocument();
  });
});
