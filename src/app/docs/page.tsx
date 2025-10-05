"use client"

import * as React from "react"
import Link from "next/link"
import { 
  BookOpen, 
  Code, 
  Shield, 
  Zap, 
  Users, 
  Settings,
  ArrowRight,
  Search,
  ExternalLink,
  FileText,
  Video,
  MessageCircle,
  Loader2,
  ChevronRight
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

/**
 * Documentation Category Interface from API
 * 
 * Defines the structure for documentation categories loaded from the docs folder.
 */
interface DocCategoryData {
  /** Category identifier */
  id: string
  /** Display title */
  title: string
  /** Category description */
  description: string
  /** URL path for the category */
  path: string
  /** Number of articles in this category */
  articleCount: number
  /** Articles in this category */
  articles: Array<{
    slug: string
    title: string
    description: string
    category: string
    path: string
    metadata: {
      isNew?: boolean
      isPopular?: boolean
      [key: string]: any
    }
  }>
  /** Category order for display */
  order?: number
}

/**
 * Documentation Category Interface for UI
 * 
 * Defines the structure for documentation categories displayed on the landing page.
 */
interface DocCategory extends DocCategoryData {
  /** Lucide icon component for visual representation */
  icon: React.ComponentType<{ className?: string }>
  /** URL slug for the category page */
  href: string
  /** Color theme for the category card */
  color: "blue" | "green" | "purple" | "orange" | "red" | "gray"
}

/**
 * Quick Link Interface
 * 
 * Defines the structure for quick access links in the sidebar.
 */
interface QuickLink {
  /** Display title of the link */
  title: string
  /** Brief description of the link */
  description: string
  /** URL or route path */
  href: string
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string }>
  /** Whether this link opens in a new tab */
  external?: boolean
}
/**
 * Category icon and color mapping
 * 
 * Maps category IDs to their visual representation.
 */
const CATEGORY_UI_MAPPING: Record<string, { 
  icon: React.ComponentType<{ className?: string }>, 
  color: DocCategory["color"] 
}> = {
  'getting-started': { icon: Zap, color: 'blue' },
  'user-guides': { icon: BookOpen, color: 'green' },
  'features': { icon: Shield, color: 'red' },
  'developer': { icon: Code, color: 'purple' },
  'authentication': { icon: Settings, color: 'orange' },
  'api': { icon: Code, color: 'green' },
  'integrations': { icon: Settings, color: 'purple' },
  'team': { icon: Users, color: 'orange' },
  'advanced': { icon: BookOpen, color: 'gray' }
}

/**
 * Quick access links for common tasks and resources
 */
const quickLinks: QuickLink[] = [
  {
    title: "API Documentation",
    description: "Complete API reference",
    href: "/docs/developer",
    icon: Code
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    href: "/docs/videos",
    icon: Video
  },
  {
    title: "Community Forum",
    description: "Get help from the community",
    href: "https://community.linkshield.com",
    icon: MessageCircle,
    external: true
  },
  {
    title: "Status Page",
    description: "Service status and uptime",
    href: "https://status.linkshield.com",
    icon: ExternalLink,
    external: true
  }
]

/**
 * Get color classes for category cards based on the color theme
 */
const getColorClasses = (color: DocCategory["color"]) => {
  const colorMap = {
    blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
    green: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
    purple: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30",
    orange: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30",
    red: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
    gray: "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/30"
  }
  return colorMap[color]
}

/**
 * Get icon color classes based on the color theme
 */
const getIconColorClasses = (color: DocCategory["color"]) => {
  const colorMap = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    purple: "text-purple-600 dark:text-purple-400",
    orange: "text-orange-600 dark:text-orange-400",
    red: "text-red-600 dark:text-red-400",
    gray: "text-gray-600 dark:text-gray-400"
  }
  return colorMap[color]
}

/**
 * Documentation Landing Page Component
 * 
 * A comprehensive documentation landing page that dynamically loads content from the docs folder:
 * - Fetches categorized documentation sections with article previews from API
 * - Search functionality for finding specific content
 * - Quick access links to common resources
 * - Featured and popular articles highlighting
 * - Responsive design for all device sizes
 * 
 * The page serves as the main entry point for all LinkShield documentation,
 * helping users quickly find the information they need by loading real markdown files.
 * 
 * @returns JSX element representing the documentation landing page
 * 
 * @example
 * ```tsx
 * // Accessed via /docs route
 * <DocsPage />
 * ```
 * 
 * @features
 * - Dynamic category loading from docs folder structure
 * - Search functionality with API integration
 * - Quick access sidebar with external links
 * - Badge system for new and popular content
 * - Responsive grid layout
 * - Dark mode support with themed colors
 * - Accessibility support with proper ARIA labels
 * - SEO-friendly structure with semantic HTML
 * - Loading states and error handling
 */
