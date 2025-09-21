# Development Guide

## Overview

This guide provides comprehensive information for developers working on the Hospital Finance Dashboard. It covers setup, development workflow, coding standards, and best practices.

## 🚀 Getting Started

### Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended editor with extensions

### Required VS Code Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Hospital-Finance-Dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── __tests__/       # Component unit tests
│   ├── auth/           # Authentication components
│   ├── optimized/      # Performance-optimized components
│   └── ui/             # Reusable UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── services/           # Business logic and API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── data/               # Mock data and configuration
├── styles/             # Design system documentation
└── test/               # Test utilities and mocks
```

## 🛠️ Development Scripts

### Core Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run end-to-end tests

# Utilities
npm run clean            # Clean build artifacts
npm run format           # Format code with Prettier
```

### Advanced Scripts

```bash
# Bundle Analysis
npm run build:analyze    # Analyze bundle size

# Performance
npm run lighthouse       # Run Lighthouse audit
npm run bundle-analyzer  # Visualize bundle contents
```

## 🎨 Code Style & Standards

### TypeScript Guidelines

#### Type Definitions
- Always define explicit interfaces for component props
- Use union types for limited options
- Prefer `interface` over `type` for object shapes
- Use generic types for reusable components

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

// ❌ Avoid
type ButtonProps = {
  variant: string;
  size: string;
  children: any;
  onClick?: Function;
}
```

#### Component Structure
```typescript
// ✅ Recommended component structure
import React from 'react';
import { ButtonProps } from '../types';

interface ExtendedButtonProps extends ButtonProps {
  loading?: boolean;
}

export const Button: React.FC<ExtendedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  onClick,
  ...props
}) => {
  // Component logic here
  
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {children}
    </button>
  );
};
```

### React Best Practices

#### Hooks Usage
```typescript
// ✅ Good - Custom hook
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authService.signIn(email, password);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, login };
};

// ✅ Good - Component using custom hook
const LoginForm: React.FC = () => {
  const { login, loading } = useAuth();
  
  const handleSubmit = useCallback(async (data: LoginData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Handle error
    }
  }, [login]);

  return (
    <form onSubmit={handleSubmit}>
      {/* Form content */}
    </form>
  );
};
```

#### State Management
```typescript
// ✅ Good - Local state for component-specific data
const [isOpen, setIsOpen] = useState(false);

// ✅ Good - Context for global state
const { user, theme } = useAuth();

// ✅ Good - Derived state
const filteredData = useMemo(() => {
  return data.filter(item => item.category === selectedCategory);
}, [data, selectedCategory]);
```

### Styling Guidelines

#### Tailwind CSS Usage
```tsx
// ✅ Good - Semantic class grouping
<button className="
  flex items-center justify-center
  px-4 py-2 rounded-lg
  bg-blue-600 text-white
  hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
">
  Save Changes
</button>

// ✅ Good - Responsive design
<div className="
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 p-4
">
  {items.map(item => (
    <Card key={item.id} item={item} />
  ))}
</div>
```

#### CSS Custom Properties
```css
/* ✅ Good - Design tokens */
:root {
  --color-primary: theme('colors.blue.600');
  --color-primary-hover: theme('colors.blue.700');
  --spacing-sm: theme('spacing.2');
  --spacing-md: theme('spacing.4');
  --border-radius: theme('borderRadius.lg');
}
```

### File Naming Conventions

```
components/
├── Button.tsx                    # PascalCase for components
├── Button.test.tsx              # Component tests
├── Button.stories.tsx           # Storybook stories
└── auth/
    ├── LoginForm.tsx            # Feature-based grouping
    └── AuthGuard.tsx

utils/
├── formatters.ts                # camelCase for utilities
├── validators.ts
└── constants.ts

types/
├── auth.ts                      # Feature-based type files
├── finance.ts
└── common.ts
```

## 🧪 Testing Strategy

### Unit Testing

#### Component Testing
```typescript
// ✅ Good - Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### Hook Testing
```typescript
// ✅ Good - Hook test example
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  it('should login user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.user).toBeDefined();
  });
});
```

### Integration Testing

```typescript
// ✅ Good - Integration test example
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '../Dashboard';
import { AuthProvider } from '../../contexts/AuthContext';

describe('Dashboard Integration', () => {
  it('should display metrics after login', async () => {
    render(
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    );

    // Simulate login
    await userEvent.click(screen.getByText('Login'));
    
    await waitFor(() => {
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    });
  });
});
```

### End-to-End Testing

```typescript
// ✅ Good - E2E test example
import { test, expect } from '@playwright/test';

test('user can login and view dashboard', async ({ page }) => {
  await page.goto('/');
  
  // Login
  await page.fill('[data-testid="email-input"]', 'admin@hospital.com');
  await page.fill('[data-testid="password-input"]', 'password123');
  await page.click('[data-testid="login-button"]');
  
  // Verify dashboard loads
  await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
});
```

