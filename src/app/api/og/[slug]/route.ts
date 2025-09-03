import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { db } from '@/lib/db'
import { ShareableReportService } from '@/lib/services/shareable-report-service'
import { getScoreColor } from '@/lib/types/shareable-reports'

// Initialize the shareable report service
const shareableReportService = new ShareableReportService(db)

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Get the report data
    const report = await shareableReportService.getPublicReportBySlug(slug)
    
    if (!report) {
      return new NextResponse('Report not found', { status: 404 })
    }

    const domain = new URL(report.url).hostname.replace(/^www\./, '')
    const scoreColor = getScoreColor(report.securityScore)
    const hasAI = report.aiAnalyses && report.aiAnalyses.length > 0

    // Color mapping for the design
    const colorMap = {
      green: { bg: '#10B981', text: '#FFFFFF', accent: '#059669' },
      yellow: { bg: '#F59E0B', text: '#FFFFFF', accent: '#D97706' },
      orange: { bg: '#F97316', text: '#FFFFFF', accent: '#EA580C' },
      red: { bg: '#EF4444', text: '#FFFFFF', accent: '#DC2626' }
    }

    const colors = colorMap[scoreColor]

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1F2937',
            backgroundImage: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#3B82F6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}
            >
              LinkShield
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#374151',
              borderRadius: '20px',
              padding: '60px',
              maxWidth: '800px',
              width: '90%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Security Score */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  color: colors.bg,
                  marginRight: '20px',
                }}
              >
                {report.securityScore || 'N/A'}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    color: '#9CA3AF',
                    marginBottom: '5px',
                  }}
                >
                  Security Score
                </div>
                <div
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  {scoreColor === 'green' ? 'Excellent' :
                   scoreColor === 'yellow' ? 'Good' :
                   scoreColor === 'orange' ? 'Warning' : 'Poor'}
                </div>
              </div>
            </div>

            {/* Domain */}
            <div
              style={{
                fontSize: '32px',
                fontWeight: '600',
                color: '#FFFFFF',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              {domain}
            </div>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                gap: '30px',
                marginBottom: '30px',
              }}
            >
              {/* SSL Status */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#4B5563',
                  padding: '12px 20px',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: report.sslValid ? '#10B981' : '#EF4444',
                    marginRight: '10px',
                  }}
                />
                <div
                  style={{
                    fontSize: '16px',
                    color: '#E5E7EB',
                  }}
                >
                  SSL {report.sslValid ? 'Valid' : 'Invalid'}
                </div>
              </div>

              {/* Response Time */}
              {report.responseTimeMs && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#4B5563',
                    padding: '12px 20px',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#E5E7EB',
                    }}
                  >
                    {report.responseTimeMs}ms
                  </div>
                </div>
              )}

              {/* AI Enhanced */}
              {hasAI && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#7C3AED',
                    padding: '12px 20px',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#FFFFFF',
                      fontWeight: '600',
                    }}
                  >
                    AI Enhanced
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                fontSize: '18px',
                color: '#9CA3AF',
                textAlign: 'center',
              }}
            >
              Security Report • linkshield.site
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new NextResponse('Failed to generate image', { status: 500 })
  }
}