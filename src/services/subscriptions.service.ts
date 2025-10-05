/**
 * Subscriptions Service
 * 
 * Handles subscription and usage statistics API calls.
 * 
 * Note: All endpoints require authentication.
 */

import { apiClient } from './api';
import type { Subscription, UsageStats } from '@/types/homepage';
import type { 
  SubscriptionPlan, 
  DetailedUsage, 
  UpgradeRecommendation 
} from '@/types/user.types';

export const subscriptionsService = {
  /**
   * Get user's subscriptions
   * 
   * @returns Promise with array of subscriptions
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const subscriptions = await subscriptionsService.getSubscriptions();
   * const activeSub = subscriptions.find(s => s.status === 'ACTIVE');
   * ```
   */
  getSubscriptions: async (): Promise<Subscription[]> => {
    return apiClient.get<Subscription[]>('/subscriptions');
  },

  /**
   * Get usage statistics for a subscription
   * 
   * @param subscriptionId - The subscription ID
   * @returns Promise with usage statistics
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const usage = await subscriptionsService.getSubscriptionUsage('sub_123');
   * console.log('URL checks used:', usage.usage.url_checks);
   * ```
   */
  getSubscriptionUsage: async (subscriptionId: string): Promise<UsageStats> => {
    return apiClient.get<UsageStats>(`/subscriptions/${subscriptionId}/usage`);
  },

  /**
   * Get all available subscription plans
   * 
   * @returns Promise with array of subscription plans
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const plans = await subscriptionsService.getPlans();
   * const proPlan = plans.find(p => p.name === 'professional');
   * ```
   */
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    return apiClient.get<SubscriptionPlan[]>('/subscriptions/plans');
  },

  /**
   * Get detailed usage statistics with breakdown
   * 
   * @param subscriptionId - The subscription ID
   * @returns Promise with detailed usage statistics
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const detailedUsage = await subscriptionsService.getDetailedUsage('sub_123');
   * console.log('Daily usage:', detailedUsage.daily_usage);
   * ```
   */
  getDetailedUsage: async (subscriptionId: string): Promise<DetailedUsage> => {
    return apiClient.get<DetailedUsage>(`/subscriptions/${subscriptionId}/usage/detailed`);
  },

  /**
   * Get upgrade recommendations based on usage patterns
   * 
   * @param subscriptionId - The subscription ID
   * @returns Promise with upgrade recommendations
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const recommendations = await subscriptionsService.getRecommendations('sub_123');
   * if (recommendations.length > 0) {
   *   console.log('Recommended plan:', recommendations[0].recommended_plan);
   * }
   * ```
   */
  getRecommendations: async (subscriptionId: string): Promise<UpgradeRecommendation[]> => {
    return apiClient.get<UpgradeRecommendation[]>(`/subscriptions/${subscriptionId}/recommendations`);
  },

  /**
   * Preview upgrade costs and benefits
   * 
   * @param subscriptionId - The subscription ID
   * @param targetPlan - The target plan to upgrade to
   * @returns Promise with upgrade preview details
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const preview = await subscriptionsService.previewUpgrade('sub_123', 'professional');
   * console.log('Upgrade cost:', preview.cost);
   * console.log('New limits:', preview.new_limits);
   * ```
   */
  previewUpgrade: async (
    subscriptionId: string, 
    targetPlan: string
  ): Promise<{
    cost: number;
    prorated_amount: number;
    new_limits: any;
    effective_date: string;
    billing_cycle_adjustment: string;
  }> => {
    return apiClient.post(`/subscriptions/${subscriptionId}/preview-upgrade`, {
      target_plan: targetPlan
    });
  },

  /**
   * Upgrade subscription to a new plan
   * 
   * @param subscriptionId - The subscription ID
   * @param targetPlan - The target plan to upgrade to
   * @param paymentMethodId - Optional payment method ID for billing
   * @returns Promise with updated subscription
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const updatedSub = await subscriptionsService.upgradePlan('sub_123', 'professional');
   * console.log('New plan:', updatedSub.plan);
   * ```
   */
  upgradePlan: async (
    subscriptionId: string,
    targetPlan: string,
    paymentMethodId?: string
  ): Promise<Subscription> => {
    return apiClient.post(`/subscriptions/${subscriptionId}/upgrade`, {
      target_plan: targetPlan,
      payment_method_id: paymentMethodId
    });
  },

  /**
   * Cancel subscription
   * 
   * @param subscriptionId - The subscription ID
   * @param cancelAtPeriodEnd - Whether to cancel at the end of the current period
   * @returns Promise with updated subscription
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const cancelledSub = await subscriptionsService.cancelSubscription('sub_123', true);
   * console.log('Cancellation date:', cancelledSub.cancel_at);
   * ```
   */
  cancelSubscription: async (
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<Subscription> => {
    return apiClient.post(`/subscriptions/${subscriptionId}/cancel`, {
      cancel_at_period_end: cancelAtPeriodEnd
    });
  },

  /**
   * Reactivate a cancelled subscription
   * 
   * @param subscriptionId - The subscription ID
   * @returns Promise with reactivated subscription
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const reactivatedSub = await subscriptionsService.reactivateSubscription('sub_123');
   * console.log('Status:', reactivatedSub.status);
   * ```
   */
  reactivateSubscription: async (subscriptionId: string): Promise<Subscription> => {
    return apiClient.post(`/subscriptions/${subscriptionId}/reactivate`);
  },
};
