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

  try {
    const check = await prisma.check.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!check) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Basic IP address extraction (for demonstration, consider a more robust solution)
    const ipAddress = request.headers.get('x-forwarded-for') || request.ip;
    const userAgent = request.headers.get('user-agent');
    const referrer = request.headers.get('referer');

    await prisma.reportView.create({
      data: {
        checkId: check.id,
        viewerIp: ipAddress,
        userAgent: userAgent,
        referrer: referrer,
        // country: (Optional: integrate with IP geolocation service)
      },
    });

    return NextResponse.json({ message: 'Report view tracked' }, { status: 200 });
  } catch (error) {
    console.error('Error tracking report view:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
