# Copilot Instructions for Hospital Finance Dashboard

## Project Overview
- **Stack:** React 18, TypeScript (strict), Tailwind CSS, Vite, Recharts
- **Purpose:** Real-time financial analytics and KPIs for hospitals, supporting multi-hospital/year data and role-based access.
- **User Roles:** Admin, Hospital Owner, Branch Manager (see `src/types/auth.ts`)

## Architecture & Data Flow
- **Component-Driven UI:** All UI is built from modular React components in `src/components/`. Use colocated test files in `__tests__/` for new components.
- **Authentication:**
  - Managed via `AuthContext` (`src/contexts/AuthContext.tsx`) and `useAuth` hook (`src/hooks/useAuth.ts`)
  - Role-based permissions in `src/types/auth.ts`
  - Demo users in `src/data/mockUsers.ts`
- **Mock Data:**
  - All financial and patient data is mocked in `src/data/mockData.ts` (2021-2024)
  - No API/network calls; all data is local and static
- **State Management:**
  - Theme and auth state via React Contexts (`src/contexts/`)
  - Strong TypeScript interfaces in `src/types/finance.ts` and related files
- **Charts:**
  - Use Recharts for all visualizations (see `RevenueChart.tsx`, `ExpensePieChart.tsx`, `CashFlowChart.tsx`)
  - Consistent formatting via `src/utils/formatters.ts`
- **Error Boundaries:**
  - Nested at App, Auth, and Dashboard levels (`src/components/ErrorBoundary.tsx`)

## Developer Workflows
- **Dev Server:** `npm run dev` (Vite, port 3000, auto-opens browser)
- **Build:** `npm run build` (outputs to `dist/`, chunk-optimized)
- **Preview:** `npm run preview`
- **Tests:** `npm test` (Jest + React Testing Library, see `src/components/__tests__/`)
- **Bundle Analysis:** Build auto-generates `dist/stats.html` for bundle size review

## Key Patterns & Conventions
- **Component Structure:**
  - Always type props with interfaces (no `any`)
  - Use `React.FC<Props>` typing
  - Example:
    ```tsx
    interface MetricCardProps {
      metric: FinancialMetric;
    }
    const MetricCard: React.FC<MetricCardProps> = ({ metric }) => (
      <div role="article" aria-labelledby={`metric-title-${metric.id}`}>...</div>
    );
    ```
- **A11y:**
  - Follow patterns in `MetricCard.tsx` for ARIA and roles
- **Formatting:**
  - Use `formatCurrency`, `formatPercentage`, `formatNumber` from `src/utils/formatters.ts`
- **Type Safety:**
  - No `any` types; use interfaces from `src/types/`
- **Performance:**
  - Vendor chunk splitting in `vite.config.ts`
  - Code-split large chart/icon bundles
  - Monitor bundle size via `dist/stats.html`

## Common Tasks & Examples
- **Add Financial Metric:**
  1. Extend `FinancialMetric` in `src/types/finance.ts`
  2. Add mock data in `src/data/mockData.ts`
  3. Use `<MetricCard metric={newMetric} />`
- **Add Chart Component:**
  1. Create in `src/components/`
  2. Import Recharts and formatting utils
  3. Define data interface in `src/types/finance.ts`
  4. Follow patterns in `RevenueChart.tsx`

## Critical Notes for AI Agents
- **Authentication Required:** Always check user role before sensitive operations
- **TypeScript Strict:** No `any` types; always use interfaces
- **Component-First:** Minimize utility functions, prefer React components
- **A11y Required:** Follow `MetricCard` accessibility patterns
- **Mock Data Only:** Never add API/network calls
- **Bundle Size:** Use code splitting for large features

## Testing Patterns
- Tests colocated with components in `__tests__/`
- Use React Testing Library + Jest
- Focus on user interactions and accessibility
- Mock contexts as needed (`src/test/mocks.ts`)
