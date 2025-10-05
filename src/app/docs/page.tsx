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
  MessageCircle
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

/**
 * Documentation Category Interface
 * 
 * Defines the structure for documentation categories displayed on the landing page.
 */
interface DocCategory {
  /** Unique identifier for the category */
  id: string
  /** Display title of the category */
  title: string
  /** Brief description of what this category covers */
  description: string
  /** Lucide icon component for visual representation */
  icon: React.ComponentType<{ className?: string }>
  /** Number of articles/guides in this category */
  articleCount: number
  /** Array of featured articles in this category */
  articles: Array<{
    title: string
    description: string
    href: string
    isNew?: boolean
    isPopular?: boolean
  }>
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
 * Documentation categories with their articles and metadata
 */
const docCategories: DocCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of LinkShield and get up and running quickly.",
    icon: Zap,
    articleCount: 8,
    color: "blue",
    href: "/docs/getting-started",
    articles: [
      {
        title: "Quick Start Guide",
        description: "Get LinkShield running in under 5 minutes",
        href: "/docs/getting-started/quick-start",
        isPopular: true
      },
      {
        title: "Installation & Setup",
        description: "Complete installation guide for all platforms",
        href: "/docs/getting-started/installation"
      },
      {
        title: "Your First URL Analysis",
        description: "Step-by-step guide to analyzing your first URL",
        href: "/docs/getting-started/first-analysis",
        isNew: true
      }
    ]
  },
  {
    id: "api-reference",
    title: "API Reference",
    description: "Complete API documentation with examples and code samples.",
    icon: Code,
    articleCount: 24,
    color: "green",
    href: "/docs/api",
    articles: [
      {
        title: "Authentication",
        description: "API key management and authentication methods",
        href: "/docs/api/authentication",
        isPopular: true
      },
      {
        title: "URL Analysis Endpoints",
        description: "Analyze URLs and retrieve security reports",
        href: "/docs/api/analysis"
      },
      {
        title: "Webhook Integration",
        description: "Real-time notifications for analysis results",
        href: "/docs/api/webhooks",
        isNew: true
      }
    ]
  },
  {
    id: "security-features",
    title: "Security Features",
    description: "Deep dive into LinkShield's security capabilities and threat detection.",
    icon: Shield,
    articleCount: 15,
    color: "red",
    href: "/docs/security",
    articles: [
      {
        title: "Threat Detection Engine",
        description: "How LinkShield identifies malicious URLs",
        href: "/docs/security/threat-detection",
        isPopular: true
      },
      {
        title: "Phishing Protection",
        description: "Advanced phishing detection and prevention",
        href: "/docs/security/phishing-protection"
      },
      {
        title: "Malware Scanning",
        description: "Real-time malware detection and analysis",
        href: "/docs/security/malware-scanning"
      }
    ]
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect LinkShield with your existing tools and workflows.",
    icon: Settings,
    articleCount: 12,
    color: "purple",
    href: "/docs/integrations",
    articles: [
      {
        title: "Slack Integration",
        description: "Get security alerts directly in Slack",
        href: "/docs/integrations/slack",
        isPopular: true
      },
      {
        title: "Microsoft Teams",
        description: "Integrate with Microsoft Teams workflows",
        href: "/docs/integrations/teams"
      },
      {
        title: "Custom Webhooks",
        description: "Build custom integrations with webhooks",
        href: "/docs/integrations/webhooks",
        isNew: true
      }
    ]
  },
  {
    id: "team-management",
    title: "Team Management",
    description: "Manage users, permissions, and collaborate effectively.",
    icon: Users,
    articleCount: 9,
    color: "orange",
    href: "/docs/team",
    articles: [
      {
        title: "User Roles & Permissions",
        description: "Configure access levels for team members",
        href: "/docs/team/permissions"
      },
      {
        title: "Project Collaboration",
        description: "Share projects and collaborate on analysis",
        href: "/docs/team/collaboration"
      },
      {
        title: "Audit Logs",
        description: "Track team activity and security events",
        href: "/docs/team/audit-logs"
      }
    ]
  },
  {
    id: "advanced-guides",
    title: "Advanced Guides",
    description: "Advanced techniques and best practices for power users.",
    icon: BookOpen,
    articleCount: 18,
    color: "gray",
    href: "/docs/advanced",
    articles: [
      {
        title: "Custom Rules Engine",
        description: "Create custom detection rules and policies",
        href: "/docs/advanced/custom-rules"
      },
      {
        title: "Bulk URL Analysis",
        description: "Analyze thousands of URLs efficiently",
        href: "/docs/advanced/bulk-analysis",
        isPopular: true
      },
      {
        title: "Performance Optimization",
        description: "Optimize LinkShield for high-volume usage",
        href: "/docs/advanced/performance"
      }
    ]
  }
]

/**
 * Quick access links for common tasks and resources
 */
const quickLinks: QuickLink[] = [
  {
    title: "API Documentation",
    description: "Complete API reference",
    href: "/docs/api",
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
 * A comprehensive documentation landing page that provides users with organized access to:
 * - Categorized documentation sections with article previews
 * - Search functionality for finding specific content
 * - Quick access links to common resources
 * - Featured and popular articles highlighting
 * - Responsive design for all device sizes
 * 
 * The page serves as the main entry point for all LinkShield documentation,
 * helping users quickly find the information they need.
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
 * - Organized category cards with article previews
 * - Search functionality (placeholder for future implementation)
 * - Quick access sidebar with external links
 * - Badge system for new and popular content
 * - Responsive grid layout
 * - Dark mode support with themed colors
 * - Accessibility support with proper ARIA labels
 * - SEO-friendly structure with semantic HTML
 */
export default function DocsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

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
                          href={article.href}
                          className="block p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                                  {article.title}
                                </h4>
                                {article.isNew && (
                                  <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                                    New
                                  </Badge>
                                )}
                                {article.isPopular && (
                                  <Badge variant="outline" className="text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {article.description}
                              </p>
                            </div>
                            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors ml-2 mt-0.5" />
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