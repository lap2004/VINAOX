import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { App } from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Design System & Stylesheets
import './styles/variables.css';
import './styles/global.css';
import './styles/responsive.css';

// Auto-recover from dynamic chunk loading errors caused by new deployments
window.addEventListener('vite:preloadError', () => {
  console.warn('[VINAXO] New deployment detected via vite:preloadError. Reloading application...');
  window.location.reload();
});

window.addEventListener('unhandledrejection', (event) => {
  const msg = String(event.reason?.message || event.reason || '');
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('Importing a module script failed')
  ) {
    console.warn('[VINAXO] Dynamic module import failure detected. Reloading application...');
    window.location.reload();
  }
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root DOM element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary level="root">
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
