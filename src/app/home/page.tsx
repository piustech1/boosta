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

export default function AuthenticatedHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('125,000');

  // Retrieve authenticated session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('boosta_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          if (parsed.balance) {
            setBalance(typeof parsed.balance === 'number' ? parsed.balance.toLocaleString() : String(parsed.balance));
          }
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
    setActiveFeedback(`Launching ${platform} viral booster...`);
    setTimeout(() => {
      setActiveFeedback(null);
    }, 3200);
  };

  const handleQuickAction = (action: 'new-order' | 'deposit' | 'orders') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    if (action === 'new-order') {
      setActiveFeedback('Select a platform in the hero above to start a new order.');
    } else if (action === 'deposit') {
      setActiveFeedback('Opening Mobile Money & Card deposit modal...');
    } else if (action === 'orders') {
      setActiveFeedback('Loading your recent order history...');
    }
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

        {/* 3. Compact Dashboard Quick Actions */}
        <section className="dashboard-quick-actions" aria-label="Quick Actions">
          <button 
            type="button" 
            className="quick-action-btn"
            onClick={() => handleQuickAction('new-order')}
            aria-label="New Order"
          >
            <span className="action-icon-wrapper action-icon-order" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </span>
            <span className="action-btn-label">New Order</span>
          </button>

          <button 
            type="button" 
            className="quick-action-btn"
            onClick={() => handleQuickAction('deposit')}
            aria-label="Deposit"
          >
            <span className="action-icon-wrapper action-icon-deposit" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <circle cx="17.5" cy="14" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span className="action-btn-label">Deposit</span>
          </button>

          <button 
            type="button" 
            className="quick-action-btn"
            onClick={() => handleQuickAction('orders')}
            aria-label="Orders"
          >
            <span className="action-icon-wrapper action-icon-history" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" />
              </svg>
            </span>
            <span className="action-btn-label">Orders</span>
          </button>
        </section>

        {/* 4. Balance + Growth Twin Module */}
        <section className="dashboard-twin-modules" aria-label="Account Financials and Growth Overview">
          {/* Module A: YOUR BALANCE */}
          <div className="twin-module-card balance-module">
            <div className="module-header-row">
              <span className="module-tag-label">YOUR BALANCE</span>
              <div className="module-tag-icon balance-accent" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h3v-4z" />
                </svg>
              </div>
            </div>

            <div className="module-main-value-wrap">
              <span className="module-currency-prefix">UGX</span>
              <span className="module-main-value">{balance}</span>
            </div>

            <div className="module-subtext">Available balance</div>

            <div className="module-footer-action">
              <button 
                type="button" 
                className="compact-secondary-action"
                onClick={() => handleQuickAction('deposit')}
                aria-label="Deposit Funds"
              >
                <span>Deposit</span>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Module B: YOUR GROWTH */}
          <div className="twin-module-card growth-module">
            <div className="module-header-row">
              <span className="module-tag-label">YOUR GROWTH</span>
              <div className="module-tag-icon growth-accent" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 6l-9.5 9.5-5-5L1 18" />
                  <path d="M17 6h6v6" />
                </svg>
              </div>
            </div>

            <div className="module-main-value-wrap">
              <span className="module-main-value growth-green">+12.8%</span>
            </div>

            <div className="module-subtext">This week</div>

            <div className="module-footer-viz" aria-hidden="true">
              {/* Compact Mini Upward Trend Sparkline */}
              <svg viewBox="0 0 88 24" className="growth-sparkline-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="growthSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 20 Q 22 18, 34 13 T 58 9 T 74 5 L 86 2"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 20 Q 22 18, 34 13 T 58 9 T 74 5 L 86 2 L 86 24 L 2 24 Z"
                  fill="url(#growthSparklineGrad)"
                />
                <circle cx="86" cy="2" r="2.5" fill="#059669" />
              </svg>
            </div>
          </div>
        </section>

        {/* Subtle iOS Home Indicator */}
        <div className="ios-home-indicator" aria-hidden="true" />
      </main>
    </>
  );
}
