// src/app/api/og/[slug]/route.ts
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ShareableReportService } from '@/lib/services/shareable-report-service';
import { getScoreColor } from '@/lib/types/shareable-reports';
import React from 'react'; // Add this import

export const runtime = 'edge';

const prisma = new PrismaClient();
const shareableReportService = new ShareableReportService(prisma);

const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};

const getScoreEmoji = (scoreColor: string): string => {
  switch (scoreColor) {
    case 'green': return '🟢';
    case 'yellow': return '🟡';
    case 'orange': return '🟠';
    case 'red': return '🔴';
    default: return '⚪';
  }
};

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const report = await shareableReportService.getPublicReportBySlug(slug);

    if (!report) {
      return new ImageResponse(
        React.createElement('div', {
          style: {
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
          }
        }, [
          React.createElement('p', { key: 1 }, 'LinkShield'),
          React.createElement('p', { key: 2, style: { fontSize: 30 } }, 'URL Security & Content Intelligence'),
          React.createElement('p', { key: 3, style: { fontSize: 24, marginTop: 20 } }, 'Report Not Found or Private')
        ]),
        { width: 1200, height: 630 }
      );
    }

    const domain = extractDomain(report.url);
    const scoreColor = getScoreColor(report.securityScore);
    const scoreEmoji = getScoreEmoji(scoreColor);

    const title = report.customTitle || `${domain} Security Report ${scoreEmoji}`;
    const description = report.customDescription || `Security Score: ${report.securityScore || 'N/A'}/100. Analyze your links with LinkShield.`;

    return new ImageResponse(
      React.createElement('div', {
        style: {
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
          fontFamily: 'sans-serif',
        }
      }, [
        React.createElement('p', { key: 1, style: { fontSize: 36, marginBottom: 10 } }, title),
        React.createElement('p', { key: 2, style: { fontSize: 24, color: '#a0aec0', marginBottom: 20 } }, description),
        React.createElement('div', {
          key: 3,
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 20px',
            borderRadius: '10px',
            backgroundColor:
              scoreColor === 'green' ? '#38a169' :
              scoreColor === 'yellow' ? '#ecc94b' :
              scoreColor === 'orange' ? '#ed8936' : '#e53e3e',
            color: 'white',
            fontSize: 36,
            fontWeight: 'bold',
          }
        }, `Score: ${report.securityScore || 'N/A'}/100`),
        React.createElement('p', { key: 4, style: { fontSize: 20, marginTop: 30, color: '#cbd5e0' } }, 'Powered by LinkShield')
      ]),
      { width: 1200, height: 630 }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new ImageResponse(
      React.createElement('div', {
        style: {
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
        }
      }, [
        React.createElement('p', { key: 1 }, 'LinkShield'),
        React.createElement('p', { key: 2, style: { fontSize: 30 } }, 'URL Security & Content Intelligence'),
        React.createElement('p', { key: 3, style: { fontSize: 24, marginTop: 20 } }, 'Error Generating Image')
      ]),
      { width: 1200, height: 630 }
    );
  }
}