export default function DocsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [docCategories, setDocCategories] = React.useState<DocCategory[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchResults, setSearchResults] = React.useState<any[]>([])
  const [searching, setSearching] = React.useState(false)

  /**
   * Load documentation categories from API
   */
  React.useEffect(() => {
    async function loadDocumentation() {
      try {
        setLoading(true)
        const response = await fetch('/api/docs')
        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to load documentation')
        }
        
        // Transform API data to UI format
        const categories: DocCategory[] = result.data.categories.map((cat: DocCategoryData) => {
          const uiMapping = CATEGORY_UI_MAPPING[cat.id] || { 
            icon: FileText, 
            color: 'gray' as const 
          }
          
          return {
            ...cat,
            icon: uiMapping.icon,
            color: uiMapping.color,
            href: `/docs/${cat.id}`
          }
        })
        
        setDocCategories(categories)
      } catch (err) {
        console.error('Error loading documentation:', err)
        setError(err instanceof Error ? err.message : 'Failed to load documentation')
      } finally {
        setLoading(false)
      }
    }
    
    loadDocumentation()
  }, [])

  /**
   * Handle search functionality
   */
  React.useEffect(() => {
    async function performSearch() {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }
      
      try {
        setSearching(true)
        const response = await fetch(`/api/docs?search=${encodeURIComponent(searchQuery)}`)
        const result = await response.json()
        
        if (result.success) {
          setSearchResults(result.data.results || [])
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setSearching(false)
      }
    }
    
    // Debounce search
    const timeoutId = setTimeout(performSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading documentation...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
          <div className="max-w-md mx-auto p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              Error loading documentation: {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Page Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about LinkShield. From quick start guides to advanced integrations.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Results */}
          {searchQuery && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                Search Results for "{searchQuery}"
                {searching && <Loader2 className="h-4 w-4 animate-spin" />}
              </h2>
              {searchResults.length > 0 ? (
                <div className="grid gap-4">
                  {searchResults.map((article, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">
                            <Link 
                              href={`/docs/${article.category}/${article.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {article.title}
                            </Link>
                          </h3>
                          {article.description && (
                            <p className="text-muted-foreground mb-2">
                              {article.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                            {article.readTime && (
                              <span>{article.readTime} min read</span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground ml-2" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : !searching && (
                <div className="text-muted-foreground">
                  No results found for "{searchQuery}". Try different keywords or browse categories below.
                </div>
              )}
            </div>
          )}

          {/* Documentation Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card 
                  key={category.id} 
                  className={cn(
                    "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
                    getColorClasses(category.color)
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg bg-background/50", getIconColorClasses(category.color))}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {category.articleCount} articles
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {category.articles.map((article, index) => (
                        <Link
                           key={index}
                           href={`/docs/${category.id}/${article.slug}`}
                           className="block p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group"
                         >
                           <div className="flex items-start justify-between">
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                                   {article.title}
                                 </h4>
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
                               </div>
                               {article.description && (
                                 <p className="text-xs text-muted-foreground line-clamp-2">
                                   {article.description}
                                 </p>
                               )}
                               {article.readTime && (
                                 <p className="text-xs text-muted-foreground mt-1">
                                   {article.readTime} min read
                                 </p>
                               )}
                             </div>
                             <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                           </div>
                         </Link>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Link href={category.href}>
                        <Button variant="ghost" size="sm" className="w-full justify-between">
                          View all {category.title.toLowerCase()}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
              <CardDescription>
                Frequently accessed resources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickLinks.map((link, index) => {
                const IconComponent = link.icon
                const LinkComponent = link.external ? "a" : Link
                const linkProps = link.external 
                  ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
                  : { href: link.href }

                return (
                  <LinkComponent
                    key={index}
                    {...linkProps}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">
                          {link.title}
                        </span>
                        {link.external && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </LinkComponent>
                )
              })}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for? We're here to help.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="mailto:support@linkshield.com">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="https://community.linkshield.com" target="_blank" rel="noopener noreferrer">
                    <Users className="h-4 w-4 mr-2" />
                    Community Forum
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Latest Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latest Updates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600 mt-0.5">
                    New
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">Webhook Integration Guide</p>
                    <p className="text-xs text-muted-foreground">Real-time notifications setup</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs mt-0.5">
                    Updated
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">API Authentication</p>
                    <p className="text-xs text-muted-foreground">Enhanced security methods</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs mt-0.5">
                    Updated
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">Quick Start Guide</p>
                    <p className="text-xs text-muted-foreground">Streamlined setup process</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}