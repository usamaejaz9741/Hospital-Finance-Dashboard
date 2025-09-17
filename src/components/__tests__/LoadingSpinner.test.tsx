import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders with default text', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders with custom text', () => {
    render(<LoadingSpinner text="Custom loading message" />);
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  test('renders with subtext', () => {
    render(<LoadingSpinner text="Loading" subtext="Please wait..." />);
    
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  test('has correct accessibility attributes', () => {
    render(<LoadingSpinner text="Loading data" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
  });

  test('renders loading spinner element', () => {
    render(<LoadingSpinner />);
    
    // Check for spinner element (assuming it has a specific class or data-testid)
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toBeInTheDocument();
  });
});
