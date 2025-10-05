/**
 * Subscriptions Service
 * 
 * Handles subscription and usage statistics API calls.
 * 
 * Note: All endpoints require authentication.
 */

import { apiClient } from './api';
import type { Subscription, UsageStats } from '@/types/homepage';

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
};
