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

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Get user's check history with AI analysis info
    const [checks, totalCount] = await Promise.all([
      db.check.findMany({
        where: { userId: session.user.id },
        include: {
          aiAnalyses: {
            select: {
              id: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      
      db.check.count({
        where: { userId: session.user.id }
      })
    ])

    const history = checks.map(check => ({
      id: check.id,
      url: check.url,
      securityScore: check.securityScore || 0,
      statusCode: check.statusCode || 0,
      responseTime: check.responseTimeMs || 0,
      sslValid: check.sslValid || false,
      createdAt: check.createdAt.toISOString(),
      hasAIAnalysis: check.aiAnalyses.length > 0
    }))

    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Dashboard history error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard history' },
      { status: 500 }
    )
  }
}