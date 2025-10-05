'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useSubscriptionInfo } from '@/hooks/homepage/use-subscription';
import type { SubscriptionPlan, SubscriptionStatus } from '@/types/homepage';

/**
 * Plan configuration with pricing and features
 */
const PLAN_CONFIG = {
  FREE: {
    name: 'Free',
    price: '$0',
    color: 'bg-gray-100 text-gray-800',
    icon: null,
  },
  BASIC: {
    name: 'Basic',
    price: '$9.99',
    color: 'bg-blue-100 text-blue-800',
    icon: null,
  },
  PRO: {
    name: 'Pro',
    price: '$29.99',
    color: 'bg-purple-100 text-purple-800',
    icon: <Crown className="h-3 w-3" />,
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 'Custom',
    color: 'bg-amber-100 text-amber-800',
    icon: <Crown className="h-3 w-3" />,
  },
} as const;

/**
 * Status configuration with colors and labels
 */
const STATUS_CONFIG = {
  ACTIVE: {
    label: 'Active',
    color: 'bg-green-100 text-green-800',
  },
  TRIAL: {
    label: 'Trial',
    color: 'bg-blue-100 text-blue-800',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
  },
  EXPIRED: {
    label: 'Expired',
    color: 'bg-gray-100 text-gray-800',
  },
} as const;

/**
 * Format date for display
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get usage color based on percentage
 */
const getUsageColor = (percentage: number): string => {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 80) return 'bg-amber-500';
  if (percentage >= 60) return 'bg-yellow-500';
  return 'bg-green-500';
};

/**
 * Usage bar component for individual metrics
 */
interface UsageBarProps {
  label: string;
  used: number;
  limit: number;
  percentage: number;
}

const UsageBar: React.FC<UsageBarProps> = ({ label, used, limit, percentage }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">
        {used.toLocaleString()} / {limit.toLocaleString()}
      </span>
    </div>
    <div className="relative">
      <Progress 
        value={percentage} 
        className="h-2"
        style={{
          '--progress-background': getUsageColor(percentage)
        } as React.CSSProperties}
      />
      <span className="absolute right-0 top-2 text-xs text-gray-500">
        {percentage.toFixed(1)}%
      </span>
    </div>
  </div>
);

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-16" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-2 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

/**
 * Error state component
 */
interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => (
  <Card>
    <CardContent className="pt-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load subscription information. Please try again.
        </AlertDescription>
      </Alert>
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="mt-4 w-full"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </CardContent>
  </Card>
);

/**
 * SubscriptionPlanCard Component
 * 
 * Displays current subscription plan information including:
 * - Plan name, price, and status
 * - Usage statistics with progress bars
 * - Renewal/cancellation information
 * - Upgrade button and warnings
 * 
 * Requirements: 9.1 - Subscription integration
 */
export const SubscriptionPlanCard: React.FC = () => {
  const { subscription, usage, isLoading } = useSubscriptionInfo();

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state if no subscription data
  if (!subscription) {
    return (
      <ErrorState 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  const planConfig = PLAN_CONFIG[subscription.plan];
  const statusConfig = STATUS_CONFIG[subscription.status];
  
  // Calculate overall usage percentage (average of all metrics)
  const overallUsage = usage ? (
    (usage.percentage_used.url_checks + 
     usage.percentage_used.ai_analyses + 
     usage.percentage_used.api_calls) / 3
  ) : 0;

  // Check if usage is high (>80%)
  const isHighUsage = overallUsage > 80;
  const isCriticalUsage = overallUsage > 90;

  // Check if subscription is ending soon
  const periodEnd = new Date(subscription.current_period_end);
  const daysUntilRenewal = Math.ceil((periodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isEndingSoon = daysUntilRenewal <= 7;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {planConfig.icon}
            <span>{planConfig.name} Plan</span>
            <Badge className={planConfig.color}>
              {planConfig.price}/month
            </Badge>
          </CardTitle>
          <Badge className={statusConfig.color}>
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* High usage warning */}
        {isHighUsage && (
          <Alert variant={isCriticalUsage ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {isCriticalUsage 
                ? "You're approaching your usage limits. Consider upgrading to avoid service interruption."
                : "You've used over 80% of your plan limits. Monitor your usage closely."
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Subscription ending warning */}
        {(subscription.cancel_at_period_end || isEndingSoon) && (
          <Alert variant="destructive">
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              {subscription.cancel_at_period_end
                ? `Your subscription will end on ${formatDate(subscription.current_period_end)}.`
                : `Your subscription renews in ${daysUntilRenewal} day${daysUntilRenewal !== 1 ? 's' : ''}.`
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Usage Statistics */}
        {usage && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <h4 className="font-medium">Usage Statistics</h4>
            </div>

            <div className="space-y-4">
              <UsageBar
                label="URL Checks"
                used={usage.usage.url_checks}
                limit={usage.limits.url_checks}
                percentage={usage.percentage_used.url_checks}
              />
              
              <UsageBar
                label="AI Analyses"
                used={usage.usage.ai_analyses}
                limit={usage.limits.ai_analyses}
                percentage={usage.percentage_used.ai_analyses}
              />
              
              <UsageBar
                label="API Calls"
                used={usage.usage.api_calls}
                limit={usage.limits.api_calls}
                percentage={usage.percentage_used.api_calls}
              />
            </div>

            <Separator />

            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Billing Period:</span>
                <span>
                  {formatDate(usage.period_start)} - {formatDate(usage.period_end)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium">{statusConfig.label}</span>
          </div>
          
          {subscription.trial_end && (
            <div className="flex justify-between">
              <span className="text-gray-600">Trial Ends:</span>
              <span className="font-medium">{formatDate(subscription.trial_end)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">
              {subscription.cancel_at_period_end ? 'Ends:' : 'Renews:'}
            </span>
            <span className="font-medium">
              {formatDate(subscription.current_period_end)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Upgrade Button - show for all plans except Enterprise */}
          {subscription.plan !== 'ENTERPRISE' && (
            <Button asChild className="w-full">
              <Link href="/dashboard/subscriptions">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Plan
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}

          {/* Manage Subscription Button */}
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard/subscriptions">
              Manage Subscription
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};