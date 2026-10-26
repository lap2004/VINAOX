import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [visible, setVisible] = useState(false);
  const scrollPositions = useRef<Map<string, number>>(new Map());

  // Disable browser automatic scroll restoration to avoid conflicting jumps
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Track scroll position for Back/Forward and floating button visibility
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
      if (location.key) {
        scrollPositions.current.set(location.key, window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.key]);

  // Main scroll management on route/hash changes
  useLayoutEffect(() => {
    const { hash, key } = location;

    // Case 1: URL has a hash anchor (e.g., /contact#quote-form)
    if (hash) {
      const scrollToAnchor = () => {
        const id = hash.replace(/^#/, '');
        const targetElement = document.getElementById(id) || document.querySelector(hash);

        if (targetElement) {
          const header = document.querySelector('.site-header') as HTMLElement | null;
          const headerOffset = header ? header.offsetHeight + 16 : 80;
          const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = Math.max(0, elementPosition - headerOffset);

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
          return true;
        }
        return false;
      };

      // Try scrolling immediately; if element not mounted yet (Suspense/async), retry
      if (!scrollToAnchor()) {
        const timer1 = setTimeout(scrollToAnchor, 100);
        const timer2 = setTimeout(scrollToAnchor, 300);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
      return;
    }

    // Case 2: Browser Back/Forward navigation (POP) without hash
    if (navigationType === 'POP') {
      const savedY = scrollPositions.current.get(key);
      if (typeof savedY === 'number') {
        window.scrollTo({ top: savedY, left: 0, behavior: 'instant' });
        return;
      }
    }

    // Case 3: Standard page transition (PUSH or REPLACE) - reset to top immediately
    // Temporarily bypass CSS smooth scrolling on html to guarantee instant, flicker-free reset
    const htmlEl = document.documentElement;
    const originalBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
    htmlEl.scrollTop = 0;
    document.body.scrollTop = 0;

    // Restore smooth scroll behavior for in-page interactions
    requestAnimationFrame(() => {
      htmlEl.style.scrollBehavior = originalBehavior;
    });
  }, [location.pathname, location.hash, location.key, navigationType]);

  const scrollToTopSmooth = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTopSmooth}
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
