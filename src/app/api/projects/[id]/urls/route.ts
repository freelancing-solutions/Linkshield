import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// Validation schema for URL addition
const addUrlsSchema = z.object({
  urls: z.array(z.string().url('Invalid URL format')).min(1, 'At least one URL is required'),
  method: z.enum(['manual', 'sitemap', 'upload']).default('manual')
})

export async function GET(
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

    // Verify project ownership and verification
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
        isVerified: true
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found or not verified' }, { status: 404 })
    }

    const projectUrls = await db.projectUrl.findMany({
      where: {
        projectId: projectId,
        isActive: true
      },
      include: {
        scanResults: {
          orderBy: {
            scanDate: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        addedAt: 'desc'
      }
    })

    return NextResponse.json({ data: projectUrls })
  } catch (error) {
    console.error('Error fetching project URLs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    // Verify project ownership and verification
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
        isVerified: true
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found or not verified' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = addUrlsSchema.parse(body)

    // Process URLs based on method
    let urlsToAdd: string[] = []

    if (validatedData.method === 'sitemap') {
      // For sitemap method, the first URL should be the sitemap URL
      if (validatedData.urls.length !== 1) {
        return NextResponse.json({ error: 'Sitemap method requires exactly one sitemap URL' }, { status: 400 })
      }
      
      const sitemapUrl = validatedData.urls[0]
      urlsToAdd = await fetchUrlsFromSitemap(sitemapUrl, project.domain)
    } else {
      // For manual and upload methods, use the provided URLs
      urlsToAdd = validatedData.urls
    }

    // Filter and validate URLs
    const validUrls: string[] = []
    const invalidUrls: string[] = []
    const duplicateUrls: string[] = []

    for (const url of urlsToAdd) {
      // Check if URL belongs to the project domain
      if (!isUrlInDomain(url, project.domain)) {
        invalidUrls.push(url)
        continue
      }

      // Check for duplicates
      const existingUrl = await db.projectUrl.findFirst({
        where: {
          projectId: projectId,
          url: url
        }
      })

      if (existingUrl) {
        duplicateUrls.push(url)
        continue
      }

      validUrls.push(url)
    }

    // Add valid URLs to the project
    const createdUrls = await db.projectUrl.createMany({
      data: validUrls.map(url => ({
        projectId: projectId,
        url: url
      }))
    })

    return NextResponse.json({
      success: true,
      message: `Successfully added ${createdUrls.count} URLs`,
      data: {
        added: validUrls.length,
        invalid: invalidUrls,
        duplicates: duplicateUrls
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error adding URLs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function fetchUrlsFromSitemap(sitemapUrl: string, projectDomain: string): Promise<string[]> {
  try {
    const response = await fetch(sitemapUrl, {
      timeout: 15000 // 15 second timeout
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: HTTP ${response.status}`)
    }

    const text = await response.text()
    
    // Parse XML to extract URLs
    const urlRegex = /<loc>([^<]+)<\/loc>/gi
    const matches = text.match(urlRegex)
    
    if (!matches) {
      return []
    }

    // Extract URLs and filter by domain
    const urls = matches.map(match => {
      const urlMatch = match.match(/<loc>([^<]+)<\/loc>/)
      return urlMatch ? urlMatch[1] : ''
    }).filter(url => url && isUrlInDomain(url, projectDomain))

    return urls
  } catch (error) {
    console.error('Error fetching sitemap:', error)
    throw new Error('Failed to fetch or parse sitemap')
  }
}

function isUrlInDomain(url: string, domain: string): boolean {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    
    // Remove www. from both for comparison
    const cleanHostname = hostname.replace(/^www\./, '')
    const cleanDomain = domain.toLowerCase().replace(/^www\./, '')
    
    return cleanHostname === cleanDomain || cleanHostname.endsWith(`.${cleanDomain}`)
  } catch {
    return false
  }
}