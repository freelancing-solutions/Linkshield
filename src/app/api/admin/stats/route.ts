import { NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/middleware/admin-middleware'
import { db } from '@/lib/db'

async function handler() {
  try {
    const totalUsers = await db.user.count()
    const proUsers = await db.user.count({ where: { plan: 'pro' } })
    const enterpriseUsers = await db.user.count({ where: { plan: 'enterprise' } })

    const totalReports = await db.check.count()
    const publicReports = await db.check.count({ where: { isPublic: true } })

    const stats = {
      users: {
        total: totalUsers,
        pro: proUsers,
        enterprise: enterpriseUsers,
        free: totalUsers - proUsers - enterpriseUsers,
      },
      reports: {
        total: totalReports,
        public: publicReports,
        private: totalReports - publicReports,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('[ADMIN_STATS_API]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export const GET = withAdminAuth(handler)
