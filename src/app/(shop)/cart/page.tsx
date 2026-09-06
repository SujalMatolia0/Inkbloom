'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Minus,
  Plus,
  ShoppingBag,
  Shield,
  Truck,
  Tag,
  Sparkles,
  X,
  Check,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { FestiveBanner } from '@/components/shop/FestiveBanner';

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    getFinalTotal,
  } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const subtotal = getTotalPrice();
  const discount = getDiscountAmount();
  const finalTotal = getFinalTotal();

  const handleApplyCoupon = async (codeOverride?: string) => {
    const targetCode = (codeOverride || couponInput).trim().toUpperCase();
    if (!targetCode) return;

    setCouponLoading(true);
    setCouponFeedback(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: targetCode,
          cartTotal: subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        setCouponFeedback({
          text: data.message || 'Invalid or expired coupon.',
          isError: true,
        });
      } else {
        applyCoupon({
          code: data.code,
          description: data.description,
          discountType: data.discountType,
          discountValue: data.discountValue,
          discountAmount: data.discountAmount,
          festivalName: data.festivalName,
          minOrderAmount: data.minOrderAmount,
        });
        setCouponFeedback({
          text: `Applied: Saved ₹${data.discountAmount.toLocaleString('en-IN')}`,
          isError: false,
        });
        setCouponInput('');
      }
    } catch (err) {
      setCouponFeedback({
        text: 'Network error validating coupon. Please try again.',
        isError: true,
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push('/login?callbackUrl=/cart');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js',
      );
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      const orderRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal, currency: 'INR' }),
      });
      const order = await orderRes.json();

      if (order.error) throw new Error(order.error);

      // Handle Demo Mode Bypass
      if (order.demo) {
        console.warn('Bypassing Razorpay Checkout (Demo Mode)');
        const verifyRes = await fetch('/api/checkout/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: order.id,
            razorpay_payment_id: 'pay_demo_' + Math.random().toString(36).substring(7),
            razorpay_signature: 'demo_signature',
            userId: session.user?.id,
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            total: finalTotal,
            couponCode: appliedCoupon?.code || null,
            discount: discount,
            address: 'Studio Vinyas Collector Address',
          }),
        });
        const verify = await verifyRes.json();

        if (verify.verified) {
          clearCart();
          router.push(`/shop/order-success?orderId=${verify.orderId || order.id}`);
        } else {
          alert('Demo payment verification failed.');
        }
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency,
        name: 'Studio Vinyas',
        description: 'Original Art & Keepsake Purchase',
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: session.user?.id,
              items: items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
              })),
              total: finalTotal,
              couponCode: appliedCoupon?.code || null,
              discount: discount,
              address: 'To be confirmed upon dispatch',
            }),
          });
          const verify = await verifyRes.json();

          if (verify.verified) {
            clearCart();
            router.push(
              `/shop/order-success?orderId=${verify.orderId || response.razorpay_order_id}`,
            );
          } else {
            alert('Payment verification failed. Please contact studio support.');
          }
        },
        prefill: {
          name: session.user?.name || '',
          email: session.user?.email || '',
        },
        theme: {
          color: '#C17B5C',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />

      <div className="pt-[58px]">
        <FestiveBanner />

        <header className="page-header border-b-1.5 border-charcoal bg-[#1C1410] text-linen py-10 px-6 md:px-16 relative overflow-hidden">
          <div
            className="absolute right-[-10px] top-[-25px] font-sans text-[120px] sm:text-[160px] font-black tracking-tighter text-transparent select-none pointer-events-none"
            style={{ WebkitTextStroke: '1.5px rgba(240, 235, 227, 0.06)' }}
          >
            SELECTION
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-terra-pale block mb-2">
              ✦ Studio Vinyas Collector Cart
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-linen">
              Your Selected <em className="italic text-terra-pale font-normal">works.</em>
            </h1>
            <p className="text-xs sm:text-sm text-linen/70 font-sans mt-1.5">
              Every item is packed with archival museum care and insured door-to-door.
            </p>
          </div>
        </header>
      </div>

      <div className="flex-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-16">
            <div className="w-24 h-24 border-[1.5px] border-charcoal/20 bg-linen-dark/20 flex items-center justify-center mb-6">
              <ShoppingBag size={38} className="text-charcoal/30" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-3">
              Your cart is <span className="text-terracotta italic">empty.</span>
            </h2>
            <p className="text-[13px] text-charcoal/60 mb-8 max-w-md text-center leading-relaxed font-sans">
              No handcrafted artworks have been added yet. Explore our studio collection to find original charcoal portraits, bridal varmala keepsakes, and resin wall art.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-terra hover:bg-terra-dark text-linen text-[11px] font-bold tracking-widest uppercase px-6 py-3.5 border border-terra transition-all shadow-[3px_3px_0px_0px_#1C1410]"
            >
              <span>Explore Gallery Catalog</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="cart-layout max-w-7xl mx-auto w-full border-x-[1.5px] border-charcoal bg-white/40 my-8">
            {/* Left: Items List */}
            <div className="cart-items-section p-6 lg:p-8">
              <div className="flex items-center justify-between pb-4 border-b-[1.5px] border-charcoal mb-6">
                <div className="flex items-center gap-2">
                  <span className="meta-label">Selected Works</span>
                  <span className="px-2 py-0.5 bg-charcoal text-linen text-[10px] font-mono font-bold">
                    {getTotalItems()}
                  </span>
                </div>
                <Link
                  href="/shop"
                  className="meta-label-muted hover:text-charcoal transition-colors flex items-center gap-1 text-[11px]"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight size={11} />
                </Link>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="cart-item-row bg-white/90 p-4 border-[1.5px] border-charcoal shadow-[4px_4px_0_#1C1410] flex flex-col gap-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link
                          href={`/shop/${item.slug}`}
                          className="block w-20 h-24 border-[1.5px] border-charcoal relative bg-linen group overflow-hidden shrink-0"
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </Link>

                        <div>
                          <Link href={`/shop/${item.slug}`}>
                            <h3 className="font-serif text-lg font-bold text-charcoal hover:text-terracotta transition-colors leading-snug">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="font-sans font-bold text-[14px] text-terracotta mt-0.5">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal/50 mt-0.5 block">
                            Handcrafted Rajasthan Piece
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal/10">
                        <div className="flex items-center border-[1.5px] border-charcoal bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-charcoal/10 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center border-x-[1.5px] border-charcoal text-[13px] font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-charcoal/10 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="font-serif font-bold text-lg text-charcoal block">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-charcoal/40 hover:text-terracotta p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Customization Details Strip if available */}
                    {item.customization && (
                      <div className="p-3 bg-linen/50 border border-charcoal/20 text-xs text-charcoal/85 space-y-1 mt-1 font-sans">
                        <div className="flex items-center gap-2 flex-wrap font-bold text-[10.5px] uppercase tracking-wider text-terra">
                          <span>✦ Custom Specs:</span>
                          {item.customization.style && <span className="bg-charcoal/10 px-1.5 py-0.5 rounded">{item.customization.style}</span>}
                          {item.customization.facesCount && <span className="bg-charcoal/10 px-1.5 py-0.5 rounded">{item.customization.facesCount} Face(s)</span>}
                          {item.customization.size && <span className="bg-charcoal/10 px-1.5 py-0.5 rounded">{item.customization.size}</span>}
                          {item.customization.frame && <span className="bg-charcoal/10 px-1.5 py-0.5 rounded">{item.customization.frame}</span>}
                          {item.customization.moldShape && <span className="bg-charcoal/10 px-1.5 py-0.5 rounded">{item.customization.moldShape}</span>}
                        </div>

                        {item.customization.namesDate && (
                          <div className="text-[11px] text-charcoal/80">
                            <strong>Engraved Details:</strong> {item.customization.namesDate}
                          </div>
                        )}

                        {item.customization.instructions && (
                          <div className="text-[11px] text-charcoal/70 italic">
                            &ldquo;{item.customization.instructions}&rdquo;
                          </div>
                        )}

                        {item.customization.isPhysicalCourierRequired && (
                          <div className="text-[10.5px] text-amber-900 bg-amber-100/70 p-1.5 border border-amber-300 font-medium mt-1">
                            📦 <strong>Courier Notice:</strong> Please courier your dried marriage garland / physical keepsake to Studio Vinyas (Ratangarh, Rajasthan). Packing instructions provided on checkout.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary & Festival Offers */}
            <div className="cart-summary-section border-t-[1.5px] lg:border-t-0 lg:border-l-[1.5px] border-charcoal p-6 lg:p-8 bg-linen/50">
              <h3 className="font-serif text-2xl font-bold text-charcoal mb-6 pb-4 border-b-[1.5px] border-charcoal/20">
                Order Summary
              </h3>

              {/* Coupon / Festival Discount Section */}
              <div className="mb-6 p-4 bg-white border-[1.5px] border-charcoal shadow-[3px_3px_0_#1C1410]">
                <div className="flex items-center gap-1.5 mb-3 text-charcoal">
                  <Sparkles size={14} className="text-terracotta" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Festival Offer &amp; Coupon
                  </span>
                </div>

                {appliedCoupon ? (
                  <div className="bg-[#1C1410] text-linen p-3 border border-terra flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-terra-pale font-mono font-bold text-[12px] tracking-wider">
                          ✦ {appliedCoupon.code}
                        </span>
                        <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-terra/30 text-[#F5EFE6] border border-terra/50">
                          {appliedCoupon.festivalName || 'Active'}
                        </span>
                      </div>
                      <p className="text-[11px] text-linen/75 mt-1 font-sans">
                        {appliedCoupon.description} · Saved ₹{discount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      title="Remove applied coupon"
                      className="text-linen/50 hover:text-linen p-1 hover:bg-white/10 transition-colors"
                      aria-label="Remove coupon"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-stretch gap-2">
                      <input
                        type="text"
                        placeholder="ENTER CODE (E.G. DIWALI20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="flex-1 px-3 py-2 border-[1.5px] border-charcoal text-[11.5px] font-mono uppercase bg-linen/30 focus:outline-none focus:bg-white placeholder:text-charcoal/40"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2 bg-charcoal hover:bg-terracotta text-linen text-[11px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 shrink-0"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>

                    {couponFeedback && (
                      <div
                        className={`mt-2 text-[11px] font-sans flex items-center gap-1.5 ${
                          couponFeedback.isError ? 'text-red-700' : 'text-emerald-800'
                        }`}
                      >
                        {couponFeedback.isError ? (
                          <AlertCircle size={13} className="shrink-0" />
                        ) : (
                          <Check size={13} className="shrink-0" />
                        )}
                        <span>{couponFeedback.text}</span>
                      </div>
                    )}

                    {/* Quick Suggestion Chips */}
                    <div className="mt-3 pt-3 border-t border-charcoal/10">
                      <span className="text-[9.5px] uppercase font-bold tracking-widest text-charcoal/50 block mb-2">
                        Active Festival Offers:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon('DIWALI20')}
                          className="px-2 py-1 text-[10px] font-mono bg-linen border border-charcoal/30 hover:border-terracotta hover:text-terracotta transition-colors flex items-center gap-1"
                        >
                          <Tag size={10} />
                          <span>DIWALI20 (20% Off)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon('BANDHAN15')}
                          className="px-2 py-1 text-[10px] font-mono bg-linen border border-charcoal/30 hover:border-terracotta hover:text-terracotta transition-colors flex items-center gap-1"
                        >
                          <Tag size={10} />
                          <span>BANDHAN15 (15% Off)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon('VINYASFIRST')}
                          className="px-2 py-1 text-[10px] font-mono bg-linen border border-charcoal/30 hover:border-terracotta hover:text-terracotta transition-colors flex items-center gap-1"
                        >
                          <Tag size={10} />
                          <span>VINYASFIRST (₹500 Off)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold uppercase tracking-[0.1em] text-charcoal/60">
                    Subtotal ({getTotalItems()} items)
                  </span>
                  <span className="font-bold text-charcoal">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {appliedCoupon && discount > 0 && (
                  <div className="flex justify-between items-center text-[13px] text-[#A25736] font-bold">
                    <span className="uppercase tracking-[0.1em] flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>Festival Discount ({appliedCoupon.code})</span>
                    </span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[13px] pb-4 border-b border-charcoal/15">
                  <span className="font-bold uppercase tracking-[0.1em] text-charcoal/60">
                    Insured Shipping
                  </span>
                  <span className="font-bold text-terracotta uppercase text-[11.5px] tracking-wider">
                    Complimentary across India
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-end mb-8 pt-4 border-t-[1.5px] border-charcoal">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal/60 block">
                    Payable Total
                  </span>
                  <span className="text-[10px] text-charcoal/50 font-sans">
                    Includes all GST &amp; taxes
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-4xl font-bold text-terracotta leading-none">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="btn-primary w-full text-center py-4 text-[11.5px] tracking-[0.16em] shadow-[5px_5px_0_#1C1410] hover:shadow-[2px_2px_0_#1C1410] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                {isProcessing ? 'Connecting Secure Gateway...' : 'Proceed to Checkout ✦'}
              </button>

              <div className="mt-8 space-y-4 pt-6 border-t border-charcoal/15">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 border-[1.5px] border-charcoal/20 flex items-center justify-center shrink-0 bg-white">
                    <Shield size={16} className="text-terracotta" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal mb-0.5">
                      Encrypted Razorpay Checkout
                    </h4>
                    <p className="text-[11px] text-charcoal/60 leading-relaxed font-sans">
                      UPI (GPay/PhonePe), Credit Cards, Net Banking, and EMI supported.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 border-[1.5px] border-charcoal/20 flex items-center justify-center shrink-0 bg-white">
                    <Truck size={16} className="text-terracotta" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal mb-0.5">
                      Archival Wooden Crate Dispatch
                    </h4>
                    <p className="text-[11px] text-charcoal/60 leading-relaxed font-sans">
                      Double-bubble cushioned with tamper-evident seal and tracking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
