'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthenticatedAppBar } from '@/components/AuthenticatedAppBar';
import { PaymentMethod, DirectPaymentTransaction } from '@/lib/security/payment-verifier';

// Growth Goal Definitions matching Home
export type BoostTypeId = 'followers' | 'likes' | 'views' | 'comments';

interface BoostTypeConfig {
  id: BoostTypeId;
  label: string;
  ratePerUnit: number; // in UGX
  presetQuantities: number[];
  minQuantity: number;
  maxQuantity: number;
  icon: React.ReactNode;
}

const BOOST_TYPES: Record<BoostTypeId, BoostTypeConfig> = {
  followers: {
    id: 'followers',
    label: 'Followers',
    ratePerUnit: 8.5,
    presetQuantities: [500, 1000, 2500, 5000, 10000],
    minQuantity: 100,
    maxQuantity: 250000,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  likes: {
    id: 'likes',
    label: 'Likes',
    ratePerUnit: 4.5,
    presetQuantities: [500, 1000, 2500, 5000, 10000],
    minQuantity: 100,
    maxQuantity: 250000,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  views: {
    id: 'views',
    label: 'Views',
    ratePerUnit: 1.2,
    presetQuantities: [1000, 5000, 10000, 50000, 100000],
    minQuantity: 1000,
    maxQuantity: 1000000,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  comments: {
    id: 'comments',
    label: 'Comments',
    ratePerUnit: 45,
    presetQuantities: [50, 100, 250, 500, 1000],
    minQuantity: 10,
    maxQuantity: 10000,
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
};

// Supported Platforms with brand icons & URL regex validation
interface PlatformConfig {
  id: string;
  name: string;
  brandColor: string;
  blobTheme: string;
  urlPlaceholder: string;
  urlPattern: RegExp;
  exampleUrl: string;
  icon: React.ReactNode;
}

const PLATFORMS_CONFIG: PlatformConfig[] = [
  {
    id: 'TikTok',
    name: 'TikTok',
    brandColor: '#FE2C55',
    blobTheme: 'tiktok-blob',
    urlPlaceholder: 'https://www.tiktok.com/@username/video/...',
    urlPattern: /^(https?:\/\/)?(www\.|vm\.|vt\.)?tiktok\.com\/(@[\w.-]+(\/(video|photo)\/\d+)?|[\w.-]+)/i,
    exampleUrl: 'https://www.tiktok.com/@creator/video/1234567890',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3-.002.6.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.84 1.56V6.87c-.31-.03-.62-.09-.92-.18z" />
      </svg>
    ),
  },
  {
    id: 'Instagram',
    name: 'Instagram',
    brandColor: '#E1306C',
    blobTheme: 'instagram-blob',
    urlPlaceholder: 'https://www.instagram.com/p/... or @username',
    urlPattern: /^(https?:\/\/)?(www\.)?instagram\.com\/([a-zA-Z0-9_.]+(\/(p|reel|tv)\/[a-zA-Z0-9_-]+)?)/i,
    exampleUrl: 'https://www.instagram.com/creator',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: 'YouTube',
    name: 'YouTube',
    brandColor: '#FF0000',
    blobTheme: 'youtube-blob',
    urlPlaceholder: 'https://www.youtube.com/watch?v=... or @channel',
    urlPattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|@|c\/|channel\/)[\w.-]+|youtu\.be\/[\w.-]+)/i,
    exampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'Facebook',
    name: 'Facebook',
    brandColor: '#1877F2',
    blobTheme: 'facebook-blob',
    urlPlaceholder: 'https://www.facebook.com/page or post',
    urlPattern: /^(https?:\/\/)?(www\.|m\.)?(facebook\.com|fb\.watch)\/[\w.-]+/i,
    exampleUrl: 'https://www.facebook.com/creatorpage',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'X',
    name: 'X',
    brandColor: '#182033',
    blobTheme: 'x-blob',
    urlPlaceholder: 'https://x.com/profile or status/...',
    urlPattern: /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\/[\w.-]+/i,
    exampleUrl: 'https://x.com/creator/status/123456789',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

// Marquee platform icons (Visually confident, decorative, non-clickable, smooth continuous animation)
const MARQUEE_PLATFORMS = [
  ...PLATFORMS_CONFIG,
  {
    id: 'Telegram',
    name: 'Telegram',
    brandColor: '#0088cc',
    blobTheme: 'telegram-blob',
    urlPlaceholder: 'https://t.me/...',
    urlPattern: /^(https?:\/\/)?t\.me\/[\w.-]+/i,
    exampleUrl: 'https://t.me/channel',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

interface UserSession {
  email: string;
  name?: string;
  balance?: string | number;
}

function formatQtyShort(qty: number): string {
  if (qty >= 1000000) return `${qty / 1000000}M`;
  if (qty >= 1000) return `${(qty / 1000).toLocaleString()}K`;
  return qty.toLocaleString();
}

// Animated Price Component with smooth numeric interpolation (400ms ease-out)
function AnimatedPrice({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) return;

    const startTime = performance.now();
    const duration = 400; // 400ms settling

    let frameId: number;
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quartic curve
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + (end - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        prevRef.current = end;
      }
    };
    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <span className="figure-total-price-num">
      UGX {displayValue.toLocaleString()}
    </span>
  );
}

function BoostSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // User state
  const [user, setUser] = useState<UserSession | null>(null);

  // Initial parameters
  const initialTypeParam = (searchParams.get('type') as BoostTypeId) || 'followers';
  const initialPlatformParam = searchParams.get('platform') || null;

  // Step 1: Boost Type (Pre-selected from Home, starts completed)
  const [selectedType, setSelectedType] = useState<BoostTypeId>(
    BOOST_TYPES[initialTypeParam] ? initialTypeParam : 'followers'
  );
  const [isEditingType, setIsEditingType] = useState<boolean>(false);

  // Step 2: Platform selection
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(initialPlatformParam);
  const [isPlatformConfirmed, setIsPlatformConfirmed] = useState<boolean>(Boolean(initialPlatformParam));

  // Step 3: Quantity package selection (Presets + Custom Quantity)
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [isQuantityConfirmed, setIsQuantityConfirmed] = useState<boolean>(false);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customQtyInput, setCustomQtyInput] = useState<string>('');
  const [customQtyError, setCustomQtyError] = useState<string | null>(null);

  // Step 4: Destination URL & validation
  const [destinationUrl, setDestinationUrl] = useState<string>('');
  const [isLinkValid, setIsLinkValid] = useState<boolean>(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [isDestinationConfirmed, setIsDestinationConfirmed] = useState<boolean>(false);

  // Step 5: Direct Payment & Order submission states
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [paymentPhone, setPaymentPhone] = useState<string>('0771234567');
  const [paymentPhoneError, setPaymentPhoneError] = useState<string | null>(null);
  const [paymentStage, setPaymentStage] = useState<'method_select' | 'processing' | 'awaiting_approval' | 'failed' | 'success'>('method_select');
  const [activeTransaction, setActiveTransaction] = useState<DirectPaymentTransaction | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<{
    id: string;
    transactionId: string;
    amount: number;
    platform: string;
    type: string;
    quantity: number;
    destinationUrl: string;
    paymentMethod: string;
  } | null>(null);

  // Section references for smooth auto-scroll
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  // Load user session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('boosta_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } catch {
          setUser({ email: 'creator@boosta.app', name: 'Creator' });
        }
      } else {
        setUser({ email: 'creator@boosta.app', name: 'Boosta Creator' });
      }
    }
  }, []);

  // Sync parameters from query string
  useEffect(() => {
    const typeParam = searchParams.get('type') as BoostTypeId;
    if (typeParam && BOOST_TYPES[typeParam]) {
      setSelectedType(typeParam);
    }
    const platParam = searchParams.get('platform');
    if (platParam) {
      setSelectedPlatform(platParam);
      setIsPlatformConfirmed(true);
    }
  }, [searchParams]);

  // Current configurations
  const currentBoostConfig = BOOST_TYPES[selectedType] || BOOST_TYPES.followers;
  const currentPlatformConfig = PLATFORMS_CONFIG.find((p) => p.id === selectedPlatform);

  // Active quantity resolution
  const activeQuantity = selectedQuantity || 0;

  // Real price calculation based on actual rate
  const calculatedPrice = Math.round(activeQuantity * currentBoostConfig.ratePerUnit);

  // Step 1: Change Boost Type
  const handleSelectType = (typeId: BoostTypeId) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setSelectedType(typeId);
    setIsEditingType(false);
    setSelectedQuantity(null);
    setIsQuantityConfirmed(false);
    setIsCustomMode(false);
    setCustomQtyInput('');
    setCustomQtyError(null);
    setDestinationUrl('');
    setIsLinkValid(false);
    setIsDestinationConfirmed(false);
    setLinkError(null);
  };

  // Step 2: Select Platform with tactile feedback & collapse
  const handleSelectPlatform = (platformId: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
    setSelectedPlatform(platformId);

    // Smooth transition before collapsing into summary row
    setTimeout(() => {
      setIsPlatformConfirmed(true);
      setTimeout(() => {
        step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }, 200);
  };

  const handleEditPlatform = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setIsPlatformConfirmed(false);
    setSelectedQuantity(null);
    setIsQuantityConfirmed(false);
    setIsCustomMode(false);
    setCustomQtyInput('');
    setCustomQtyError(null);
    setDestinationUrl('');
    setIsLinkValid(false);
    setIsDestinationConfirmed(false);
    setLinkError(null);
  };

  // Step 3: Select Preset Quantity Package
  const handleSelectPresetQuantity = (qty: number) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
    setSelectedQuantity(qty);
    setIsCustomMode(false);
    setCustomQtyError(null);

    // Smooth transition before collapsing into summary row
    setTimeout(() => {
      setIsQuantityConfirmed(true);
      setTimeout(() => {
        step4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }, 200);
  };

  // Step 3: Activate Custom Mode
  const handleActivateCustomMode = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setIsCustomMode(true);
    setSelectedQuantity(null);
    setCustomQtyError(null);
    setTimeout(() => {
      customInputRef.current?.focus();
    }, 80);
  };

  // Step 3: Handle Custom Quantity Change
  const handleCustomQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setCustomQtyInput(rawVal);
    if (!rawVal) {
      setCustomQtyError(null);
      setSelectedQuantity(null);
      return;
    }

    const num = parseInt(rawVal, 10);
    if (num < currentBoostConfig.minQuantity) {
      setCustomQtyError(`Minimum is ${currentBoostConfig.minQuantity.toLocaleString()}`);
    } else if (num > currentBoostConfig.maxQuantity) {
      setCustomQtyError(`Maximum is ${currentBoostConfig.maxQuantity.toLocaleString()}`);
    } else {
      setCustomQtyError(null);
      setSelectedQuantity(num);
    }
  };

  // Step 3: Confirm Custom Quantity
  const handleConfirmCustomQuantity = () => {
    if (!customQtyInput) {
      setCustomQtyError(`Please enter a quantity`);
      return;
    }
    const num = parseInt(customQtyInput, 10);
    if (num < currentBoostConfig.minQuantity) {
      setCustomQtyError(`Minimum is ${currentBoostConfig.minQuantity.toLocaleString()}`);
      return;
    }
    if (num > currentBoostConfig.maxQuantity) {
      setCustomQtyError(`Maximum is ${currentBoostConfig.maxQuantity.toLocaleString()}`);
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
    setSelectedQuantity(num);
    setCustomQtyError(null);

    setTimeout(() => {
      setIsQuantityConfirmed(true);
      setTimeout(() => {
        step4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }, 200);
  };

  const handleEditQuantity = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setIsQuantityConfirmed(false);
    setDestinationUrl('');
    setIsLinkValid(false);
    setIsDestinationConfirmed(false);
    setLinkError(null);
  };

  // Step 4: URL Validation
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setDestinationUrl(val);

    if (!val) {
      setIsLinkValid(false);
      setIsDestinationConfirmed(false);
      setLinkError(null);
      return;
    }

    if (!currentPlatformConfig) {
      setIsLinkValid(false);
      setIsDestinationConfirmed(false);
      return;
    }

    const testUrl = val.startsWith('http') ? val : `https://${val}`;

    if (currentPlatformConfig.urlPattern.test(testUrl)) {
      setIsLinkValid(true);
      setLinkError(null);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
      // Smooth collapse into summary row after verification and reveal payment checkout
      setTimeout(() => {
        setIsDestinationConfirmed(true);
        setTimeout(() => {
          paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 60);
      }, 320);
    } else {
      setIsLinkValid(false);
      setIsDestinationConfirmed(false);
      setLinkError(`Enter a valid ${currentPlatformConfig.name} link (e.g. ${currentPlatformConfig.exampleUrl})`);
    }
  };

  const handleEditDestination = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setIsDestinationConfirmed(false);
  };

  // Step 5: Direct Payment Handlers
  const handleOpenPaymentModal = () => {
    if (!isLinkValid || activeQuantity <= 0 || !selectedPlatform) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(14);
    setPaymentError(null);
    setPaymentPhoneError(null);
    setPaymentStage('method_select');
    setIsPaymentModalOpen(true);
  };

  const handleInitiateDirectPayment = async () => {
    if (selectedPaymentMethod === 'mtn_momo' || selectedPaymentMethod === 'airtel_money') {
      const cleaned = paymentPhone.replace(/\D/g, '');
      if (cleaned.length < 9) {
        setPaymentPhoneError('Please enter a valid Ugandan phone number (e.g. 0771234567)');
        return;
      }
      setPaymentPhoneError(null);
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(18);
    setIsSubmittingOrder(true);
    setPaymentStage('processing');
    setPaymentError(null);

    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boostType: selectedType,
          platform: selectedPlatform,
          quantity: activeQuantity,
          destinationUrl,
          amount: calculatedPrice,
          paymentMethod: selectedPaymentMethod,
          phoneNumber: paymentPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setPaymentStage('failed');
        setPaymentError(data.error || 'Failed to initiate payment. Please try again.');
        setIsSubmittingOrder(false);
        return;
      }

      setActiveTransaction(data.transaction);
      setPaymentStage('awaiting_approval');
      setIsSubmittingOrder(false);

      // Verify payment confirmation via backend
      setTimeout(async () => {
        try {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionId: data.transaction.transactionId }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success && verifyData.order) {
            setCreatedOrder({
              id: verifyData.order.id,
              transactionId: verifyData.order.transactionId,
              amount: verifyData.order.amount,
              platform: verifyData.order.platform,
              type: currentBoostConfig.label,
              quantity: verifyData.order.quantity,
              destinationUrl: verifyData.order.destinationUrl,
              paymentMethod:
                selectedPaymentMethod === 'mtn_momo'
                  ? 'MTN Mobile Money'
                  : selectedPaymentMethod === 'airtel_money'
                  ? 'Airtel Money'
                  : 'Credit / Debit Card',
            });
            setPaymentStage('success');
            setIsPaymentModalOpen(false);
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([20, 60, 20]);
            }
          } else {
            setPaymentStage('failed');
            setPaymentError(verifyData.error || 'Payment was not confirmed. Please retry.');
          }
        } catch {
          setPaymentStage('failed');
          setPaymentError('Network error checking payment confirmation. Please retry.');
        }
      }, 2200);
    } catch {
      setIsSubmittingOrder(false);
      setPaymentStage('failed');
      setPaymentError('Network error. Unable to contact payment server.');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('boosta_user');
    }
    router.push('/');
  };

  return (
    <>
      {/* Ambient Liquid Canvas */}
      <div className="liquid-canvas" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <main className="app-container boost-setup-container">
        {/* 1. TOP APP BAR (Approved & Locked) */}
        <AuthenticatedAppBar 
          user={user} 
          onLogout={handleLogout} 
          onNavigateService={(p) => handleSelectPlatform(p)} 
        />

        {/* 2. SUPPORTED PLATFORM MARQUEE (Compact, decorative, slow continuous animation) */}
        <section className="platform-marquee-strip" aria-hidden="true">
          <div className="platform-marquee-track">
            {[...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS].map((item, idx) => (
              <div key={`${item.id}-${idx}`} className={`marquee-blob-tile ${item.blobTheme}`}>
                <span className="blob-shadow-underlayer" />
                <span className="blob-satellite-droplet droplet-1" />
                <span className="blob-satellite-droplet droplet-2" />
                <span className="blob-main-layer">
                  <span className="blob-brand-icon">
                    {item.icon}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Toast Feedback Notification if present */}
        {toastMessage && (
          <div className="auth-home-toast-pill" role="status">
            <span className="toast-spark" aria-hidden="true">⚡</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* =========================================================
            CARD 1 — GOAL
            "What do you want to boost?"
            ========================================================= */}
        <section 
          className={`boost-step-card ${!isEditingType ? 'card-resolved' : ''}`}
          aria-label="Step 1: Boost Goal"
        >
          {isEditingType ? (
            <div className="card-active-content step-reveal-anim">
              <div className="card-header-row">
                <span className="card-step-badge">01</span>
                <span className="card-micro-tag">GOAL</span>
              </div>
              <h2 className="card-question-heading">What do you want to boost?</h2>
              <div className="goal-options-grid" role="radiogroup" aria-label="Select boost goal">
                {(Object.keys(BOOST_TYPES) as BoostTypeId[]).map((typeKey) => {
                  const cfg = BOOST_TYPES[typeKey];
                  const isActive = selectedType === typeKey;
                  return (
                    <button
                      key={typeKey}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      className={`goal-option-tile ${isActive ? 'tile-active' : ''}`}
                      onClick={() => handleSelectType(typeKey)}
                    >
                      <span className="goal-tile-icon">{cfg.icon}</span>
                      <span className="goal-tile-name">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card-summary-row">
              <div className="card-summary-meta">
                <span className="card-step-badge badge-done">01</span>
                <span className="card-micro-tag">GOAL</span>
                <span className="card-summary-value">{currentBoostConfig.label}</span>
                <span className="summary-check-pip" aria-hidden="true">✓</span>
              </div>
              <button
                type="button"
                className="card-change-action"
                onClick={() => setIsEditingType(true)}
                aria-label="Change boost goal"
              >
                Change
              </button>
            </div>
          )}
        </section>

        {/* =========================================================
            CARD 2 — PLATFORM
            "Which platform do you want to boost?"
            ========================================================= */}
        <section 
          className={`boost-step-card ${isPlatformConfirmed && currentPlatformConfig ? 'card-resolved' : ''}`} 
          ref={step2Ref} 
          aria-label="Step 2: Platform"
        >
          {isPlatformConfirmed && currentPlatformConfig ? (
            <div className="card-summary-row">
              <div className="card-summary-meta">
                <span className="card-step-badge badge-done">02</span>
                <span className="card-micro-tag">PLATFORM</span>
                <span className="card-summary-value" style={{ color: currentPlatformConfig.brandColor }}>
                  {currentPlatformConfig.name}
                </span>
                <span className="summary-check-pip" aria-hidden="true">✓</span>
              </div>
              <button
                type="button"
                className="card-change-action"
                onClick={handleEditPlatform}
                aria-label="Change platform"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="card-active-content step-reveal-anim">
              <div className="card-header-row">
                <span className="card-step-badge">02</span>
                <span className="card-micro-tag">PLATFORM</span>
              </div>
              <h2 className="card-question-heading">Which platform do you want to boost?</h2>
              <div className="platform-options-grid" role="radiogroup" aria-label="Select platform">
                {PLATFORMS_CONFIG.map((plat) => {
                  const isSelected = selectedPlatform === plat.id;
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`platform-flow-btn ${isSelected ? 'btn-selected' : ''}`}
                      onClick={() => handleSelectPlatform(plat.id)}
                      style={{ '--plat-theme': plat.brandColor } as React.CSSProperties}
                    >
                      <span className="plat-btn-icon" style={{ color: plat.brandColor }}>
                        {plat.icon}
                      </span>
                      <span className="plat-btn-label">{plat.name}</span>
                      {isSelected && <span className="plat-btn-check">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* =========================================================
            CARD 3 — QUANTITY
            "How many do you want?"
            ========================================================= */}
        {isPlatformConfirmed && selectedPlatform && (
          <section 
            className={`boost-step-card step-reveal-anim ${isQuantityConfirmed && selectedQuantity ? 'card-resolved' : ''}`} 
            ref={step3Ref} 
            aria-label="Step 3: Quantity"
          >
            {isQuantityConfirmed && selectedQuantity ? (
              <div className="card-summary-row">
                <div className="card-summary-meta">
                  <span className="card-step-badge badge-done">03</span>
                  <span className="card-micro-tag">QUANTITY</span>
                  <span className="card-summary-value">
                    {selectedQuantity.toLocaleString()} {currentBoostConfig.label}
                  </span>
                  <span className="summary-check-pip" aria-hidden="true">✓</span>
                </div>
                <button
                  type="button"
                  className="card-change-action"
                  onClick={handleEditQuantity}
                  aria-label="Change quantity"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="card-active-content step-reveal-anim">
                <div className="card-header-row">
                  <span className="card-step-badge">03</span>
                  <span className="card-micro-tag">QUANTITY</span>
                </div>
                <h2 className="card-question-heading">How many would you like?</h2>
                
                {/* Presets + Custom Button */}
                <div className="quantity-packages-grid" role="group" aria-label="Available quantities">
                  {currentBoostConfig.presetQuantities.map((qty) => {
                    const isSelected = !isCustomMode && selectedQuantity === qty;
                    return (
                      <button
                        key={qty}
                        type="button"
                        className={`quantity-pkg-tile ${isSelected ? 'tile-selected' : ''}`}
                        onClick={() => handleSelectPresetQuantity(qty)}
                      >
                        <span className="pkg-short-text">{formatQtyShort(qty)}</span>
                        <span className="pkg-full-text">{qty.toLocaleString()}</span>
                        {isSelected && <span className="pkg-check-pip">✓</span>}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className={`quantity-pkg-tile custom-pkg-tile ${isCustomMode ? 'tile-selected' : ''}`}
                    onClick={handleActivateCustomMode}
                  >
                    <span className="pkg-short-text custom-text">Custom</span>
                    <span className="pkg-full-text">Enter amount</span>
                    {isCustomMode && <span className="pkg-check-pip">●</span>}
                  </button>
                </div>

                {/* Custom Numeric Input Shell */}
                {isCustomMode && (
                  <div className="custom-qty-shell step-reveal-anim">
                    <div className="custom-qty-input-row">
                      <input
                        ref={customInputRef}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={`e.g. ${currentBoostConfig.presetQuantities[1] || 1000}`}
                        value={customQtyInput}
                        onChange={handleCustomQtyChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleConfirmCustomQuantity();
                          }
                        }}
                        className={`custom-qty-field ${customQtyError ? 'field-error' : ''}`}
                        aria-label="Custom quantity"
                      />
                      <button
                        type="button"
                        onClick={handleConfirmCustomQuantity}
                        className="custom-qty-confirm-btn"
                      >
                        Confirm
                      </button>
                    </div>
                    <div className="custom-qty-limits">
                      <span>Min: <strong>{currentBoostConfig.minQuantity.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Max: <strong>{currentBoostConfig.maxQuantity.toLocaleString()}</strong></span>
                    </div>
                    {customQtyError && (
                      <p className="custom-qty-error" role="alert">
                        {customQtyError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            CARD 4 — DESTINATION
            "Where should we deliver the boost?"
            ========================================================= */}
        {isQuantityConfirmed && selectedQuantity && (
          <section 
            className={`boost-step-card step-reveal-anim ${isDestinationConfirmed && isLinkValid ? 'card-resolved' : ''}`} 
            ref={step4Ref} 
            aria-label="Step 4: Destination Link"
          >
            {isDestinationConfirmed && isLinkValid ? (
              <div className="card-summary-row">
                <div className="card-summary-meta">
                  <span className="card-step-badge badge-done">04</span>
                  <span className="card-micro-tag">DESTINATION</span>
                  <span className="card-summary-value truncate-url">
                    {destinationUrl.replace(/^https?:\/\/(www\.)?/, '')}
                  </span>
                  <span className="summary-check-pip" aria-hidden="true">✓</span>
                </div>
                <button
                  type="button"
                  className="card-change-action"
                  onClick={handleEditDestination}
                  aria-label="Change destination link"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="card-active-content step-reveal-anim">
                <div className="card-header-row">
                  <span className="card-step-badge">04</span>
                  <span className="card-micro-tag">DESTINATION</span>
                </div>
                <h2 className="card-question-heading">Where should we deliver the boost?</h2>

                <div className="destination-input-shell">
                  <input
                    type="url"
                    inputMode="url"
                    placeholder={currentPlatformConfig?.urlPlaceholder || 'https://...'}
                    value={destinationUrl}
                    onChange={handleUrlChange}
                    className={`destination-field-input ${isLinkValid ? 'field-valid' : linkError ? 'field-error' : ''}`}
                    aria-label="Destination profile or video link"
                    aria-invalid={!isLinkValid && linkError !== null}
                  />
                  {isLinkValid && (
                    <span className="destination-inline-verified" role="status">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {linkError && (
                  <p className="destination-field-error-hint" role="alert">
                    {linkError}
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            CARD 5 — BOOSTA RECEIPT-PRINTER DIRECT ORDER CHECKOUT
            Appears once destination is verified.
            Zero wallet balance. Direct order payment model.
            ========================================================= */}
        {isQuantityConfirmed && selectedQuantity && isLinkValid && (
          <section
            className="receipt-printer-assembly step-reveal-anim"
            ref={paymentRef}
            aria-label="Order Receipt and Direct Payment"
          >
            {/* 1. Metallic Printer Slot Fixture */}
            <div className="printer-slot-fixture" aria-hidden="true">
              <div className="printer-slot-lip">
                <span className="printer-slot-screw left-screw" />
                <div className="printer-slot-mouth">
                  <div className="printer-mouth-slit" />
                </div>
                <span className="printer-slot-screw right-screw" />
              </div>
              <div className="printer-status-bar">
                <span className="printer-live-light" />
                <span className="printer-slot-brand">BOOSTA THERMAL DISPATCH • DIRECT ORDER PAYMENT</span>
              </div>
            </div>

            {/* 2. Physical Emerging Receipt Paper Surface */}
            <div className="receipt-paper-surface">
              {/* Paper Watermark / Header */}
              <div className="receipt-paper-header">
                <div className="receipt-header-branding">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/boosta_icon.png"
                    alt="Boosta Logo"
                    className="receipt-header-icon"
                  />
                  <div className="receipt-header-titles">
                    <span className="receipt-brand-title">BOOSTA OFFICIAL RECEIPT</span>
                    <span className="receipt-order-type">INSTANT SMM DISPATCH</span>
                  </div>
                </div>
                <div className="receipt-meta-stamp">
                  <span className="receipt-badge-direct">DIRECT PAY</span>
                </div>
              </div>

              <div className="receipt-dashed-divider" />

              {/* Order Specifications Table */}
              <div className="receipt-line-items">
                <div className="receipt-item-row">
                  <span className="receipt-item-label">SERVICE</span>
                  <span className="receipt-item-value highlight-brand">
                    {selectedPlatform} {currentBoostConfig.label}
                  </span>
                </div>

                <div className="receipt-item-row">
                  <span className="receipt-item-label">DESTINATION</span>
                  <span className="receipt-item-value receipt-url-truncate" title={destinationUrl}>
                    {destinationUrl.replace(/^https?:\/\/(www\.)?/, '')}
                  </span>
                </div>

                <div className="receipt-item-row">
                  <span className="receipt-item-label">QUANTITY</span>
                  <span className="receipt-item-value highlight-qty">
                    {activeQuantity.toLocaleString()} units
                  </span>
                </div>

                <div className="receipt-item-row">
                  <span className="receipt-item-label">UNIT RATE</span>
                  <span className="receipt-item-value">
                    UGX {currentBoostConfig.ratePerUnit.toFixed(1)} / unit
                  </span>
                </div>

                <div className="receipt-item-row">
                  <span className="receipt-item-label">SPEED &amp; QUALITY</span>
                  <span className="receipt-item-value highlight-speed">
                    High Speed • Non-Drop Guarantee
                  </span>
                </div>

                <div className="receipt-item-row">
                  <span className="receipt-item-label">ESTIMATED START</span>
                  <span className="receipt-item-value">
                    0 – 15 Mins (Instant)
                  </span>
                </div>
              </div>

              <div className="receipt-dashed-divider" />

              {/* Total Price Section */}
              <div className="receipt-total-block">
                <div className="receipt-total-label-group">
                  <span className="receipt-total-eyebrow">TOTAL AMOUNT DUE</span>
                  <span className="receipt-total-caption">No deposit needed • Direct checkout</span>
                </div>
                <div className="receipt-price-hero">
                  <AnimatedPrice value={calculatedPrice} />
                </div>
              </div>

              {/* Jagged / Perforated Serrated Bottom Edge */}
              <div className="receipt-jagged-edge" aria-hidden="true">
                <svg
                  viewBox="0 0 400 12"
                  preserveAspectRatio="none"
                  className="jagged-edge-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0,0 L10,12 L20,0 L30,12 L40,0 L50,12 L60,0 L70,12 L80,0 L90,12 L100,0 L110,12 L120,0 L130,12 L140,0 L150,12 L160,0 L170,12 L180,0 L190,12 L200,0 L210,12 L220,0 L230,12 L240,0 L250,12 L260,0 L270,12 L280,0 L290,12 L300,0 L310,12 L320,0 L330,12 L340,0 L350,12 L360,0 L370,12 L380,0 L390,12 L400,0 L400,12 L0,12 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* Direct Pay Action Button */}
            <div className="receipt-action-wrapper">
              <button
                type="button"
                disabled={isSubmittingOrder}
                onClick={handleOpenPaymentModal}
                className="boosta-direct-pay-button"
                aria-label={`Pay UGX ${calculatedPrice.toLocaleString()} directly`}
              >
                <span className="pay-sheen" aria-hidden="true" />
                <span className="pay-btn-content">
                  <span className="pay-btn-text">PAY NOW</span>
                  <span className="pay-btn-dot">•</span>
                  <span className="pay-btn-amount">UGX {calculatedPrice.toLocaleString()}</span>
                  <span className="pay-btn-arrow">→</span>
                </span>
              </button>
              <div className="receipt-security-note">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Direct Mobile Money &amp; Card checkout. Verified &amp; Idempotent.</span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            LIQUID-GLASS DIRECT PAYMENT MODAL (MTN / Airtel / Card)
            ========================================================= */}
        {isPaymentModalOpen && (
          <div
            className="payment-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
          >
            <div className="payment-modal-card">
              {/* Modal Header */}
              <div className="payment-modal-header">
                <div className="modal-header-meta">
                  <h3 id="payment-modal-title" className="modal-title">
                    {paymentStage === 'awaiting_approval'
                      ? 'Approve on Phone'
                      : paymentStage === 'processing'
                      ? 'Connecting Gateway'
                      : paymentStage === 'failed'
                      ? 'Payment Failed'
                      : 'Direct Payment'}
                  </h3>
                  <p className="modal-subtitle">
                    {paymentStage === 'awaiting_approval'
                      ? `Prompt sent to ${paymentPhone}`
                      : `Amount: UGX ${calculatedPrice.toLocaleString()}`}
                  </p>
                </div>
                {paymentStage !== 'processing' && paymentStage !== 'awaiting_approval' && (
                  <button
                    type="button"
                    className="modal-close-btn"
                    onClick={() => setIsPaymentModalOpen(false)}
                    aria-label="Close payment modal"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Stage: Method Select */}
              {paymentStage === 'method_select' && (
                <div className="payment-method-select-stage">
                  <div className="payment-methods-grid" role="radiogroup" aria-label="Payment method options">
                    {/* MTN Mobile Money */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedPaymentMethod === 'mtn_momo'}
                      className={`payment-method-tile mtn-tile ${
                        selectedPaymentMethod === 'mtn_momo' ? 'method-tile-active' : ''
                      }`}
                      onClick={() => setSelectedPaymentMethod('mtn_momo')}
                    >
                      <div className="method-tile-header">
                        <span className="momo-badge mtn-badge">MTN MoMo</span>
                        <span className="method-radio-indicator" />
                      </div>
                      <span className="method-tile-name">MTN Mobile Money</span>
                      <span className="method-tile-sub">Instant USSD PIN Prompt (*165#)</span>
                    </button>

                    {/* Airtel Money */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedPaymentMethod === 'airtel_money'}
                      className={`payment-method-tile airtel-tile ${
                        selectedPaymentMethod === 'airtel_money' ? 'method-tile-active' : ''
                      }`}
                      onClick={() => setSelectedPaymentMethod('airtel_money')}
                    >
                      <div className="method-tile-header">
                        <span className="momo-badge airtel-badge">Airtel</span>
                        <span className="method-radio-indicator" />
                      </div>
                      <span className="method-tile-name">Airtel Money</span>
                      <span className="method-tile-sub">Instant USSD PIN Prompt (*185#)</span>
                    </button>

                    {/* Debit / Credit Card */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedPaymentMethod === 'card'}
                      className={`payment-method-tile card-tile ${
                        selectedPaymentMethod === 'card' ? 'method-tile-active' : ''
                      }`}
                      onClick={() => setSelectedPaymentMethod('card')}
                    >
                      <div className="method-tile-header">
                        <span className="momo-badge card-badge">Card</span>
                        <span className="method-radio-indicator" />
                      </div>
                      <span className="method-tile-name">Debit / Credit Card</span>
                      <span className="method-tile-sub">Visa, Mastercard, &amp; AMEX</span>
                    </button>
                  </div>

                  {/* Phone Input for Mobile Money */}
                  {(selectedPaymentMethod === 'mtn_momo' || selectedPaymentMethod === 'airtel_money') && (
                    <div className="payment-phone-section">
                      <label htmlFor="momo-phone-input" className="payment-phone-label">
                        Uganda Phone Number
                      </label>
                      <div className="payment-phone-input-row">
                        <span className="phone-country-pill">🇺🇬 +256</span>
                        <input
                          id="momo-phone-input"
                          type="tel"
                          value={paymentPhone}
                          onChange={(e) => {
                            setPaymentPhone(e.target.value);
                            setPaymentPhoneError(null);
                          }}
                          placeholder="0770000000"
                          className={`payment-phone-field ${paymentPhoneError ? 'phone-field-error' : ''}`}
                          aria-invalid={Boolean(paymentPhoneError)}
                        />
                      </div>
                      {paymentPhoneError && (
                        <span className="payment-field-error-text" role="alert">
                          {paymentPhoneError}
                        </span>
                      )}
                      <p className="payment-phone-instruction">
                        You will receive an instant push notification on this phone to authorize payment.
                      </p>
                    </div>
                  )}

                  {selectedPaymentMethod === 'card' && (
                    <div className="payment-card-notice">
                      <p>
                        You will be redirected to the secure PCI-DSS card payment gateway to complete authorization.
                      </p>
                    </div>
                  )}

                  {/* Submit Action */}
                  <button
                    type="button"
                    disabled={isSubmittingOrder}
                    onClick={handleInitiateDirectPayment}
                    className="payment-authorize-btn"
                  >
                    <span>Authorize UGX {calculatedPrice.toLocaleString()}</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              )}

              {/* Stage: Processing */}
              {paymentStage === 'processing' && (
                <div className="payment-status-stage">
                  <div className="payment-spinner" aria-hidden="true" />
                  <h4 className="payment-status-title">Initiating Payment Gateway</h4>
                  <p className="payment-status-desc">
                    Establishing a secure connection with {selectedPaymentMethod === 'mtn_momo' ? 'MTN MoMo' : selectedPaymentMethod === 'airtel_money' ? 'Airtel Money' : 'Card Processor'}...
                  </p>
                </div>
              )}

              {/* Stage: Awaiting Approval (USSD Prompt) */}
              {paymentStage === 'awaiting_approval' && (
                <div className="payment-status-stage awaiting-stage">
                  <div className="ussd-phone-graphic" aria-hidden="true">
                    <div className="ussd-pulse-ring" />
                    <div className="ussd-phone-inner">
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                        <line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                    </div>
                  </div>

                  <h4 className="payment-status-title">USSD Prompt Sent!</h4>
                  <p className="payment-status-desc">
                    Please check your phone <strong>{paymentPhone}</strong> and enter your Mobile Money PIN on the popup screen to authorize <strong>UGX {calculatedPrice.toLocaleString()}</strong>.
                  </p>

                  <div className="awaiting-loader-strip">
                    <div className="awaiting-bar-indeterminate" />
                  </div>
                  <span className="awaiting-caption">Waiting for network payment confirmation...</span>
                </div>
              )}

              {/* Stage: Failed */}
              {paymentStage === 'failed' && (
                <div className="payment-status-stage failed-stage">
                  <div className="payment-failed-icon" aria-hidden="true">✕</div>
                  <h4 className="payment-status-title">Payment Unsuccessful</h4>
                  <p className="payment-status-desc">{paymentError || 'The transaction was declined or timed out. Please try again.'}</p>
                  <button
                    type="button"
                    onClick={() => setPaymentStage('method_select')}
                    className="payment-retry-btn"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            ORDER SUCCESS MODAL (Confirmed Receipt & Delivery Active)
            ========================================================= */}
        {createdOrder && (
          <div className="order-success-overlay" role="dialog" aria-modal="true" aria-labelledby="success-heading">
            <div className="order-success-card">
              <div className="success-icon-badge" aria-hidden="true">
                ✓
              </div>
              <h2 id="success-heading" className="success-title">Payment Verified &amp; Boost Active!</h2>
              <p className="success-meta">
                Order <strong>#{createdOrder.id}</strong> has been confirmed and queued for immediate delivery.
              </p>

              <div className="success-order-receipt-box">
                <div className="success-receipt-row">
                  <span className="receipt-meta-label">Transaction ID</span>
                  <strong className="receipt-code-txt">{createdOrder.transactionId}</strong>
                </div>
                <div className="success-receipt-row">
                  <span className="receipt-meta-label">Boost Service</span>
                  <strong>{createdOrder.quantity.toLocaleString()} {createdOrder.platform} {createdOrder.type}</strong>
                </div>
                <div className="success-receipt-row">
                  <span className="receipt-meta-label">Amount Paid</span>
                  <strong className="receipt-amount-txt">UGX {createdOrder.amount.toLocaleString()}</strong>
                </div>
                <div className="success-receipt-row">
                  <span className="receipt-meta-label">Payment Channel</span>
                  <strong>{createdOrder.paymentMethod}</strong>
                </div>
                <div className="success-receipt-row">
                  <span className="receipt-meta-label">Status</span>
                  <span className="success-live-tag">
                    <span className="status-pulse-dot-green" />
                    Active Dispatch
                  </span>
                </div>
              </div>

              <div className="success-actions-row">
                <button
                  type="button"
                  className="success-cta-home"
                  onClick={() => router.push('/home')}
                >
                  Return to Home
                </button>
                <button
                  type="button"
                  className="success-cta-again"
                  onClick={() => {
                    setCreatedOrder(null);
                    setSelectedQuantity(null);
                    setIsQuantityConfirmed(false);
                    setIsCustomMode(false);
                    setCustomQtyInput('');
                    setDestinationUrl('');
                    setIsLinkValid(false);
                    setIsDestinationConfirmed(false);
                  }}
                >
                  Boost Another
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subtle iOS Home Indicator */}
        <div className="ios-home-indicator" aria-hidden="true" />
      </main>

      {/* 5. VIEWPORT-LEVEL GRADIENT WAVE (Preserved Boosta Signature, Decorative Background) */}
      <div className="auth-bottom-wave" aria-hidden="true">
        <svg
          viewBox="0 0 1000 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="auth-wave-svg"
          role="presentation"
        >
          <defs>
            <linearGradient id="boostaWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7357FF" stopOpacity="0.78" />
              <stop offset="46%" stopColor="#ED5FC9" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#FF9B63" stopOpacity="0.68" />
            </linearGradient>
            <linearGradient id="boostaWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A389FF" stopOpacity="0.48" />
              <stop offset="52%" stopColor="#F48FD8" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#FFB89A" stopOpacity="0.40" />
            </linearGradient>
          </defs>
          {/* Back wave */}
          <path
            d="M0,72 C150,32 300,96 500,58 C700,22 850,88 1000,50 L1000,120 L0,120 Z"
            fill="url(#boostaWaveGrad2)"
          />
          {/* Front wave */}
          <path
            d="M0,88 C180,52 360,108 540,76 C720,44 880,96 1000,68 L1000,120 L0,120 Z"
            fill="url(#boostaWaveGrad)"
          />
        </svg>
        <span className="auth-copyright">© Boosta™ 2026</span>
      </div>
    </>
  );
}

// Fallback skeleton for Suspense boundary
function BoostSetupSkeleton() {
  return (
    <main className="app-container boost-setup-container">
      <div className="authenticated-appbar-wrapper">
        <div className="authenticated-appbar glass-pill" style={{ height: 48 }} />
      </div>
      <div style={{ marginTop: 16, padding: 12 }}>
        <div className="setup-card-skeleton" style={{ width: '100%', height: 180, borderRadius: 20 }} />
      </div>
    </main>
  );
}

export default function BoostSetupPage() {
  return (
    <Suspense fallback={<BoostSetupSkeleton />}>
      <BoostSetupContent />
    </Suspense>
  );
}
