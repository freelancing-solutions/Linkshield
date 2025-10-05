/**
 * Feature Gating Utility
 * 
 * Provides feature access control based on subscription plans.
 * Used to gate premium features and show upgrade prompts.
 * 
 * Requirements: 10.1 - Plan-based feature gating
 */

import type { SubscriptionStatus } from '@/types/homepage';
import { PlanTier, type FeatureGate } from '@/types/subscription.types';

// Map old plan names to new tier system for backward compatibility
type LegacyPlan = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
type NewPlan = 'free' | 'starter' | 'creator' | 'professional' | 'business' | 'enterprise';
export type SubscriptionPlan = LegacyPlan | NewPlan;

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
  | 'bulk_checks'
  
  // Social Protection Features
  | 'social_algorithm_health'
  | 'social_visibility_analysis'
  | 'social_engagement_analysis'
  | 'social_penalty_detection'
  | 'social_automated_monitoring'
  | 'social_custom_alerts'
  | 'social_media_monitoring'
  
  // Dashboard Features
  | 'dashboard_advanced_analytics'
  | 'dashboard_custom_reports'
  | 'dashboard_data_export'
  | 'dashboard_api_integration'
  | 'dashboard_team_collaboration'
  | 'advanced_analytics'
  
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
  
  // Team & Collaboration Features
  | 'team_collaboration'
  | 'team_management'
  | 'multi_user_access'
  
  // General Features
  | 'priority_support'
  | 'white_label'
  | 'custom_integrations'
  | 'advanced_security'
  | 'custom_branding'
  | 'dedicated_support'
  | 'sla_guarantee';

// ============================================================================
// Plan Tier Mapping
// ============================================================================

/**
 * Convert plan name to tier number for comparison
 */
export function planToTier(plan: SubscriptionPlan): PlanTier {
  const planMap: Record<string, PlanTier> = {
    // Legacy plans
    'FREE': PlanTier.FREE,
    'BASIC': PlanTier.STARTER,
    'PRO': PlanTier.PROFESSIONAL,
    'ENTERPRISE': PlanTier.ENTERPRISE,
    // New plans
    'free': PlanTier.FREE,
    'starter': PlanTier.STARTER,
    'creator': PlanTier.CREATOR,
    'professional': PlanTier.PROFESSIONAL,
    'business': PlanTier.BUSINESS,
    'enterprise': PlanTier.ENTERPRISE,
  };
  
  return planMap[plan] ?? PlanTier.FREE;
}

/**
 * Convert tier to plan name
 */
export function tierToPlan(tier: PlanTier): NewPlan {
  const tierMap: Record<PlanTier, NewPlan> = {
    [PlanTier.FREE]: 'free',
    [PlanTier.STARTER]: 'starter',
    [PlanTier.CREATOR]: 'creator',
    [PlanTier.PROFESSIONAL]: 'professional',
    [PlanTier.BUSINESS]: 'business',
    [PlanTier.ENTERPRISE]: 'enterprise',
  };
  
  return tierMap[tier] ?? 'free';
}

// ============================================================================
// Feature Gate Definitions
// ============================================================================

/**
 * Feature gate definitions for client-side enforcement
 * Based on the six-tier subscription system
 */
