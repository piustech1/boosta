'use client';

import React, { useState } from 'react';

interface SupportedPlatformsProps {
  onSelectPlatform: (platform: string, quote: string) => void;
}

export const SupportedPlatforms: React.FC<SupportedPlatformsProps> = ({ onSelectPlatform }) => {
  const [activePlatform, setActivePlatform] = useState<string>('TikTok');

  // 4 Core Platforms — TikTok, X, Instagram, Telegram (2×2 grid)
  const platforms = [
    {
      id: 'TikTok',
      name: 'TikTok',
      blobTheme: 'tiktok-blob',
      quote: "Mickey unlocked the TikTok viral algorithm! Instant high-retention views & likes ready! ⚡",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87c-.31-.03-.62-.09-.92-.18z" />
        </svg>
      )
    },
    {
      id: 'X',
      name: 'X',
      blobTheme: 'x-blob',
      quote: "Command the conversation on X! Instant reposts, bookmark bursts & verified viral impressions! ✖️",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      id: 'Instagram',
      name: 'Instagram',
      blobTheme: 'instagram-blob',
      quote: "Mickey's got your Instagram covered! Turbocharge your Reels, followers & likes in seconds! 📸",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      id: 'Telegram',
      name: 'Telegram',
      blobTheme: 'telegram-blob',
      quote: "Mickey's scaling Telegram channels! Real active members & post views deployed! ✈️",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      )
    }
  ];

  const handleSelect = (platform: typeof platforms[0]) => {
    setActivePlatform(platform.id);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    onSelectPlatform(platform.id, platform.quote);
  };

  return (
    <section className="supported-services-section" aria-label="Social Media Showcase">
      <div className="social-showcase-header">
        <h2 className="social-showcase-title">SOCIAL MEDIA LOGOS</h2>
      </div>

      {/* 2×2 Grid of Fluid Organic Blob Tiles */}
      <div className="social-media-logos-grid social-media-logos-grid--2col" role="grid">
        {platforms.map(item => {
          const isActive = activePlatform === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`liquid-blob-tile ${item.blobTheme} ${isActive ? 'blob-tile-active' : ''}`}
              onClick={() => handleSelect(item)}
              aria-label={item.name}
              title={item.name}
            >
              <span className="blob-shadow-underlayer" aria-hidden="true" />
              <span className="blob-satellite-droplet droplet-1" aria-hidden="true" />
              <span className="blob-satellite-droplet droplet-2" aria-hidden="true" />
              <span className="blob-main-layer">
                <span className="blob-brand-icon">
                  {item.icon}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
