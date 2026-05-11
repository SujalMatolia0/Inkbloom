"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ScrollReveal } from "@/components/ScrollReveal";

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Portfolio uses GSAP ScrollTrigger on native scroll events.
  // Lenis replaces native scroll with a virtual one, which breaks
  // ScrollTrigger.onUpdate — the camera never moves without this guard.
  const isPortfolio = pathname?.startsWith("/portfolio");

  if (isPortfolio) {
    return (
      <SessionProvider>
        <ScrollReveal />
        <AnimatePresence mode="wait" initial={false}>
          {children}
        </AnimatePresence>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <ScrollReveal />
      <ReactLenis root>
        <AnimatePresence mode="wait" initial={false}>
          {children}
        </AnimatePresence>
      </ReactLenis>
    </SessionProvider>
  );
}
