/**
 * useSubscriptionPlans Hook
 * 
 * Custom hook for fetching and managing subscription plans data.
 * Provides loading states, error handling, and fallback data.
 */

import { useState, useEffect } from 'react';
import { subscriptionsService } from '@/services/subscriptions.service';
import type { SubscriptionPlan } from '@/types/user.types';

/**
 * Hook return type
 */
interface UseSubscriptionPlansReturn {
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fallback plan data for the six-tier system
 * Used when API is unavailable or fails to load
 */
const fallbackPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'free',
    display_name: 'Free',
    description: 'Perfect for getting started',
    monthly_price: 0,
    yearly_price: 0,
    popular: false,
    target_audience: 'Individual users',
    limits: {
      url_checks_per_day: 10,
      api_calls_per_day: 100,
      team_members_limit: 1,
      data_retention_days: 30,
      concurrent_scans: 1,
      custom_domains: 0,
      webhook_endpoints: 0,
      export_formats: ['json'],
      priority_support: false,
      advanced_analytics: false,
      white_label: false,
      api_access: false,
      bulk_operations: false,
      custom_integrations: false
    },
    features: [
      { name: 'Basic URL monitoring', included: true },
      { name: 'Email notifications', included: true },
      { name: 'Basic reports', included: true },
      { name: 'Community support', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Priority support', included: false }
    ]
  },
  {
    id: 'starter',
    name: 'starter',
    display_name: 'Starter',
    description: 'Great for small projects',
    monthly_price: 9.99,
    yearly_price: 99.99,
    popular: false,
    target_audience: 'Small teams',
    limits: {
      url_checks_per_day: 100,
      api_calls_per_day: 1000,
      team_members_limit: 3,
      data_retention_days: 90,
      concurrent_scans: 3,
      custom_domains: 1,
      webhook_endpoints: 2,
      export_formats: ['json', 'csv'],
      priority_support: false,
      advanced_analytics: true,
      white_label: false,
      api_access: true,
      bulk_operations: false,
      custom_integrations: false
    },
    features: [
      { name: 'Basic URL monitoring', included: true },
      { name: 'Email notifications', included: true },
      { name: 'Basic reports', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'API access', included: true },
      { name: 'Priority support', included: false }
    ]
  },
  {
    id: 'creator',
    name: 'creator',
    display_name: 'Creator',
    description: 'Perfect for content creators',
    monthly_price: 19.99,
    yearly_price: 199.99,
    popular: true,
    target_audience: 'Content creators',
    limits: {
      url_checks_per_day: 500,
      api_calls_per_day: 5000,
      team_members_limit: 5,
      data_retention_days: 180,
      concurrent_scans: 5,
      custom_domains: 3,
      webhook_endpoints: 5,
      export_formats: ['json', 'csv', 'pdf'],
      priority_support: true,
      advanced_analytics: true,
      white_label: false,
      api_access: true,
      bulk_operations: true,
      custom_integrations: false
    },
    features: [
      { name: 'Basic URL monitoring', included: true },
      { name: 'Email notifications', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'API access', included: true },
      { name: 'Priority support', included: true },
      { name: 'Bulk operations', included: true }
    ]
  },
  {
    id: 'professional',
    name: 'professional',
    display_name: 'Professional',
    description: 'For growing businesses',
    monthly_price: 49.99,
    yearly_price: 499.99,
    popular: false,
    target_audience: 'Growing businesses',
    limits: {
      url_checks_per_day: 2000,
      api_calls_per_day: 20000,
      team_members_limit: 10,
      data_retention_days: 365,
      concurrent_scans: 10,
      custom_domains: 10,
      webhook_endpoints: 10,
      export_formats: ['json', 'csv', 'pdf', 'xml'],
      priority_support: true,
      advanced_analytics: true,
      white_label: true,
      api_access: true,
      bulk_operations: true,
      custom_integrations: true
    },
    features: [
      { name: 'All Creator features', included: true },
      { name: 'White-label reports', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Advanced team management', included: true },
      { name: 'SLA guarantee', included: true },
      { name: 'Phone support', included: true }
    ]
  },
  {
    id: 'business',
    name: 'business',
    display_name: 'Business',
    description: 'For established companies',
    monthly_price: 99.99,
    yearly_price: 999.99,
    popular: false,
    target_audience: 'Established companies',
    limits: {
      url_checks_per_day: 10000,
      api_calls_per_day: 100000,
      team_members_limit: 25,
      data_retention_days: 730,
      concurrent_scans: 25,
      custom_domains: 25,
      webhook_endpoints: 25,
      export_formats: ['json', 'csv', 'pdf', 'xml'],
      priority_support: true,
      advanced_analytics: true,
      white_label: true,
      api_access: true,
      bulk_operations: true,
      custom_integrations: true
    },
    features: [
      { name: 'All Professional features', included: true },
      { name: 'Advanced security scanning', included: true },
      { name: 'Custom reporting', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'SSO integration', included: true },
      { name: '24/7 phone support', included: true }
    ]
  },
  {
    id: 'enterprise',
    name: 'enterprise',
    display_name: 'Enterprise',
    description: 'For large organizations',
    monthly_price: -1, // Custom pricing
    yearly_price: -1,
    popular: false,
    target_audience: 'Large organizations',
    limits: {
      url_checks_per_day: -1, // Unlimited
      api_calls_per_day: -1,
      team_members_limit: -1,
      data_retention_days: -1,
      concurrent_scans: -1,
      custom_domains: -1,
      webhook_endpoints: -1,
      export_formats: ['json', 'csv', 'pdf', 'xml'],
      priority_support: true,
      advanced_analytics: true,
      white_label: true,
      api_access: true,
      bulk_operations: true,
      custom_integrations: true
    },
    features: [
      { name: 'All Business features', included: true },
      { name: 'Unlimited everything', included: true },
      { name: 'On-premise deployment', included: true },
      { name: 'Custom SLA', included: true },
      { name: 'Dedicated infrastructure', included: true },
      { name: 'White-glove onboarding', included: true }
    ]
  }
];

/**
 * Custom hook for fetching subscription plans
 * 
 * @returns Object containing plans data, loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * const { plans, loading, error, refetch } = useSubscriptionPlans();
 * 
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} onRetry={refetch} />;
 * 
 * return <PlanGrid plans={plans} />;
 * ```
 */
export const useSubscriptionPlans = (): UseSubscriptionPlansReturn => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch plans from API with error handling and fallback
   */
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Attempt to fetch from API
      const response = await subscriptionsService.getPlans();
      setPlans(response);
    } catch (err) {
      console.error('Failed to fetch subscription plans:', err);
      setError('Failed to load subscription plans');
      
      // Use fallback plans when API fails
      setPlans(fallbackPlans);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refetch function for manual retry
   */
  const refetch = async () => {
    await fetchPlans();
  };

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    error,
    refetch
  };
};