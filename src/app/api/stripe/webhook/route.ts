import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// This is a mock webhook handler
// In production, you would verify the Stripe signature and handle real events

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    console.log('Received Stripe webhook:', type)

    // Handle different event types
    switch (type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(data)
        break
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(data)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(data)
        break
      
      default:
        console.log('Unhandled event type:', type)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(data: any) {
  try {
    const { customer_email, client_reference_id, metadata } = data
    
    if (!client_reference_id) {
      console.log('No client reference ID in session')
      return
    }

    // Update user plan based on the session
    const planId = metadata?.plan || 'pro'
    
    await db.user.update({
      where: { id: client_reference_id },
      data: {
        plan: planId,
        plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    console.log(`Updated user ${client_reference_id} to plan ${planId}`)
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

async function handleInvoicePaymentSucceeded(data: any) {
  try {
    const { customer_email, subscription } = data
    
    // Update subscription expiration
    if (subscription?.current_period_end) {
      const expirationDate = new Date(subscription.current_period_end * 1000)
      
      // Find user by customer email and update
      await db.user.updateMany({
        where: { email: customer_email },
        data: {
          plan_expires_at: expirationDate
        }
      })
    }
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error)
  }
}

async function handleSubscriptionDeleted(data: any) {
  try {
    const { customer_email } = data
    
    // Downgrade user to free plan
    await db.user.updateMany({
      where: { email: customer_email },
      data: {
        plan: 'free',
        plan_expires_at: null
      }
    })
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}