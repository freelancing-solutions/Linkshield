import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/middleware/admin-middleware'
import { db } from '@/lib/db'

async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const searchQuery = searchParams.get('search')

    const skip = (page - 1) * limit

    const whereClause = searchQuery
      ? {
          url: { contains: searchQuery, mode: 'insensitive' },
        }
      : {}

    const [reports, total] = await Promise.all([
      db.check.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: { // Include the user to show who created the report
          user: {
            select: {
              email: true,
              name: true,
            }
          }
        }
      }),
      db.check.count({ where: whereClause }),
    ])

    return NextResponse.json({
      data: reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[ADMIN_REPORTS_API]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export const GET = withAdminAuth(handler)
