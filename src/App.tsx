import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { AdminProtectedRoute } from './admin/components/AdminProtectedRoute';
import { AdminLayout } from './admin/components/AdminLayout';
import { ErrorBoundary, RouteErrorBoundary } from './components/common/ErrorBoundary';

// Public pages - Route-level code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const Quality = lazy(() => import('./pages/Quality'));
const GlobalMarket = lazy(() => import('./pages/GlobalMarket'));
const PressMedia = lazy(() => import('./pages/PressMedia'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Brochure = lazy(() => import('./pages/Brochure'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages - Lazy loaded
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminNewsList = lazy(() => import('./admin/pages/AdminNewsList'));
const AdminNewsEditor = lazy(() => import('./admin/pages/AdminNewsEditor'));
const AdminMedia = lazy(() => import('./admin/pages/AdminMedia'));
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));

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
        border: '3px solid var(--brand-orange-soft)',
        borderTopColor: 'var(--brand-orange)',
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
    <AdminAuthProvider>
      <Routes>
        {/* VINAXO Custom Admin Portal */}
        <Route
          path="/admin/login"
          element={
            <RouteErrorBoundary level="route" title="Đăng nhập quản trị">
              <Suspense fallback={<PageLoader />}>
                <AdminLogin />
              </Suspense>
            </RouteErrorBoundary>
          }
        />
        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <RouteErrorBoundary level="route" title="Bảng điều khiển">
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboard />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="news"
              element={
                <RouteErrorBoundary level="route" title="Quản lý bài viết">
                  <Suspense fallback={<PageLoader />}>
                    <AdminNewsList />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="news/new"
              element={
                <RouteErrorBoundary level="route" title="Soạn thảo bài viết">
                  <Suspense fallback={<PageLoader />}>
                    <AdminNewsEditor />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="news/:slug/edit"
              element={
                <RouteErrorBoundary level="route" title="Chỉnh sửa bài viết">
                  <Suspense fallback={<PageLoader />}>
                    <AdminNewsEditor />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="products"
              element={
                <RouteErrorBoundary level="route" title="Quản lý sản phẩm">
                  <Suspense fallback={<PageLoader />}>
                    <AdminProducts />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="media"
              element={
                <RouteErrorBoundary level="route" title="Thư viện hình ảnh">
                  <Suspense fallback={<PageLoader />}>
                    <AdminMedia />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="certificates"
              element={
                <RouteErrorBoundary level="route" title="Quản lý chứng nhận">
                  <Suspense fallback={<PageLoader />}>
                    <AdminMedia initialCategory="certificates" />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="brochure"
              element={
                <RouteErrorBoundary level="route" title="Quản lý Brochure">
                  <Suspense fallback={<PageLoader />}>
                    <AdminSettings />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="settings"
              element={
                <RouteErrorBoundary level="route" title="Cài đặt hệ thống">
                  <Suspense fallback={<PageLoader />}>
                    <AdminSettings />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
          </Route>
        </Route>

        {/* Main Layout containing Header, Footer, and Global Quote Modal */}
        <Route element={<MainLayout />}>
        {/* Core Multi-Page Routes */}
        <Route
          path="/"
          element={
            <ErrorBoundary level="route" title="Trang chủ">
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/about"
          element={
            <ErrorBoundary level="route" title="Về chúng tôi">
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/products"
          element={
            <ErrorBoundary level="route" title="Sản phẩm">
              <Suspense fallback={<PageLoader />}>
                <Products />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <ErrorBoundary level="route" title="Chi tiết sản phẩm">
              <Suspense fallback={<PageLoader />}>
                <Products />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/quality"
          element={
            <ErrorBoundary level="route" title="Chất lượng & Tiêu chuẩn">
              <Suspense fallback={<PageLoader />}>
                <Quality />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/markets"
          element={
            <ErrorBoundary level="route" title="Thị trường xuất khẩu">
              <Suspense fallback={<PageLoader />}>
                <GlobalMarket />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/news"
          element={
            <ErrorBoundary level="route" title="Báo chí & Tin tức">
              <Suspense fallback={<PageLoader />}>
                <PressMedia />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/press-media"
          element={
            <ErrorBoundary level="route" title="Báo chí & Tin tức">
              <Suspense fallback={<PageLoader />}>
                <PressMedia />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/tin-tuc/:slug"
          element={
            <ErrorBoundary level="route" title="Chi tiết bài viết">
              <Suspense fallback={<PageLoader />}>
                <ArticleDetail />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/news/:slug"
          element={
            <ErrorBoundary level="route" title="Chi tiết bài viết">
              <Suspense fallback={<PageLoader />}>
                <ArticleDetail />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/press-media/:slug"
          element={
            <ErrorBoundary level="route" title="Chi tiết bài viết">
              <Suspense fallback={<PageLoader />}>
                <ArticleDetail />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/contact"
          element={
            <ErrorBoundary level="route" title="Liên hệ">
              <Suspense fallback={<PageLoader />}>
                <Contact />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/brochure"
          element={
            <ErrorBoundary level="route" title="Tài liệu doanh nghiệp">
              <Suspense fallback={<PageLoader />}>
                <Brochure />
              </Suspense>
            </ErrorBoundary>
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
        <Route path="/brochure.html" element={<Navigate to="/brochure" replace />} />

        {/* 404 Not Found Catch-All */}
        <Route
          path="*"
          element={
            <ErrorBoundary level="route" title="Không tìm thấy trang">
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            </ErrorBoundary>
          }
        />
      </Route>
    </Routes>
  </AdminAuthProvider>
);
};

export default App;
