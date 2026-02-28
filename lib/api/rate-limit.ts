interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

// Clean up expired entries periodically to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, record] of store) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}

/**
 * Simple in-memory sliding window rate limiter.
 * Returns true if the request is allowed, false if rate limited.
 *
 * @param identifier - Unique key (e.g., user email or IP address)
 * @param limit - Maximum requests per window
 * @param windowMs - Time window in milliseconds (default: 60s)
 */
export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60_000
): boolean {
  cleanup();

  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Get the client IP address from a request.
 * Checks x-forwarded-for header first (for reverse proxies), then falls back.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}
