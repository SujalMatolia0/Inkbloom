// In-memory rate limiting utility using a Map
// Note: In a serverless environment (like Vercel Edge), this map will reset per lambda instance.
// For true distributed rate limiting, consider Redis (Upstash).

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function rateLimit(ip: string, options: RateLimitOptions = { limit: 10, windowMs: 10000 }) {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  const record = rateLimitMap.get(ip);

  // If no record or record is older than the window, create a new one
  if (!record || record.timestamp < windowStart) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return { success: true };
  }

  // If within the window and under the limit, increment
  if (record.count < options.limit) {
    rateLimitMap.set(ip, { count: record.count + 1, timestamp: record.timestamp });
    return { success: true };
  }

  // Rate limit exceeded
  return { success: false };
}
