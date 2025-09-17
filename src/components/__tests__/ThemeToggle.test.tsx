import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../contexts/ThemeContext';
import ThemeToggle from '../ThemeToggle';

const renderWithThemeProvider = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  test('renders theme toggle button', () => {
    renderWithThemeProvider(<ThemeToggle />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  test('has accessible label', () => {
    renderWithThemeProvider(<ThemeToggle />);
    
    const toggleButton = screen.getByRole('button', { name: /switch to/i });
    expect(toggleButton).toBeInTheDocument();
  });

  test('toggles theme when clicked', async () => {
    const user = userEvent.setup();
    renderWithThemeProvider(<ThemeToggle />);
    
    const toggleButton = screen.getByRole('button');
    
    // Click the toggle button
    await user.click(toggleButton);
    
    // The button should still be present after clicking
    expect(toggleButton).toBeInTheDocument();
  });

  test('displays appropriate icon for current theme', () => {
    renderWithThemeProvider(<ThemeToggle />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    
    // Check if icon is present (assuming it uses an SVG or icon element)
    const icon = toggleButton.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
