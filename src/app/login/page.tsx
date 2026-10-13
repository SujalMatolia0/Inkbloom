"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setResendStatus("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("UNVERIFIED_EMAIL")) {
          setUnverified(true);
          setError("Your email address is unverified. Please verify your email before logging in.");
        } else {
          setError("Invalid email or password");
        }
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendStatus("Sending verification link...");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendStatus("Verification link sent! Please check your email inbox.");
      } else {
        setResendStatus(data.error || "Failed to resend link. Try again later.");
      }
    } catch {
      setResendStatus("Failed to resend verification link.");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <>
      <style jsx global>{`
        :root{--li:#F0EBE3;--ch:#2D2D2D;--te:#C17B5C;--te-pale:#E8C4B0;--te-dark:#9A5C40;--mo:#7B9E87;--bl:#D4A5A5;--dp:#1C1410;--dp2:#241810;--font-display:'Playfair Display',serif;--font-body:'Nunito',sans-serif;--font-ghost:'Syne',sans-serif;}
        .hero-wrap{padding-top:59px;display:flex;flex-direction:column;min-height:100vh}
        .hero{display:grid;grid-template-columns:58% 42%;flex:1;position:relative}
        .hero-left{background:var(--li);padding:64px 64px 48px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;border-right:4px solid var(--te);}
        .bg-type-hero{font-family:var(--font-ghost);font-size:clamp(120px,18vw,220px);font-weight:800;color:transparent;-webkit-text-stroke:1px rgba(45,45,45,0.055);letter-spacing:-0.04em;line-height:0.88;position:absolute;top:0;left:-20px;z-index:0;pointer-events:none;}
        .hero-left-inner{position:relative;z-index:1}
        .eyebrow{font-size:9.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--te);margin-bottom:18px}
        .hero-headline{font-family:var(--font-display);font-weight:700;font-size:clamp(42px,5.5vw,82px);line-height:0.95;letter-spacing:-0.04em;color:var(--ch)}
        .hero-headline em{font-style:italic;color:var(--te)}
        .hero-headline .outline{color:transparent;-webkit-text-stroke:1.5px var(--ch)}
        .hero-body{font-size:13px;color:rgba(45,45,45,0.65);line-height:1.75;max-width:340px;margin:20px 0 32px}
        .hero-stats{display:flex;gap:40px;border-top:1px solid rgba(45,45,45,0.12);padding-top:24px}
        .stat-num{font-family:var(--font-display);font-size:26px;font-weight:700;color:var(--ch)}
        .stat-label{font-size:8px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(45,45,45,0.4);margin-top:2px}
        .hero-right{background:var(--dp);display:flex;flex-direction:column;justify-content:center;padding:64px 64px;position:relative;overflow:hidden}
        .dark-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(240,235,227,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(240,235,227,.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
        .form-field{width:100%;background:rgba(240,235,227,0.15);border:1px solid rgba(240,235,227,0.4);color:var(--li);padding:11px 14px;font-family:var(--font-body);font-size:13px;outline:none;transition:background 0.18s,border-color 0.18s;margin-bottom:12px;}
        .form-field:focus{background:rgba(240,235,227,0.22);border-color:rgba(240,235,227,0.65)}
        .form-field::placeholder{color:rgba(240,235,227,0.45);font-size:12px}
        .btn-linen{width:100%;background:var(--li);color:var(--ch);border:1.5px solid var(--dp);padding:13px 26px;font-family:var(--font-body);font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;box-shadow:4px 4px 0 var(--dp);transition:box-shadow 0.18s,transform 0.18s;margin-top:8px;}
        .btn-linen:hover{box-shadow:2px 2px 0 var(--dp);transform:translate(2px,2px)}
        .comm-right-heading{font-family:var(--font-display);font-size:clamp(28px,3vw,36px);font-weight:700;line-height:1.05;letter-spacing:-0.03em;color:var(--li)}
        .comm-right-heading em{font-style:italic;color:var(--dp)}
        .sec-label{font-size:9.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--te);margin-bottom:10px}
        @media (max-width: 900px) {
          .hero{grid-template-columns:1fr;min-height:auto}
          .hero-left{padding:48px 24px 36px;border-right:none;border-bottom:4px solid var(--te)}
          .hero-right{padding:48px 24px}
          .hero-headline{font-size:clamp(36px,10vw,56px)}
          .bg-type-hero{font-size:clamp(80px,25vw,140px);left:-10px}
          .hero-stats{gap:24px}
        }
      `}</style>

      <Navbar />

      <div className="hero-wrap">
        <div className="hero">
          <div className="hero-left">
            <div className="bg-type-hero">WHERE</div>
            <div className="hero-left-inner">
              <div className="eyebrow">Artist Studio Access</div>
              <h1 className="hero-headline">
                Welcome<br/>
                <em>back.</em>
              </h1>
              <p className="hero-body">
                Sign in to access your studio, manage orders, track commissions, and explore your collection.
              </p>
            </div>
            <div className="hero-stats">
              <div>
                <div className="stat-num">120+</div>
                <div className="stat-label">Works</div>
              </div>
              <div>
                <div className="stat-num">48</div>
                <div className="stat-label">Commissions</div>
              </div>
              <div>
                <div className="stat-num">5★</div>
                <div className="stat-label">Rating</div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="dark-grid"></div>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '400px' }}>
              <div className="sec-label" style={{ color: 'rgba(240,235,227,0.6)' }}>
                Studio Access
              </div>
              <h2 className="comm-right-heading">
                Sign into your <em>studio.</em>
              </h2>
              <p style={{ fontSize: '12px', color: 'rgba(240,235,227,0.65)', margin: '16px 0 28px', lineHeight: 1.7 }}>
                Access your account to manage orders and commissions.
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
                  {unverified && (
                    <div style={{ marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={handleResend}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--li)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '11px'
                        }}
                      >
                        Click here to resend verification link
                      </button>
                    </div>
                  )}
                  {resendStatus && (
                    <div style={{ marginTop: '8px', color: 'var(--li)', fontSize: '11px', fontWeight: 600 }}>
                      {resendStatus}
                    </div>
                  )}
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
                <input
                  className="form-field"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  fontSize: '10px',
                  color: 'rgba(240,235,227,0.5)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: 'var(--te)' }}
                    />
                    Remember me
                  </label>
                  <Link href="/forgot-password" style={{ color: 'var(--te)', textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-linen"
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Signing in...' : 'Sign in to Studio →'}
                </button>

                <div style={{
                  textAlign: 'center',
                  fontSize: '10px',
                  color: 'rgba(240,235,227,0.4)',
                  margin: '20px 0',
                  position: 'relative'
                }}>
                  <span style={{
                    position: 'relative',
                    zIndex: 1,
                    background: 'var(--dp)',
                    padding: '0 12px'
                  }}>Or continue with</span>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '50%',
                    height: '1px',
                    background: 'rgba(240,235,227,0.12)',
                    zIndex: 0
                  }} />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    color: 'var(--li)',
                    border: '1px solid rgba(240,235,227,0.4)',
                    padding: '11px 26px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'background 0.18s',
                    marginBottom: '20px'
                  }}
                >
                  Google
                </button>

                <p style={{
                  textAlign: 'center',
                  fontSize: '11.5px',
                  color: 'rgba(240,235,227,0.55)'
                }}>
                  New to the studio?{' '}
                  <Link href="/register" style={{
                    color: 'var(--te)',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}>
                    Create an account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F0EBE3' }} />}>
      <LoginForm />
    </Suspense>
  );
}
