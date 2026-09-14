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
  objectPosition?: string;
  cardObjectPosition?: string;
}

const SLIDES: CarouselSlide[] = [
  {
    id: 'tiktok',
    platform: 'TikTok',
    title: 'TikTok',
    subtitle: 'Followers · Likes · Views',
    headline: 'GROW YOUR TIKTOK PRESENCE.',
    description: 'Followers · Likes · Views',
    ctaText: 'Boost TikTok',
    cardImage: '/assets/praise.png',
    detailImage: '/assets/praise.png',
    accentColor: '#FE2C55',
    secondaryColor: '#00F2FE',
    badgeBg: 'linear-gradient(135deg, rgba(254, 44, 85, 0.2), rgba(0, 242, 254, 0.15))',
    statLabel: 'Viral Velocity',
    objectPosition: 'center right',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87c-.31-.03-.62-.09-.92-.18z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    title: 'Instagram',
    subtitle: 'Followers · Likes · Views',
    headline: 'BUILD A STRONGER INSTAGRAM PRESENCE.',
    description: 'Followers · Likes · Views · Comments',
    ctaText: 'Boost Instagram',
    cardImage: '/assets/usher.png',
    detailImage: '/assets/usher.png',
    accentColor: '#E1306C',
    secondaryColor: '#7357FF',
    badgeBg: 'linear-gradient(135deg, rgba(225, 48, 108, 0.2), rgba(115, 87, 255, 0.15))',
    statLabel: 'Creator Reach',
    objectPosition: 'center right',
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
    title: 'YouTube',
    subtitle: 'Views · Likes · Subscribers',
    headline: 'GET YOUR VIDEOS SEEN.',
    description: 'Views · Likes · Subscribers',
    ctaText: 'Boost YouTube',
    cardImage: '/assets/chicken.png',
    detailImage: '/assets/chicken.png',
    accentColor: '#FF0000',
    secondaryColor: '#ED5FC9',
    badgeBg: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(237, 95, 201, 0.15))',
    statLabel: 'Watch Time',
    objectPosition: 'center right',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    platform: 'Facebook',
    title: 'Facebook',
    subtitle: 'Followers · Likes · Shares',
    headline: 'EXPAND YOUR FACEBOOK REACH.',
    description: 'Followers · Likes · Shares',
    ctaText: 'Boost Facebook',
    cardImage: '/assets/solo.png',
    detailImage: '/assets/solo.png',
    accentColor: '#1877F2',
    secondaryColor: '#42A5F5',
    badgeBg: 'linear-gradient(135deg, rgba(24, 119, 242, 0.2), rgba(66, 165, 245, 0.15))',
    statLabel: 'Page Growth',
    objectPosition: 'center right',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'x',
    platform: 'X',
    title: 'X',
    subtitle: 'Reposts · Likes · Impressions',
    headline: 'COMMAND THE CONVERSATION.',
    description: 'Reposts · Likes · Impressions',
    ctaText: 'Boost X',
    cardImage: '/assets/cb.png',
    detailImage: '/assets/cb.png',
    accentColor: '#182033',
    secondaryColor: '#7357FF',
    badgeBg: 'linear-gradient(135deg, rgba(24, 32, 51, 0.18), rgba(115, 87, 255, 0.15))',
    statLabel: 'Impression Velocity',
    objectPosition: 'center right',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

// Continuous ring track items for seamless circular sliding physics
const TRACK_ITEMS = [
  ...SLIDES.map((s, i) => ({ ...s, trackKey: `${s.id}-a`, slideIndex: i })),
  ...SLIDES.map((s, i) => ({ ...s, trackKey: `${s.id}-b`, slideIndex: i })),
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onBoost }) => {
  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTextAnimating, setIsTextAnimating] = useState<boolean>(false);

  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const isInteracting = useRef<boolean>(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = SLIDES.length;
  const totalTrackItems = TRACK_ITEMS.length;

  const currentSlideIndex = trackIndex % totalSlides;
  const currentSlide = SLIDES[currentSlideIndex];
  const previousSlide = SLIDES[prevSlideIndex];

  const previousTrackIndex = useRef<number>(0);

  useEffect(() => {
    previousTrackIndex.current = trackIndex;
  }, [trackIndex]);

  const goToIndex = useCallback((newTrackIndex: number) => {
    if (newTrackIndex === trackIndex) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    setPrevSlideIndex(trackIndex % totalSlides);
    setIsTextAnimating(true);
    setTrackIndex(newTrackIndex);

    // Staggered text fade-in like reference
    setTimeout(() => {
      setIsTextAnimating(false);
    }, 600);
  }, [trackIndex, totalSlides]);

  const goToNext = useCallback(() => {
    const nextIdx = (trackIndex + 1) % totalTrackItems;
    goToIndex(nextIdx);
  }, [trackIndex, totalTrackItems, goToIndex]);

  const goToPrev = useCallback(() => {
    const prevIdx = (trackIndex - 1 + totalTrackItems) % totalTrackItems;
    goToIndex(prevIdx);
  }, [trackIndex, totalTrackItems, goToIndex]);

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

  // Helper to calculate wrapping circular card state and detect offstage wrap
  const getCardInfo = (index: number) => {
    let diff = (index - trackIndex + totalTrackItems) % totalTrackItems;
    if (diff > totalTrackItems / 2) {
      diff -= totalTrackItems;
    }

    let stateClass = '';
    if (diff === 0) stateClass = 'card-active active';
    else if (diff === -1) stateClass = 'card-prev prev';
    else if (diff === 1) stateClass = 'card-next next';
    else if (diff < -1) stateClass = 'card-hidden-top hidden-above';
    else stateClass = 'card-hidden-bottom hidden-below';

    let prevDiff = (index - previousTrackIndex.current + totalTrackItems) % totalTrackItems;
    if (prevDiff > totalTrackItems / 2) {
      prevDiff -= totalTrackItems;
    }

    // Only suppress transition if the card is leaping across the circular seam while offstage
    const isWrapping = Math.abs(diff - prevDiff) > 2;

    return {
      stateClass,
      isCurrent: diff === 0,
      isClickable: diff === -1 || diff === 1,
      isWrapping,
    };
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
          {TRACK_ITEMS.map((item, index) => {
            const cardInfo = getCardInfo(index);
            const isCurrent = cardInfo.isCurrent;
            const isClickable = cardInfo.isClickable;

            return (
              <div
                key={item.trackKey}
                className={`vertical-carousel-card card ${cardInfo.stateClass}`}
                onClick={() => {
                  if (isClickable) goToIndex(index);
                }}
                style={{
                  ['--card-accent' as string]: item.accentColor,
                  ['--card-secondary' as string]: item.secondaryColor,
                  transition: cardInfo.isWrapping ? 'none' : undefined,
                }}
                role="button"
                tabIndex={isClickable || isCurrent ? 0 : -1}
                aria-label={`${item.title} - ${item.subtitle}`}
                aria-current={isCurrent ? 'true' : undefined}
              >
                {/* Background image & gradient overlay */}
                <div 
                  className="card-bg-layer" 
                  style={{
                    background: `linear-gradient(135deg, ${item.secondaryColor}15 0%, ${item.accentColor}18 100%)`
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.cardImage}
                    alt={item.title}
                    className="card-asset-img"
                    style={{ objectPosition: item.cardObjectPosition || 'bottom right' }}
                    loading="lazy"
                  />
                  <div className="card-gradient-overlay" />
                </div>

                {/* Active white liquid-glass surface with smooth 0.6s crossfade */}
                <div className="card-active-surface" aria-hidden="true" />

                {/* Platform Icon Capsule + Card Title/Subtitle Layout */}
                <div className="card-content-layout">
                  <div 
                    className="card-icon-capsule" 
                    style={{ color: item.accentColor }}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                  <div className="card-label-group">
                    <span className="card-platform-tag" style={{ color: item.accentColor }}>
                      {item.platform}
                    </span>
                    <span className="card-title-text">{item.title}</span>
                    <span className="card-subtitle-text">{item.subtitle}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          PANEL B: RIGHT EXPANDED ACTIVE DETAIL PANEL
          Features CONVEX curved left edge with matching radius,
          pulled toward left panel creating the visible background gap!
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
              background: `radial-gradient(circle at 70% 45%, ${previousSlide.secondaryColor}22 0%, ${previousSlide.accentColor}16 50%, #F8F9FD 100%)`
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previousSlide.detailImage}
              alt=""
              className="detail-creator-img"
              style={{ objectPosition: previousSlide.objectPosition || 'center right' }}
            />
          </div>

          {/* Current active image (fading in) */}
          <div 
            key={currentSlide.id}
            className="detail-bg-layer current-layer active-enter"
            style={{
              background: `radial-gradient(circle at 70% 45%, ${currentSlide.secondaryColor}25 0%, ${currentSlide.accentColor}18 50%, #F8F9FD 100%)`
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSlide.detailImage}
              alt={currentSlide.title}
              className="detail-creator-img"
              style={{ objectPosition: currentSlide.objectPosition || 'center right' }}
            />
          </div>

          {/* Dark left-to-right gradient overlay for text readability */}
          <div className="detail-gradient-overlay" />
        </div>

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

        {/* Progress Dots Indicator (01 / 04) */}
        <div className="detail-progress-indicator" aria-hidden="true">
          <span className="progress-current">0{currentSlideIndex + 1}</span>
          <div className="progress-mini-bar">
            <div 
              className="progress-mini-fill" 
              style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
            />
          </div>
          <span className="progress-total">0{totalSlides}</span>
        </div>
      </div>
    </div>
  );
};
