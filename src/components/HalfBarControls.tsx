'use client';

import React, { useState } from 'react';

interface HalfBarControlsProps {
  onGetStarted?: () => void;
  onLogIn?: () => void;
}

export const HalfBarControls: React.FC<HalfBarControlsProps> = ({ onGetStarted, onLogIn }) => {
  const [getStartedText, setGetStartedText] = useState<string>('Get Started');
  const [logInText, setLogInText] = useState<string>('Log In');

  const handleGetStarted = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20, 40, 20]);
    }
    setGetStartedText('Launching...');
    setTimeout(() => {
      setGetStartedText('Get Started');
      if (onGetStarted) onGetStarted();
    }, 200);
  };

  const handleLogIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    setLogInText('Opening...');
    setTimeout(() => {
      setLogInText('Log In');
      if (onLogIn) onLogIn();
    }, 200);
  };

  return (
    <footer className="controls-container">
      <div className="half-bars-wrapper">
        {/* Button 1: Primary "Get Started" */}
        <button 
          className="half-bar-btn primary-btn" 
          id="btnGetStarted" 
          aria-label="Get Started"
          onClick={handleGetStarted}
        >
          <span className="btn-sheen" aria-hidden="true" />
          <span className="btn-text">{getStartedText}</span>
          <span className="btn-icon">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10h12" />
              <path d="M11 5l5 5-5 5" />
            </svg>
          </span>
        </button>

        {/* Button 2: Secondary "Log In" */}
        <button 
          className="half-bar-btn secondary-btn" 
          id="btnLogIn" 
          aria-label="Log In"
          onClick={handleLogIn}
        >
          <span className="btn-text">{logInText}</span>
          <span className="btn-icon">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3H6a2 2 0 00-2 2v10a2 2 0 002 2h6" />
              <path d="M16 10l-4-4m4 4l-4 4m4-4H8" />
            </svg>
          </span>
        </button>
      </div>

      {/* iOS Native Style Home Indicator Bar */}
      <div className="ios-home-indicator" aria-hidden="true" />
    </footer>
  );
};
