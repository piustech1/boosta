'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface HeroCarouselProps {
  onBoost?: (platform: string) => void;
}

interface CarouselSlide {
  id: string;
  platform: string;
  title: string;
  subtitle: string;
  headline: string;
  description: string;
  ctaText: string;
  cardImage: string;
  detailImage: string;
  accentColor: string;
  secondaryColor: string;
  badgeBg: string;
  statLabel: string;
  icon: React.ReactNode;
}

const SLIDES: CarouselSlide[] = [
  {
    id: 'tiktok',
    platform: 'TikTok',
    title: 'TikTok Growth',
    subtitle: 'Viral Algorithm Velocity',
    headline: 'MAKE YOUR CONTENT MOVE.',
    description: 'Put your content in front of more people and build unstoppable momentum with high-retention views.',
    ctaText: 'Boost TikTok',
    cardImage: '/assets/mickey.png',
    detailImage: '/assets/mickey.png',
    accentColor: '#FE2C55',
    secondaryColor: '#00F2FE',
    badgeBg: 'linear-gradient(135deg, rgba(254, 44, 85, 0.2), rgba(0, 242, 254, 0.15))',
    statLabel: '1.2M+ Delivered',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87c-.31-.03-.62-.09-.92-.18z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    title: 'Instagram Growth',
    subtitle: 'Reach & Profile Visits',
    headline: 'TURN ATTENTION INTO MOMENTUM.',
    description: 'Give your Reels and profile the push they deserve with genuine creator reach and active engagement.',
    ctaText: 'Boost Instagram',
    cardImage: '/assets/solo.png',
    detailImage: '/assets/solo.png',
    accentColor: '#E1306C',
    secondaryColor: '#7357FF',
    badgeBg: 'linear-gradient(135deg, rgba(225, 48, 108, 0.2), rgba(115, 87, 255, 0.15))',
    statLabel: '85K+ Visits',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    platform: 'YouTube',
    title: 'YouTube Growth',
    subtitle: 'Watch Hours & Retention',
    headline: 'GIVE YOUR NEXT UPLOAD MOMENTUM.',
    description: 'Build stronger signals and discoverability around the videos you create with targeted impressions.',
    ctaText: 'Boost YouTube',
    cardImage: '/assets/mickey.png',
    detailImage: '/assets/mickey.png',
    accentColor: '#FF0000',
    secondaryColor: '#ED5FC9',
    badgeBg: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(237, 95, 201, 0.15))',
    statLabel: '450K+ Hours',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'x',
    platform: 'X Reach',
    title: 'X / Twitter Reach',
    subtitle: 'Impressions & Retweets',
    headline: 'COMMAND THE CONVERSATION.',
    description: 'Instant reposts, bookmark bursts, and verified impression velocity across trending topics.',
    ctaText: 'Boost X',
    cardImage: '/assets/solo.png',
    detailImage: '/assets/solo.png',
    accentColor: '#182033',
    secondaryColor: '#7357FF',
    badgeBg: 'linear-gradient(135deg, rgba(24, 32, 51, 0.18), rgba(115, 87, 255, 0.15))',
    statLabel: '320K+ Impressions',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'telegram',
    platform: 'Telegram',
    title: 'Telegram Community',
    subtitle: 'Members & Post Views',
    headline: 'SCALE YOUR COMMUNITY FASTER.',
    description: 'Real active channel members and targeted post views deployed instantly to build group authority.',
    ctaText: 'Boost Telegram',
    cardImage: '/assets/mickey.png',
    detailImage: '/assets/mickey.png',
    accentColor: '#2AABEE',
    secondaryColor: '#7357FF',
    badgeBg: 'linear-gradient(135deg, rgba(42, 171, 238, 0.2), rgba(115, 87, 255, 0.15))',
    statLabel: '48K+ Members',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    platform: 'Facebook',
    title: 'Facebook Presence',
    subtitle: 'Page Likes & Followers',
    headline: 'EXPAND YOUR SOCIAL FOOTPRINT.',
    description: 'Build authority with engaged followers, page likes, and viral feed reach across worldwide audiences.',
    ctaText: 'Boost Facebook',
    cardImage: '/assets/solo.png',
    detailImage: '/assets/solo.png',
    accentColor: '#1877F2',
    secondaryColor: '#ED5FC9',
    badgeBg: 'linear-gradient(135deg, rgba(24, 119, 242, 0.2), rgba(237, 95, 201, 0.15))',
    statLabel: '180K+ Reach',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onBoost }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTextAnimating, setIsTextAnimating] = useState<boolean>(false);

  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const isInteracting = useRef<boolean>(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = SLIDES.length;

  const goToIndex = useCallback((newIndex: number) => {
    if (newIndex === activeIndex) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    setPrevSlideIndex(activeIndex);
    setIsTextAnimating(true);
    setActiveIndex(newIndex);

    // Staggered text fade-in like reference
    setTimeout(() => {
      setIsTextAnimating(false);
    }, 600);
  }, [activeIndex]);

  const goToNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % totalSlides;
    goToIndex(nextIdx);
  }, [activeIndex, totalSlides, goToIndex]);

  const goToPrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + totalSlides) % totalSlides;
    goToIndex(prevIdx);
  }, [activeIndex, totalSlides, goToIndex]);

  // Autoplay every 3500ms
  useEffect(() => {
    if (isPaused) return;

    autoPlayTimer.current = setInterval(() => {
      goToNext();
    }, 3500);

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPaused, goToNext]);

  // Touch gesture handling (vertical swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    isInteracting.current = true;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isInteracting.current) return;
    isInteracting.current = false;

    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    // Detect swipe (vertical or horizontal swipe on mobile)
    if (Math.abs(deltaY) > 30 && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    } else if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  };

  const currentSlide = SLIDES[activeIndex];
  const previousSlide = SLIDES[prevSlideIndex];

  // Helper to calculate wrapping circular card state
  const getCardState = (index: number) => {
    let diff = (index - activeIndex + totalSlides) % totalSlides;
    if (diff > totalSlides / 2) {
      diff -= totalSlides;
    }

    if (diff === 0) return 'card-active';
    if (diff === -1) return 'card-prev';
    if (diff === 1) return 'card-next';
    if (diff < -1) return 'card-hidden-top';
    return 'card-hidden-bottom';
  };

  return (
    <div 
      className="curved-hero-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Boosta Featured Platforms"
    >
      {/* =========================================================
          PANEL A: LEFT VERTICAL SLIDING CAROUSEL
          Contains circular CONCAVE cut-out on right edge via radial mask
          ========================================================= */}
      <div className="vertical-carousel-panel" aria-label="Platform Slider">
        <div className="vertical-carousel-track">
          {SLIDES.map((slide, index) => {
            const cardState = getCardState(index);
            const isCurrent = cardState === 'card-active';
            const isClickable = cardState === 'card-prev' || cardState === 'card-next';

            return (
              <div
                key={slide.id}
                className={`vertical-carousel-card ${cardState}`}
                onClick={() => {
                  if (isClickable) goToIndex(index);
                }}
                style={{
                  ['--card-accent' as string]: slide.accentColor,
                  ['--card-secondary' as string]: slide.secondaryColor,
                }}
                role="button"
                tabIndex={isClickable || isCurrent ? 0 : -1}
                aria-label={`${slide.title} - ${slide.subtitle}`}
                aria-current={isCurrent ? 'true' : undefined}
              >
                {/* Background image & gradient overlay */}
                <div 
                  className="card-bg-layer" 
                  style={{
                    background: `linear-gradient(135deg, ${slide.secondaryColor}25 0%, ${slide.accentColor}30 100%)`
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.cardImage}
                    alt={slide.title}
                    className="card-asset-img"
                    loading="lazy"
                  />
                  <div className="card-gradient-overlay" />
                </div>

                {/* Card lower-left title + subtitle */}
                <div className="card-label-group">
                  <span className="card-platform-tag" style={{ color: slide.accentColor }}>
                    {slide.platform}
                  </span>
                  <span className="card-title-text">{slide.title}</span>
                  <span className="card-subtitle-text">{slide.subtitle}</span>
                </div>

                {/* Subtle active border indicator */}
                {isCurrent && <div className="card-active-indicator" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          PANEL B: RIGHT EXPANDED ACTIVE DETAIL PANEL
          Features CONVEX curved left edge with large radius,
          pulled toward left panel creating the concentric curved gap!
          ========================================================= */}
      <div 
        className="active-detail-panel"
        style={{
          ['--detail-accent' as string]: currentSlide.accentColor,
          ['--detail-secondary' as string]: currentSlide.secondaryColor,
        }}
      >
        {/* Background Image Layers with Smooth 0.6s Crossfade */}
        <div className="detail-image-crossfade-stage" aria-hidden="true">
          {/* Previous active image (fading out) */}
          <div 
            className="detail-bg-layer prev-layer"
            style={{
              background: `radial-gradient(circle at 65% 45%, ${previousSlide.secondaryColor}30 0%, ${previousSlide.accentColor}25 60%, rgba(15, 23, 42, 0.95) 100%)`
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previousSlide.detailImage}
              alt=""
              className="detail-creator-img"
            />
          </div>

          {/* Current active image (fading in) */}
          <div 
            key={currentSlide.id}
            className="detail-bg-layer current-layer active-enter"
            style={{
              background: `radial-gradient(circle at 65% 45%, ${currentSlide.secondaryColor}35 0%, ${currentSlide.accentColor}28 60%, rgba(15, 23, 42, 0.92) 100%)`
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSlide.detailImage}
              alt={currentSlide.title}
              className="detail-creator-img"
            />
          </div>

          {/* Dark left-to-right gradient overlay for text readability */}
          <div className="detail-gradient-overlay" />
        </div>

        {/* Liquid Glass Highlight Rim */}
        <div className="detail-glass-rim" aria-hidden="true" />

        {/* Floating Stat Pill on Detail */}
        <div className="detail-floating-stat glass-pill" aria-hidden="true">
          <span className="stat-icon" style={{ color: currentSlide.accentColor }}>
            {currentSlide.icon}
          </span>
          <span className="stat-text">{currentSlide.statLabel}</span>
        </div>

        {/* Content Block: Title, Description, CTA with smooth entrance transition */}
        <div className={`detail-content-block ${isTextAnimating ? 'text-transitioning' : 'text-settled'}`}>
          <span className="detail-platform-badge glass-pill">
            <span className="badge-dot" style={{ background: currentSlide.accentColor }} />
            <span>{currentSlide.platform}</span>
          </span>

          <h1 className="detail-headline">
            {currentSlide.headline}
          </h1>

          <p className="detail-description">
            {currentSlide.description}
          </p>

          <div className="detail-cta-wrapper">
            <button
              type="button"
              className="detail-cta-button"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(20);
                }
                if (onBoost) onBoost(currentSlide.platform);
              }}
              aria-label={currentSlide.ctaText}
            >
              <span className="cta-sheen" aria-hidden="true" />
              <span className="cta-text">{currentSlide.ctaText}</span>
              <span className="cta-arrow-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10h12M11 5l5 5-5 5" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Progress Dots Indicator (01 / 06) */}
        <div className="detail-progress-indicator" aria-hidden="true">
          <span className="progress-current">0{activeIndex + 1}</span>
          <div className="progress-mini-bar">
            <div 
              className="progress-mini-fill" 
              style={{ width: `${((activeIndex + 1) / totalSlides) * 100}%` }}
            />
          </div>
          <span className="progress-total">0{totalSlides}</span>
        </div>
      </div>
    </div>
  );
};
