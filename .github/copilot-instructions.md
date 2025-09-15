# Copilot Instructions for Hospital Finance Dashboard

## Project Overview
- **Stack:** React 18, TypeScript, Tailwind CSS, Vite, Recharts
- **Purpose:** Real-time financial analytics and KPIs for hospitals, with multi-hospital/year support and role-based access.
- **Target User Roles:** Admin, Hospital Owner, Branch Manager (permissions managed via `AuthContext`)

## Architecture & Data Flow
- **Component-driven:** All UI is built from modular React components in `src/components/`
- **Authentication:** 
  - Managed via `AuthContext` and `useAuth` hook
  - Role-based access in `src/types/auth.ts`
  - Demo users in `src/data/mockUsers.ts`
- **Data & State:**
  - All data mocked in `src/data/mockData.ts` (2021-2024)
  - Theme and auth state via React Context
  - Strong TypeScript interfaces in `src/types/finance.ts`
- **Charts:** Recharts-based visualizations with consistent formatting
- **Error Boundaries:** Nested at App, Auth, Dashboard levels

## Developer Workflows
- **Dev Server:** `npm run dev` (Vite, port 3000, auto-opens)
- **Build:** `npm run build` (chunk-optimized)
- **Preview:** `npm run preview`
- **Tests:** Jest + React Testing Library (see `MetricCard.test.tsx`)
- **Bundle Analysis:** Auto-generates `dist/stats.html` on build

## Key Patterns & Conventions
- **Component Structure:**
  ```tsx
  interface MetricCardProps {
    metric: FinancialMetric;  // Props interface above component
  }
  
  const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
    // Consistent a11y patterns
    return (
      <div role="article" aria-labelledby={`metric-title-${metric.id}`}>
        {/* Colocated Tailwind styles */}
      </div>
    );
  };
  ```

- **Type Safety:** 
  - No `any` types allowed
  - Use `types/finance.ts` interfaces
  - React.FC typing required

- **Data Formatting:**
  - Currency: `formatCurrency(value)` 
  - Percentages: `formatPercentage(value)`
  - Numbers: `formatNumber(value)`

- **Performance:**
  - Vendor chunk splitting in `vite.config.ts`
  - Code-split charts and icon bundles
  - Bundle size monitoring via `stats.html`

## Examples & Common Tasks
- **Add Financial Metric:**
  1. Extend `FinancialMetric` in `types/finance.ts`
  2. Add mock data in `mockData.ts`
  3. Use `<MetricCard metric={newMetric} />`

- **Add Chart Component:**
  1. Create file in `src/components/`
  2. Import Recharts + formatting utils
  3. Define data interface in `types/finance.ts`
  4. Follow existing chart patterns (see `RevenueChart.tsx`)

## Critical Notes for AI
- **Authentication Required** - verify user role before operations
- **TypeScript Strict Mode** - no any types, use interfaces
- **Component-First** - minimize utility functions
- **A11y Required** - follow MetricCard patterns
- **Mock Data Only** - no API calls
- **Bundle Size Matters** - use code splitting for large features

## Testing Patterns
- Test files colocated with components (`__tests__/`)
- React Testing Library + Jest
- Focus on user interactions and accessibility
- Mock contexts where needed (`test/mocks.ts`)
