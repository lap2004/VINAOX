import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  // Monitor scroll for floating button
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-green)',
        color: '#FFFFFF',
        border: 'none',
        boxShadow: '0 6px 20px rgba(16, 61, 42, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 900,
        transition: 'transform 0.2s ease, background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.backgroundColor = 'var(--forest-green)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.backgroundColor = 'var(--primary-green)';
      }}
    >
      <ArrowUp size={20} />
    </button>
  );
};
