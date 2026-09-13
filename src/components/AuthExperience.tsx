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

  const handleSocialAuth = (provider: 'Google' | 'Telegram') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(14);
    }
    setAuthFeedback(`Connecting via ${provider}...`);
    setTimeout(() => {
      setAuthFeedback(`${provider} authentication initiated. Redirecting...`);
    }, 600);
  };

  const heroSpeech = mode === 'login' ? 'Ready to grow?' : "Let's grow together.";

  return (
    <div className={`auth-experience-wrapper ${isStandalonePage ? 'auth-standalone' : ''}`}>
      {/* =========================================================
          TIER 1: Prominent Centered Mickey Asset (Takes ~1/4 page)
          With chat bubble anchored directly on the asset image
          ========================================================= */}
      <div className="auth-asset-centered-stage">
        <div className="auth-asset-wrap">
          {/* Animated Wiggling Liquid Dudu Pebble */}
          <div className="auth-dudu-pebble doodle-animated" aria-hidden="true">
            <div className="dudu-halo" />
          </div>

          {/* Mickey Cutout Asset */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/mickey.png"
            alt="Mickey Waving"
            className="auth-mickey-cutout"
          />

          {/* Front Bottom Lip of Wiggling Container: Slightly covers bottom part of Mickey */}
          <div className="auth-dudu-front-lip doodle-animated" aria-hidden="true" />

          {/* Speech Bubble fixed directly ON the Mickey asset */}
          <div className={`auth-mickey-speech-bubble mode-bubble-${mode}`}>
            <span className="speech-tail" aria-hidden="true" />
            <span className="speech-pulse-dot" aria-hidden="true" />
            <span className="speech-text">{heroSpeech}</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          TIER 2: Auth Form Switcher (Below the asset image, centered)
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
          TIER 3: Headline Text (Below the auth switcher, centered)
          ========================================================= */}
      <div className="auth-headline-centered-wrap">
        <h1 className="auth-centered-headline">
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
      </div>

      {/* =========================================================
          TIER 4: Form Fields (Slightly increased height, centered placeholders)
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
                <p className="auth-legal-subtle centered-text">
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

                {/* 4. Social Fast Access (Google & Telegram 1-Tap) */}
                <div className="auth-social-section field-stagger-4">
                  <div className="auth-social-divider">
                    <span className="divider-line" aria-hidden="true" />
                    <span className="divider-text">or continue with</span>
                    <span className="divider-line" aria-hidden="true" />
                  </div>
                  <div className="auth-social-row">
                    <button
                      type="button"
                      className="auth-social-pill-btn"
                      onClick={() => handleSocialAuth('Google')}
                      aria-label="Continue with Google"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" className="social-svg-icon" aria-hidden="true">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      className="auth-social-pill-btn"
                      onClick={() => handleSocialAuth('Telegram')}
                      aria-label="Continue with Telegram"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="#2AABEE" className="social-svg-icon" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-1.97 9.28c-.15.65-.53.81-1.08.51l-3-2.21-1.45 1.4c-.16.16-.3.3-.61.3l.21-3.05 5.56-5.02c.24-.22-.05-.34-.38-.13l-6.87 4.33-2.96-.92c-.64-.2-.66-.64.14-.95l11.55-4.45c.54-.2 1.01.13.86.91z" />
                      </svg>
                      <span>Telegram</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Feedback Notice */}
            {authFeedback && (
              <div className="auth-feedback-pill glass-pill" role="status">
                {authFeedback}
              </div>
            )}

            {/* COMPACT PILL ACTION BUTTON (Centered) */}
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
          TIER 5: Security Micro-Footer
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
