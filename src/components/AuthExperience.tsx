'use client';

import React, { useState, useEffect } from 'react';

export type AuthMode = 'login' | 'signup';

interface AuthExperienceProps {
  initialMode?: AuthMode;
  onClose?: () => void;
  onModeChange?: (mode: AuthMode) => void;
  onSuccess?: (user: { email: string; name?: string }) => void;
  isStandalonePage?: boolean;
}

export const AuthExperience: React.FC<AuthExperienceProps> = ({
  initialMode = 'login',
  onClose,
  onModeChange,
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
    if (onModeChange) {
      onModeChange(newMode);
    }
    setTimeout(() => {
      setMode(newMode);
      setIsSwitching(false);
    }, 140);
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
    }, 1000);
  };

  // Dynamic reaction speech for Mickey
  const heroSpeech = mode === 'login' ? 'Ready to grow?' : "Let's grow together.";

  return (
    <div className={`auth-experience-wrapper ${isStandalonePage ? 'auth-standalone' : ''}`}>
      {/* =========================================================
          1. INLINE HERO: Text & Mickey Asset placed side-by-side
          Highly styled to match brand without collisions or crushes
          ========================================================= */}
      <div className="auth-inline-hero">
        {/* Left Column: Styled Typography & Mickey's Speech */}
        <div className="auth-inline-info">
          <div className="auth-inline-tracker-row">
            {onClose && (
              <button
                type="button"
                className="auth-back-pill"
                onClick={onClose}
                aria-label="Back to home"
              >
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
              </button>
            )}
            <span className="auth-tracker-badge">
              <span className="tracker-glow-dot" aria-hidden="true" />
              {mode === 'login' ? 'ACCESS PORTAL' : 'JOIN ENGINE'}
            </span>
          </div>

          <h1 className="auth-inline-headline">
            {mode === 'login' ? (
              <>
                Turn attention into <span className="auth-gradient-text">growth.</span>
              </>
            ) : (
              <>
                Start your next <span className="auth-gradient-text">growth story.</span>
              </>
            )}
          </h1>

          {/* Mickey's dynamic reaction speech bubble */}
          <div className={`auth-inline-bubble mode-bubble-${mode}`}>
            <span className="bubble-dot" aria-hidden="true" />
            <span className="bubble-copy">{heroSpeech}</span>
          </div>
        </div>

        {/* Right Column: Compact Mickey Asset with Doodling Liquid Dudu */}
        <div className="auth-inline-asset-wrap">
          <div className="auth-dudu-pebble doodle-animated" aria-hidden="true">
            <div className="dudu-halo" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/mickey.png"
            alt="Mickey Waving"
            className="auth-mickey-cutout"
          />
        </div>
      </div>

      {/* =========================================================
          2. DEDICATED MODE SWITCHER: 50/50 CSS Grid (No self-collision)
          ========================================================= */}
      <div className="auth-switcher-container">
        <div className="auth-segmented-control" role="tablist" aria-label="Authentication Mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-segmented-tab ${mode === 'login' ? 'tab-active' : ''}`}
            onClick={() => handleModeSwitch('login')}
          >
            Log In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth-segmented-tab ${mode === 'signup' ? 'tab-active' : ''}`}
            onClick={() => handleModeSwitch('signup')}
          >
            Sign Up
          </button>
          <div
            className={`auth-tab-slider ${mode === 'signup' ? 'slide-signup' : 'slide-login'}`}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* =========================================================
          3. FLOATING LIQUID-GLASS FORM FIELDS (Strictly Left Aligned)
          ========================================================= */}
      <div className="auth-form-zone">
        <div className={`auth-content-column ${isSwitching ? 'form-fade-out' : 'form-fade-in'}`}>
          <form onSubmit={handleSubmit} className="auth-floating-form" noValidate>
            
            {/* SIGNUP: Name field */}
            {mode === 'signup' && (
              <div className="liquid-glass-field field-stagger-1">
                <span className="field-semantic-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  onClick={() => setAuthFeedback('Password reset instructions sent.')}
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
                  <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
