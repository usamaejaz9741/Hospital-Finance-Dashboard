# Hospital Finance Dashboard API Documentation

## Overview

The Hospital Finance Dashboard is a React-based application built with TypeScript that provides comprehensive financial analytics for hospital management. This document outlines all public APIs, components, and utilities available in the system.

## Table of Contents

- [Authentication System](#authentication-system)
- [Data Types](#data-types)
- [Components](#components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Context Providers](#context-providers)
- [Error Handling](#error-handling)

## Authentication System

### AuthContext

The authentication context provides user management and access control throughout the application.

#### Properties

- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean` - Authentication status
- `isLoading: boolean` - Loading state for auth operations
- `signIn: (email: string, password: string) => Promise<void>` - Sign in method
- `signUp: (userData: SignUpData) => Promise<void>` - Sign up method
- `signOut: () => void` - Sign out method
- `canAccessHospital: (hospitalId: string) => boolean` - Check hospital access
- `getAccessibleHospitals: () => string[]` - Get accessible hospitals

#### Example Usage

```tsx
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      Welcome, {user?.name}!
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### User Types

#### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
  hospitalId?: string;        // For branch_owner role
  hospitalIds?: string[];     // For hospital_owner role
}
```

#### UserRole

```typescript
type UserRole = 'admin' | 'hospital_owner' | 'branch_owner';
```

#### SignUpData

```typescript
interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  hospitalId?: string;
  hospitalIds?: string[];
}
```

## Data Types

### Financial Types

#### FinancialMetric

Represents a financial metric displayed in metric cards.

```typescript
interface FinancialMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
  format: 'currency' | 'percentage' | 'number';
}
```

#### RevenueData

Monthly revenue data for trend analysis.

```typescript
interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  netIncome: number;
}
```

#### DepartmentFinance

Financial performance data for hospital departments.

```typescript
interface DepartmentFinance {
  department: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
}
```

#### PatientMetrics

Patient statistics and hospital utilization metrics.

```typescript
interface PatientMetrics {
  totalPatients: number;
  inpatients: number;
  outpatients: number;
  emergencyVisits: number;
  averageStayDuration: number;
  occupancyRate: number;
}
```

#### ExpenseBreakdown

Expense category breakdown for pie chart visualization.

```typescript
interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}
```

#### CashFlowData

Cash flow data for financial analysis.

```typescript
interface CashFlowData {
  date: string;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
}
```

#### Hospital

Hospital entity information.

```typescript
interface Hospital {
  id: string;
  name: string;
  location: string;
  type: HospitalType;
}
```

#### HospitalData

Complete dataset for a hospital's financial and operational data.

```typescript
interface HospitalData {
  hospitalId: string;
  year: number;
  financialMetrics: FinancialMetric[];
  revenueData: RevenueData[];
  departmentFinances: DepartmentFinance[];
  patientMetrics: PatientMetrics;
  expenseBreakdown: ExpenseBreakdown[];
  cashFlowData: CashFlowData[];
  lastUpdated: string;
}
```

## Components

### Dashboard

Main dashboard component displaying hospital financial data.

#### Props

```typescript
// No props - uses context for data
```

#### Features

- Hospital and year selection
- Financial metrics display
- Interactive charts and tables
- Responsive design
- Loading and error states

#### Example Usage

```tsx
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    </AuthProvider>
  );
}
```

### MetricCard

Displays individual financial metrics with change indicators.

#### Props

```typescript
interface MetricCardProps {
  metric: FinancialMetric;
}
```

#### Example Usage

```tsx
import MetricCard from './components/MetricCard';

const metric = {
  id: 'revenue',
  title: 'Total Revenue',
  value: 1500000,
  change: 12.5,
  changeType: 'increase',
  period: 'vs last month',
  format: 'currency'
};

<MetricCard metric={metric} />
```

### RevenueChart

Line chart displaying revenue and expenses trends.

#### Props

```typescript
interface RevenueChartProps {
  data: RevenueData[];
}
```

#### Features

- Interactive tooltips
- Responsive design
- Dark mode support
- No data state handling

### ExpensePieChart

Pie chart showing expense breakdown by category.

#### Props

```typescript
interface ExpensePieChartProps {
  data: ExpenseBreakdown[];
}
```

### CashFlowChart

Bar chart displaying cash flow analysis.

#### Props

```typescript
interface CashFlowChartProps {
  data: CashFlowData[];
}
```

### DepartmentTable

Table showing department financial performance.

#### Props

```typescript
interface DepartmentTableProps {
  departments: DepartmentFinance[];
}
```

### PatientMetricsCard

Card displaying patient statistics and utilization metrics.

#### Props

```typescript
interface PatientMetricsCardProps {
  metrics: PatientMetrics;
}
```

### ErrorBoundary

Catches JavaScript errors and displays fallback UI.

#### Props

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}
```

