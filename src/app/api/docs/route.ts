import { NextRequest, NextResponse } from 'next/server'
import { getDocumentationByCategory, searchDocArticles, getFeaturedArticles } from '@/lib/docs'

/**
 * GET /api/docs
 * 
 * Returns documentation data based on query parameters:
 * - No params: Returns all categories with articles
 * - ?search=query: Returns search results
 * - ?featured=true: Returns featured articles
 * 
 * @param request - Next.js request object
 * @returns JSON response with documentation data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('search')
    const featured = searchParams.get('featured')
    
    // Handle search requests
    if (searchQuery) {
      const results = await searchDocArticles(searchQuery)
      return NextResponse.json({
        success: true,
        data: {
          type: 'search',
          query: searchQuery,
          results,
          count: results.length
        }
      })
    }
    
    // Handle featured articles requests
    if (featured === 'true') {
      const articles = await getFeaturedArticles()
      return NextResponse.json({
        success: true,
        data: {
          type: 'featured',
          articles,
          count: articles.length
        }
      })
    }
    
    // Default: return all categories
    const categories = await getDocumentationByCategory()
    
    // Sort categories by order
    const sortedCategories = Object.values(categories).sort((a, b) => {
      return (a.order || 999) - (b.order || 999)
    })
    
    return NextResponse.json({
      success: true,
      data: {
        type: 'categories',
        categories: sortedCategories,
        totalCategories: sortedCategories.length,
        totalArticles: sortedCategories.reduce((sum, cat) => sum + cat.articleCount, 0)
      }
    })
    
  } catch (error) {
    console.error('Error in docs API:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to load documentation',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}