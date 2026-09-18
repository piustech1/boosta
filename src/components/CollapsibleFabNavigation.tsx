'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'Orders',
    href: '/orders',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: 'boost',
    label: 'Boost',
    href: '/boost',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'home',
    label: 'Home',
    href: '/home',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

export const CollapsibleFabNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setIsOpen((prev) => !prev);
  };

  const handleNavigate = (href: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    setIsOpen(false);
    if (pathname !== href) {
      router.push(href);
    }
  };

  return (
    <div className="fab-nav-anchor" ref={navRef} aria-label="Boosta Quick Navigation">
      <div className={`fab-nav-cluster ${isOpen ? 'cluster-expanded' : 'cluster-collapsed'}`}>
        {/* Child action dock (expands horizontally RIGHT-TO-LEFT) */}
        <div className="fab-action-dock" role="menu" aria-hidden={!isOpen}>
          {NAV_ITEMS.map((item, index) => {
            const isActive = pathname === item.href;
            // Delay for right-to-left stagger: item closest to main button appears first
            const staggerDelay = `${(NAV_ITEMS.length - 1 - index) * 45}ms`;

            return (
              <button
                key={item.id}
                type="button"
                className={`fab-action-btn ${isActive ? 'btn-active' : ''}`}
                onClick={() => handleNavigate(item.href)}
                style={{ transitionDelay: isOpen ? staggerDelay : '0ms' }}
                tabIndex={isOpen ? 0 : -1}
                aria-label={`Navigate to ${item.label}`}
                role="menuitem"
              >
                <span className="fab-item-icon">{item.icon}</span>
                <span className="fab-item-tooltip">{item.label}</span>
                {isActive && <span className="fab-active-pip" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        {/* Main Trigger FAB */}
        <button
          type="button"
          className={`fab-main-trigger ${isOpen ? 'trigger-open' : ''}`}
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span className="fab-trigger-sheen" aria-hidden="true" />
          <div className="fab-trigger-icon-stage" aria-hidden="true">
            <svg 
              viewBox="0 0 24 24" 
              width="22" 
              height="22" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="fab-icon-svg"
            >
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};
