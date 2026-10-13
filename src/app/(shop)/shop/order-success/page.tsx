"use client";

import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Package, Mail } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { Navbar } from "@/components/ui/Navbar";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId") || "INK-948271";
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear the cart on successful order landing
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-linen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-6">
        <div className="max-w-[700px] w-full flex flex-col items-center text-center">
          
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-8"
          >
            <div className="w-20 h-20 border-[1.5px] border-charcoal bg-transparent flex items-center justify-center shadow-[6px_6px_0_var(--te)]">
              <CheckCircle2 size={32} className="text-[var(--te)]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="meta-label text-[var(--te)] mb-4">
              Order Confirmed
            </p>
            <h1 className="font-serif text-[48px] md:text-[64px] font-bold leading-[1.05] text-charcoal mb-6">
              Thank <em className="text-[var(--te)]">You</em>
            </h1>
            <p className="text-[13px] font-sans leading-[1.6] text-charcoal/60 mb-12 max-w-[500px] mx-auto">
              Your order has been confirmed. We'll send you a shipping confirmation email as soon as your artwork leaves the studio.
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
          >
            <div className="border-[1.5px] border-charcoal p-6 sm:p-8 text-left bg-linen shadow-[4px_4px_0_var(--ch)] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Package size={16} className="text-[var(--te)] shrink-0" />
                  <span className="meta-label-muted">
                    Order Number
                  </span>
                </div>
                <p 
                  className="font-mono text-xs sm:text-sm md:text-base font-bold text-charcoal break-all tracking-tight select-all bg-white/60 p-2.5 border border-charcoal/20 rounded-none shadow-inner"
                  title={orderId}
                >
                  {orderId}
                </p>
              </div>
            </div>

            <div className="border-[1.5px] border-charcoal p-6 sm:p-8 text-left bg-linen shadow-[4px_4px_0_var(--ch)] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Mail size={16} className="text-[var(--te)] shrink-0" />
                  <span className="meta-label-muted">
                    Confirmation
                  </span>
                </div>
                <p className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                  Email Sent
                </p>
              </div>
              <p className="text-[11px] text-charcoal/60 font-sans mt-2">
                Sent to your registered email
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 w-full justify-center max-w-[500px] mx-auto"
          >
            <Link href="/shop" className="w-full sm:w-auto">
              <button className="btn-primary w-full">
                Continue Shopping
              </button>
            </Link>
            <Link href="/profile/orders" className="w-full sm:w-auto">
              <button className="btn-outline w-full flex items-center gap-2 justify-center">
                Track Order
                <ArrowRight size={14} />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * Order Success Page - Dusty Studio Design
 */
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-linen" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
