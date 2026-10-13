/**
 * Next.js Server Startup Lifecycle Guard
 * Executes once when the Next.js server boots.
 */
export async function register() {
  if (process.env.NODE_ENV === "production" && process.env.E2E_MODE === "true") {
    throw new Error("SECURITY FATAL: E2E_MODE cannot be set in production environment!");
  }
  const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  const smtpHost = process.env.SMTP_HOST;
  if (isProd && (smtpHost === "127.0.0.1" || smtpHost === "localhost")) {
    throw new Error("SECURITY FATAL: SMTP_HOST cannot point to localhost in production!");
  }
}
