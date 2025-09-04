import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getPayPalAccessToken, PAYPAL_BASE } from '@/lib/paypal'

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text()
    const webhookEvent = JSON.parse(bodyText)

    const transmissionId = request.headers.get('paypal-transmission-id') || ''
    const transmissionTime = request.headers.get('paypal-transmission-time') || ''
    const certUrl = request.headers.get('paypal-cert-url') || ''
    const authAlgo = request.headers.get('paypal-auth-algo') || ''
    const transmissionSig = request.headers.get('paypal-transmission-sig') || ''
    const webhookId = process.env.PAYPAL_WEBHOOK_ID

    if (!webhookId) {
      console.error('Missing PAYPAL_WEBHOOK_ID')
      return NextResponse.json({ received: true }, { status: 400 })
    }

    const accessToken = await getPayPalAccessToken()

    const verifyRes = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: webhookEvent
      })
    })

    const verifyJson = await verifyRes.json()
    if (verifyJson.verification_status !== 'SUCCESS') {
      console.warn('PayPal webhook verification failed', verifyJson)
      return NextResponse.json({ received: true }, { status: 400 })
    }

    const eventType = webhookEvent.event_type

    if (eventType === 'CHECKOUT.ORDER.APPROVED' || eventType === 'PAYMENT.CAPTURE.COMPLETED' || eventType === 'CHECKOUT.ORDER.COMPLETED' || eventType === 'PAYMENT.CAPTURE.DENIED') {
      const resource = webhookEvent.resource
      let customIdRaw: string | undefined

      if (resource?.purchase_units && Array.isArray(resource.purchase_units)) {
        customIdRaw = resource.purchase_units[0]?.custom_id
      }

      if (!customIdRaw && resource?.custom_id) {
        customIdRaw = resource.custom_id
      }

      if (!customIdRaw && webhookEvent?.resource?.supplementary_data?.custom_id) {
        customIdRaw = webhookEvent.resource.supplementary_data.custom_id
      }

      if (!customIdRaw) {
        console.warn('No custom_id found in PayPal webhook resource')
        return NextResponse.json({ received: true }, { status: 200 })
      }

      let parsed: { userId: string; planId: string } | null = null
      try {
        parsed = JSON.parse(customIdRaw)
      } catch (err) {
        console.error('Failed to parse custom_id:', err)
      }

      if (!parsed?.userId || !parsed?.planId) {
        console.warn('Invalid custom_id payload', customIdRaw)
        return NextResponse.json({ received: true }, { status: 200 })
      }

      if (eventType === 'PAYMENT.CAPTURE.COMPLETED' || eventType === 'CHECKOUT.ORDER.COMPLETED' || eventType === 'CHECKOUT.ORDER.APPROVED') {
        const expiration = new Date()
        expiration.setMonth(expiration.getMonth() + 1)

        await db.user.updateMany({
          where: { id: parsed.userId },
          data: {
            plan: parsed.planId,
            plan_expires_at: expiration,
            paypal_order_id: webhookEvent.resource?.id || null
          }
        })

        console.log(`Updated user ${parsed.userId} to plan ${parsed.planId}`)
      }

      if (eventType === 'PAYMENT.CAPTURE.DENIED') {
        // keep user on free plan (or revert any temporary changes)
        console.log('Payment denied for custom_id', customIdRaw)
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json({ received: true }, { status: 500 })
  }
}
