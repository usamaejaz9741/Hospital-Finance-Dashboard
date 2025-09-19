# Copilot Instructions for Hospital Finance Dashboard

## Project Overview
- **Stack:** React 18, TypeScript (strict), Tailwind CSS, Vite, Recharts
- **Purpose:** Real-time financial analytics and KPIs for hospitals, supporting multi-hospital/year data and role-based access
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
  - Use `OptimizedRevenueChart` pattern for large datasets
- **Error Handling:**
  - Nested error boundaries (App, Auth, Dashboard levels in `src/components/ErrorBoundary.tsx`)
  - Use `errorHandler.ts` utility for consistent error logging and user messages 
  - No direct console.error calls; use logger service

## Developer Workflows
- **Prerequisites:** Node.js 18+, npm 9+, Git 2+, VS Code with recommended extensions (TypeScript, Tailwind, ESLint)
- **Dev Server:** `npm run dev` (Vite, port 3000, auto-opens browser)
- **Build:** `npm run build` (outputs to `dist/`, chunk-optimized)
- **Preview:** `npm run preview` (preview production build)
- **Tests:** 
  - Unit/Integration: `npm test` or `npm run test:watch` 
  - E2E: `npm run test:e2e` (Playwright)
  - Coverage: `npm run test:coverage` (threshold config in jest.config.js)
- **Code Quality:**
  - Type Check: `npm run type-check`
  - Lint: `npm run lint`
  - Format: `npm run format`
  - Bundle Analysis: `npm run analyze` (review `dist/stats.html`)
  - Security: `npm run security:audit`

## Key Patterns & Conventions
- **Component Structure:**
  - Always type props with interfaces (no `any`)
  - Use `React.FC<Props>` typing with proper JSDoc documentation
  - Example:
    ```tsx
    interface MetricCardProps {
      metric: FinancialMetric;
    }
    const MetricCard: React.FC<MetricCardProps> = ({ metric }) => (
      <div role="article" aria-labelledby={`metric-title-${metric.id}`}>...</div>
    );
    ```
- **A11y & Documentation:**
  - Follow patterns in `MetricCard.tsx` for ARIA and roles
  - Every component must have JSDoc with @example
  - Use meaningful aria-labels and semantic HTML
- **Formatting & Utils:**
  - Use `formatCurrency`, `formatPercentage`, `formatNumber` from `src/utils/formatters.ts`
  - Monitor bundle size via `dist/stats.html`
- **Performance:**
  - Vendor chunk splitting in `vite.config.ts`
  - Code-split large chart/icon bundles (`src/components/optimized/`)
  - Use performance monitoring hooks from `src/hooks/useResponsive.ts`

## Common Tasks & Examples
- **Add Financial Metric:**
  1. Extend `FinancialMetric` in `src/types/finance.ts`
  2. Add mock data in `src/data/mockData.ts`
  3. Use `<MetricCard metric={newMetric} />`
  4. Add test case in `__tests__/MetricCard.test.tsx`
- **Add Chart Component:**
  1. Create in `src/components/`
  2. Import Recharts and formatting utils
  3. Define data interface in `src/types/finance.ts`
  4. Follow patterns in `RevenueChart.tsx`
  5. Create optimized version if handling large datasets

## Critical Notes for AI Agents
- **Authentication Required:** Always check user role before sensitive operations
- **TypeScript Strict:** No `any` types; always use interfaces
- **Component-First:** Minimize utility functions, prefer React components
- **A11y Required:** Follow `MetricCard` accessibility patterns
- **Mock Data Only:** Never add API/network calls
- **Bundle Size:** Use code splitting for large features
- **Error Handling:** Use error boundaries and logger service
- **Documentation:** Always include JSDoc with examples

## Testing Patterns
- Tests colocated with components in `__tests__/`
- Use React Testing Library + Jest with user-event
- Focus on user interactions and accessibility
- Mock contexts as needed (`src/test/mocks.ts`)
- Test error boundaries and loading states
