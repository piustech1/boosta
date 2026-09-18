'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedAppBar } from '@/components/AuthenticatedAppBar';
import { CollapsibleFabNavigation } from '@/components/CollapsibleFabNavigation';

interface UserOrder {
  id: string;
  transactionId: string;
  platform: string;
  boostType?: string;
  type?: string;
  quantity: number;
  destinationUrl?: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  createdAt: number;
  verifiedAt?: number;
}

export default function OrdersActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED'>('ALL');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Load authenticated user
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('boosta_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser({ email: 'creator@boosta.app', name: 'Creator' });
        }
      } else {
        setUser({ email: 'creator@boosta.app', name: 'Creator' });
      }

      // Fetch orders from server + localStorage merge
      const fetchOrders = async () => {
        let mergedOrders: UserOrder[] = [];

        // 1. Fetch server records
        try {
          const res = await fetch('/api/orders');
          if (res.ok) {
            const data = await res.json();
            if (data.orders && Array.isArray(data.orders)) {
              mergedOrders = [...data.orders];
            }
          }
        } catch (err) {
          console.warn('Could not fetch server orders', err);
        }

        // 2. Fetch local client cache
        try {
          const localStored = localStorage.getItem('boosta_orders');
          if (localStored) {
            const localOrders: UserOrder[] = JSON.parse(localStored);
            localOrders.forEach((lo) => {
              if (!mergedOrders.some((mo) => mo.transactionId === lo.transactionId || mo.id === lo.id)) {
                mergedOrders.push(lo);
              }
            });
          }
        } catch (err) {
          console.warn('Could not parse local orders', err);
        }

        // Sort descending by date
        mergedOrders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(mergedOrders);
        setIsLoading(false);
      };

      fetchOrders();
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('boosta_user');
    }
    router.push('/');
  };

  // Calculations: ONLY COMPLETED orders count toward confirmed lifetime spending
  const confirmedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalSpentConfirmed = confirmedOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const failedOrders = orders.filter((o) => o.status === 'FAILED' || o.status === 'CANCELLED' || o.status === 'EXPIRED');

  // Filtered list
  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'COMPLETED') return o.status === 'COMPLETED';
    if (activeFilter === 'PENDING') return o.status === 'PENDING';
    if (activeFilter === 'FAILED') return o.status === 'FAILED' || o.status === 'CANCELLED' || o.status === 'EXPIRED';
    return true;
  });

  const getPlatformIcon = (platform?: string) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('tiktok')) {
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87c-.31-.03-.62-.09-.92-.18z" />
        </svg>
      );
    }
    if (p.includes('instagram')) {
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    }
    if (p.includes('youtube')) {
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    }
    if (p.includes('facebook')) {
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  };

  return (
    <>
      <div className="liquid-canvas" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <main className="app-container orders-page-container">
        <AuthenticatedAppBar 
          user={user} 
          onLogout={handleLogout} 
          onNavigateService={(plat) => router.push(`/boost?platform=${plat}`)} 
        />

        {/* Page Top Header with Back Navigation */}
        <header className="orders-page-header">
          <div className="orders-header-row">
            <button
              type="button"
              className="orders-back-btn"
              onClick={() => router.push('/home')}
              aria-label="Back to Home"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Home</span>
            </button>
            <div className="orders-live-status-pill">
              <span className="live-status-dot" aria-hidden="true" />
              <span>Direct Ledger</span>
            </div>
          </div>

          <div className="orders-title-group">
            <h1 className="orders-title">Activity &amp; Orders</h1>
            <p className="orders-subtitle">Lifetime spending and confirmed order dispatches</p>
          </div>
        </header>

        {/* Summary Metrics Row */}
        <section className="orders-metrics-grid" aria-label="Order summary statistics">
          <div className="orders-metric-card metric-spending">
            <span className="metric-label">Confirmed Spending</span>
            <span className="metric-value">UGX {totalSpentConfirmed.toLocaleString()}</span>
            <span className="metric-caption">Zero deposits • Direct paid</span>
          </div>

          <div className="orders-metric-card metric-count">
            <span className="metric-label">Total Orders</span>
            <span className="metric-value">{orders.length}</span>
            <span className="metric-caption">
              {confirmedOrders.length} completed{pendingOrders.length > 0 ? ` • ${pendingOrders.length} pending` : ''}
            </span>
          </div>
        </section>

        {/* Filter Segment Tabs */}
        <div className="orders-filter-bar" role="tablist" aria-label="Filter orders by status">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'ALL'}
            className={`filter-tab-pill ${activeFilter === 'ALL' ? 'tab-active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            <span>All</span>
            <span className="tab-count-badge">{orders.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'COMPLETED'}
            className={`filter-tab-pill ${activeFilter === 'COMPLETED' ? 'tab-active' : ''}`}
            onClick={() => setActiveFilter('COMPLETED')}
          >
            <span>Confirmed</span>
            <span className="tab-count-badge">{confirmedOrders.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'PENDING'}
            className={`filter-tab-pill ${activeFilter === 'PENDING' ? 'tab-active' : ''}`}
            onClick={() => setActiveFilter('PENDING')}
          >
            <span>Pending</span>
            <span className="tab-count-badge">{pendingOrders.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'FAILED'}
            className={`filter-tab-pill ${activeFilter === 'FAILED' ? 'tab-active' : ''}`}
            onClick={() => setActiveFilter('FAILED')}
          >
            <span>Failed</span>
            <span className="tab-count-badge">{failedOrders.length}</span>
          </button>
        </div>

        {/* Orders Feed */}
        <section className="orders-feed-section" aria-label="Orders list">
          {isLoading ? (
            <div className="orders-loading-state">
              <div className="loading-spinner-ring" />
              <span>Syncing payment ledger...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="orders-empty-card glass-bubble">
              <div className="empty-icon-wrap" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className="empty-title">
                {activeFilter === 'ALL' ? 'No orders placed yet' : `No ${activeFilter.toLowerCase()} orders`}
              </h3>
              <p className="empty-desc">
                {activeFilter === 'ALL' 
                  ? 'Your confirmed boosts and direct payments will appear here in real-time.' 
                  : 'Orders matching this status filter will show up here.'}
              </p>
              <button
                type="button"
                className="empty-cta-btn"
                onClick={() => router.push('/boost')}
              >
                <span>Start your first boost</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <div className="orders-list-cluster">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrderId === (order.transactionId || order.id);
                const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <article
                    key={order.transactionId || order.id}
                    className={`order-item-card glass-bubble ${isSelected ? 'order-card-expanded' : ''}`}
                    onClick={() =>
                      setSelectedOrderId(isSelected ? null : order.transactionId || order.id)
                    }
                  >
                    <div className="order-item-header">
                      <div className="order-service-meta">
                        <div className="order-platform-icon-pill" aria-hidden="true">
                          {getPlatformIcon(order.platform)}
                        </div>
                        <div className="order-title-block">
                          <span className="order-service-name">
                            {order.platform} {order.type || order.boostType || 'Boost'}
                          </span>
                          <span className="order-date-label">{orderDate} • {order.id}</span>
                        </div>
                      </div>

                      <div className="order-status-and-amount">
                        <span className="order-amount-pill">
                          UGX {Number(order.amount).toLocaleString()}
                        </span>
                        <span className={`order-status-badge status-${order.status.toLowerCase()}`}>
                          {order.status === 'COMPLETED' ? 'Confirmed' : order.status}
                        </span>
                      </div>
                    </div>

                    {/* Compact Details Strip */}
                    <div className="order-item-footer">
                      <div className="order-qty-pill">
                        <strong>{order.quantity?.toLocaleString()}</strong> units
                      </div>
                      {order.paymentMethod && (
                        <div className="order-method-pill">
                          {order.paymentMethod}
                        </div>
                      )}
                      <span className="order-expand-toggle">
                        {isSelected ? 'Hide details' : 'View details →'}
                      </span>
                    </div>

                    {/* Expandable Details Drawer */}
                    {isSelected && (
                      <div className="order-expanded-details" onClick={(e) => e.stopPropagation()}>
                        <div className="details-divider" />
                        <div className="details-row">
                          <span className="detail-key">Transaction Ref:</span>
                          <span className="detail-val mono-text">{order.transactionId}</span>
                        </div>
                        {order.destinationUrl && (
                          <div className="details-row">
                            <span className="detail-key">Destination Link:</span>
                            <span className="detail-val truncate-text">{order.destinationUrl}</span>
                          </div>
                        )}
                        <div className="details-row">
                          <span className="detail-key">Payment Status:</span>
                          <span className="detail-val">
                            {order.status === 'COMPLETED' ? 'Paid & Verified Direct' : order.status}
                          </span>
                        </div>
                        <div className="details-row">
                          <span className="detail-key">Dispatch Guarantee:</span>
                          <span className="detail-val speed-highlight">Instant Dispatch • High Speed</span>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Collapsible Horizontal FAB Navigation */}
        <CollapsibleFabNavigation />
      </main>
    </>
  );
}
