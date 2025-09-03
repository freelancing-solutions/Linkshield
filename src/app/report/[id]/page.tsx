import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ReportDetails from '@/components/ReportDetails'; // Import the new client component

interface ReportPageProps {
  params: {
    id: string;
  };
}

interface ReportData {
  id: string;
  url: string;
  analyzedAt: Date;
  securityScore: number;
  statusCode: number;
  responseTime: number;
  sslValid: boolean;
  meta?: {
    title?: string;
    description?: string;
  };
  redirectChain?: Array<{ statusCode: number; url: string }>;
  isPublic: boolean;
  slug: string | null;
  shareCount: number;
  customTitle: string | null;
  customDescription: string | null;
  ogImageUrl: string | null;
  aiInsights?: {
    qualityScore?: number;
    summary?: string;
    topics?: string[];
    contentLength?: number;
  };
}

async function getReportData(id: string): Promise<ReportData | null> {
  try {
    const check = await db.check.findUnique({
      where: { id },
      include: {
        aiAnalyses: {
          where: { processingStatus: 'completed' }
        }
      },
      select: { // Explicitly select fields including slug and isPublic
        id: true,
        url: true,
        createdAt: true,
        securityScore: true,
        statusCode: true,
        responseTimeMs: true,
        sslValid: true,
        metaData: true,
        redirectChain: true,
        isPublic: true, // Include isPublic
        slug: true, // Include slug
        shareCount: true, // Include shareCount
        customTitle: true, // Include customTitle
        customDescription: true, // Include customDescription
        ogImageUrl: true, // Include ogImageUrl
        aiAnalyses: {
          where: { processingStatus: 'completed' }
        }
      }
    });

    if (!check) {
      return null;
    }

    // Track report view
    // This part should ideally be handled by a server action or middleware
    // For now, keeping it here for simplicity, but be aware of limitations in server components
    // when trying to access request headers directly for IP/UserAgent.
    // A more robust solution would pass these from a middleware or client-side fetch.
    await db.reportView.create({
      data: {
        checkId: check.id,
        viewerIp: '', // Placeholder: needs actual IP from request headers
        userAgent: '', // Placeholder: needs actual User-Agent from request headers
        referrer: '', // Placeholder: needs actual Referrer from request headers
        country: '' // Placeholder: needs actual Country from geo IP
      }
    });

    return {
      id: check.id,
      url: check.url,
      analyzedAt: check.createdAt,
      securityScore: check.securityScore,
      statusCode: check.statusCode,
      responseTime: check.responseTimeMs,
      sslValid: check.sslValid,
      meta: check.metaData ? JSON.parse(check.metaData) : undefined,
      redirectChain: check.redirectChain ? JSON.parse(check.redirectChain) : undefined,
      isPublic: check.isPublic,
      slug: check.slug,
      shareCount: check.shareCount,
      customTitle: check.customTitle,
      customDescription: check.customDescription,
      ogImageUrl: check.ogImageUrl,
      aiInsights: check.aiAnalyses[0] ? {
        qualityScore: check.aiAnalyses[0].qualityMetrics ? JSON.parse(check.aiAnalyses[0].qualityMetrics).overallQuality : undefined,
        summary: check.aiAnalyses[0].contentSummary,
        topics: check.aiAnalyses[0].topicCategories ? JSON.parse(check.aiAnalyses[0].topicCategories) : [],
        contentLength: check.aiAnalyses[0].contentLength
      } : undefined
    };
  } catch (error) {
    console.error('Error fetching report data:', error);
    return null;
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const report = await getReportData(params.id);

  if (!report) {
    notFound();
  }

  return <ReportDetails report={report} />;
}
