// src/app/api/reports/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ShareableReportService } from '@/lib/services/shareable-report-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();
const shareableReportService = new ShareableReportService(prisma);

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });
    }

    // Verify ownership before deleting
    const check = await prisma.check.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!check) {
      return NextResponse.json({ error: 'Report not found', success: false }, { status: 404 });
    }

    if (check.userId !== userId) {
      return NextResponse.json({ error: 'Access denied', success: false }, { status: 403 });
    }

    await shareableReportService.deleteShareableReport(id, userId);

    return NextResponse.json({ message: 'Report deleted successfully', success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
