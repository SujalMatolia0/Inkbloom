"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

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

  return (
    <>
      <style jsx global>{`
        :root{--li:#F0EBE3;--ch:#2D2D2D;--te:#C17B5C;--te-pale:#E8C4B0;--te-dark:#9A5C40;--mo:#7B9E87;--bl:#D4A5A5;--dp:#1C1410;--dp2:#241810;--font-display:'Playfair Display',serif;--font-body:'Nunito',sans-serif;--font-ghost:'Syne',sans-serif;}
        .hero-wrap{padding-top:59px;display:flex;flex-direction:column;min-height:100vh}
        .hero{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 20px;background:var(--li)}
        .hero-card{width:100%;max-width:440px;background:var(--li);border:1.5px solid var(--ch);box-shadow:4px 4px 0 var(--te);padding:44px 32px;position:relative}
        .form-field{width:100%;background:var(--li);border:1.5px solid var(--ch);color:var(--ch);padding:11px 14px;font-family:var(--font-body);font-size:13px;outline:none;transition:border-color 0.18s;margin-bottom:12px;}
        .form-field:focus{border-color:var(--te)}
        .form-field::placeholder{color:rgba(45,45,45,0.4);font-size:12px}
        .btn-primary{width:100%;background:var(--ch);color:var(--li);border:1.5px solid var(--ch);padding:13px 26px;font-family:var(--font-body);font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;box-shadow:4px 4px 0 var(--te);transition:box-shadow 0.18s,transform 0.18s;margin-top:8px;}
        .btn-primary:hover{box-shadow:2px 2px 0 var(--te);transform:translate(2px,2px)}
        .success-icon{width:70px;height:70px;background:rgba(193,123,92,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
        .check-icon{width:36px;height:36px;stroke:var(--te);stroke-width:2}
        @media (max-width: 640px) {
          .hero{padding:32px 16px}
          .hero-card{padding:32px 20px}
        }
      `}</style>

      <Navbar />

      <div className="hero-wrap">
        <div className="hero">
          <div className="hero-card">
            {success ? (
              <div style={{ textAlign: 'center' }}>
                <div className="success-icon">
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  fontWeight: 700,
                  color: 'var(--ch)',
                  marginBottom: '12px'
                }}>
                  Check Your Email
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(45,45,45,0.7)',
                  marginBottom: '8px'
                }}>
                  If an account exists for <span style={{ fontWeight: 700 }}>{email}</span>,
                </p>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(45,45,45,0.7)',
                  marginBottom: '28px'
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
            ) : (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(32px, 6vw, 40px)',
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
                  color: 'rgba(45,45,45,0.65)',
                  textAlign: 'center',
                  marginBottom: '28px',
                  lineHeight: 1.6
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
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