export const FEATURE_GATES: FeatureGate[] = [
  // Starter tier features
  {
    feature: 'url_deep_scan',
    required_tier: PlanTier.STARTER,
    usage_type: 'deep_scans_per_month',
    description: 'Deep scanning requires Starter plan or higher'
  },
  {
    feature: 'bulk_checks',
    required_tier: PlanTier.STARTER,
    usage_type: 'bulk_checks_per_month',
    description: 'Bulk URL checking requires Starter plan or higher'
  },
  {
    feature: 'url_batch_analysis',
    required_tier: PlanTier.STARTER,
    usage_type: 'bulk_checks_per_month',
    description: 'Batch analysis requires Starter plan or higher'
  },
  
  // Creator tier features
  {
    feature: 'advanced_analytics',
    required_tier: PlanTier.CREATOR,
    description: 'Advanced analytics available for Creator plan and above'
  },
  {
    feature: 'social_media_monitoring',
    required_tier: PlanTier.CREATOR,
    description: 'Social media monitoring is a Creator plan feature'
  },
  {
    feature: 'social_visibility_analysis',
    required_tier: PlanTier.CREATOR,
    description: 'Social visibility analysis requires Creator plan or higher'
  },
  {
    feature: 'social_engagement_analysis',
    required_tier: PlanTier.CREATOR,
    description: 'Social engagement analysis requires Creator plan or higher'
  },
  {
    feature: 'dashboard_custom_reports',
    required_tier: PlanTier.CREATOR,
    description: 'Custom reports available for Creator plan and above'
  },
  
  // Professional tier features
  {
    feature: 'team_collaboration',
    required_tier: PlanTier.PROFESSIONAL,
    description: 'Team features require Professional plan or higher'
  },
  {
    feature: 'social_penalty_detection',
    required_tier: PlanTier.PROFESSIONAL,
    description: 'Penalty detection requires Professional plan or higher'
  },
  {
    feature: 'crisis_real_time_alerts',
    required_tier: PlanTier.PROFESSIONAL,
    description: 'Real-time alerts require Professional plan or higher'
  },
  {
    feature: 'dashboard_data_export',
    required_tier: PlanTier.PROFESSIONAL,
    description: 'Data export requires Professional plan or higher'
  },
  {
    feature: 'url_api_access',
    required_tier: PlanTier.PROFESSIONAL,
    usage_type: 'api_calls_per_day',
    description: 'API access requires Professional plan or higher'
  },
  
  // Business tier features
  {
    feature: 'team_management',
    required_tier: PlanTier.BUSINESS,
    description: 'Team management requires Business plan or higher'
  },
  {
    feature: 'multi_user_access',
    required_tier: PlanTier.BUSINESS,
    description: 'Multi-user access requires Business plan or higher'
  },
  {
    feature: 'social_automated_monitoring',
    required_tier: PlanTier.BUSINESS,
    description: 'Automated monitoring requires Business plan or higher'
  },
  {
    feature: 'dashboard_api_integration',
    required_tier: PlanTier.BUSINESS,
    description: 'API integration requires Business plan or higher'
  },
  {
    feature: 'crisis_automated_response',
    required_tier: PlanTier.BUSINESS,
    description: 'Automated crisis response requires Business plan or higher'
  },
  
  // Enterprise tier features
  {
    feature: 'white_label',
    required_tier: PlanTier.ENTERPRISE,
    description: 'White label features are exclusive to Enterprise plan'
  },
  {
    feature: 'custom_integrations',
    required_tier: PlanTier.ENTERPRISE,
    description: 'Custom integrations are exclusive to Enterprise plan'
  },
  {
    feature: 'advanced_security',
    required_tier: PlanTier.ENTERPRISE,
    description: 'Advanced security features are exclusive to Enterprise plan'
  },
  {
    feature: 'custom_branding',
    required_tier: PlanTier.ENTERPRISE,
    description: 'Custom branding is exclusive to Enterprise plan'
  },
  {
    feature: 'dedicated_support',
    required_tier: PlanTier.ENTERPRISE,
    description: 'Dedicated support is exclusive to Enterprise plan'
  },
  {
    feature: 'sla_guarantee',
    required_tier: PlanTier.ENTERPRISE,
    description: 'SLA guarantee is exclusive to Enterprise plan'
  },
  {
    feature: 'crisis_custom_workflows',
    required_tier: PlanTier.ENTERPRISE,
    description: 'Custom workflows are exclusive to Enterprise plan'
  }
];

