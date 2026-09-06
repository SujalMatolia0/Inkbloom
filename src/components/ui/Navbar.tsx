"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut, Settings, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { getTotalItems } = useCartStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Gallery", href: "/portfolio" },
    { label: "Shop", href: "/shop" },
    { label: "Commission", href: "/commission" },
    { label: "Journal", href: "/#journal" },
    { label: "About", href: "/about" },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav
      style={{ top: 0, position: 'fixed' }}
      className="fixed top-0 left-0 right-0 w-full h-[58px] z-50 bg-[#F0EBE3] border-b-[1.5px] border-charcoal border-t-[3px] border-terra px-6 md:px-12 flex items-center justify-between shadow-sm"
    >
      <Link href="/" className="nav-logo">
        Vin<span>yas</span>
      </Link>
      
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-icons">
        <Link href="/cart" className="nav-icon">
          <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          {mounted && getTotalItems() > 0 && (
            <span className="badge-dot">{getTotalItems()}</span>
          )}
        </Link>
        
        {/* Profile Icon with Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="nav-icon"
            aria-label="Profile menu"
          >
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>

          {/* Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-linen border-1.5 border-charcoal shadow-lg z-50">
              {session ? (
                <>
                  <div className="px-4 py-3 border-b border-charcoal/10">
                    <p className="text-[11px] font-semibold text-charcoal">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-[9px] text-charcoal/60 mt-1">
                      {session.user?.email}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-charcoal hover:bg-charcoal/5 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User size={14} />
                      Profile
                    </Link>
                    
                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-charcoal hover:bg-charcoal/5 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <LayoutDashboard size={14} />
                        Admin Panel
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-charcoal hover:bg-charcoal/5 transition-colors text-left"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-1">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-charcoal hover:bg-charcoal/5 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-charcoal hover:bg-charcoal/5 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden ml-2 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
        
        {/* Mobile Menu - Auth Links */}
        {session ? (
          <>
            <Link href="/profile" className="border-t border-charcoal/10 pt-2 mt-2">
              Profile
            </Link>
            {session.user?.role === "ADMIN" && (
              <Link href="/admin">
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-left w-full"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="border-t border-charcoal/10 pt-2 mt-2">
              Login
            </Link>
            <Link href="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
