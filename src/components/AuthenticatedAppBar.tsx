'use client';

import React, { useState, useEffect } from 'react';

interface AuthenticatedAppBarProps {
  user?: { email: string; name?: string } | null;
  onLogout?: () => void;
  onNavigateService?: (platform: string) => void;
}

export const AuthenticatedAppBar: React.FC<AuthenticatedAppBarProps> = ({
  user,
  onLogout,
  onNavigateService,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMenu = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setNotificationsOpen(false);
    setIsMenuOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setIsMenuOpen(false);
    setNotificationsOpen((prev) => !prev);
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'Creator';

  return (
    <header className="authenticated-appbar-wrapper">
      <nav className="authenticated-appbar glass-pill" aria-label="Boosta Application Navigation">
        {/* Left: Brand Logo */}
        <div className="auth-bar-brand">
          <a href="/home" className="brand-logo-link" aria-label="Boosta Application Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/assets/boosta_icon.png" 
              alt="boosta" 
              className="brand-logo-img" 
            />
          </a>
        </div>

        {/* Right: Authenticated Action Controls */}
        <div className="auth-bar-actions">
          {/* Notification Bell Button */}
          <button
            type="button"
            className={`icon-bubble glass-pill ${notificationsOpen ? 'menu-trigger-active' : ''}`}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={toggleNotifications}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="unread-dot" aria-hidden="true" />
          </button>

          {/* Three-Dots Menu Trigger */}
          <button
            type="button"
            className={`icon-bubble glass-pill ${isMenuOpen ? 'menu-trigger-active' : ''}`}
            aria-label={isMenuOpen ? 'Close application menu' : 'Open application menu'}
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="19" cy="12" r="1.5" />
                <circle cx="5" cy="12" r="1.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Subtle Backdrop overlay when dropdown is open */}
      {(isMenuOpen || notificationsOpen) && (
        <div 
          className="auth-dropdown-backdrop" 
          onClick={() => {
            setIsMenuOpen(false);
            setNotificationsOpen(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* Notifications Popover */}
      {notificationsOpen && (
        <div className="auth-notifications-panel glass-pill" role="region" aria-label="Notifications List">
          <div className="notifications-header">
            <span className="notif-title">Notifications</span>
            <span className="notif-badge">1 New</span>
          </div>
          <div className="notifications-content">
            <div className="notif-item">
              <span className="notif-dot" aria-hidden="true" />
              <div className="notif-text">
                <strong>Welcome to Boosta!</strong>
                <p>Your account is ready. Boost your first platform now.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authenticated Dropdown Menu */}
      {isMenuOpen && (
        <div className="auth-menu-dropdown glass-bubble" role="menu" aria-label="User Account Menu">
          {/* User Profile Header */}
          <div className="auth-menu-user-row">
            <div className="user-avatar-circle" aria-hidden="true">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="user-meta">
              <span className="user-name">{displayName}</span>
              <span className="user-email">{user?.email || 'Active Account'}</span>
            </div>
          </div>

          <div className="auth-menu-divider" aria-hidden="true" />

          {/* Quick Actions List */}
          <div className="auth-menu-links">
            <button
              type="button"
              className="auth-menu-item"
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false);
                if (onNavigateService) onNavigateService('TikTok');
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Instant Boost</span>
            </button>

            <button
              type="button"
              className="auth-menu-item"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Orders &amp; History</span>
            </button>

            <button
              type="button"
              className="auth-menu-item"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span>Wallet: <strong>$0.00</strong></span>
            </button>
          </div>

          <div className="auth-menu-divider" aria-hidden="true" />

          {/* Log Out Action */}
          <button
            type="button"
            className="auth-menu-item item-logout"
            role="menuitem"
            onClick={() => {
              setIsMenuOpen(false);
              if (onLogout) onLogout();
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      )}
    </header>
  );
};
