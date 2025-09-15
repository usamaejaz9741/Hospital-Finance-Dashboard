import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { FinancialMetric } from '../../types/finance';
import MetricCard from '../MetricCard';

const mockMetric: FinancialMetric = {
  id: 'revenue',
  title: 'Total Revenue',
  value: 1500000,
  change: 15.4,
  changeType: 'increase',
  period: 'vs. last month',
  format: 'currency'
};

describe('MetricCard', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </ThemeProvider>
    );
  };

  it('renders metric title', () => {
    renderWithProviders(<MetricCard metric={mockMetric} />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    renderWithProviders(<MetricCard metric={mockMetric} />);
    expect(screen.getByText('$1,500,000')).toBeInTheDocument();
  });

  it('shows percentage change', () => {
    renderWithProviders(<MetricCard metric={mockMetric} />);
    expect(screen.getByText('15.4%')).toBeInTheDocument();
  });

  it('has correct aria labels', () => {
    renderWithProviders(<MetricCard metric={mockMetric} />);
    expect(screen.getByLabelText(/Total Revenue value:/)).toBeInTheDocument();
  });
});