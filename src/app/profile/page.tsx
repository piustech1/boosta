'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedAppBar } from '@/components/AuthenticatedAppBar';
import { CollapsibleFabNavigation } from '@/components/CollapsibleFabNavigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
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
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('boosta_user');
    }
    router.push('/');
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'Boosta Creator';

  return (
    <>
      <div className="liquid-canvas" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <main className="app-container profile-page-container">
        <AuthenticatedAppBar user={user} onLogout={handleLogout} />

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
            <h1 className="orders-title">Account &amp; Profile</h1>
            <p className="orders-subtitle">Authenticated creator settings and preferences</p>
          </div>
        </header>

        <section className="profile-card glass-bubble" aria-label="User account card">
          <div className="profile-avatar-large">
            <span>{displayName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile-identity">
            <h2 className="profile-name">{displayName}</h2>
            <p className="profile-email">{user?.email || 'creator@boosta.app'}</p>
            <span className="profile-verified-badge">
              <span className="verified-dot" aria-hidden="true" />
              Verified Creator Account
            </span>
          </div>
        </section>

        <section className="profile-settings-list" aria-label="Account details">
          <div className="settings-item-row glass-pill">
            <div className="settings-icon-col">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div className="settings-text-col">
              <strong>Direct Payment Engine</strong>
              <span>Zero wallet deposits • Pay per order via Mobile Money &amp; Card</span>
            </div>
          </div>

          <div className="settings-item-row glass-pill">
            <div className="settings-icon-col">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="settings-text-col">
              <strong>Encrypted &amp; Non-Drop</strong>
              <span>Bank-grade cryptographic verification with safe delivery</span>
            </div>
          </div>
        </section>

        <div className="profile-actions-bottom">
          <button
            type="button"
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out of Boosta</span>
          </button>
        </div>

        <CollapsibleFabNavigation />
      </main>
    </>
  );
}
