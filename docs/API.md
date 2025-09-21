# API Documentation

This document provides comprehensive documentation for all APIs, services, and utilities in the Hospital Finance Dashboard.

## Table of Contents

- [Authentication API](#authentication-api)
- [Data Services](#data-services)
- [Utility Functions](#utility-functions)
- [Hooks API](#hooks-api)
- [Context APIs](#context-apis)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)

## Authentication API

### AuthService

The authentication service handles user authentication, registration, and session management.

#### `signIn(email: string, password: string): Promise<User>`

Authenticates a user with email and password credentials.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password

**Returns:** `Promise<User>` - User object on successful authentication

**Throws:** `Error` - If credentials are invalid or account is locked

**Example:**
```typescript
import { authService } from '../data/mockUsers';

try {
  const user = await authService.signIn('admin@hospitalfinance.com', 'UsamaHF2024!');
  console.log('Welcome,', user.name);
} catch (error) {
  console.error('Authentication failed:', error.message);
}
```

**Error Cases:**
- Invalid email format
- Incorrect password
- Account locked (5 failed attempts)
- Rate limiting exceeded

#### `signUp(userData: SignUpData): Promise<User>`

Registers a new user account with the provided information.

**Parameters:**
- `userData` (SignUpData): User registration data

**Returns:** `Promise<User>` - Created user object

**Throws:** `Error` - If registration fails or email already exists

**Example:**
```typescript
const newUser = await authService.signUp({
  name: 'Dr. Jane Smith',
  email: 'jane.smith@hospital.com',
  password: 'SecurePass123!',
  role: 'hospital_owner',
  hospitalIds: ['general-1', 'specialty-1']
});
```

### Role-Based Access Control

#### `canAccessHospital(hospitalId: string): boolean`

Checks if the current user can access a specific hospital.

**Parameters:**
- `hospitalId` (string): Hospital identifier

**Returns:** `boolean` - True if user has access

**Access Rules:**
- **Admin**: Access to all hospitals
- **Hospital Owner**: Access to owned hospitals only
- **Branch Manager**: Access to assigned hospital only

**Example:**
```typescript
const { canAccessHospital } = useAuth();

if (canAccessHospital('general-1')) {
  // Load hospital data
  loadHospitalData('general-1');
} else {
  // Show access denied message
  showAccessDenied();
}
```

#### `getAccessibleHospitals(): string[]`

Returns array of hospital IDs the current user can access.

**Returns:** `string[]` - Array of accessible hospital IDs

**Example:**
```typescript
const { getAccessibleHospitals } = useAuth();
const accessibleHospitals = getAccessibleHospitals();

// Filter hospital dropdown options
const hospitalOptions = hospitals.filter(h => 
  accessibleHospitals.includes(h.id)
);
```

## Data Services

### Mock Data Service

#### `getHospitalData(hospitalId: string, year: number): HospitalData | undefined`

Retrieves comprehensive financial data for a specific hospital and year.

**Parameters:**
- `hospitalId` (string): Hospital identifier
- `year` (number): Year for data retrieval (2021-2024)

**Returns:** `HospitalData | undefined` - Complete hospital data or undefined if not found

**Example:**
```typescript
import { getHospitalData } from '../data/mockData';

const hospitalData = getHospitalData('general-1', 2024);
if (hospitalData) {
  console.log('Total Revenue:', hospitalData.financialMetrics[0].value);
  console.log('Departments:', hospitalData.departmentFinances.length);
}
```

**Data Structure:**
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

#### `generateVariation(baseValue: number, variationPercent?: number): number`

Generates realistic variations in financial data for simulation purposes.

**Parameters:**
- `baseValue` (number): Base value to vary
- `variationPercent` (number, optional): Maximum percentage variation (default: 15%)

**Returns:** `number` - Varied value with random fluctuation

**Example:**
```typescript
const baseRevenue = 1000000;
const variedRevenue = generateVariation(baseRevenue, 20);
// Result: between 800,000 and 1,200,000
```

## Utility Functions

### Formatters

#### `formatCurrency(value: number): string`

Formats a number as US currency with proper localization.

**Parameters:**
- `value` (number): Numeric value to format

**Returns:** `string` - Formatted currency string

**Example:**
```typescript
import { formatCurrency } from '../utils/formatters';

formatCurrency(1500000); // "$1,500,000"
formatCurrency(1250.50); // "$1,251"
```

#### `formatPercentage(value: number): string`

Formats a number as a percentage with one decimal place.

**Parameters:**
- `value` (number): Numeric value to format

**Returns:** `string` - Formatted percentage string

**Example:**
```typescript
formatPercentage(0.235); // "23.5%"
formatPercentage(12.345); // "12.3%"
```

#### `formatNumber(value: number): string`

Formats a number with locale-specific thousands separators.

**Parameters:**
- `value` (number): Numeric value to format

**Returns:** `string` - Formatted number string

**Example:**
```typescript
formatNumber(1500000); // "1,500,000"
formatNumber(12345.67); // "12,345.67"
```

#### `formatCompactCurrency(value: number): string`

Formats large numbers in compact notation (K, M).

**Parameters:**
- `value` (number): Numeric value to format

**Returns:** `string` - Compact currency string

**Example:**
```typescript
formatCompactCurrency(1500000); // "$1.5M"
formatCompactCurrency(1500); // "$1.5K"
formatCompactCurrency(500); // "$500"
```

### Logging System

#### `logger.info(message: string, options?: LogOptions): void`

Logs informational messages with optional context.

**Parameters:**
- `message` (string): Log message
- `options` (LogOptions, optional): Additional logging context

**Example:**
```typescript
import { logger } from '../utils/logger';

logger.info('User signed in successfully');
logger.info('Dashboard data loaded', {
  context: 'Dashboard',
  data: { hospitalId: 'general-1', recordCount: 150 }
});
```

#### `logger.warn(message: string, options?: LogOptions): void`

Logs warning messages for potential issues.

**Example:**
```typescript
logger.warn('API response time is slow', {
  context: 'DataService',
  data: { endpoint: '/api/data', duration: '5.2s' }
});
```

#### `logger.error(message: string, options?: LogOptions): void`

Logs error messages with context for debugging.

**Example:**
```typescript
logger.error('Failed to load hospital data', {
  context: 'DataService',
  data: { hospitalId: 'general-1', error: 'Network timeout' }
});
```

### Performance Utilities

#### `measurePerformance<T>(fn: () => T, label: string): T`

Measures and logs the performance of a function execution.

**Parameters:**
- `fn` (function): Function to measure
- `label` (string): Performance measurement label

**Returns:** `T` - Result of the function execution

**Example:**
```typescript
import { measurePerformance } from '../utils/performance';

const processedData = measurePerformance(() => {
  return data.map(item => ({
    ...item,
    revenue: Math.round(item.revenue),
    expenses: Math.round(item.expenses)
  }));
}, 'dataProcessing');
```

### Accessibility Utilities

#### `generateMetricAriaLabel(title: string, value: string, change: number, changeType: string, period: string): string`

Generates accessible ARIA labels for financial metrics.

**Parameters:**
- `title` (string): Metric title
- `value` (string): Formatted metric value
- `change` (number): Change percentage
- `changeType` (string): Type of change (increase/decrease)
- `period` (string): Time period for change

**Returns:** `string` - Accessible ARIA label

**Example:**
```typescript
import { generateMetricAriaLabel } from '../utils/accessibility';

const ariaLabel = generateMetricAriaLabel(
  'Total Revenue',
  '$1,500,000',
  12.5,
  'increase',
  'vs last month'
);
// Result: "Total Revenue: $1,500,000. increased by 12.5% vs last month"
```

#### `screenReader.announce(message: string, priority?: 'polite' | 'assertive'): void`

Announces messages to screen readers.

**Parameters:**
- `message` (string): Message to announce
- `priority` (string, optional): Announcement priority

**Example:**
```typescript
import { screenReader } from '../utils/accessibility';

// Polite announcement
screenReader.announce('Dashboard data updated', 'polite');

// Assertive announcement for errors
screenReader.announce('Error: Failed to load data', 'assertive');
```

## Hooks API

### useAuth Hook

Provides authentication state and methods throughout the application.

#### Returns

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => void;
  canAccessHospital: (hospitalId: string) => boolean;
  getAccessibleHospitals: () => string[];
}
```

**Example:**
```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, signOut, canAccessHospital } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      {canAccessHospital('general-1') && (
        <button onClick={() => loadHospitalData('general-1')}>
          Load Hospital Data
        </button>
      )}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### useTheme Hook

Provides theme management functionality.

#### Returns

```typescript
interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  isTransitioning: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
```

**Example:**
```typescript
import { useTheme } from '../hooks/useTheme';

function ThemeControls() {
  const { theme, resolvedTheme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {resolvedTheme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### useChartTheme Hook

Provides chart-specific theming utilities.

#### Returns

```typescript
interface ChartTheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
  };
  grid: {
    stroke: string;
    strokeDasharray: string;
  };
  axis: {
    stroke: string;
  };
  cursor: {
    fill: string;
    stroke: string;
  };
}
```

**Example:**
```typescript
import { useChartTheme } from '../hooks/useChartTheme';

function ChartComponent() {
  const { chartTheme } = useChartTheme();
  
  return (
    <LineChart>
      <Line 
        stroke={chartTheme.colors.primary}
        strokeWidth={2}
      />
      <CartesianGrid 
        stroke={chartTheme.grid.stroke}
        strokeDasharray={chartTheme.grid.strokeDasharray}
      />
    </LineChart>
  );
}
```

## Context APIs

### AuthContext

Provides authentication state management throughout the application.

#### Context Value

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: SignUpData) => Promise<void>;
  signOut: () => void;
  canAccessHospital: (hospitalId: string) => boolean;
  getAccessibleHospitals: () => string[];
}
```

#### Provider Usage

```typescript
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <MyApplication />
    </AuthProvider>
  );
}
```

### ThemeContext

Provides theme management throughout the application.

#### Context Value

```typescript
interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  isTransitioning: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
```

#### Provider Usage

```typescript
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <MyApplication />
    </ThemeProvider>
  );
}
```

## Type Definitions

### Core Types

#### User Interface

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hospitalId?: string;
  hospitalIds?: string[];
  createdAt: string;
  lastLogin?: string;
  passwordHash?: string;
}
```

#### Financial Metric Interface

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

#### Hospital Data Interface

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

### Authentication Types

#### User Role Type

```typescript
type UserRole = 'admin' | 'hospital_owner' | 'branch_owner';
```

#### Sign Up Data Interface

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

### Theme Types

#### Theme Type

```typescript
type Theme = 'light' | 'dark' | 'auto';
type ResolvedTheme = 'light' | 'dark';
```

#### Theme Context Type

```typescript
interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  isTransitioning: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
```

## Error Handling

### Error Types

#### Authentication Errors

```typescript
interface AuthError {
  message: string;
  code: string;
}
```

#### Common Error Codes

- `INVALID_CREDENTIALS`: Email or password is incorrect
- `ACCOUNT_LOCKED`: Account temporarily locked due to failed attempts
- `EMAIL_ALREADY_EXISTS`: Email address already registered
- `WEAK_PASSWORD`: Password doesn't meet complexity requirements
- `ACCESS_DENIED`: User doesn't have permission for requested resource

### Error Handling Patterns

#### Service Error Handling

```typescript
try {
  const user = await authService.signIn(email, password);
  // Handle success
} catch (error) {
  if (error.message.includes('locked')) {
    showLockoutMessage();
  } else if (error.message.includes('credentials')) {
    showInvalidCredentialsMessage();
  } else {
    showGenericErrorMessage();
  }
}
```

#### Component Error Handling

```typescript
function MyComponent() {
  const [error, setError] = useState<string | null>(null);
  
  const handleAction = async () => {
    try {
      setError(null);
      await performAction();
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div>
      {error && <ErrorMessage message={error} />}
      <button onClick={handleAction}>Perform Action</button>
    </div>
  );
}
```

### Error Boundary Usage

```typescript
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <MyApplication />
    </ErrorBoundary>
  );
}
```

---

This API documentation provides comprehensive coverage of all available APIs, services, and utilities in the Hospital Finance Dashboard. For implementation details and examples, refer to the individual source files and their associated test files.