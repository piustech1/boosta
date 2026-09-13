'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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

      <main className="app-container auth-page-container">
        <AuthExperience
          initialMode="signup"
          isStandalonePage={true}
          onClose={() => router.push('/')}
        />
      </main>
    </>
  );
}
