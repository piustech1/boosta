'use client';

import React from 'react';

export const FloatingAppBar: React.FC = () => {
  return (
    <header className="floating-appbar-wrapper">
      <nav className="floating-appbar glass-pill">
        {/* Site Brand with Twisted Avant-Garde Typography */}
        <div className="brand-left">
          <div className="brand-spark-dot" aria-hidden="true" />
          <span className="twisted-brand">
            boosta<span className="brand-dot">.</span>
          </span>
        </div>

        {/* Relative Action Icons on the Right */}
        <div className="appbar-actions">
          {/* Live Engine Speed Badge */}
          <div className="status-chip glass-pill">
            <span className="status-pulse-dot" />
            <span className="status-text">99.9%</span>
          </div>

          {/* Notification / Live Updates Bell */}
          <button className="icon-bubble glass-pill" aria-label="Notifications">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="unread-dot" aria-hidden="true" />
          </button>

          {/* Quick Menu / Sparkle Icon */}
          <button className="icon-bubble glass-pill" aria-label="Menu">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
              <circle cx="5" cy="12" r="1.5" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};
