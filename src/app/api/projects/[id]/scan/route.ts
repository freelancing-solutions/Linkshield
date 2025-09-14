import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is paid
    if (session.user.plan === 'free') {
      return NextResponse.json({ error: 'Premium plan required' }, { status: 403 })
    }

    const projectId = params.id

    // Verify project ownership and verification
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
        isVerified: true
      },
      include: {
        projectUrls: {
          where: {
            isActive: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found or not verified' }, { status: 404 })
    }

    if (project.projectUrls.length === 0) {
      return NextResponse.json({ error: 'No URLs found in project' }, { status: 400 })
    }

    // Start scanning process
    const scanJob = await initiateScan(project)

    return NextResponse.json({
      success: true,
      message: 'Scan initiated successfully',
      data: {
        jobId: scanJob.id,
        urlsToScan: project.projectUrls.length,
        estimatedDuration: '2-5 minutes'
      }
    })
  } catch (error) {
    console.error('Error initiating scan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function initiateScan(project: any) {
  // Create a scan job record (you might want to add a ScanJob model)
  const scanJob = await db.scanResult.create({
    data: {
      projectUrlId: project.projectUrls[0].id, // This would need to be adjusted for multiple URLs
      scanDate: new Date(),
      isClean: true, // Default to clean until proven otherwise
      details: JSON.stringify({
        status: 'initiated',
        startTime: new Date().toISOString(),
        totalUrls: project.projectUrls.length
      })
    }
  })

  // Start the scanning process asynchronously
  performScan(project, scanJob.id).catch(console.error)

  return scanJob
}

async function performScan(project: any, scanJobId: string) {
  try {
    const zai = await ZAI.create()

    for (const projectUrl of project.projectUrls) {
      try {
        console.log(`Scanning URL: ${projectUrl.url}`)

        // Perform basic HTTP check
        const response = await fetch(projectUrl.url, {
          method: 'GET',
          headers: {
            'User-Agent': 'LinkShield-Scanner/1.0'
          },
          timeout: 30000 // 30 second timeout
        })

        const scanResult = {
          url: projectUrl.url,
          statusCode: response.status,
          responseTime: 0, // Would need to measure
          sslValid: projectUrl.url.startsWith('https://'),
          timestamp: new Date().toISOString()
        }

        // Use AI for advanced threat detection if available
        let aiAnalysis = null
        try {
          const aiPrompt = `
            Analyze this URL for security threats and malicious content:
            URL: ${projectUrl.url}
            HTTP Status: ${response.status}
            Content-Type: ${response.headers.get('content-type') || 'unknown'}

            Please check for:
            1. Phishing indicators
            2. Malware patterns
            3. Suspicious redirects
            4. Security vulnerabilities
            5. Content safety issues

            Respond with a JSON object containing:
            {
              "isClean": boolean,
              "threatType": string or null,
              "confidence": number (0-1),
              "details": string
            }
          `

          const aiResponse = await zai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a security analysis AI. Analyze URLs for threats and provide detailed security assessments.'
              },
              {
                role: 'user',
                content: aiPrompt
              }
            ]
          })

          aiAnalysis = JSON.parse(aiResponse.choices[0]?.message?.content || '{}')
        } catch (aiError) {
          console.error('AI analysis failed:', aiError)
          // Continue without AI analysis
        }

        // Determine if URL is clean
        const isClean = response.status < 400 && 
                        (!aiAnalysis || aiAnalysis.isClean !== false) &&
                        !containsSuspiciousPatterns(projectUrl.url)

        // Save scan result
        await db.scanResult.create({
          data: {
            projectUrlId: projectUrl.id,
            scanDate: new Date(),
            isClean: isClean,
            threatType: aiAnalysis?.threatType || null,
            responseCode: response.status,
            details: JSON.stringify({
              ...scanResult,
              aiAnalysis: aiAnalysis || null
            })
          }
        })

        // Check if we need to trigger alerts
        if (!isClean && project.alertOnPoison) {
          await triggerAlert(project, projectUrl.url, aiAnalysis?.threatType || 'Unknown threat')
        }

      } catch (urlError) {
        console.error(`Error scanning URL ${projectUrl.url}:`, urlError)
        
        // Record failed scan
        await db.scanResult.create({
          data: {
            projectUrlId: projectUrl.id,
            scanDate: new Date(),
            isClean: false,
            threatType: 'Scan Failed',
            responseCode: null,
            details: JSON.stringify({
              error: urlError instanceof Error ? urlError.message : 'Unknown error',
              timestamp: new Date().toISOString()
            })
          }
        })
      }
    }

    // Update scan job status
    await db.scanResult.update({
      where: { id: scanJobId },
      data: {
        details: JSON.stringify({
          status: 'completed',
          endTime: new Date().toISOString()
        })
      }
    })

  } catch (error) {
    console.error('Error in performScan:', error)
    
    // Update scan job with error status
    await db.scanResult.update({
      where: { id: scanJobId },
      data: {
        details: JSON.stringify({
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          endTime: new Date().toISOString()
        })
      }
    })
  }
}

function containsSuspiciousPatterns(url: string): boolean {
  const suspiciousPatterns = [
    /bit\.ly|tinyurl\.com|goo\.gl/i,  // URL shorteners
    /login|signin|password|account/i,  // Authentication-related
    /free|gift|winner|claim/i,        // Common phishing terms
    /\.tk|\.ml|\.ga|\.cf/i,           // Suspicious TLDs
    /http:\/\/.*https?:\/\//i         // Mixed protocol (potential redirect)
  ]

  return suspiciousPatterns.some(pattern => pattern.test(url))
}

async function triggerAlert(project: any, url: string, threatType: string) {
  try {
    // Here you would implement email alerting
    console.log(`ALERT: Threat detected in project ${project.name}`)
    console.log(`URL: ${url}`)
    console.log(`Threat Type: ${threatType}`)
    console.log(`Alert Email: ${project.alertEmail}`)

    // TODO: Implement actual email sending using nodemailer or similar
    // This would require email configuration in environment variables
    
  } catch (error) {
    console.error('Error triggering alert:', error)
  }
}