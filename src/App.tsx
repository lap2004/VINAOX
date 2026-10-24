import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';

// Route-level code splitting for performance optimization
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const Quality = lazy(() => import('./pages/Quality'));
const GlobalMarket = lazy(() => import('./pages/GlobalMarket'));
const PressMedia = lazy(() => import('./pages/PressMedia'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Fallback loader during code-split chunk loading
const PageLoader: React.FC = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--cream-bg)'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--light-sage)',
        borderTopColor: 'var(--primary-green)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.875rem',
        color: 'var(--muted-text)',
        letterSpacing: '0.05em'
      }}>
        VINAXO...
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Main Layout containing Header, Footer, and Global Quote Modal */}
      <Route element={<MainLayout />}>
        {/* Core Multi-Page Routes */}
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={<PageLoader />}>
              <Products />
            </Suspense>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <Suspense fallback={<PageLoader />}>
              <Products />
            </Suspense>
          }
        />
        <Route
          path="/quality"
          element={
            <Suspense fallback={<PageLoader />}>
              <Quality />
            </Suspense>
          }
        />
        <Route
          path="/markets"
          element={
            <Suspense fallback={<PageLoader />}>
              <GlobalMarket />
            </Suspense>
          }
        />
        <Route
          path="/news"
          element={
            <Suspense fallback={<PageLoader />}>
              <PressMedia />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<PageLoader />}>
              <Contact />
            </Suspense>
          }
        />

        {/* Legacy .html redirects to maintain backwards compatibility & preserve incoming external links */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/about.html" element={<Navigate to="/about" replace />} />
        <Route path="/products.html" element={<Navigate to="/products" replace />} />
        <Route path="/quality.html" element={<Navigate to="/quality" replace />} />
        <Route path="/markets.html" element={<Navigate to="/markets" replace />} />
        <Route path="/news.html" element={<Navigate to="/news" replace />} />
        <Route path="/contact.html" element={<Navigate to="/contact" replace />} />

        {/* 404 Not Found Catch-All */}
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
