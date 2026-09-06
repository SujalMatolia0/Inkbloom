"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

/**
 * Shop Navigation Component
 * Features:
 * - Dynamic height transition (60px -> 44px) on scroll
 * - Real-time cart item count badge
 * - Navigates to cart page
 */
export function ShopNav() {
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 100], ["60px", "44px"]);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Zustand store selectors
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.nav
      style={{ height }}
      className={`sticky top-0 z-[60] w-full bg-white border-b border-charcoal/10 px-8 flex items-center justify-between transition-shadow duration-300 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <Link href="/shop" className="group">
        <h1 className="font-display font-bold text-2xl tracking-tighter text-charcoal group-hover:text-terracotta transition-colors duration-200 uppercase">
          VINYAS
        </h1>
      </Link>

      <div className="flex items-center gap-6">
        <Link 
          href="/cart"
          className="relative group p-2 text-charcoal hover:text-terracotta transition-colors duration-200 outline-none"
          aria-label="View Cart"
        >
          <ShoppingCart size={24} strokeWidth={2} />
          
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm"
              >
                {totalItems}
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.nav>
  );
}
