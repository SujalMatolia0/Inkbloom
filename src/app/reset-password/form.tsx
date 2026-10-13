"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token || !email) {
      setError("Invalid or missing reset token or email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. The link may have expired.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login?reset=true"), 2000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer" />
      </Head>
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
                  Password Reset!
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(45,45,45,0.7)',
                  marginBottom: '28px'
                }}>
                  Your password has been successfully reset and active sessions invalidated. Redirecting to login...
                </p>
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
                    Create new password
                  </p>
                </div>

                <p style={{
                  fontSize: '13px',
                  color: 'rgba(45,45,45,0.65)',
                  textAlign: 'center',
                  marginBottom: '28px'
                }}>
                  Enter your new password for <strong>{email || 'your email'}</strong>.
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password (min 8 chars)"
                    required
                  />
                  <input
                    className="form-field"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading || !token || !email}
                    className="btn-primary"
                    style={{ opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
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
