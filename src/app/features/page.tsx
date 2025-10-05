import * as React from "react"
import Link from "next/link"
import { 
  Shield, 
  Zap, 
  Eye, 
  Users, 
  BarChart3, 
  Bell,
  Lock,
  Globe,
  Smartphone,
  Cloud,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Database,
  Cpu,
  Network,
  AlertTriangle,
  Search,
  Filter,
  Settings,
  Download,
  Share2,
  Clock,
  Target,
  Layers,
  Workflow
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Feature Interface
 * 
 * Defines the structure for individual features displayed on the page.
 */
interface Feature {
  /** Unique identifier for the feature */
  id: string
  /** Display name of the feature */
  title: string
  /** Brief description of the feature */
  description: string
  /** Lucide icon component for the feature */
  icon: React.ComponentType<{ className?: string }>
  /** Color theme for the feature */
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow"
  /** Whether this is a premium feature */
  isPremium?: boolean
  /** List of key benefits */
  benefits?: string[]
}

/**
 * Feature Category Interface
 * 
 * Groups related features into categories for better organization.
 */
interface FeatureCategory {
  /** Category identifier */
  id: string
  /** Category display name */
  name: string
  /** Category description */
  description: string
  /** Category icon */
  icon: React.ComponentType<{ className?: string }>
  /** Features in this category */
  features: Feature[]
}

/**
 * Use Case Interface
 * 
 * Defines different use cases and scenarios for LinkShield.
 */
interface UseCase {
  /** Use case identifier */
  id: string
  /** Use case title */
  title: string
  /** Detailed description */
  description: string
  /** Target audience */
  audience: string
  /** Key benefits for this use case */
  benefits: string[]
  /** Relevant features */
  features: string[]
  /** Icon representing the use case */
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Core security features
 */
const securityFeatures: Feature[] = [
  {
    id: "threat-detection",
    title: "Advanced Threat Detection",
    description: "AI-powered analysis identifies phishing, malware, and suspicious URLs in real-time",
    icon: Shield,
    color: "red",
    benefits: [
      "Machine learning threat identification",
      "Real-time URL reputation scoring",
      "Zero-day threat protection",
      "Behavioral analysis patterns"
    ]
  },
  {
    id: "real-time-scanning",
    title: "Real-Time URL Scanning",
    description: "Instant analysis of URLs with sub-second response times for immediate protection",
    icon: Zap,
    color: "yellow",
    benefits: [
      "Sub-second analysis speed",
      "Live threat intelligence feeds",
      "Instant risk assessment",
      "Immediate blocking capabilities"
    ]
  },
  {
    id: "deep-analysis",
    title: "Deep Content Analysis",
    description: "Comprehensive examination of web content, scripts, and embedded resources",
    icon: Eye,
    color: "blue",
    isPremium: true,
    benefits: [
      "JavaScript execution analysis",
      "Embedded resource scanning",
      "DOM structure examination",
      "Hidden redirect detection"
    ]
  },
  {
    id: "threat-intelligence",
    title: "Global Threat Intelligence",
    description: "Access to worldwide threat databases and security research networks",
    icon: Globe,
    color: "purple",
    isPremium: true,
    benefits: [
      "Global threat database access",
      "Community-driven intelligence",
      "Research network integration",
      "Emerging threat alerts"
    ]
  }
]

/**
 * Collaboration and team features
 */
const collaborationFeatures: Feature[] = [
  {
    id: "team-management",
    title: "Team Management",
    description: "Organize your security team with role-based access and permissions",
    icon: Users,
    color: "green",
    benefits: [
      "Role-based access control",
      "Team member invitations",
      "Permission management",
      "Activity tracking"
    ]
  },
  {
    id: "shared-projects",
    title: "Shared Projects",
    description: "Collaborate on security assessments with shared workspaces and results",
    icon: Share2,
    color: "blue",
    benefits: [
      "Shared workspaces",
      "Collaborative analysis",
      "Team notifications",
      "Project templates"
    ]
  },
  {
    id: "reporting",
    title: "Advanced Reporting",
    description: "Generate comprehensive security reports for stakeholders and compliance",
    icon: BarChart3,
    color: "purple",
    isPremium: true,
    benefits: [
      "Customizable report templates",
      "Executive summaries",
      "Compliance reporting",
      "Automated scheduling"
    ]
  },
  {
    id: "notifications",
    title: "Smart Notifications",
    description: "Stay informed with intelligent alerts and notification preferences",
    icon: Bell,
    color: "orange",
    benefits: [
      "Multi-channel notifications",
      "Smart alert filtering",
      "Escalation policies",
      "Custom notification rules"
    ]
  }
]

/**
 * Integration and API features
 */
const integrationFeatures: Feature[] = [
  {
    id: "rest-api",
    title: "RESTful API",
    description: "Comprehensive API for integrating LinkShield into your existing workflows",
    icon: Network,
    color: "blue",
    benefits: [
      "Full REST API access",
      "Comprehensive documentation",
      "SDKs for popular languages",
      "Rate limiting and quotas"
    ]
  },
  {
    id: "webhooks",
    title: "Webhook Integration",
    description: "Real-time notifications to your systems when threats are detected",
    icon: Workflow,
    color: "green",
    benefits: [
      "Real-time event notifications",
      "Custom payload formatting",
      "Retry mechanisms",
      "Signature verification"
    ]
  },
  {
    id: "browser-extension",
    title: "Browser Extensions",
    description: "Protect users with native browser extensions for all major browsers",
    icon: Smartphone,
    color: "purple",
    benefits: [
      "Chrome, Firefox, Safari support",
      "Real-time URL checking",
      "User-friendly warnings",
      "Enterprise deployment"
    ]
  },
  {
    id: "cloud-integration",
    title: "Cloud Platform Integration",
    description: "Seamless integration with AWS, Azure, GCP, and other cloud platforms",
    icon: Cloud,
    color: "orange",
    isPremium: true,
    benefits: [
      "AWS Lambda integration",
      "Azure Functions support",
      "GCP Cloud Functions",
      "Serverless deployment"
    ]
  }
]

/**
 * Feature categories for organized display
 */
const featureCategories: FeatureCategory[] = [
  {
    id: "security",
    name: "Security & Protection",
    description: "Advanced threat detection and protection capabilities",
    icon: Shield,
    features: securityFeatures
  },
  {
    id: "collaboration",
    name: "Team & Collaboration",
    description: "Tools for team management and collaborative security work",
    icon: Users,
    features: collaborationFeatures
  },
  {
    id: "integration",
    name: "Integration & API",
    description: "Powerful APIs and integrations for your existing tools",
    icon: Network,
    features: integrationFeatures
  }
]

/**
 * Use cases for different audiences
 */
const useCases: UseCase[] = [
  {
    id: "enterprise",
    title: "Enterprise Security Teams",
    description: "Comprehensive URL security for large organizations with advanced threat protection",
    audience: "Security professionals, IT administrators, compliance teams",
    icon: Lock,
    benefits: [
      "Enterprise-grade threat detection",
      "Compliance reporting and auditing",
      "Team collaboration and management",
      "Custom integration capabilities",
      "24/7 priority support"
    ],
    features: ["Advanced Threat Detection", "Team Management", "API Integration", "Custom Reporting"]
  },
  {
    id: "developers",
    title: "Development Teams",
    description: "Integrate URL security directly into applications and development workflows",
    audience: "Software developers, DevOps engineers, product teams",
    icon: Cpu,
    benefits: [
      "RESTful API for easy integration",
      "Comprehensive SDKs and documentation",
      "Webhook notifications for real-time alerts",
      "Scalable infrastructure",
      "Developer-friendly tools"
    ],
    features: ["REST API", "Webhooks", "Browser Extensions", "Cloud Integration"]
  },
  {
    id: "small-business",
    title: "Small & Medium Businesses",
    description: "Affordable URL security solution that grows with your business needs",
    audience: "Small business owners, IT managers, marketing teams",
    icon: TrendingUp,
    benefits: [
      "Cost-effective security solution",
      "Easy setup and management",
      "Scalable pricing plans",
      "Essential threat protection",
      "Community support"
    ],
    features: ["Real-Time Scanning", "Smart Notifications", "Basic Reporting", "Team Management"]
  },
  {
    id: "education",
    title: "Educational Institutions",
    description: "Protect students and staff from malicious URLs and online threats",
    audience: "IT administrators, educators, student safety coordinators",
    icon: Target,
    benefits: [
      "Student and staff protection",
      "Educational content filtering",
      "Bulk deployment capabilities",
      "Usage analytics and reporting",
      "Special educational pricing"
    ],
    features: ["Browser Extensions", "Bulk Management", "Usage Analytics", "Content Filtering"]
  }
]

/**
 * Get color classes for feature cards
 */
const getFeatureColorClasses = (color: Feature["color"]) => {
  const colorMap = {
    blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
    green: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 text-green-600 dark:text-green-400",
    purple: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
    orange: "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
    red: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 text-red-600 dark:text-red-400",
    yellow: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400"
  }
  return colorMap[color]
}

/**
 * Features Page Component
 * 
 * A comprehensive features showcase page that highlights LinkShield's capabilities with:
 * - Organized feature categories (Security, Collaboration, Integration)
 * - Detailed feature descriptions with benefits
 * - Use case scenarios for different audiences
 * - Interactive tabs for easy navigation
 * - Premium feature highlighting
 * - Call-to-action sections
 * 
 * The page helps users understand the full scope of LinkShield's capabilities
 * and how they can benefit different types of organizations and use cases.
 * 
 * @returns JSX element representing the features page
 * 
 * @example
 * ```tsx
 * // Accessed via /features route
 * <FeaturesPage />
 * ```
 * 
 * @features
 * - Categorized feature display with tabs
 * - Premium feature badges and highlighting
 * - Use case scenarios for different audiences
 * - Detailed benefit lists for each feature
 * - Responsive design for all device sizes
 * - Interactive elements and hover effects
 * - Clear call-to-action buttons
 * - Dark mode support with themed colors
 */
export default function FeaturesPage() {
  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Page Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Powerful Features for Complete URL Security
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover how LinkShield's comprehensive feature set protects your organization 
          from malicious URLs, phishing attacks, and online threats.
        </p>
      </div>

      {/* Feature Categories Tabs */}
      <Tabs defaultValue="security" className="mb-16">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          {featureCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <category.icon className="h-4 w-4" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {featureCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.features.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <Card 
                    key={feature.id} 
                    className={cn(
                      "relative transition-all duration-200 hover:shadow-lg",
                      getFeatureColorClasses(feature.color)
                    )}
                  >
                    {feature.isPremium && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          feature.color === "blue" && "bg-blue-100 dark:bg-blue-900/30",
                          feature.color === "green" && "bg-green-100 dark:bg-green-900/30",
                          feature.color === "purple" && "bg-purple-100 dark:bg-purple-900/30",
                          feature.color === "orange" && "bg-orange-100 dark:bg-orange-900/30",
                          feature.color === "red" && "bg-red-100 dark:bg-red-900/30",
                          feature.color === "yellow" && "bg-yellow-100 dark:bg-yellow-900/30"
                        )}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {feature.benefits && (
                      <CardContent>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Key Benefits:</h4>
                          <ul className="space-y-1">
                            {feature.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Use Cases Section */}
      <div className="space-y-8 mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Perfect for Every Use Case
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how LinkShield adapts to different organizations and security needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {useCases.map((useCase) => {
            const IconComponent = useCase.icon
            return (
              <Card key={useCase.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{useCase.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {useCase.description}
                      </CardDescription>
                      <Badge variant="outline" className="mt-3">
                        {useCase.audience}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {useCase.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-3">Relevant Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {useCase.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/50 rounded-lg p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Trusted by Organizations Worldwide</h2>
          <p className="text-muted-foreground">
            Join thousands of organizations protecting their users with LinkShield
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10M+</div>
            <div className="text-sm text-muted-foreground">URLs Analyzed Daily</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">&lt;100ms</div>
            <div className="text-sm text-muted-foreground">Average Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Active Organizations</div>
          </div>
        </div>
      </div>

      {/* Integration Showcase */}
      <div className="space-y-8 mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Integrates with Your Existing Tools
          </h2>
          <p className="text-muted-foreground">
            LinkShield works seamlessly with your current security stack and workflows
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { name: "Slack", icon: "💬" },
            { name: "Microsoft Teams", icon: "👥" },
            { name: "Jira", icon: "🎯" },
            { name: "Splunk", icon: "📊" },
            { name: "AWS", icon: "☁️" },
            { name: "Azure", icon: "🔷" },
            { name: "Google Cloud", icon: "🌐" },
            { name: "Zapier", icon: "⚡" },
            { name: "Webhook", icon: "🔗" },
            { name: "REST API", icon: "🔌" },
            { name: "Chrome", icon: "🌐" },
            { name: "Firefox", icon: "🦊" }
          ].map((integration, index) => (
            <Card key={index} className="text-center p-4 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">{integration.icon}</div>
              <div className="text-sm font-medium">{integration.name}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Experience LinkShield?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Start protecting your organization today with our comprehensive URL security platform. 
          Try all features free for 14 days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">
              Start Free Trial
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/demo">
              <Play className="h-4 w-4 mr-2" />
              Watch Demo
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild>
            <Link href="/pricing">
              View Pricing
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}