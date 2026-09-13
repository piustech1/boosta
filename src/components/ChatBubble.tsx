'use client';

import React from 'react';

interface ChatBubbleProps {
  message: string;
  parallaxOffset?: { x: number; y: number };
  onTap?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  parallaxOffset = { x: 0, y: 0 },
  onTap
}) => {
  return (
    <div 
      className="chat-bubble-container" 
      id="chatBubble"
      style={{
        transform: `translate(${parallaxOffset.x * 1.2}px, ${parallaxOffset.y * 1.2}px)`
      }}
      onClick={onTap}
    >
      <div className="glass-bubble chat-bubble">
        {/* Tail pointing toward Mickey's raised waving hand */}
        <div className="chat-tail" />
        
        <div className="chat-content">
          <div className="chat-meta">
            <div className="chat-sender-group">
              <span className="chat-sender">MICKEY</span>
              <span className="verified-badge" title="Verified Creator" aria-label="Verified">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="#0284C7">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </span>
              <span className="online-dot" title="Online now" />
            </div>
            <span className="chat-time">Active now</span>
          </div>
          <p className="chat-message">{message}</p>
          <div className="chat-read-status">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9l3 3L14 3" />
              <path d="M6 9l3 3L15 4" opacity="0.7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
