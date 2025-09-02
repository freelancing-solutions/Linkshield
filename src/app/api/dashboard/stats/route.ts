import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's current month usage
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const [totalChecks, totalAIAnalyses, checksThisMonth, aiAnalysesThisMonth, user] = await Promise.all([
      // Total checks ever
      db.check.count({
        where: { userId: session.user.id }
      }),
      
      // Total AI analyses ever
      db.aIAnalysis.count({
        where: { userId: session.user.id }
      }),
      
      // Checks this month
      db.check.count({
        where: {
          userId: session.user.id,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      }),
      
      // AI analyses this month
      db.aIAnalysis.count({
        where: {
          userId: session.user.id,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      }),
      
      // User data with plan info
      db.user.findUnique({
        where: { id: session.user.id },
        include: {
          checks: {
            where: {
              createdAt: {
                gte: startOfMonth,
                lte: endOfMonth
              }
            },
            select: {
              securityScore: true
            }
          }
        }
      })
    ])

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate average security score
    const securityScores = user.checks.map(check => check.securityScore).filter(score => score !== null)
    const avgSecurityScore = securityScores.length > 0 
      ? Math.round(securityScores.reduce((sum, score) => sum + score, 0) / securityScores.length)
      : 0

    // Get plan limits
    const planLimits = {
      free: { checksPerMonth: 5, aiAnalysesPerMonth: 2 },
      pro: { checksPerMonth: 500, aiAnalysesPerMonth: 50 },
      enterprise: { checksPerMonth: 2500, aiAnalysesPerMonth: 500 }
    }

    const limits = planLimits[user.plan as keyof typeof planLimits] || planLimits.free

    const stats = {
      totalChecks,
      totalAIAnalyses,
      avgSecurityScore,
      checksThisMonth,
      aiAnalysesThisMonth,
      planLimits: limits
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}