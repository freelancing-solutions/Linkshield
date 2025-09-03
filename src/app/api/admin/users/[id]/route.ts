import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/middleware/admin-middleware'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateUserSchema = z.object({
  plan: z.enum(['free', 'pro', 'enterprise']).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
})

// PUT handler to update a user
async function putHandler(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const validation = updateUserSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 })
    }

    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: validation.data,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('[ADMIN_UPDATE_USER_API]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// DELETE handler to remove a user
async function deleteHandler(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.user.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 }) // No Content
  } catch (error) {
    console.error('[ADMIN_DELETE_USER_API]', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export const PUT = withAdminAuth(putHandler)
export const DELETE = withAdminAuth(deleteHandler)
