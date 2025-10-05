/**
 * @fileoverview Plan Comparison Grid Component
 * 
 * Displays all six subscription tiers in a comprehensive comparison grid
 * with features, pricing, and upgrade options. Supports both monthly and
 * annual pricing views with savings calculations.
 * 
 * @author LinkShield Team
 * @version 2.0.0
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, X, Crown, Star, Zap, Building, Users, Infinity } from 'lucide-react';
import { PlanTier, PlanTierUtils } from '@/types/subscription.types';
import type { SubscriptionPlan } from '@/types/user.types';
import type { PlanComparisonGridProps } from '@/types/subscription.types';

/**
 * Plan icons mapping for visual representation
 */
const PLAN_ICONS = {
  free: null,
  starter: <Zap className="h-5 w-5" />,
  creator: <Star className="h-5 w-5" />,
  professional: <Crown className="h-5 w-5" />,
  business: <Building className="h-5 w-5" />,
  enterprise: <Users className="h-5 w-5" />
};

/**
 * Plan color schemes for visual differentiation
 */
const PLAN_COLORS = {
  free: 'border-gray-200 bg-white',
  starter: 'border-blue-200 bg-blue-50/50',
  creator: 'border-purple-200 bg-purple-50/50',
  professional: 'border-green-200 bg-green-50/50',
  business: 'border-orange-200 bg-orange-50/50',
  enterprise: 'border-amber-200 bg-amber-50/50'
};

/**
 * Plan Comparison Grid Component
 * 
 * Renders a comprehensive comparison of all subscription plans with:
 * - Monthly/annual pricing toggle
 * - Feature comparison matrix
 * - Popular plan highlighting
 * - Responsive grid layout
 * - Upgrade call-to-action buttons
 */
export const PlanComparisonGrid: React.FC<PlanComparisonGridProps> = ({
  plans,
  currentPlan,
  onSelectPlan,
  showAnnualPricing = false
}) => {
  const [isAnnual, setIsAnnual] = React.useState(showAnnualPricing);

  /**
   * Calculate savings percentage for annual billing
   */
  const calculateSavings = (monthlyPrice: number, yearlyPrice: number): number => {
    if (monthlyPrice === 0 || yearlyPrice === 0) return 0;
    const monthlyCost = monthlyPrice * 12;
    return Math.round(((monthlyCost - yearlyPrice) / monthlyCost) * 100);
  };

  /**
   * Format price display with currency
   */
  const formatPrice = (price: number): string => {
    if (price === 0) return 'Free';
    if (price === -1) return 'Custom';
    return `$${price.toFixed(2)}`;
  };

  /**
   * Get plan tier for styling and logic
   */
  const getPlanTier = (planName: string): PlanTier => {
    return PlanTierUtils.getTierFromPlan(planName);
  };

  /**
   * Check if plan is current user's plan
   */
  const isCurrentPlan = (planId: string): boolean => {
    return currentPlan === planId;
  };

  /**
   * Get button text based on plan and current status
   */
  const getButtonText = (plan: SubscriptionPlan): string => {
    if (isCurrentPlan(plan.id)) return 'Current Plan';
    if (plan.name === 'enterprise') return 'Contact Sales';
    if (plan.name === 'free') return 'Get Started';
    return 'Upgrade Now';
  };

  /**
   * Get button variant based on plan status
   */
  const getButtonVariant = (plan: SubscriptionPlan): 'default' | 'outline' | 'secondary' => {
    if (isCurrentPlan(plan.id)) return 'secondary';
    if (plan.popular) return 'default';
    return 'outline';
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Pricing Toggle */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <span className={`px-3 py-2 text-sm font-medium transition-colors ${
            !isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
          }`}>
            Monthly
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-blue-600"
          />
          <span className={`px-3 py-2 text-sm font-medium transition-colors ${
            isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
          }`}>
            Annual
          </span>
          {isAnnual && (
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
              Save up to 20%
            </Badge>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {plans.map((plan) => {
          const tier = getPlanTier(plan.name);
          const price = isAnnual ? plan.yearly_price : plan.monthly_price;
          const savings = calculateSavings(plan.monthly_price, plan.yearly_price);
          const isPopular = plan.popular;
          const isCurrent = isCurrentPlan(plan.id);

          return (
            <Card
              key={plan.id}
              className={`relative transition-all duration-200 hover:shadow-lg ${
                PLAN_COLORS[plan.name as keyof typeof PLAN_COLORS]
              } ${
                isPopular ? 'ring-2 ring-blue-500 scale-105' : ''
              } ${
                isCurrent ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-600 text-white px-3 py-1">
                    Current
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                {/* Plan Icon */}
                <div className="flex justify-center mb-2">
                  <div className={`p-3 rounded-full ${PlanTierUtils.getTierColor(tier)}`}>
                    {PLAN_ICONS[plan.name as keyof typeof PLAN_ICONS] || (
                      <div className="h-5 w-5" />
                    )}
                  </div>
                </div>

                {/* Plan Name */}
                <CardTitle className="text-xl font-bold">
                  {plan.display_name}
                </CardTitle>

                {/* Plan Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {plan.description}
                </p>

                {/* Pricing */}
                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">
                      {formatPrice(price)}
                    </span>
                    {price > 0 && price !== -1 && (
                      <span className="text-gray-500 ml-1">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  
                  {/* Savings Display */}
                  {isAnnual && savings > 0 && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      Save {savings}% annually
                    </div>
                  )}

                  {/* Monthly equivalent for annual */}
                  {isAnnual && price > 0 && price !== -1 && (
                    <div className="text-xs text-gray-500 mt-1">
                      ${(price / 12).toFixed(2)}/month billed annually
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Key Limits */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">URL Checks/Day</span>
                    <span className="font-medium">
                      {plan.limits.url_checks_per_day === -1 ? (
                        <Infinity className="h-4 w-4 inline" />
                      ) : (
                        plan.limits.url_checks_per_day.toLocaleString()
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">API Calls/Day</span>
                    <span className="font-medium">
                      {plan.limits.api_calls_per_day === -1 ? (
                        <Infinity className="h-4 w-4 inline" />
                      ) : (
                        plan.limits.api_calls_per_day.toLocaleString()
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Team Members</span>
                    <span className="font-medium">
                      {plan.limits.team_members_limit === -1 ? (
                        <Infinity className="h-4 w-4 inline" />
                      ) : (
                        plan.limits.team_members_limit
                      )}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                  {plan.features.length > 6 && (
                    <div className="text-xs text-gray-500 mt-2">
                      +{plan.features.length - 6} more features
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  variant={getButtonVariant(plan)}
                  className="w-full"
                  disabled={isCurrent}
                  onClick={() => onSelectPlan(plan.id)}
                >
                  {getButtonText(plan)}
                </Button>

                {/* Target Audience */}
                <p className="text-xs text-gray-500 text-center mt-3">
                  {plan.target_audience}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All plans include 14-day free trial • No setup fees • Cancel anytime
        </p>
      </div>
    </div>
  );
};