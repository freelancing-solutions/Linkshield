import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/middleware/admin-middleware'
import { db } from '@/lib/db'

// DELETE handler to remove a report
async function deleteHandler(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.check.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 }) // No Content
  } catch (error) {
    console.error('[ADMIN_DELETE_REPORT_API]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export const DELETE = withAdminAuth(deleteHandler)
