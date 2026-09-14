'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthenticatedAppBar } from '@/components/AuthenticatedAppBar';

// Growth Goal Definitions matching Home
export type BoostTypeId = 'followers' | 'likes' | 'views' | 'comments';

interface BoostTypeConfig {
  id: BoostTypeId;
  label: string;
  ratePerUnit: number; // in UGX
  presetQuantities: number[];
  minQuantity: number;
  maxQuantity: number;
  icon: React.ReactNode;
}

const BOOST_TYPES: Record<BoostTypeId, BoostTypeConfig> = {
  followers: {
    id: 'followers',
    label: 'Followers',
    ratePerUnit: 8.5,
    presetQuantities: [500, 1000, 2500, 5000, 10000],
    minQuantity: 100,
    maxQuantity: 250000,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  likes: {
    id: 'likes',
    label: 'Likes',
    ratePerUnit: 4.5,
    presetQuantities: [500, 1000, 2500, 5000, 10000],
    minQuantity: 100,
    maxQuantity: 500000,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  views: {
    id: 'views',
    label: 'Views',
    ratePerUnit: 1.2,
    presetQuantities: [1000, 5000, 10000, 50000, 100000],
    minQuantity: 500,
    maxQuantity: 1000000,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  comments: {
    id: 'comments',
    label: 'Comments',
    ratePerUnit: 45,
    presetQuantities: [50, 100, 250, 500, 1000],
    minQuantity: 20,
    maxQuantity: 25000,
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
};

// Supported Platforms with brand icons & URL regex validation
interface PlatformConfig {
  id: string;
  name: string;
  brandColor: string;
  blobTheme: string;
  urlPlaceholder: string;
  urlPattern: RegExp;
  exampleUrl: string;
  icon: React.ReactNode;
}

const PLATFORMS_CONFIG: PlatformConfig[] = [
  {
    id: 'TikTok',
    name: 'TikTok',
    brandColor: '#FE2C55',
    blobTheme: 'tiktok-blob',
    urlPlaceholder: 'https://www.tiktok.com/@username/video/...',
    urlPattern: /^(https?:\/\/)?(www\.|vm\.|vt\.)?tiktok\.com\/(@[\w.-]+(\/(video|photo)\/\d+)?|[\w.-]+)/i,
    exampleUrl: 'https://www.tiktok.com/@creator/video/1234567890',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87c-.31-.03-.62-.09-.92-.18z" />
      </svg>
    ),
  },
  {
    id: 'Instagram',
    name: 'Instagram',
    brandColor: '#E1306C',
    blobTheme: 'instagram-blob',
    urlPlaceholder: 'https://www.instagram.com/p/... or @username',
    urlPattern: /^(https?:\/\/)?(www\.)?instagram\.com\/([a-zA-Z0-9_.]+(\/(p|reel|tv)\/[a-zA-Z0-9_-]+)?)/i,
    exampleUrl: 'https://www.instagram.com/creator',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: 'YouTube',
    name: 'YouTube',
    brandColor: '#FF0000',
    blobTheme: 'youtube-blob',
    urlPlaceholder: 'https://www.youtube.com/watch?v=... or @channel',
    urlPattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|@|c\/|channel\/)[\w.-]+|youtu\.be\/[\w.-]+)/i,
    exampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'Facebook',
    name: 'Facebook',
    brandColor: '#1877F2',
    blobTheme: 'facebook-blob',
    urlPlaceholder: 'https://www.facebook.com/page or post',
    urlPattern: /^(https?:\/\/)?(www\.|m\.)?(facebook\.com|fb\.watch)\/[\w.-]+/i,
    exampleUrl: 'https://www.facebook.com/creatorpage',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'X',
    name: 'X',
    brandColor: '#182033',
    blobTheme: 'x-blob',
    urlPlaceholder: 'https://x.com/profile or status/...',
    urlPattern: /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\/[\w.-]+/i,
    exampleUrl: 'https://x.com/creator/status/123456789',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

// Marquee platform icons (Display-only continuous horizontal scrolling)
const MARQUEE_PLATFORMS = [
  ...PLATFORMS_CONFIG,
  {
    id: 'Telegram',
    name: 'Telegram',
    brandColor: '#0088cc',
    blobTheme: 'telegram-blob',
    urlPlaceholder: 'https://t.me/...',
    urlPattern: /^(https?:\/\/)?t\.me\/[\w.-]+/i,
    exampleUrl: 'https://t.me/channel',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

interface UserSession {
  email: string;
  name?: string;
  balance?: string | number;
}

function BoostSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // User state
  const [user, setUser] = useState<UserSession | null>(null);
  const [balance, setBalance] = useState<number>(48500);

  // Progressive Order State
  const initialTypeParam = (searchParams.get('type') as BoostTypeId) || 'followers';
  const initialPlatformParam = searchParams.get('platform') || null;

  const [selectedType, setSelectedType] = useState<BoostTypeId>(
    BOOST_TYPES[initialTypeParam] ? initialTypeParam : 'followers'
  );
  const [isEditingType, setIsEditingType] = useState<boolean>(false);

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(initialPlatformParam);
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [customQuantity, setCustomQuantity] = useState<string>('');
  const [isCustomQtyActive, setIsCustomQtyActive] = useState<boolean>(false);

  const [destinationUrl, setDestinationUrl] = useState<string>('');
  const [isLinkValid, setIsLinkValid] = useState<boolean>(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  // Payment & Order submission state
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<{ id: string; amount: number; platform: string; type: string } | null>(null);

  // Section references for intelligent auto-scroll
  const platformRef = useRef<HTMLDivElement>(null);
  const quantityRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  // Load user session and balance on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('boosta_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          if (parsed.balance !== undefined && parsed.balance !== null) {
            const num = Number(parsed.balance);
            if (!isNaN(num)) setBalance(num);
          }
        } catch {
          setUser({ email: 'creator@boosta.app', name: 'Creator' });
        }
      } else {
        setUser({ email: 'creator@boosta.app', name: 'Boosta Creator' });
      }
    }
  }, []);

  // Update selectedType if query parameter changes
  useEffect(() => {
    const typeParam = searchParams.get('type') as BoostTypeId;
    if (typeParam && BOOST_TYPES[typeParam]) {
      setSelectedType(typeParam);
    }
    const platParam = searchParams.get('platform');
    if (platParam) {
      setSelectedPlatform(platParam);
    }
  }, [searchParams]);

  // Current config
  const currentBoostConfig = BOOST_TYPES[selectedType] || BOOST_TYPES.followers;
  const currentPlatformConfig = PLATFORMS_CONFIG.find((p) => p.id === selectedPlatform);

  // Active quantity resolution
  const activeQuantity = isCustomQtyActive
    ? Number(customQuantity) || 0
    : selectedQuantity || 0;

  // Real price calculation
  const calculatedPrice = Math.round(activeQuantity * currentBoostConfig.ratePerUnit);

  // URL Validation logic
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setDestinationUrl(val);

    if (!val) {
      setIsLinkValid(false);
      setLinkError(null);
      return;
    }

    if (!currentPlatformConfig) {
      setIsLinkValid(false);
      return;
    }

    // Add protocol if missing for regex test
    const testUrl = val.startsWith('http') ? val : `https://${val}`;

    if (currentPlatformConfig.urlPattern.test(testUrl)) {
      setIsLinkValid(true);
      setLinkError(null);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
      setTimeout(() => {
        paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 200);
    } else {
      setIsLinkValid(false);
      setLinkError(`Enter a valid ${currentPlatformConfig.name} link (e.g. ${currentPlatformConfig.exampleUrl})`);
    }
  };

  // Handlers for selection progression
  const handleSelectType = (typeId: BoostTypeId) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setSelectedType(typeId);
    setIsEditingType(false);
    setSelectedQuantity(null);
    setCustomQuantity('');
    setIsCustomQtyActive(false);
  };

  const handleSelectPlatform = (platformId: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
    setSelectedPlatform(platformId);
    setIsLinkValid(false);
    setDestinationUrl('');
    setLinkError(null);

    // Auto scroll down to Quantity question
    setTimeout(() => {
      quantityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 280);
  };

  const handleSelectPresetQuantity = (qty: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
    setSelectedQuantity(qty);
    setIsCustomQtyActive(false);
    setCustomQuantity('');

    // Auto scroll down to Destination link question
    setTimeout(() => {
      destinationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 280);
  };

  const handleCustomQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomQuantity(val);
    setIsCustomQtyActive(true);
    setSelectedQuantity(null);

    const num = Number(val);
    if (num >= currentBoostConfig.minQuantity && num <= currentBoostConfig.maxQuantity) {
      setTimeout(() => {
        destinationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 400);
    }
  };

  // Payment Execution
  const handlePayOrder = () => {
    if (!isLinkValid || activeQuantity <= 0 || !selectedPlatform) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(18);
    }

    // Strict balance check against calculated price
    if (balance < calculatedPrice) {
      setToastMessage('Not enough balance. Top up your Boosta balance to continue.');
      setShowTopUpModal(true);
      return;
    }

    // Balance is sufficient -> Proceed with order creation
    setIsSubmittingOrder(true);
    setToastMessage(null);

    setTimeout(() => {
      // Deduct balance locally & update storage atomically
      const updatedBalance = balance - calculatedPrice;
      setBalance(updatedBalance);

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('boosta_user');
        const parsed = stored ? JSON.parse(stored) : {};
        parsed.balance = updatedBalance;
        localStorage.setItem('boosta_user', JSON.stringify(parsed));
      }

      const orderId = `BST-${Math.floor(100000 + Math.random() * 900000)}`;
      setCreatedOrder({
        id: orderId,
        amount: calculatedPrice,
        platform: selectedPlatform,
        type: currentBoostConfig.label,
      });
      setIsSubmittingOrder(false);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([20, 60, 20]);
      }
    }, 1100);
  };

  const handleQuickTopUp = (amount: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
    const newBal = balance + amount;
    setBalance(newBal);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('boosta_user');
      const parsed = stored ? JSON.parse(stored) : {};
      parsed.balance = newBal;
      localStorage.setItem('boosta_user', JSON.stringify(parsed));
    }
    setShowTopUpModal(false);
    setToastMessage(`Added UGX ${amount.toLocaleString()}! Balance updated to UGX ${newBal.toLocaleString()}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('boosta_user');
    }
    router.push('/');
  };

  return (
    <>
      {/* Ambient Liquid Canvas */}
      <div className="liquid-canvas" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <main className="app-container boost-setup-container">
        {/* 1. TOP APP BAR */}
        <AuthenticatedAppBar 
          user={user} 
          onLogout={handleLogout} 
          onNavigateService={(p) => handleSelectPlatform(p)} 
        />

        {/* 2. SUPPORTED PLATFORM ICON STRIP (PURE DISPLAY / AUTO-SCROLLING MARQUEE) */}
        <section className="platform-marquee-strip" aria-hidden="true">
          <div className="platform-marquee-track">
            {/* Render items twice to create an infinite seamless loop */}
            {[...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS].map((item, idx) => (
              <div key={`${item.id}-${idx}`} className={`marquee-blob-tile ${item.blobTheme}`}>
                <span className="blob-shadow-underlayer" />
                <span className="blob-satellite-droplet droplet-1" />
                <span className="blob-satellite-droplet droplet-2" />
                <span className="blob-main-layer">
                  <span className="blob-brand-icon">
                    {item.icon}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Toast Feedback Notification if present */}
        {toastMessage && (
          <div className="auth-home-toast-pill" role="status">
            <span className="toast-spark" aria-hidden="true">⚡</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 3. PROGRESSIVE CONVERSATIONAL BOOST BUILDER */}
        <div className="conversational-flow" role="region" aria-label="Boost Order Setup">

          {/* QUESTION 1: What do you want to boost? */}
          <section className="conversation-step step-unveiled" aria-labelledby="q1-title">
            <div className="step-question-header">
              <span className="step-number" aria-hidden="true">1</span>
              <h2 id="q1-title" className="step-question-text">What do you want to boost?</h2>
            </div>

            {/* Answer 1: Confirmed Selection Pill */}
            {!isEditingType ? (
              <div className="confirmed-answer-row">
                <div className="confirmed-answer-pill">
                  <span className="confirmed-pill-icon">{currentBoostConfig.icon}</span>
                  <span className="confirmed-pill-label">{currentBoostConfig.label}</span>
                  <span className="confirmed-pill-check" aria-label="Confirmed">✓</span>
                </div>
                <button
                  type="button"
                  className="answer-change-btn"
                  onClick={() => setIsEditingType(true)}
                  aria-label="Change boost outcome"
                >
                  Change
                </button>
              </div>
            ) : (
              /* Inline Outcome Switcher if user wants to change */
              <div className="inline-outcome-selector" role="radiogroup">
                {(Object.keys(BOOST_TYPES) as BoostTypeId[]).map((typeKey) => {
                  const cfg = BOOST_TYPES[typeKey];
                  const isActive = selectedType === typeKey;
                  return (
                    <button
                      key={typeKey}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      className={`inline-outcome-btn ${isActive ? 'btn-active' : ''}`}
                      onClick={() => handleSelectType(typeKey)}
                    >
                      <span className="outcome-btn-icon">{cfg.icon}</span>
                      <span className="outcome-btn-label">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* QUESTION 2: Which platform do you want to boost? */}
          <section ref={platformRef} className="conversation-step step-unveiled" aria-labelledby="q2-title">
            <div className="step-question-header">
              <span className="step-number" aria-hidden="true">2</span>
              <h2 id="q2-title" className="step-question-text">Which platform do you want to boost?</h2>
            </div>

            {/* Clickable Platform Selector */}
            <div className="boost-platform-selector-row" role="radiogroup" aria-label="Choose social media platform">
              {PLATFORMS_CONFIG.map((plat) => {
                const isSelected = selectedPlatform === plat.id;
                return (
                  <button
                    key={plat.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`boost-platform-btn ${isSelected ? 'plat-btn-active' : ''}`}
                    onClick={() => handleSelectPlatform(plat.id)}
                    style={{
                      '--plat-color': plat.brandColor,
                    } as React.CSSProperties}
                  >
                    <span className="plat-btn-icon" style={{ color: plat.brandColor }}>
                      {plat.icon}
                    </span>
                    <span className="plat-btn-name">{plat.name}</span>
                    {isSelected && <span className="plat-btn-check" aria-hidden="true">✓</span>}
                  </button>
                );
              })}
            </div>
          </section>

          {/* QUESTION 3: How many would you like? (Progressive Step 3) */}
          {selectedPlatform && (
            <section ref={quantityRef} className="conversation-step step-reveal-anim" aria-labelledby="q3-title">
              <div className="step-question-header">
                <span className="step-number" aria-hidden="true">3</span>
                <h2 id="q3-title" className="step-question-text">How many would you like?</h2>
              </div>

              {/* Preset Quantities Grid */}
              <div className="quantity-presets-grid" role="group" aria-label="Preset quantities">
                {currentBoostConfig.presetQuantities.map((qty) => {
                  const isSelected = !isCustomQtyActive && selectedQuantity === qty;
                  return (
                    <button
                      key={qty}
                      type="button"
                      className={`quantity-preset-pill ${isSelected ? 'qty-active' : ''}`}
                      onClick={() => handleSelectPresetQuantity(qty)}
                    >
                      <span>{qty.toLocaleString()}</span>
                      {isSelected && <span className="qty-check" aria-hidden="true">✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Custom Quantity Input */}
              <div className="custom-quantity-surface">
                <label htmlFor="custom-qty-input" className="custom-qty-label">
                  Custom amount
                </label>
                <div className="custom-qty-input-wrap">
                  <input
                    id="custom-qty-input"
                    type="number"
                    inputMode="numeric"
                    min={currentBoostConfig.minQuantity}
                    max={currentBoostConfig.maxQuantity}
                    step="10"
                    placeholder={`Min ${currentBoostConfig.minQuantity.toLocaleString()} — Max ${currentBoostConfig.maxQuantity.toLocaleString()}`}
                    value={customQuantity}
                    onChange={handleCustomQuantityChange}
                    className="custom-qty-input"
                  />
                  {isCustomQtyActive && Number(customQuantity) >= currentBoostConfig.minQuantity && (
                    <span className="custom-qty-valid" aria-label="Valid custom quantity">✓</span>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* QUESTION 4: Where should we send them? (Progressive Step 4) */}
          {selectedPlatform && activeQuantity > 0 && (
            <section ref={destinationRef} className="conversation-step step-reveal-anim" aria-labelledby="q4-title">
              <div className="step-question-header">
                <span className="step-number" aria-hidden="true">4</span>
                <h2 id="q4-title" className="step-question-text">Where should we send them?</h2>
              </div>

              <div className="destination-input-surface">
                <div className="destination-input-row">
                  <span className="destination-input-icon" aria-hidden="true">
                    🔗
                  </span>
                  <input
                    type="url"
                    inputMode="url"
                    placeholder={currentPlatformConfig?.urlPlaceholder || 'https://...'}
                    value={destinationUrl}
                    onChange={handleUrlChange}
                    className={`destination-url-input ${isLinkValid ? 'input-valid' : linkError ? 'input-error' : ''}`}
                    aria-label="Social media profile or post link"
                    aria-invalid={!isLinkValid && linkError !== null}
                  />
                  {isLinkValid && (
                    <span className="destination-verified-badge" role="status">
                      <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {linkError && (
                  <p className="destination-error-hint" role="alert">
                    {linkError}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* QUESTION 5: Total & Payment (Progressive Step 5) */}
          {selectedPlatform && activeQuantity > 0 && isLinkValid && (
            <section ref={paymentRef} className="conversation-step step-reveal-anim payment-section" aria-label="Order Total and Pay">
              {/* Order summary pill */}
              <div className="order-summary-spec-pill">
                <span className="spec-item">
                  <strong>{activeQuantity.toLocaleString()}</strong> {selectedPlatform} {currentBoostConfig.label}
                </span>
                <span className="spec-divider">•</span>
                <span className="spec-rate">UGX {currentBoostConfig.ratePerUnit}/unit</span>
              </div>

              {/* Prominent Price Total */}
              <div className="boost-total-row">
                <div className="total-label-col">
                  <span className="total-eyebrow">Total</span>
                  <span className="total-currency">UGX</span>
                </div>
                <div className="total-figure-amount">
                  {calculatedPrice.toLocaleString()}
                </div>
              </div>

              {/* Balance preview info under total */}
              <div className="order-balance-indicator">
                <span className="user-balance-caption">Your balance:</span>
                <span className={`user-balance-value ${balance < calculatedPrice ? 'balance-insufficient' : ''}`}>
                  UGX {balance.toLocaleString()}
                </span>
                {balance < calculatedPrice && (
                  <button
                    type="button"
                    className="quick-topup-inline-btn"
                    onClick={() => setShowTopUpModal(true)}
                  >
                    + Top up
                  </button>
                )}
              </div>

              {/* Pay Button */}
              <div className="pay-action-wrapper">
                <button
                  type="button"
                  disabled={isSubmittingOrder}
                  onClick={handlePayOrder}
                  className="boost-pay-button"
                  aria-label={`Pay UGX ${calculatedPrice.toLocaleString()} for ${activeQuantity.toLocaleString()} ${selectedPlatform} ${currentBoostConfig.label}`}
                >
                  <span className="pay-btn-sheen" aria-hidden="true" />
                  <span className="pay-btn-text">
                    {isSubmittingOrder ? 'Processing...' : 'Pay'}
                  </span>
                  <span className="pay-btn-arrow" aria-hidden="true">
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 10h12M11 5l5 5-5 5" />
                    </svg>
                  </span>
                </button>
              </div>
            </section>
          )}

        </div>

        {/* TOP UP MODAL (When Balance < Price or User Requests Top Up) */}
        {showTopUpModal && (
          <div className="topup-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="topup-modal-title">
            <div className="topup-modal-card">
              <div className="topup-header">
                <h3 id="topup-modal-title" className="topup-title">Top up Boosta Balance</h3>
                <button
                  type="button"
                  className="topup-close-btn"
                  onClick={() => setShowTopUpModal(false)}
                  aria-label="Close deposit options"
                >
                  ✕
                </button>
              </div>
              <p className="topup-subtitle">
                Current balance: <strong>UGX {balance.toLocaleString()}</strong>. Order requires <strong>UGX {calculatedPrice.toLocaleString()}</strong>.
              </p>
              <div className="topup-quick-grid">
                {[10000, 25000, 50000, 100000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className="topup-amount-btn"
                    onClick={() => handleQuickTopUp(amount)}
                  >
                    + UGX {amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDER SUCCESS MODAL */}
        {createdOrder && (
          <div className="order-success-overlay" role="dialog" aria-modal="true" aria-labelledby="success-title">
            <div className="order-success-card">
              <div className="success-icon-badge" aria-hidden="true">
                ✓
              </div>
              <h2 id="success-title" className="success-title">Boost Launched!</h2>
              <p className="success-meta">
                Order <strong>#{createdOrder.id}</strong> has been successfully dispatched for delivery.
              </p>
              <div className="success-details-pill">
                <span>{createdOrder.type} on {createdOrder.platform}</span>
                <span>•</span>
                <span>UGX {createdOrder.amount.toLocaleString()}</span>
              </div>
              <div className="success-actions-row">
                <button
                  type="button"
                  className="success-cta-home"
                  onClick={() => router.push('/home')}
                >
                  Return to Home
                </button>
                <button
                  type="button"
                  className="success-cta-again"
                  onClick={() => {
                    setCreatedOrder(null);
                    setSelectedQuantity(null);
                    setDestinationUrl('');
                    setIsLinkValid(false);
                  }}
                >
                  Boost Another
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subtle iOS Home Indicator */}
        <div className="ios-home-indicator" aria-hidden="true" />
      </main>

      {/* 5. VIEWPORT-LEVEL GRADIENT WAVE DECORATION (Identical to Auth/OTP Screen) */}
      <div className="auth-bottom-wave" aria-hidden="true">
        <svg
          viewBox="0 0 1000 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="auth-wave-svg"
          role="presentation"
        >
          <defs>
            <linearGradient id="boostaWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7357FF" stopOpacity="0.78" />
              <stop offset="46%" stopColor="#ED5FC9" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#FF9B63" stopOpacity="0.68" />
            </linearGradient>
            <linearGradient id="boostaWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A389FF" stopOpacity="0.48" />
              <stop offset="52%" stopColor="#F48FD8" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#FFB89A" stopOpacity="0.40" />
            </linearGradient>
          </defs>
          {/* Back wave */}
          <path
            d="M0,72 C150,32 300,96 500,58 C700,22 850,88 1000,50 L1000,120 L0,120 Z"
            fill="url(#boostaWaveGrad2)"
          />
          {/* Front wave */}
          <path
            d="M0,88 C180,52 360,108 540,76 C720,44 880,96 1000,68 L1000,120 L0,120 Z"
            fill="url(#boostaWaveGrad)"
          />
        </svg>
        <span className="auth-copyright">© Boosta™ 2026</span>
      </div>
    </>
  );
}

// Fallback skeleton for Suspense boundary
function BoostSetupSkeleton() {
  return (
    <main className="app-container boost-setup-container">
      <div className="authenticated-appbar-wrapper">
        <div className="authenticated-appbar glass-pill" style={{ height: 48 }} />
      </div>
      <div style={{ marginTop: 24, padding: 16 }}>
        <div className="balance-skeleton" style={{ width: 180, height: 28, marginBottom: 16 }} />
        <div className="balance-skeleton" style={{ width: '100%', height: 64, borderRadius: 16 }} />
      </div>
    </main>
  );
}

export default function BoostSetupPage() {
  return (
    <Suspense fallback={<BoostSetupSkeleton />}>
      <BoostSetupContent />
    </Suspense>
  );
}
