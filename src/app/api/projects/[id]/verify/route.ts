import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

interface VerificationResult {
  success: boolean
  message: string
  project?: {
    id: string
    name: string
    domain: string
    isVerified: boolean
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is paid
    if (session.user.plan === 'free') {
      return NextResponse.json({ error: 'Premium plan required' }, { status: 403 })
    }

    const projectId = params.id

    // Get the project
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // If already verified, return success
    if (project.isVerified) {
      return NextResponse.json({
        success: true,
        message: 'Domain is already verified',
        project: {
          id: project.id,
          name: project.name,
          domain: project.domain,
          isVerified: project.isVerified
        }
      })
    }

    // Try to verify the domain
    const verificationResult = await verifyDomain(project.domain, project.verificationToken)

    if (verificationResult.success) {
      // Update project verification status
      await db.project.update({
        where: { id: projectId },
        data: { isVerified: true }
      })

      return NextResponse.json({
        success: true,
        message: 'Domain verified successfully',
        project: {
          id: project.id,
          name: project.name,
          domain: project.domain,
          isVerified: true
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: verificationResult.message
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error verifying domain:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function verifyDomain(domain: string, verificationToken: string): Promise<VerificationResult> {
  try {
    // Try both HTTP and HTTPS
    const protocols = ['https', 'http']
    
    for (const protocol of protocols) {
      try {
        const url = `${protocol}://${domain}`
        console.log(`Attempting to verify domain: ${url}`)
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'LinkShield-Verifier/1.0'
          },
          timeout: 10000 // 10 second timeout
        })

        if (response.ok) {
          const html = await response.text()
          
          // Check for the verification meta tag
          const metaTagRegex = /<meta\s+name=["']linkshield-verification["']\s+content=["']([^"']+)["']/i
          const match = html.match(metaTagRegex)
          
          if (match && match[1] === verificationToken) {
            return {
              success: true,
              message: 'Verification meta tag found and matches'
            }
          } else {
            console.log(`Meta tag not found or token mismatch. Expected: ${verificationToken}`)
          }
        } else {
          console.log(`HTTP ${response.status} response from ${url}`)
        }
      } catch (fetchError) {
        console.log(`Failed to fetch ${protocol}://${domain}:`, fetchError)
        // Continue to next protocol
      }
    }

    return {
      success: false,
      message: 'Verification meta tag not found. Please ensure you have added the meta tag to your domain\'s homepage.'
    }
  } catch (error) {
    console.error('Error during domain verification:', error)
    return {
      success: false,
      message: 'Failed to verify domain. Please check your domain is accessible and try again.'
    }
  }
}