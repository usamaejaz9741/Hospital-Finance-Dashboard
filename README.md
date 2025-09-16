# Hospital Finance Dashboard

A comprehensive, modern hospital finance dashboard built with React, TypeScript, and Tailwind CSS. This dashboard provides real-time financial insights, analytics, and key performance indicators for healthcare institutions.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Component Documentation](#component-documentation)
- [Configuration](#configuration)
- [Development Guide](#development-guide)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

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

### Core Technologies
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (with fast HMR and optimized builds)
- **Package Manager**: npm

### UI & Styling
- **CSS Framework**: Tailwind CSS (with dark mode support)
- **Icons**: Lucide React (modern icon library)
- **Design System**: Custom components with consistent theming

### Data Visualization
- **Chart Library**: Recharts (responsive charts with animations)
- **Chart Types**: Line charts, pie charts, bar charts, area charts

### Development Tools
- **Linting**: ESLint with TypeScript rules
- **Testing**: Jest + React Testing Library
- **Type Checking**: TypeScript (strict mode enabled)
- **Code Formatting**: Prettier (integrated with ESLint)

### Performance & Optimization
- **Code Splitting**: Dynamic imports with lazy loading
- **Bundle Analysis**: Rollup plugin visualizer
- **Memoization**: React.memo, useMemo, useCallback optimizations
- **Tree Shaking**: Automatic dead code elimination

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
Hospital-Finance-Dashboard/
├── 📁 public/                    # Static assets
│   └── favicon/                  # Favicon files
├── 📁 src/                       # Source code
│   ├── 📁 components/            # React components
│   │   ├── 📁 auth/             # Authentication components
│   │   │   ├── AuthWrapper.tsx   # Authentication route wrapper
│   │   │   ├── SignInPage.tsx    # User sign-in form
│   │   │   └── SignUpPage.tsx    # User registration form
│   │   ├── 📁 optimized/        # Performance-optimized components
│   │   │   └── OptimizedRevenueChart.tsx
│   │   ├── 📁 ui/               # Reusable UI components
│   │   │   ├── Card.tsx          # Generic card component
│   │   │   └── Input.tsx         # Enhanced input component
│   │   ├── 📁 __tests__/        # Component tests
│   │   ├── Button.tsx            # Reusable button component
│   │   ├── CashFlowChart.tsx     # Cash flow visualization
│   │   ├── ChartNoData.tsx       # Empty state for charts
│   │   ├── Dashboard.tsx         # Main dashboard layout
│   │   ├── DashboardLoading.tsx  # Dashboard loading state
│   │   ├── DashboardNoData.tsx   # Dashboard empty state
│   │   ├── DepartmentTable.tsx   # Department performance table
│   │   ├── Dropdown.tsx          # Dropdown selection component
│   │   ├── ErrorBoundary.tsx     # Error boundary wrapper
│   │   ├── ExpensePieChart.tsx   # Expense breakdown chart
│   │   ├── Header.tsx            # Application header
│   │   ├── LoadingSpinner.tsx    # Loading spinner component
│   │   ├── MetricCard.tsx        # Financial metric cards
│   │   ├── PatientMetricsCard.tsx # Patient statistics
│   │   ├── RevenueChart.tsx      # Revenue trend chart
│   │   └── ThemeToggle.tsx       # Dark/light mode toggle
│   ├── 📁 contexts/              # React contexts
│   │   ├── AuthContext.tsx       # Authentication state
│   │   └── ThemeContext.tsx      # Theme management
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── useAuth.ts            # Authentication utilities
│   │   ├── useChartTheme.ts      # Chart theming hook
│   │   ├── useResponsive.ts      # Responsive design hook
│   │   └── useTheme.ts           # Theme switching hook
│   ├── 📁 data/                  # Mock data and configurations
│   │   ├── mockData.ts           # Financial data generator
│   │   └── mockUsers.ts          # User authentication data
│   ├── 📁 types/                 # TypeScript type definitions
│   │   ├── auth.ts               # Authentication types
│   │   ├── errors.ts             # Error handling types
│   │   ├── finance.ts            # Financial data types
│   │   ├── global.d.ts           # Global type declarations
│   │   └── theme.ts              # Theme-related types
│   ├── 📁 utils/                 # Utility functions
│   │   ├── 📁 __tests__/        # Utility tests
│   │   ├── auth.ts               # Authentication utilities
│   │   ├── errorHandler.ts       # Error handling system
│   │   ├── formatters.ts         # Data formatting functions
│   │   ├── logger.ts             # Logging utilities
│   │   └── performance.ts        # Performance optimization utils
│   ├── 📁 config/                # Configuration files
│   │   └── demo.ts               # Demo configuration
│   ├── 📁 test/                  # Test configuration
│   │   └── mocks.ts              # Test mocks and utilities
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   ├── index.css                 # Global styles and CSS variables
│   ├── setupTests.ts             # Jest test setup
│   └── vite-env.d.ts            # Vite environment types
├── 📁 docs/                      # Documentation
│   ├── API.md                    # API documentation
│   ├── AUDIT_SUMMARY.md          # Code audit results
│   ├── IMPROVEMENT_PLAN.md       # Development roadmap
│   └── SECURITY.md               # Security considerations
├── 📁 dist/                      # Production build output
├── package.json                  # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── jest.config.js               # Jest test configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # Project documentation
```

## Component Documentation

### Core Dashboard Components

#### Financial Visualization Components
- **MetricCard**: Displays key financial metrics with trend indicators and percentage changes
- **RevenueChart**: Interactive line chart showing revenue, expenses, and net income trends
- **DepartmentTable**: Sortable table displaying department-wise financial performance
- **ExpensePieChart**: Pie chart visualization of expense breakdown by category
- **CashFlowChart**: Bar chart showing operating, investing, and financing cash flows

#### Patient Analytics Components  
- **PatientMetricsCard**: Grid layout showing patient statistics and hospital occupancy metrics

#### UI Infrastructure Components
- **ErrorBoundary**: React error boundary with graceful fallback UI and recovery options
- **ThemeToggle**: Light/dark mode toggle with system preference detection
- **LoadingSpinner**: Customizable loading spinner with text and animations
- **Button**: Flexible button component with multiple variants and accessibility features
- **Dropdown**: Animated dropdown with keyboard navigation support

#### Authentication Components
- **AuthWrapper**: Route protection wrapper with role-based access control
- **SignInPage**: User authentication form with validation and security features
- **SignUpPage**: User registration form with comprehensive validation

## Configuration

### Environment Variables

The application supports environment-based configuration:

```bash
# Development
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:3001

# Production  
VITE_NODE_ENV=production
VITE_API_URL=https://api.hospitalfinance.com
```

### Build Configuration

The project uses optimized Vite configuration with:

- **Chunk Splitting**: Vendor and app code separation for better caching
- **Source Maps**: Enabled for production debugging
- **Bundle Analysis**: Generate `dist/stats.html` with `npm run analyze`
- **Terser Minification**: Optimized JavaScript compression

### Tailwind Configuration

Custom design tokens in `tailwind.config.js`:

```javascript
// Color palette
colors: {
  primary: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' },
  success: { 600: '#16a34a' },
  danger: { 600: '#dc2626' }
}
```

## Development Guide

### Data Management

#### Adding Hospital Data
1. Update `hospitals` array in `src/data/mockData.ts`
2. Follow existing structure with required fields
3. Data automatically generates for all available years (2021-2024)

#### Creating New Metrics
1. Extend `FinancialMetric` interface in `src/types/finance.ts`
2. Add data generation logic in `mockData.ts`
3. Metrics appear automatically in dashboard

#### Data Architecture
- **Consistent Structure**: All hospitals share the same data schema
- **Dynamic Generation**: Realistic financial variations using seeded random data
- **Role-Based Filtering**: Data access controlled by user permissions

### UI Customization

#### Theme Customization
- Modify color palette in `tailwind.config.js`
- Use CSS variables for dynamic theming
- Follow dark mode patterns with `dark:` prefix classes

#### Chart Configuration
- Update colors in individual chart components
- Modify chart types in Recharts configuration
- Ensure accessibility with proper contrast ratios

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Authentication and data flow tests
- **Test Coverage**: Maintained above 80% for critical components

### Testing Guidelines

- All new components require corresponding test files
- Use React Testing Library for component testing
- Mock external dependencies and API calls
- Test both happy path and error scenarios

## Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Build Output

- **dist/**: Production-ready static files
- **assets/**: Optimized JavaScript, CSS, and images
- **stats.html**: Bundle analysis report

### Deployment Platforms

The application is compatible with:
- **Vercel**: Zero-configuration deployment
- **Netlify**: Static site hosting with form handling
- **AWS S3 + CloudFront**: Scalable static hosting
- **Docker**: Containerized deployment

## Security

### Authentication Security

- **Password Requirements**: 8+ characters with complexity validation
- **Rate Limiting**: 5 failed attempts trigger 15-minute lockout
- **Secure Storage**: Authentication data stored securely
- **Error Handling**: No information disclosure in error messages

### Data Protection

- **Input Sanitization**: All user inputs validated and sanitized
- **XSS Prevention**: Proper output encoding and CSP headers
- **CSRF Protection**: Anti-forgery tokens for state-changing operations

For detailed security information, see [docs/SECURITY.md](docs/SECURITY.md).

## Technical Architecture

### TypeScript Types

Core data models ensure type safety:

```typescript
interface FinancialMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  format: 'currency' | 'percentage' | 'number';
}
```

### Performance Optimizations

- **Code Splitting**: Lazy-loaded components with Suspense
- **Memoization**: React.memo, useMemo, and useCallback optimizations
- **Bundle Analysis**: Track and optimize bundle size
- **Error Boundaries**: Graceful error handling without full page crashes

## Contributing

We welcome contributions to the Hospital Finance Dashboard! Please see our [Improvement Plan](docs/IMPROVEMENT_PLAN.md) for upcoming enhancements and development priorities.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Install** dependencies: `npm install`
4. **Make** your changes with proper tests and documentation
5. **Run** tests: `npm run test`
6. **Lint** code: `npm run lint`
7. **Commit** changes: `git commit -m 'Add your feature'`
8. **Push** to branch: `git push origin feature/your-feature-name`
9. **Create** a Pull Request

### Code Standards

- Follow TypeScript strict mode requirements
- Add JSDoc comments for all public APIs
- Include tests for new functionality
- Follow existing code style and patterns
- Update documentation for significant changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- 📖 Check the [API Documentation](docs/API.md)
- 🔒 Review [Security Guidelines](docs/SECURITY.md)
- 🛠️ See [Improvement Plan](docs/IMPROVEMENT_PLAN.md) for roadmap
- 📧 Contact the development team
- 🐛 Create an issue for bug reports

---

**🏥 Built with care for healthcare financial management**
