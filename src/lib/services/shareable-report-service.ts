import { PrismaClient } from '@prisma/client';
import { SlugGenerator } from './slug-generator';
import { ShareableReportsRepository } from '../repositories/shareable-reports-repository';
import { 
  ShareableCheck, 
  CreateShareableReportData, 
  ShareOptions,
  ShareData,
  ShareEventData,
  RecentReport,
  getScoreColor
} from '../types/shareable-reports';
import { getIoInstance } from '../socket'; // Import getIoInstance
import { formatRecentReportForDisplay } from '../utils'; // Import formatRecentReportForDisplay

export interface ShareableReportServiceOptions {
  baseUrl?: string;
  defaultHashtags?: string[];
  brandName?: string;
}

export class ShareableReportService {
  private slugGenerator: SlugGenerator;
  private repository: ShareableReportsRepository;
  private prisma: PrismaClient;
  private options: Required<ShareableReportServiceOptions>;

  constructor(
    prisma: PrismaClient, 
    options: ShareableReportServiceOptions = {}
  ) {
    this.prisma = prisma;
    this.slugGenerator = new SlugGenerator(prisma);
    this.repository = new ShareableReportsRepository(prisma);
    this.options = {
      baseUrl: options.baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://linkshield.site',
      defaultHashtags: options.defaultHashtags || ['LinkSecurity', 'URLAnalysis', 'WebSafety'],
      brandName: options.brandName || 'LinkShield'
    };
  }

  /**
   * Create a shareable report from an existing check
   */
  async createShareableReport(data: CreateShareableReportData): Promise<ShareableCheck> {
    // First, get the existing check to validate it exists
    const check = await this.prisma.check.findUnique({
      where: { id: data.checkId }
    });
    
    if (!check) {
      throw new Error(`Check with ID ${data.checkId} not found`);
    }

    // Generate unique slug
    const slug = await this.slugGenerator.generateSlug(check.url, data.checkId);

    // Update the check with shareable report data
    const shareableReport = await this.repository.updateShareableData(data.checkId, {
      ...data,
      slug
    });

    if (shareableReport.isPublic) {
      try {
        const io = getIoInstance();
        const recentReport: RecentReport = {
          id: shareableReport.id,
          slug: shareableReport.slug!,
          url: shareableReport.url,
          securityScore: shareableReport.securityScore,
          createdAt: shareableReport.createdAt,
          domain: this.extractDomain(shareableReport.url),
          hasAIAnalysis: shareableReport.aiAnalyses ? shareableReport.aiAnalyses.length > 0 : false,
        };
        const displayReport = formatRecentReportForDisplay(recentReport);
        io.emit('newRecentReport', displayReport);
      } catch (error) {
        console.error('Failed to emit newRecentReport event:', error);
      }
    }
    return shareableReport;
  }

  /**
   * Get a shareable report by slug with access validation
   */
  async getReportBySlug(slug: string, userId?: string): Promise<ShareableCheck | null> {
    const report = await this.repository.findBySlug(slug);
    
    if (!report) {
      return null;
    }

    // Validate access permissions
    if (!this.validateReportAccess(report, userId)) {
      return null;
    }

    return report;
  }

  /**
   * Get a public shareable report by slug (no authentication required)
   */
  async getPublicReportBySlug(slug: string): Promise<ShareableCheck | null> {
    return await this.repository.findPublicBySlug(slug);
  }

  /**
   * Update report privacy settings
   */
  async updateReportPrivacy(checkId: string, isPublic: boolean, userId?: string): Promise<void> {
    // Validate ownership if userId is provided
    if (userId) {
      const report = await this.prisma.check.findFirst({
        where: { id: checkId, userId }
      });
      
      if (!report) {
        throw new Error('Report not found or access denied');
      }
    }

    await this.repository.updatePrivacy(checkId, isPublic);

    if (isPublic) {
      try {
        const io = getIoInstance();
        const updatedCheck = await this.prisma.check.findUnique({ // Fetch the updated report by ID
          where: { id: checkId },
          include: { aiAnalyses: true } // Include aiAnalyses for hasAIAnalysis
        });
        if (updatedCheck && updatedCheck.slug) { // Ensure slug exists for RecentReport
          const recentReport: RecentReport = {
            id: updatedCheck.id,
            slug: updatedCheck.slug,
            url: updatedCheck.url,
            securityScore: updatedCheck.securityScore,
            createdAt: updatedCheck.createdAt,
            domain: this.extractDomain(updatedCheck.url),
            hasAIAnalysis: updatedCheck.aiAnalyses ? updatedCheck.aiAnalyses.length > 0 : false,
          };
          const displayReport = formatRecentReportForDisplay(recentReport);
          io.emit('updatedRecentReport', displayReport); // Emit a different event for updates
        }
      } catch (error) {
        console.error('Failed to emit updatedRecentReport event:', error);
      }
    }
  }

