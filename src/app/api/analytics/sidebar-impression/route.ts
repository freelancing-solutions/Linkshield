import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit-middleware'; // New import

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    // Basic IP address extraction (for demonstration, consider a more robust solution)
    const ipAddress = request.headers.get('x-forwarded-for') || request.ip;
    const userAgent = request.headers.get('user-agent');

    await prisma.sidebarImpression.create({
      data: {
        viewerIp: ipAddress,
        userAgent: userAgent,
      },
    });

    return NextResponse.json({ message: 'Sidebar impression tracked' }, { status: 200 });
  } catch (error) {
    console.error('Error tracking sidebar impression:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
