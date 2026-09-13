'use client';

import React, { useState, useEffect } from 'react';
import { HeroDuduPortal } from './HeroDuduPortal';
import { ChatBubble } from './ChatBubble';

export type AuthMode = 'login' | 'signup';

interface AuthExperienceProps {
  initialMode?: AuthMode;
  onClose?: () => void;
  onSuccess?: (user: { email: string; name?: string }) => void;
  isStandalonePage?: boolean;
}

export const AuthExperience: React.FC<AuthExperienceProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess,
  isStandalonePage = false,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Form fields
  const [name, setName] = useState<string>('');
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  // Parallax tracking
  const [parallaxOffset, setParallaxOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const xRatio = e.clientX / window.innerWidth;
      const yRatio = e.clientY / window.innerHeight;
      setParallaxOffset({
        x: (xRatio - 0.5) * 12,
        y: (yRatio - 0.5) * 12,
      });
    };
    window.addEventListener('mousemove', handlePointerMove);
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, []);

  // Sync mode if initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle smooth mode switch with animation timing
  const handleModeSwitch = (newMode: AuthMode) => {
    if (newMode === mode || isSwitching) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
    setIsSwitching(true);
    setAuthFeedback(null);
    setTimeout(() => {
      setMode(newMode);
      setIsSwitching(false);
    }, 180);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password || (mode === 'signup' && !name)) {
      setAuthFeedback('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setAuthFeedback(null);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setAuthFeedback(
        mode === 'login'
          ? 'Welcome back! Launching your engine...'
          : 'Account created! Welcome to Boosta.'
      );
      if (onSuccess) {
        onSuccess({ email: emailOrUsername, name: mode === 'signup' ? name : undefined });
      }
    }, 1100);
  };

  // Mickey's dynamic speech bubble reaction
  const heroSpeech = mode === 'login' ? 'Ready to grow?' : "Let's grow together.";

  return (
    <div className={`auth-experience-wrapper ${isStandalonePage ? 'auth-standalone' : ''}`}>
      {/* Top Bar with Boosta Logo and Back / Close Navigation */}
      <header className="auth-header-nav">
        <div className="auth-brand-group">
          {onClose && (
            <button
              type="button"
              className="auth-back-btn glass-pill"
              onClick={onClose}
              aria-label="Back to overview"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/boosta_icon.png"
            alt="Boosta"
            className="brand-logo-img auth-logo-img"
          />
        </div>

        {/* Minimal Tab Switcher with sliding pill */}
        <div className="auth-mode-tabs glass-pill" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('signup')}
          >
            Create account
          </button>
          <span className={`tab-slider-pill ${mode === 'signup' ? 'pill-signup' : 'pill-login'}`} aria-hidden="true" />
        </div>
      </header>

      {/* Main Dual-Zone Responsive Layout: Left Auth, Right/Upper Hero */}
      <div className="auth-stage-layout">
        {/* =========================================================
            HERO ZONE (Mickey + Doodling Liquid Container + Reactive Bubble)
            ========================================================= */}
        <div className="auth-hero-zone">
          <div className="auth-hero-portal-wrap">
            <HeroDuduPortal parallaxOffset={parallaxOffset} />
          </div>

          <div className={`auth-speech-bubble-anchor mode-transition-${mode}`}>
            <ChatBubble
              message={heroSpeech}
              parallaxOffset={parallaxOffset}
            />
          </div>
        </div>

        {/* =========================================================
            AUTH FORM ZONE (NO large background box, all LEFT ALIGNED)
            ========================================================= */}
        <div className="auth-form-zone">
          <div className={`auth-content-column ${isSwitching ? 'form-fade-out' : 'form-fade-in'}`}>
            
            {/* Header Track / Tagline */}
            <div className="auth-text-header">
              <span className="auth-tracker-label">
                {mode === 'login' ? 'BOOSTA / ACCESS' : 'BOOSTA / JOIN'}
              </span>
              <h1 className="auth-headline">
                {mode === 'login' ? (
                  <>
                    Turn attention<br />into growth.
                  </>
                ) : (
                  <>
                    Your next<br />growth story.
                  </>
                )}
              </h1>
              <p className="auth-subtext">
                {mode === 'login'
                  ? 'One clean space to boost your social presence and keep moving.'
                  : 'Start with a clean dashboard built to help your socials move.'}
              </p>
            </div>

            {/* Individual Floating Liquid-Glass Fields */}
            <form onSubmit={handleSubmit} className="auth-floating-form" noValidate>
              
              {/* SIGNUP: Name field */}
              {mode === 'signup' && (
                <div className="liquid-glass-field field-stagger-1">
                  <span className="field-semantic-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className="liquid-input"
                  />
                </div>
              )}

              {/* Email / Username field */}
              <div className="liquid-glass-field field-stagger-2">
                <span className="field-semantic-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  name="identifier"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder={mode === 'login' ? 'Email or username' : 'Email address'}
                  autoComplete={mode === 'login' ? 'username' : 'email'}
                  required
                  className="liquid-input"
                />
              </div>

              {/* Password field with semantic Eye Toggle */}
              <div className="liquid-glass-field field-stagger-3">
                <span className="field-semantic-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'login' ? 'Password' : 'Create a password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  className="liquid-input"
                />
                <button
                  type="button"
                  className="field-toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* LOGIN: Minimal options row (Stay signed in & Forgot password) */}
              {mode === 'login' && (
                <div className="auth-options-row field-stagger-4">
                  <label className="stay-signed-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="custom-glass-checkbox"
                    />
                    <span>Stay signed in</span>
                  </label>
                  <button
                    type="button"
                    className="forgot-pass-link"
                    onClick={() => setAuthFeedback('Password reset link sent to your registered email.')}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* SIGNUP: Minimal Legal Notice */}
              {mode === 'signup' && (
                <p className="auth-legal-subtle field-stagger-4">
                  By continuing, you accept our <a href="#terms" className="legal-link">Terms & Privacy</a>.
                </p>
              )}

              {/* Feedback Notice */}
              {authFeedback && (
                <div className="auth-feedback-pill glass-pill" role="status">
                  {authFeedback}
                </div>
              )}

              {/* COMPACT PILL ACTION BUTTON (NOT FULL WIDTH!) */}
              <div className="auth-cta-container field-stagger-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-compact-pill-btn"
                >
                  <span className="pill-btn-sheen" aria-hidden="true" />
                  <span className="pill-btn-label">
                    {isSubmitting
                      ? 'Connecting...'
                      : mode === 'login'
                      ? 'Enter Boosta'
                      : 'Create my Boosta'}
                  </span>
                  <span className="pill-btn-arrow" aria-hidden="true">
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 10h12M11 5l5 5-5 5" />
                    </svg>
                  </span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
