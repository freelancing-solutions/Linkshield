import { PrismaClient } from '@prisma/client';
import { CacheService, getCacheService, CacheKeys } from './cache-service';

export interface ViewTrackingData {
  checkId: string;
  viewerIp?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
}

export interface EngagementMetrics {
  totalViews: number;
  uniqueViews: number;
  totalShares: number;
  sharesByMethod: Record<string, number>;
  conversionRate: number; // Views to shares ratio
  averageEngagementTime?: number;
  topReferrers: Array<{ referrer: string; count: number }>;
  geographicDistribution: Array<{ country: string; count: number }>;
}

export interface AnalyticsDashboardData {
  overview: {
    totalReports: number;
    totalViews: number;
    totalShares: number;
    averageSecurityScore: number;
  };
  trends: {
    viewsOverTime: Array<{ date: string; views: number }>;
    sharesOverTime: Array<{ date: string; shares: number }>;
    reportsOverTime: Array<{ date: string; reports: number }>;
  };
  topReports: Array<{
    slug: string;
    url: string;
    views: number;
    shares: number;
    securityScore: number;
  }>;
  sharingMethods: Array<{ method: string; count: number; successRate: number }>;
  viralCoefficient: number;
}

export interface PrivacyOptions {
  respectDoNotTrack?: boolean;
  anonymizeIPs?: boolean;
  retentionDays?: number;
}

export class AnalyticsService {
  private prisma: PrismaClient;
  private cache: CacheService;
  private privacyOptions: Required<PrivacyOptions>;

  constructor(
    prisma: PrismaClient,
    cacheService?: CacheService,
    privacyOptions: PrivacyOptions = {}
  ) {
    this.prisma = prisma;
    this.cache = cacheService || getCacheService();
    this.privacyOptions = {
      respectDoNotTrack: privacyOptions.respectDoNotTrack ?? true,
      anonymizeIPs: privacyOptions.anonymizeIPs ?? true,
      retentionDays: privacyOptions.retentionDays ?? 90
    };
  }

