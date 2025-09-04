import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import React from 'react'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    return new ImageResponse(
      React.createElement('div', {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1F2937',
          backgroundImage: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }
      }, [
        // Header
        React.createElement('div', {
          key: 'header',
          style: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '60px',
          }
        }, [
          React.createElement('div', {
            key: 'logo',
            style: {
              width: '80px',
              height: '80px',
              backgroundColor: '#3B82F6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '30px',
            }
          }, React.createElement('div', {
            style: {
              width: '40px',
              height: '40px',
              backgroundColor: 'white',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }
          })),
          React.createElement('div', {
            key: 'title',
            style: {
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#FFFFFF',
            }
          }, 'LinkShield')
        ]),

        // Main Content
        React.createElement('div', {
          key: 'main',
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#374151',
            borderRadius: '20px',
            padding: '80px',
            maxWidth: '800px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }
        }, [
          // Title
          React.createElement('div', {
            key: 'main-title',
            style: {
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: '30px',
              textAlign: 'center',
            }
          }, 'Instant Link Safety Verification'),

          // Subtitle
          React.createElement('div', {
            key: 'subtitle',
            style: {
              fontSize: '24px',
              color: '#9CA3AF',
              marginBottom: '40px',
              textAlign: 'center',
              lineHeight: '1.4',
            }
          }, 'Analyze any URL for security risks, SSL status, response time, and content quality with AI'),

          // Features
          React.createElement('div', {
            key: 'features',
            style: {
              display: 'flex',
              gap: '30px',
              marginBottom: '40px',
            }
          }, [
            React.createElement('div', {
              key: 'ssl',
              style: {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#10B981',
                padding: '15px 25px',
                borderRadius: '12px',
              }
            }, React.createElement('div', {
              style: {
                fontSize: '18px',
                color: '#FFFFFF',
                fontWeight: '600',
              }
            }, 'SSL Analysis')),

            React.createElement('div', {
              key: 'speed',
              style: {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#3B82F6',
                padding: '15px 25px',
                borderRadius: '12px',
              }
            }, React.createElement('div', {
              style: {
                fontSize: '18px',
                color: '#FFFFFF',
                fontWeight: '600',
              }
            }, 'Speed Test')),

            React.createElement('div', {
              key: 'ai',
              style: {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#7C3AED',
                padding: '15px 25px',
                borderRadius: '12px',
              }
            }, React.createElement('div', {
              style: {
                fontSize: '18px',
                color: '#FFFFFF',
                fontWeight: '600',
              }
            }, 'AI Insights'))
          ]),

          // CTA
          React.createElement('div', {
            key: 'cta',
            style: {
              fontSize: '20px',
              color: '#60A5FA',
              fontWeight: '600',
            }
          }, 'linkshield.site')
        ])
      ]),
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