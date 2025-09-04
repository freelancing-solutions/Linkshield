import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '../services/analytics-service';
import { db } from '../db';

export interface AnalyticsMiddlewareOptions {
  enableViewTracking?: boolean;
  enableShareTracking?: boolean;
  respectDoNotTrack?: boolean;
  anonymizeIPs?: boolean;
  excludePaths?: string[];
  excludeUserAgents?: string[];
}

export class AnalyticsMiddleware {
  private analyticsService: AnalyticsService;
  private options: Required<AnalyticsMiddlewareOptions>;

  constructor(options: AnalyticsMiddlewareOptions = {}) {
    this.analyticsService = new AnalyticsService(db, undefined, {
      respectDoNotTrack: options.respectDoNotTrack ?? true,
      anonymizeIPs: options.anonymizeIPs ?? true
    });

    this.options = {
      enableViewTracking: options.enableViewTracking ?? true,
      enableShareTracking: options.enableShareTracking ?? true,
      respectDoNotTrack: options.respectDoNotTrack ?? true,
      anonymizeIPs: options.anonymizeIPs ?? true,
      excludePaths: options.excludePaths ?? ['/api/health', '/favicon.ico'],
      excludeUserAgents: options.excludeUserAgents ?? ['bot', 'crawler', 'spider']
    };
  }

  /**
   * Middleware function for Next.js
   */
  async middleware(request: NextRequest): Promise<NextResponse> {
    const response = NextResponse.next();

    // Skip analytics for excluded paths
    if (this.shouldSkipAnalytics(request)) {
      return response;
    }

    // Track report views
    if (this.options.enableViewTracking && this.isReportView(request)) {
      await this.trackReportView(request);
    }

    return response;
  }

  /**
   * Track report view from request
   */
  private async trackReportView(request: NextRequest): Promise<void> {
    try {
      const slug = this.extractSlugFromPath(request.nextUrl.pathname);
      if (!slug) return;

      // Get the check ID from slug
      const check = await db.check.findUnique({
        where: { slug },
        select: { id: true, isPublic: true }
      });

      if (!check || !check.isPublic) return;

      // Extract tracking data from request
      const trackingData = {
        checkId: check.id,
        viewerIp: this.getClientIP(request),
        userAgent: request.headers.get('user-agent') || undefined,
        referrer: request.headers.get('referer') || undefined,
        country: this.getCountryFromRequest(request)
      };

      // Check Do Not Track header
      const doNotTrack = request.headers.get('dnt') === '1';

      // Track the view
      await this.analyticsService.trackView(trackingData, doNotTrack);
    } catch (error) {
      console.error('Failed to track report view:', error);
      // Don't throw error to avoid breaking the request
    }
  }

  /**
   * Check if analytics should be skipped for this request
   */
  private shouldSkipAnalytics(request: NextRequest): boolean {
    const pathname = request.nextUrl.pathname;
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

    // Skip excluded paths
    if (this.options.excludePaths.some(path => pathname.startsWith(path))) {
      return true;
    }

    // Skip bots and crawlers
    if (this.options.excludeUserAgents.some(agent => userAgent.includes(agent))) {
      return true;
    }

    // Skip if it's a prefetch request
    if (request.headers.get('purpose') === 'prefetch') {
      return true;
    }

    return false;
  }

  /**
   * Check if the request is for a report view
   */
  private isReportView(request: NextRequest): boolean {
    return request.nextUrl.pathname.startsWith('/reports/');
  }

  /**
   * Extract slug from report path
   */
  private extractSlugFromPath(pathname: string): string | null {
    const match = pathname.match(/^\/reports\/([^\/]+)$/);
    return match ? match[1] : null;
  }

  /**
   * Get client IP address from request
   */
  private getClientIP(request: NextRequest): string | undefined {
    // Try various headers for IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
      return realIP;
    }

    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    if (cfConnectingIP) {
      return cfConnectingIP;
    }

    // Fallback to connection remote address (may not be available in all environments)
    return request.ip || undefined;
  }

  /**
   * Get country from request headers (if available from CDN)
   */
  private getCountryFromRequest(request: NextRequest): string | undefined {
    // Cloudflare country header
    const cfCountry = request.headers.get('cf-ipcountry');
    if (cfCountry && cfCountry !== 'XX') {
      return cfCountry;
    }

    // Other CDN country headers
    const country = request.headers.get('x-country-code') || 
                   request.headers.get('x-vercel-ip-country');
    
    return country || undefined;
  }
}

/**
 * Create analytics middleware with default options
 */
export function createAnalyticsMiddleware(options?: AnalyticsMiddlewareOptions) {
  const middleware = new AnalyticsMiddleware(options);
  return middleware.middleware.bind(middleware);
}

/**
 * Utility function to track share events from API routes
 */
export async function trackShareEvent(
  checkId: string,
  shareMethod: string,
  success: boolean,
  request?: NextRequest
) {
  try {
    const analyticsService = new AnalyticsService(db);
    
    await analyticsService.trackShareEvent({
      checkId,
      shareMethod,
      success,
      userAgent: request?.headers.get('user-agent') || undefined,
      referrer: request?.headers.get('referer') || undefined,
      ipAddress: request ? getClientIP(request) : undefined
    });
  } catch (error) {
    console.error('Failed to track share event:', error);
  }
}

/**
 * Helper function to get client IP (reused from middleware)
 */
function getClientIP(request: NextRequest): string | undefined {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || 
         request.ip || 
         undefined;
}