import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory sliding window rate limiter fallback
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

// Cache Ratelimit instances to avoid recreating them on every request
const limiterCache = new Map<string, Ratelimit>();

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

// Initialize Upstash Redis (supports both standard UPSTASH_* and Vercel Marketplace KV_* env vars)
let redisClient: Redis | null = null;
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

if (redisUrl && redisToken) {
  try {
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  } catch (err) {
    console.warn("Failed to initialize Upstash Redis rate-limiter, falling back to in-memory:", err);
  }
} else if (process.env.NODE_ENV === "production") {
  console.warn("⚠️ Production Warning: Upstash Redis environment variables (UPSTASH_REDIS_REST_* or KV_REST_API_*) are missing. Rate limiting will rely on in-memory instance fallback.");
}

/**
 * Extract clean client IP address from Request headers
 */
export function getClientIp(req: Request): string {
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp && xRealIp.trim()) return xRealIp.trim();

  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  return "127.0.0.1";
}

/**
 * Rate Limit Helper (Supports Upstash Redis + Cached Limiter Instances)
 */
export async function checkRateLimit(
  identifier: string,
  prefix: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<{ success: boolean; remaining?: number }> {
  if (redisClient) {
    try {
      const cacheKey = `${prefix}:${limit}:${windowSeconds}`;
      let ratelimit = limiterCache.get(cacheKey);

      if (!ratelimit) {
        ratelimit = new Ratelimit({
          redis: redisClient,
          limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
          prefix: `rl:${prefix}`,
        });
        limiterCache.set(cacheKey, ratelimit);
      }

      const res = await ratelimit.limit(identifier);
      return { success: res.success, remaining: res.remaining };
    } catch (redisErr) {
      console.error("Upstash Redis rate-limit query failed, falling back to in-memory:", redisErr);
    }
  }

  // In-Memory Fallback
  return rateLimit(`${prefix}:${identifier}`, { limit, windowMs: windowSeconds * 1000 });
}

/**
 * In-memory rate limiting utility
 */
export function rateLimit(key: string, options: RateLimitOptions = { limit: 10, windowMs: 60000 }) {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  const record = rateLimitMap.get(key);

  // Lazy memory cleanup: delete key if expired
  if (record && record.timestamp < windowStart) {
    rateLimitMap.delete(key);
  }

  const currentRecord = rateLimitMap.get(key);

  if (!currentRecord) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return { success: true, remaining: options.limit - 1 };
  }

  if (currentRecord.count < options.limit) {
    rateLimitMap.set(key, { count: currentRecord.count + 1, timestamp: currentRecord.timestamp });
    return { success: true, remaining: options.limit - (currentRecord.count + 1) };
  }

  return { success: false, remaining: 0 };
}