/**
 * Legacy plan feature matrix for backward compatibility
 * 
 * Each plan includes all features from lower tiers plus additional features
 */
const LEGACY_PLAN_FEATURES: Record<LegacyPlan, Feature[]> = {
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
 * const canUseBatchAnalysis = hasFeatureAccess('url_batch_analysis', 'professional', 'ACTIVE');
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
    return planToTier(plan) >= PlanTier.FREE && hasFeatureInTier(feature, PlanTier.FREE);
  }
  
  // Trial users get PRO features (Professional tier)
  if (status === 'TRIAL') {
    return hasFeatureInTier(feature, PlanTier.PROFESSIONAL);
  }
  
  // Check if the plan tier includes the feature
  const userTier = planToTier(plan);
  return hasFeatureInTier(feature, userTier);
}

/**
 * Check if a feature is available in a specific tier
 */
function hasFeatureInTier(feature: Feature, tier: PlanTier): boolean {
  const featureGate = FEATURE_GATES.find(gate => gate.feature === feature);
  
  // If no gate is defined, feature is available to all tiers
  if (!featureGate) {
    return true;
  }
  
  // Check if user's tier meets the requirement
  return tier >= featureGate.required_tier;
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
  // For legacy plans, use the old feature matrix
  if (isLegacyPlan(plan)) {
    return LEGACY_PLAN_FEATURES[plan as LegacyPlan] || [];
  }
  
  const userTier = planToTier(plan);
  const availableFeatures: Feature[] = [];
  
  // Add all features that are available to this tier or lower
  for (const gate of FEATURE_GATES) {
    if (userTier >= gate.required_tier) {
      availableFeatures.push(gate.feature as Feature);
    }
  }
  
  // Add features that don't have gates (available to all)
  const gatedFeatures = new Set(FEATURE_GATES.map(gate => gate.feature));
  const allFeatures: Feature[] = [
    'url_comprehensive_scan', 'url_history_export', 'social_algorithm_health',
    'dashboard_advanced_analytics', 'bot_health_monitoring', 'bot_health_restart',
    'bot_health_logs', 'priority_support', 'social_custom_alerts'
  ];
  
  for (const feature of allFeatures) {
    if (!gatedFeatures.has(feature)) {
      availableFeatures.push(feature);
    }
  }
  
  return [...new Set(availableFeatures)]; // Remove duplicates
}

/**
 * Get the minimum required plan tier for a specific feature
 * 
 * @param feature - The feature to check
 * @returns The minimum plan tier required, or null if no restriction
 */
export function getRequiredTier(feature: Feature): PlanTier | null {
  const featureGate = FEATURE_GATES.find(gate => gate.feature === feature);
  return featureGate?.required_tier ?? null;
}

/**
 * Get the minimum plan required for a feature
 * 
 * @param feature - The feature to check
 * @returns The minimum plan that includes the feature, or null if not found
 */
export function getRequiredPlan(feature: Feature): NewPlan | null {
  const requiredTier = getRequiredTier(feature);
  return requiredTier !== null ? tierToPlan(requiredTier) : null;
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
  const currentFeatures = new Set(getPlanFeatures(currentPlan, currentStatus));
  const targetFeatures = getPlanFeatures(targetPlan, 'ACTIVE');
  
  return targetFeatures.filter(feature => !currentFeatures.has(feature));
}

/**
 * Check if a plan is higher tier than another
 * 
 * @param plan1 - First plan to compare
 * @param plan2 - Second plan to compare
 * @returns true if plan1 is higher tier than plan2
 */
export function isPlanHigherTier(plan1: SubscriptionPlan, plan2: SubscriptionPlan): boolean {
  return planToTier(plan1) > planToTier(plan2);
}

/**
 * Check if a plan is a legacy plan
 */
function isLegacyPlan(plan: SubscriptionPlan): plan is LegacyPlan {
  return ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'].includes(plan);
}

