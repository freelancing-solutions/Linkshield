import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getPayPalAccessToken, PAYPAL_BASE } from '@/lib/paypal'

const PLAN_PRICES: Record<string, string> = {
  pro: '19.00',
  enterprise: '99.00'
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { planId } = body

    if (!planId || !['pro', 'enterprise'].includes(planId)) {
      return NextResponse.json({ success: false, error: 'Invalid plan ID' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const accessToken = await getPayPalAccessToken()

    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: 'USD', value: PLAN_PRICES[planId] },
            custom_id: JSON.stringify({ userId: user.id, planId })
          }
        ],
        application_context: {
          brand_name: 'LinkShield',
          return_url: process.env.PAYPAL_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL || ''}/pricing`,
          cancel_url: process.env.PAYPAL_CANCEL_URL || `${process.env.NEXT_PUBLIC_APP_URL || ''}/pricing`
        }
      })
    })

    const orderJson = await orderRes.json()
    const approvalLink = (orderJson.links || []).find((l: any) => l.rel === 'approve')?.href

    if (!approvalLink) {
      console.error('PayPal order creation failed:', orderJson)
      return NextResponse.json({ success: false, error: 'Failed to create PayPal order' }, { status: 502 })
    }

    // Do NOT update user plan here; wait for webhook verification
    return NextResponse.json({ success: true, approvalUrl: approvalLink })
  } catch (error) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
