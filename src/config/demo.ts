// NOTE: These credentials are for demo purposes only
// In a real application, these would be managed through a secure backend
// Default passwords are used only as fallback - set environment variables for security
export const demoAccounts = [
  { 
    role: 'Admin',
    email: import.meta.env.VITE_DEMO_ADMIN_EMAIL || 'admin@hospitalfinance.com',
    password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'UsamaHF2024!'
  },
  {
    role: 'Hospital Owner',
    email: import.meta.env.VITE_DEMO_OWNER_EMAIL || 'owner@metrogeneral.com',
    password: import.meta.env.VITE_DEMO_OWNER_PASSWORD || 'OwnerMG2024!'
  },
  {
    role: 'Branch Manager',
    email: import.meta.env.VITE_DEMO_MANAGER_EMAIL || 'manager@metrogeneral.com',
    password: import.meta.env.VITE_DEMO_MANAGER_PASSWORD || 'ManagerMG2024!'
  }
];