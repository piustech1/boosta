'use client';

import React, { useState } from 'react';

interface HeroDuduPortalProps {
  parallaxOffset?: { x: number; y: number };
}

export const HeroDuduPortal: React.FC<HeroDuduPortalProps> = ({ parallaxOffset = { x: 0, y: 0 } }) => {
  const [imgSrc, setImgSrc] = useState<string>('/assets/mickey.png');
  const [imgError, setImgError] = useState<boolean>(false);

  const handleImgError = () => {
    if (imgSrc.endsWith('.png')) {
      // Fallback to jpg if png not loaded
      setImgSrc('/assets/mickey.jpg');
    } else {
      setImgError(true);
    }
  };

  return (
    <div 
      className="hero-portal-wrapper" 
      style={{
        transform: `translate(${parallaxOffset.x * 0.8}px, ${parallaxOffset.y * 0.8}px)`
      }}
    >
      {/* 1. Irregular Dudu Container: Doodling and wiggling unlimitedly BEHIND Mickey */}
      <div 
        className="hero-asset-card irregular-dudu doodle-animated" 
        id="heroAssetCard"
        aria-hidden="true"
      >
        {/* Ambient Liquid Backlight Halo & Specular Refraction */}
        <div className="character-halo" aria-hidden="true" />
        <div className="liquid-rim-glow" aria-hidden="true" />
      </div>

      {/* 2. Mickey Person Cutout: Stationary foreground — does NOT wiggle */}
      <div className="character-wrapper hero-person-stationary">
        {/* SVG Fallback if assets fail */}
        {imgError && (
          <div className="character-fallback">
            <svg viewBox="0 0 240 280" className="fallback-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="charGrad" x1="20" y1="20" x2="220" y2="260" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ADDFF1" />
                  <stop offset="1" stopColor="#003152" />
                </linearGradient>
                <linearGradient id="skinGrad" x1="80" y1="60" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFE0BD" />
                  <stop offset="1" stopColor="#F3C397" />
                </linearGradient>
              </defs>
              <circle cx="120" cy="140" r="100" fill="#ADDFF1" fillOpacity="0.35" />
              <path d="M60 270 C60 190, 85 170, 120 170 C155 170, 180 190, 180 270 Z" fill="url(#charGrad)" />
              <rect x="108" y="145" width="24" height="30" rx="12" fill="url(#skinGrad)" />
              <ellipse cx="120" cy="115" rx="36" ry="42" fill="url(#skinGrad)" />
              <path d="M84 110 C84 75, 110 65, 126 65 C146 65, 158 80, 156 102 C148 95, 138 92, 120 95 C102 98, 92 104, 84 110 Z" fill="#003152" />
              <circle cx="107" cy="112" r="3" fill="#003152" />
              <circle cx="133" cy="112" r="3" fill="#003152" />
              <path d="M112 126 Q120 134 128 126" stroke="#003152" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <g className="waving-arm-animation">
                <path d="M165 185 C185 160, 195 130, 198 100" stroke="url(#charGrad)" strokeWidth="16" strokeLinecap="round" fill="none" />
                <circle cx="200" cy="92" r="12" fill="url(#skinGrad)" />
                <path d="M216 80 Q222 92 216 104" stroke="#003152" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
                <path d="M222 75 Q230 92 222 109" stroke="#ADDFF1" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
              </g>
            </svg>
          </div>
        )}

        {/* Prominent Mickey Cutout with Specular Rim Blend */}
        {!imgError && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={imgSrc} 
            alt="Mickey Waving" 
            id="heroImage" 
            className="hero-img cutout-asset"
            style={{ display: 'block' }}
            onError={handleImgError}
          />
        )}
      </div>
    </div>
  );
};
