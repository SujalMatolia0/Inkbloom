"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "@/components/admin/SidebarNav";
import { LogoutButton } from "@/components/ui/LogoutButton";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile Top Header (hidden on lg screens) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-deep2 border-b border-charcoal/40 z-40 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-linen leading-none">
            Vin<span className="text-terra italic">yas</span>
          </span>
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-terra/80 border-l border-charcoal/60 pl-2">
            Admin
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
          className="w-10 h-10 flex items-center justify-center text-linen border border-charcoal/40 hover:bg-linen/5 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-45 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`lg:hidden fixed top-14 left-0 bottom-0 w-[280px] max-w-[85vw] bg-deep2 border-r border-charcoal/30 flex flex-col z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-3 flex-1">
          <SidebarNav />
        </div>

        <div className="p-5 border-t border-linen/5 bg-black/20 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-terra flex items-center justify-center text-[12px] font-bold text-linen shrink-0">
              {user.name?.[0] || "A"}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-[11px] font-bold text-linen truncate">{user.name || "Admin"}</p>
              <p className="text-[9px] text-linen/30 truncate">{user.email}</p>
            </div>
          </div>
          <LogoutButton className="w-full h-9 border border-linen/10 text-[10px] font-bold uppercase tracking-[0.15em] text-linen/60 hover:bg-linen/5 hover:text-linen transition-all flex items-center justify-center gap-2" />
        </div>
      </aside>

      {/* Desktop Persistent Sidebar (visible on lg screens) */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[280px] h-screen bg-deep2 border-r border-charcoal/30 flex-col z-30 overflow-y-auto scrollbar-hide">
        {/* Logo Section */}
        <div className="p-8 pb-10 flex-shrink-0">
          <Link href="/" className="group block">
            <h1 className="font-serif text-[28px] font-bold text-linen leading-none tracking-tight">
              Vin<span className="text-terra italic group-hover:text-terra-pale transition-colors">yas</span>
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-8 h-[1.5px] bg-terra/40"></div>
              <p className="text-[9.5px] font-bold tracking-[0.3em] uppercase text-terra">
                Studio Vinyas Admin
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="px-4 flex-1">
          <SidebarNav />
        </div>

        {/* User Profile & Logout */}
        <div className="p-6 mt-auto border-t border-linen/5 bg-black/10 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-terra flex items-center justify-center text-[12px] font-bold text-linen shrink-0">
              {user.name?.[0] || "A"}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-[11px] font-bold text-linen truncate">{user.name || "Admin"}</p>
              <p className="text-[9px] text-linen/30 truncate">{user.email}</p>
            </div>
          </div>
          <LogoutButton className="w-full h-10 border border-linen/10 text-[10px] font-bold uppercase tracking-[0.15em] text-linen/60 hover:bg-linen/5 hover:text-linen transition-all flex items-center justify-center gap-2" />
        </div>
      </aside>
    </>
  );
}
