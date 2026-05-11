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
  RotateCcw,
} from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';

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
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } =
    useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push('/login?callbackUrl=/cart');
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

      const totalPrice = getTotalPrice();

      const orderRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice, currency: 'INR' }),
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
            razorpay_signature: 'demo_signature', // The backend needs to handle this
            userId: session.user?.id,
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            total: totalPrice,
            address: 'Demo Collection Address',
          }),
        });
        const verify = await verifyRes.json();

        if (verify.verified) {
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
        name: 'Inkbloom Art',
        description: 'Original Artwork Purchase',
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
              total: totalPrice,
              address: 'To be collected',
            }),
          });
          const verify = await verifyRes.json();

          if (verify.verified) {
            router.push(
              `/shop/order-success?orderId=${verify.orderId || response.razorpay_order_id}`,
            );
          } else {
            alert('Payment verification failed. Please contact support.');
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
    <div className="min-h-screen bg-linen flex flex-col">
      <Navbar />

      <header className="page-header" style={{ marginTop: '60px' }}>
        <div className="page-header-bg">CART</div>
        <h1 className="page-header-title">
          Your <span>cart.</span>
        </h1>
        <p className="page-header-sub">Your Selection</p>
      </header>

      <div className="flex-1 border-t-[1.5px] border-charcoal">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-24 h-24 border-[1.5px] border-charcoal/20 flex items-center justify-center mb-8">
              <ShoppingBag size={40} className="text-charcoal/20" />
            </div>
            <h2 className="font-serif text-[32px] font-bold text-charcoal mb-4">
              Empty <span className="text-terracotta italic">canvas.</span>
            </h2>
            <p className="text-[13px] text-charcoal/50 mb-8 max-w-md text-center leading-relaxed">
              Your cart is waiting for its first artwork. Explore the gallery to
              find the perfect piece for your collection.
            </p>
            <Link href="/shop" className="btn-primary">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="cart-layout max-w-7xl mx-auto w-full border-x-[1.5px] border-charcoal bg-white/40">
            {/* Left: Items List */}
            <div className="cart-items-section">
              <div className="flex items-center justify-between pb-4 border-b-[1.5px] border-charcoal mb-8">
                <span className="meta-label">Selected Works</span>
                <Link
                  href="/shop"
                  className="meta-label-muted hover:text-charcoal transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="cart-item-row bg-white/60 p-4 border-[1.5px] border-charcoal shadow-[4px_4px_0_var(--te)]"
                  >
                    <Link
                      href={`/shop/${item.slug}`}
                      className="block w-20 h-24 border-[1.5px] border-charcoal relative bg-linen group overflow-hidden"
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
                        <h3 className="cart-item-title">{item.title}</h3>
                      </Link>
                      <p className="cart-item-price">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center border-[1.5px] border-charcoal bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-charcoal/5"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center border-x-[1.5px] border-charcoal text-[13px] font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-charcoal/5"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="meta-label-muted hover:text-red-900 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary */}
            <div className="cart-summary-section border-b-[1.5px] border-charcoal lg:border-b-0">
              <h3 className="font-serif text-[28px] font-bold text-charcoal mb-8 pb-6 border-b-[1.5px] border-charcoal/20">
                Summary
              </h3>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-charcoal/50">
                    Subtotal ({getTotalItems()} items)
                  </span>
                  <span className="text-[15px] font-bold text-charcoal">
                    ₹{getTotalPrice().toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-5 border-b border-charcoal/10">
                  <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-charcoal/50">
                    Shipping
                  </span>
                  <span className="text-[13px] font-bold text-terracotta">
                    Complimentary
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10 pt-6 border-t-[1.5px] border-charcoal">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal/60">
                  Total
                </span>
                <span className="font-serif text-[42px] font-bold text-terracotta leading-none">
                  ₹{getTotalPrice().toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="btn-primary w-full text-center py-4 text-[11px] tracking-[0.14em] shadow-[6px_6px_0_var(--ch)] hover:shadow-[3px_3px_0_var(--ch)] hover:translate-x-[3px] hover:translate-y-[3px]"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <div className="mt-10 space-y-5 pt-8 border-t border-charcoal/10">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 border-[1.5px] border-charcoal/15 flex items-center justify-center shrink-0">
                    <Shield size={18} className="text-charcoal/50" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal mb-1">
                      Secure Checkout
                    </h4>
                    <p className="text-[11px] text-charcoal/55 leading-relaxed">
                      Protected by industry-standard encryption via Razorpay.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 border-[1.5px] border-charcoal/15 flex items-center justify-center shrink-0">
                    <Truck size={18} className="text-charcoal/50" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal mb-1">
                      Global Shipping
                    </h4>
                    <p className="text-[11px] text-charcoal/55 leading-relaxed">
                      Fully insured delivery to your studio or home.
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
