"use client"

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Search, 
  Clock, 
  FileText, 
  ChevronRight,
  Loader2
} from 'lucide-react'

interface DocArticle {
  slug: string
  title: string
  description?: string
  readTime?: number
  metadata?: {
    isNew?: boolean
    isPopular?: boolean
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    tags?: string[]
  }
}

interface CategoryData {
  id: string
  name: string
  description: string
  articles: DocArticle[]
}

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

/**
 * Documentation Category Page Component
 * 
 * Displays all articles within a specific documentation category:
 * - Lists all articles in the category with previews
 * - Search functionality within the category
 * - Filtering by difficulty level and tags
 * - Breadcrumb navigation back to main docs
 * - Responsive grid layout for article cards
 * 
 * @param params - Route parameters containing the category slug
 * @returns JSX element representing the category page
 * 
 * @example
 * ```tsx
 * // Accessed via /docs/user-guides route
 * <CategoryPage params={{ category: 'user-guides' }} />
 * ```
 * 
 * @features
 * - Dynamic loading of category articles from API
 * - Search within category functionality
 * - Article filtering by difficulty and tags
 * - Article cards with metadata and read time
 * - Breadcrumb navigation
 * - Loading states and error handling
 * - SEO-friendly structure
 */
export default function CategoryPage({ params }: CategoryPageProps) {
  const [categoryData, setCategoryData] = React.useState<CategoryData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filteredArticles, setFilteredArticles] = React.useState<DocArticle[]>([])
  const [category, setCategory] = React.useState<string>("")

  /**
   * Load category data from API
   */
  React.useEffect(() => {
    async function loadCategory() {
      try {
        setLoading(true)
        const resolvedParams = await params
        setCategory(resolvedParams.category)
        const response = await fetch(`/api/docs/${resolvedParams.category}`)
        const result = await response.json()
        
        if (!result.success) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error(result.error || 'Failed to load category')
        }
        
        setCategoryData(result.data)
        setFilteredArticles(result.data.articles)
      } catch (err) {
        console.error('Error loading category:', err)
        setError(err instanceof Error ? err.message : 'Failed to load category')
      } finally {
        setLoading(false)
      }
    }
    
    loadCategory()
  }, [])

    /**
     * Filter articles based on search query
     */
    React.useEffect(() => {
      if (!categoryData) return
      
      if (!searchQuery.trim()) {
        setFilteredArticles(categoryData.articles)
        return
      }
      
      const filtered = categoryData.articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.metadata?.tags?.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      
      setFilteredArticles(filtered)
    }, [searchQuery, categoryData])

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading category...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Category Not Found</h1>
          <div className="max-w-md mx-auto p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              Error loading category: {error}
            </p>
          </div>
          <Button asChild>
            <Link href="/docs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documentation
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!categoryData) {
    notFound()
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/docs" className="hover:text-foreground transition-colors">
          Documentation
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{categoryData.name}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {categoryData.name}
          </h1>
          <p className="text-xl text-muted-foreground">
            {categoryData.description}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search in ${categoryData.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-6">
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.slug} className="p-6 hover:shadow-lg transition-all duration-200 group">
              <Link href={`/docs/${category}/${article.slug}`}>
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-2 flex-shrink-0" />
                  </div>

                  {/* Description */}
                  {article.description && (
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {article.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {article.metadata?.isNew && (
                        <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                          New
                        </Badge>
                      )}
                      {article.metadata?.isPopular && (
                        <Badge variant="outline" className="text-xs">
                          Popular
                        </Badge>
                      )}
                      {article.metadata?.difficulty && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            article.metadata.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            article.metadata.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {article.metadata.difficulty}
                        </Badge>
                      )}
                    </div>
                    
                    {article.readTime && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime} min</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {article.metadata?.tags && article.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {article.metadata.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.metadata.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.metadata.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? `No articles match "${searchQuery}". Try different keywords.`
                : "This category doesn't have any articles yet."
              }
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}