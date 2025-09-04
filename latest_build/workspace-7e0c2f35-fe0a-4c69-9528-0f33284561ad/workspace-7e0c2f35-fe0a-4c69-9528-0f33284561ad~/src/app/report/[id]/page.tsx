 
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import ReportDetails  from '@/components/ReportDetails';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type Report = Awaited<ReturnType<typeof getReport>>;
type ReportData = Omit<Report, 'aiInsights'> & {
  aiInsights?: {
    qualityScore?: number;
    summary?: string;
    topics?: string[];
    contentLength?: number;
  };
};

/* ------------------------------------------------------------------ */
/* Pure data fetcher – no side effects                                */
/* ------------------------------------------------------------------ */
async function getReport(id: string) {
  const record = await db.check.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      url: true,
      urlHash: true,
      createdAt: true,
      securityScore: true,
      statusCode: true,
      responseTimeMs: true,
      sslValid: true,
      metaData: true,
      redirectChain: true,
      isPublic: true,
      slug: true,
      shareCount: true,
      customTitle: true,
      customDescription: true,
      ogImageUrl: true,
      aiAnalyses: {
        where: { processingStatus: 'completed' },
        take: 1,
        select: {
          qualityMetrics: true,
          contentSummary: true,
          topicCategories: true,
          contentLength: true,
        },
      },
    },
  });

  if (!record) return null;

  const ai = record.aiAnalyses[0];
  return {
    ...record,
    // Add the missing properties expected by ReportData
    analyzedAt: record.createdAt,
    responseTime: record.responseTimeMs || 0,
    meta: record.metaData ? JSON.parse(record.metaData) : undefined,
    redirectChain: record.redirectChain ? JSON.parse(record.redirectChain) : undefined,
    aiInsights: ai
      ? {
          qualityScore: ai.qualityMetrics ? JSON.parse(ai.qualityMetrics).overallQuality : undefined,
          summary: ai.contentSummary ?? undefined,
          topics: ai.topicCategories ? JSON.parse(ai.topicCategories) : [],
          contentLength: ai.contentLength ?? undefined,
        }
      : undefined,
  };
}

/* ------------------------------------------------------------------ */
/* Side-effect: fire-and-forget view tracking                         */
/* ------------------------------------------------------------------ */
async function trackView(checkId: string) {
  const hs = await headers();
  const ip = hs.get('x-forwarded-for') ?? hs.get('x-real-ip') ?? 'unknown';
  const ua = hs.get('user-agent') ?? '';
  const referrer = hs.get('referer') ?? '';
  const country = hs.get('x-vercel-ip-country') ?? '';

  // non-blocking insert
  db.reportView
    .create({
      data: {
        checkId,
        viewerIp: ip,
        userAgent: ua,
        referrer,
        country,
      },
    })
    .catch(() => {
      /* swallow – view tracking is best-effort */
    });
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
export default async function ReportPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const report = await getReport(id);
  if (!report) notFound();

  // kick off side-effect after we know the report exists
  void trackView(report.id);

  return <ReportDetails report={report satisfies ReportData} />;
}