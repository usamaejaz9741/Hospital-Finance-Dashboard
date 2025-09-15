# Copilot Instructions for Hospital Finance Dashboard

## Project Overview
- **Stack:** React 18, TypeScript, Tailwind CSS, Vite, Recharts
- **Purpose:** Real-time financial analytics and KPIs for hospitals, with multi-hospital/year support and role-based access.

## Architecture & Data Flow
- **Component-driven:** All UI is built from modular React components in `src/components/`.
- **Authentication:** Managed via `AuthContext` and `useAuth` hook. Roles: Admin, Hospital Owner, Branch Manager. Demo users in `src/data/mockUsers.ts`.
- **Data:** Mocked in `src/data/mockData.ts` (hospitals, years, metrics). Data is generated for 2021-2024 and filtered by user selection.
- **State/Context:** Theme and auth state via React Context (`src/contexts/`).
- **Charts:** Use Recharts (see `RevenueChart.tsx`, `ExpensePieChart.tsx`, `CashFlowChart.tsx`).

## Developer Workflows
- **Start dev server:** `npm run dev` (Vite, port 5173)
- **Build:** `npm run build`
- **Preview prod build:** `npm run preview`
- **Sign in:** Use demo accounts from README for all roles.

## Key Patterns & Conventions
- **Component Naming:** PascalCase, colocated styles (Tailwind in JSX).
- **Error Handling:** Use `ErrorBoundary` for React errors (see `src/components/ErrorBoundary.tsx`).
- **Theme:** Light/dark mode via `ThemeContext` and `ThemeToggle`.
- **Type Safety:** All data and props typed in `src/types/`.
- **Reusable UI:** Buttons, dropdowns, spinners in `src/components/`.
- **Charts:** Prefer Recharts; keep chart logic/data mapping in chart components.
- **Data Mocking:** Add hospitals/metrics in `src/data/mockData.ts` and types in `src/types/`.

## Integration Points
- **No backend/API:** All data is local/mocked.
- **External:** Recharts, Lucide React (icons), Tailwind CSS.

## Examples
- Add a hospital: Edit `hospitals` in `src/data/mockData.ts`.
- Add a metric: Update `FinancialMetric` in `src/types/finance.ts` and data in `mockData.ts`.
- Add a chart: Create a new component in `src/components/`, use Recharts.

## References
- `README.md` for features, structure, and demo accounts.
- `src/components/` for UI patterns.
- `src/contexts/` for app-wide state.
- `src/types/` for all data models.

---
**For AI agents:**
- Follow existing component/data patterns.
- Use TypeScript types for all new data/models.
- Keep UI logic in components, not utils.
- Use Tailwind for all styling.
- No API calls—work with local data only.