#### Features

- Error logging
- User-friendly error display
- Development error details
- Recovery options

## Hooks

### useAuth

Custom hook for authentication context access.

#### Returns

```typescript
AuthContextType
```

#### Throws

- `Error` if used outside AuthProvider

### useChartTheme

Provides chart theming based on current theme.

#### Returns

```typescript
{
  chartTheme: ChartTheme;
}
```

### useResponsive

Provides responsive breakpoint information.

#### Returns

```typescript
{
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: string;
}
```

### useTheme

Provides theme context access.

#### Returns

```typescript
{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

## Utilities

### Formatters

#### formatCurrency

Formats numbers as US currency.

```typescript
formatCurrency(value: number): string
```

**Example:**
```typescript
formatCurrency(1234567) // "$1,234,567"
```

#### formatPercentage

Formats numbers as percentages.

```typescript
formatPercentage(value: number): string
```

**Example:**
```typescript
formatPercentage(15.4) // "15.4%"
```

#### formatNumber

Formats numbers with thousand separators.

```typescript
formatNumber(value: number): string
```

**Example:**
```typescript
formatNumber(1234567) // "1,234,567"
```

#### formatCompactCurrency

Formats large numbers in compact form.

```typescript
formatCompactCurrency(value: number): string
```

**Example:**
```typescript
formatCompactCurrency(1500000) // "$1.5M"
formatCompactCurrency(1500) // "$1.5K"
```

#### getChangeColor

Returns Tailwind CSS color class for change type.

```typescript
getChangeColor(changeType: 'increase' | 'decrease'): string
```

#### getChangeIcon

Returns arrow icon for change type.

```typescript
getChangeIcon(changeType: 'increase' | 'decrease'): string
```

### Logger

Centralized logging system with environment awareness.

#### Methods

- `info(message: string, options?: LogOptions): void`
- `warn(message: string, options?: LogOptions): void`
- `error(message: string, options?: LogOptions): void`

#### LogOptions

```typescript
interface LogOptions {
  context?: string;
  data?: unknown;
}
```

#### Example Usage

```typescript
import { logger } from './utils/logger';

logger.info('User signed in', {
  context: 'AuthService',
  data: { userId: '123' }
});
```

### Auth Utilities

#### validatePassword

Validates password strength requirements.

```typescript
validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
}
```

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

## Context Providers

### AuthProvider

Provides authentication state and methods to child components.

#### Props

```typescript
interface AuthProviderProps {
  children: ReactNode;
}
```

### ThemeProvider

Provides theme state and toggle functionality.

#### Props

```typescript
interface ThemeProviderProps {
  children: ReactNode;
}
```

## Error Handling

### Error Types

#### AppError

```typescript
interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
}
```

### Error Handling Strategy

1. **Component Level**: ErrorBoundary catches React errors
2. **Hook Level**: Custom error handling in async operations
3. **Service Level**: Structured error responses from API calls
4. **User Level**: User-friendly error messages and recovery options

### Error Recovery

- Automatic retry for transient errors
- User-initiated retry options
- Graceful degradation for non-critical features
- Comprehensive error logging for debugging

## Performance Considerations

### Bundle Optimization

- Code splitting with React.lazy()
- Tree shaking for unused code
- Vendor chunk separation
- Asset compression and optimization

### Runtime Performance

- Memoization for expensive calculations
- Optimized re-renders with useMemo and useCallback
- Lazy loading for non-critical components
- Efficient data structures and algorithms

### Monitoring

- Bundle size analysis with Vite visualizer
- Performance metrics tracking
- Error monitoring and alerting
- User experience metrics

## Security Considerations

### Authentication

- Password strength validation
- Rate limiting for login attempts
- Secure token storage
- Session management

### Data Protection

- Input validation and sanitization
- XSS prevention
- CSRF protection
- Secure data transmission

### Access Control

- Role-based permissions
- Hospital access restrictions
- API endpoint protection
- Audit logging

## Testing

### Test Coverage

- Unit tests for utilities and hooks
- Component tests with React Testing Library
- Integration tests for user flows
- E2E tests for critical paths

### Test Utilities

- Mock data generators
- Test helpers and utilities
- Custom render functions
- Mock service implementations

## Development Guidelines

### Code Style

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Consistent naming conventions

### Documentation

- JSDoc comments for all public APIs
- README files for major components
- Code examples and usage patterns
- Architecture decision records

### Git Workflow

- Feature branch development
- Pull request reviews
- Automated testing and linting
- Semantic versioning

## Performance Utilities API

### PerformanceMonitor Class

Provides comprehensive performance monitoring capabilities.

```typescript
class PerformanceMonitor {
  startTiming(name: string, metadata?: Record<string, unknown>): void;
  endTiming(name: string): PerformanceMetrics | undefined;
  getMetrics(): PerformanceMetrics[];
  clearMetrics(): void;
}
```

**Example Usage**:
```typescript
import { performanceMonitor } from '../utils/performance';

