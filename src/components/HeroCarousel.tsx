'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface HeroCarouselProps {
  onBoost?: (platform: string) => void;
}

interface CarouselSlide {
  id: string;
  platform: string;
  label: string;
  headline: string;
  subtext: string;
  ctaText: string;
  image: string;
  imageAlt: string;
  accentColor: string;
  secondaryColor: string;
  badgeBg: string;
  statBadge: { number: string; label: string };
  icon: React.ReactNode;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 'tiktok',
    platform: 'TikTok',
    label: 'TikTok Growth',
    headline: 'MAKE YOUR CONTENT MOVE.',
    subtext: 'Give your content the push it deserves with viral algorithm signals.',
    ctaText: 'Boost TikTok',
    image: '/assets/mickey.png',
    imageAlt: 'Boosta Creator Mickey with TikTok traction',
    accentColor: '#FE2C55',
    secondaryColor: '#00F2FE',
    badgeBg: 'linear-gradient(135deg, rgba(254, 44, 85, 0.16), rgba(0, 242, 254, 0.14))',
    statBadge: { number: '1.2M+', label: 'Views Delivered' },
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87c-.31-.03-.62-.09-.92-.18z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    label: 'Instagram Growth',
    headline: 'TURN ATTENTION INTO MOMENTUM.',
    subtext: 'Give your profile a stronger push with genuine creator reach.',
    ctaText: 'Boost Instagram',
    image: '/assets/solo.png',
    imageAlt: 'Boosta Creators Janice and Dr. Solomon for Instagram',
    accentColor: '#E1306C',
    secondaryColor: '#7357FF',
    badgeBg: 'linear-gradient(135deg, rgba(225, 48, 108, 0.16), rgba(115, 87, 255, 0.14))',
    statBadge: { number: '85K+', label: 'Profile Visits' },
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    platform: 'YouTube',
    label: 'YouTube Growth',
    headline: 'GIVE YOUR NEXT UPLOAD MOMENTUM.',
    subtext: 'Build stronger signals and discoverability around your content.',
    ctaText: 'Boost YouTube',
    image: '/assets/mickey.png',
    imageAlt: 'Boosta Creator Mickey scaling YouTube views',
    accentColor: '#FF0000',
    secondaryColor: '#ED5FC9',
    badgeBg: 'linear-gradient(135deg, rgba(255, 0, 0, 0.16), rgba(237, 95, 201, 0.14))',
    statBadge: { number: '450K+', label: 'Watch Hours' },
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'x',
    platform: 'X',
    label: 'X Reach',
    headline: 'COMMAND THE CONVERSATION.',
    subtext: 'Instant reposts, bookmark bursts and verified viral impressions.',
    ctaText: 'Boost X',
    image: '/assets/solo.png',
    imageAlt: 'Boosta Creators on X',
    accentColor: '#182033',
    secondaryColor: '#7357FF',
    badgeBg: 'linear-gradient(135deg, rgba(24, 32, 51, 0.14), rgba(115, 87, 255, 0.14))',
    statBadge: { number: '320K+', label: 'Impressions' },
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'telegram',
    platform: 'Telegram',
    label: 'Telegram Community',
    headline: 'SCALE YOUR COMMUNITY FASTER.',
    subtext: 'Active real members and targeted post views deployed instantly.',
    ctaText: 'Boost Telegram',
    image: '/assets/mickey.png',
    imageAlt: 'Boosta Creator Mickey on Telegram',
    accentColor: '#2AABEE',
    secondaryColor: '#7357FF',
    badgeBg: 'linear-gradient(135deg, rgba(42, 171, 238, 0.16), rgba(115, 87, 255, 0.14))',
    statBadge: { number: '48K+', label: 'Subscribers' },
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    platform: 'Facebook',
    label: 'Facebook Presence',
    headline: 'EXPAND YOUR SOCIAL FOOTPRINT.',
    subtext: 'Build authority with engaged followers and broader page reach.',
    ctaText: 'Boost Facebook',
    image: '/assets/solo.png',
    imageAlt: 'Boosta Creators Janice and Solomon for Facebook',
    accentColor: '#1877F2',
    secondaryColor: '#ED5FC9',
    badgeBg: 'linear-gradient(135deg, rgba(24, 119, 242, 0.16), rgba(237, 95, 201, 0.14))',
    statBadge: { number: '180K+', label: 'Page Reach' },
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onBoost }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Touch gesture state
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);
  const pauseResumeTimeout = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = CAROUSEL_SLIDES.length;

  const goToSlide = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
    if (isTransitioning) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    setDirection(dir);
    setIsTransitioning(true);
    setActiveIndex(index);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 550);
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % totalSlides;
    goToSlide(nextIdx, 'next');
  }, [activeIndex, totalSlides, goToSlide]);

  const goToPrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prevIdx, 'prev');
  }, [activeIndex, totalSlides, goToSlide]);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, goToNext]);

  // Pause on user interaction & auto-resume after delay
  const handleInteractionPause = () => {
    setIsPaused(true);
    if (pauseResumeTimeout.current) {
      clearTimeout(pauseResumeTimeout.current);
    }
    pauseResumeTimeout.current = setTimeout(() => {
      setIsPaused(false);
    }, 4500);
  };

  // Touch / Swipe Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = true;
    handleInteractionPause();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Check horizontal intent
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 15) {
      // Horizontal motion dominant
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStartX.current;
    const diffY = endY - touchStartY.current;

    // Minimum swipe threshold: 38px
    if (Math.abs(diffX) > 38 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'ArrowLeft') {
      goToPrev();
    }
  };

  const currentSlide = CAROUSEL_SLIDES[activeIndex];
  const prevIndex = (activeIndex - 1 + totalSlides) % totalSlides;
  const nextIndex = (activeIndex + 1) % totalSlides;
  const prevSlide = CAROUSEL_SLIDES[prevIndex];
  const nextSlide = CAROUSEL_SLIDES[nextIndex];

  const handleCtaClick = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    if (onBoost) {
      onBoost(currentSlide.platform);
    }
  };

  // Format progress numbers e.g. 01 / 06
  const formattedCurrent = String(activeIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalSlides).padStart(2, '0');
  const progressPercent = ((activeIndex + 1) / totalSlides) * 100;

  return (
    <section 
      className="hero-carousel-wrapper"
      aria-label="Boosta Featured Growth Services"
      onMouseEnter={handleInteractionPause}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* 1. Curved Gap Carousel Stage */}
      <div className="carousel-stage">

        {/* LEFT / SIDE STACK: Previous and Next cards on desktop, preview cards on mobile */}
        <div className="carousel-side-column" aria-label="Neighboring Growth Services">
          {/* Top/Previous Side Card */}
          <button
            type="button"
            className="carousel-side-card card-prev glass-pill"
            onClick={() => {
              handleInteractionPause();
              goToPrev();
            }}
            aria-label={`Switch to ${prevSlide.label}`}
          >
            <span 
              className="side-card-icon-halo" 
              style={{ background: prevSlide.badgeBg, color: prevSlide.accentColor }}
            >
              {prevSlide.icon}
            </span>
            <div className="side-card-meta">
              <span className="side-card-tag">{prevSlide.platform}</span>
              <span className="side-card-title">{prevSlide.label}</span>
            </div>
            <span className="side-card-indicator" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="10 12 6 8 10 4" />
              </svg>
            </span>
          </button>

          {/* Bottom/Next Side Card */}
          <button
            type="button"
            className="carousel-side-card card-next glass-pill"
            onClick={() => {
              handleInteractionPause();
              goToNext();
            }}
            aria-label={`Switch to ${nextSlide.label}`}
          >
            <span 
              className="side-card-icon-halo" 
              style={{ background: nextSlide.badgeBg, color: nextSlide.accentColor }}
            >
              {nextSlide.icon}
            </span>
            <div className="side-card-meta">
              <span className="side-card-tag">{nextSlide.platform}</span>
              <span className="side-card-title">{nextSlide.label}</span>
            </div>
            <span className="side-card-indicator" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 4 10 8 6 12" />
              </svg>
            </span>
          </button>
        </div>

        {/* SIGNATURE CONCAVE CURVED GAP SEAM
            Physical organic concave bridge between side cards and active hero */}
        <div className="carousel-curved-seam" aria-hidden="true">
          <svg 
            viewBox="0 0 32 240" 
            preserveAspectRatio="none" 
            className="curved-seam-svg"
          >
            <path
              d="M0,0 C16,14 26,38 28,68 L28,172 C26,202 16,226 0,240 L32,240 L32,0 Z"
              fill="rgba(255, 255, 255, 0.88)"
            />
            <path
              d="M0,0 C16,14 26,38 28,68 L28,172 C26,202 16,226 0,240"
              fill="none"
              stroke="rgba(255, 255, 255, 0.98)"
              strokeWidth="1.8"
            />
          </svg>
        </div>

        {/* ACTIVE HERO CARD: 100% brightness, full color, dominant visual */}
        <div 
          className={`carousel-active-hero ${isTransitioning ? `animating-${direction}` : 'animating-settled'}`}
          style={{
            ['--slide-accent' as string]: currentSlide.accentColor,
            ['--slide-secondary' as string]: currentSlide.secondaryColor,
          }}
        >
          {/* Ambient Liquid Backlight Glow */}
          <div 
            className="hero-card-glow" 
            aria-hidden="true" 
            style={{
              background: `radial-gradient(circle at 68% 42%, ${currentSlide.secondaryColor}28, ${currentSlide.accentColor}18, transparent 70%)`
            }}
          />

          {/* Liquid Glass Edge Highlight */}
          <div className="hero-specular-edge" aria-hidden="true" />

          {/* Top Platform Badge Pill */}
          <div className="hero-platform-badge glass-pill">
            <span 
              className="badge-platform-icon" 
              style={{ color: currentSlide.accentColor }}
            >
              {currentSlide.icon}
            </span>
            <span className="badge-platform-name">{currentSlide.label}</span>
            <span className="badge-live-pulse" aria-hidden="true" />
          </div>

          {/* Main Visual Image (Mickey / Janice & Solomon) with Liquid Pebble backdrop */}
          <div className="hero-visual-stage">
            {/* Morphing Liquid Pebble Halo */}
            <div className="hero-visual-pebble doodle-animated" aria-hidden="true" />

            {/* Foreground Creator Cutout */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentSlide.id}
              src={currentSlide.image}
              alt={currentSlide.imageAlt}
              className="hero-creator-cutout"
              loading="eager"
            />

            {/* Frosted Feathered Lip covering bottom edge cleanly */}
            <div className="hero-visual-lip doodle-animated" aria-hidden="true" />

            {/* Subtle Stat Badge floating beside creator */}
            <div className="hero-floating-stat glass-pill" aria-hidden="true">
              <span className="stat-value" style={{ color: currentSlide.accentColor }}>
                {currentSlide.statBadge.number}
              </span>
              <span className="stat-label">{currentSlide.statBadge.label}</span>
            </div>
          </div>

          {/* Dynamic Content Block */}
          <div className="hero-copy-block">
            <h2 className="hero-display-headline">
              {currentSlide.headline}
            </h2>
            <p className="hero-supporting-text">
              {currentSlide.subtext}
            </p>

            {/* Signature Boosta CTA Pill Button */}
            <div className="hero-cta-wrap">
              <button
                type="button"
                className="carousel-cta-btn"
                onClick={handleCtaClick}
                aria-label={currentSlide.ctaText}
              >
                <span className="cta-sheen" aria-hidden="true" />
                <span className="cta-label">{currentSlide.ctaText}</span>
                <span className="cta-arrow" aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Premium Compact Progress Indicator (01 ━━━━━━━ 06) */}
      <div className="carousel-progress-bar" aria-label={`Slide ${activeIndex + 1} of ${totalSlides}`}>
        <span className="progress-num current-num">{formattedCurrent}</span>
        
        <div className="progress-track-wrapper">
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <span className="progress-num total-num">{formattedTotal}</span>
      </div>

    </section>
  );
};
