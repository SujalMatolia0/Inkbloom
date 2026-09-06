"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <style jsx global>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          :root{--li:#F0EBE3;--ch:#2D2D2D;--te:#C17B5C;--te-pale:#E8C4B0;--te-dark:#9A5C40;--mo:#7B9E87;--bl:#D4A5A5;--dp:#1C1410;--dp2:#241810;--font-display:'Playfair Display',serif;--font-body:'Nunito',sans-serif;--font-ghost:'Syne',sans-serif;}
          html{scroll-behavior:smooth}
          body{font-family:var(--font-body);background:var(--li);color:var(--ch);overflow-x:hidden}
          .accent-bar{height:3px;background:var(--te);position:fixed;top:0;left:0;right:0;z-index:200}
          nav{position:fixed;top:0;left:0;right:0;height:58px;z-index:100;background:rgba(240,235,227,0.96);backdrop-filter:blur(18px);border-bottom:1.5px solid var(--ch);border-top:3px solid var(--te);display:flex;align-items:center;justify-content:space-between;padding:0 48px;}
          .nav-logo{font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--ch);text-decoration:none}
          .nav-logo span{color:var(--te);font-style:italic}
          .nav-links{display:flex;gap:32px;list-style:none}
          .nav-links a{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ch);text-decoration:none;opacity:0.4;transition:opacity 0.18s;padding-bottom:2px}
          .nav-links a:hover,.nav-links a.active{opacity:1;border-bottom:1.5px solid var(--te)}
          .nav-icons{display:flex;gap:14px;align-items:center}
          .nav-icon{width:32px;height:32px;border:1.5px solid var(--ch);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.18s;position:relative}
          .nav-icon:hover{background:var(--ch);color:var(--li)}
          .nav-icon svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.5}
          .hero-wrap{padding-top:59px;display:flex;flex-direction:column}
          .hero{display:grid;grid-template-columns:58% 42%;min-height:calc(100vh - 59px);position:relative}
          .hero-left{background:var(--li);padding:64px 64px 48px;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;overflow:hidden;border-right:4px solid var(--te);}
          .success-icon{width:80px;height:80px;background:rgba(193,123,92,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:24px}
          .check-icon{width:40px;height:40px;stroke:var(--te);stroke-width:2}
        `}</style>

        <div className="accent-bar"></div>
        
        <nav>
          <Link href="/" className="nav-logo">
            Vin<span>yas</span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/">Gallery</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/contact">Commission</Link></li>
            <li><Link href="/journal">Journal</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
          <div className="nav-icons">
            <Link href="/cart" className="nav-icon">
              <svg viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </Link>
            <Link href="/profile" className="nav-icon">
              <svg viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          </div>
        </nav>

        <div className="hero-wrap">
          <div className="hero">
            <div className="hero-left">
              <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                <div className="success-icon">
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: 'var(--ch)',
                  marginBottom: '12px'
                }}>
                  Check Your Email
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(45,45,45,0.6)',
                  marginBottom: '8px'
                }}>
                  If an account exists for <span style={{ fontWeight: 700 }}>{email}</span>,
                </p>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(45,45,45,0.6)',
                  marginBottom: '32px'
                }}>
                  you'll receive a password reset link shortly.
                </p>
                <Link
                  href="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--te)',
                    textDecoration: 'none'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--li:#F0EBE3;--ch:#2D2D2D;--te:#C17B5C;--te-pale:#E8C4B0;--te-dark:#9A5C40;--mo:#7B9E87;--bl:#D4A5A5;--dp:#1C1410;--dp2:#241810;--font-display:'Playfair Display',serif;--font-body:'Nunito',sans-serif;--font-ghost:'Syne',sans-serif;}
        html{scroll-behavior:smooth}
        body{font-family:var(--font-body);background:var(--li);color:var(--ch);overflow-x:hidden}
        .accent-bar{height:3px;background:var(--te);position:fixed;top:0;left:0;right:0;z-index:200}
        nav{position:fixed;top:0;left:0;right:0;height:58px;z-index:100;background:rgba(240,235,227,0.96);backdrop-filter:blur(18px);border-bottom:1.5px solid var(--ch);border-top:3px solid var(--te);display:flex;align-items:center;justify-content:space-between;padding:0 48px;}
        .nav-logo{font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--ch);text-decoration:none}
        .nav-logo span{color:var(--te);font-style:italic}
        .nav-links{display:flex;gap:32px;list-style:none}
        .nav-links a{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ch);text-decoration:none;opacity:0.4;transition:opacity 0.18s;padding-bottom:2px}
        .nav-links a:hover,.nav-links a.active{opacity:1;border-bottom:1.5px solid var(--te)}
        .nav-icons{display:flex;gap:14px;align-items:center}
        .nav-icon{width:32px;height:32px;border:1.5px solid var(--ch);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.18s;position:relative}
        .nav-icon:hover{background:var(--ch);color:var(--li)}
        .nav-icon svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.5}
        .hero-wrap{padding-top:59px;display:flex;flex-direction:column}
        .hero{display:grid;grid-template-columns:58% 42%;min-height:calc(100vh - 59px);position:relative}
        .hero-left{background:var(--li);padding:64px 64px 48px;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;overflow:hidden;border-right:4px solid var(--te);}
        .form-field{width:100%;background:var(--li);border:1.5px solid var(--ch);color:var(--ch);padding:11px 14px;font-family:var(--font-body);font-size:13px;outline:none;transition:border-color 0.18s;margin-bottom:12px;}
        .form-field:focus{border-color:var(--te)}
        .form-field::placeholder{color:rgba(45,45,45,0.4);font-size:12px}
        .btn-primary{width:100%;background:var(--ch);color:var(--li);border:1.5px solid var(--ch);padding:13px 26px;font-family:var(--font-body);font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;box-shadow:4px 4px 0 var(--te);transition:box-shadow 0.18s,transform 0.18s;margin-top:8px;}
        .btn-primary:hover{box-shadow:2px 2px 0 var(--te);transform:translate(2px,2px)}
      `}</style>

      <div className="accent-bar"></div>
      
      <nav>
        <Link href="/" className="nav-logo">
          Vin<span>yas</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="/">Gallery</Link></li>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/contact">Commission</Link></li>
          <li><Link href="/journal">Journal</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
        <div className="nav-icons">
          <Link href="/cart" className="nav-icon">
            <svg viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </Link>
          <Link href="/profile" className="nav-icon">
            <svg viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
        </div>
      </nav>

      <div className="hero-wrap">
        <div className="hero">
          <div className="hero-left">
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '40px',
                  fontWeight: 700,
                  color: 'var(--ch)',
                  letterSpacing: '-0.02em'
                }}>
                  Vin<span style={{ color: 'var(--te)' }}>yas</span>
                </h1>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: 'var(--te)',
                  marginTop: '8px'
                }}>
                  Reset your password
                </p>
              </div>

              <p style={{
                fontSize: '13px',
                color: 'rgba(45,45,45,0.6)',
                textAlign: 'center',
                marginBottom: '32px'
              }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div style={{
                  marginBottom: '18px',
                  padding: '12px 14px',
                  border: '1.5px solid rgba(193,123,92,0.4)',
                  background: 'rgba(193,123,92,0.08)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--te)',
                  letterSpacing: '0.05em'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <input
                  className="form-field"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <Link
                href="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '24px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--te)',
                  textDecoration: 'none'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
