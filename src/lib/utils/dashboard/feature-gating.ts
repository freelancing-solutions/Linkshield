/**
 * Feature Gating Utility
 * 
 * Provides feature access control based on subscription plans.
 * Used to gate premium features and show upgrade prompts.
 * 
 * Requirements: 10.1 - Plan-based feature gating
 */

import type { SubscriptionPlan, SubscriptionStatus } from '@/types/homepage';

// ============================================================================
// Feature Definitions
// ============================================================================

/**
 * Available features that can be gated by subscription plan
 */
export type Feature = 
  // URL Analysis Features
  | 'url_deep_scan'
  | 'url_batch_analysis'
  | 'url_comprehensive_scan'
  | 'url_history_export'
  | 'url_api_access'
  
  // Social Protection Features
  | 'social_algorithm_health'
  | 'social_visibility_analysis'
  | 'social_engagement_analysis'
  | 'social_penalty_detection'
  | 'social_automated_monitoring'
  | 'social_custom_alerts'
  
  // Dashboard Features
  | 'dashboard_advanced_analytics'
  | 'dashboard_custom_reports'
  | 'dashboard_data_export'
  | 'dashboard_api_integration'
  | 'dashboard_team_collaboration'
  
  // Crisis Management Features
  | 'crisis_real_time_alerts'
  | 'crisis_automated_response'
  | 'crisis_custom_workflows'
  | 'crisis_priority_support'
  
  // Bot Health Features
  | 'bot_health_monitoring'
  | 'bot_health_restart'
  | 'bot_health_logs'
  | 'bot_health_custom_alerts'
  
  // General Features
  | 'priority_support'
  | 'white_label'
  | 'custom_integrations'
  | 'advanced_security';

// ============================================================================
// Plan Feature Matrix
// ============================================================================

/**
 * Feature access matrix by subscription plan
 * 
 * Each plan includes all features from lower tiers plus additional features
 */
const PLAN_FEATURES: Record<SubscriptionPlan, Feature[]> = {
  FREE: [
    // Basic URL checking only
  ],
  
  BASIC: [
    // URL Analysis
    'url_comprehensive_scan',
    'url_history_export',
    
    // Basic Social Protection
    'social_algorithm_health',
    
    // Basic Dashboard
    'dashboard_advanced_analytics',
    
    // Basic Bot Health
    'bot_health_monitoring',
  ],
  
  PRO: [
    // All BASIC features plus:
    'url_comprehensive_scan',
    'url_history_export',
    'social_algorithm_health',
    'dashboard_advanced_analytics',
    'bot_health_monitoring',
    
    // PRO-specific features
    'url_deep_scan',
    'url_batch_analysis',
    'url_api_access',
    'social_visibility_analysis',
    'social_engagement_analysis',
    'social_penalty_detection',
    'social_automated_monitoring',
    'social_custom_alerts',
    'dashboard_custom_reports',
    'dashboard_data_export',
    'crisis_real_time_alerts',
    'bot_health_restart',
    'bot_health_logs',
    'priority_support',
  ],
  
  ENTERPRISE: [
    // All PRO features plus:
    'url_comprehensive_scan',
    'url_history_export',
    'social_algorithm_health',
    'dashboard_advanced_analytics',
    'bot_health_monitoring',
    'url_deep_scan',
    'url_batch_analysis',
    'url_api_access',
    'social_visibility_analysis',
    'social_engagement_analysis',
    'social_penalty_detection',
    'social_automated_monitoring',
    'social_custom_alerts',
    'dashboard_custom_reports',
    'dashboard_data_export',
    'crisis_real_time_alerts',
    'bot_health_restart',
    'bot_health_logs',
    'priority_support',
    
    // ENTERPRISE-specific features
    'social_automated_monitoring',
    'crisis_automated_response',
    'crisis_custom_workflows',
    'crisis_priority_support',
    'dashboard_api_integration',
    'dashboard_team_collaboration',
    'bot_health_custom_alerts',
    'white_label',
    'custom_integrations',
    'advanced_security',
  ],
};

// ============================================================================
// Feature Categories
// ============================================================================

/**
 * Feature categories for organizing upgrade prompts
 */
