# Hospital Finance Dashboard

A comprehensive, modern hospital finance dashboard built with React, TypeScript, and Tailwind CSS. This dashboard provides real-time financial insights, analytics, and key performance indicators for healthcare institutions.

## Features

### 🔐 Authentication & Role-Based Access

- **Secure Sign In/Sign Up**: User authentication with role-based access control
- **Three User Roles**: Admin, Hospital Owner, and Branch Manager
- **Permission-based Access**: Users only see data they have permission to access
- **Demo Accounts**: Pre-configured accounts for testing different roles

### 🏥 Multi-Hospital Management

- **Hospital Selection**: Choose from multiple hospitals with different specialties
- **Year-wise Analysis**: View financial data across different years (2021-2024)
- **Dynamic Filtering**: Real-time data updates based on hospital and year selection
- **Hospital Types**: General, Specialty, Pediatric, and Trauma centers

### 📊 Financial Analytics

- **Key Metrics Overview**: Total revenue, net profit, profit margin, and operating expenses
- **Revenue Tracking**: Monthly revenue, expenses, and net income trends
- **Cash Flow Analysis**: Operating, investing, and financing cash flows
- **Expense Breakdown**: Detailed categorization of hospital expenses

### 🏥 Hospital Operations

- **Department Performance**: Revenue and profit analysis by department
- **Patient Metrics**: Total patients, inpatients, outpatients, and emergency visits
- **Occupancy Tracking**: Real-time bed occupancy rates
- **Stay Duration**: Average patient stay duration analytics

### 🎨 Modern UI/UX

- **Light/Dark Mode**: Full theme switching with system preference detection
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Charts**: Built with Recharts for rich data visualization
- **Clean Interface**: Modern design with Tailwind CSS
- **Real-time Updates**: Dynamic data refresh and updates
- **Smooth Transitions**: Beautiful animations and transitions throughout

### 🛡️ Error Handling & Reliability

