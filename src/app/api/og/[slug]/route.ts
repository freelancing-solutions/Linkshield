// src/app/api/og/[slug]/route.ts
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ShareableReportService } from '@/lib/services/shareable-report-service';
import { getScoreColor } from '@/lib/types/shareable-reports';

export const runtime = 'edge'; // Edge runtime for Vercel OG

const prisma = new PrismaClient();
const shareableReportService = new ShareableReportService(prisma);

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const report = await shareableReportService.getPublicReportBySlug(slug);

    // Fallback if report not found or not public
    if (!report) {
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 60,
              color: 'white',
              background: '#1a202c',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <p>LinkShield</p>
            <p style={{ fontSize: 30 }}>URL Security & Content Intelligence</p>
            <p style={{ fontSize: 24, marginTop: 20 }}>Report Not Found or Private</p>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      );
    }

    const domain = shareableReportService['extractDomain'](report.url); // Access private method
    const scoreColor = getScoreColor(report.securityScore);
    const scoreEmoji = shareableReportService['getScoreEmoji'](scoreColor); // Access private method

    const title = report.customTitle || `${domain} Security Report ${scoreEmoji}`;
    const description = report.customDescription || `Security Score: ${report.securityScore || 'N/A'}/100. Analyze your links with LinkShield.`;

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            color: 'white',
            background: '#1a202c', // Dark background
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          <p style={{ fontSize: 36, marginBottom: 10 }}>{title}</p>
          <p style={{ fontSize: 24, color: '#a0aec0', marginBottom: 20 }}>{description}</p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor:
                scoreColor === 'green'
                  ? '#38a169'
                  : scoreColor === 'yellow'
                  ? '#ecc94b'
                  : scoreColor === 'orange'
                  ? '#ed8936'
                  : '#e53e3e',
              color: 'white',
              fontSize: 36,
              fontWeight: 'bold',
            }}
          >
            Score: {report.securityScore || 'N/A'}/100
          </div>
          <p style={{ fontSize: 20, marginTop: 30, color: '#cbd5e0' }}>
            Powered by LinkShield
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    // Fallback for internal errors
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            color: 'white',
            background: '#1a202c',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p>LinkShield</p>
          <p style={{ fontSize: 30 }}>URL Security & Content Intelligence</p>
          <p style={{ fontSize: 24, marginTop: 20 }}>Error Generating Image</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  }
}