  /**
   * Track a report view with privacy compliance
   */
  async trackView(data: ViewTrackingData, doNotTrack?: boolean): Promise<void> {
    // Respect Do Not Track header if enabled
    if (this.privacyOptions.respectDoNotTrack && doNotTrack) {
      return;
    }

    try {
      // Anonymize IP if privacy option is enabled
      const viewerIp = this.privacyOptions.anonymizeIPs && data.viewerIp 
        ? this.anonymizeIP(data.viewerIp) 
        : data.viewerIp;

      // Create view record
      await this.prisma.reportView.create({
        data: {
          checkId: data.checkId,
          viewerIp,
          userAgent: data.userAgent,
          referrer: data.referrer,
          country: data.country
        }
      });

      // Invalidate related caches
      await this.invalidateViewCaches(data.checkId);
    } catch (error) {
      console.error('Failed to track view:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Track a share event with privacy compliance
   */
  async trackShareEvent(data: {
    checkId: string;
    shareMethod: string;
    success: boolean;
    userAgent?: string;
    referrer?: string;
    ipAddress?: string;
  }): Promise<void> {
    try {
      // Anonymize IP if privacy option is enabled
      const ipAddress = this.privacyOptions.anonymizeIPs && data.ipAddress 
        ? this.anonymizeIP(data.ipAddress) 
        : data.ipAddress;

      // Create share event record
      await this.prisma.shareEvent.create({
        data: {
          checkId: data.checkId,
          shareMethod: data.shareMethod,
          success: data.success,
          userAgent: data.userAgent,
          referrer: data.referrer,
          ipAddress
        }
      });

      // Update share count if successful
      if (data.success) {
        await this.prisma.check.update({
          where: { id: data.checkId },
          data: { shareCount: { increment: 1 } }
        });
      }

      // Invalidate related caches
      await this.invalidateShareCaches(data.checkId);
    } catch (error) {
      console.error('Failed to track share event:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Get engagement metrics for a specific report
   */
  async getEngagementMetrics(checkId: string): Promise<EngagementMetrics> {
    const cacheKey = `engagement:${checkId}`;
    
    // Try cache first
    const cached = await this.cache.get<EngagementMetrics>(cacheKey);
    if (cached) {
      return cached;
    }

    // Calculate metrics from database
    const [
      totalViews,
      uniqueViews,
      shareEvents,
      topReferrers,
      geographicData
    ] = await Promise.all([
      this.prisma.reportView.count({ where: { checkId } }),
      this.prisma.reportView.groupBy({
        by: ['viewerIp'],
        where: { checkId, viewerIp: { not: null } },
        _count: { id: true }
      }).then(results => results.length),
      this.prisma.shareEvent.findMany({
        where: { checkId },
        select: { shareMethod: true, success: true }
      }),
      this.prisma.reportView.groupBy({
        by: ['referrer'],
        where: { checkId, referrer: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      }),
      this.prisma.reportView.groupBy({
        by: ['country'],
        where: { checkId, country: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      })
    ]);

    // Process share events
    const totalShares = shareEvents.filter(e => e.success).length;
    const sharesByMethod = shareEvents.reduce((acc, event) => {
      if (event.success) {
        acc[event.shareMethod] = (acc[event.shareMethod] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const metrics: EngagementMetrics = {
      totalViews,
      uniqueViews,
      totalShares,
      sharesByMethod,
      conversionRate: totalViews > 0 ? (totalShares / totalViews) * 100 : 0,
      topReferrers: topReferrers.map(r => ({
        referrer: r.referrer || 'Direct',
        count: r._count.id
      })),
      geographicDistribution: geographicData.map(g => ({
        country: g.country || 'Unknown',
        count: g._count.id
      }))
    };

    // Cache the results
    await this.cache.set(cacheKey, metrics, { ttl: 1800 }); // 30 minutes

    return metrics;
  }

  /**
   * Get analytics dashboard data
   */
  async getDashboardData(userId?: string, days: number = 30): Promise<AnalyticsDashboardData> {
    const cacheKey = `dashboard:${userId || 'global'}:${days}`;
    
    // Try cache first
    const cached = await this.cache.get<AnalyticsDashboardData>(cacheKey);
    if (cached) {
      return cached;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const whereClause = userId ? { userId } : {};
    const viewWhereClause = userId ? { check: { userId } } : {};

    // Get overview data
    const [
      totalReports,
      totalViews,
      totalShares,
      avgSecurityScore
    ] = await Promise.all([
      this.prisma.check.count({
        where: { ...whereClause, slug: { not: null } }
      }),
      this.prisma.reportView.count({
        where: { ...viewWhereClause, createdAt: { gte: startDate } }
      }),
      this.prisma.shareEvent.count({
        where: { 
          success: true,
          createdAt: { gte: startDate },
          ...(userId && { check: { userId } })
        }
      }),
      this.prisma.check.aggregate({
        where: { ...whereClause, securityScore: { not: null } },
        _avg: { securityScore: true }
      }).then(result => result._avg.securityScore || 0)
    ]);

    // Get trends data
    const [viewsTrend, sharesTrend, reportsTrend] = await Promise.all([
      this.getTimeSeriesData('views', startDate, userId),
      this.getTimeSeriesData('shares', startDate, userId),
      this.getTimeSeriesData('reports', startDate, userId)
    ]);

    // Get top reports
    const topReports = await this.prisma.check.findMany({
      where: {
        ...whereClause,
        slug: { not: null },
        isPublic: true
      },
      select: {
        slug: true,
        url: true,
        securityScore: true,
        shareCount: true,
        reportViews: { select: { id: true } }
      },
      orderBy: [
        { shareCount: 'desc' },
        { reportViews: { _count: 'desc' } }
      ],
      take: 10
    });

    // Get sharing methods data
    const sharingMethods = await this.prisma.shareEvent.groupBy({
      by: ['shareMethod'],
      where: {
        createdAt: { gte: startDate },
        ...(userId && { check: { userId } })
      },
      _count: { id: true },
      _sum: { success: true }
    });

    // Calculate viral coefficient
    const viralCoefficient = totalViews > 0 ? (totalShares / totalViews) : 0;

    const dashboardData: AnalyticsDashboardData = {
      overview: {
        totalReports,
        totalViews,
        totalShares,
        averageSecurityScore: Math.round(avgSecurityScore * 100) / 100
      },
      trends: {
        viewsOverTime: viewsTrend,
        sharesOverTime: sharesTrend,
        reportsOverTime: reportsTrend
      },
      topReports: topReports.map(report => ({
        slug: report.slug!,
        url: report.url,
        views: report.reportViews.length,
        shares: report.shareCount,
        securityScore: report.securityScore || 0
      })),
      sharingMethods: sharingMethods.map(method => ({
        method: method.shareMethod,
        count: method._count.id,
        successRate: method._count.id > 0 ? (method._sum.success || 0) / method._count.id * 100 : 0
      })),
      viralCoefficient
    };

    // Cache the results
    await this.cache.set(cacheKey, dashboardData, { ttl: 3600 }); // 1 hour

    return dashboardData;
  }

  /**
   * Get real-time analytics for a specific report
   */
  async getRealTimeAnalytics(checkId: string) {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const [recentViews, recentShares, hourlyViews] = await Promise.all([
      this.prisma.reportView.count({
        where: { checkId, createdAt: { gte: last24Hours } }
      }),
      this.prisma.shareEvent.count({
        where: { checkId, success: true, createdAt: { gte: last24Hours } }
      }),
      this.getHourlyViews(checkId, 24)
    ]);

    return {
      last24Hours: {
        views: recentViews,
        shares: recentShares
      },
      hourlyBreakdown: hourlyViews,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get viral coefficient for reports
   */
  async getViralCoefficient(userId?: string, days: number = 30): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const whereClause = userId ? { check: { userId } } : {};

    const [totalViews, totalShares] = await Promise.all([
      this.prisma.reportView.count({
        where: { ...whereClause, createdAt: { gte: startDate } }
      }),
      this.prisma.shareEvent.count({
        where: { 
          success: true,
          createdAt: { gte: startDate },
          ...whereClause
        }
      })
    ]);

    return totalViews > 0 ? totalShares / totalViews : 0;
  }

  /**
   * Clean up old analytics data for privacy compliance
   */
  async cleanupOldData(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.privacyOptions.retentionDays);

    try {
      const [deletedViews, deletedShares] = await Promise.all([
        this.prisma.reportView.deleteMany({
          where: { createdAt: { lt: cutoffDate } }
        }),
        this.prisma.shareEvent.deleteMany({
          where: { createdAt: { lt: cutoffDate } }
        })
      ]);

      console.log(`Cleaned up ${deletedViews.count} old view records and ${deletedShares.count} old share records`);
    } catch (error) {
      console.error('Failed to cleanup old analytics data:', error);
      throw error;
    }
  }

  /**
   * Get conversion funnel data
   */
  async getConversionFunnel(userId?: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const whereClause = userId ? { userId } : {};
    const viewWhereClause = userId ? { check: { userId } } : {};

    const [
      totalReports,
      viewedReports,
      sharedReports,
      totalViews,
      totalShares
    ] = await Promise.all([
      this.prisma.check.count({
        where: { ...whereClause, slug: { not: null }, createdAt: { gte: startDate } }
      }),
      this.prisma.check.count({
        where: {
          ...whereClause,
          slug: { not: null },
          createdAt: { gte: startDate },
          reportViews: { some: {} }
        }
      }),
      this.prisma.check.count({
        where: {
          ...whereClause,
          slug: { not: null },
          createdAt: { gte: startDate },
          shareEvents: { some: { success: true } }
        }
      }),
      this.prisma.reportView.count({
        where: { ...viewWhereClause, createdAt: { gte: startDate } }
      }),
      this.prisma.shareEvent.count({
        where: { 
          success: true,
          createdAt: { gte: startDate },
          ...(userId && { check: { userId } })
        }
      })
    ]);

    return {
      steps: [
        { name: 'Reports Created', count: totalReports, percentage: 100 },
        { 
          name: 'Reports Viewed', 
          count: viewedReports, 
          percentage: totalReports > 0 ? (viewedReports / totalReports) * 100 : 0 
        },
        { 
          name: 'Reports Shared', 
          count: sharedReports, 
          percentage: totalReports > 0 ? (sharedReports / totalReports) * 100 : 0 
        }
      ],
      metrics: {
        viewsPerReport: totalReports > 0 ? totalViews / totalReports : 0,
        sharesPerReport: totalReports > 0 ? totalShares / totalReports : 0,
        shareConversionRate: totalViews > 0 ? (totalShares / totalViews) * 100 : 0
      }
    };
  }

  /**
   * Get time series data for trends
   */
  private async getTimeSeriesData(
    type: 'views' | 'shares' | 'reports', 
    startDate: Date, 
    userId?: string
  ): Promise<Array<{ date: string; [key: string]: any }>> {
    const days = Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const result: Array<{ date: string; [key: string]: any }> = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      let count = 0;

      switch (type) {
        case 'views':
          count = await this.prisma.reportView.count({
            where: {
              createdAt: { gte: date, lt: nextDate },
              ...(userId && { check: { userId } })
            }
          });
          break;
        case 'shares':
          count = await this.prisma.shareEvent.count({
            where: {
              success: true,
              createdAt: { gte: date, lt: nextDate },
              ...(userId && { check: { userId } })
            }
          });
          break;
        case 'reports':
          count = await this.prisma.check.count({
            where: {
              slug: { not: null },
              createdAt: { gte: date, lt: nextDate },
              ...(userId && { userId })
            }
          });
          break;
      }

      result.push({
        date: date.toISOString().split('T')[0],
        [type]: count
      });
    }

    return result;
  }

  /**
   * Get hourly views for real-time analytics
   */
  private async getHourlyViews(checkId: string, hours: number) {
    const result = [];
    const now = new Date();

    for (let i = hours - 1; i >= 0; i--) {
      const startHour = new Date(now);
      startHour.setHours(startHour.getHours() - i, 0, 0, 0);
      const endHour = new Date(startHour);
      endHour.setHours(endHour.getHours() + 1);

      const count = await this.prisma.reportView.count({
        where: {
          checkId,
          createdAt: { gte: startHour, lt: endHour }
        }
      });

      result.push({
        hour: startHour.toISOString(),
        views: count
      });
    }

    return result;
  }

  /**
   * Anonymize IP address for privacy
   */
  private anonymizeIP(ip: string): string {
    if (ip.includes(':')) {
      // IPv6 - keep first 4 segments
      const segments = ip.split(':');
      return segments.slice(0, 4).join(':') + '::';
    } else {
      // IPv4 - keep first 3 octets
      const octets = ip.split('.');
      return octets.slice(0, 3).join('.') + '.0';
    }
  }

  /**
   * Invalidate view-related caches
   */
  private async invalidateViewCaches(checkId: string): Promise<void> {
    const operations = [
      this.cache.delete(`engagement:${checkId}`),
      this.cache.deletePattern('dashboard:*'),
      this.cache.deletePattern('report_stats:*')
    ];

    await Promise.allSettled(operations);
  }

  /**
   * Invalidate share-related caches
   */
  private async invalidateShareCaches(checkId: string): Promise<void> {
    const operations = [
      this.cache.delete(`engagement:${checkId}`),
      this.cache.delete(CacheKeys.shareAnalytics(checkId)),
      this.cache.deletePattern('dashboard:*'),
      this.cache.deletePattern('report_stats:*')
    ];

    await Promise.allSettled(operations);
  }
}