- **Error Boundaries**: Comprehensive error boundaries to catch and handle React errors gracefully
- **Fallback UI**: User-friendly error messages with recovery options
- **Development Debugging**: Detailed error information in development mode
- **Graceful Degradation**: Application continues to function even when individual components fail

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Hospital-Finance-Dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:3000` to view the dashboard (auto-opens)

5. **Sign In with Demo Account**

   Use one of the demo accounts to test different roles:

   - **Admin**: `admin@hospitalfinance.com` (password: admin123)
   - **Hospital Owner**: `owner@metrogeneral.com` (password: owner123)
   - **Branch Manager**: `manager@metrogeneral.com` (password: manager123)

## Available Scripts

- **Development**

  ```bash
  npm run dev          # Start dev server (port 3000, auto-opens)
  npm run build        # Build for production (with chunk optimization)
  npm run preview      # Preview production build
  ```

- **Testing**

  ```bash
  npm run test         # Run all tests
  npm run test:watch   # Run tests in watch mode
  npm run test:coverage # Generate coverage report
  ```

- **Code Quality**

  ```bash
  npm run lint        # Run ESLint
  npm run analyze     # Generate bundle analysis (dist/stats.html)
  ```

## Project Structure

```plaintext
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   │   ├── SignInPage.tsx    # Sign in form
│   │   ├── SignUpPage.tsx    # Sign up form
│   │   └── AuthWrapper.tsx   # Authentication wrapper
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── Header.tsx       # Application header
│   ├── MetricCard.tsx   # Key metrics display
│   ├── RevenueChart.tsx # Revenue trend chart
│   ├── DepartmentTable.tsx # Department performance table
│   ├── ExpensePieChart.tsx # Expense breakdown pie chart
│   ├── PatientMetricsCard.tsx # Patient statistics
│   ├── CashFlowChart.tsx # Cash flow bar chart
│   ├── ErrorBoundary.tsx # Error boundary for error handling
│   ├── ThemeToggle.tsx  # Theme switching component
│   ├── LoadingSpinner.tsx # Reusable loading spinner component
│   ├── Button.tsx       # Reusable button component with variants
│   └── Dropdown.tsx     # Reusable dropdown component
├── contexts/
│   ├── AuthContext.tsx  # Authentication context
│   └── ThemeContext.tsx # Theme management context
├── hooks/
│   ├── useAuth.ts       # Authentication hook
│   └── useTheme.ts      # Theme switching hook
├── data/
│   ├── mockData.ts      # Sample financial data
│   └── mockUsers.ts     # Sample user accounts
├── types/
│   ├── finance.ts       # Financial data types
│   ├── auth.ts          # Authentication types
│   └── theme.ts         # Theme-related types
├── utils/
│   └── formatters.ts    # Data formatting utilities
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
├── index.css           # Global styles
└── vite-env.d.ts       # Vite environment type definitions
```

## Key Components

## Core Components

Key components that make up the dashboard interface:

### Financial Components

- **MetricCard**: Single-responsibility component for displaying financial metrics with consistent formatting and accessibility
- **RevenueChart**: Interactive revenue visualization using Recharts with drill-down capabilities
- **DepartmentTable**: Sortable table showing department-wise financial performance
- **ExpensePieChart**: Expense breakdown visualization with hover tooltips and legend
- **CashFlowChart**: Multi-line chart showing operating, investing, and financing cash flows

### Patient Analytics

- **PatientMetricsCard**: Displays key patient statistics and trends over time, including occupancy and stay duration

### UI Infrastructure

- **ErrorBoundary**: Catches and handles React errors with fallback UI components
- **ThemeToggle**: Manages light/dark mode with system preference detection

## Development Guide

### Data Management

#### Adding Hospital Data

1. Add new hospital entries to the `hospitals` array in `src/data/mockData.ts`
2. Follow the existing hospital data structure
3. Update years if needed (currently 2021-2024)

#### Creating Financial Metrics

1. Update the `FinancialMetric` interface in `src/types/finance.ts`
2. Add mock data in `mockData.ts`
3. Use `MetricCard` component to display

#### Data Structure

- **Hospital Records**: Each hospital has data for all available years (2021-2024)
- **Metrics System**: Consistent metrics across all hospitals
- **Access Control**: Role-based filtering of visible data

### UI Customization

#### Chart Configuration

- Update colors in individual chart components
- Use Tailwind CSS color classes
- Follow accessibility guidelines for contrast

#### Style Guide

- Modify the color palette in `tailwind.config.js`
- Use utility classes for consistent spacing
- Follow dark mode patterns with `dark:` prefix

## Get Involved

See our [Improvement Plan](docs/IMPROVEMENT_PLAN.md) for upcoming enhancements and contribution guidelines.

---
_Built with care for healthcare financial management_
Displays key financial metrics with trend indicators and percentage changes.

## Component Documentation

### Core Visualizations

#### RevenueChart

Line chart showing revenue, expenses, and net income trends over time.

#### DepartmentTable

Table view of department-wise performance including revenue, expenses, profit, and margins.

#### ExpensePieChart

Pie chart visualization of expense breakdown by category.

#### PatientMetricsCard

Grid layout showing patient-related metrics and hospital occupancy.

#### CashFlowChart

Bar chart displaying cash flow analysis across different categories.

### Infrastructure Components

#### ErrorBoundary

React error boundary component that catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI instead of crashing the application.

#### ThemeToggle

Toggle component for switching between light and dark themes with system preference detection.

## Technical Architecture

### Data Models

The dashboard uses TypeScript interfaces for type safety:

- `FinancialMetric`: Key performance indicators
- `RevenueData`: Monthly revenue and expense data
- `DepartmentFinance`: Department-wise financial data
- `PatientMetrics`: Patient and occupancy statistics
- `ExpenseBreakdown`: Categorized expense data
- `CashFlowData`: Cash flow analysis data

### Customization Guide

#### Hospital Configuration

1. Add new hospital entries to the `hospitals` array in `src/data/mockData.ts`
2. The data generation system will automatically create financial data for all years
3. Hospital types supported: General, Specialty, Pediatric, Trauma

#### Metric Management

1. Update the `FinancialMetric` interface in `src/types/finance.ts`
2. Add new metric data to the hospital data generation in `src/data/mockData.ts`
3. The `MetricCard` component will automatically display the new metrics

#### Data Architecture

- **Hospital Records**: Each hospital has data for all available years (2021-2024)
- **Dynamic Generation**: Financial data is generated with realistic variations
- **Filtering**: Dashboard filters data based on selected hospital and year

#### Chart Customization

Charts are built with Recharts and can be customized by:

- Updating colors in individual components
- Adding new data series
- Modifying chart types (line, bar, pie, area)

#### Style Management

The project uses Tailwind CSS:

- Modify colors in `tailwind.config.js`
- Update component styles individually
- Add custom CSS in `src/index.css`

## Contributing

See our [Improvement Plan](docs/IMPROVEMENT_PLAN.md) for upcoming enhancements and contribution guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.

---
[🏥 Built with care for healthcare financial management]
