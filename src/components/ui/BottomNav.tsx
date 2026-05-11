"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/shop", label: "SHOP" },
  { href: "/portfolio", label: "PORTFOLIO" },
  { href: "/about", label: "ABOUT" },
];

/**
 * BottomNav — LOLO-style floating pill navigation.
 * Fixed at the bottom-center of the viewport.
 * Active link receives a filled dark pill.
 * Hidden on the /portfolio route (3D gallery).
 */
export function BottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Hide on portfolio (3D gallery has its own UI)
  if (pathname?.startsWith("/portfolio")) return null;

  const isActive = (href: string) => {
    if (href === "/shop") {
      return pathname === "/shop" || pathname?.startsWith("/shop/");
    }
    return pathname?.startsWith(href);
  };

  return (
    <motion.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-1"
      style={{
        background: "rgba(238, 235, 229, 0.82)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: "100px",
        border: "1px solid rgba(45, 45, 45, 0.12)",
        padding: "10px 18px",
      }}
    >
      {/* Logo mark */}
      <Link
        href="/"
        className="flex items-center justify-center w-8 h-8 rounded-full mr-2"
        aria-label="Inkbloom Home"
      >
        <span className="font-serif text-base font-bold text-charcoal leading-none select-none">
          I
        </span>
      </Link>

      {/* Nav links */}
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`relative text-[11px] font-semibold uppercase tracking-[0.1em] rounded-full transition-colors duration-200 whitespace-nowrap ${
            isActive(link.href)
              ? "bg-charcoal text-[#EEEBE5]"
              : "text-charcoal/70 hover:text-charcoal"
          }`}
          style={{ padding: "12px 24px" }}
        >
          {link.label}
        </Link>
      ))}

      {/* Cart button */}
      <Link
        href="/cart"
        className="relative flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] rounded-full text-charcoal/70 hover:text-charcoal transition-colors duration-200 ml-2"
        style={{ padding: "12px 24px" }}
        aria-label="View Cart"
      >
        <ShoppingCart size={14} strokeWidth={2} />
        {isHydrated && totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-0.5 w-4 h-4 bg-terracotta text-white text-[9px] font-bold rounded-full flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
        )}
      </Link>
    </motion.nav>
  );
}
