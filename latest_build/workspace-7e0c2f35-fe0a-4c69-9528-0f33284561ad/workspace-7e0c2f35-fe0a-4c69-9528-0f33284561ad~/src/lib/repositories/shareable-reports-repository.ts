import { PrismaClient } from '@prisma/client';
import { 
  ShareableCheck, 
  RecentReport, 
  ShareEventData,
  CreateShareableReportData 
} from '../types/shareable-reports';

export class ShareableReportsRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find a shareable report by slug
   */
  async findBySlug(slug: string): Promise<ShareableCheck | null> {
    return await this.prisma.check.findUnique({
      where: { slug },
      include: {
        aiAnalyses: true,
        shareEvents: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    }) as ShareableCheck | null;
  }

  /**
   * Find a public shareable report by slug
   */
  async findPublicBySlug(slug: string): Promise<ShareableCheck | null> {
    return await this.prisma.check.findFirst({
      where: { 
        slug,
        isPublic: true 
      },
      include: {
        aiAnalyses: true,
        shareEvents: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    }) as ShareableCheck | null;
  }

  /**
   * Update a check with shareable report data
   */
  async updateShareableData(
    checkId: string, 
    data: Partial<CreateShareableReportData> & { slug?: string }
  ): Promise<ShareableCheck> {
    return await this.prisma.check.update({
      where: { id: checkId },
      data: {
        slug: data.slug,
        isPublic: data.isPublic,
        customTitle: data.customTitle,
        customDescription: data.customDescription,
      },
      include: {
        aiAnalyses: true,
        shareEvents: true
      }
    }) as ShareableCheck;
  }

  /**
   * Get recent public reports for sidebar
   */
  async getRecentPublicReports(limit: number = 10): Promise<RecentReport[]> {
    const reports = await this.prisma.check.findMany({
      where: {
        isPublic: true,
        slug: { not: null }
      },
      select: {
        id: true,
        slug: true,
        url: true,
        securityScore: true,
        createdAt: true,
        aiAnalyses: {
          select: { id: true },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return reports.map(report => ({
      id: report.id,
      slug: report.slug!,
      url: report.url,
      domain: this.extractDomain(report.url),
      securityScore: report.securityScore,
      createdAt: report.createdAt,
      hasAIAnalysis: report.aiAnalyses.length > 0
    }));
  }

  /**
   * Track a share event
   */
  async trackShareEvent(data: ShareEventData): Promise<void> {
    await this.prisma.shareEvent.create({
      data: {
        checkId: data.checkId,
        shareMethod: data.shareMethod,
        success: data.success,
        userAgent: data.userAgent,
        referrer: data.referrer,
        ipAddress: data.ipAddress
      }
    });

    // Increment share count if successful
    if (data.success) {
      await this.prisma.check.update({
        where: { id: data.checkId },
        data: {
          shareCount: { increment: 1 }
        }
      });
    }
  }

  /**
   * Get sharing analytics for a report
   */
  async getShareAnalytics(checkId: string) {
    const shareEvents = await this.prisma.shareEvent.groupBy({
      by: ['shareMethod', 'success'],
      where: { checkId },
      _count: { id: true }
    });

    const totalShares = await this.prisma.shareEvent.count({
      where: { checkId, success: true }
    });

    const sharesByMethod = shareEvents.reduce((acc, event) => {
      if (!acc[event.shareMethod]) {
        acc[event.shareMethod] = { total: 0, successful: 0 };
      }
      acc[event.shareMethod].total += event._count.id;
      if (event.success) {
        acc[event.shareMethod].successful += event._count.id;
      }
      return acc;
    }, {} as Record<string, { total: number; successful: number }>);

    return {
      totalShares,
      sharesByMethod
    };
  }

  /**
   * Check if slug exists (for uniqueness validation)
   */
  async slugExists(slug: string, excludeCheckId?: string): Promise<boolean> {
    const existing = await this.prisma.check.findFirst({
      where: {
        slug,
        ...(excludeCheckId && { id: { not: excludeCheckId } })
      }
    });
    
    return existing !== null;
  }

  /**
   * Update report privacy setting
   */
  async updatePrivacy(checkId: string, isPublic: boolean): Promise<void> {
    await this.prisma.check.update({
      where: { id: checkId },
      data: { isPublic }
    });
  }

  /**
   * Get reports by user for dashboard
   */
  async getUserShareableReports(userId: string, limit: number = 20): Promise<ShareableCheck[]> {
    return await this.prisma.check.findMany({
      where: {
        userId,
        slug: { not: null }
      },
      include: {
        aiAnalyses: true,
        shareEvents: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    }) as ShareableCheck[];
  }

  /**
   * Delete a shareable report (removes slug and makes private)
   */
  async deleteShareableReport(checkId: string): Promise<void> {
    await this.prisma.check.update({
      where: { id: checkId },
      data: {
        slug: null,
        isPublic: false,
        ogImageUrl: null,
        customTitle: null,
        customDescription: null
      }
    });
  }

  /**
   * Extract domain from URL for display purposes
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }
}