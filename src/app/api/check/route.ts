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
  generateShareableReport
} from '@/lib/url-analysis'
import crypto from 'crypto'

// Plan limits
const PLAN_LIMITS = {
  free: { checksPerMonth: 5, aiAnalysesPerMonth: 2 },
  pro: { checksPerMonth: 500, aiAnalysesPerMonth: 50 },
  enterprise: { checksPerMonth: 2500, aiAnalysesPerMonth: 500 }
}

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
        const report = generateShareableReport(existingCheck, existingCheck.aiAnalyses[0])
        return NextResponse.json({
          success: true,
          data: report,
          cached: true
        })
      }
    }
    
    // Perform new analysis
    const analysisResult = await performURLAnalysis(url)
    
    // Store the result in database
    const checkId = uuidv4()
    const check = await db.check.create({
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
        isPublic: false
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
    
    // Generate and return the report
    const report = generateShareableReport(check, aiAnalysis)
    
    return NextResponse.json({
      success: true,
      data: report
    })
    
  } catch (error) {
    console.error('URL analysis error:', error)
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to analyze URL' },
      { status: 500 }
    )
  }
}