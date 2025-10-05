/**
 * Pricing Plans Component
 * 
 * Displays subscription pricing plans with features, pricing, and call-to-action buttons.
 * Supports different plan types and billing cycles.
 */

'use client';

import React, { useState } from 'react';
import { Check, X, Star, Zap, Shield, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  popular?: boolean;
  features: Array<{
    name: string;
    included: boolean;
    description?: string;
  }>;
  limits: {
    urlChecks: number | 'unlimited';
    socialAccounts: number | 'unlimited';
    teamMembers: number | 'unlimited';
    apiCalls: number | 'unlimited';
  };
  cta: {
    text: string;
    variant: 'default' | 'outline' | 'secondary';
  };
}

interface PricingPlansProps {
  plans?: PricingPlan[];
  onSelectPlan?: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
  currentPlan?: string;
  className?: string;
}

const defaultPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started with basic URL protection',
    icon: <Shield className="h-6 w-6" />,
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'USD',
    features: [
      { name: 'Basic URL scanning', included: true },
      { name: 'Malware detection', included: true },
      { name: 'Phishing protection', included: true },
      { name: 'Email support', included: true },
      { name: 'Social media monitoring', included: false },
      { name: 'Real-time alerts', included: false },
      { name: 'API access', included: false },
      { name: 'Team collaboration', included: false },
      { name: 'Custom integrations', included: false },
      { name: 'Priority support', included: false },
    ],
    limits: {
      urlChecks: 100,
      socialAccounts: 1,
      teamMembers: 1,
      apiCalls: 50,
    },
    cta: {
      text: 'Get Started Free',
      variant: 'outline',
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Advanced protection for individuals and small teams',
    icon: <Zap className="h-6 w-6" />,
    monthlyPrice: 19,
    yearlyPrice: 190,
    currency: 'USD',
    popular: true,
    features: [
      { name: 'Everything in Free', included: true },
      { name: 'Social media monitoring', included: true },
      { name: 'Real-time alerts', included: true },
      { name: 'Advanced threat detection', included: true },
      { name: 'API access', included: true },
      { name: 'Browser extension', included: true },
      { name: 'Custom rules', included: true },
      { name: 'Team collaboration', included: false },
      { name: 'Custom integrations', included: false },
      { name: 'Priority support', included: false },
    ],
    limits: {
      urlChecks: 5000,
      socialAccounts: 5,
      teamMembers: 3,
      apiCalls: 1000,
    },
    cta: {
      text: 'Start Pro Trial',
      variant: 'default',
    },
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Comprehensive security for growing businesses',
    icon: <Star className="h-6 w-6" />,
    monthlyPrice: 49,
    yearlyPrice: 490,
    currency: 'USD',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Team collaboration', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Bulk URL scanning', included: true },
      { name: 'White-label options', included: true },
      { name: 'Priority support', included: true },
      { name: 'SLA guarantee', included: true },
      { name: 'Custom AI models', included: false },
      { name: 'Dedicated support', included: false },
    ],
    limits: {
      urlChecks: 25000,
      socialAccounts: 25,
      teamMembers: 15,
      apiCalls: 10000,
    },
    cta: {
      text: 'Start Business Trial',
      variant: 'default',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Enterprise-grade security with custom solutions',
    icon: <Crown className="h-6 w-6" />,
    monthlyPrice: 199,
    yearlyPrice: 1990,
    currency: 'USD',
    features: [
      { name: 'Everything in Business', included: true },
      { name: 'Custom AI models', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'On-premise deployment', included: true },
      { name: 'Custom compliance', included: true },
      { name: 'Advanced reporting', included: true },
      { name: 'SSO integration', included: true },
      { name: 'Audit logs', included: true },
      { name: 'Custom training', included: true },
      { name: '24/7 phone support', included: true },
    ],
    limits: {
      urlChecks: 'unlimited',
      socialAccounts: 'unlimited',
      teamMembers: 'unlimited',
      apiCalls: 'unlimited',
    },
    cta: {
      text: 'Contact Sales',
      variant: 'default',
    },
  },
];

export default function PricingPlans({
  plans = defaultPlans,
  onSelectPlan,
  currentPlan,
  className = '',
}: PricingPlansProps) {
  const [isYearly, setIsYearly] = useState(false);

  const handleSelectPlan = (planId: string) => {
    onSelectPlan?.(planId, isYearly ? 'yearly' : 'monthly');
  };

  const formatPrice = (plan: PricingPlan) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const monthlyPrice = isYearly ? plan.yearlyPrice / 12 : price;
    
    if (price === 0) {
      return 'Free';
    }

    return `$${monthlyPrice.toFixed(0)}/mo`;
  };

  const formatLimit = (limit: number | 'unlimited') => {
    if (limit === 'unlimited') return 'Unlimited';
    if (limit >= 1000) return `${(limit / 1000).toFixed(0)}K`;
    return limit.toString();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-8">
        <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="mx-3"
        />
        <span className={`text-sm font-medium ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
          Yearly
        </span>
        {isYearly && (
          <Badge variant="secondary" className="ml-2">
            Save 17%
          </Badge>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular
                ? 'border-primary shadow-lg scale-105'
                : 'border-gray-200 dark:border-gray-700'
            } ${
              currentPlan === plan.id
                ? 'ring-2 ring-primary ring-offset-2'
                : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {plan.icon}
                </div>
              </div>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                {plan.description}
              </CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(plan)}
                </div>
                {plan.monthlyPrice > 0 && isYearly && (
                  <div className="text-sm text-gray-500">
                    Billed annually (${plan.yearlyPrice}/year)
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Usage Limits */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                  Usage Limits
                </h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>URL Checks</span>
                    <span className="font-medium">{formatLimit(plan.limits.urlChecks)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Social Accounts</span>
                    <span className="font-medium">{formatLimit(plan.limits.socialAccounts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Team Members</span>
                    <span className="font-medium">{formatLimit(plan.limits.teamMembers)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Calls</span>
                    <span className="font-medium">{formatLimit(plan.limits.apiCalls)}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                  Features
                </h4>
                <div className="space-y-2">
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-400 line-through'
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                  {plan.features.length > 6 && (
                    <div className="text-sm text-gray-500">
                      +{plan.features.length - 6} more features
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={plan.cta.variant}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? 'Current Plan' : plan.cta.text}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            All plans include
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>99.9% uptime SLA</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>SSL encryption</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>GDPR compliant</span>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Need a custom plan? {' '}
              <button className="text-primary hover:underline">
                Contact our sales team
              </button>
              {' '} for enterprise solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}