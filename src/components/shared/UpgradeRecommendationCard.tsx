/**
 * UpgradeRecommendationCard Component
 * 
 * Displays intelligent upgrade recommendations based on user usage patterns,
 * plan limits, and feature requirements. Provides compelling reasons to upgrade
 * with clear benefits and pricing information.
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Clock,
  DollarSign,
  Users,
  Shield,
  Sparkles,
  X,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UpgradeRecommendation } from '@/types/user.types';
import type { PlanTier } from '@/types/subscription.types';
import { TierBadge } from './TierBadge';
import { subscriptionsService } from '@/services/subscriptions.service';

export interface UpgradeRecommendationCardProps {
  /** The upgrade recommendation data */
  recommendation: UpgradeRecommendation;
  /** Current subscription ID for upgrade actions */
  subscriptionId: string;
  /** Callback when upgrade is initiated */
  onUpgrade?: (targetPlan: string) => void;
  /** Callback when recommendation is dismissed */
  onDismiss?: (recommendationId: string) => void;
  /** Whether the card can be dismissed */
  dismissible?: boolean;
  /** Custom styling */
  className?: string;
}

/**
 * Recommendation urgency levels with styling
 */
const URGENCY_CONFIG = {
  low: {
    color: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    icon: TrendingUp,
    iconColor: 'text-blue-600'
  },
  medium: {
    color: 'bg-orange-50 border-orange-200',
    badge: 'bg-orange-100 text-orange-800',
    icon: Clock,
    iconColor: 'text-orange-600'
  },
  high: {
    color: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-800',
    icon: AlertTriangle,
    iconColor: 'text-red-600'
  }
} as const;

/**
 * Benefit icon mapping
 */
const BENEFIT_ICONS = {
  'increased_limits': Zap,
  'new_features': Sparkles,
  'better_support': Shield,
  'team_features': Users,
  'cost_savings': DollarSign,
  'default': CheckCircle
} as const;

export const UpgradeRecommendationCard: React.FC<UpgradeRecommendationCardProps> = ({
  recommendation,
  subscriptionId,
  onUpgrade,
  onDismiss,
  dismissible = true,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const urgencyConfig = URGENCY_CONFIG[recommendation.urgency];
  const UrgencyIcon = urgencyConfig.icon;

  /**
   * Handle upgrade preview
   */
  const handlePreview = async () => {
    if (showPreview) {
      setShowPreview(false);
      return;
    }

    setIsLoading(true);
    try {
      const preview = await subscriptionsService.previewUpgrade(
        subscriptionId,
        recommendation.recommended_plan
      );
      setPreviewData(preview);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to preview upgrade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle upgrade action
   */
  const handleUpgrade = () => {
    onUpgrade?.(recommendation.recommended_plan);
  };

  /**
   * Handle dismiss action
   */
  const handleDismiss = () => {
    onDismiss?.(recommendation.id);
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className={cn(
      'relative transition-all duration-200 hover:shadow-md',
      urgencyConfig.color,
      className
    )}>
      {/* Dismiss button */}
      {dismissible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-white/50"
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            'p-2 rounded-lg bg-white/50',
            urgencyConfig.iconColor
          )}>
            <UrgencyIcon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">
                {recommendation.title}
              </CardTitle>
              <Badge className={urgencyConfig.badge}>
                {recommendation.urgency} priority
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600">
              {recommendation.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current vs Recommended Plan */}
        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Current Plan</p>
            <TierBadge 
              tier={recommendation.current_plan as PlanTier} 
              size="sm"
              current
            />
          </div>
          
          <ArrowRight className="h-4 w-4 text-gray-400" />
          
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Recommended</p>
            <TierBadge 
              tier={recommendation.recommended_plan as PlanTier} 
              size="sm"
              recommended
            />
          </div>
        </div>

        {/* Usage Trigger */}
        {recommendation.usage_trigger && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>{recommendation.usage_trigger.feature_name}:</strong>{' '}
              You've used {recommendation.usage_trigger.current_usage} of{' '}
              {recommendation.usage_trigger.limit} ({recommendation.usage_trigger.percentage}%)
            </AlertDescription>
          </Alert>
        )}

        {/* Key Benefits */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Key Benefits of Upgrading:
          </h4>
          <div className="grid gap-2">
            {recommendation.benefits.slice(0, 3).map((benefit, index) => {
              const IconComponent = BENEFIT_ICONS[benefit.type as keyof typeof BENEFIT_ICONS] || BENEFIT_ICONS.default;
              return (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <IconComponent className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{benefit.title}</span>
                    {benefit.description && (
                      <p className="text-gray-600 text-xs mt-0.5">
                        {benefit.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estimated Savings */}
        {recommendation.estimated_savings && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">
                Potential Monthly Savings: {formatCurrency(recommendation.estimated_savings)}
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Based on your current usage patterns
            </p>
          </div>
        )}

        {/* Preview Section */}
        {showPreview && previewData && (
          <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
            <h4 className="text-sm font-medium">Upgrade Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500">Upgrade Cost:</span>
                <p className="font-medium">{formatCurrency(previewData.cost)}</p>
              </div>
              <div>
                <span className="text-gray-500">Prorated Amount:</span>
                <p className="font-medium">{formatCurrency(previewData.prorated_amount)}</p>
              </div>
              <div>
                <span className="text-gray-500">Effective Date:</span>
                <p className="font-medium">
                  {new Date(previewData.effective_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Billing Adjustment:</span>
                <p className="font-medium">{previewData.billing_cycle_adjustment}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handlePreview}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              'Loading...'
            ) : showPreview ? (
              'Hide Preview'
            ) : (
              'Preview Upgrade'
            )}
          </Button>
          
          <Button
            onClick={handleUpgrade}
            size="sm"
            className="flex-1"
          >
            <Zap className="h-3 w-3 mr-1" />
            Upgrade Now
          </Button>
        </div>

        {/* Confidence Score */}
        {recommendation.confidence_score && (
          <div className="pt-2 border-t border-white/50">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Recommendation Confidence</span>
              <span>{Math.round(recommendation.confidence_score * 100)}%</span>
            </div>
            <Progress 
              value={recommendation.confidence_score * 100} 
              className="h-1"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Compact version for smaller spaces
 */
export const CompactUpgradeRecommendationCard: React.FC<
  Omit<UpgradeRecommendationCardProps, 'className'> & { className?: string }
> = ({ recommendation, subscriptionId, onUpgrade, className }) => {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{recommendation.title}</h4>
          <p className="text-xs text-gray-600 mt-1">
            {recommendation.description}
          </p>
        </div>
        
        <Button
          size="sm"
          onClick={() => onUpgrade?.(recommendation.recommended_plan)}
          className="ml-3"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      </div>
    </Card>
  );
};