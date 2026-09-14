'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedAppBar } from '@/components/AuthenticatedAppBar';
import { HeroCarousel } from '@/components/HeroCarousel';

interface UserSession {
  email: string;
  name?: string;
  balance?: string | number;
}

export type GrowthGoalId = 'followers' | 'likes' | 'views' | 'comments';

export interface GrowthGoal {
  id: GrowthGoalId;
  label: string;
  description: string;
  accentClass: string;
  icon: React.ReactNode;
}

export interface PlatformOption {
  id: string;
  name: string;
  brandColor: string;
  icon: React.ReactNode;
}

const GROWTH_GOALS: GrowthGoal[] = [
  {
    id: 'followers',
    label: 'Followers',
    description: 'Grow your audience & active community',
    accentClass: 'goal-followers',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'likes',
    label: 'Likes',
    description: 'Boost post appreciation & social proof',
    accentClass: 'goal-likes',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'views',
    label: 'Views',
    description: 'Maximize algorithmic impression velocity',
    accentClass: 'goal-views',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'comments',
    label: 'Comments',
    description: 'Spark conversations & engagement loops',
    accentClass: 'goal-comments',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
];

const PLATFORMS: PlatformOption[] = [
  {
    id: 'TikTok',
    name: 'TikTok',
    brandColor: '#FE2C55',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87c-.31-.03-.62-.09-.92-.18z" />
      </svg>
    ),
  },
  {
    id: 'Instagram',
    name: 'Instagram',
    brandColor: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'Facebook',
    name: 'Facebook',
    brandColor: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'X',
    name: 'X',
    brandColor: '#182033',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function AuthenticatedHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [balance, setBalance] = useState<number>(48500);
  const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(true);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);

  // Core Experience state: What do you want to boost?
  // Initializes to null so NO platform strip is visible on page load!
  const [selectedGoal, setSelectedGoal] = useState<GrowthGoalId | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handleSelectGoal = (goalId: GrowthGoalId) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setSelectedGoal(goalId);
    setSelectedPlatform(null);
  };

  const handleSelectPlatform = (platformId: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([10, 25, 15]);
    }
    setSelectedPlatform(platformId);
    const goalObj = GROWTH_GOALS.find(g => g.id === selectedGoal);
    const goalLabel = goalObj ? goalObj.label : 'growth';
    setActiveFeedback(`Launching ${platformId} ${goalLabel} booster...`);
    setTimeout(() => {
      setActiveFeedback(null);
      handleBoost(platformId);
    }, 1200);
  };

  const handleAddFunds = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setActiveFeedback('Opening quick deposit options...');
    setTimeout(() => {
      setActiveFeedback(null);
    }, 2200);
  };

  // Retrieve authenticated session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('boosta_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          if (parsed.balance !== undefined && parsed.balance !== null) {
            const num = Number(parsed.balance);
            if (!isNaN(num)) {
              setBalance(num);
            }
          }
        } catch {
          setUser({ email: 'creator@boosta.app', name: 'Creator' });
        }
      } else {
        // Fallback demo user session so the screen is directly viewable if opened
        setUser({ email: 'creator@boosta.app', name: 'Boosta Creator' });
      }
      setIsBalanceLoading(false);
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
    setActiveFeedback(`Launching ${platform} viral booster...`);
    setTimeout(() => {
      setActiveFeedback(null);
    }, 3200);
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

        {/* 2. Signature Curved Gap Hero Carousel */}
        <section className="auth-home-hero-section">
          <HeroCarousel onBoost={handleBoost} />
        </section>

        {/* 3. Account Balance Surface: Compact, confident, non-intrusive */}
        <section className="account-balance-surface" aria-label="Boosta account balance">
          <div className="balance-info-col">
            <span className="balance-eyebrow">Your Boosta balance</span>
            <div className="balance-amount-row">
              {isBalanceLoading ? (
                <span className="balance-skeleton" aria-label="Loading balance..." />
              ) : (
                <span className="balance-amount">UGX {balance.toLocaleString()}</span>
              )}
            </div>
            <span className="balance-caption">Available to boost</span>
          </div>
          <button 
            type="button" 
            className="balance-add-funds-btn"
            onClick={handleAddFunds}
            aria-label="Add funds to Boosta balance"
          >
            <span className="add-funds-plus" aria-hidden="true">+</span>
            <span>Add funds</span>
          </button>
        </section>

        {/* 4. Core Intent Experience: What do you want to boost? */}
        <section className="growth-discovery-section" aria-label="What do you want to boost?">
          <div className="growth-discovery-header">
            <h2 className="growth-discovery-title">What do you want to boost?</h2>
          </div>

          {/* 2x2 Unified Cohesive Interactive Surface */}
          <div className="growth-goals-surface" role="radiogroup" aria-label="Social media goals">
            {GROWTH_GOALS.map((goal) => {
              const isSelected = selectedGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`growth-goal-tile ${goal.accentClass} ${isSelected ? 'goal-tile-active' : ''}`}
                  onClick={() => handleSelectGoal(goal.id)}
                >
                  <div className="goal-tile-icon-wrap" aria-hidden="true">
                    {goal.icon}
                  </div>
                  <div className="goal-tile-info">
                    <span className="goal-tile-label">{goal.label}</span>
                  </div>
                  <span className={`goal-selection-indicator ${isSelected ? 'indicator-active' : ''}`} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          {/* In-Place Progressive Disclosure: Platform Selection (only unfolds if an outcome is selected) */}
          {selectedGoal && (
            <div className="progressive-platform-panel" role="region" aria-label="Platform selection">
              <div className="progressive-panel-header">
                <span className="progressive-prompt-label">Where?</span>
                <span className="progressive-context-tag">
                  for {GROWTH_GOALS.find(g => g.id === selectedGoal)?.label}
                </span>
              </div>

              <div className="platform-pills-row" role="group" aria-label="Select social media platform">
                {PLATFORMS.map((platform) => {
                  const isPlatformActive = selectedPlatform === platform.id;
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      className={`platform-select-pill ${isPlatformActive ? 'pill-active' : ''}`}
                      onClick={() => handleSelectPlatform(platform.id)}
                      aria-label={`Select ${platform.name} for ${GROWTH_GOALS.find(g => g.id === selectedGoal)?.label}`}
                    >
                      <span className="platform-pill-icon" style={{ color: platform.brandColor }}>
                        {platform.icon}
                      </span>
                      <span className="platform-pill-name">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Subtle iOS Home Indicator */}
        <div className="ios-home-indicator" aria-hidden="true" />
      </main>
    </>
  );
}
