// src/app/api/reports/[slug]/privacy/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ShareableReportService } from '@/lib/services/shareable-report-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();
const shareableReportService = new ShareableReportService(prisma);

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const { isPublic } = await request.json();

  if (typeof isPublic !== 'boolean') {
    return NextResponse.json({ error: 'Invalid value for isPublic' }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the check by slug to get its ID and verify ownership
    const check = await prisma.check.findUnique({
      where: { slug },
      select: { id: true, userId: true },
    });

    if (!check) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (check.userId !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await shareableReportService.updateReportPrivacy(check.id, isPublic, userId);

    return NextResponse.json({ message: 'Report privacy updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating report privacy:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
