# 🏥 Hospital Finance Dashboard

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.5-teal.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive, modern hospital finance dashboard built with React, TypeScript, and Tailwind CSS. This dashboard provides real-time financial insights, analytics, and key performance indicators for healthcare institutions with role-based access control and multi-hospital management capabilities.

## 🎯 Key Features

### 🔐 **Authentication & Authorization**
- **Multi-Role System**: Admin, Hospital Owner, and Branch Manager roles
- **Secure Authentication**: Password complexity validation with rate limiting
- **Permission-Based Access**: Users only see data they have permission to access
- **Demo Accounts**: Pre-configured accounts for testing different access levels

### 🏥 **Multi-Hospital Management**
- **Hospital Selection**: Choose from General, Specialty, Pediatric, and Trauma centers
- **Year-wise Analysis**: View financial data across different years (2021-2024)
- **Dynamic Filtering**: Real-time data updates based on hospital and year selection
- **Access Control**: Role-based hospital access restrictions

### 📊 **Comprehensive Financial Analytics**
- **Key Metrics Dashboard**: Total revenue, net profit, profit margin, and operating expenses
- **Revenue Tracking**: Monthly revenue, expenses, and net income trends with interactive charts
- **Cash Flow Analysis**: Operating, investing, and financing cash flows visualization
- **Expense Breakdown**: Detailed categorization with pie chart visualization
- **Department Performance**: Revenue and profit analysis by hospital department

### 🏥 **Hospital Operations Analytics**
- **Patient Metrics**: Total patients, inpatients, outpatients, and emergency visits
- **Occupancy Tracking**: Real-time bed occupancy rates and utilization metrics
- **Stay Duration Analytics**: Average patient stay duration with trend analysis
- **Performance Insights**: AI-powered insights with performance scoring

### 🎨 **Modern UI/UX Design**
- **Light/Dark Mode**: Full theme switching with system preference detection
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Interactive Charts**: Built with Recharts for rich, animated data visualization
- **Glassmorphism Design**: Modern glass-like UI elements with backdrop blur effects
- **Smooth Animations**: Beautiful transitions and micro-interactions throughout

### 🛡️ **Enterprise-Grade Reliability**
- **Error Boundaries**: Comprehensive error handling with graceful fallback UI
- **Performance Optimization**: Code splitting, lazy loading, and memoization
- **Accessibility**: WCAG-compliant design with keyboard navigation and screen reader support
- **Type Safety**: Full TypeScript implementation with strict mode enabled

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher (or yarn)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Hospital-Finance-Dashboard.git
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

4. **Access the application**
   - Navigate to `http://localhost:3000` (auto-opens in browser)
   - Use demo accounts to explore different roles and features

### 🔑 Demo Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **System Admin** | `admin@hospitalfinance.com` | `UsamaHF2024!` | Full system access |
| **Hospital Owner** | `owner@metrogeneral.com` | `Demo123!@#` | Multiple hospital access |
| **Branch Manager** | `manager@metrogeneral.com` | `Demo123!@#` | Single hospital access |

## 📋 Available Scripts

### Development Commands
```bash
npm run dev          # Start development server (port 3000)
npm run build        # Create production build with optimizations
npm run preview      # Preview production build locally
npm run analyze      # Generate bundle analysis report
```

### Testing Commands
```bash
npm run test         # Run all tests with Jest
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate comprehensive coverage report
npm run test:e2e     # Run end-to-end tests with Playwright
```

