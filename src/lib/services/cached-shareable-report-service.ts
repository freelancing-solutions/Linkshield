import { PrismaClient } from '@prisma/client';
import { ShareableReportService, ShareableReportServiceOptions } from './shareable-report-service';
import { CacheService, getCacheService, CacheKeys } from './cache-service';
import { 
  ShareableCheck, 
  CreateShareableReportData, 
  ShareEventData,
  RecentReport
} from '../types/shareable-reports';

export interface CachedShareableReportServiceOptions extends ShareableReportServiceOptions {
  cacheService?: CacheService;
  cacheTTL?: {
    report?: number;
    recentReports?: number;
    shareAnalytics?: number;
    userReports?: number;
    reportStats?: number;
  };
}

export class CachedShareableReportService extends ShareableReportService {
  private cache: CacheService;
  private cacheTTL: Required<NonNullable<CachedShareableReportServiceOptions['cacheTTL']>>;

  constructor(
    prisma: PrismaClient,
    options: CachedShareableReportServiceOptions = {}
  ) {
    super(prisma, options);
    
    this.cache = options.cacheService || getCacheService();
    this.cacheTTL = {
      report: options.cacheTTL?.report || 3600, // 1 hour
      recentReports: options.cacheTTL?.recentReports || 300, // 5 minutes
      shareAnalytics: options.cacheTTL?.shareAnalytics || 1800, // 30 minutes
      userReports: options.cacheTTL?.userReports || 900, // 15 minutes
      reportStats: options.cacheTTL?.reportStats || 1800, // 30 minutes
    };
  }

  /**
   * Get a shareable report by slug with caching
   */
  async getReportBySlug(slug: string, userId?: string): Promise<ShareableCheck | null> {
    const cacheKey = CacheKeys.report(slug);
    
    // Try to get from cache first
    const cached = await this.cache.get<ShareableCheck>(cacheKey);
    if (cached) {
      // Still need to validate access for cached reports
      if (!this.validateReportAccess(cached, userId)) {
        return null;
      }
      return cached;
    }

    // Get from database if not in cache
    const report = await super.getReportBySlug(slug, userId);
    
    if (report) {
      // Cache the report (only if it's public or we have user context)
      if (report.isPublic || userId) {
        await this.cache.set(cacheKey, report, { ttl: this.cacheTTL.report });
      }
    }

    return report;
  }

  /**
   * Get a public shareable report by slug with caching
   */
  async getPublicReportBySlug(slug: string): Promise<ShareableCheck | null> {
    const cacheKey = CacheKeys.report(slug);
    
    // Try to get from cache first
    const cached = await this.cache.get<ShareableCheck>(cacheKey);
    if (cached && cached.isPublic) {
      return cached;
    }

    // Get from database if not in cache
    const report = await super.getPublicReportBySlug(slug);
    
    if (report) {
      // Cache public reports
      await this.cache.set(cacheKey, report, { ttl: this.cacheTTL.report });
    }

    return report;
  }

  /**
   * Create a shareable report and invalidate related caches
   */
  async createShareableReport(data: CreateShareableReportData): Promise<ShareableCheck> {
    const report = await super.createShareableReport(data);
    
    // Invalidate related caches
    await this.invalidateReportCaches(report.id, report.slug);
    
    // Cache the new report if it's public
    if (report.isPublic && report.slug) {
      await this.cache.set(CacheKeys.report(report.slug), report, { 
        ttl: this.cacheTTL.report 
      });
    }

    return report;
  }

  /**
   * Update report privacy and invalidate caches
   */
  async updateReportPrivacy(checkId: string, isPublic: boolean, userId?: string): Promise<void> {
    await super.updateReportPrivacy(checkId, isPublic, userId);
    
    // Invalidate related caches
    await this.invalidateReportCaches(checkId);
  }

  /**
   * Get recent reports with caching
   */
  async getRecentReports(limit: number = 10): Promise<RecentReport[]> {
    const cacheKey = CacheKeys.recentReports();
    
    // Try to get from cache first
    const cached = await this.cache.get<RecentReport[]>(cacheKey);
    if (cached) {
      return cached.slice(0, limit); // Respect the limit parameter
    }

    // Get from database if not in cache
    const reports = await super.getRecentReports(limit);
    
    // Cache the results
    await this.cache.set(cacheKey, reports, { ttl: this.cacheTTL.recentReports });

    return reports;
  }

  /**
   * Track share event and update caches
   */
  async trackShareEvent(data: ShareEventData): Promise<void> {
    await super.trackShareEvent(data);
    
    // Invalidate share analytics cache
    await this.cache.delete(CacheKeys.shareAnalytics(data.checkId));
    
    // If successful share, invalidate report stats
    if (data.success) {
      await this.cache.deletePattern('report_stats:*');
    }
  }

  /**
   * Get sharing analytics with caching
   */
  async getShareAnalytics(checkId: string, userId?: string) {
    const cacheKey = CacheKeys.shareAnalytics(checkId);
    
    // Try to get from cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Get from database if not in cache
    const analytics = await super.getShareAnalytics(checkId, userId);
    
    // Cache the results
    await this.cache.set(cacheKey, analytics, { ttl: this.cacheTTL.shareAnalytics });

    return analytics;
  }

