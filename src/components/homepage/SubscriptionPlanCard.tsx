/**
 * SubscriptionPlanCard Component
 * 
 * Displays current subscription plan, usage statistics, and upgrade options.
 */

'use client';

import { Crown, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscriptionInfo } from '@/hooks/homepage';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Link from 'next/link';
import type { SubscriptionPlan } from '@/types/homepage';

export const SubscriptionPlanCard = () => {
  const { subscription, usage, isLoading } = useSubscriptionInfo();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <LoadingSpinner size="md" message="Loading subscription..." />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Active Subscription
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Upgrade to unlock advanced features and higher limits
            </p>
            <Button asChild>
              <Link href="/pricing">
                View Plans
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getPlanColor = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'FREE':
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
      case 'BASIC':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900';
      case 'PRO':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900';
      case 'ENTERPRISE':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
    }
  };

  const getUsagePercentage = (used: number, limit: number): number => {
    return Math.min((used / limit) * 100, 100);
  };

  const isApproachingLimit = (percentage: number): boolean => {
    return percentage >= 80;
  };

  const isLimitReached = (percentage: number): boolean => {
    return percentage >= 100;
  };

  const urlChecksPercentage = usage
    ? getUsagePercentage(usage.usage.url_checks, usage.limits.url_checks)
    : 0;

  const showUpgradePrompt =
    subscription.plan === 'FREE' ||
    (usage && isApproachingLimit(urlChecksPercentage));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Subscription Plan
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded text-sm font-semibold ${getPlanColor(subscription.plan)}`}>
                {subscription.plan}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                subscription.status === 'ACTIVE'
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {subscription.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      {usage && (
        <div className="space-y-4 mb-4">
          {/* URL Checks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                URL Checks
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usage.usage.url_checks} / {usage.limits.url_checks}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isLimitReached(urlChecksPercentage)
                    ? 'bg-red-500'
                    : isApproachingLimit(urlChecksPercentage)
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${urlChecksPercentage}%` }}
              />
            </div>
            {isApproachingLimit(urlChecksPercentage) && (
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  {isLimitReached(urlChecksPercentage)
                    ? 'Limit reached'
                    : 'Approaching limit'}
                </span>
              </div>
            )}
          </div>

          {/* AI Analyses */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI Analyses
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usage.usage.ai_analyses} / {usage.limits.ai_analyses}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-purple-500 transition-all"
                style={{
                  width: `${getUsagePercentage(usage.usage.ai_analyses, usage.limits.ai_analyses)}%`,
                }}
              />
            </div>
          </div>

          {/* API Calls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                API Calls
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usage.usage.api_calls} / {usage.limits.api_calls}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{
                  width: `${getUsagePercentage(usage.usage.api_calls, usage.limits.api_calls)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Billing Period */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <Calendar className="h-3 w-3" />
        <span>
          Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {showUpgradePrompt ? (
          <Button asChild className="flex-1">
            <Link href="/pricing">
              <TrendingUp className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/subscriptions">
              Manage Subscription
            </Link>
          </Button>
        )}
      </div>

      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            {subscription.plan === 'FREE'
              ? 'Upgrade to unlock unlimited checks and advanced features'
              : 'Upgrade to increase your limits and access premium features'}
          </p>
        </div>
      )}
    </div>
  );
};
