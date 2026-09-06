'use client';

import { useState, useEffect } from 'react';
import { Tag, Sparkles, Copy, Check, X } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

interface CouponItem {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  festivalName?: string;
}

export function FestiveBanner() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { applyCoupon, appliedCoupon } = useCartStore();

  useEffect(() => {
    // Check if dismissed in sessionStorage
    const isDismissed = sessionStorage.getItem('vinyas_festive_banner_dismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }

    async function fetchCoupons() {
      try {
        const res = await fetch('/api/coupons/validate');
        if (res.ok) {
          const data = await res.json();
          if (data.coupons && data.coupons.length > 0) {
            setCoupons(data.coupons);
          }
        }
      } catch (e) {
        console.error('Failed to load active coupons for banner', e);
      }
    }

    fetchCoupons();
  }, []);

  // Cycle through festival offers if multiple exist
  useEffect(() => {
    if (coupons.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % coupons.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [coupons.length]);

  if (dismissed) return null;

  const currentCoupon = coupons[currentIndex] || {
    code: 'DIWALI20',
    festivalName: 'Diwali & Festive Utsav',
    description: '20% off all illuminated bottle art & keepsakes',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmount: 1500,
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('vinyas_festive_banner_dismissed', 'true');
  };

  return (
    <div className="relative z-30 bg-[#1A110B] border-b border-[#C17B5C]/30 text-linen/90 px-4 py-2.5 sm:py-2 select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        {/* Left / Center Message */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#C17B5C]/20 border border-[#C17B5C]/50 text-[#F5EFE6] text-[10px] font-bold tracking-wider uppercase">
            <Sparkles size={11} className="text-[#C17B5C]" />
            <span>{currentCoupon.festivalName || 'Festive Offer'}</span>
          </span>

          <span className="text-linen/85 text-[11.5px] sm:text-[12px] font-sans">
            {currentCoupon.description}
            {currentCoupon.minOrderAmount ? (
              <span className="text-linen/50 text-[10.5px] ml-1">
                (Min ₹{currentCoupon.minOrderAmount.toLocaleString('en-IN')})
              </span>
            ) : null}
          </span>
        </div>

        {/* Right Code Badge & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleCopy(currentCoupon.code)}
            title="Click to copy coupon code"
            className="group inline-flex items-center gap-1.5 bg-[#251810] hover:bg-[#C17B5C] text-linen px-2.5 py-1 border border-[#C17B5C]/60 hover:border-[#C17B5C] transition-all cursor-pointer"
          >
            <Tag size={11} className="text-[#C17B5C] group-hover:text-linen transition-colors" />
            <span className="font-mono font-bold tracking-widest text-[11px]">
              {currentCoupon.code}
            </span>
            {copiedCode === currentCoupon.code ? (
              <Check size={12} className="text-emerald-400 group-hover:text-linen ml-0.5" />
            ) : (
              <Copy size={11} className="text-linen/50 group-hover:text-linen ml-0.5" />
            )}
            <span className="text-[10px] uppercase tracking-wider text-linen/70 group-hover:text-linen ml-1 font-semibold">
              {copiedCode === currentCoupon.code ? 'Copied!' : 'Copy'}
            </span>
          </button>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss festive announcement"
            className="text-linen/40 hover:text-linen p-1 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