export const FEATURE_CATEGORIES = {
  URL_ANALYSIS: {
    name: 'URL Analysis',
    description: 'Advanced URL scanning and analysis features',
    features: [
      'url_deep_scan',
      'url_batch_analysis',
      'url_comprehensive_scan',
      'url_history_export',
      'url_api_access',
    ],
  },
  SOCIAL_PROTECTION: {
    name: 'Social Protection',
    description: 'Social media algorithm and account protection',
    features: [
      'social_algorithm_health',
      'social_visibility_analysis',
      'social_engagement_analysis',
      'social_penalty_detection',
      'social_automated_monitoring',
      'social_custom_alerts',
    ],
  },
  DASHBOARD: {
    name: 'Dashboard & Analytics',
    description: 'Advanced dashboard features and analytics',
    features: [
      'dashboard_advanced_analytics',
      'dashboard_custom_reports',
      'dashboard_data_export',
      'dashboard_api_integration',
      'dashboard_team_collaboration',
    ],
  },
  CRISIS_MANAGEMENT: {
    name: 'Crisis Management',
    description: 'Real-time crisis detection and response',
    features: [
      'crisis_real_time_alerts',
      'crisis_automated_response',
      'crisis_custom_workflows',
      'crisis_priority_support',
    ],
  },
  BOT_HEALTH: {
    name: 'Bot Health',
    description: 'Social media bot monitoring and management',
    features: [
      'bot_health_monitoring',
      'bot_health_restart',
      'bot_health_logs',
      'bot_health_custom_alerts',
    ],
  },
} as const;

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Check if a user has access to a specific feature based on their subscription
 * 
 * @param feature - The feature to check access for
 * @param plan - The user's subscription plan
 * @param status - The user's subscription status (optional, defaults to 'ACTIVE')
 * @returns true if the user has access to the feature
 * 
 * @example
 * ```typescript
 * const canUseBatchAnalysis = hasFeatureAccess('url_batch_analysis', 'PRO', 'ACTIVE');
 * if (canUseBatchAnalysis) {
 *   // Show batch analysis feature
 * } else {
 *   // Show upgrade prompt
 * }
 * ```
 */
export function hasFeatureAccess(
  feature: Feature,
  plan: SubscriptionPlan,
  status: SubscriptionStatus = 'ACTIVE'
): boolean {
  // Inactive subscriptions only get FREE features
  if (status !== 'ACTIVE' && status !== 'TRIAL') {
    return PLAN_FEATURES.FREE.includes(feature);
  }
  
  // Trial users get PRO features
  if (status === 'TRIAL') {
    return PLAN_FEATURES.PRO.includes(feature);
  }
  
  // Check if the plan includes the feature
  return PLAN_FEATURES[plan].includes(feature);
}

/**
 * Get all features available for a specific plan
 * 
 * @param plan - The subscription plan
 * @param status - The subscription status (optional, defaults to 'ACTIVE')
 * @returns Array of features available for the plan
 */
export function getPlanFeatures(
  plan: SubscriptionPlan,
  status: SubscriptionStatus = 'ACTIVE'
): Feature[] {
  // Inactive subscriptions only get FREE features
  if (status !== 'ACTIVE' && status !== 'TRIAL') {
    return PLAN_FEATURES.FREE;
  }
  
  // Trial users get PRO features
  if (status === 'TRIAL') {
    return PLAN_FEATURES.PRO;
  }
  
  return PLAN_FEATURES[plan];
}

/**
 * Get the minimum plan required for a feature
 * 
 * @param feature - The feature to check
 * @returns The minimum plan that includes the feature, or null if not found
 */
export function getRequiredPlan(feature: Feature): SubscriptionPlan | null {
  const plans: SubscriptionPlan[] = ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'];
  
  for (const plan of plans) {
    if (PLAN_FEATURES[plan].includes(feature)) {
      return plan;
    }
  }
  
  return null;
}

/**
 * Get features that would be unlocked by upgrading to a specific plan
 * 
 * @param currentPlan - The user's current plan
 * @param targetPlan - The plan to upgrade to
 * @param currentStatus - The user's current subscription status
 * @returns Array of features that would be unlocked
 */
export function getUpgradeFeatures(
  currentPlan: SubscriptionPlan,
  targetPlan: SubscriptionPlan,
  currentStatus: SubscriptionStatus = 'ACTIVE'
): Feature[] {
  const currentFeatures = getPlanFeatures(currentPlan, currentStatus);
  const targetFeatures = getPlanFeatures(targetPlan, 'ACTIVE');
  
  return targetFeatures.filter(feature => !currentFeatures.includes(feature));
}

/**
 * Check if a plan is higher tier than another
 * 
 * @param plan1 - First plan to compare
 * @param plan2 - Second plan to compare
 * @returns true if plan1 is higher tier than plan2
 */
export function isPlanHigherTier(plan1: SubscriptionPlan, plan2: SubscriptionPlan): boolean {
  const planOrder: Record<SubscriptionPlan, number> = {
    FREE: 0,
    BASIC: 1,
    PRO: 2,
    ENTERPRISE: 3,
  };
  
  return planOrder[plan1] > planOrder[plan2];
}

