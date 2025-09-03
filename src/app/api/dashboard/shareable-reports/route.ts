import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ShareableReportService } from '@/lib/services/shareable-report-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();
const shareableReportService = new ShareableReportService(prisma);

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userShareableReports = await shareableReportService.getUserShareableReports(userId);

    return NextResponse.json({ success: true, data: userShareableReports });
  } catch (error) {
    console.error('Error fetching user shareable reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
