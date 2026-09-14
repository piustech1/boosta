'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedAppBar } from '@/components/AuthenticatedAppBar';
import { HeroCarousel } from '@/components/HeroCarousel';
import { SupportedPlatforms } from '@/components/SupportedPlatforms';

interface UserSession {
  email: string;
  name?: string;
}

export default function AuthenticatedHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);

  // Retrieve authenticated session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('boosta_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser({ email: 'creator@boosta.app', name: 'Creator' });
        }
      } else {
        // Fallback demo user session so the screen is directly viewable if opened
        setUser({ email: 'creator@boosta.app', name: 'Boosta Creator' });
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('boosta_user');
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    router.push('/');
  };

  const handleBoost = (platform: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
    setActiveFeedback(`Launching ${platform} viral booster... Select package below.`);
    setTimeout(() => {
      setActiveFeedback(null);
    }, 3800);
  };

  const handleSelectPlatform = (platform: string, _quote: string) => {
    handleBoost(platform);
  };

  return (
    <>
      {/* Ambient Liquid Background with glowing animated orbs */}
      <div className="liquid-canvas" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      {/* Main Authenticated Mobile App Shell */}
      <main className="app-container auth-home-container">
        {/* 1. Floating Top App Bar for Authenticated Users */}
        <AuthenticatedAppBar 
          user={user} 
          onLogout={handleLogout} 
          onNavigateService={handleBoost}
        />

        {/* Dynamic Toast Feedback Pill if present */}
        {activeFeedback && (
          <div className="auth-home-toast-pill" role="status">
            <span className="toast-spark" aria-hidden="true">⚡</span>
            <span>{activeFeedback}</span>
          </div>
        )}

        {/* 2. Signature Curved Gap Hero Carousel (6 Real Platforms) */}
        <section className="auth-home-hero-section">
          <HeroCarousel onBoost={handleBoost} />
        </section>

        {/* 3. Social Media Platforms Quick Dock */}
        <section className="auth-home-services-dock">
          <SupportedPlatforms onSelectPlatform={handleSelectPlatform} />
        </section>

        {/* 4. Bottom Authenticated Quick Bar */}
        <footer className="auth-home-footer-controls">
          <button 
            type="button" 
            className="auth-home-quick-cta primary-action"
            onClick={() => handleBoost('TikTok')}
          >
            <span className="cta-sheen" aria-hidden="true" />
            <span>Launch Instant Boost</span>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </button>
          <div className="ios-home-indicator" aria-hidden="true" />
        </footer>
      </main>
    </>
  );
}
