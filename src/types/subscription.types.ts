/**
 * @fileoverview Subscription-specific types and enums
 * 
 * Defines types for the six-tier subscription system including plan tiers,
 * feature gating, usage tracking, and upgrade recommendations.
 * 
 * @author LinkShield Team
 * @version 2.0.0
 */

/**
 * Plan tier enumeration for feature gating and comparisons
 */
export enum PlanTier {
  FREE = 0,
  STARTER = 1,
  CREATOR = 2,
  PROFESSIONAL = 3,
  BUSINESS = 4,
  ENTERPRISE = 5
}

/**
 * Feature gate definition for client-side access control
 */
export interface FeatureGate {
  /** Unique feature identifier */
  feature: string;
  /** Minimum required plan tier */
  required_tier: PlanTier;
  /** Associated usage type for limit checking */
  usage_type?: string;
  /** User-friendly description of the requirement */
  description: string;
}

/**
 * Subscription plan card component props
 */
export interface SubscriptionPlanCardProps {
  plan: import('./user.types').SubscriptionPlan;
  currentPlan?: string;
  usage?: import('./user.types').DetailedUsage;
  onUpgrade: (planId: string) => void;
  onPreview: (planId: string) => void;
  showComparison?: boolean;
}

/**
 * Plan comparison grid component props
 */
export interface PlanComparisonGridProps {
  plans: import('./user.types').SubscriptionPlan[];
  currentPlan?: string;
  onSelectPlan: (planId: string) => void;
  showAnnualPricing?: boolean;
}

/**
 * Usage progress panel component props
 */
export interface UsageProgressPanelProps {
  usage: import('./user.types').DetailedUsage;
  limits: import('./user.types').PlanLimits;
  showWarnings?: boolean;
}

/**
 * Tier badge component props
 */
export interface TierBadgeProps {
  tier: PlanTier;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
}

/**
 * Plan feature tooltip component props
 */
export interface PlanFeatureTooltipProps {
  feature: string;
  description: string;
  requiredTier?: PlanTier;
  currentTier?: PlanTier;
}

/**
 * Upgrade recommendation card component props
 */
export interface UpgradeRecommendationCardProps {
  recommendation: import('./user.types').UpgradeRecommendation;
  onUpgrade: (planId: string) => void;
  onDismiss?: () => void;
}

/**
 * Feature gate definitions for client-side enforcement
 */
export const FEATURE_GATES: FeatureGate[] = [
  {
    feature: 'deep_scans',
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
    feature: 'team_collaboration',
    required_tier: PlanTier.PROFESSIONAL,
    description: 'Team features require Professional plan or higher'
  },
  {
    feature: 'api_access',
    required_tier: PlanTier.STARTER,
    usage_type: 'api_calls_per_day',
    description: 'API access requires Starter plan or higher'
  },
  {
    feature: 'custom_integrations',
    required_tier: PlanTier.BUSINESS,
    description: 'Custom integrations available for Business plan and above'
  },
  {
    feature: 'priority_support',
    required_tier: PlanTier.PROFESSIONAL,
    description: 'Priority support available for Professional plan and above'
  },
  {
    feature: 'unlimited_usage',
    required_tier: PlanTier.ENTERPRISE,
    description: 'Unlimited usage is an Enterprise feature'
  }
];

/**
 * Plan tier utility functions
 */
export const PlanTierUtils = {
  /**
   * Get plan tier from plan name
   */
  getTierFromPlan(planName: string): PlanTier {
    switch (planName.toLowerCase()) {
      case 'free': return PlanTier.FREE;
      case 'starter': return PlanTier.STARTER;
      case 'creator': return PlanTier.CREATOR;
      case 'professional': return PlanTier.PROFESSIONAL;
      case 'business': return PlanTier.BUSINESS;
      case 'enterprise': return PlanTier.ENTERPRISE;
      default: return PlanTier.FREE;
    }
  },

  /**
   * Check if user has access to a feature
   */
  hasFeatureAccess(userTier: PlanTier, requiredTier: PlanTier): boolean {
    return userTier >= requiredTier;
  },

  /**
   * Get tier display name
   */
  getTierDisplayName(tier: PlanTier): string {
    switch (tier) {
      case PlanTier.FREE: return 'Free';
      case PlanTier.STARTER: return 'Starter';
      case PlanTier.CREATOR: return 'Creator';
      case PlanTier.PROFESSIONAL: return 'Professional';
      case PlanTier.BUSINESS: return 'Business';
      case PlanTier.ENTERPRISE: return 'Enterprise';
      default: return 'Unknown';
    }
  },

  /**
   * Get tier color class
   */
  getTierColor(tier: PlanTier): string {
    switch (tier) {
      case PlanTier.FREE: return 'text-gray-600 bg-gray-100';
      case PlanTier.STARTER: return 'text-blue-600 bg-blue-100';
      case PlanTier.CREATOR: return 'text-purple-600 bg-purple-100';
      case PlanTier.PROFESSIONAL: return 'text-green-600 bg-green-100';
      case PlanTier.BUSINESS: return 'text-orange-600 bg-orange-100';
      case PlanTier.ENTERPRISE: return 'text-amber-600 bg-amber-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
};

/**
 * Subscription error types
 */
export interface SubscriptionError {
  code: 'TIER_INSUFFICIENT' | 'USAGE_EXCEEDED' | 'PLAN_DEPRECATED' | 'UPGRADE_PREVIEW_FAILED';
  message: string;
  required_plan?: string;
  usage_type?: string;
}