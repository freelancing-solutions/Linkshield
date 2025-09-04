import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// Define a type for a handler that takes a request and a session
type AdminApiHandler = (
  req: NextRequest,
  session: any // Using any for now to avoid session type issues
) => Promise<NextResponse>

export function withAdminAuth(handler: AdminApiHandler) {
  return async (req: NextRequest) => {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have permission to access this resource.' },
        { status: 403 }
      )
    }

    return handler(req, session)
  }
}