  /**
   * Generate share data for social media and native sharing
   */
  generateShareData(report: ShareableCheck): ShareData {
    const reportUrl = `${this.options.baseUrl}/reports/${report.slug}`;
    const domain = this.extractDomain(report.url);
    const scoreColor = getScoreColor(report.securityScore);
    const scoreEmoji = this.getScoreEmoji(scoreColor);
    
    // Use custom title/description if available, otherwise generate defaults
    const title = report.customTitle || 
      `${domain} Security Report ${scoreEmoji} - Score: ${report.securityScore || 'N/A'}/100`;
    
    const description = report.customDescription || 
      `I analyzed ${domain} with ${this.options.brandName} and got a security score of ${report.securityScore || 'N/A'}/100. Check out the full report!`;

    return {
      url: reportUrl,
      title,
      text: description,
      hashtags: this.options.defaultHashtags,
      via: this.options.brandName
    };
  }

  /**
   * Track a share event with analytics
   */
  async trackShareEvent(data: ShareEventData): Promise<void> {
    await this.repository.trackShareEvent(data);
  }

  /**
   * Get recent public reports for sidebar display
   */
  async getRecentReports(limit: number = 10): Promise<RecentReport[]> {
    return await this.repository.getRecentPublicReports(limit);
  }

  /**
   * Get sharing analytics for a report
   */
  async getShareAnalytics(checkId: string, userId?: string) {
    // Validate ownership if userId is provided
    if (userId) {
      const report = await this.prisma.check.findFirst({
        where: { id: checkId, userId }
      });
      
      if (!report) {
        throw new Error('Report not found or access denied');
      }
    }

    return await this.repository.getShareAnalytics(checkId);
  }

  /**
   * Get user's shareable reports for dashboard
   */
  async getUserShareableReports(userId: string, limit: number = 20): Promise<ShareableCheck[]> {
    return await this.repository.getUserShareableReports(userId, limit);
  }

  /**
   * Delete a shareable report (make it private and remove slug)
   */
  async deleteShareableReport(checkId: string, userId?: string): Promise<void> {
    // Validate ownership if userId is provided
    if (userId) {
      const report = await this.prisma.check.findFirst({
        where: { id: checkId, userId }
      });
      
      if (!report) {
        throw new Error('Report not found or access denied');
      }
    }

    await this.repository.deleteShareableReport(checkId);
  }

  /**
   * Regenerate slug for a report (useful for conflicts or updates)
   */
  async regenerateSlug(checkId: string, userId?: string): Promise<string> {
    // Validate ownership if userId is provided
    if (userId) {
      const report = await this.prisma.check.findFirst({
        where: { id: checkId, userId }
      });
      
      if (!report) {
        throw new Error('Report not found or access denied');
      }
    }

    const check = await this.prisma.check.findUnique({
      where: { id: checkId }
    });

    if (!check) {
      throw new Error(`Check with ID ${checkId} not found`);
    }

    return await this.slugGenerator.regenerateSlug(checkId, check.url);
  }

  /**
   * Format report data for public display (removes sensitive information)
   */
  formatReportForPublicDisplay(report: ShareableCheck): Partial<ShareableCheck> {
    // Remove sensitive fields for public display
    const {
      userId,
      ...publicData
    } = report;

    return {
      ...publicData,
      // Ensure AI insights are only included if the report allows it
      aiAnalyses: report.isPublic ? report.aiAnalyses : undefined
    };
  }

  /**
   * Validate if a user can access a report
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
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  /**
   * Get emoji based on security score color
   */
  private getScoreEmoji(color: 'green' | 'yellow' | 'orange' | 'red'): string {
    const emojiMap = {
      green: '🟢',
      yellow: '🟡', 
      orange: '🟠',
      red: '🔴'
    };
    return emojiMap[color];
  }

  /**
   * Validate slug format and availability
   */
  async validateSlug(slug: string, excludeCheckId?: string): Promise<boolean> {
    if (!this.slugGenerator.validateSlugFormat(slug)) {
      return false;
    }

    return !(await this.repository.slugExists(slug, excludeCheckId));
  }

  /**
   * Update report with custom Open Graph image URL
   */
  async updateOGImage(checkId: string, ogImageUrl: string, userId?: string): Promise<void> {
    // Validate ownership if userId is provided
    if (userId) {
      const report = await this.prisma.check.findFirst({
        where: { id: checkId, userId }
      });
      
      if (!report) {
        throw new Error('Report not found or access denied');
      }
    }

    await this.prisma.check.update({
      where: { id: checkId },
      data: { ogImageUrl }
    });
  }

  /**
   * Get report statistics for analytics dashboard
   */
  async getReportStatistics(userId?: string) {
    const whereClause = userId ? { userId } : {};
    
    const [
      totalReports,
      publicReports,
      totalViews,
      totalShares
    ] = await Promise.all([
      this.prisma.check.count({
        where: { ...whereClause, slug: { not: null } }
      }),
      this.prisma.check.count({
        where: { ...whereClause, isPublic: true, slug: { not: null } }
      }),
      this.prisma.reportView.count({
        where: userId ? { check: { userId } } : {}
      }),
      this.prisma.shareEvent.count({
        where: { 
          success: true,
          ...(userId && { check: { userId } })
        }
      })
    ]);

    return {
      totalReports,
      publicReports,
      privateReports: totalReports - publicReports,
      totalViews,
      totalShares,
      averageSharesPerReport: totalReports > 0 ? totalShares / totalReports : 0
    };
  }
}