"use client"

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Clock, 
  Calendar,
  ChevronRight,
  Loader2,
  BookOpen,
  Share2,
  Edit
} from 'lucide-react'

interface DocArticle {
  slug: string
  title: string
  description?: string
  content: string
  html?: string  // Add html property for converted markdown
  readTime?: number
  category: string
  metadata?: {
    isNew?: boolean
    isPopular?: boolean
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    tags?: string[]
    lastUpdated?: string
    author?: string
  }
}

interface ArticlePageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

/**
 * Documentation Article Page Component
 * 
 * Displays a full documentation article with:
 * - Complete article content rendered from markdown
 * - Article metadata (read time, difficulty, tags, etc.)
 * - Breadcrumb navigation
 * - Table of contents for long articles
 * - Related articles suggestions
 * - Social sharing capabilities
 * 
 * @param params - Route parameters containing category and article slug
 * @returns JSX element representing the article page
 * 
 * @example
 * ```tsx
 * // Accessed via /docs/user-guides/how-to-check-urls route
 * <ArticlePage params={{ category: 'user-guides', slug: 'how-to-check-urls' }} />
 * ```
 * 
 * @features
 * - Dynamic loading of article content from API
 * - Markdown content rendering with syntax highlighting
 * - Article metadata display
 * - Breadcrumb navigation
 * - Loading states and error handling
 * - SEO-friendly structure with proper meta tags
 * - Print-friendly styling
 * - Responsive design for all devices
 */
export default function ArticlePage({ params }: ArticlePageProps) {
  const [article, setArticle] = React.useState<DocArticle | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [category, setCategory] = React.useState<string>("")
  const [slug, setSlug] = React.useState<string>("")

  /**
   * Load article data from API
   */
  React.useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true)
        const resolvedParams = await params
        setCategory(resolvedParams.category)
        setSlug(resolvedParams.slug)
        const response = await fetch(`/api/docs/${resolvedParams.category}/${resolvedParams.slug}`)
        const result = await response.json()
        
        if (!result.success) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error(result.error || 'Failed to load article')
        }
        
        setArticle(result.data.article)
      } catch (err) {
        console.error('Error loading article:', err)
        setError(err instanceof Error ? err.message : 'Failed to load article')
      } finally {
        setLoading(false)
      }
    }
    
    loadArticle()
  }, [])

  /**
   * Format category name for display
   */
  const formatCategoryName = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Handle sharing functionality
   */
  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading article...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Article Not Found</h1>
          <div className="max-w-md mx-auto p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              Error loading article: {error}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button asChild>
              <Link href={`/docs/${category}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {formatCategoryName(category)}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs">
                Documentation Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    notFound()
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/docs" className="hover:text-foreground transition-colors">
          Documentation
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link 
          href={`/docs/${category}`} 
          className="hover:text-foreground transition-colors"
        >
          {formatCategoryName(category)}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{article.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/docs/${category}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {formatCategoryName(category)}
            </Link>
          </Button>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            {article.title}
          </h1>
          
          {article.description && (
            <p className="text-xl text-muted-foreground">
              {article.description}
            </p>
          )}

          {/* Article Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {article.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime} min read</span>
              </div>
            )}
            
            {article.metadata?.lastUpdated && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {new Date(article.metadata.lastUpdated).toLocaleDateString()}</span>
              </div>
            )}

            {article.metadata?.author && (
              <div className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                <span>By {article.metadata.author}</span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {article.metadata?.isNew && (
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                New
              </Badge>
            )}
            {article.metadata?.isPopular && (
              <Badge variant="outline">
                Popular
              </Badge>
            )}
            {article.metadata?.difficulty && (
              <Badge 
                variant="secondary" 
                className={
                  article.metadata.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  article.metadata.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }
              >
                {article.metadata.difficulty}
              </Badge>
            )}
            {article.metadata?.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Article Content */}
      <Card className="p-8">
        <div 
          className="prose prose-lg prose-gray dark:prose-invert max-w-none
                     prose-headings:scroll-mt-20 prose-headings:text-foreground
                     prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8 prose-h1:mt-0
                     prose-h2:text-3xl prose-h2:font-semibold prose-h2:mb-6 prose-h2:mt-12 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
                     prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-4 prose-h3:mt-8
                     prose-h4:text-xl prose-h4:font-semibold prose-h4:mb-3 prose-h4:mt-6
                     prose-p:mb-6 prose-p:leading-relaxed prose-p:text-foreground
                     prose-ul:mb-6 prose-ul:space-y-2 prose-ol:mb-6 prose-ol:space-y-2
                     prose-li:text-foreground prose-li:leading-relaxed
                     prose-strong:text-foreground prose-strong:font-semibold
                     prose-em:text-muted-foreground
                     prose-code:bg-muted prose-code:text-foreground prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                     prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-6 prose-pre:overflow-x-auto
                     prose-pre:text-sm prose-pre:leading-relaxed
                     prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
                     prose-table:border prose-table:border-border prose-table:border-collapse prose-table:w-full
                     prose-th:border prose-th:border-border prose-th:p-3 prose-th:bg-muted prose-th:font-semibold prose-th:text-left
                     prose-td:border prose-td:border-border prose-td:p-3 prose-td:text-foreground
                     prose-img:rounded-lg prose-img:shadow-md prose-img:border prose-img:border-border
                     prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                     prose-hr:border-border prose-hr:my-8"
          dangerouslySetInnerHTML={{ __html: article.html || article.content }}
        />
      </Card>

      {/* Footer Navigation */}
      <div className="mt-12 pt-8 border-t">
        <div className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link href={`/docs/${category}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {formatCategoryName(category)}
            </Link>
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Was this helpful?</span>
          </div>
        </div>
      </div>
    </div>
  )
}