/**
 * Get feature gate information for a specific feature
 * 
 * @param feature - The feature to get gate info for
 * @returns FeatureGate object or null if no gate exists
 */
export function getFeatureGate(feature: Feature): FeatureGate | null {
  return FEATURE_GATES.find(gate => gate.feature === feature) ?? null;
}

/**
 * Check if a user can access a feature and get gate information
 * 
 * @param feature - The feature to check
 * @param plan - The user's subscription plan
 * @param status - The user's subscription status
 * @returns Object with access status and gate information
 */
export function checkFeatureAccess(
  feature: Feature,
  plan: SubscriptionPlan,
  status: SubscriptionStatus = 'ACTIVE'
): {
  hasAccess: boolean;
  gate: FeatureGate | null;
  requiredTier: PlanTier | null;
  requiredPlan: NewPlan | null;
} {
  const hasAccess = hasFeatureAccess(feature, plan, status);
  const gate = getFeatureGate(feature);
  const requiredTier = getRequiredTier(feature);
  const requiredPlan = getRequiredPlan(feature);
  
  return {
    hasAccess,
    gate,
    requiredTier,
    requiredPlan
  };
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
  BULK_CHECKS_ENABLED: true,
  
  // Social Protection
  ALGORITHM_HEALTH_ENABLED: true,
  VISIBILITY_ANALYSIS_ENABLED: true,
  ENGAGEMENT_ANALYSIS_ENABLED: true,
  PENALTY_DETECTION_ENABLED: true,
  AUTOMATED_MONITORING_ENABLED: true,
  SOCIAL_MEDIA_MONITORING_ENABLED: true,
  
  // Dashboard
  ADVANCED_ANALYTICS_ENABLED: true,
  CUSTOM_REPORTS_ENABLED: true,
  DATA_EXPORT_ENABLED: true,
  API_INTEGRATION_ENABLED: true,
  TEAM_COLLABORATION_ENABLED: true,
  
  // Team Features
  TEAM_MANAGEMENT_ENABLED: true,
  MULTI_USER_ACCESS_ENABLED: true,
  
  // Crisis Management
  REAL_TIME_ALERTS_ENABLED: true,
  AUTOMATED_RESPONSE_ENABLED: true,
  CUSTOM_WORKFLOWS_ENABLED: true,
  
  // Bot Health
  BOT_HEALTH_ENABLED: true,
  BOT_RESTART_ENABLED: true,
  BOT_LOGS_ENABLED: true,
  BOT_CUSTOM_ALERTS_ENABLED: true,
  
  // Enterprise Features
  WHITE_LABEL_ENABLED: true,
  CUSTOM_INTEGRATIONS_ENABLED: true,
  ADVANCED_SECURITY_ENABLED: true,
  CUSTOM_BRANDING_ENABLED: true,
  DEDICATED_SUPPORT_ENABLED: true,
  SLA_GUARANTEE_ENABLED: true,
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
    bulk_checks: 'BULK_CHECKS_ENABLED',
    social_algorithm_health: 'ALGORITHM_HEALTH_ENABLED',
    social_visibility_analysis: 'VISIBILITY_ANALYSIS_ENABLED',
    social_engagement_analysis: 'ENGAGEMENT_ANALYSIS_ENABLED',
    social_penalty_detection: 'PENALTY_DETECTION_ENABLED',
    social_automated_monitoring: 'AUTOMATED_MONITORING_ENABLED',
    social_media_monitoring: 'SOCIAL_MEDIA_MONITORING_ENABLED',
    dashboard_advanced_analytics: 'ADVANCED_ANALYTICS_ENABLED',
    advanced_analytics: 'ADVANCED_ANALYTICS_ENABLED',
    dashboard_custom_reports: 'CUSTOM_REPORTS_ENABLED',
    dashboard_data_export: 'DATA_EXPORT_ENABLED',
    dashboard_api_integration: 'API_INTEGRATION_ENABLED',
    dashboard_team_collaboration: 'TEAM_COLLABORATION_ENABLED',
    team_collaboration: 'TEAM_COLLABORATION_ENABLED',
    team_management: 'TEAM_MANAGEMENT_ENABLED',
    multi_user_access: 'MULTI_USER_ACCESS_ENABLED',
    crisis_real_time_alerts: 'REAL_TIME_ALERTS_ENABLED',
    crisis_automated_response: 'AUTOMATED_RESPONSE_ENABLED',
    crisis_custom_workflows: 'CUSTOM_WORKFLOWS_ENABLED',
    bot_health_monitoring: 'BOT_HEALTH_ENABLED',
    bot_health_restart: 'BOT_RESTART_ENABLED',
    bot_health_logs: 'BOT_LOGS_ENABLED',
    bot_health_custom_alerts: 'BOT_CUSTOM_ALERTS_ENABLED',
    white_label: 'WHITE_LABEL_ENABLED',
    custom_integrations: 'CUSTOM_INTEGRATIONS_ENABLED',
    advanced_security: 'ADVANCED_SECURITY_ENABLED',
    custom_branding: 'CUSTOM_BRANDING_ENABLED',
    dedicated_support: 'DEDICATED_SUPPORT_ENABLED',
    sla_guarantee: 'SLA_GUARANTEE_ENABLED',
  };
  
  const flagKey = featureFlagMap[feature];
  if (!flagKey) {
    // If no flag is defined, feature is enabled by default
    return true;
  }
  
  return isFeatureFlagEnabled(flagKey);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get all available plan tiers
 */
