import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
const requestCounts = new Map<string, { count: number; lastReset: number }>();
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max 10 requests per minute per IP

export async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 0, lastReset: now });
  }

  const ipData = requestCounts.get(ip)!;

  // Reset count if window has passed
  if (now - ipData.lastReset > WINDOW_SIZE_MS) {
    ipData.count = 0;
    ipData.lastReset = now;
  }

  ipData.count++;

  if (ipData.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too Many Requests', message: 'You have exceeded the rate limit. Please try again later.' },
      { status: 429 }
    );
  }

  return NextResponse.next();
}
