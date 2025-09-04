
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit-middleware'; // New import

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  const { slug } = params;
  const { shareMethod, success } = await request.json();

  if (!shareMethod || success === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const check = await prisma.check.findUnique({
      where: { slug },
    });

    if (!check) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const shareEvent = await prisma.shareEvent.create({
      data: {
        checkId: check.id,
        shareMethod,
        success,
        // TODO: Add userAgent, referrer, ipAddress
      },
    });

    return NextResponse.json(shareEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating share event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