  /**
   * Get user's shareable reports with caching
   */
  async getUserShareableReports(userId: string, limit: number = 20): Promise<ShareableCheck[]> {
    const cacheKey = CacheKeys.userReports(userId);
    
    // Try to get from cache first
    const cached = await this.cache.get<ShareableCheck[]>(cacheKey);
    if (cached) {
      return cached.slice(0, limit); // Respect the limit parameter
    }

    // Get from database if not in cache
    const reports = await super.getUserShareableReports(userId, limit);
    
    // Cache the results
    await this.cache.set(cacheKey, reports, { ttl: this.cacheTTL.userReports });

    return reports;
  }

  /**
   * Delete a shareable report and invalidate caches
   */
  async deleteShareableReport(checkId: string, userId?: string): Promise<void> {
    // Get the report first to know what to invalidate
    const report = await this.prisma.check.findUnique({
      where: { id: checkId },
      select: { slug: true, userId: true }
    });

    await super.deleteShareableReport(checkId, userId);
    
    // Invalidate related caches
    await this.invalidateReportCaches(checkId, report?.slug || undefined);
    
    // Invalidate user reports cache if we have userId
    if (report?.userId) {
      await this.cache.delete(CacheKeys.userReports(report.userId));
    }
  }

  /**
   * Get report statistics with caching
   */
  async getReportStatistics(userId?: string) {
    const cacheKey = CacheKeys.reportStats(userId);
    
    // Try to get from cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Get from database if not in cache
    const stats = await super.getReportStatistics(userId);
    
    // Cache the results
    await this.cache.set(cacheKey, stats, { ttl: this.cacheTTL.reportStats });

    return stats;
  }

  /**
   * Update OG image and invalidate cache
   */
  async updateOGImage(checkId: string, ogImageUrl: string, userId?: string): Promise<void> {
    await super.updateOGImage(checkId, ogImageUrl, userId);
    
    // Invalidate related caches
    await this.invalidateReportCaches(checkId);
  }

  /**
   * Regenerate slug and invalidate caches
   */
  async regenerateSlug(checkId: string, userId?: string): Promise<string> {
    // Get old slug first
    const oldReport = await this.prisma.check.findUnique({
      where: { id: checkId },
      select: { slug: true }
    });

    const newSlug = await super.regenerateSlug(checkId, userId);
    
    // Invalidate old and new slug caches
    if (oldReport?.slug) {
      await this.cache.delete(CacheKeys.report(oldReport.slug));
    }
    await this.invalidateReportCaches(checkId, newSlug);

    return newSlug;
  }

  /**
   * Warm up cache with frequently accessed reports
   */
  async warmUpCache(slugs: string[]): Promise<void> {
    const reports = await Promise.allSettled(
      slugs.map(slug => super.getPublicReportBySlug(slug))
    );

    const cacheOperations = reports
      .map((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          return {
            key: CacheKeys.report(slugs[index]),
            value: result.value,
            ttl: this.cacheTTL.report
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{ key: string; value: ShareableCheck; ttl: number }>;

    if (cacheOperations.length > 0) {
      await this.cache.mset(cacheOperations);
    }
  }

  /**
   * Preload recent reports into cache
   */
  async preloadRecentReports(): Promise<void> {
    const reports = await super.getRecentReports(20); // Get more than default for cache
    await this.cache.set(CacheKeys.recentReports(), reports, { 
      ttl: this.cacheTTL.recentReports 
    });
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    return await this.cache.getStats();
  }

  /**
   * Clear all report-related caches
   */
  async clearAllCaches(): Promise<number> {
    return await this.cache.clear();
  }

  /**
   * Invalidate caches related to a specific report
   */
  private async invalidateReportCaches(checkId: string, slug?: string): Promise<void> {
    const operations: Promise<any>[] = [];

    // Invalidate specific report cache if slug is provided
    if (slug) {
      operations.push(this.cache.delete(CacheKeys.report(slug)));
    }

    // Invalidate recent reports cache
    operations.push(this.cache.delete(CacheKeys.recentReports()));

    // Invalidate share analytics cache
    operations.push(this.cache.delete(CacheKeys.shareAnalytics(checkId)));

    // Invalidate all user reports caches (we don't know which user)
    operations.push(this.cache.deletePattern('user_reports:*'));

    // Invalidate report stats caches
    operations.push(this.cache.deletePattern('report_stats:*'));

    await Promise.allSettled(operations);
  }

  /**
   * Validate report access (override to handle cached reports)
   */
  private validateReportAccess(report: ShareableCheck, userId?: string): boolean {
    // Public reports can be accessed by anyone
    if (report.isPublic) {
      return true;
    }

    // Private reports require authentication and ownership
    if (!userId) {
      return false;
    }

    return report.userId === userId;
  }

  /**
   * Health check including cache health
   */
  async healthCheck() {
    const cacheHealth = await this.cache.healthCheck();
    
    return {
      service: 'healthy',
      cache: cacheHealth
    };
  }
}