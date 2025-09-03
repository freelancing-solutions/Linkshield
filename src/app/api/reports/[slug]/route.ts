// src/app/api/reports/[slug]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ShareableReportService } from '@/lib/services/shareable-report-service';
import { getServerSession }nfrom 'next-auth';
import { authOptions } from '@/lib/auth'; // Import authOptions
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit-middleware'; // New import

const prisma = new PrismaClient();
const shareableReportService = new ShareableReportService(prisma);

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const report = await shareableReportService.getReportBySlug(slug, userId);

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // If the report is private and the user is not authorized (not owner)
    if (!report.isPublic && report.userId !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Format report for public display if it's public
    const formattedReport = report.isPublic
      ? shareableReportService.formatReportForPublicDisplay(report)
      : report; // If private, return full report (assuming user is authorized)

    return NextResponse.json(formattedReport);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
