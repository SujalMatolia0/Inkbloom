"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "subscribed">("idle");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("subscribed");
      setEmail("");
    }, 600);
  };

  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            Vin<span>yas</span>
          </div>
          <p className="footer-tagline">
            Original mixed media art &amp; custom commissions from a soulful studio in Ratangarh, Rajasthan.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="newsletter-row w-full max-w-sm">
            <input 
              type="email" 
              className="newsletter-input min-w-0" 
              placeholder="Your email..." 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "subscribed"}
              aria-label="Email address for newsletter"
            />
            <button 
              type="submit" 
              className="newsletter-btn flex items-center justify-center gap-1.5 shrink-0"
              disabled={status === "loading"}
              aria-label="Subscribe to newsletter"
            >
              {status === "loading" ? "..." : status === "subscribed" ? <Check size={14} /> : "Join"}
            </button>
          </form>

          {status === "subscribed" && (
            <p className="text-[11px] text-moss font-bold mt-2">
              ✓ You are subscribed! Welcome to our studio notes.
            </p>
          )}
        </div>
        <div>
          <div className="footer-col-title">Studio</div>
          <ul className="footer-links">
            <li><Link href="/portfolio">Gallery</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/journal">Journal</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Support</div>
          <ul className="footer-links">
            <li><Link href="/shipping">Shipping</Link></li>
            <li><Link href="/returns">Returns</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Connect</div>
          <ul className="footer-links">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2025 Vinyas Studio. Made by hand, made with heart.</div>
        <div className="social-row">
          <Link href="/contact" className="social-link">Contact Us</Link>
          <a href="#" className="social-link">Privacy</a>
          <a href="#" className="social-link">Terms</a>
        </div>
      </div>
    </footer>
  );
}
