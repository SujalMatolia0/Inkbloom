'use client';

import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import React from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const item: ToastItem = { ...toast, id };
    
    set((state) => ({
      // Keep max 5 toasts visible at once
      toasts: [...state.toasts.slice(-4), item],
    }));

    const duration = toast.duration ?? 4500;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

// Convenience helper methods that can be called anywhere
export const toast = {
  success: (message: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'success', message, description, duration }),
  error: (message: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'error', message, description, duration }),
  info: (message: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'info', message, description, duration }),
  warning: (message: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: 'warning', message, description, duration }),
  dismiss: (id: string) => useToastStore.getState().removeToast(id),
  clear: () => useToastStore.getState().clearToasts(),
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-[420px] w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.92, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`pointer-events-auto relative flex items-start gap-3 p-4 rounded-none border shadow-2xl backdrop-blur-md overflow-hidden ${
              item.type === 'success'
                ? 'bg-[#181512]/95 border-emerald-500/40 text-linen'
                : item.type === 'error'
                ? 'bg-[#1d1212]/95 border-red-500/50 text-linen'
                : item.type === 'warning'
                ? 'bg-[#1a1710]/95 border-amber-500/50 text-linen'
                : 'bg-[#14161a]/95 border-terra/40 text-linen'
            }`}
          >
            {/* Left Accent Bar */}
            <div
              className={`absolute top-0 left-0 bottom-0 w-1 ${
                item.type === 'success'
                  ? 'bg-emerald-500'
                  : item.type === 'error'
                  ? 'bg-red-500'
                  : item.type === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-terra'
              }`}
            />

            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {item.type === 'success' && (
                <CheckCircle2 size={18} className="text-emerald-400" />
              )}
              {item.type === 'error' && (
                <AlertCircle size={18} className="text-red-400" />
              )}
              {item.type === 'warning' && (
                <AlertTriangle size={18} className="text-amber-400" />
              )}
              {item.type === 'info' && (
                <Info size={18} className="text-terra-pale" />
              )}
            </div>

            {/* Message & Description */}
            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-[13px] font-semibold tracking-wide text-linen leading-snug">
                {item.message}
              </h4>
              {item.description && (
                <p className="text-[11.5px] text-linen/70 mt-1 leading-relaxed font-sans">
                  {item.description}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => removeToast(item.id)}
              className="shrink-0 p-1 text-linen/40 hover:text-linen transition-colors rounded hover:bg-linen/10 -mr-1 -mt-1 cursor-pointer"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

