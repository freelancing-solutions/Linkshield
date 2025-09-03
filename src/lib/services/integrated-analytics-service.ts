import { PrismaClient } from '@prisma/client';
import { CachedShareableReportService } from './cached-shareable-report-service';
import { AnalyticsService } from './analytics-service';
import { CacheService } from './cache-service';
import { 
  ShareableCheck, 
  CreateShareableReportData, 
  ShareEventData 
} from '../types/shareable-reports';

export interface IntegratedAnalyticsOptions {
  enableViewTracking?: boolean;
  enableShareTracking?: boolean;
  enableEngagementMetrics?: boolean;
  privacyCompliant?: boolean;
}

/**
 * Integrated service that combines shareable reports with analytics
 */
export class IntegratedAnalyticsService extends CachedShareableReportService {
  private analyticsService: AnalyticsService;
  private analyticsOptions: Required<IntegratedAnalyticsOptions>;

  constructor(
    prisma: PrismaClient,
    cacheService?: CacheService,
    analyticsOptions: IntegratedAnalyticsOptions = {}
  ) {
    super(prisma, { cacheService });
    
    this.analyticsService = new AnalyticsService(prisma, cacheService, {
      respectDoNotTrack: analyticsOptions.privacyCompliant ?? true,
      anonymizeIPs: analyticsOptions.privacyCompliant ?? true
    });

    this.analyticsOptions = {
      enableViewTracking: analyticsOptions.enableViewTracking ?? true,
      enableShareTracking: analyticsOptions.enableShareTracking ?? true,
      enableEngagementMetrics: analyticsOptions.enableEngagementMetrics ?? true,
      privacyCompliant: analyticsOptions.privacyCompliant ?? true
    };
  }

  /**
   * Get a report with automatic view tracking
   */
  async getReportBySlugWithTracking(
    slug: string, 
    userId?: string,
    trackingData?: {
      viewerIp?: string;
      userAgent?: string;
      referrer?: string;
      country?: string;
      doNotTrack?: boolean;
    }
  ): Promise<ShareableCheck | null> {
    const report = await super.getReportBySlug(slug, userId);
    
    // Track view if enabled and report exists
    if (report && this.analyticsOptions.enableViewTracking && trackingData) {
      await this.analyticsService.trackView({
        checkId: report.id,
        viewerIp: trackingData.viewerIp,
        userAgent: trackingData.userAgent,
        referrer: trackingData.referrer,
        country: trackingData.country
      }, trackingData.doNotTrack);
    }

    return report;
  }

  /**
   * Get public report with automatic view tracking
   */
  async getPublicReportBySlugWithTracking(
    slug: string,
    trackingData?: {
      viewerIp?: string;
      userAgent?: string;
      referrer?: string;
      country?: string;
      doNotTrack?: boolean;
    }
  ): Promise<ShareableCheck | null> {
    const report = await super.getPublicReportBySlug(slug);
    
    // Track view if enabled and report exists
    if (report && this.analyticsOptions.enableViewTracking && trackingData) {
      await this.analyticsService.trackView({
        checkId: report.id,
        viewerIp: trackingData.viewerIp,
        userAgent: trackingData.userAgent,
        referrer: trackingData.referrer,
        country: trackingData.country
      }, trackingData.doNotTrack);
    }

    return report;
  }

  /**
   * Track share event with enhanced analytics
   */
  async trackShareEvent(data: ShareEventData): Promise<void> {
    // Use parent method for basic tracking
    await super.trackShareEvent(data);
    
    // Enhanced analytics tracking if enabled
    if (this.analyticsOptions.enableShareTracking) {
      await this.analyticsService.trackShareEvent({
        checkId: data.checkId,
        shareMethod: data.shareMethod,
        success: data.success,
        userAgent: data.userAgent,
        referrer: data.referrer,
        ipAddress: data.ipAddress
      });
    }
  }

  /**
   * Get comprehensive report analytics
   */
  async getReportAnalytics(checkId: string, userId?: string) {
    const [
      shareAnalytics,
      engagementMetrics,
      realTimeAnalytics
    ] = await Promise.all([
      super.getShareAnalytics(checkId, userId),
      this.analyticsOptions.enableEngagementMetrics 
        ? this.analyticsService.getEngagementMetrics(checkId)
        : null,
      this.analyticsService.getRealTimeAnalytics(checkId)
    ]);

    return {
      sharing: shareAnalytics,
      engagement: engagementMetrics,
      realTime: realTimeAnalytics
    };
  }