// Start monitoring
performanceMonitor.startTiming('dataProcessing', { itemCount: 1000 });

// Process data...

// End monitoring
const metrics = performanceMonitor.endTiming('dataProcessing');
console.log(`Processing took ${metrics?.duration}ms`);
```

### Performance Functions

#### measurePerformance

Wraps a function with performance monitoring.

```typescript
function measurePerformance<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name: string
): T;
```

**Example**:
```typescript
const optimizedFunction = measurePerformance(
  (data: number[]) => data.reduce((sum, n) => sum + n, 0),
  'arraySum'
);
```

#### debounce

Creates a debounced version of a function.

```typescript
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void;
```

**Example**:
```typescript
const debouncedSearch = debounce((query: string) => {
  // Perform search
}, 300);
```

#### throttle

Creates a throttled version of a function.

```typescript
function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void;
```

#### memoize

Creates a memoized version of a function with optional custom key function.

```typescript
function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T;
```

**Example**:
```typescript
const memoizedCalculation = memoize(
  (data: DataItem[]) => expensiveCalculation(data),
  (data) => data.map(item => item.id).join(',')
);
```

## Security Utilities API

### Password Security

#### hashPassword

Securely hashes a password using bcrypt.

```typescript
function hashPassword(password: string): Promise<string>;
```

#### verifyPassword

Verifies a password against its hash.

```typescript
function verifyPassword(password: string, hash: string): Promise<boolean>;
```

### Input Validation

#### validateInput

Validates input data against Zod schemas.

```typescript
function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: T
): { success: boolean; errors: string[] | null };
```

**Example**:
```typescript
const result = validateInput(validationSchemas.user, userData);
if (!result.success) {
  console.error('Validation errors:', result.errors);
}
```

### Rate Limiting

#### RateLimiter Class

Implements rate limiting for API calls.

```typescript
class RateLimiter {
  constructor(windowMs: number = 15 * 60 * 1000, maxAttempts: number = 5);
  checkLimit(identifier: string): boolean;
  reset(identifier: string): void;
}
```

### Error Sanitization

#### sanitizeError

Sanitizes error objects for safe logging and display.

```typescript
function sanitizeError(error: unknown): {
  message: string;
  stack?: string;
  timestamp: string;
};
```

## Data Formatting API

### Currency Formatting

#### formatCurrency

Formats numbers as currency with proper localization.

```typescript
function formatCurrency(
  value: number,
  options?: {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string;
```

**Example**:
```typescript
formatCurrency(1234567.89); // "$1,234,567.89"
formatCurrency(1234567.89, { currency: 'EUR', locale: 'de-DE' }); // "1.234.567,89 €"
```

#### formatCompactCurrency

Formats large currency values in compact notation.

```typescript
function formatCompactCurrency(value: number): string;
```

**Example**:
```typescript
formatCompactCurrency(1234567); // "$1.2M"
formatCompactCurrency(1234); // "$1.2K"
```

### Percentage Formatting

#### formatPercentage

Formats numbers as percentages.

```typescript
function formatPercentage(
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string;
```

### Change Indicators

#### getChangeColor

Returns appropriate color class for value changes.

```typescript
function getChangeColor(changeType: 'increase' | 'decrease'): string;
```

#### getChangeIcon

Returns appropriate icon component for value changes.

```typescript
function getChangeIcon(changeType: 'increase' | 'decrease'): React.ReactNode;
```

## Logging API

### Logger Interface

Centralized logging system with environment-aware behavior.

```typescript
interface Logger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
}
```

**LogContext Interface**:
```typescript
interface LogContext {
  context?: string;
  data?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}
```

**Example Usage**:
```typescript
import { logger } from '../utils/logger';

logger.info('User logged in successfully', {
  context: 'AuthContext',
  data: { userId: user.id, role: user.role }
});

logger.error('Failed to load dashboard data', {
  context: 'Dashboard',
  data: { hospitalId, year, error: error.message }
});
```

## Theme System API

### useTheme Hook

Provides theme management functionality.

```typescript
interface ThemeHook {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
}

function useTheme(): ThemeHook;
```

### useChartTheme Hook

Provides chart-specific theming.

```typescript
interface ChartThemeHook {
  chartTheme: ChartTheme;
  resolvedTheme: 'light' | 'dark';
}

function useChartTheme(): ChartThemeHook;
```

**ChartTheme Interface**:
```typescript
interface ChartTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
  };
  grid: { stroke: string };
  axis: { stroke: string };
  tooltip: {
    backgroundColor: string;
    border: string;
    textColor: string;
    shadowColor: string;
  };
  legend: { color: string };
}
```

## Responsive Design API

### useResponsive Hook

Provides responsive design utilities and breakpoint detection.

```typescript
interface ResponsiveHook {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
}

