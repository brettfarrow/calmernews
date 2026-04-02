import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // max requests per window for crawlers

// Simple in-memory sliding window rate limiter (per edge instance)
const requestLog: Map<string, number[]> = new Map();

// Clean up old entries periodically to prevent memory leaks
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  for (const [key, timestamps] of requestLog) {
    const filtered = timestamps.filter((t) => t > cutoff);
    if (filtered.length === 0) {
      requestLog.delete(key);
    } else {
      requestLog.set(key, filtered);
    }
  }
}

function isRateLimited(key: string): boolean {
  cleanup();

  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (requestLog.get(key) || []).filter((t) => t > cutoff);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}

// User-agent patterns to rate limit
const RATE_LIMITED_CRAWLERS = [
  'meta-externalagent',
  'facebookexternalhit',
];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  const isCrawler = RATE_LIMITED_CRAWLERS.some((crawler) =>
    userAgent.includes(crawler),
  );

  if (isCrawler) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const key = `crawler:${ip}`;

    if (isRateLimited(key)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'Content-Type': 'text/plain',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and _next internals
    '/((?!_next/static|_next/image|favicon.ico|images/|manifest.json|sw.js|workbox-.*\\.js).*)',
  ],
};
