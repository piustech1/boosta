'use client';

import React, { useState } from 'react';
import { HangingRopeMenu } from './HangingRopeMenu';

interface FloatingAppBarProps {
  onNavigate?: (mode: 'login' | 'signup') => void;
  onHome?: () => void;
}

export const FloatingAppBar: React.FC<FloatingAppBarProps> = ({ onNavigate, onHome }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    setIsMenuOpen(prev => !prev);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onHome) {
      e.preventDefault();
      onHome();
    }
  };

  return (
    <header className="floating-appbar-wrapper">
      <nav className="floating-appbar glass-pill">
        {/* Site Brand with Official Boosta Logo Image */}
        <div className="brand-left">
          <a href="/" onClick={handleLogoClick} className="brand-logo-link" style={{ display: 'flex', alignItems: 'center' }} aria-label="Boosta Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/assets/boosta_icon.png" 
              alt="boosta" 
              className="brand-logo-img" 
            />
          </a>
        </div>

        {/* Action Icons on the Right */}
        <div className="appbar-actions">
          {/* Notification / Live Updates Bell */}
          <button className="icon-bubble glass-pill" aria-label="Notifications">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="unread-dot" aria-hidden="true" />
          </button>

          {/* Quick Menu / Three-Dots Toggle Trigger */}
          <button 
            className={`icon-bubble glass-pill ${isMenuOpen ? 'menu-trigger-active' : ''}`}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
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

      {/* Hanging Rope Menu Feature */}
      <HangingRopeMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={onNavigate} 
        onHome={onHome}
      />
    </header>
  );
};
