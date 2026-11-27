import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  Package, 
  Image, 
  FileText, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  User,
  Shield,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLayout: React.FC = () => {
  const { user, repoMeta, logout } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/admin/about', label: 'Về chúng tôi', icon: Info },
    { to: '/admin/news', label: 'Quản lý tin tức', icon: Newspaper },
    { to: '/admin/products', label: 'Quản lý sản phẩm', icon: Package },
    { to: '/admin/media', label: 'Thư viện hình ảnh', icon: Image },
    { to: '/admin/certificates', label: 'Chứng nhận', icon: ShieldCheck },
    { to: '/admin/brochure', label: 'Brochure', icon: FileText },
    { to: '/admin/settings', label: 'Thông tin doanh nghiệp', icon: Building },
  ];

  const renderSidebarContent = (onNavClick?: () => void) => (
    <>
      {/* Brand Header */}
      <div style={{
        padding: '20px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/assets/logo/vinaxo-brochure-badge.png"
            alt="VINAXO"
            style={{ height: '36px', width: 'auto', borderRadius: '4px' }}
          />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.02em', color: '#FFFFFF' }}>
              VINAXO CMS
            </div>
            <div style={{ fontSize: '0.72rem', color: '#F4A83A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Portal
            </div>
          </div>
        </div>
        {onNavClick && (
          <button
            type="button"
            onClick={onNavClick}
            aria-label="Đóng menu"
            style={{ background: 'none', border: 'none', color: '#E8E2D9', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#A89F91', letterSpacing: '0.06em', padding: '0 8px 10px' }}>
          Nội dung website
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onNavClick}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  color: isActive ? '#3A251B' : '#E8E2D9',
                  backgroundColor: isActive ? '#F4A83A' : 'transparent',
                  transition: 'all 0.15s ease'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Card & Logout Bottom */}
      <div style={{
        padding: '16px 14px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#F4A83A',
            color: '#3A251B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}>
            <User size={16} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {user?.username || 'admin'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#A89F91', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Shield size={11} />
              <span>Quản trị viên</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: '#E8E2D9',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            <span>Xem Web</span>
            <ExternalLink size={12} />
          </a>

          <button
            onClick={() => logout()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#FCA5A5',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
            title="Đăng xuất"
          >
            <LogOut size={13} />
            <span>Thoát</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#FAF7F2',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Sidebar Desktop */}
      <aside style={{
        width: '260px',
        backgroundColor: '#3A251B',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #4D3528',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50
      }} className="admin-sidebar-desktop">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 10, 5, 0.6)',
            zIndex: 100,
            display: 'flex'
          }}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '260px',
              maxWidth: '82vw',
              backgroundColor: '#3A251B',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              boxShadow: '4px 0 24px rgba(0,0,0,0.35)'
            }}
          >
            {renderSidebarContent(() => setIsMobileMenuOpen(false))}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EADFCC',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="admin-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Mở menu quản trị"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#3A251B',
                padding: '4px',
                display: 'none'
              }}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#3A251B' }}>
              Bảng Điều Khiển Quản Trị VINAXO
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {repoMeta && (
              <span className="admin-repo-badge" style={{
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: '#FFF7EC',
                border: '1px solid #EADFCC',
                color: '#6E6259',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                Git: {repoMeta.branch}
              </span>
            )}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              fontSize: '0.78rem',
              fontWeight: 600
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
              Hệ thống trực tuyến
            </span>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop,
          .admin-repo-badge {
            display: none !important;
          }
          .admin-mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
