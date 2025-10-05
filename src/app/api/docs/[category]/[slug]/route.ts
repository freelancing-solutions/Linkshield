import { NextRequest, NextResponse } from 'next/server'
import { getDocArticle } from '@/lib/docs'

/**
 * GET /api/docs/[category]/[slug]
 * 
 * Returns a specific documentation article with HTML content.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing category and slug
 * @returns JSON response with article data and HTML content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; slug: string }> }
) {
  try {
    const { category, slug } = await params
    
    if (!category || !slug) {
      return NextResponse.json({
        success: false,
        error: 'Category and slug parameters are required'
      }, { status: 400 })
    }
    
    const article = await getDocArticle(category, slug)
    
    if (!article) {
      return NextResponse.json({
        success: false,
        error: 'Article not found',
        category,
        slug
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        article,
        breadcrumb: [
          { title: 'Documentation', href: '/docs' },
          { title: article.category, href: `/docs/${article.category}` },
          { title: article.title, href: `/docs/${article.category}/${article.slug}` }
        ]
      }
    })
    
  } catch (error) {
    console.error(`Error loading article ${params.category}/${params.slug}:`, error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to load article',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}