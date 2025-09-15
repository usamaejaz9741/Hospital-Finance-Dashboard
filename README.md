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
   Navigate to `http://localhost:3000` to view the dashboard

5. **Sign In with Demo Account**
   Use one of the demo accounts to test different user roles:
   - **Admin**: admin@hospitalfinance.com (password: admin123)
   - **Hospital Owner**: owner@metrogeneral.com (password: owner123)  
   - **Branch Manager**: manager@metrogeneral.com (password: manager123)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
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
└── index.css           # Global styles
```

## Key Components

### MetricCard
Displays key financial metrics with trend indicators and percentage changes.

### RevenueChart
Line chart showing revenue, expenses, and net income trends over time.

### DepartmentTable
Table view of department-wise performance including revenue, expenses, profit, and margins.

### ExpensePieChart
Pie chart visualization of expense breakdown by category.

### PatientMetricsCard
Grid layout showing patient-related metrics and hospital occupancy.

### CashFlowChart
Bar chart displaying cash flow analysis across different categories.

## Data Structure

The dashboard uses TypeScript interfaces for type safety:

- `FinancialMetric`: Key performance indicators
- `RevenueData`: Monthly revenue and expense data
- `DepartmentFinance`: Department-wise financial data
- `PatientMetrics`: Patient and occupancy statistics
- `ExpenseBreakdown`: Categorized expense data
- `CashFlowData`: Cash flow analysis data

## Customization

### Adding New Hospitals
1. Add new hospital entries to the `hospitals` array in `src/data/mockData.ts`
2. The data generation system will automatically create financial data for all years
3. Hospital types supported: General, Specialty, Pediatric, Trauma

### Adding New Metrics
1. Update the `FinancialMetric` interface in `src/types/finance.ts`
2. Add new metric data to the hospital data generation in `src/data/mockData.ts`
3. The `MetricCard` component will automatically display the new metrics

### Multi-Hospital Data Structure
- **Hospital Data**: Each hospital has data for all available years (2021-2024)
- **Dynamic Generation**: Financial data is generated with realistic variations based on hospital type and year
- **Filtering**: The dashboard automatically filters and displays data based on selected hospital and year

### Modifying Charts
Charts are built with Recharts and can be customized by:
- Changing colors in the chart components
- Adding new data series
- Modifying chart types (line, bar, pie, area, etc.)

### Styling
The project uses Tailwind CSS. You can:
- Modify the color palette in `tailwind.config.js`
- Update component styles in individual component files
- Add custom CSS classes in `src/index.css`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for healthcare financial management**