export function getAllPlanTiers(): PlanTier[] {
  return [
    PlanTier.FREE,
    PlanTier.STARTER,
    PlanTier.CREATOR,
    PlanTier.PROFESSIONAL,
    PlanTier.BUSINESS,
    PlanTier.ENTERPRISE
  ];
}

/**
 * Get plan tier display name
 */
export function getPlanTierName(tier: PlanTier): string {
  const tierNames: Record<PlanTier, string> = {
    [PlanTier.FREE]: 'Free',
    [PlanTier.STARTER]: 'Starter',
    [PlanTier.CREATOR]: 'Creator',
    [PlanTier.PROFESSIONAL]: 'Professional',
    [PlanTier.BUSINESS]: 'Business',
    [PlanTier.ENTERPRISE]: 'Enterprise'
  };
  
  return tierNames[tier] ?? 'Unknown';
}

/**
 * Get features by category for a specific plan tier
 */
export function getFeaturesByCategory(tier: PlanTier): Record<string, Feature[]> {
  const availableFeatures = new Set(
    FEATURE_GATES
      .filter(gate => tier >= gate.required_tier)
      .map(gate => gate.feature as Feature)
  );
  
  const categorizedFeatures: Record<string, Feature[]> = {};
  
  for (const [categoryKey, category] of Object.entries(FEATURE_CATEGORIES)) {
    categorizedFeatures[categoryKey] = category.features.filter(
      feature => availableFeatures.has(feature as Feature)
    ) as Feature[];
  }
  
  return categorizedFeatures;
}

/**
 * Check if a tier upgrade would unlock new features
 */
export function wouldUpgradeUnlockFeatures(
  currentTier: PlanTier,
  targetTier: PlanTier
): boolean {
  if (targetTier <= currentTier) {
    return false;
  }
  
  return FEATURE_GATES.some(
    gate => gate.required_tier > currentTier && gate.required_tier <= targetTier
  );
}

/**
 * Get the next tier that would unlock new features
 */
export function getNextMeaningfulTier(currentTier: PlanTier): PlanTier | null {
  const allTiers = getAllPlanTiers();
  
  for (const tier of allTiers) {
    if (tier > currentTier && wouldUpgradeUnlockFeatures(currentTier, tier)) {
      return tier;
    }
  }
  
  return null;
}