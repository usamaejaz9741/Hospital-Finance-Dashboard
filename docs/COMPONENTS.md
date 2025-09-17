# Component Documentation

This document provides comprehensive documentation for all React components in the Hospital Finance Dashboard, including their props, usage examples, and best practices.

## Table of Contents

- [Core Components](#core-components)
- [Chart Components](#chart-components)
- [Authentication Components](#authentication-components)
- [UI Components](#ui-components)
- [Layout Components](#layout-components)
- [Optimized Components](#optimized-components)

## Core Components

### Dashboard

The main dashboard component that orchestrates the entire financial analytics interface.

**Location**: `src/components/Dashboard.tsx`

**Props**: None (uses authentication context)

**Features**:
- Role-based hospital access control
- Dynamic data loading with year/hospital filtering
- Lazy-loaded chart components for performance
- Responsive design with mobile-friendly filters
- Comprehensive error handling and loading states

**Usage Example**:
```tsx
import Dashboard from './components/Dashboard';

// Used after authentication
<Dashboard />
```

**Key Functionality**:
- Hospital and year selection with access validation
- Real-time data updates based on selections
- Performance monitoring for data operations
- Responsive layout adaptation

---

### MetricCard

Displays financial key performance indicators with trend analysis.

**Location**: `src/components/MetricCard.tsx`

**Props**:
```typescript
interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  format: 'currency' | 'percentage' | 'number';
  icon?: React.ReactNode;
  className?: string;
}
```

**Usage Example**:
```tsx
<MetricCard
  title="Total Revenue"
  value={2500000}
  change={12.5}
  changeType="increase"
  format="currency"
  icon={<DollarSign className="w-5 h-5" />}
/>
```

**Features**:
- Automatic number formatting (currency, percentage, number)
- Trend indicators with color coding
- Responsive typography and spacing
- Icon support for visual enhancement

---

## Chart Components

### RevenueChart

Interactive line chart displaying revenue, expenses, and net income trends over time.

**Location**: `src/components/RevenueChart.tsx`

**Props**:
```typescript
interface RevenueChartProps {
  data: RevenueData[];
  isLoading?: boolean;
  onDataPointClick?: (data: RevenueData) => void;
}
```

**Usage Example**:
```tsx
<RevenueChart
  data={hospitalData.revenueData}
  isLoading={false}
  onDataPointClick={(data) => console.log('Clicked:', data)}
/>
```

**Features**:
- Multi-line chart with revenue, expenses, and net income
- Interactive tooltips with detailed information
- Responsive design with mobile optimization
- Theme-aware colors (light/dark mode)
- Click handlers for data point interaction
- Loading state with skeleton UI

---

### ExpensePieChart

Pie chart visualization for expense category breakdown.

**Location**: `src/components/ExpensePieChart.tsx`

**Props**:
```typescript
interface ExpensePieChartProps {
  data: ExpenseData[];
  isLoading?: boolean;
}
```

**Usage Example**:
```tsx
<ExpensePieChart
  data={hospitalData.expenses}
  isLoading={false}
/>
```

**Features**:
- Interactive pie chart with hover effects
- Percentage labels and values
- Legend with color coding
- Responsive sizing
- Empty state handling

---

### CashFlowChart

Bar chart showing operating, investing, and financing cash flows.

**Location**: `src/components/CashFlowChart.tsx`

**Props**:
```typescript
interface CashFlowChartProps {
  data: CashFlowData[];
  isLoading?: boolean;
}
```

**Usage Example**:
```tsx
<CashFlowChart
  data={hospitalData.cashFlow}
  isLoading={false}
/>
```

**Features**:
- Multi-series bar chart
- Positive/negative value visualization
- Interactive tooltips
- Responsive layout
- Theme integration

---

### DepartmentTable

Sortable table displaying department-wise financial performance.

**Location**: `src/components/DepartmentTable.tsx`

**Props**:
```typescript
interface DepartmentTableProps {
  departments: DepartmentFinance[];
  isLoading?: boolean;
}
```

**Usage Example**:
```tsx
<DepartmentTable
  departments={hospitalData.departments}
  isLoading={false}
/>
```

**Features**:
- Sortable columns with indicators
- Formatted financial data
- Responsive table design
- Loading states
- Empty state handling

---

## Authentication Components

### AuthWrapper

Route protection wrapper that handles authentication flow.

**Location**: `src/components/auth/AuthWrapper.tsx`

**Props**:
```typescript
interface AuthWrapperProps {
  children: React.ReactNode;
}
```

**Usage Example**:
```tsx
<AuthWrapper>
  <Dashboard />
</AuthWrapper>
```

**Features**:
- Automatic authentication state checking
- Smooth transitions between auth states
- Loading state management
- Route protection

---

### SignInPage

User authentication form with validation and security features.

**Location**: `src/components/auth/SignInPage.tsx`

**Props**:
```typescript
interface SignInPageProps {
  onSwitchToSignUp: () => void;
}
```

**Usage Example**:
```tsx
<SignInPage
  onSwitchToSignUp={() => setCurrentPage('signup')}
/>
```

**Features**:
- Form validation with real-time feedback
- Demo account quick access buttons
- Password visibility toggle
- Error handling with user-friendly messages
- Loading states during authentication
- Responsive design

---

### SignUpPage

User registration form with comprehensive validation.

**Location**: `src/components/auth/SignUpPage.tsx`

**Props**:
```typescript
interface SignUpPageProps {
  onSwitchToSignIn: () => void;
}
```

**Usage Example**:
```tsx
<SignUpPage
  onSwitchToSignIn={() => setCurrentPage('signin')}
/>
```

**Features**:
- Multi-step validation process
- Role selection with descriptions
- Password strength indicators
- Confirmation field validation
- Accessible form design

---

## UI Components

### Button

Flexible button component with multiple variants and accessibility features.

**Location**: `src/components/Button.tsx`

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**Usage Examples**:
```tsx
// Primary button
<Button variant="primary" onClick={handleSave}>
  Save Changes
</Button>

// Button with icon and loading state
<Button
  variant="secondary"
  icon={<Download />}
  loading={isDownloading}
  onClick={handleDownload}
>
  Download Report
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete Item
</Button>
```

**Features**:
- Multiple visual variants
- Size variations
- Loading states with spinner
- Icon support
- Full accessibility support
- Hover and focus states

---

### Input

Enhanced input component with validation and styling.

**Location**: `src/components/ui/Input.tsx`

**Props**:
```typescript
interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}
```

**Usage Example**:
```tsx
<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
  placeholder="Enter your email"
/>
```

**Features**:
- Built-in validation styling
- Error message display
- Label and placeholder support
- Accessible form integration
- Consistent styling across themes

---

### Dropdown

Accessible dropdown component with keyboard navigation.

**Location**: `src/components/Dropdown.tsx`

**Props**:
```typescript
interface DropdownProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}
```

**Usage Example**:
```tsx
<Dropdown
  label="Select Hospital"
  options={hospitalOptions}
  value={selectedHospital}
  onChange={setSelectedHospital}
  placeholder="Choose a hospital"
/>
```

**Features**:
- Keyboard navigation support
- Search functionality
- Custom styling options
- Accessible ARIA attributes
- Mobile-friendly design

---

### LoadingSpinner

Customizable loading spinner with text and animations.

**Location**: `src/components/LoadingSpinner.tsx`

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}
```

**Usage Example**:
```tsx
<LoadingSpinner
  size="lg"
  text="Loading dashboard data..."
/>
```

**Features**:
- Multiple size options
- Optional loading text
- Smooth animations
- Theme-aware colors
- Accessible loading states

---

## Layout Components

### Header

Application header with navigation, user info, and global controls.

**Location**: `src/components/Header.tsx`

**Props**: None (uses authentication context)

**Usage Example**:
```tsx
<Header />
```

**Features**:
- User profile display
- Theme toggle integration
- Responsive navigation
- Sign-out functionality
- Role-based content display

---

### ErrorBoundary

React error boundary with graceful fallback UI and recovery options.

**Location**: `src/components/ErrorBoundary.tsx`

**Props**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}
```

**Usage Example**:
```tsx
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>
```

**Features**:
- Comprehensive error catching
- User-friendly error messages
- Recovery options
- Development error details
- Logging integration

---

### ThemeToggle

Dark/light mode toggle with system preference detection.

**Location**: `src/components/ThemeToggle.tsx`

**Props**: None (uses theme context)

**Usage Example**:
```tsx
<ThemeToggle />
```

**Features**:
- System theme detection
- Smooth theme transitions
- Persistent theme selection
- Accessible toggle button
- Visual theme indicators

---

## Optimized Components

### OptimizedRevenueChart

Performance-optimized version of the revenue chart with advanced memoization.

**Location**: `src/components/optimized/OptimizedRevenueChart.tsx`

**Props**: Same as `RevenueChart`

**Usage Example**:
```tsx
<OptimizedRevenueChart
  data={largeDataset}
  isLoading={false}
  onDataPointClick={handleDataClick}
/>
```

**Features**:
- Advanced React.memo optimization
- Memoized data processing
- Performance monitoring
- Efficient re-render prevention
- Lazy loading support

---

## Best Practices

### Component Development Guidelines

1. **TypeScript First**: Always define proper interfaces for props
2. **Accessibility**: Include ARIA attributes and keyboard support
3. **Performance**: Use React.memo, useMemo, and useCallback appropriately
4. **Error Handling**: Implement proper error boundaries and fallbacks
5. **Testing**: Include comprehensive tests for all components
6. **Documentation**: Add JSDoc comments for all public props and methods

### Code Examples

**Component Template**:
```tsx
/**
 * Component description
 * 
 * @component
 * @example
 * ```tsx
 * <MyComponent prop="value" />
 * ```
 */
interface MyComponentProps {
  /** Description of prop */
  prop: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ prop }) => {
  // Component logic
  return <div>{prop}</div>;
};

export default React.memo(MyComponent);
```

**Custom Hook Pattern**:
```tsx
/**
 * Custom hook for specific functionality
 */
const useCustomLogic = () => {
  const [state, setState] = useState();
  
  // Hook logic
  
  return { state, setState };
};
```

### Performance Considerations

1. **Lazy Loading**: Use React.lazy for code splitting
2. **Memoization**: Memoize expensive calculations
3. **Event Handlers**: Use useCallback for stable references
4. **Props Drilling**: Consider context for deeply nested props
5. **Bundle Size**: Monitor and optimize component dependencies

### Testing Guidelines

1. **Unit Tests**: Test component rendering and props
2. **Integration Tests**: Test component interactions
3. **Accessibility Tests**: Verify ARIA attributes and keyboard navigation
4. **Performance Tests**: Monitor render times and memory usage

---

This documentation provides a comprehensive guide to all components in the Hospital Finance Dashboard. For implementation details, refer to the individual component files and their associated test files.
