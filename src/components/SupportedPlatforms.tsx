'use client';

import React, { useState } from 'react';

interface SupportedPlatformsProps {
  onSelectPlatform: (platform: string, quote: string) => void;
}

export const SupportedPlatforms: React.FC<SupportedPlatformsProps> = ({ onSelectPlatform }) => {
  const [activePlatform, setActivePlatform] = useState<string>('Instagram');

  // 9 Supported Platforms (Row 1: Facebook, Instagram, Behance; Row 2: X, YouTube, WordPress; Row 3: Snapchat, Dribbble, LinkedIn)
  const platforms = [
    // --- ROW 1 ---
    {
      id: 'Facebook',
      name: 'Facebook',
      blobTheme: 'facebook-blob',
      quote: "Mickey's scaling Facebook viral reach! High-authority page likes, group engagement & shares ready! 👍",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
      id: 'Behance',
      name: 'Behance',
      blobTheme: 'behance-blob',
      quote: "Showcase your creative portfolio on Behance! Instant appreciations, project views & followers! 🎨",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M6.938 4.5c-3.791 0-4.938 2.683-4.938 5.618 0 2.872 1.157 5.882 4.965 5.882 1.488 0 2.766-.462 3.585-1.284.97-.975 1.185-2.28 1.185-3.834h-6.85c.038-1.527.788-2.61 2.302-2.61 1.258 0 1.94.62 2.158 1.465h2.518C11.517 7.027 9.873 4.5 6.938 4.5zm-2.02 5.093h4.032c-.083-1.077-.822-1.748-1.92-1.748-1.196 0-1.936.758-2.112 1.748zm12.39-5.093c-2.316 0-3.328 1.198-3.774 2.15h-.06v-1.896H11v11.24h2.515v-5.267c0-1.722.955-2.67 2.457-2.67 1.583 0 2.336 1.025 2.336 2.67v5.267H21v-5.83c0-3.418-1.583-5.664-3.692-5.664zM13.5 1h5v1.5h-5V1z" />
        </svg>
      )
    },
    // --- ROW 2 ---
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
      id: 'YouTube',
      name: 'YouTube',
      blobTheme: 'youtube-blob',
      quote: "Mickey's monetization engine! Real watch hours, organic subscribers & 4K views! 🎬",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      id: 'WordPress',
      name: 'WordPress',
      blobTheme: 'wordpress-blob',
      quote: "Authority ranking for your WordPress site! SEO backlink power, traffic surges & real clicks! 🌐",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12 2C6.486 2 2 6.486 2 12c0 5.515 4.486 10 10 10 5.514 0 10-4.485 10-10 0-5.514-4.486-10-10-10zm-8.232 10c0-1.508.397-2.923 1.088-4.153l3.652 10.007c-2.909-1.397-4.74-4.32-4.74-5.854zm8.232 8.23c-1.378 0-2.666-.342-3.8-1l2.58-7.5 2.613 7.15c.01.026.02.052.03.076-0.457.178-.934.274-1.423.274zm1.258-13.68c.677-.034 1.288-.103 1.288-.103.542-.069.48-.863-.068-.83 0 0-.825.068-1.706.068-.847 0-1.74-.068-1.74-.068-.542-.033-.61.761-.068.83 0 0 .576.069 1.187.103l1.747 4.793-2.454 7.362-3.794-11.32c.678-.035 1.288-.104 1.288-.104.543-.068.475-.863-.068-.829 0 0-.814.068-1.695.068-.238 0-.52-.006-.814-.017C7.625 4.542 9.697 3.77 12 3.77c2.81 0 5.32 1.205 7.07 3.125-.038.006-.076.012-.116.021l-3.327 9.69-2.369-6.836zm5.85 2.85c.61 1.05.955 2.268.955 3.568 0 2.228-1.077 4.2-2.732 5.432l3.414-9.87c.055.285.084.577.084.87z" />
        </svg>
      )
    },
    // --- ROW 3 ---
    {
      id: 'Snapchat',
      name: 'Snapchat',
      blobTheme: 'snapchat-blob',
      quote: "Snap your way to the top! Snapchat story views, spotlight virality & snap score boosts! 👻",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12.007 2c-3.774 0-6.19 2.544-6.19 5.86 0 .848.167 1.83.473 2.65-.563.34-1.285.76-1.508 1.34-.236.61.168 1.17.65 1.54.49.38 1.13.56 1.76.68-.07.44-.12.89-.12 1.35 0 .28.02.56.07.83-.8.25-1.74.59-2.37 1.26-.54.57-.61 1.36-.2 1.99.37.58 1.1.84 1.86.99.6.12 1.26.17 1.91.2.29.35.73.66 1.23.86.81.33 1.75.34 2.43.01.69.33 1.63.32 2.44-.01.5-.2.94-.51 1.23-.86.65-.03 1.31-.08 1.91-.2.76-.15 1.49-.41 1.86-.99.41-.63.34-1.42-.2-1.99-.63-.67-1.57-1.01-2.37-1.26.05-.27.07-.55.07-.83 0-.46-.05-.91-.12-1.35.63-.12 1.27-.3 1.76-.68.48-.37.89-.93.65-1.54-.22-.58-.94-1-1.51-1.34.31-.82.47-1.8.47-2.65 0-3.316-2.416-5.86-6.19-5.86z" />
        </svg>
      )
    },
    {
      id: 'Dribbble',
      name: 'Dribbble',
      blobTheme: 'dribbble-blob',
      quote: "Get discovered on Dribbble! High-retention shot views, saves & creative designer likes! 🏀",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm7.74 8.78c-.73-.04-2.48-.06-4.66.42-.14-.3-.28-.61-.43-.92-.3-.6-.62-1.21-.97-1.81 2.37-1.07 4.67-1.4 5.37-1.48.51 1.13.77 2.38.77 3.69-.03.04-.05.07-.08.1zm-7.05-7.05c1.94 0 3.73.65 5.17 1.75-.59.1-2.67.48-4.88 1.5-1.12-2.02-2.19-3.48-2.52-3.92.71-.21 1.47-.33 2.23-.33zm-4.39 1.34c.32.42 1.35 1.83 2.47 3.8-2.67 1.01-5.17 1.07-6.04 1.07-.01-.25-.02-.5-.02-.74 0-1.58.46-3.05 1.25-4.3.72.06 1.73.12 2.34.17zm-4.52 6.93c.84 0 3.6-.08 6.5-1.24.13.26.25.53.37.79.29.61.55 1.23.77 1.84-3.32 1.07-6.25 3.39-6.73 3.8-.57-1.42-.89-2.98-.89-4.61-.02-.2-.02-.39-.02-.58zm7.3 8.27c2.14 0 4.09-.79 5.59-2.09-.07-.06-1.74-1.39-4.32-2.31-.66 1.88-1.52 3.62-2.02 4.6.25.04.5.07.75.07zm-2.92-1.33c.43-.87 1.24-2.51 1.88-4.32-1.89-.53-4.04-.6-5.46-.58.74 2.1 2.11 3.87 3.58 4.9zm6.67-2.67c2.4.82 4.02 2.05 4.19 2.18-.89 1.14-2.06 2.04-3.41 2.58-.33-.8-.92-2.05-1.53-3.43 2.02-.45 3.62-.48 4.3-.48.06.01.12.01.17.01-.15-.31-.33-.6-.52-.86z" />
        </svg>
      )
    },
    {
      id: 'LinkedIn',
      name: 'LinkedIn',
      blobTheme: 'linkedin-blob',
      quote: "Expand your executive presence on LinkedIn! High-converting post reactions, profile views & connections! 💼",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3z" />
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
      {/* Centered Modern Bold Sans-Serif Title */}
      <div className="social-showcase-header">
        <h2 className="social-showcase-title">SOCIAL MEDIA LOGOS</h2>
      </div>

      {/* 3-Column × 3-Row Grid of Fluid Organic Blob Tiles (Pure Graphic Logos, No Text) */}
      <div className="social-media-logos-grid" role="grid">
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
              {/* Secondary Darker, Slightly Larger Shadow/Aura Blob Layer Behind Main Blob */}
              <span className="blob-shadow-underlayer" aria-hidden="true" />

              {/* Satellite Liquid Droplets */}
              <span className="blob-satellite-droplet droplet-1" aria-hidden="true" />
              <span className="blob-satellite-droplet droplet-2" aria-hidden="true" />

              {/* Primary Vivid Organic Blob Core Layer */}
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

