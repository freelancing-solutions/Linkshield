'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
// Navbar removed: root AppNavbar will provide the top navigation
import { 
  Shield, 
  Brain, 
  Zap, 
  Globe, 
  CheckCircle, 
  Star,
  ArrowRight,
  Users,
  BarChart3,
  Settings,
  Database
} from 'lucide-react'
import Link from 'next/link'

interface Plan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  popular?: boolean
  highlighted?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for trying out LinkShield',
    features: [
      '5 URL checks per month',
      '2 AI analyses per month',
      'Basic security analysis',
      'Public reports',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    period: 'month',
    description: 'For professionals and small teams',
    features: [
      '500 URL checks per month',
      '50 AI analyses per month',
      'Advanced security analysis',
      'AI-powered content insights',
      'Priority support',
      'Custom branding options',
      'Export reports',
      'API access (coming soon)'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For large organizations and agencies',
    features: [
      '2,500 URL checks per month',
      '500 AI analyses per month',
      'Advanced AI insights',
      'Competitive intelligence',
      'White-label reports',
      'Dedicated support',
      'API access',
      'Custom integrations',
      'SLA guarantee',
      'Account manager'
    ],
    highlighted: true
  }
]

export default function PricingPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    if (!session) {
      // Redirect to sign up
      window.location.href = '/auth/signup'
      return
    }

    setLoading(true)
    setSelectedPlan(planId)

      try {
      const response = await fetch('/api/paypal/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()
      if (response.ok && (data.approvalUrl || data.checkoutUrl)) {
        // Redirect to PayPal approval URL (or fallback to checkoutUrl)
        const redirectUrl = data.approvalUrl || data.checkoutUrl
        window.location.href = redirectUrl
      } else {
        console.error('Checkout error:', data.error)
        alert('Failed to initiate checkout. Please try again.')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  const getCurrentPlan = () => {
    return session?.user?.plan || 'free'
  }

  const isCurrentPlan = (planId: string) => {
    return getCurrentPlan() === planId
  }

  const getUpgradeButton = (plan: Plan) => {
    if (!session) {
      return (
        <Link href="/auth/signup">
          <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
            Get Started
          </Button>
        </Link>
      )
    }

    if (isCurrentPlan(plan.id)) {
      return (
        <Button disabled className="w-full">
          <CheckCircle className="h-4 w-4 mr-2" />
          Current Plan
        </Button>
      )
    }

    const currentPlanIndex = plans.findIndex(p => p.id === getCurrentPlan())
    const planIndex = plans.findIndex(p => p.id === plan.id)

    if (planIndex < currentPlanIndex) {
      return (
        <Button disabled className="w-full">
          Downgrade
        </Button>
      )
    }

    return (
      <Button 
        onClick={() => handleUpgrade(plan.id)}
        disabled={loading && selectedPlan === plan.id}
        className="w-full"
        variant={plan.popular ? "default" : "outline"}
      >
        {loading && selectedPlan === plan.id ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
        ) : (
          <ArrowRight className="h-4 w-4 mr-2" />
        )}
        Upgrade {plan.price > 0 && `to ${plan.name}`}
      </Button>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-600 rounded-full">
              <Star className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
          
          {session && (
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600 dark:text-gray-300">Current plan:</span>
              <Badge variant="outline" className="capitalize">
                {getCurrentPlan()}
              </Badge>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.popular 
                  ? 'ring-2 ring-blue-600 shadow-lg scale-105' 
                  : plan.highlighted 
                    ? 'ring-2 ring-purple-600 shadow-lg' 
                    : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-3 py-1">
                    Best Value
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{plan.period}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {getUpgradeButton(plan)}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Feature Comparison
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      Pro
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      URL Checks per Month
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                      5
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                      500
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                      2,500
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      AI Analyses per Month
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                      2
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                      50
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700 dark:text-gray-300">
                      500
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      Advanced Security Analysis
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      AI Content Insights
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      API Access
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-yellow-600">Coming Soon</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      Priority Support
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged prorated amounts. When downgrading, changes take effect at the next billing cycle.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  We accept all major credit cards including Visa, MasterCard, American Express, and Discover. Payments are processed securely through Stripe.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with LinkShield, contact our support team for a full refund.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Absolutely! We use industry-standard encryption and security practices. Your data is never shared with third parties, and you can delete your data at any time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              Ready to get started?
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-6">
              Join thousands of users who trust LinkShield for their URL security needs.
            </p>
            {!session ? (
              <Link href="/auth/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}