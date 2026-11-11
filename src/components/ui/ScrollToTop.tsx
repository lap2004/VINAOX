import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [visible, setVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const scrollPositions = useRef<Map<string, number>>(new Map());

  // Disable browser automatic scroll restoration to avoid conflicting jumps
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Track scroll position and avoid sitting over the bottom brand strip when footer enters view
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

  useEffect(() => {
    const footerEl = document.getElementById('site-footer');
    if (!footerEl || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        setFooterVisible(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.05 }
    );
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, [location.pathname]);

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
      aria-hidden={footerVisible}
      tabIndex={footerVisible ? -1 : 0}
      className={`scroll-to-top-btn${footerVisible ? ' in-footer-view' : ''}`}
      title="Cuộn lên đầu trang / Back to top"
    >
      <ArrowUp size={20} />
    </button>
  );
};
