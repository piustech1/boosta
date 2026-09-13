'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FloatingAppBar } from '@/components/FloatingAppBar';
import { AuthExperience } from '@/components/AuthExperience';

export default function SignupPage() {
  const router = useRouter();

  return (
    <>
      {/* Ambient Liquid Background with glowing animated orbs */}
      <div className="liquid-canvas" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <main className="app-container">
        {/* Top Styled App Bar */}
        <FloatingAppBar 
          onNavigate={(mode) => router.push(mode === 'login' ? '/login' : '/signup')} 
          onHome={() => router.push('/')}
        />

        <AuthExperience
          initialMode="signup"
          isStandalonePage={true}
          onClose={() => router.push('/')}
          onModeChange={(mode) => router.push(mode === 'login' ? '/login' : '/signup')}
        />
      </main>
    </>
  );
}