### Code Quality Commands
```bash
npm run lint         # Run ESLint with TypeScript rules
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

### Security & Maintenance
```bash
npm run security:audit # Run security audit
npm run security:fix   # Fix security vulnerabilities
npm run docs:build     # Generate API documentation
```

## 🏗️ Project Architecture

### Technology Stack

**Core Framework**
- **React 18**: Latest React with concurrent features and Suspense
- **TypeScript**: Strict mode with comprehensive type definitions
- **Vite**: Lightning-fast build tool with HMR and optimized production builds

**UI & Styling**
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Modern, customizable icon library
- **CSS Variables**: Dynamic theming with CSS custom properties

**Data Visualization**
- **Recharts**: Responsive chart library with animations
- **Custom Charts**: Line charts, pie charts, bar charts, and area charts
- **Interactive Tooltips**: Rich data exploration with hover states

**Development Tools**
- **ESLint**: Code linting with TypeScript and React rules
- **Jest**: Unit and integration testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing for user workflows

### Project Structure

```
Hospital-Finance-Dashboard/
├── 📁 public/                    # Static assets and favicon
├── 📁 src/                       # Source code
│   ├── 📁 components/            # React components
│   │   ├── 📁 auth/             # Authentication components
│   │   │   ├── AuthWrapper.tsx   # Route protection wrapper
│   │   │   ├── SignInPage.tsx    # User authentication form
│   │   │   └── SignUpPage.tsx    # User registration form
│   │   ├── 📁 ui/               # Reusable UI components
│   │   │   ├── Button.tsx        # Flexible button component
│   │   │   ├── Input.tsx         # Enhanced form input
│   │   │   └── Card.tsx          # Generic card component
│   │   ├── 📁 optimized/        # Performance-optimized components
│   │   │   └── OptimizedRevenueChart.tsx
│   │   ├── 📁 __tests__/        # Component test files
│   │   ├── Dashboard.tsx         # Main dashboard orchestrator
│   │   ├── Header.tsx            # Application header with navigation
│   │   ├── MetricCard.tsx        # Financial KPI display cards
│   │   ├── RevenueChart.tsx      # Revenue trend visualization
│   │   ├── ExpensePieChart.tsx   # Expense breakdown chart
│   │   ├── CashFlowChart.tsx     # Cash flow analysis chart
│   │   ├── DepartmentTable.tsx   # Department performance table
│   │   ├── PatientMetricsCard.tsx # Patient analytics display
│   │   ├── ErrorBoundary.tsx     # Error handling wrapper
│   │   ├── ThemeToggle.tsx       # Dark/light mode toggle
│   │   └── LoadingSpinner.tsx    # Loading state component
│   ├── 📁 contexts/              # React Context providers
│   │   ├── AuthContext.tsx       # Authentication state management
│   │   └── ThemeContext.tsx      # Theme switching logic
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── useAuth.ts            # Authentication utilities
│   │   ├── useTheme.ts           # Theme management hook
│   │   ├── useChartTheme.ts      # Chart theming utilities
│   │   └── useResponsive.ts      # Responsive design helpers
│   ├── 📁 data/                  # Mock data and services
│   │   ├── mockData.ts           # Financial data generator
│   │   └── mockUsers.ts          # User authentication data
│   ├── 📁 types/                 # TypeScript type definitions
│   │   ├── auth.ts               # Authentication types
│   │   ├── finance.ts            # Financial data types
│   │   ├── theme.ts              # Theme-related types
│   │   └── global.d.ts           # Global type declarations
│   ├── 📁 utils/                 # Utility functions
│   │   ├── formatters.ts         # Data formatting utilities
│   │   ├── logger.ts             # Logging system
│   │   ├── performance.ts        # Performance monitoring
│   │   ├── accessibility.ts      # Accessibility utilities
│   │   └── errorHandler.ts       # Error handling system
│   ├── 📁 config/                # Configuration files
│   │   └── demo.ts               # Demo configuration
│   ├── 📁 test/                  # Test configuration
│   │   └── mocks.ts              # Test mocks and utilities
│   ├── App.tsx                   # Root application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles and CSS variables
├── 📁 docs/                      # Comprehensive documentation
│   ├── README.md                 # Documentation index
│   ├── API.md                    # API reference guide
│   ├── ARCHITECTURE.md           # System architecture overview
│   ├── COMPONENTS.md             # Component library guide
│   ├── DEVELOPMENT.md            # Development workflow guide
│   ├── DEPLOYMENT.md             # Deployment instructions
│   ├── SECURITY.md               # Security considerations
│   ├── AUDIT_SUMMARY.md          # Code audit results
│   └── IMPROVEMENT_PLAN.md       # Development roadmap
├── 📁 tests/                     # End-to-end tests
│   └── e2e/                      # Playwright E2E tests
├── 📁 coverage/                  # Test coverage reports
├── 📁 dist/                      # Production build output
├── package.json                  # Dependencies and scripts
├── vite.config.ts               # Vite build configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── jest.config.js               # Jest test configuration
└── README.md                    # This file
```

## 🧩 Component Architecture

### Core Components

**Dashboard Components**
- **`Dashboard`**: Main orchestrator managing data flow and component coordination
- **`MetricCard`**: Displays financial KPIs with trend indicators and formatting
- **`Header`**: Application header with navigation, user info, and global controls
- **`ErrorBoundary`**: Comprehensive error handling with graceful fallback UI

**Data Visualization Components**
- **`RevenueChart`**: Interactive area chart for revenue, expenses, and net income trends
- **`ExpensePieChart`**: Pie chart visualization for expense category breakdown
- **`CashFlowChart`**: Bar chart showing operating, investing, and financing cash flows
- **`DepartmentTable`**: Sortable table displaying department-wise financial performance
- **`PatientMetricsCard`**: Grid layout for patient statistics and occupancy metrics

**Authentication Components**
- **`AuthWrapper`**: Route protection wrapper with role-based access control
- **`SignInPage`**: User authentication form with validation and security features
- **`SignUpPage`**: User registration form with comprehensive validation

**UI Infrastructure Components**
- **`Button`**: Flexible button component with multiple variants and accessibility
- **`Dropdown`**: Accessible dropdown with keyboard navigation and search
- **`Input`**: Enhanced form input with validation and styling
- **`ThemeToggle`**: Dark/light mode toggle with system preference detection
- **`LoadingSpinner`**: Customizable loading states with animations

### Performance Optimizations

**Code Splitting & Lazy Loading**
```typescript
// Lazy-loaded components for better performance
const RevenueChart = lazy(() => import('./RevenueChart'));
const ExpensePieChart = lazy(() => import('./ExpensePieChart'));
const CashFlowChart = lazy(() => import('./CashFlowChart'));
```

**Memoization & Optimization**
```typescript
// Optimized components with React.memo
const MetricCard = React.memo(({ metric }) => {
  const formattedValue = useMemo(() => 
    formatValue(metric.value, metric.format), [metric.value, metric.format]
  );
  
  const handleClick = useCallback(() => {
    // Handle interaction
  }, []);
  
  return <div>{/* Component JSX */}</div>;
});
```

## 🔒 Security Features

### Authentication Security
- **Password Complexity**: 8+ characters with uppercase, lowercase, numbers, and symbols
- **Rate Limiting**: 5 failed attempts trigger 15-minute account lockout
- **Secure Storage**: Authentication tokens stored securely in localStorage
- **Session Management**: Automatic session validation and cleanup

### Data Protection
- **Input Sanitization**: All user inputs validated and sanitized
- **XSS Prevention**: Proper output encoding and Content Security Policy headers
- **Role-Based Access**: Granular permissions based on user roles
- **Error Handling**: No sensitive information disclosure in error messages

### Security Headers
```typescript
// Security headers configured in Vite
res.setHeader('Content-Security-Policy', 
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'");
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('X-Content-Type-Options', 'nosniff');
```

## 🎨 Design System

### Theme Architecture
- **CSS Variables**: Dynamic theming with CSS custom properties
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Color Palette**: Consistent color system with WCAG-compliant contrast ratios
- **Typography**: Scalable typography system with responsive font sizes

### Component Design
- **Glassmorphism**: Modern glass-like UI elements with backdrop blur
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and screen reader support
- **Animation System**: Smooth transitions and micro-interactions

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Component rendering and behavior testing
- **Integration Tests**: Authentication flow and data loading
- **End-to-End Tests**: Complete user workflows with Playwright
- **Accessibility Tests**: Screen reader and keyboard navigation testing

### Testing Tools
```bash
# Run all tests with coverage
npm run test:coverage

# Run specific test suites
npm run test -- --testPathPattern=auth
npm run test -- --testPathPattern=components

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build
```bash
# Create optimized production build
npm run build

# Analyze bundle size and composition
npm run analyze

# Preview production build locally
npm run preview
```

### Deployment Platforms
The application is optimized for deployment on:
- **Vercel**: Zero-configuration deployment with automatic previews
- **Netlify**: Static site hosting with form handling and redirects
- **AWS S3 + CloudFront**: Scalable static hosting with global CDN
- **Docker**: Containerized deployment for any container platform

### Environment Configuration
```bash
# Development environment
VITE_NODE_ENV=development
VITE_API_URL=http://localhost:3001

# Production environment
VITE_NODE_ENV=production
VITE_API_URL=https://api.hospitalfinance.com
```

## 📊 Performance Metrics

### Bundle Analysis
- **Initial Bundle**: ~200KB gzipped
- **Vendor Chunks**: Optimized for caching with separate chunks
- **Code Splitting**: Lazy-loaded components reduce initial bundle size
- **Tree Shaking**: Dead code elimination for optimal bundle size

### Runtime Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.0s

## 🤝 Contributing

We welcome contributions to the Hospital Finance Dashboard! Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information.

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Install** dependencies: `npm install`
4. **Make** changes with proper tests and documentation
5. **Run** tests: `npm run test && npm run lint`
6. **Commit** changes: `git commit -m 'Add your feature'`
7. **Push** to branch: `git push origin feature/your-feature-name`
8. **Create** a Pull Request

### Code Standards
- **TypeScript**: Strict mode with comprehensive type definitions
- **ESLint**: Follow configured linting rules
- **Testing**: Maintain test coverage above 80%
- **Documentation**: Update docs for significant changes
- **Accessibility**: Ensure WCAG compliance for all new features

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[API Documentation](docs/API.md)**: Complete API reference with examples
- **[Architecture Guide](docs/ARCHITECTURE.md)**: System architecture and design patterns
- **[Component Guide](docs/COMPONENTS.md)**: Component library with usage examples
- **[Development Guide](docs/DEVELOPMENT.md)**: Development workflow and best practices
- **[Deployment Guide](docs/DEPLOYMENT.md)**: Deployment instructions for various platforms
- **[Security Guide](docs/SECURITY.md)**: Security considerations and best practices

## 🛣️ Roadmap

### Upcoming Features
- **Real-time Data**: WebSocket integration for live data updates
- **Advanced Analytics**: Machine learning-powered insights and predictions
- **Mobile App**: React Native companion app for mobile access
- **API Integration**: Backend API integration with real hospital data
- **Export Features**: PDF and Excel export capabilities
- **Multi-language Support**: Internationalization with multiple languages

### Performance Improvements
- **Service Worker**: Offline support and caching strategies
- **Virtual Scrolling**: Handle large datasets efficiently
- **Advanced Memoization**: Optimize complex calculations
- **Bundle Optimization**: Further reduce bundle size and loading times

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework and ecosystem
- **Vite Team**: For the lightning-fast build tool
- **Tailwind CSS**: For the utility-first CSS framework
- **Recharts**: For the responsive chart library
- **Healthcare Community**: For inspiration and real-world requirements

## 📞 Support & Contact

For support, questions, or contributions:

- 📖 **Documentation**: Check the comprehensive docs in the `docs/` directory
- 🐛 **Bug Reports**: Create an issue with detailed reproduction steps
- 💡 **Feature Requests**: Open an issue with use case descriptions
- 💬 **Discussions**: Join our community discussions
- 📧 **Contact**: Reach out to the development team

---

**🏥 Built with care for healthcare financial management**

*This dashboard represents a modern approach to healthcare financial analytics, combining cutting-edge web technologies with user-centered design to provide healthcare professionals with the insights they need to make informed decisions.*