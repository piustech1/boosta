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
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  // Sync mode if initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle smooth signature Boosta mode transition
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
    // 380ms smooth transformation: fade, slight horizontal shift, scale & blur
    setTimeout(() => {
      setMode(newMode);
      setIsSwitching(false);
    }, 280);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup') {
      if (!name.trim() || !signupEmail.trim() || !password) {
        setAuthFeedback('Please enter your name, email address, and password.');
        return;
      }
      if (password.length < 6) {
        setAuthFeedback('Password must be at least 6 characters.');
        return;
      }
    } else {
      if (!emailOrUsername.trim() || !password) {
        setAuthFeedback('Please enter your email or username and password.');
        return;
      }
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
          ? 'Welcome back! Connecting your dashboard...'
          : 'Account created! Welcome to Boosta.'
      );
      if (onSuccess) {
        onSuccess({
          email: mode === 'login' ? emailOrUsername : signupEmail,
          name: mode === 'signup' ? name : undefined,
        });
      }
    }, 950);
  };

  const heroSpeech = mode === 'login' ? 'Ready to grow?' : "Let's grow together.";

  return (
    <div className={`auth-experience-wrapper ${isStandalonePage ? 'auth-standalone' : ''}`}>
      <div className="auth-stage-container">
        
        {/* =========================================================
            LEFT COLUMN (Desktop Lower-Left, Mobile Lower Area)
            Strictly Left-Aligned: Mode Switcher, Eyebrow, Headline,
            Subtext, Individual Floating Liquid-Glass Fields, Compact CTA
            ========================================================= */}
        <div className="auth-left-column">
          
          {/* 1. Signature Mode Switcher: Active Underline Morphs Left-to-Right */}
          <div className="auth-mode-nav-wrap" role="tablist" aria-label="Authentication Mode">
            <div className="auth-mode-nav">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={`auth-nav-tab ${mode === 'login' ? 'tab-active' : ''}`}
                onClick={() => handleModeSwitch('login')}
              >
                Log In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                className={`auth-nav-tab ${mode === 'signup' ? 'tab-active' : ''}`}
                onClick={() => handleModeSwitch('signup')}
              >
                Sign Up
              </button>
              <span 
                className={`auth-nav-underline ${mode === 'signup' ? 'underline-signup' : 'underline-login'}`}
                aria-hidden="true" 
              />
            </div>
          </div>

          {/* 2. Left-Aligned Dynamic Copy Block (Smooth Transformation) */}
          <div className={`auth-copy-block ${isSwitching ? 'copy-transitioning' : 'copy-active'}`}>
            <span className="auth-eyebrow">
              {mode === 'login' ? 'BOOSTA / ACCESS' : 'BOOSTA / JOIN'}
            </span>
            <h1 className="auth-display-title">
              {mode === 'login' ? (
                <>
                  Turn attention<br />
                  into <span className="auth-gradient-text">growth.</span>
                </>
              ) : (
                <>
                  Your next<br />
                  <span className="auth-gradient-text">growth story.</span>
                </>
              )}
            </h1>
            <p className="auth-subtext">
              {mode === 'login'
                ? 'One clean space to boost your social presence and keep moving.'
                : 'Start with a clean dashboard built to help your socials move.'}
            </p>
          </div>

          {/* 3. Individual Floating Liquid-Glass Fields (NO large background card) */}
          <form 
            onSubmit={handleSubmit} 
            className={`auth-fields-form ${isSwitching ? 'form-transitioning' : 'form-active'}`} 
            noValidate
          >
            
            {/* ==================== SIGNUP FIELDS ==================== */}
            {mode === 'signup' ? (
              <>
                {/* 1. Your Name */}
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

                {/* 2. Email Address */}
                <div className="liquid-glass-field field-stagger-2">
                  <span className="field-semantic-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="signup-email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Email address"
                    autoComplete="email"
                    required
                    className="liquid-input"
                  />
                </div>

                {/* 3. Create a Password */}
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
                    placeholder="Create a password"
                    autoComplete="new-password"
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

                {/* Minimal Clean Legal Notice */}
                <p className="auth-legal-subtle">
                  By continuing, you accept our <a href="#terms" className="legal-link">Terms & Privacy</a>.
                </p>
              </>
            ) : (
              /* ==================== LOGIN FIELDS ==================== */
              <>
                {/* 1. Email or Username */}
                <div className="liquid-glass-field field-stagger-1">
                  <span className="field-semantic-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="identifier"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="Email or username"
                    autoComplete="username"
                    required
                    className="liquid-input"
                  />
                </div>

                {/* 2. Password */}
                <div className="liquid-glass-field field-stagger-2">
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
                    placeholder="Password"
                    autoComplete="current-password"
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

                {/* 3. Minimal Secondary Row: Stay signed in + Forgot password? */}
                <div className="auth-options-row field-stagger-3">
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
              </>
            )}

            {/* Feedback Notice */}
            {authFeedback && (
              <div className="auth-feedback-pill" role="status">
                {authFeedback}
              </div>
            )}

            {/* 4. Compact Action Button (LEFT-ALIGNED, NOT full-width, 145-175px) */}
            <div className="auth-cta-container">
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

          {/* Minimal Security Tagline */}
          <div className="auth-security-subtle">
            <span className="trust-shield-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            <span>256-Bit Encrypted Session · Fast Access</span>
          </div>

        </div>

        {/* =========================================================
            RIGHT COLUMN (Desktop: Right side large visual star;
            Mobile: Upper/middle area)
            Wiggling Liquid Pebble, solo.png cutout, frosted bottom lip,
            and animated responsive speech bubble
            ========================================================= */}
        <div className="auth-right-column">
          <div className="auth-asset-wrap">
            {/* 1. Animated Wiggling Liquid Dudu Pebble */}
            <div className="auth-dudu-pebble doodle-animated" aria-hidden="true">
              <div className="dudu-halo" />
            </div>

            {/* 2. Asset Cutout (solo.png) inside positioning wrapper */}
            <div className="auth-mickey-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/solo.png"
                alt="Boosta Team"
                className="auth-mickey-cutout"
              />
            </div>

            {/* 3. Front Frosted Liquid Glass Lip: Strongly covers the downer part even while wiggling */}
            <div className="auth-dudu-front-lip doodle-animated" aria-hidden="true" />

            {/* 4. Speech Bubble Reacting to Mode Switch with Scale/Fade */}
            <div className={`auth-mickey-speech-bubble bubble-mode-${mode} ${isSwitching ? 'bubble-transitioning' : 'bubble-active'}`}>
              <span className="speech-tail" aria-hidden="true" />
              <span className="speech-pulse-dot" aria-hidden="true" />
              <span className="speech-text">{heroSpeech}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
