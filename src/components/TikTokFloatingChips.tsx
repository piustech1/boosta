'use client';

import React from 'react';

interface TikTokFloatingChipsProps {
  parallaxOffset?: { x: number; y: number };
}

export const TikTokFloatingChips: React.FC<TikTokFloatingChipsProps> = ({ parallaxOffset = { x: 0, y: 0 } }) => {
  return (
    <>
      {/* 1. TikTok Views Badge */}
      <div 
        className="floating-chip chip-tiktok-views glass-pill"
        style={{
          transform: `translate(${parallaxOffset.x * 1.4}px, ${parallaxOffset.y * 1.4}px)`
        }}
      >
        <div className="chip-badge-icon tiktok-glow">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87c-.31-.03-.62-.09-.92-.18z"/>
          </svg>
        </div>
        <div className="chip-text-group">
          <span className="chip-label">TikTok Views</span>
          <span className="chip-metric">1.2M <span className="trend-up">↑</span></span>
        </div>
      </div>

      {/* 2. TikTok Likes Badge */}
      <div 
        className="floating-chip chip-tiktok-likes glass-pill"
        style={{
          transform: `translate(${parallaxOffset.x * 1.8}px, ${parallaxOffset.y * 1.8}px)`
        }}
      >
        <div className="chip-badge-icon like-glow">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="#FE2C55">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div className="chip-text-group">
          <span className="chip-label">TikTok Likes</span>
          <span className="chip-metric">+84.6K</span>
        </div>
      </div>

      {/* 3. TikTok Followers Badge */}
      <div 
        className="floating-chip chip-tiktok-followers glass-pill"
        style={{
          transform: `translate(${parallaxOffset.x * 2.1}px, ${parallaxOffset.y * 2.1}px)`
        }}
      >
        <div className="chip-badge-icon followers-glow">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
        <div className="chip-text-group">
          <span className="chip-label">TikTok Followers</span>
          <span className="chip-metric">+25.4K</span>
        </div>
      </div>
    </>
  );
};
