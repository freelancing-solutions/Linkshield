'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'

interface Plan {
  name: string
  price: number
  requests: number
  features: string[]
  color: string
  popular?: boolean
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: 0,
    requests: 100,
    features: [
      '100 requests/month',
      'Basic URL analysis',
      'Community support',
      'Standard badge'
    ],
    color: 'text-gray-600'
  },
  {
    name: 'Pro',
    price: 9,
    requests: 1000,
    features: [
      '1,000 requests/month',
      'Advanced threat detection',
      'Priority support',
      'Custom branding',
      'API access',
      'Detailed reports'
    ],
    color: 'text-blue-600',
    popular: true
  },
  {
    name: 'Business',
    price: 29,
    requests: 10000,
    features: [
      '10,000 requests/month',
      'Real-time monitoring',
      'White-label solution',
      'Dedicated support',
      'Advanced analytics',
      'Team collaboration',
      'Custom integrations'
    ],
    color: 'text-purple-600'
  },
  {
    name: 'Enterprise',
    price: 99,
    requests: 100000,
    features: [
      '100,000+ requests/month',
      'Unlimited domains',
      'SLA guarantee',
      'Custom features',
      'Dedicated infrastructure',
      '24/7 phone support',
      'Onboarding assistance'
    ],
    color: 'text-red-600'
  }
]

export default function PricingCalculator() {
  const [monthlyRequests, setMonthlyRequests] = useState(500)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const calculateRecommendedPlan = (requests: number): Plan => {
    if (requests <= 100) return plans[0]
    if (requests <= 1000) return plans[1]
    if (requests <= 10000) return plans[2]
    return plans[3]
  }

  const recommendedPlan = calculateRecommendedPlan(monthlyRequests)

  const formatRequests = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`
    }
    return value.toString()
  }

  const calculatePrice = (requests: number, plan: Plan) => {
    if (plan.name === 'Enterprise') {
      const basePrice = plan.price
      const overage = Math.max(0, requests - 100000)
      const overagePrice = Math.ceil(overage / 10000) * 10
      return basePrice + overagePrice
    }
    return plan.price
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Pricing Calculator</h2>
        <p className="text-muted-foreground">
          Estimate your monthly costs based on your API usage
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly API Requests</CardTitle>
          <CardDescription>
            Adjust the slider to see how your usage affects pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {formatRequests(monthlyRequests)}
              </div>
              <p className="text-sm text-muted-foreground">requests per month</p>
            </div>
            
            <Slider
              value={[monthlyRequests]}
              onValueChange={([value]) => setMonthlyRequests(value)}
              min={100}
              max={200000}
              step={100}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>100</span>
              <span>1k</span>
              <span>10k</span>
              <span>100k</span>
              <span>200k</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const isRecommended = plan.name === recommendedPlan.name
          const price = calculatePrice(monthlyRequests, plan)
          
          return (
            <Card 
              key={plan.name}
              className={`relative transition-all ${
                isRecommended ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
            >
              {isRecommended && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                  Recommended
                </Badge>
              )}
              
              {plan.popular && (
                <Badge variant="outline" className="absolute -top-2 right-2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className={`text-xl ${plan.color}`}>
                  {plan.name}
                </CardTitle>
                <div className="text-3xl font-bold">
                  ${price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
                <CardDescription>
                  {formatRequests(plan.requests)} requests included
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full mt-6 px-4 py-2 rounded-md font-medium transition-colors ${
                    isRecommended
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {isRecommended ? 'Choose Recommended' : 'Select Plan'}
                </button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedPlan && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Selection</CardTitle>
            <CardDescription>
              Based on {formatRequests(monthlyRequests)} requests per month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{selectedPlan.name} Plan</h3>
                <p className="text-sm text-muted-foreground">
                  {formatRequests(selectedPlan.requests)} requests included
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  ${calculatePrice(monthlyRequests, selectedPlan)}/month
                </div>
                <p className="text-sm text-muted-foreground">
                  {monthlyRequests <= selectedPlan.requests ? 'No overage' : 'With overage'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}