  /**
   * Get enhanced dashboard data with analytics
   */
  async getEnhancedDashboardData(userId?: string, days: number = 30) {
    const [
      reportStats,
      dashboardData,
      viralCoefficient,
      conversionFunnel
    ] = await Promise.all([
      super.getReportStatistics(userId),
      this.analyticsService.getDashboardData(userId, days),
      this.analyticsService.getViralCoefficient(userId, days),
      this.analyticsService.getConversionFunnel(userId, days)
    ]);

    return {
      reportStats,
      analytics: dashboardData,
      viralCoefficient,
      conversionFunnel,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get trending reports based on analytics
   */
  async getTrendingReports(limit: number = 10, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get reports with most views and shares in the time period
    const trendingReports = await this.prisma.check.findMany({
      where: {
        isPublic: true,
        slug: { not: null },
        createdAt: { gte: startDate }
      },
      select: {
        id: true,
        slug: true,
        url: true,
        securityScore: true,
        shareCount: true,
        reportViews: {
          where: { createdAt: { gte: startDate } },
          select: { id: true }
        },
        shareEvents: {
          where: { 
            success: true,
            createdAt: { gte: startDate } 
          },
          select: { id: true }
        }
      },
      orderBy: [
        { shareCount: 'desc' },
        { reportViews: { _count: 'desc' } }
      ],
      take: limit
    });

    return trendingReports.map(report => ({
      slug: report.slug!,
      url: report.url,
      securityScore: report.securityScore,
      recentViews: report.reportViews.length,
      recentShares: report.shareEvents.length,
      totalShares: report.shareCount,
      trendScore: (report.reportViews.length * 1) + (report.shareEvents.length * 3) // Weight shares more
    })).sort((a, b) => b.trendScore - a.trendScore);
  }

  /**
   * Get performance insights for optimization
   */
  async getPerformanceInsights(userId?: string) {
    const [
      dashboardData,
      viralCoefficient,
      conversionFunnel
    ] = await Promise.all([
      this.analyticsService.getDashboardData(userId, 30),
      this.analyticsService.getViralCoefficient(userId, 30),
      this.analyticsService.getConversionFunnel(userId, 30)
    ]);

    // Generate insights based on data
    const insights = [];

    // Viral coefficient insights
    if (viralCoefficient < 0.1) {
      insights.push({
        type: 'warning',
        title: 'Low Viral Coefficient',
        description: 'Your reports are not being shared frequently. Consider improving share button placement or adding incentives.',
        metric: viralCoefficient,
        recommendation: 'Add more prominent sharing buttons and social proof elements.'
      });
    } else if (viralCoefficient > 0.5) {
      insights.push({
        type: 'success',
        title: 'High Viral Coefficient',
        description: 'Your reports are being shared frequently! This is driving organic growth.',
        metric: viralCoefficient,
        recommendation: 'Continue current strategy and consider expanding to more platforms.'
      });
    }

    // Conversion funnel insights
    const shareConversionRate = conversionFunnel.metrics.shareConversionRate;
    if (shareConversionRate < 5) {
      insights.push({
        type: 'warning',
        title: 'Low Share Conversion Rate',
        description: 'Few viewers are sharing your reports. The content might not be compelling enough.',
        metric: shareConversionRate,
        recommendation: 'Improve report design and add clear value propositions for sharing.'
      });
    }

    // Top performing content insights
    const topReports = dashboardData.topReports.slice(0, 3);
    if (topReports.length > 0) {
      insights.push({
        type: 'info',
        title: 'Top Performing Reports',
        description: `Your best performing reports have security scores averaging ${Math.round(topReports.reduce((sum, r) => sum + r.securityScore, 0) / topReports.length)}.`,
        recommendation: 'Analyze what makes these reports successful and apply similar patterns to new reports.'
      });
    }

    return {
      insights,
      metrics: {
        viralCoefficient,
        shareConversionRate,
        averageViewsPerReport: conversionFunnel.metrics.viewsPerReport,
        averageSharesPerReport: conversionFunnel.metrics.sharesPerReport
      },
      recommendations: insights.map(i => i.recommendation)
    };
  }

  /**
   * Cleanup old analytics data
   */
  async cleanupAnalyticsData(): Promise<void> {
    await this.analyticsService.cleanupOldData();
  }

  /**
   * Get analytics health status
   */
  async getAnalyticsHealth() {
    const cacheHealth = await this.healthCheck();
    
    // Check recent analytics activity
    const recentViews = await this.prisma.reportView.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    const recentShares = await this.prisma.shareEvent.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    return {
      ...cacheHealth,
      analytics: {
        status: 'healthy',
        recentActivity: {
          views: recentViews,
          shares: recentShares
        }
      }
    };
  }
}