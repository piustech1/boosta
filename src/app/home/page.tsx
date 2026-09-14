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

export interface ActiveOrder {
  id: string;
  platform: string;
  service: string;
  current: number;
  target: number;
  progress: number;
  status: 'Delivering' | 'Processing' | 'Completed' | string;
}

export interface RecentActivity {
  id: string;
  type: 'deposit' | 'order' | 'completed' | 'started' | string;
  title: string;
  subtitle: string;
  time: string;
}

// Initial fallback mock data for development, isolated cleanly
const DEFAULT_ACTIVE_ORDERS: ActiveOrder[] = [
  {
    id: 'ord-1',
    platform: 'Instagram',
    service: 'Instagram Followers',
    current: 1560,
    target: 2000,
    progress: 78,
    status: 'Delivering',
  },
  {
    id: 'ord-2',
    platform: 'TikTok',
    service: 'TikTok Views',
    current: 91000,
    target: 100000,
    progress: 91,
    status: 'Delivering',
  },
];

const DEFAULT_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 'act-1',
    type: 'deposit',
    title: 'Deposit',
    subtitle: '+UGX 50,000',
    time: 'Today',
  },
  {
    id: 'act-2',
    type: 'completed',
    title: 'Instagram Growth',
    subtitle: 'Completed',
    time: '2h ago',
  },
  {
    id: 'act-3',
    type: 'started',
    title: 'TikTok Views',
    subtitle: 'Started',
    time: '5h ago',
  },
];

