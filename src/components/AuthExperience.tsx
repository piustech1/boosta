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
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Form fields
  const [name, setName] = useState<string>('');
  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [hearAboutUs, setHearAboutUs] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  // Sync mode if initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'transparent', width: '0%' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 9) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#FF5A5F', width: '25%' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#FFA048', width: '50%' };
    if (score === 3 || score === 4) return { score: 3, label: 'Good', color: '#7357FF', width: '75%' };
    return { score: 4, label: 'Strong', color: '#00D26A', width: '100%' };
  };

  const strength = getPasswordStrength(password);

  // Handle smooth mode switch
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

    if (mode === 'signup') {
      if (!name.trim() || !signupEmail.trim() || !password) {
        setAuthFeedback('Please fill in your name, email, and password.');
        return;
      }
      if (password !== confirmPassword) {
        setAuthFeedback('Passwords do not match. Please verify.');
        return;
      }
      if (password.length < 6) {
        setAuthFeedback('Password must be at least 6 characters.');
        return;
      }
    } else {
      if (!emailOrUsername.trim() || !password) {
        setAuthFeedback('Please enter your email/username and password.');
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
      {/* =========================================================
          1. INLINE HERO: Clean & Spacious (No irrelevant badges)
          ========================================================= */}
      <div className="auth-inline-hero">
        {/* Left Column: Clean Bold Headline + Mickey's Speech */}
        <div className="auth-inline-info">
          <h1 className="auth-inline-headline">
            {mode === 'login' ? (
              <>
                Turn attention<br />into <span className="auth-gradient-text">growth.</span>
              </>
            ) : (
              <>
                Start your next<br /><span className="auth-gradient-text">growth story.</span>
              </>
            )}
          </h1>

          {/* Mickey's dynamic reaction speech bubble */}
          <div className={`auth-inline-bubble mode-bubble-${mode}`}>
            <span className="bubble-dot" aria-hidden="true" />
            <span className="bubble-copy">{heroSpeech}</span>
          </div>
        </div>

        {/* Right Column: Prominent Mickey Cutout with Wiggling Dudu */}
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
          2. DEDICATED MODE SWITCHER: 50/50 CSS Grid
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
          3. FLOATING LIQUID-GLASS FORM FIELDS
          ========================================================= */}
      <div className="auth-form-zone">
        <div className={`auth-content-column ${isSwitching ? 'form-fade-out' : 'form-fade-in'}`}>
          <form onSubmit={handleSubmit} className="auth-floating-form" noValidate>
            
            {/* ==================== SIGNUP FIELDS ==================== */}
            {mode === 'signup' ? (
              <>
                {/* 1. Name */}
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
                    placeholder="Full Name"
                    autoComplete="name"
                    required
                    className="liquid-input"
                  />
                </div>

                {/* 2. Email */}
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

                {/* 3. How did you hear about us? Dropdown */}
                <div className="liquid-glass-field field-stagger-3 select-field-wrap">
                  <span className="field-semantic-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 11 18-5-5 18-3-7-10-6z" />
                    </svg>
                  </span>
                  <select
                    name="hearAboutUs"
                    value={hearAboutUs}
                    onChange={(e) => setHearAboutUs(e.target.value)}
                    className="liquid-input liquid-select"
                  >
                    <option value="" disabled>How did you hear about us?</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="x">Twitter / X</option>
                    <option value="telegram">Telegram</option>
                    <option value="google">Google Search</option>
                    <option value="referral">Friend / Recommendation</option>
                    <option value="other">Other</option>
                  </select>
                  <span className="select-chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </div>

                {/* 4. Password + Strength Bar */}
                <div className="field-with-strength field-stagger-4">
                  <div className="liquid-glass-field">
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
                      placeholder="Create password"
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

                  {/* Password Strength Indicator Bar */}
                  {password.length > 0 && (
                    <div className="strength-meter-container" aria-live="polite">
                      <div className="strength-track">
                        <div 
                          className="strength-bar-fill" 
                          style={{ width: strength.width, backgroundColor: strength.color }}
                        />
                      </div>
                      <span className="strength-label" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* 5. Confirm Password */}
                <div className="liquid-glass-field field-stagger-5">
                  <span className="field-semantic-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    required
                    className="liquid-input"
                  />
                  <button
                    type="button"
                    className="field-toggle-eye"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? (
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

                {/* Signup Legal Note */}
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

                {/* 3. Options Row */}
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

                {/* 4. Login Trust & Speed Feature Badge */}
                <div className="login-vitality-pill glass-pill field-stagger-4">
                  <span className="vitality-pulse" aria-hidden="true" />
                  <span className="vitality-text">14.8K+ Active SMM Deliveries Today · Instant Auto-Processing</span>
                </div>
              </>
            )}

            {/* Feedback Notice */}
            {authFeedback && (
              <div className="auth-feedback-pill glass-pill" role="status">
                {authFeedback}
              </div>
            )}

            {/* COMPACT PILL ACTION BUTTON */}
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
        </div>
      </div>

      {/* =========================================================
          4. TRUST & SECURITY MICRO-FOOTER (Grounds and fills lower screen)
          ========================================================= */}
      <footer className="auth-trust-footer">
        <span className="trust-shield-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </span>
        <span>256-Bit Encrypted Session · Instant Live Delivery</span>
      </footer>
    </div>
  );
};
