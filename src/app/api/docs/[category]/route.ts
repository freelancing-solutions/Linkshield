import { NextRequest, NextResponse } from 'next/server'
import { getDocumentationByCategory } from '@/lib/docs'

/**
 * GET /api/docs/[category]
 * 
 * Returns articles for a specific documentation category.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing category
 * @returns JSON response with category articles
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category parameter is required'
      }, { status: 400 })
    }
    
    const categories = await getDocumentationByCategory()
    const categoryData = categories[category]
    
    if (!categoryData) {
      return NextResponse.json({
        success: false,
        error: 'Category not found',
        availableCategories: Object.keys(categories)
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: categoryData.id,
        name: categoryData.title,
        description: categoryData.description,
        articles: categoryData.articles
      }
    })
    
  } catch (error) {
    const { category } = await params;
    console.error(`Error loading category ${category}:`, error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to load category',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}