function useResponsive(): ResponsiveHook;
```

**Example Usage**:
```typescript
const { isMobile, breakpoint } = useResponsive();

return (
  <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
    {/* Responsive content */}
  </div>
);
```

## Error Handling API

### ErrorBoundary Component

React error boundary with comprehensive error handling.

**Props**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
```

**Error Fallback Props**:
```typescript
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  hasError: boolean;
}
```

### Error Handler Utility

#### handleError

Centralized error handling function.

```typescript
function handleError(
  error: Error,
  context?: string,
  additionalData?: Record<string, unknown>
): void;
```

## Testing Utilities API

### Test Helpers

#### renderWithProviders

Renders components with necessary context providers for testing.

```typescript
function renderWithProviders(
  ui: React.ReactElement,
  options?: {
    initialAuthState?: Partial<AuthContextType>;
    initialTheme?: Theme;
    route?: string;
  }
): RenderResult;
```

#### mockUser

Creates mock user data for testing.

```typescript
function mockUser(overrides?: Partial<User>): User;
```

#### mockHospitalData

Creates mock hospital data for testing.

```typescript
function mockHospitalData(
  hospitalId?: string,
  year?: number
): HospitalData;
```

## Configuration API

### Demo Configuration

Access to demo configuration and settings.

```typescript
interface DemoConfig {
  hospitals: Hospital[];
  users: User[];
  defaultYear: number;
  availableYears: number[];
}

const demoConfig: DemoConfig;
```

### Build Configuration

Access to build-time configuration.

```typescript
interface BuildConfig {
  version: string;
  buildTime: string;
  environment: 'development' | 'production' | 'test';
  apiUrl: string;
}

const buildConfig: BuildConfig;
```

## Migration Guide

### From v1.0 to v1.1

**Breaking Changes**:
- `AuthContext.user` now includes `lastLogin` field
- `ThemeContext.theme` accepts 'system' value
- Chart components now require `isLoading` prop

**Migration Steps**:
1. Update AuthContext usage to handle new user fields
2. Update theme components to support system theme
3. Add loading props to chart components
4. Update test mocks with new data structure

**Deprecated APIs**:
- `formatCurrency` without options parameter (use with options)
- Direct localStorage access (use auth context methods)

### Upgrading Dependencies

When upgrading major dependencies:

1. **React 18 → 19**: Update concurrent features usage
2. **TypeScript 4 → 5**: Update type definitions
3. **Vite 4 → 5**: Update build configuration
4. **Tailwind 3 → 4**: Update class names and configuration

## Best Practices

### API Usage Guidelines

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Type Safety**: Use TypeScript interfaces for all API responses
3. **Performance**: Implement proper memoization for expensive operations
4. **Security**: Validate all inputs and sanitize outputs
5. **Testing**: Mock all external dependencies in tests

### Code Examples

**Proper Error Handling**:
```typescript
try {
  const data = await fetchHospitalData(hospitalId, year);
  setHospitalData(data);
} catch (error) {
  logger.error('Failed to fetch hospital data', {
    context: 'Dashboard',
    data: { hospitalId, year, error }
  });
  handleError(error as Error, 'Dashboard');
}
```

**Performance Optimization**:
```typescript
const processedData = useMemo(() => {
  return measurePerformance(() => {
    return data.map(item => ({
      ...item,
      formattedValue: formatCurrency(item.value)
    }));
  }, 'dataProcessing');
}, [data]);
```

**Secure Input Handling**:
```typescript
const handleSubmit = async (formData: FormData) => {
  const validation = validateInput(schemas.loginForm, formData);
  if (!validation.success) {
    setErrors(validation.errors);
    return;
  }
  
  // Process validated data
};
```

This comprehensive API documentation provides detailed information about all available functions, hooks, and utilities in the Hospital Finance Dashboard application.