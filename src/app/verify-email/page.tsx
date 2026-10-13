"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setError("");

    if (!token || !email) {
      setError("Invalid or missing verification parameters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Email verification failed or token has expired.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 2000);
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
      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="sec-label" style={{ color: 'rgba(240,235,227,0.6)' }}>
          Email Verification
        </div>
        <h2 className="comm-right-heading">
          Verify your <em>email.</em>
        </h2>
        <p style={{ fontSize: '12px', color: 'rgba(240,235,227,0.65)', margin: '16px 0 28px', lineHeight: 1.7 }}>
          Click below to confirm ownership of <strong>{email || 'your email'}</strong> and activate your studio account.
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

        {success ? (
          <div style={{
            padding: '20px',
            background: 'rgba(123,158,135,0.15)',
            border: '1.5px solid var(--mo)',
            color: 'var(--li)',
            fontSize: '13px',
            lineHeight: 1.6
          }}>
            Email verified successfully! Redirecting to login...
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || !token || !email}
              className="btn-linen"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Verifying...' : 'Verify Email Address ✓'}
            </button>

            <p style={{
              textAlign: 'center',
              fontSize: '11.5px',
              color: 'rgba(240,235,227,0.55)',
              marginTop: '20px'
            }}>
              Return to{' '}
              <Link href="/login" style={{ color: 'var(--te)', fontWeight: 700 }}>
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <>
      <style jsx global>{`
        :root{--li:#F0EBE3;--ch:#2D2D2D;--te:#C17B5C;--dp:#1C1410;--font-display:'Playfair Display',serif;--font-body:'Nunito',sans-serif;}
        .hero-wrap{padding-top:59px;display:flex;flex-direction:column;min-height:100vh}
        .hero{display:flex;flex:1;justify-content:center;align-items:center;background:var(--dp);padding:64px 24px;}
        .btn-linen{width:100%;background:var(--li);color:var(--ch);border:1.5px solid var(--dp);padding:13px 26px;font-family:var(--font-body);font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;margin-top:8px;}
        .comm-right-heading{font-family:var(--font-display);font-size:clamp(28px,3vw,36px);font-weight:700;color:var(--li)}
        .comm-right-heading em{font-style:italic;color:var(--te)}
        .sec-label{font-size:9.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--te);margin-bottom:10px}
      `}</style>
      <Navbar />
      <div className="hero-wrap">
        <div className="hero">
          <Suspense fallback={<div style={{ color: 'white' }}>Loading page...</div>}>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
}
