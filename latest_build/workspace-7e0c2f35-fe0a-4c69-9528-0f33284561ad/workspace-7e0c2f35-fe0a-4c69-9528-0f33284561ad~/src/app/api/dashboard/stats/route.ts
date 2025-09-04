import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Plan limits configuration
const PLAN_LIMITS = {
  free: { checksPerMonth: 5, aiAnalysesPerMonth: 2 },
  pro: { checksPerMonth: 500, aiAnalysesPerMonth: 50 },
  enterprise: { checksPerMonth: 2500, aiAnalysesPerMonth: 500 }
} as const

type PlanType = keyof typeof PLAN_LIMITS

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    // Fetch user data with current month usage
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        checks_used_this_month: true,
        ai_analyses_used_this_month: true,
        _count: {
          select: {
            checks: true,
            aiAnalyses: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get current month's checks for security score calculation
    const monthlyChecks = await db.check.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        securityScore: {
          not: null
        }
      },
      select: {
        securityScore: true
      }
    })

    // Calculate average security score
    const avgSecurityScore = monthlyChecks.length > 0 
      ? Math.round(
          monthlyChecks.reduce((sum, check) => sum + (check.securityScore || 0), 0) / monthlyChecks.length
        )
      : 0

    // Get plan limits
    const planType = (user.plan as PlanType) || 'free'
    const planLimits = PLAN_LIMITS[planType]

    const stats = {
      user: {
        plan: user.plan
      },
      totalChecks: user._count.checks,
      totalAIAnalyses: user._count.aiAnalyses,
      avgSecurityScore,
      checksThisMonth: user.checks_used_this_month,
      aiAnalysesThisMonth: user.ai_analyses_used_this_month,
      planLimits
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