'use client';

import React, { useState } from 'react';

interface SupportedPlatformsProps {
  onSelectPlatform: (platform: string, quote: string) => void;
}

export const SupportedPlatforms: React.FC<SupportedPlatformsProps> = ({ onSelectPlatform }) => {
  const [activePlatform, setActivePlatform] = useState<string>('TikTok');

  const platforms = [
    {
      id: 'Instagram',
      name: 'Instagram',
      blobTheme: 'instagram-blob',
      quote: "Mickey's got your Instagram covered! Turbocharge your Reels, followers & likes in seconds! 📸",
      icon: (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      )
    },
    {
      id: 'TikTok',
      name: 'TikTok',
      blobTheme: 'tiktok-blob',
      quote: "Mickey unlocked the TikTok viral algorithm! Instant high-retention views & likes ready! ⚡",
      icon: (
        <svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87c-.31-.03-.62-.09-.92-.18z"/>
        </svg>
      )
    },
    {
      id: 'Telegram',
      name: 'Telegram',
      blobTheme: 'telegram-blob',
      quote: "Mickey's scaling Telegram channels! Real active members & post views deployed! ✈️",
      icon: (
        <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 3.5L2 11l7 3 3 7 3.5-5.5L20 18l1.5-14.5z"/>
          <path d="M9 14l5-4"/>
        </svg>
      )
    },
    {
      id: 'YouTube',
      name: 'YouTube',
      blobTheme: 'youtube-blob',
      quote: "Mickey's monetization engine! Real watch hours, subscribers & 4K views! 🎬",
      icon: (
        <svg viewBox="0 0 24 24" width="27" height="27" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#FFFFFF"/>
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
    <section className="supported-services-section">
      {/* Freepik Layered Liquid Blob Badges (Textless, Pure Graphic Icons) */}
      <div className="fluid-blobs-row">
        {platforms.map(item => {
          const isActive = activePlatform === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`liquid-blob-btn ${item.blobTheme} ${isActive ? 'blob-active' : ''}`}
              onClick={() => handleSelect(item)}
              aria-label={item.name}
              title={item.name}
            >
              {/* Outer Translucent Shadow Blob Layer */}
              <span className="blob-aura-layer" aria-hidden="true" />
              {/* Secondary Contrast Droplet */}
              <span className="blob-droplet" aria-hidden="true" />
              {/* Main Vivid Organic Blob Center */}
              <span className="blob-core-layer">
                <span className="blob-icon-wrap">
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
