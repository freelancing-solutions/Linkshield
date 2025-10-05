'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Crown, 
  TrendingUp, 
  Zap, 
  Shield, 
  Star,
  Check,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  hasFeatureAccess, 
  getRequiredPlan, 
  getUpgradeFeatures,
  FEATURE_CATEGORIES,
  type Feature,
  type SubscriptionPlan 
} from '@/lib/utils/dashboard/feature-gating';
import type { SubscriptionPlan as PlanType, SubscriptionStatus } from '@/types/homepage';

// ============================================================================
// Types
// ============================================================================

export type UpgradeCTAVariant = 'banner' | 'modal' | 'inline' | 'card';

export interface UpgradeCTAProps {
  /** The feature that requires an upgrade */
  feature?: Feature;
  /** Current user's subscription plan */
  currentPlan: PlanType;
  /** Current subscription status */
  currentStatus?: SubscriptionStatus;
  /** Display variant */
  variant?: UpgradeCTAVariant;
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
  /** Show plan comparison table */
  showComparison?: boolean;
  /** Callback when CTA is dismissed (for modal/banner variants) */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Plan Configuration
// ============================================================================

const PLAN_CONFIG = {
  FREE: {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: 'bg-gray-100 text-gray-800',
    icon: null,
    popular: false,
  },
  BASIC: {
    name: 'Basic',
    price: '$9.99',
    period: 'month',
    color: 'bg-blue-100 text-blue-800',
    icon: <Shield className="h-4 w-4" />,
    popular: false,
  },
  PRO: {
    name: 'Pro',
    price: '$29.99',
    period: 'month',
    color: 'bg-purple-100 text-purple-800',
    icon: <Crown className="h-4 w-4" />,
    popular: true,
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    color: 'bg-amber-100 text-amber-800',
    icon: <Sparkles className="h-4 w-4" />,
    popular: false,
  },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the next recommended plan for upgrade
 */
function getRecommendedPlan(currentPlan: PlanType, feature?: Feature): PlanType {
  if (feature) {
    const requiredPlan = getRequiredPlan(feature);
    if (requiredPlan) return requiredPlan;
  }
  
  // Default upgrade path
  switch (currentPlan) {
    case 'FREE': return 'BASIC';
    case 'BASIC': return 'PRO';
    case 'PRO': return 'ENTERPRISE';
    case 'ENTERPRISE': return 'ENTERPRISE'; // Already at top tier
  }
}

/**
 * Get feature category for a specific feature
 */
function getFeatureCategory(feature: Feature) {
  for (const [key, category] of Object.entries(FEATURE_CATEGORIES)) {
    if (category.features.includes(feature)) {
      return category;
    }
  }
  return null;
}

/**
 * Get benefits for upgrading to a specific plan
 */
function getPlanBenefits(targetPlan: PlanType): string[] {
  switch (targetPlan) {
    case 'BASIC':
      return [
        'Comprehensive URL scanning',
        'Basic algorithm health monitoring',
        'Advanced dashboard analytics',
        'Export scan history',
        'Email support',
      ];
    case 'PRO':
      return [
        'Deep URL analysis with AI',
        'Batch URL processing',
        'Full social protection suite',
        'Real-time crisis alerts',
        'Custom reports & data export',
        'Bot health management',
        'Priority support',
      ];
    case 'ENTERPRISE':
      return [
        'All Pro features',
        'White-label solution',
        'Custom integrations',
        'Advanced security features',
        'Team collaboration tools',
        'Dedicated account manager',
        'SLA guarantee',
      ];
    default:
      return [];
  }
}

// ============================================================================
// Component Variants
// ============================================================================

/**
 * Banner variant - full width alert-style CTA
 */
const BannerVariant: React.FC<UpgradeCTAProps> = ({
  feature,
  currentPlan,
  title,
  description,
  onDismiss,
}) => {
  const recommendedPlan = getRecommendedPlan(currentPlan, feature);
  const planConfig = PLAN_CONFIG[recommendedPlan];
  const category = feature ? getFeatureCategory(feature) : null;

  return (
    <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <Crown className="h-4 w-4 text-purple-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {title || `Upgrade to ${planConfig.name} to unlock ${category?.name || 'premium features'}`}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description || `Get access to ${category?.description || 'advanced features'} and more.`}
          </p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <Button asChild size="sm">
            <Link href="/pricing">
              Upgrade Now
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

/**
 * Inline variant - compact CTA for embedding in components
 */
const InlineVariant: React.FC<UpgradeCTAProps> = ({
  feature,
  currentPlan,
  title,
  description,
}) => {
  const recommendedPlan = getRecommendedPlan(currentPlan, feature);
  const planConfig = PLAN_CONFIG[recommendedPlan];
  const category = feature ? getFeatureCategory(feature) : null;

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
          <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {title || `${category?.name || 'Premium Feature'} - ${planConfig.name} Required`}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {description || `Upgrade to access ${category?.description || 'this feature'}`}
          </p>
        </div>
      </div>
      <Button asChild size="sm" variant="outline">
        <Link href="/pricing">
          <TrendingUp className="mr-2 h-3 w-3" />
          Upgrade
        </Link>
      </Button>
    </div>
  );
};

/**
 * Card variant - full-featured upgrade card with benefits
 */
const CardVariant: React.FC<UpgradeCTAProps> = ({
  feature,
  currentPlan,
  currentStatus = 'ACTIVE',
  title,
  description,
  showComparison = false,
}) => {
  const recommendedPlan = getRecommendedPlan(currentPlan, feature);
  const planConfig = PLAN_CONFIG[recommendedPlan];
  const category = feature ? getFeatureCategory(feature) : null;
  const benefits = getPlanBenefits(recommendedPlan);
  const upgradeFeatures = getUpgradeFeatures(currentPlan, recommendedPlan, currentStatus);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {planConfig.icon}
          <CardTitle className="text-xl">
            {title || `Upgrade to ${planConfig.name}`}
          </CardTitle>
          {planConfig.popular && (
            <Badge className="bg-purple-100 text-purple-800">
              <Star className="mr-1 h-3 w-3" />
              Popular
            </Badge>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {description || `Unlock ${category?.name || 'premium features'} and boost your protection`}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Pricing */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {planConfig.price}
            {planConfig.price !== 'Custom' && (
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                /{planConfig.period}
              </span>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            What you'll get:
          </h4>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* New Features */}
        {upgradeFeatures.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              New features you'll unlock:
            </h4>
            <div className="flex flex-wrap gap-2">
              {upgradeFeatures.slice(0, 6).map((feat, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Zap className="mr-1 h-3 w-3" />
                  {feat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
              {upgradeFeatures.length > 6 && (
                <Badge variant="secondary" className="text-xs">
                  +{upgradeFeatures.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Plan Comparison */}
        {showComparison && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Plan Comparison
            </h4>
            <PlanComparisonTable currentPlan={currentPlan} targetPlan={recommendedPlan} />
          </div>
        )}

        {/* CTA Button */}
        <Button asChild className="w-full" size="lg">
          <Link href="/pricing">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to {planConfig.name}
          </Link>
        </Button>

        {/* Additional Info */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          30-day money-back guarantee • Cancel anytime • Instant activation
        </p>
      </CardContent>
    </Card>
  );
};

/**
 * Modal variant - overlay modal for upgrade prompts
 */
const ModalVariant: React.FC<UpgradeCTAProps> = (props) => {
  // For now, render as card variant
  // In a real implementation, this would be wrapped in a modal/dialog
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full">
        <CardVariant {...props} />
      </div>
    </div>
  );
};

// ============================================================================
// Plan Comparison Table
// ============================================================================

interface PlanComparisonTableProps {
  currentPlan: PlanType;
  targetPlan: PlanType;
}

const PlanComparisonTable: React.FC<PlanComparisonTableProps> = ({
  currentPlan,
  targetPlan,
}) => {
  const features = [
    { name: 'URL Checks', current: '10/hour', target: 'Unlimited' },
    { name: 'Deep Scanning', current: '✗', target: '✓' },
    { name: 'Batch Analysis', current: '✗', target: '✓' },
    { name: 'Social Protection', current: 'Basic', target: 'Full Suite' },
    { name: 'Custom Reports', current: '✗', target: '✓' },
    { name: 'Priority Support', current: '✗', target: '✓' },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-900 dark:text-white">
              Feature
            </th>
            <th className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
              {PLAN_CONFIG[currentPlan].name}
            </th>
            <th className="px-3 py-2 text-center font-medium text-purple-600 dark:text-purple-400">
              {PLAN_CONFIG[targetPlan].name}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {features.map((feature, index) => (
            <tr key={index}>
              <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                {feature.name}
              </td>
              <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">
                {feature.current}
              </td>
              <td className="px-3 py-2 text-center text-purple-600 dark:text-purple-400 font-medium">
                {feature.target}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * UpgradeCTA Component
 * 
 * Displays contextual upgrade prompts based on feature access and subscription plans.
 * Supports multiple variants for different use cases.
 * 
 * Requirements: 10.2 - Feature gating upgrade prompts
 */
export const UpgradeCTA: React.FC<UpgradeCTAProps> = ({
  variant = 'card',
  ...props
}) => {
  // Don't show CTA if user already has access to the feature
  if (props.feature && hasFeatureAccess(props.feature, props.currentPlan, props.currentStatus)) {
    return null;
  }

  switch (variant) {
    case 'banner':
      return <BannerVariant {...props} />;
    case 'inline':
      return <InlineVariant {...props} />;
    case 'modal':
      return <ModalVariant {...props} />;
    case 'card':
    default:
      return <CardVariant {...props} />;
  }
};

export default UpgradeCTA;