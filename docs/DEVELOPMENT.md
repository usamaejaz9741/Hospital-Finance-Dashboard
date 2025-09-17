# Development Guide

This comprehensive guide covers everything you need to know for developing, maintaining, and extending the Hospital Finance Dashboard.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Performance Optimization](#performance-optimization)
- [Debugging Guide](#debugging-guide)
- [Contributing Guidelines](#contributing-guidelines)

## Getting Started

### Prerequisites

**Required Software**:
- Node.js 18.x or higher
- npm 9.x or higher
- Git 2.x or higher
- VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint

**System Requirements**:
- RAM: 8GB minimum, 16GB recommended
- Storage: 2GB free space for dependencies
- OS: Windows 10+, macOS 10.15+, or Linux

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd Hospital-Finance-Dashboard

# 2. Install dependencies
npm install

# 3. Verify installation
npm run type-check
npm run lint
npm test

# 4. Start development server
npm run dev
```

### VS Code Configuration

Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Development Environment

### Environment Variables

Create `.env.local` for local development:
```bash
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:3001
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### Development Scripts

```bash
# Development server with hot reload
npm run dev

# Type checking in watch mode
npm run type-check:watch

# Linting with auto-fix
npm run lint:fix

# Testing in watch mode
npm run test:watch

# Build and preview production
npm run build && npm run preview
```

### Browser Development Tools

**Recommended Extensions**:
- React Developer Tools
- Redux DevTools (if using Redux)
- Lighthouse for performance auditing
- axe DevTools for accessibility testing

## Project Structure

### Directory Organization

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── ui/             # Reusable UI components
│   ├── optimized/      # Performance-optimized components
│   └── __tests__/      # Component tests
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
│   └── __tests__/      # Utility tests
├── types/              # TypeScript type definitions
├── data/               # Mock data and configurations
├── services/           # API services and business logic
├── config/             # Configuration files
└── test/               # Test utilities and setup
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `DashboardHeader.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`)
- **Tests**: Match source file with `.test.ts` suffix
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Import Organization

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

// 2. Internal utilities and types
import { formatCurrency } from '../utils/formatters';
import { HospitalData } from '../types/finance';

// 3. Components
import Button from './Button';
import MetricCard from './MetricCard';

// 4. Relative imports
import './Dashboard.css';
```

## Development Workflow

### Feature Development Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/dashboard-improvements
   ```

2. **Development Cycle**
   ```bash
   # Make changes
   npm run dev          # Start development server
   npm run type-check   # Verify TypeScript
   npm run lint         # Check code quality
   npm test             # Run tests
   ```

3. **Pre-commit Checks**
   ```bash
   npm run type-check
   npm run lint:fix
   npm test
   npm run build        # Verify production build
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add hospital comparison feature"
   git push origin feature/dashboard-improvements
   ```

### Component Development Workflow

**1. Create Component Structure**
```typescript
// components/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  /** Component description */
  title: string;
  /** Optional callback */
  onAction?: () => void;
}

/**
 * Component description with usage example
 * 
 * @component
 * @example
 * ```tsx
 * <NewComponent title="Example" onAction={handleAction} />
 * ```
 */
const NewComponent: React.FC<NewComponentProps> = ({
  title,
  onAction
}) => {
  return (
    <div className="p-4">
      <h2>{title}</h2>
      {onAction && (
        <button onClick={onAction}>Action</button>
      )}
    </div>
  );
};

export default React.memo(NewComponent);
```

**2. Create Tests**
```typescript
// components/__tests__/NewComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import NewComponent from '../NewComponent';

describe('NewComponent', () => {
  test('renders with title', () => {
    render(<NewComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('calls onAction when button clicked', () => {
    const mockAction = jest.fn();
    render(<NewComponent title="Test" onAction={mockAction} />);
    
    fireEvent.click(screen.getByText('Action'));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
```

**3. Add to Storybook (if applicable)**
```typescript
// components/NewComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import NewComponent from './NewComponent';

const meta: Meta<typeof NewComponent> = {
  title: 'Components/NewComponent',
  component: NewComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Title',
  },
};

export const WithAction: Story = {
  args: {
    title: 'With Action',
    onAction: () => alert('Action clicked!'),
  },
};
```

### Hook Development Pattern

```typescript
// hooks/useCustomHook.ts
import { useState, useEffect } from 'react';

interface UseCustomHookOptions {
  initialValue?: string;
  autoUpdate?: boolean;
}

interface UseCustomHookReturn {
  value: string;
  setValue: (value: string) => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook description
 * 
 * @param options - Configuration options
 * @returns Hook return object
 */
export const useCustomHook = (
  options: UseCustomHookOptions = {}
): UseCustomHookReturn => {
  const { initialValue = '', autoUpdate = false } = options;
  
  const [value, setValue] = useState<string>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoUpdate) {
      // Auto-update logic
    }
  }, [autoUpdate]);

  return {
    value,
    setValue,
    isLoading,
    error
  };
};
```

## Code Standards

### TypeScript Guidelines

**1. Interface Definitions**
```typescript
// Good: Descriptive interface names
interface HospitalFinancialMetrics {
  totalRevenue: number;
  operatingExpenses: number;
  netIncome: number;
  profitMargin: number;
}

// Good: Optional properties with clear defaults
interface ChartConfiguration {
  showLegend?: boolean;
  animationDuration?: number;
  theme?: 'light' | 'dark';
}
```

**2. Type Guards**
```typescript
// Type guard for runtime type checking
const isHospitalData = (data: unknown): data is HospitalData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'financialMetrics' in data
  );
};
```

**3. Generic Types**
```typescript
// Reusable generic interfaces
interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

// Usage
const hospitalResponse: ApiResponse<HospitalData> = {
  data: hospitalData,
  status: 'success',
  timestamp: new Date().toISOString()
};
```

### React Best Practices

**1. Component Composition**
```typescript
// Good: Composition over inheritance
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="dashboard-layout">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

// Usage
<DashboardLayout>
  <FinancialMetrics />
  <Charts />
</DashboardLayout>
```

**2. Performance Optimization**
```typescript
// Memoize expensive calculations
const expensiveCalculation = useMemo(() => {
  return data.reduce((acc, item) => acc + item.value, 0);
}, [data]);

// Memoize callback functions
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// Memoize components with React.memo
export default React.memo(Component, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});
```

**3. Error Handling**
```typescript
// Component-level error handling
const DataComponent: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiCall();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        logger.error('Failed to fetch data', { error: err });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <NoDataMessage />;

  return <DataDisplay data={data} />;
};
```

### CSS/Tailwind Guidelines

**1. Responsive Design**
```tsx
// Mobile-first responsive classes
<div className="
  grid grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  p-4 
  sm:p-6 
  lg:p-8
">
```

**2. Component Styling**
```tsx
// Consistent spacing and colors
const cardClasses = `
  bg-white dark:bg-dark-surface
  border border-gray-200 dark:border-dark-border
  rounded-lg shadow-sm
  p-4 sm:p-6
  hover:shadow-md
  transition-shadow duration-200
`;
```

**3. Theme Integration**
```tsx
// Theme-aware components
<div className="
  text-gray-900 dark:text-gray-100
  bg-gray-50 dark:bg-gray-900
  border-gray-200 dark:border-gray-700
">
```

## Testing Guidelines

### Test Structure

```typescript
// Standard test structure
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Reset mocks, clear localStorage, etc.
  });

  // Test groups
  describe('rendering', () => {
    test('renders with required props', () => {});
    test('renders loading state', () => {});
    test('renders error state', () => {});
  });

  describe('interactions', () => {
    test('handles user click', () => {});
    test('handles form submission', () => {});
  });

  describe('edge cases', () => {
    test('handles empty data', () => {});
    test('handles network errors', () => {});
  });
});
```

### Testing Utilities

```typescript
// Test utilities
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Custom render with providers
export const renderWithProviders = (
  ui: React.ReactElement,
  options: {
    initialAuthState?: Partial<AuthState>;
    theme?: 'light' | 'dark';
  } = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider initialTheme={options.theme}>
      <AuthProvider initialState={options.initialAuthState}>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};
```

### Mock Patterns

```typescript
// Mock external dependencies
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock React hooks
const mockUseAuth = {
  user: mockUser,
  isAuthenticated: true,
  signIn: jest.fn(),
  signOut: jest.fn(),
};

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));
```

## Performance Optimization

### Bundle Analysis

```bash
# Generate bundle analysis
npm run build
npm run analyze

# Check bundle size
npx bundlesize

# Analyze dependencies
npx webpack-bundle-analyzer dist/stats.json
```

### Code Splitting Strategies

```typescript
// Route-based code splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const Reports = lazy(() => import('./components/Reports'));

// Component-based code splitting
const HeavyChart = lazy(() => import('./components/HeavyChart'));

// Feature-based code splitting
const AdminPanel = lazy(() => 
  import('./components/AdminPanel').then(module => ({
    default: module.AdminPanel
  }))
);
```

### Performance Monitoring

```typescript
// Performance monitoring hook
const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 100) { // Log slow renders
        logger.warn(`Slow render detected: ${componentName}`, {
          duration,
          component: componentName
        });
      }
    };
  });
};
```

## Debugging Guide

### Development Tools

**1. React Developer Tools**
- Component tree inspection
- Props and state debugging
- Performance profiling

**2. Browser DevTools**
- Network tab for API calls
- Performance tab for render analysis
- Memory tab for leak detection

**3. VS Code Debugging**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["--mode", "development"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Common Issues and Solutions

**1. Hydration Mismatches**
```typescript
// Fix: Use useEffect for client-only code
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <div>Loading...</div>;
}
```

**2. Memory Leaks**
```typescript
// Fix: Cleanup subscriptions and timers
useEffect(() => {
  const timer = setInterval(() => {
    // Timer logic
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);
```

**3. Infinite Re-renders**
```typescript
// Problem: Missing dependency array
useEffect(() => {
  fetchData();
}); // Missing dependency array

// Solution: Add proper dependencies
useEffect(() => {
  fetchData();
}, [fetchData]);
```

### Debugging Checklist

- [ ] Check browser console for errors
- [ ] Verify network requests in Network tab
- [ ] Check React DevTools for component state
- [ ] Review TypeScript errors in IDE
- [ ] Test in different browsers
- [ ] Check mobile responsiveness
- [ ] Verify accessibility with axe-core
- [ ] Test with different user roles
- [ ] Check performance with Lighthouse

## Contributing Guidelines

### Code Review Process

**1. Self-Review Checklist**
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Documentation updated

**2. Pull Request Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Git Commit Guidelines

**Commit Message Format**:
```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/config changes

**Examples**:
```bash
git commit -m "feat(dashboard): add hospital comparison feature"
git commit -m "fix(auth): resolve session timeout issue"
git commit -m "docs(api): update authentication documentation"
```

### Release Process

1. **Version Bump**
   ```bash
   npm version patch  # Bug fixes
   npm version minor  # New features
   npm version major  # Breaking changes
   ```

2. **Generate Changelog**
   ```bash
   npm run changelog
   ```

3. **Create Release**
   ```bash
   git tag -a v1.2.0 -m "Release v1.2.0"
   git push origin v1.2.0
   ```

---

This development guide provides comprehensive information for contributing to and maintaining the Hospital Finance Dashboard. For specific implementation details, refer to the component documentation and API reference.
