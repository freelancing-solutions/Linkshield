/**
 * PlanFeatureTooltip Component
 * 
 * Displays detailed information about plan features in a tooltip format.
 * Provides context about feature availability, usage limits, and upgrade requirements.
 */

'use client';

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Lock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanTier } from '@/types/subscription.types';
import { getTierLabel, getTierBadgeColor } from './TierBadge';

export interface PlanFeatureTooltipProps {
  /** The feature name to display */
  featureName: string;
  /** Detailed description of the feature */
  description: string;
  /** Whether the feature is included in the current plan */
  included: boolean;
  /** The minimum tier required for this feature */
  requiredTier?: PlanTier;
  /** The user's current tier */
  currentTier?: PlanTier;
  /** Usage limit information */
  usageLimit?: {
    current: number;
    limit: number;
    unit: string;
  };
  /** Additional feature details */
  details?: string[];
  /** Upgrade action callback */
  onUpgrade?: () => void;
  /** Children to wrap with tooltip */
  children: React.ReactNode;
  /** Tooltip positioning */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Custom styling */
  className?: string;
}

/**
 * Feature status indicator component
 */
const FeatureStatus: React.FC<{
  included: boolean;
  requiredTier?: PlanTier;
  currentTier?: PlanTier;
}> = ({ included, requiredTier, currentTier }) => {
  if (included) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Included</span>
      </div>
    );
  }

  if (requiredTier && currentTier && currentTier < requiredTier) {
    return (
      <div className="flex items-center gap-2 text-orange-600">
        <Lock className="h-4 w-4" />
        <span className="text-sm font-medium">
          Requires {getTierLabel(requiredTier)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-red-600">
      <XCircle className="h-4 w-4" />
      <span className="text-sm font-medium">Not Available</span>
    </div>
  );
};

/**
 * Usage limit display component
 */
const UsageLimitDisplay: React.FC<{
  current: number;
  limit: number;
  unit: string;
}> = ({ current, limit, unit }) => {
  const percentage = limit > 0 ? (current / limit) * 100 : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Usage</span>
        <span className={cn(
          'font-medium',
          isAtLimit ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-gray-900'
        )}>
          {current.toLocaleString()} / {limit === -1 ? '∞' : limit.toLocaleString()} {unit}
        </span>
      </div>
      
      {limit > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all',
              isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-orange-500' : 'bg-green-500'
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
      
      {isNearLimit && (
        <div className="flex items-center gap-1 text-xs text-orange-600">
          <AlertTriangle className="h-3 w-3" />
          <span>
            {isAtLimit ? 'Limit reached' : 'Approaching limit'}
          </span>
        </div>
      )}
    </div>
  );
};

export const PlanFeatureTooltip: React.FC<PlanFeatureTooltipProps> = ({
  featureName,
  description,
  included,
  requiredTier,
  currentTier,
  usageLimit,
  details = [],
  onUpgrade,
  children,
  side = 'top',
  className
}) => {
  const showUpgradeOption = !included && requiredTier && currentTier && currentTier < requiredTier;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className="max-w-sm p-4 space-y-3"
          sideOffset={5}
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-gray-900 leading-tight">
                {featureName}
              </h4>
              <Info className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            </div>
            
            <FeatureStatus 
              included={included}
              requiredTier={requiredTier}
              currentTier={currentTier}
            />
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>

          {/* Usage Limit */}
          {usageLimit && (
            <UsageLimitDisplay
              current={usageLimit.current}
              limit={usageLimit.limit}
              unit={usageLimit.unit}
            />
          )}

          {/* Additional Details */}
          {details.length > 0 && (
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Details
              </h5>
              <ul className="space-y-1">
                {details.map((detail, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Tier Badge */}
          {requiredTier && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Requires:</span>
              <Badge 
                className={cn(
                  'text-xs',
                  getTierBadgeColor(requiredTier)
                )}
              >
                {getTierLabel(requiredTier)}
              </Badge>
            </div>
          )}

          {/* Upgrade Action */}
          {showUpgradeOption && onUpgrade && (
            <div className="pt-2 border-t border-gray-200">
              <Button
                size="sm"
                onClick={onUpgrade}
                className="w-full text-xs"
              >
                <Zap className="h-3 w-3 mr-1" />
                Upgrade to {getTierLabel(requiredTier!)}
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Simplified version for basic feature information
 */
export const SimpleFeatureTooltip: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}> = ({ title, description, children, side = 'top' }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <div className="space-y-1">
            <h4 className="font-medium text-sm">{title}</h4>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};