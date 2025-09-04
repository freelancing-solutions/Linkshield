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
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } },
          ],
        }
      : {}

    const [users, total] = await Promise.all([
      db.user.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      db.user.count({ where: whereClause }),
    ])

    return NextResponse.json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[ADMIN_USERS_API]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export const GET = withAdminAuth(handler)
