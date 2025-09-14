import { Metadata } from 'next'
import { Shield, Zap, Calculator } from 'lucide-react'

import BadgeIntegrationDemo from '@/components/demos/badge-integration'
import ApiStatusDashboard from '@/components/demos/api-status-dashboard'
import PricingCalculator from '@/components/demos/pricing-calculator'

export const metadata: Metadata = {
  title: 'Interactive Demo - LinkShield',
  description: 'Explore LinkShield features with interactive demos',
}

const demoSections = [
  {
    id: 'badge-integration',
    title: 'Badge Integration',
    description: 'Easily add LinkShield security badges to your website',
    icon: Shield,
    component: BadgeIntegrationDemo,
  },
  {
    id: 'api-status',
    title: 'API Status Dashboard',
    description: 'Real-time monitoring of LinkShield API services',
    icon: Zap,
    component: ApiStatusDashboard,
  },
  {
    id: 'pricing-calculator',
    title: 'Pricing Calculator',
    description: 'Calculate your monthly costs based on API usage',
    icon: Calculator,
    component: PricingCalculator,
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Interactive Demo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience LinkShield's features with these interactive demonstrations. 
            See how easy it is to integrate our security solutions into your workflow.
          </p>
        </div>

        <div className="space-y-16">
          {demoSections.map((section) => {
            const IconComponent = section.icon
            return (
              <section key={section.id} id={section.id}>
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg mr-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                      <p className="text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                </div>
                
                <section.component />
              </section>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-card border rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Try LinkShield today and protect your users from malicious links
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/api/auth/signin"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Sign Up Free
              </a>
              <a
                href="/docs"
                className="px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg font-medium transition-colors"
              >
                Read Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}