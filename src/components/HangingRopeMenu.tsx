'use client';

import React, { useEffect } from 'react';

interface HangingRopeMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (mode: 'login' | 'signup') => void;
  onHome?: () => void;
}

export const HangingRopeMenu: React.FC<HangingRopeMenuProps> = ({ isOpen, onClose, onNavigate, onHome }) => {
  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Subtle light-theme backdrop overlay */}
      <div 
        className={`hanging-menu-backdrop ${isOpen ? 'backdrop-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Physical Suspended Navigation Structure */}
      <div 
        className={`hanging-menu-container ${isOpen ? 'menu-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Left Suspended Rope */}
        <div className="hanging-rope rope-left" aria-hidden="true">
          <span className="rope-anchor-top" />
          <div className="rope-cord" />
          <span className="rope-knot-bottom" />
        </div>

        {/* Right Suspended Rope */}
        <div className="hanging-rope rope-right" aria-hidden="true">
          <span className="rope-anchor-top" />
          <div className="rope-cord" />
          <span className="rope-knot-bottom" />
        </div>

        {/* Compact Single-Line Suspended Shelf */}
        <nav className="hanging-nav-shelf glass-pill" aria-label="Quick Navigation">
          {/* Subtle top Boosta brand gradient rim */}
          <div className="shelf-gradient-rim" aria-hidden="true" />

          {/* Single horizontal line with smooth hidden scroll for narrow viewports */}
          <div className="shelf-items-row">
            <a 
              href="/" 
              className="shelf-nav-link active" 
              onClick={(e) => {
                onClose();
                if (onHome) {
                  e.preventDefault();
                  onHome();
                }
              }}
            >
              <span className="link-indicator" aria-hidden="true" />
              Home
            </a>
            <a href="/#services" className="shelf-nav-link" onClick={onClose}>
              Services
            </a>
            <a href="/#platforms" className="shelf-nav-link" onClick={onClose}>
              Platforms
            </a>
            <a href="/#how-it-works" className="shelf-nav-link" onClick={onClose}>
              How It Works
            </a>
            <a href="/#support" className="shelf-nav-link" onClick={onClose}>
              Support
            </a>

            <span className="shelf-divider" aria-hidden="true" />

            <button 
              type="button" 
              className="shelf-login-btn" 
              onClick={() => {
                onClose();
                if (onNavigate) onNavigate('login');
              }}
            >
              Log In
            </button>

            <button 
              type="button" 
              className="shelf-cta-btn" 
              onClick={() => {
                onClose();
                if (onNavigate) onNavigate('signup');
              }}
            >
              <span>Get Started</span>
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};
