# Hospital Finance Dashboard API Documentation

## Table of Contents
- [Authentication API](#authentication-api)
- [Data Types](#data-types)
- [Utility Functions](#utility-functions)
- [Components API](#components-api)
- [Hooks](#hooks)
- [Context APIs](#context-apis)

## Authentication API

### `authService.signIn(email: string, password: string): Promise<User>`

Authenticates a user with email and password credentials.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password (must meet security requirements)

**Returns:** Promise<User> - The authenticated user object

**Throws:**
- `Error` - If credentials are invalid, password is weak, or account is locked

**Example:**
```typescript
import { authService } from '../data/mockUsers';

try {
  const user = await authService.signIn('admin@hospitalfinance.com', 'UsamaHF2024!');
  console.log('Logged in as:', user.name);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

**Security Features:**
- Password strength validation
- Rate limiting (5 attempts before lockout)
- 15-minute account lockout after failed attempts
- Automatic lockout reset after timeout

### `authService.signUp(userData: SignUpData): Promise<User>`

Creates a new user account.

**Parameters:**
- `userData` (SignUpData): User registration information

**Returns:** Promise<User> - The newly created user object

**Example:**
```typescript
const newUser = await authService.signUp({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  role: 'hospital_owner',
  hospitalIds: ['general-1']
});
```

## Data Types

### Core Types

#### `User`
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
}
```

#### `UserRole`
```typescript
type UserRole = 'admin' | 'hospital_owner' | 'branch_owner';
```

#### `Hospital`
```typescript
interface Hospital {
  id: string;
  name: string;
  location: string;
  type: HospitalType;
}
```

#### `HospitalType`
```typescript
type HospitalType = 'General' | 'Specialty' | 'Pediatric' | 'Trauma';
```

#### `FinancialMetric`
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

#### `HospitalData`
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

## Utility Functions

### Password Validation

#### `validatePassword(password: string): PasswordValidationResult`

Validates password strength against security requirements.

**Parameters:**
- `password` (string): The password to validate

**Returns:** PasswordValidationResult with validation status and error messages

**Example:**
```typescript
import { validatePassword } from '../utils/auth';

const result = validatePassword('weakpass');
if (!result.isValid) {
  console.log('Password errors:', result.errors);
  // Output: ['Password must be at least 8 characters long', ...]
}
```

**Security Requirements:**
- Minimum 8 characters, maximum 128 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- No repeating characters (3+ times)
- No common patterns (password, admin, 12345, qwerty)

### Formatting Utilities

#### `formatCurrency(value: number): string`

Formats a number as US currency.

**Example:**
```typescript
import { formatCurrency } from '../utils/formatters';

console.log(formatCurrency(1234567)); // "$1,234,567"
```

#### `formatCompactCurrency(value: number): string`

Formats large numbers with K/M suffixes.

**Example:**
```typescript
import { formatCompactCurrency } from '../utils/formatters';

console.log(formatCompactCurrency(1500000)); // "$1.5M"
console.log(formatCompactCurrency(2500)); // "$2.5K"
```

#### `formatPercentage(value: number): string`

Formats a number as a percentage.

**Example:**
```typescript
import { formatPercentage } from '../utils/formatters';

console.log(formatPercentage(15.4)); // "15.4%"
```

#### `getChangeColor(changeType: 'increase' | 'decrease'): string`

Returns Tailwind CSS color class for metric changes.

**Example:**
```typescript
import { getChangeColor } from '../utils/formatters';

console.log(getChangeColor('increase')); // "text-success-600"
console.log(getChangeColor('decrease')); // "text-danger-600"
```

### Data Access

#### `getHospitalData(hospitalId: string, year: number): HospitalData | undefined`

Retrieves hospital data for a specific hospital and year.

**Example:**
```typescript
import { getHospitalData } from '../data/mockData';

const data = getHospitalData('general-1', 2024);
if (data) {
  console.log('Hospital metrics:', data.financialMetrics);
}
```

## Components API

### Core Components

#### `<Button />`

Flexible button component with multiple variants and animations.

**Props:**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}
```

**Example:**
```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Save Changes
</Button>

<Button variant="ghost" size="sm">
  Cancel
</Button>
```

#### `<Input />`

Enhanced input component with floating labels and password visibility toggle.

**Props:**
```typescript
interface InputProps {
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}
```

**Example:**
```tsx
<Input
  id="email"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  required
/>

<Input
  id="password"
  name="password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter your password"
  required
/>
```

#### `<Dropdown />`

Animated dropdown component with keyboard navigation.

**Props:**
```typescript
interface DropdownProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
```

**Example:**
```tsx
<Dropdown
  options={[
    { value: 'general-1', label: 'Metro General Hospital' },
    { value: 'cardio-1', label: 'Heart & Vascular Institute' }
  ]}
  value={selectedHospital}
  onChange={setSelectedHospital}
  placeholder="Select Hospital"
/>
```

#### `<LoadingSpinner />`

Customizable loading spinner with text and subtext.

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  subtext?: string;
  className?: string;
}
```

**Example:**
```tsx
<LoadingSpinner 
  size="lg" 
  text="Loading Dashboard..." 
  subtext="Please wait while we fetch your data"
/>
```

### Chart Components

#### `<RevenueChart />`

Displays revenue trends over time using a line chart.

**Props:**
```typescript
interface RevenueChartProps {
  data: RevenueData[];
}
```

#### `<ExpensePieChart />`

Shows expense breakdown as a pie chart.

**Props:**
```typescript
interface ExpensePieChartProps {
  data: ExpenseBreakdown[];
}
```

#### `<CashFlowChart />`

Displays cash flow data as a bar chart.

**Props:**
```typescript
interface CashFlowChartProps {
  data: CashFlowData[];
}
```

## Hooks

### `useAuth(): AuthContextType`

Hook to access authentication context.

**Returns:** AuthContextType with user data and auth methods

**Example:**
```typescript
import { useAuth } from '../hooks/useAuth';

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

### `useTheme(): ThemeContextType`

Hook to access theme context for dark/light mode.

**Returns:** ThemeContextType with theme state and toggle function

**Example:**
```typescript
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

## Context APIs

### AuthContext

Provides authentication state and methods throughout the app.

**Context Value:**
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

**Usage:**
```tsx
import { AuthProvider } from '../contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourAppContent />
    </AuthProvider>
  );
}
```

### ThemeContext

Manages dark/light theme state.

**Context Value:**
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}
```

## Error Handling

### Common Error Patterns

**Authentication Errors:**
```typescript
try {
  await signIn(email, password);
} catch (error) {
  if (error.message.includes('locked')) {
    // Handle account lockout
  } else if (error.message.includes('Invalid')) {
    // Handle invalid credentials
  } else {
    // Handle other auth errors
  }
}
```

**Data Loading Errors:**
```typescript
try {
  const data = await loadHospitalData(hospitalId, year);
  setData(data);
} catch (error) {
  logger.error('Failed to load hospital data', { error, hospitalId, year });
  setError('Unable to load data. Please try again.');
}
```

## Performance Best Practices

### Component Optimization

1. **Use React.memo for expensive components:**
```tsx
const ExpensiveChart = React.memo(({ data }) => {
  // Expensive rendering logic
});
```

2. **Implement useMemo for expensive calculations:**
```tsx
const processedData = useMemo(() => {
  return expensiveDataProcessing(rawData);
}, [rawData]);
```

3. **Use useCallback for event handlers:**
```tsx
const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);
```

### Data Loading

1. **Lazy load components:**
```tsx
const Dashboard = lazy(() => import('./Dashboard'));

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

2. **Implement proper error boundaries:**
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Testing

### Unit Testing Examples

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';

test('renders button with correct text', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByText('Click Me')).toBeInTheDocument();
});
```

### Integration Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { SignInPage } from '../components/auth/SignInPage';

test('sign in flow', async () => {
  render(
    <AuthProvider>
      <SignInPage />
    </AuthProvider>
  );
  
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.click(screen.getByText('Sign In'));
  
  // Assert expected behavior
});
```

## Configuration

### Environment Variables

```bash
# Development
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:3001

# Production
VITE_NODE_ENV=production
VITE_API_URL=https://api.hospitalfinance.com
```

### Build Configuration

The project uses Vite with optimized chunk splitting for better performance:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
```
