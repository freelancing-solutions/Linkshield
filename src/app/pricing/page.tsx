'use client';

import React from 'react';
import { PlanComparisonGrid, LoadingSpinner } from '@/components/shared';
import { useSubscriptionPlans } from '@/hooks/dashboard/useSubscriptionPlans';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

/**
 * Pricing Page Component
 * 
 * Displays subscription plans using the shared PlanComparisonGrid component.
 * Fetches plan data from the API and handles loading/error states.
 */

export default function PricingPage() {
  const { plans, loading, error } = useSubscriptionPlans();

  /**
   * Handle plan selection - redirect to subscription flow
   */
  const handleSelectPlan = (planId: string) => {
    // TODO: Implement subscription flow
    console.log('Selected plan:', planId);
    // This would typically redirect to a checkout or subscription management page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Select the perfect plan for your URL monitoring and security needs
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Select the perfect plan for your URL monitoring and security needs
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Unable to load pricing plans. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your URL monitoring and security needs. 
            All plans include a 14-day free trial with no setup fees.
          </p>
        </div>

        {/* Plan Comparison Grid */}
        <PlanComparisonGrid
          plans={plans}
          currentPlan={undefined} // TODO: Get current plan from user context
          onSelectPlan={handleSelectPlan}
          showAnnualPricing={false}
        />

        {/* FAQ or Additional Information Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, all paid plans include a 14-day free trial with full access to all features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}