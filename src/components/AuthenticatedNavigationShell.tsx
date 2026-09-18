'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { CollapsibleFabNavigation } from './CollapsibleFabNavigation';

const UNAUTHENTICATED_ROUTES = ['/', '/login', '/signup'];

export const AuthenticatedNavigationShell: React.FC = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState<boolean>(false);
  const [homeSlot, setHomeSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (pathname === '/home') {
      const updateSlot = () => {
        const el = document.getElementById('home-fab-slot');
        if (el) {
          setHomeSlot(el);
        } else {
          const timer = setTimeout(() => {
            setHomeSlot(document.getElementById('home-fab-slot'));
          }, 40);
          return () => clearTimeout(timer);
        }
      };
      return updateSlot();
    } else {
      setHomeSlot(null);
    }
  }, [pathname, mounted]);

  if (!mounted) return null;

  // Never render navigation on public landing or auth screens
  if (UNAUTHENTICATED_ROUTES.includes(pathname)) {
    return null;
  }

  // On Home page: render in-flow directly below "Talk to Us" inside #home-fab-slot
  if (pathname === '/home') {
    if (homeSlot) {
      return createPortal(<CollapsibleFabNavigation variant="in-flow" />, homeSlot);
    }
    return null;
  }

  // On all other authenticated pages (Orders, Profile, Boost): persistent bottom navigation
  return <CollapsibleFabNavigation variant="persistent" />;
};
