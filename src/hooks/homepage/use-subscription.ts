/**
 * Subscription Hooks
 * 
 * React Query hooks for subscription and usage data.
 * 
 * Note: All hooks require authentication.
 */

import { useQuery } from '@tanstack/react-query';
import { subscriptionsService } from '@/services/subscriptions.service';

/**
 * Hook for fetching user subscriptions
 * 
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query hook with subscriptions array
 * 
 * @example
 * ```tsx
 * const { data: subscriptions, isLoading } = useSubscriptions();
 * 
 * const activeSub = subscriptions?.find(s => s.status === 'ACTIVE');
 * if (activeSub) {
 *   return <PlanBadge plan={activeSub.plan} />;
 * }
 * ```
 */
export const useSubscriptions = (enabled = true) => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionsService.getSubscriptions(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for fetching subscription usage statistics
 * 
 * @param subscriptionId - The subscription ID
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query hook with usage statistics
 * 
 * @example
 * ```tsx
 * const { data: usage } = useSubscriptionUsage('sub_123');
 * 
 * const urlChecksUsed = usage?.usage.url_checks || 0;
 * const urlChecksLimit = usage?.limits.url_checks || 0;
 * const percentage = (urlChecksUsed / urlChecksLimit) * 100;
 * 
 * return (
 *   <ProgressBar value={percentage} />
 * );
 * ```
 */
export const useSubscriptionUsage = (
  subscriptionId: string | undefined,
  enabled = true
) => {
  return useQuery({
    queryKey: ['subscription-usage', subscriptionId],
    queryFn: () => subscriptionsService.getSubscriptionUsage(subscriptionId!),
    enabled: enabled && !!subscriptionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for getting combined subscription info with usage
 * 
 * @returns Combined subscription and usage data
 * 
 * @example
 * ```tsx
 * const { subscription, usage, isLoading } = useSubscriptionInfo();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h3>{subscription?.plan} Plan</h3>
 *     <UsageChart usage={usage} />
 *   </div>
 * );
 * ```
 */
export const useSubscriptionInfo = () => {
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions();
  const activeSubscription = subscriptions?.find(s => s.status === 'ACTIVE');
  
  const { data: usage, isLoading: usageLoading } = useSubscriptionUsage(
    activeSubscription?.id
  );

  return {
    subscription: activeSubscription,
    usage,
    isLoading: subsLoading || usageLoading,
  };
};