## 🔧 Development Workflow

### Feature Development

1. **Create feature branch**:
   ```bash
   git checkout -b feature/user-authentication
   ```

2. **Implement feature**:
   - Write components and logic
   - Add tests
   - Update documentation

3. **Run quality checks**:
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add user authentication system"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/user-authentication
   ```

### Code Review Process

1. **Self Review**:
   - Run all quality checks
   - Test functionality manually
   - Review code for best practices

2. **Peer Review**:
   - Request review from team members
   - Address feedback promptly
   - Ensure all tests pass

3. **Merge**:
   - Squash commits if needed
   - Delete feature branch after merge

### Debugging

#### React DevTools
- Install React Developer Tools browser extension
- Use Components tab to inspect component tree
- Use Profiler tab for performance analysis

#### Console Debugging
```typescript
// ✅ Good - Structured logging
const handleSubmit = async (data: FormData) => {
  console.group('Form Submission');
  console.log('Form data:', data);
  
  try {
    const result = await submitForm(data);
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.groupEnd();
  }
};
```

#### Error Boundaries
```typescript
// ✅ Good - Error boundary usage
const App: React.FC = () => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};
```

## 🚀 Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# Check for duplicate dependencies
npm run duplicate-check
```

### Code Splitting

```typescript
// ✅ Good - Route-based code splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
};
```

### Memoization

```typescript
// ✅ Good - Component memoization
const ExpensiveComponent = React.memo<Props>(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyCalculation(item)
    }));
  }, [data]);

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onUpdate={handleUpdate} />
      ))}
    </div>
  );
});
```

## 🔒 Security Considerations

### Input Validation

```typescript
// ✅ Good - Input sanitization
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 100); // Limit length
};

const handleUserInput = (input: string) => {
  const sanitized = sanitizeInput(input);
  // Process sanitized input
};
```

### Authentication

```typescript
// ✅ Good - Secure token handling
const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.signIn(credentials);
    const { token: newToken } = response;
    
    // Store token securely
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
  };

  return { token, login, logout };
};
```

## 📚 Documentation Standards

### Component Documentation

```typescript
/**
 * MetricCard displays key performance indicators with trend information
 * 
 * @example
 * ```tsx
 * <MetricCard
 *   title="Total Revenue"
 *   value={125000}
 *   change={12.5}
 *   changeType="increase"
 * />
 * ```
 */
interface MetricCardProps {
  /** The title displayed at the top of the card */
  title: string;
  /** The main value to display */
  value: number;
  /** Optional percentage change from previous period */
  change?: number;
  /** Type of change indicator */
  changeType?: 'increase' | 'decrease';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType
}) => {
  // Component implementation
};
```

### API Documentation

```typescript
/**
 * Authentication service for user management
 */
class AuthService {
  /**
   * Authenticates a user with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to user data
   * @throws {AuthError} When credentials are invalid
   * 
   * @example
   * ```typescript
   * try {
   *   const user = await authService.signIn('user@example.com', 'password');
   *   console.log('Logged in:', user.name);
   * } catch (error) {
   *   console.error('Login failed:', error.message);
   * }
   * ```
   */
  async signIn(email: string, password: string): Promise<User> {
    // Implementation
  }
}
```

## 🐛 Common Issues & Solutions

### TypeScript Issues

**Issue**: Module not found errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Type errors in tests
```typescript
// Solution: Add proper type assertions
const mockUser = { id: '1', name: 'Test User' } as User;
```

### React Issues

**Issue**: Infinite re-renders
```typescript
// ❌ Problem
const Component = ({ data }) => {
  const processedData = data.map(item => ({ ...item, processed: true }));
  // This creates new array on every render
};

// ✅ Solution
const Component = ({ data }) => {
  const processedData = useMemo(
    () => data.map(item => ({ ...item, processed: true })),
    [data]
  );
};
```

**Issue**: Stale closures
```typescript
// ❌ Problem
const Component = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // Always uses initial count value
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
};

// ✅ Solution
const Component = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + 1); // Uses current count
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
};
```

## 🎯 Best Practices Summary

### Do's ✅
- Write tests for all components and utilities
- Use TypeScript for type safety
- Follow consistent naming conventions
- Implement proper error handling
- Use semantic HTML elements
- Optimize for performance
- Document complex logic
- Use meaningful commit messages

### Don'ts ❌
- Don't commit console.log statements
- Don't use any types unnecessarily
- Don't ignore ESLint warnings
- Don't skip error handling
- Don't use inline styles
- Don't commit sensitive data
- Don't ignore accessibility
- Don't skip code reviews