// ============================================================================
// Feature Flags
// ============================================================================

/**
 * Feature flags for enabling/disabling features globally
 * These can be used for A/B testing or gradual rollouts
 */
export const FEATURE_FLAGS = {
  // URL Analysis
  BATCH_ANALYSIS_ENABLED: true,
  DEEP_SCAN_ENABLED: true,
  API_ACCESS_ENABLED: true,
  
  // Social Protection
  ALGORITHM_HEALTH_ENABLED: true,
  VISIBILITY_ANALYSIS_ENABLED: true,
  ENGAGEMENT_ANALYSIS_ENABLED: true,
  PENALTY_DETECTION_ENABLED: true,
  AUTOMATED_MONITORING_ENABLED: true,
  
  // Dashboard
  ADVANCED_ANALYTICS_ENABLED: true,
  CUSTOM_REPORTS_ENABLED: true,
  DATA_EXPORT_ENABLED: true,
  API_INTEGRATION_ENABLED: true,
  TEAM_COLLABORATION_ENABLED: false, // Not yet implemented
  
  // Crisis Management
  REAL_TIME_ALERTS_ENABLED: true,
  AUTOMATED_RESPONSE_ENABLED: false, // Not yet implemented
  CUSTOM_WORKFLOWS_ENABLED: false, // Not yet implemented
  
  // Bot Health
  BOT_HEALTH_ENABLED: true,
  BOT_RESTART_ENABLED: true,
  BOT_LOGS_ENABLED: true,
  
  // Enterprise Features
  WHITE_LABEL_ENABLED: false, // Not yet implemented
  CUSTOM_INTEGRATIONS_ENABLED: false, // Not yet implemented
  ADVANCED_SECURITY_ENABLED: false, // Not yet implemented
} as const;

/**
 * Check if a feature flag is enabled
 * 
 * @param flag - The feature flag to check
 * @returns true if the flag is enabled
 */
export function isFeatureFlagEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag];
}

/**
 * Check if a feature is both accessible by plan and enabled by feature flag
 * 
 * @param feature - The feature to check
 * @param plan - The user's subscription plan
 * @param status - The user's subscription status
 * @returns true if the feature is accessible and enabled
 */
export function isFeatureAvailable(
  feature: Feature,
  plan: SubscriptionPlan,
  status: SubscriptionStatus = 'ACTIVE'
): boolean {
  // First check plan access
  if (!hasFeatureAccess(feature, plan, status)) {
    return false;
  }
  
  // Then check feature flags
  const featureFlagMap: Partial<Record<Feature, keyof typeof FEATURE_FLAGS>> = {
    url_batch_analysis: 'BATCH_ANALYSIS_ENABLED',
    url_deep_scan: 'DEEP_SCAN_ENABLED',
    url_api_access: 'API_ACCESS_ENABLED',
    social_algorithm_health: 'ALGORITHM_HEALTH_ENABLED',
    social_visibility_analysis: 'VISIBILITY_ANALYSIS_ENABLED',
    social_engagement_analysis: 'ENGAGEMENT_ANALYSIS_ENABLED',
    social_penalty_detection: 'PENALTY_DETECTION_ENABLED',
    social_automated_monitoring: 'AUTOMATED_MONITORING_ENABLED',
    dashboard_advanced_analytics: 'ADVANCED_ANALYTICS_ENABLED',
    dashboard_custom_reports: 'CUSTOM_REPORTS_ENABLED',
    dashboard_data_export: 'DATA_EXPORT_ENABLED',
    dashboard_api_integration: 'API_INTEGRATION_ENABLED',
    dashboard_team_collaboration: 'TEAM_COLLABORATION_ENABLED',
    crisis_real_time_alerts: 'REAL_TIME_ALERTS_ENABLED',
    crisis_automated_response: 'AUTOMATED_RESPONSE_ENABLED',
    crisis_custom_workflows: 'CUSTOM_WORKFLOWS_ENABLED',
    bot_health_monitoring: 'BOT_HEALTH_ENABLED',
    bot_health_restart: 'BOT_RESTART_ENABLED',
    bot_health_logs: 'BOT_LOGS_ENABLED',
    white_label: 'WHITE_LABEL_ENABLED',
    custom_integrations: 'CUSTOM_INTEGRATIONS_ENABLED',
    advanced_security: 'ADVANCED_SECURITY_ENABLED',
  };
  
  const flagKey = featureFlagMap[feature];
  if (flagKey) {
    return isFeatureFlagEnabled(flagKey);
  }
  
  // If no feature flag is defined, assume it's enabled
  return true;
}