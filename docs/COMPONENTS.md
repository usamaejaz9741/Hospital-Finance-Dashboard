# Components Documentation

## Overview

This document provides comprehensive documentation for all React components in the Hospital Finance Dashboard. Each component is designed with reusability, accessibility, and performance in mind.

## 📋 Component Index

### Core Components
- [App](#app) - Main application component
- [Dashboard](#dashboard) - Primary dashboard layout
- [Header](#header) - Navigation and user interface header
- [MetricCard](#metriccard) - Key performance indicator display
- [RevenueChart](#revenuechart) - Revenue visualization
- [CashFlowChart](#cashflowchart) - Cash flow analysis
- [ExpensePieChart](#expensepiechart) - Expense breakdown visualization
- [DepartmentTable](#departmenttable) - Department performance table
- [PatientMetricsCard](#patientmetricscard) - Patient-related metrics

### Authentication Components
- [LoginForm](#loginform) - User authentication interface
- [AuthGuard](#authguard) - Route protection component
- [LogoutButton](#logoutbutton) - User logout functionality

### UI Components
- [Button](#button) - Reusable button component
- [Dropdown](#dropdown) - Select dropdown component
- [ThemeToggle](#themetoggle) - Dark/light mode switcher
- [LoadingSpinner](#loadingspinner) - Loading state indicator
- [ErrorBoundary](#errorboundary) - Error handling wrapper

### Utility Components
- [ChartNoData](#chartnodata) - Empty state for charts
- [DashboardLoading](#dashboardloading) - Dashboard loading state
- [DashboardNoData](#dashboardnodata) - Empty dashboard state
- [ResponsiveChartWrapper](#responsivechartwrapper) - Chart responsiveness wrapper

## 🔧 Core Components

### App

**Location**: `src/App.tsx`

**Purpose**: Main application component that orchestrates the entire application flow.

**Features**:
- Authentication state management
- Theme provider integration
- Error boundary wrapping
- Route handling

**Props**: None

**Usage**:
```tsx
<App />
```

**Key Responsibilities**:
- Initialize authentication context
- Provide theme context to child components
- Handle global error states
- Manage application routing

---

### Dashboard

**Location**: `src/components/Dashboard.tsx`

**Purpose**: Main dashboard layout displaying financial metrics and charts.

**Features**:
- Responsive grid layout
- Metric cards display
- Chart integration
- Department performance table
- Real-time data updates

**Props**:
```typescript
interface DashboardProps {
  // No explicit props - uses context data
}
```

**Usage**:
```tsx
<Dashboard />
```

**Key Components Used**:
- MetricCard components
- RevenueChart
- CashFlowChart
- ExpensePieChart
- DepartmentTable
- PatientMetricsCard

---

### Header

**Location**: `src/components/Header.tsx`

**Purpose**: Application header with navigation, user info, and theme toggle.

**Features**:
- User authentication display
- Theme toggle functionality
- Responsive navigation
- Logout functionality

**Props**:
```typescript
interface HeaderProps {
  // No explicit props - uses context data
}
```

**Usage**:
```tsx
<Header />
```

**Key Features**:
- User role display
- Hospital/branch information
- Theme switching
- Mobile-responsive design

---

### MetricCard

**Location**: `src/components/MetricCard.tsx`

**Purpose**: Displays key performance indicators with trend information.

**Features**:
- Value display with formatting
- Trend indicators (up/down)
- Percentage change display
- Icon support
- Loading states

**Props**:
```typescript
interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
  loading?: boolean;
}
```

**Usage**:
```tsx
<MetricCard
  title="Total Revenue"
  value={125000}
  change={12.5}
  changeType="increase"
  icon={<RevenueIcon />}
/>
```

**Variants**:
- Default: Standard metric display
- Loading: Shows skeleton loader
- Error: Displays error state

---

### RevenueChart

**Location**: `src/components/RevenueChart.tsx`

**Purpose**: Visualizes revenue trends over time using line charts.

**Features**:
- Interactive line chart
- Time period selection
- Revenue trend visualization
- Responsive design
- Loading and error states

**Props**:
```typescript
interface RevenueChartProps {
  data: RevenueData[];
  loading?: boolean;
  error?: string;
}
```

**Usage**:
```tsx
<RevenueChart
  data={revenueData}
  loading={isLoading}
  error={errorMessage}
/>
```

**Chart Features**:
- Multi-line support for different revenue streams
- Hover tooltips with detailed information
- Responsive scaling
- Accessibility support

---

### CashFlowChart

**Location**: `src/components/CashFlowChart.tsx`

**Purpose**: Displays cash flow analysis using area charts.

**Features**:
- Area chart visualization
- Positive/negative cash flow indication
- Time-based analysis
- Interactive tooltips

**Props**:
```typescript
interface CashFlowChartProps {
  data: CashFlowData[];
  loading?: boolean;
  error?: string;
}
```

**Usage**:
```tsx
<CashFlowChart
  data={cashFlowData}
  loading={isLoading}
  error={errorMessage}
/>
```

---

### ExpensePieChart

**Location**: `src/components/ExpensePieChart.tsx`

**Purpose**: Shows expense breakdown using pie/donut charts.

**Features**:
- Pie chart visualization
- Category-based breakdown
- Interactive legend
- Percentage display

**Props**:
```typescript
interface ExpensePieChartProps {
  data: ExpenseData[];
  loading?: boolean;
  error?: string;
}
```

**Usage**:
```tsx
<ExpensePieChart
  data={expenseData}
  loading={isLoading}
  error={errorMessage}
/>
```

---

### DepartmentTable

**Location**: `src/components/DepartmentTable.tsx`

**Purpose**: Displays department performance in a sortable table format.

**Features**:
- Sortable columns
- Responsive table design
- Department metrics display
- Performance indicators

**Props**:
```typescript
interface DepartmentTableProps {
  data: DepartmentData[];
  loading?: boolean;
  error?: string;
}
```

**Usage**:
```tsx
<DepartmentTable
  data={departmentData}
  loading={isLoading}
  error={errorMessage}
/>
```

**Table Features**:
- Sort by revenue, patients, efficiency
- Responsive column hiding
- Loading skeleton rows
- Error state handling

---

### PatientMetricsCard

**Location**: `src/components/PatientMetricsCard.tsx`

**Purpose**: Displays patient-related metrics and statistics.

**Features**:
- Patient count display
- Admission/discharge rates
- Average stay duration
- Bed occupancy rates

**Props**:
```typescript
interface PatientMetricsCardProps {
  data: PatientMetrics;
  loading?: boolean;
  error?: string;
}
```

**Usage**:
```tsx
<PatientMetricsCard
  data={patientData}
  loading={isLoading}
  error={errorMessage}
/>
```

## 🔐 Authentication Components

### LoginForm

**Location**: `src/components/auth/LoginForm.tsx`

**Purpose**: Handles user authentication with email and password.

**Features**:
- Form validation
- Error handling
- Loading states
- Accessibility support

**Props**:
```typescript
interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}
```

**Usage**:
```tsx
<LoginForm
  onSuccess={() => navigate('/dashboard')}
  onError={(error) => showNotification(error)}
/>
```

---

### AuthGuard

**Location**: `src/components/auth/AuthGuard.tsx`

**Purpose**: Protects routes that require authentication.

**Features**:
- Authentication checking
- Role-based access control
- Redirect handling
- Loading states

**Props**:
```typescript
interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}
```

**Usage**:
```tsx
<AuthGuard requiredRole="admin">
  <AdminPanel />
</AuthGuard>
```

---

### LogoutButton

**Location**: `src/components/auth/LogoutButton.tsx`

**Purpose**: Provides logout functionality with confirmation.

**Features**:
- Confirmation dialog
- Loading state
- Error handling
- Accessibility support

**Props**:
```typescript
interface LogoutButtonProps {
  variant?: 'button' | 'link';
  className?: string;
}
```

**Usage**:
```tsx
<LogoutButton variant="button" className="text-red-600" />
```

## 🎨 UI Components

### Button

**Location**: `src/components/Button.tsx`

**Purpose**: Reusable button component with multiple variants.

**Features**:
- Multiple variants (primary, secondary, danger)
- Size options (sm, md, lg)
- Loading state
- Icon support
- Accessibility features

**Props**:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

**Usage**:
```tsx
<Button
  variant="primary"
  size="md"
  loading={isSubmitting}
  icon={<SaveIcon />}
  onClick={handleSave}
>
  Save Changes
</Button>
```

---

### Dropdown

**Location**: `src/components/Dropdown.tsx`

**Purpose**: Select dropdown component with search and filtering.

**Features**:
- Search functionality
- Multi-select support
- Custom option rendering
- Keyboard navigation
- Accessibility support

**Props**:
```typescript
interface DropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
}
```

**Usage**:
```tsx
<Dropdown
  options={hospitalOptions}
  value={selectedHospital}
  onChange={setSelectedHospital}
  placeholder="Select Hospital"
  searchable
/>
```

---

### ThemeToggle

**Location**: `src/components/ThemeToggle.tsx`

**Purpose**: Toggles between light and dark themes.

**Features**:
- Theme switching
- Icon animation
- Accessibility support
- Persistent preference

**Props**:
```typescript
interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

**Usage**:
```tsx
<ThemeToggle className="ml-4" size="md" />
```

---

### LoadingSpinner

**Location**: `src/components/LoadingSpinner.tsx`

**Purpose**: Displays loading state with animated spinner.

**Features**:
- Animated spinner
- Size variants
- Color customization
- Accessibility support

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}
```

**Usage**:
```tsx
<LoadingSpinner size="md" color="text-blue-600" />
```

---

### ErrorBoundary

**Location**: `src/components/ErrorBoundary.tsx`

**Purpose**: Catches and handles React component errors gracefully.

**Features**:
- Error catching
- Fallback UI
- Error reporting
- Recovery options

**Props**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorBoundaryFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
```

**Usage**:
```tsx
<ErrorBoundary fallback={ErrorFallback}>
  <Dashboard />
</ErrorBoundary>
```

## 🔧 Utility Components

### ChartNoData

**Location**: `src/components/ChartNoData.tsx`

**Purpose**: Displays empty state for charts when no data is available.

**Features**:
- Empty state illustration
- Customizable message
- Action button support

**Props**:
```typescript
interface ChartNoDataProps {
  message?: string;
  actionText?: string;
  onAction?: () => void;
}
```

**Usage**:
```tsx
<ChartNoData
  message="No revenue data available"
  actionText="Refresh Data"
  onAction={handleRefresh}
/>
```

---

### DashboardLoading

**Location**: `src/components/DashboardLoading.tsx`

**Purpose**: Shows loading state for the entire dashboard.

**Features**:
- Skeleton loading
- Animated placeholders
- Responsive design

**Props**:
```typescript
interface DashboardLoadingProps {
  // No props needed
}
```

**Usage**:
```tsx
<DashboardLoading />
```

---

### DashboardNoData

**Location**: `src/components/DashboardNoData.tsx`

**Purpose**: Displays empty state when dashboard has no data.

**Features**:
- Empty state illustration
- Action suggestions
- Refresh functionality

**Props**:
```typescript
interface DashboardNoDataProps {
  onRefresh?: () => void;
}
```

**Usage**:
```tsx
<DashboardNoData onRefresh={handleRefresh} />
```

---

### ResponsiveChartWrapper

**Location**: `src/components/ResponsiveChartWrapper.tsx`

**Purpose**: Wraps charts to ensure proper responsive behavior.

**Features**:
- Responsive container
- Aspect ratio maintenance
- Resize handling

**Props**:
```typescript
interface ResponsiveChartWrapperProps {
  children: React.ReactNode;
  aspectRatio?: number;
  className?: string;
}
```

**Usage**:
```tsx
<ResponsiveChartWrapper aspectRatio={16/9}>
  <RevenueChart data={data} />
</ResponsiveChartWrapper>
```

## 🎯 Component Best Practices

### 1. Props Interface Design
- Always define explicit TypeScript interfaces
- Use optional props with default values
- Provide JSDoc comments for complex props

### 2. Accessibility
- Include ARIA labels and descriptions
- Support keyboard navigation
- Ensure color contrast compliance
- Provide screen reader support

### 3. Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Optimize re-renders with useMemo/useCallback

### 4. Error Handling
- Implement error boundaries where appropriate
- Provide meaningful error messages
- Include fallback UI states

### 5. Testing
- Write unit tests for all components
- Test accessibility features
- Include integration tests for complex interactions

## 🔄 Component Lifecycle

### Mounting
1. Component initialization
2. Context consumption
3. Effect hooks execution
4. Initial render

### Updating
1. Props/state changes
2. Re-render determination
3. Effect cleanup/execution
4. DOM updates

### Unmounting
1. Cleanup functions execution
2. Event listener removal
3. Memory leak prevention

## 📱 Responsive Behavior

### Mobile (< 768px)
- Stack components vertically
- Use touch-friendly sizes
- Optimize for thumb navigation
- Reduce information density

### Tablet (768px - 1024px)
- Balanced layout
- Touch and mouse support
- Moderate information density

### Desktop (> 1024px)
- Full layout utilization
- Hover states
- Maximum information density
- Keyboard shortcuts