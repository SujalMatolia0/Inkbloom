"use client";

import { motion } from "framer-motion";
import { cn } from "@/theme/components";

interface CreativeLoaderProps {
  size?: "sm" | "md" | "lg" | "fullscreen";
  className?: string;
}

export function CreativeLoader({ size = "md", className }: CreativeLoaderProps) {
  const containerSize = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-16 h-16",
    fullscreen: "w-full h-[60vh]",
  }[size];

  const dotSize = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    fullscreen: "w-3 h-3",
  }[size];

  return (
    <div className={cn("flex items-center justify-center gap-1.5", containerSize, className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn("bg-terra rounded-full", dotSize)}
          initial={{ opacity: 0.3, y: 0 }}
          animate={{ opacity: 1, y: [-4, 4, -4] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

export function PageTransitionLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-linen/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <motion.div 
          className="font-ghost text-[80px] font-extrabold text-transparent [-webkit-text-stroke:2px_rgba(45,45,45,0.08)] leading-none tracking-tighter"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.98, 1, 0.98] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          INKBLM
        </motion.div>
        <CreativeLoader size="lg" />
      </div>
    </div>
  );
}
