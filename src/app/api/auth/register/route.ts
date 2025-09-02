import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password (in demo, we'll use a simple hash)
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        id: uuidv4(),
        name,
        email,
        plan: 'free',
        checks_used_this_month: 0,
        ai_analyses_used_this_month: 0
      }
    })

    // Create default plans if they don't exist
    await createDefaultPlans()

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

async function createDefaultPlans() {
  const plansCount = await db.plan.count()
  
  if (plansCount === 0) {
    await db.plan.createMany({
      data: [
        {
          id: uuidv4(),
          name: 'Free',
          checksPerMonth: 5,
          aiAnalysesPerMonth: 2,
          priceMonthly: 0,
          features: JSON.stringify([
            '5 URL checks per month',
            '2 AI analyses per month',
            'Basic security analysis',
            'Public reports'
          ])
        },
        {
          id: uuidv4(),
          name: 'Pro',
          checksPerMonth: 500,
          aiAnalysesPerMonth: 50,
          priceMonthly: 1900, // $19.00 in cents
          features: JSON.stringify([
            '500 URL checks per month',
            '50 AI analyses per month',
            'Advanced security analysis',
            'AI-powered content insights',
            'Priority support',
            'Custom branding'
          ])
        },
        {
          id: uuidv4(),
          name: 'Enterprise',
          checksPerMonth: 2500,
          aiAnalysesPerMonth: 500,
          priceMonthly: 9900, // $99.00 in cents
          features: JSON.stringify([
            '2500 URL checks per month',
            '500 AI analyses per month',
            'Advanced AI insights',
            'Competitive intelligence',
            'API access',
            'White-label reports',
            'Dedicated support'
          ])
        }
      ]
    })
  }
}