export default function AuthenticatedHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('125,000');
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>(DEFAULT_ACTIVE_ORDERS);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(DEFAULT_RECENT_ACTIVITIES);

  // Switching module state: single visual surface with switchable internal views
  const [financialTab, setFinancialTab] = useState<'balance' | 'growth'>('balance');
  const [activityTab, setActivityTab] = useState<'orders' | 'activity'>('orders');

  const handleSwitchFinancial = (tab: 'balance' | 'growth') => {
    if (tab === financialTab) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    setFinancialTab(tab);
  };

  const handleSwitchActivity = (tab: 'orders' | 'activity') => {
    if (tab === activityTab) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    setActivityTab(tab);
  };

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

      // Check if real authenticated orders exist
      const storedOrders = localStorage.getItem('boosta_active_orders');
      if (storedOrders) {
        try {
          setActiveOrders(JSON.parse(storedOrders));
        } catch {
          // Keep default fallback
        }
      }

      // Check if real activity exists
      const storedActivities = localStorage.getItem('boosta_recent_activities');
      if (storedActivities) {
        try {
          setRecentActivities(JSON.parse(storedActivities));
        } catch {
          // Keep default fallback
        }
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

        {/* 4. Switching Module A: YOUR BALANCE ↔ YOUR GROWTH */}
        <section className="switching-module-card financial-switching-card" aria-label="Account Balance and Growth">
          {/* Header row with iOS-style Liquid Glass Segmented Switch */}
          <div className="module-control-header">
            <div className="module-segmented-control" role="tablist" aria-label="Financial views">
              <button
                type="button"
                role="tab"
                aria-selected={financialTab === 'balance'}
                className={`segmented-tab-btn ${financialTab === 'balance' ? 'tab-active' : ''}`}
                onClick={() => handleSwitchFinancial('balance')}
              >
                <span>Balance</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={financialTab === 'growth'}
                className={`segmented-tab-btn ${financialTab === 'growth' ? 'tab-active' : ''}`}
                onClick={() => handleSwitchFinancial('growth')}
              >
                <span>Growth</span>
              </button>
              <div 
                className={`segmented-slider-thumb ${financialTab === 'growth' ? 'slide-right' : 'slide-left'}`}
                aria-hidden="true" 
              />
            </div>

            <div className="module-header-meta" aria-hidden="true">
              {financialTab === 'balance' ? (
                <span className="module-status-chip">
                  <span className="status-chip-dot dot-purple" />
                  <span>Wallet</span>
                </span>
              ) : (
                <span className="module-status-chip">
                  <span className="status-chip-dot dot-green" />
                  <span>Performance</span>
                </span>
              )}
            </div>
          </div>

          {/* Stacked Switching Viewport: same physical cell (grid-area: 1 / 1 / 2 / 2) */}
          <div className="switching-viewport financial-viewport">
            {/* VIEW 1: Your Balance */}
            <div 
              className={`switch-pane pane-left ${financialTab === 'balance' ? 'pane-active' : 'pane-inactive'}`}
              aria-hidden={financialTab !== 'balance'}
            >
              <div className="financial-pane-layout">
                <div className="financial-data-group">
                  <span className="pane-kicker-label">Your balance</span>
                  <div className="financial-value-wrap">
                    <span className="financial-currency">UGX</span>
                    <span className="financial-number">{balance}</span>
                  </div>
                  <span className="pane-secondary-label">Available balance</span>
                </div>

                <div className="financial-action-wrap">
                  <button
                    type="button"
                    className="deposit-action-pill"
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
            </div>

            {/* VIEW 2: Your Growth */}
            <div 
              className={`switch-pane pane-right ${financialTab === 'growth' ? 'pane-active' : 'pane-inactive'}`}
              aria-hidden={financialTab !== 'growth'}
            >
              <div className="financial-pane-layout">
                <div className="financial-data-group">
                  <span className="pane-kicker-label">Your growth</span>
                  <div className="financial-value-wrap">
                    <span className="financial-number growth-text">+12.8%</span>
                  </div>
                  <span className="pane-secondary-label">This week</span>
                </div>

                <div className="growth-sparkline-box" aria-hidden="true">
                  <svg viewBox="0 0 110 36" className="growth-sparkline-svg" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="growthSparklineGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M2 28 Q 28 24, 46 18 T 76 11 T 96 6 L 108 3"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 28 Q 28 24, 46 18 T 76 11 T 96 6 L 108 3 L 108 36 L 2 36 Z"
                      fill="url(#growthSparklineGrad2)"
                    />
                    <circle cx="108" cy="3" r="2.8" fill="#059669" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Switching Module B: ACTIVE ORDERS ↔ RECENT ACTIVITY */}
        <section className="switching-module-card activity-switching-card" aria-label="Active Orders and Recent Activity">
          {/* Header row with iOS-style Liquid Glass Segmented Switch */}
          <div className="module-control-header">
            <div className="module-segmented-control" role="tablist" aria-label="Activity views">
              <button
                type="button"
                role="tab"
                aria-selected={activityTab === 'orders'}
                className={`segmented-tab-btn ${activityTab === 'orders' ? 'tab-active' : ''}`}
                onClick={() => handleSwitchActivity('orders')}
              >
                <span>Active orders</span>
                {activeOrders.length > 0 && (
                  <span className="segmented-counter-pill">{activeOrders.length}</span>
                )}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activityTab === 'activity'}
                className={`segmented-tab-btn ${activityTab === 'activity' ? 'tab-active' : ''}`}
                onClick={() => handleSwitchActivity('activity')}
              >
                <span>Recent activity</span>
              </button>
              <div 
                className={`segmented-slider-thumb ${activityTab === 'activity' ? 'slide-right' : 'slide-left'}`}
                aria-hidden="true" 
              />
            </div>

            <div className="module-header-meta">
              <button
                type="button"
                className="view-all-link-btn"
                onClick={() => handleQuickAction('orders')}
                aria-label={activityTab === 'orders' ? 'View all active orders' : 'View all activity'}
              >
                <span>View all</span>
                <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stacked Switching Viewport */}
          <div className="switching-viewport activity-viewport">
            {/* VIEW 1: Active Orders */}
            <div 
              className={`switch-pane pane-left ${activityTab === 'orders' ? 'pane-active' : 'pane-inactive'}`}
              aria-hidden={activityTab !== 'orders'}
            >
              <div className="activity-pane-content">
                {activeOrders.length === 0 ? (
                  <div className="pane-empty-state">
                    <p className="empty-title">No active orders</p>
                    <p className="empty-subtitle">Your next boost will appear here.</p>
                    <button 
                      type="button" 
                      className="empty-cta-pill"
                      onClick={() => handleQuickAction('new-order')}
                    >
                      <span>Explore services →</span>
                    </button>
                  </div>
                ) : (
                  <div className="orders-product-list">
                    {activeOrders.slice(0, 2).map((order) => (
                      <div key={order.id} className="order-product-row">
                        <div className="order-row-main">
                          <div className="order-service-header">
                            <span className="order-service-title">{order.service}</span>
                            <span className="order-live-status-pill">{order.status}</span>
                          </div>
                          <div className="order-metric-line">
                            <span className="order-fraction-text">
                              {order.current.toLocaleString()} / {order.target.toLocaleString()}
                            </span>
                            <span className="order-percent-tag">{order.progress}%</span>
                          </div>
                        </div>

                        <div className="order-progress-track" aria-hidden="true">
                          <div 
                            className="order-progress-fill" 
                            style={{ width: `${Math.min(100, Math.max(0, order.progress))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* VIEW 2: Recent Activity */}
            <div 
              className={`switch-pane pane-right ${activityTab === 'activity' ? 'pane-active' : 'pane-inactive'}`}
              aria-hidden={activityTab !== 'activity'}
            >
              <div className="activity-pane-content">
                {recentActivities.length === 0 ? (
                  <div className="pane-empty-state">
                    <p className="empty-title">No recent activity</p>
                    <p className="empty-subtitle">Your deposits and boosts will appear here.</p>
                  </div>
                ) : (
                  <div className="timeline-product-list">
                    {recentActivities.slice(0, 3).map((act, index) => (
                      <div key={act.id} className="timeline-product-item">
                        <div className="timeline-spine-col" aria-hidden="true">
                          <div className={`timeline-core-dot dot-${act.type}`} />
                          {index < Math.min(recentActivities.length, 3) - 1 && (
                            <div className="timeline-spine-line" />
                          )}
                        </div>

                        <div className="timeline-body-col">
                          <div className="timeline-title-bar">
                            <span className="timeline-entry-title">{act.title}</span>
                            <span className="timeline-entry-time">{act.time}</span>
                          </div>
                          <span className={`timeline-entry-sub ${act.type === 'deposit' ? 'deposit-highlight' : ''}`}>
                            {act.subtitle}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Subtle iOS Home Indicator */}
        <div className="ios-home-indicator" aria-hidden="true" />
      </main>
    </>
  );
}
