import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ShareableReportService } from '@/lib/services/shareable-report-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CreateShareableReportData } from '@/lib/types/shareable-reports';

const prisma = new PrismaClient();
const shareableReportService = new ShareableReportService(prisma);

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userShareableReports = await shareableReportService.getUserShareableReports(userId);

    return NextResponse.json({ success: true, data: userShareableReports });
  } catch (error) {
    console.error('Error fetching user shareable reports:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { checkId, isPublic, customTitle, customDescription }: CreateShareableReportData = await request.json();

    if (!checkId || typeof isPublic === 'undefined') {
      return NextResponse.json({ success: false, error: 'Missing required fields: checkId, isPublic' }, { status: 400 });
    }

    // Assuming createShareableReport handles both creation and updating the isPublic flag
    // If the report already has a slug, this will update its public status and other data
    const shareableReport = await shareableReportService.createShareableReport({
      checkId,
      isPublic,
      customTitle,
      customDescription,
    });

    return NextResponse.json({ success: true, data: shareableReport });
  } catch (error) {
    console.error('Error creating/updating shareable report:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
