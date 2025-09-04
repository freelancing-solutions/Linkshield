import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// Validation schema for project creation
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  domain: z.string().min(1, 'Domain is required').max(255)
    .refine((domain) => {
      // Basic domain validation
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      return domainRegex.test(domain)
    }, 'Invalid domain format')
})

// Generate verification token
function generateVerificationToken(): string {
  return `linkshield-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is paid
    if (session.user.plan === 'free') {
      return NextResponse.json({ error: 'Premium plan required' }, { status: 403 })
    }

    const projects = await db.project.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        projectUrls: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            url: true,
            addedAt: true
          }
        },
        _count: {
          select: {
            projectUrls: {
              where: {
                isActive: true
              }
            },
            scanResults: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is paid
    if (session.user.plan === 'free') {
      return NextResponse.json({ error: 'Premium plan required' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    // Normalize domain (remove protocol, www, and trailing slash)
    const normalizedDomain = validatedData.domain
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')

    // Check if user already has a project for this domain
    const existingProject = await db.project.findFirst({
      where: {
        userId: session.user.id,
        domain: normalizedDomain
      }
    })

    if (existingProject) {
      return NextResponse.json(
        { error: 'You already have a project for this domain' },
        { status: 400 }
      )
    }

    // Create project with verification token
    const project = await db.project.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        domain: normalizedDomain,
        verificationToken: generateVerificationToken()
      }
    })

    return NextResponse.json({ 
      data: {
        id: project.id,
        name: project.name,
        domain: project.domain,
        isVerified: project.isVerified,
        verificationToken: project.verificationToken,
        monitoringFrequency: project.monitoringFrequency,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        projectUrls: [],
        _count: {
          projectUrls: 0,
          scanResults: 0
        }
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}