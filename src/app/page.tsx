'use client';

import React, { useState, useEffect } from 'react';
import { FloatingAppBar } from '@/components/FloatingAppBar';
import { HeroDuduPortal } from '@/components/HeroDuduPortal';
import { TikTokFloatingChips } from '@/components/TikTokFloatingChips';
import { ChatBubble } from '@/components/ChatBubble';
import { SupportedPlatforms } from '@/components/SupportedPlatforms';
import { HalfBarControls } from '@/components/HalfBarControls';
import { AuthExperience, AuthMode } from '@/components/AuthExperience';

export default function OnboardingPage() {
  const [authMode, setAuthMode] = useState<'none' | AuthMode>('none');
  const [chatMessage, setChatMessage] = useState<string>(
    "Hey! 👋 Welcome to Boosta. Your social growth starts here."
  );
  const [parallaxOffset, setParallaxOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Listen to hash or search changes on initial load (#login or #signup)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login') setAuthMode('login');
      if (hash === '#signup') setAuthMode('signup');
    }
  }, []);

  // Real-time Parallax Physics (Desktop Pointer & Mobile Gyroscope)
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const xRatio = e.clientX / window.innerWidth;
      const yRatio = e.clientY / window.innerHeight;
      const moveX = (xRatio - 0.5) * 16;
      const moveY = (yRatio - 0.5) * 16;
      setParallaxOffset({ x: moveX, y: moveY });
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const xRatio = Math.min(Math.max((e.gamma + 30) / 60, 0), 1);
        const yRatio = Math.min(Math.max((e.beta - 20) / 60, 0), 1);
        const moveX = (xRatio - 0.5) * 16;
        const moveY = (yRatio - 0.5) * 16;
        setParallaxOffset({ x: moveX, y: moveY });
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const handleSelectPlatform = (platform: string, quote: string) => {
    setChatMessage(quote);
  };

  const handleChatBubbleTap = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
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

      {/* Main Mobile App Shell */}
      <main className="app-container">
        {/* Floating Top App Bar — Surfaces across both landing and auth screens */}
        <FloatingAppBar 
          onNavigate={(mode) => setAuthMode(mode)} 
          onHome={() => setAuthMode('none')} 
        />

        {authMode !== 'none' ? (
          /* Seamless In-Place Liquid Glass Auth Experience */
          <AuthExperience
            initialMode={authMode}
            onClose={() => setAuthMode('none')}
            onModeChange={(mode) => setAuthMode(mode)}
          />
        ) : (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              {/* Classy Floating TikTok SMM Metric Badges */}
              <TikTokFloatingChips parallaxOffset={parallaxOffset} />

              {/* Prominent Hero Asset in an Irregular Morphing Liquid Dudu Pebble */}
              <HeroDuduPortal parallaxOffset={parallaxOffset} />

              {/* Animated Chat Bubble directly emerging from Mickey's waving hand */}
              <ChatBubble 
                message={chatMessage} 
                parallaxOffset={parallaxOffset}
                onTap={handleChatBubbleTap}
              />

              {/* High-Energy Holographic Supported Platforms Dock */}
              <SupportedPlatforms onSelectPlatform={handleSelectPlatform} />
            </section>

            {/* Bottom Controls: Minimalist Dual Half-Bars */}
            <HalfBarControls 
              onGetStarted={() => setAuthMode('signup')}
              onLogIn={() => setAuthMode('login')}
            />
          </>
        )}
      </main>
    </>
  );
}
