import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ShareableReportService } from '@/lib/services/shareable-report-service';
import { formatRecentReportForDisplay } from '@/lib/utils';

const prisma = new PrismaClient();
const shareableReportService = new ShareableReportService(prisma);

export async function GET() {
  try {
    const recentReports = await shareableReportService.getRecentReports();
    const displayReports = recentReports.map(report => formatRecentReportForDisplay(report));
    return NextResponse.json({ success: true, data: displayReports });
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
