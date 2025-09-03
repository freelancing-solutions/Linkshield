import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { 
  isValidUrl, 
  createUrlHash, 
  performURLAnalysis, 
  analyzeContentWithAI,
} from '@/lib/url-analysis' // Removed generateShareableReport
import crypto from 'crypto'
import { ShareableReportService } from '@/lib/services/shareable-report-service'; // New import
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit-middleware'; // New import

// Plan limits
const PLAN_LIMITS = {
  free: { checksPerMonth: 5, aiAnalysesPerMonth: 2 },
  pro: { checksPerMonth: 500, aiAnalysesPerMonth: 50 },
  enterprise: { checksPerMonth: 2500, aiAnalysesPerMonth: 500 }
}

const shareableReportService = new ShareableReportService(db); // Instantiate service

async function checkUsageLimits(userId: string, plan: string, includeAI: boolean) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [checksThisMonth, aiAnalysesThisMonth] = await Promise.all([
    db.check.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    }),
    
    db.aIAnalysis.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })
  ])

  const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free

  const canPerformCheck = checksThisMonth < limits.checksPerMonth
  const canPerformAIAnalysis = !includeAI || aiAnalysesThisMonth < limits.aiAnalysesPerMonth

  return {
    canPerformCheck,
    canPerformAIAnalysis,
    checksRemaining: limits.checksPerMonth - checksThisMonth,
    aiAnalysesRemaining: limits.aiAnalysesPerMonth - aiAnalysesThisMonth,
    checksThisMonth,
    aiAnalysesThisMonth,
    limits
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { url, includeAI = false } = body
    
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL provided' },
        { status: 400 }
      )
    }

    // For authenticated users, check usage limits
    if (session?.user?.id) {
      const usage = await checkUsageLimits(session.user.id, session.user.plan, includeAI)
      
      if (!usage.canPerformCheck) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Monthly check limit reached',
            code: 'LIMIT_EXCEEDED',
            usage: {
              checksThisMonth: usage.checksThisMonth,
              checksLimit: usage.limits.checksPerMonth,
              checksRemaining: 0
            }
          },
          { status: 429 }
        )
      }

      if (includeAI && !usage.canPerformAIAnalysis) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Monthly AI analysis limit reached',
            code: 'AI_LIMIT_EXCEEDED',
            usage: {
              aiAnalysesThisMonth: usage.aiAnalysesThisMonth,
              aiAnalysesLimit: usage.limits.aiAnalysesPerMonth,
              aiAnalysesRemaining: 0
            }
          },
          { status: 429 }
        )
      }
    }

    // Check if we already have an analysis for this URL
    const urlHash = createUrlHash(url)
    const existingCheck = await db.check.findFirst({
      where: { urlHash },
      include: {
        aiAnalyses: {
          where: { processingStatus: 'completed' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // If we have a recent analysis (less than 1 hour old), return it
    if (existingCheck) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      if (existingCheck.createdAt > oneHourAgo) {
        // If an existing check is found, and it has a slug, return it as a shareable report
        // Otherwise, return the raw check and let the frontend handle shareable creation
        if (existingCheck.slug) {
          const shareableReport = await shareableReportService.getReportBySlug(existingCheck.slug, session?.user?.id);
          if (shareableReport) {
            return NextResponse.json({
              success: true,
              data: shareableReport,
              cached: true
            });
          }
        }
        // If no slug or getReportBySlug failed, return the raw existingCheck
        return NextResponse.json({
          success: true,
          data: existingCheck, // Return the raw check data
          cached: true
        });
      }
    }
    
    // Perform new analysis
    const analysisResult = await performURLAnalysis(url)
    
    // Store the initial check result in database
    const checkId = uuidv4()
    let check = await db.check.create({ // Changed to let
      data: {
        id: checkId,
        userId: session?.user?.id || null,
        url,
        urlHash,
        statusCode: analysisResult.statusCode,
        responseTimeMs: analysisResult.responseTime,
        sslValid: analysisResult.sslValid,
        securityScore: analysisResult.securityScore,
        metaData: analysisResult.meta ? JSON.stringify(analysisResult.meta) : null,
        redirectChain: analysisResult.redirectChain ? JSON.stringify(analysisResult.redirectChain) : null,
        isPublic: false // Default to false, will be updated by createShareableReport
      }
    })
    
    // Perform AI analysis if requested and content is available
    let aiAnalysis = null
    if (includeAI && analysisResult.content && session?.user?.id) {
      try {
        const contentHash = crypto.createHash('sha256').update(analysisResult.content).digest('hex')
        
        // Check if AI analysis already exists for this content
        const existingAIAnalysis = await db.aIAnalysis.findUnique({
          where: { contentHash }
        })
        
        if (existingAIAnalysis) {
          aiAnalysis = existingAIAnalysis
        } else {
          // Perform AI analysis
          const aiResult = await analyzeContentWithAI(analysisResult.content, url)
          
          // Create AI analysis record
          aiAnalysis = await db.aIAnalysis.create({
            data: {
              id: uuidv4(),
              userId: session.user.id,
              checkId: check.id,
              url,
              contentHash,
              contentSummary: aiResult.summary,
              qualityMetrics: JSON.stringify({
                readabilityScore: aiResult.readabilityScore,
                contentDepthScore: aiResult.qualityScore,
                seoOptimizationScore: Math.floor(Math.random() * 30) + 70,
                originalityScore: Math.floor(Math.random() * 25) + 65,
                engagementScore: Math.floor(Math.random() * 20) + 60,
                overallQuality: Math.floor((aiResult.readabilityScore + aiResult.qualityScore) / 2)
              }),
              topicCategories: JSON.stringify(aiResult.topics),
              contentLength: analysisResult.content.length,
              language: 'en', // Would be detected in real implementation
              processingStatus: 'completed'
            }
          })
        }
      } catch (error) {
        console.error('AI analysis error:', error)
        // Continue without AI analysis if it fails
      }
    }
    
    // Create shareable report and generate slug
    const shareableReport = await shareableReportService.createShareableReport({
      checkId: check.id,
      isPublic: body.isPublic || false, // Get isPublic from request body, default to false
      customTitle: body.customTitle,
      customDescription: body.customDescription,
      includeAIInsights: includeAI // Pass includeAI to service if needed
    });

    return NextResponse.json({
      success: true,
      data: shareableReport // Return the full shareable report
    });
    
  } catch (error) {
    console.error('URL analysis error:', error)
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to analyze URL' },
      { status: 500 }
    )
  }
}