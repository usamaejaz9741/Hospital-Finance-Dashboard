import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import Web Vitals monitoring
import { webVitals } from './utils/webVitals'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element. Check if the HTML includes a div with id="root"');
}

// Initialize React app
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Start Web Vitals monitoring after app initialization
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    webVitals.startMonitoring();
  }, 100);
}
