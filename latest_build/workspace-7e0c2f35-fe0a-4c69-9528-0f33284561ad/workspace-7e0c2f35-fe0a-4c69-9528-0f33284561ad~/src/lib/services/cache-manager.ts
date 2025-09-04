import { CachedShareableReportService } from './cached-shareable-report-service';
import { getCacheService } from './cache-service';
import { db } from '../db';

export interface CacheWarmupOptions {
  recentReportsCount?: number;
  popularReportsCount?: number;
  userReportsCount?: number;
}

export class CacheManager {
  private service: CachedShareableReportService;
  private cache = getCacheService();

  constructor(service?: CachedShareableReportService) {
    this.service = service || new CachedShareableReportService(db);
  }

  /**
   * Warm up cache with frequently accessed data
   */
  async warmUpCache(options: CacheWarmupOptions = {}): Promise<void> {
    const {
      recentReportsCount = 20,
      popularReportsCount = 50,
      userReportsCount = 10
    } = options;

    console.log('Starting cache warmup...');

    try {
      // Warm up recent reports
      await this.service.preloadRecentReports();
      console.log('✓ Recent reports cached');

      // Warm up popular reports (most shared)
      const popularReports = await db.check.findMany({
        where: {
          isPublic: true,
          slug: { not: null },
          shareCount: { gt: 0 }
        },
        select: { slug: true },
        orderBy: { shareCount: 'desc' },
        take: popularReportsCount
      });

      if (popularReports.length > 0) {
        const slugs = popularReports.map(r => r.slug!);
        await this.service.warmUpCache(slugs);
        console.log(`✓ ${popularReports.length} popular reports cached`);
      }

      // Warm up recent user reports for active users
      const activeUsers = await db.user.findMany({
        where: {
          checks: {
            some: {
              slug: { not: null },
              createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
            }
          }
        },
        select: { id: true },
        take: userReportsCount
      });

      for (const user of activeUsers) {
        await this.service.getUserShareableReports(user.id, 10);
      }
      console.log(`✓ Reports for ${activeUsers.length} active users cached`);

      console.log('Cache warmup completed successfully');
    } catch (error) {
      console.error('Cache warmup failed:', error);
      throw error;
    }
  }

  /**
   * Invalidate stale cache entries
   */
  async invalidateStaleEntries(): Promise<void> {
    console.log('Invalidating stale cache entries...');

    try {
      // Get all cached report keys
      const reportKeys = await this.cache.mget(['report:*']);
      let invalidatedCount = 0;

      // Check each cached report against database
      for (const key of reportKeys) {
        if (!key) continue;
        
        const slug = key.toString().replace('report:', '');
        const dbReport = await db.check.findFirst({
          where: { slug },
          select: { updatedAt: true }
        });

        if (!dbReport) {
          // Report no longer exists, invalidate cache
          await this.cache.delete(`report:${slug}`);
          invalidatedCount++;
        }
      }

      console.log(`✓ Invalidated ${invalidatedCount} stale entries`);
    } catch (error) {
      console.error('Failed to invalidate stale entries:', error);
      throw error;
    }
  }

  /**
   * Get cache performance metrics
   */
  async getCacheMetrics() {
    const stats = await this.cache.getStats();
    
    // Get hit/miss ratios by checking some sample keys
    const sampleKeys = [
      'recent_reports',
      'report_stats:global'
    ];

    const hitMissData = await Promise.all(
      sampleKeys.map(async (key) => ({
        key,
        exists: await this.cache.exists(key),
        ttl: await this.cache.ttl(key)
      }))
    );

    return {
      ...stats,
      sampleKeys: hitMissData,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Optimize cache by removing least accessed entries
   */
  async optimizeCache(): Promise<void> {
    console.log('Optimizing cache...');

    try {
      const stats = await this.cache.getStats();
      
      // If memory usage is high, clear some caches
      const memoryThreshold = 100 * 1024 * 1024; // 100MB
      
      if (stats.memoryUsage > memoryThreshold) {
        // Clear user-specific caches first (they're less critical)
        const userCacheCount = await this.cache.deletePattern('user_reports:*');
        console.log(`✓ Cleared ${userCacheCount} user report caches`);

        // Clear analytics caches
        const analyticsCacheCount = await this.cache.deletePattern('share_analytics:*');
        console.log(`✓ Cleared ${analyticsCacheCount} analytics caches`);

        // Clear stats caches
        const statsCacheCount = await this.cache.deletePattern('report_stats:*');
        console.log(`✓ Cleared ${statsCacheCount} stats caches`);
      }

      console.log('Cache optimization completed');
    } catch (error) {
      console.error('Cache optimization failed:', error);
      throw error;
    }
  }

  /**
   * Schedule periodic cache maintenance
   */
  startPeriodicMaintenance(intervalMinutes: number = 60): NodeJS.Timeout {
    console.log(`Starting periodic cache maintenance every ${intervalMinutes} minutes`);
    
    return setInterval(async () => {
      try {
        await this.invalidateStaleEntries();
        await this.optimizeCache();
      } catch (error) {
        console.error('Periodic cache maintenance failed:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Preload cache for specific user
   */
  async preloadUserCache(userId: string): Promise<void> {
    try {
      // Preload user's shareable reports
      await this.service.getUserShareableReports(userId);
      
      // Preload user's report statistics
      await this.service.getReportStatistics(userId);
      
      console.log(`✓ Cache preloaded for user ${userId}`);
    } catch (error) {
      console.error(`Failed to preload cache for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Clear cache for specific user (useful for privacy compliance)
   */
  async clearUserCache(userId: string): Promise<void> {
    try {
      await this.cache.delete(`user_reports:${userId}`);
      await this.cache.delete(`report_stats:${userId}`);
      
      console.log(`✓ Cache cleared for user ${userId}`);
    } catch (error) {
      console.error(`Failed to clear cache for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Emergency cache clear (for critical issues)
   */
  async emergencyCacheClear(): Promise<number> {
    console.log('Performing emergency cache clear...');
    
    try {
      const clearedCount = await this.cache.clear();
      console.log(`✓ Emergency cache clear completed, removed ${clearedCount} entries`);
      return clearedCount;
    } catch (error) {
      console.error('Emergency cache clear failed:', error);
      throw error;
    }
  }
}

// Singleton instance
let cacheManagerInstance: CacheManager | null = null;

export function getCacheManager(): CacheManager {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CacheManager();
  }
  return cacheManagerInstance;
}