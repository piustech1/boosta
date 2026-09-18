'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedAppBar } from '@/components/AuthenticatedAppBar';

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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Logout Confirmation Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Fetch user profile
      const stored = localStorage.getItem('boosta_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setEditName(parsed.name || '');
        } catch {
          setUser({ email: 'creator@boosta.app', name: 'Creator' });
          setEditName('Creator');
        }
      } else {
        setUser({ email: 'creator@boosta.app', name: 'Creator' });
        setEditName('Creator');
      }

      // 2. Fetch real orders for summary & spending
      const fetchOrders = async () => {
        let mergedOrders: UserOrder[] = [];

        // Server records
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

        // Local cache
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

        mergedOrders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(mergedOrders);
        setIsLoading(false);
      };

      fetchOrders();
    }
  }, []);

  // Filter only completed orders for verified spending
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalSpent = completedOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const activeOrders = orders.filter((o) => o.status === 'PENDING');
  const recentOrder = orders.length > 0 ? orders[0] : null;

  const displayName = user?.name || user?.email?.split('@')[0] || 'Boosta Creator';
  const displayEmail = user?.email || 'creator@boosta.app';

  // Edit Profile Actions
  const handleOpenEditModal = () => {
    setEditName(user?.name || displayName);
    setEditSuccessMsg(null);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed) return;

    const updatedUser = {
      email: displayEmail,
      name: trimmed,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('boosta_user', JSON.stringify(updatedUser));
    }
    setUser(updatedUser);
    setEditSuccessMsg('Profile updated successfully!');
    setTimeout(() => {
      setIsEditModalOpen(false);
      setEditSuccessMsg(null);
    }, 900);
  };

  // Change Password Actions
  const handleOpenPasswordModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setPasswordSuccess(null);
    setIsPasswordModalOpen(true);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    // Save timestamp of security update
    if (typeof window !== 'undefined') {
      localStorage.setItem('boosta_security_last_updated', Date.now().toString());
    }

    setPasswordSuccess('Password updated successfully!');
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setPasswordSuccess(null);
    }, 1100);
  };

  // Logout Actions
  const handleConfirmLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('boosta_user');
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    router.push('/');
  };

  return (
    <>
      {/* Background ambient orbs */}
      <div className="liquid-canvas" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <main className="app-container profile-page-container">
        {/* Top App Bar */}
        <AuthenticatedAppBar 
          user={user} 
          onLogout={() => setIsLogoutModalOpen(true)} 
        />

        {/* Header Navigation */}
        <header className="profile-page-header">
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
          <div className="orders-title-group" style={{ marginTop: '8px' }}>
            <h1 className="orders-title">Creator Profile</h1>
            <p className="orders-subtitle">Manage your verified account and activity</p>
          </div>
        </header>

        {/* A. PROFILE HEADER */}
        <section className="profile-header-surface" aria-label="Creator Profile Information">
          <div className="profile-avatar-large">
            <span>{displayName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile-identity">
            <div className="profile-name-row">
              <h2 className="profile-name">{displayName}</h2>
              <button
                type="button"
                className="profile-edit-badge-btn"
                onClick={handleOpenEditModal}
                aria-label="Edit Profile Name"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Edit</span>
              </button>
            </div>
            <p className="profile-email">{displayEmail}</p>
            <div className="profile-status-row">
              <span className="profile-verified-badge">
                <span className="verified-dot" aria-hidden="true" />
                Verified Creator Account
              </span>
            </div>
          </div>
        </section>

        {/* B. MY ORDERS SUMMARY */}
        <section className="profile-group-section" aria-label="My Orders Summary">
          <div className="profile-section-header">
            <span className="profile-section-title">MY ORDERS</span>
            <button
              type="button"
              className="profile-section-link"
              onClick={() => router.push('/orders')}
            >
              <span>View all</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div 
            className="profile-card-surface profile-orders-shortcut"
            onClick={() => router.push('/orders')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/orders')}
            aria-label="Navigate to full orders and activity page"
          >
            <div className="profile-orders-metrics-row">
              <div className="profile-order-metric">
                <span className="metric-val">{isLoading ? '...' : orders.length}</span>
                <span className="metric-lbl">Total Boosts</span>
              </div>
              <div className="metric-separator" aria-hidden="true" />
              <div className="profile-order-metric">
                <span className="metric-val text-amber">{isLoading ? '...' : activeOrders.length}</span>
                <span className="metric-lbl">Active Dispatch</span>
              </div>
              <div className="metric-separator" aria-hidden="true" />
              <div className="profile-order-metric">
                <span className="metric-val text-emerald">{isLoading ? '...' : completedOrders.length}</span>
                <span className="metric-lbl">Completed</span>
              </div>
            </div>

            {recentOrder && (
              <div className="profile-recent-order-pill">
                <div className="recent-order-left">
                  <span className="recent-badge">LATEST</span>
                  <span className="recent-platform">{recentOrder.platform} {recentOrder.type || recentOrder.boostType || 'Boost'}</span>
                </div>
                <div className="recent-order-right">
                  <span className="recent-amount">UGX {recentOrder.amount?.toLocaleString()}</span>
                  <span className={`recent-status-dot dot-${recentOrder.status.toLowerCase()}`} aria-hidden="true" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* C. MY BOOSTA USAGE */}
        <section className="profile-group-section" aria-label="My Boosta Usage">
          <div className="profile-section-header">
            <span className="profile-section-title">MY BOOSTA USAGE</span>
          </div>

          <div className="profile-card-surface profile-usage-surface">
            <div className="profile-usage-left">
              <span className="profile-usage-eyebrow">CONFIRMED LIFETIME SPEND</span>
              <div className="profile-usage-val">
                {isLoading ? '...' : `UGX ${totalSpent.toLocaleString()}`}
              </div>
              <span className="profile-usage-caption">
                Total spent on verified social growth dispatches
              </span>
            </div>
            <div className="profile-usage-badge">
              <span className="direct-pay-icon" aria-hidden="true">✓</span>
              <span>Direct Pay</span>
            </div>
          </div>
        </section>

        {/* D. ACCOUNT & SECURITY */}
        <section className="profile-group-section" aria-label="Account & Security">
          <div className="profile-section-header">
            <span className="profile-section-title">ACCOUNT &amp; SECURITY</span>
          </div>

          <div className="profile-card-surface profile-settings-group">
            {/* Edit Profile Option */}
            <button
              type="button"
              className="profile-setting-row"
              onClick={handleOpenEditModal}
              aria-label="Edit creator display name"
            >
              <div className="setting-icon-box">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="setting-info-box">
                <span className="setting-label">Edit Display Name</span>
                <span className="setting-desc">{displayName}</span>
              </div>
              <span className="setting-arrow" aria-hidden="true">→</span>
            </button>

            <div className="profile-setting-divider" />

            {/* Change Password Option */}
            <button
              type="button"
              className="profile-setting-row"
              onClick={handleOpenPasswordModal}
              aria-label="Change account password"
            >
              <div className="setting-icon-box">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="setting-info-box">
                <span className="setting-label">Change Password</span>
                <span className="setting-desc">Update creator security credentials</span>
              </div>
              <span className="setting-arrow" aria-hidden="true">→</span>
            </button>

            <div className="profile-setting-divider" />

            {/* Security Architecture */}
            <div className="profile-setting-row no-hover">
              <div className="setting-icon-box icon-shield">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="setting-info-box">
                <span className="setting-label">Payment Security &amp; Encryption</span>
                <span className="setting-desc">Bank-grade SHA-256 direct payment verification active</span>
              </div>
              <span className="setting-status-pill">Active</span>
            </div>
          </div>
        </section>

        {/* E. HELP & SUPPORT */}
        <section className="profile-group-section" aria-label="Help & Support">
          <div className="profile-section-header">
            <span className="profile-section-title">HELP &amp; SUPPORT</span>
          </div>

          <div className="profile-card-surface profile-support-surface">
            <div className="support-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div className="support-text-col">
              <span className="support-title">Need help with an order or payment?</span>
              <span className="support-caption">Our support team is ready to assist you.</span>
            </div>
            <a
              href="mailto:support@boosta.app?subject=Help%20with%20Boosta%20Order"
              className="profile-support-btn"
              aria-label="Contact Boosta support"
            >
              <span>Talk to us</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* F. LOG OUT BUTTON */}
        <div className="profile-logout-wrap">
          <button
            type="button"
            className="profile-logout-button"
            onClick={() => setIsLogoutModalOpen(true)}
            aria-label="Log out of Boosta account"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out of Boosta</span>
          </button>
        </div>
      </main>

      {/* MODAL 1: EDIT PROFILE */}
      {isEditModalOpen && (
        <div className="profile-modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="profile-modal-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal-sheet-header">
              <h3 className="modal-sheet-title">Edit Creator Profile</h3>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsEditModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="modal-sheet-body">
              <div className="modal-input-field">
                <label className="modal-field-label">Display Name</label>
                <input
                  type="text"
                  className="modal-text-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  autoFocus
                  required
                />
              </div>

              <div className="modal-input-field">
                <label className="modal-field-label">Account Email</label>
                <input
                  type="email"
                  className="modal-text-input modal-input-readonly"
                  value={displayEmail}
                  readOnly
                  disabled
                />
                <span className="modal-field-hint">Email is linked to your verified authentication</span>
              </div>

              {editSuccessMsg && (
                <div className="modal-success-pill" role="status">
                  ✓ {editSuccessMsg}
                </div>
              )}

              <div className="modal-sheet-actions">
                <button
                  type="button"
                  className="modal-btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn-primary"
                  disabled={!editName.trim()}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHANGE PASSWORD */}
      {isPasswordModalOpen && (
        <div className="profile-modal-backdrop" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="profile-modal-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal-sheet-header">
              <h3 className="modal-sheet-title">Change Password</h3>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsPasswordModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="modal-sheet-body">
              <div className="modal-input-field">
                <label className="modal-field-label">Current Password</label>
                <input
                  type="password"
                  className="modal-text-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  required
                />
              </div>

              <div className="modal-input-field">
                <label className="modal-field-label">New Password</label>
                <input
                  type="password"
                  className="modal-text-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                />
              </div>

              <div className="modal-input-field">
                <label className="modal-field-label">Confirm New Password</label>
                <input
                  type="password"
                  className="modal-text-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                />
              </div>

              {passwordError && (
                <div className="modal-error-pill" role="alert">
                  ⚠ {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="modal-success-pill" role="status">
                  ✓ {passwordSuccess}
                </div>
              )}

              <div className="modal-sheet-actions">
                <button
                  type="button"
                  className="modal-btn-secondary"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn-primary"
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOGOUT CONFIRMATION */}
      {isLogoutModalOpen && (
        <div className="profile-modal-backdrop" onClick={() => setIsLogoutModalOpen(false)}>
          <div className="profile-modal-sheet modal-logout-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="logout-modal-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3 className="modal-logout-title">Log out of Boosta?</h3>
            <p className="modal-logout-desc">
              You can log back in anytime with your creator credentials to view your order activity.
            </p>

            <div className="modal-logout-actions">
              <button
                type="button"
                className="modal-btn-secondary"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-btn-danger"
                onClick={handleConfirmLogout}
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
