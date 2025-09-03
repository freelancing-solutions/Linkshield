import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
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
              marginBottom: '60px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#3B82F6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '30px',
              }}
            >
              <svg
                width="40"
                height="40"
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
                fontSize: '48px',
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
              padding: '80px',
              maxWidth: '800px',
              width: '90%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: '30px',
                textAlign: 'center',
              }}
            >
              Instant Link Safety Verification
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: '24px',
                color: '#9CA3AF',
                marginBottom: '40px',
                textAlign: 'center',
                lineHeight: '1.4',
              }}
            >
              Analyze any URL for security risks, SSL status,<br />
              response time, and content quality with AI
            </div>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                gap: '30px',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#10B981',
                  padding: '15px 25px',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}
                >
                  🔒 SSL Analysis
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#3B82F6',
                  padding: '15px 25px',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}
                >
                  ⚡ Speed Test
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#7C3AED',
                  padding: '15px 25px',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}
                >
                  🤖 AI Insights
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              style={{
                fontSize: '20px',
                color: '#60A5FA',
                fontWeight: '600',
              }}
            >
              linkshield.site
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
    console.error('Error generating default OG image:', error)
    return new NextResponse('Failed to generate image', { status: 500 })
  }
}