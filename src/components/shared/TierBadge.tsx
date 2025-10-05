/**
 * TierBadge Component
 * 
 * Displays a visual badge for subscription plan tiers with appropriate styling
 * and optional features like popularity indicators and upgrade prompts.
 */

'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, Building, Rocket, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

import { PlanTier } from '@/types/subscription.types';

export interface TierBadgeProps {
  /** The plan tier to display */
  tier: PlanTier;
  /** Whether this is the user's current plan */
  current?: boolean;
  /** Whether this plan is marked as popular */
  popular?: boolean;
  /** Whether this plan is recommended for the user */
  recommended?: boolean;
  /** Size variant of the badge */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the tier icon */
  showIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Configuration for each plan tier including colors, icons, and labels
 */
const TIER_CONFIG = {
  [PlanTier.FREE]: {
    label: 'Free',
    icon: Shield,
    colors: {
      badge: 'bg-gray-100 text-gray-800 border-gray-200',
      current: 'bg-gray-200 text-gray-900 border-gray-300',
      popular: 'bg-gray-100 text-gray-800 border-gray-300',
      recommended: 'bg-gray-100 text-gray-800 border-gray-400'
    }
  },
  [PlanTier.STARTER]: {
    label: 'Starter',
    icon: Zap,
    colors: {
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      current: 'bg-blue-200 text-blue-900 border-blue-300',
      popular: 'bg-blue-100 text-blue-800 border-blue-300',
      recommended: 'bg-blue-100 text-blue-800 border-blue-400'
    }
  },
  [PlanTier.CREATOR]: {
    label: 'Creator',
    icon: Star,
    colors: {
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      current: 'bg-purple-200 text-purple-900 border-purple-300',
      popular: 'bg-purple-100 text-purple-800 border-purple-300',
      recommended: 'bg-purple-100 text-purple-800 border-purple-400'
    }
  },
  [PlanTier.PROFESSIONAL]: {
    label: 'Professional',
    icon: Crown,
    colors: {
      badge: 'bg-green-100 text-green-800 border-green-200',
      current: 'bg-green-200 text-green-900 border-green-300',
      popular: 'bg-green-100 text-green-800 border-green-300',
      recommended: 'bg-green-100 text-green-800 border-green-400'
    }
  },
  [PlanTier.BUSINESS]: {
    label: 'Business',
    icon: Building,
    colors: {
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      current: 'bg-orange-200 text-orange-900 border-orange-300',
      popular: 'bg-orange-100 text-orange-800 border-orange-300',
      recommended: 'bg-orange-100 text-orange-800 border-orange-400'
    }
  },
  [PlanTier.ENTERPRISE]: {
    label: 'Enterprise',
    icon: Rocket,
    colors: {
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      current: 'bg-indigo-200 text-indigo-900 border-indigo-300',
      popular: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      recommended: 'bg-indigo-100 text-indigo-800 border-indigo-400'
    }
  }
} as const;

/**
 * Size configurations for the badge
 */
const SIZE_CONFIG = {
  sm: {
    badge: 'text-xs px-2 py-1',
    icon: 'h-3 w-3'
  },
  md: {
    badge: 'text-sm px-3 py-1',
    icon: 'h-4 w-4'
  },
  lg: {
    badge: 'text-base px-4 py-2',
    icon: 'h-5 w-5'
  }
} as const;

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  current = false,
  popular = false,
  recommended = false,
  size = 'md',
  showIcon = true,
  className
}) => {
  const config = TIER_CONFIG[tier];
  const sizeConfig = SIZE_CONFIG[size];
  const IconComponent = config.icon;

  // Determine the appropriate color scheme based on state
  let colorScheme = config.colors.badge;
  if (current) {
    colorScheme = config.colors.current;
  } else if (recommended) {
    colorScheme = config.colors.recommended;
  } else if (popular) {
    colorScheme = config.colors.popular;
  }

  return (
    <div className="flex items-center gap-1">
      <Badge
        className={cn(
          'font-semibold border transition-colors',
          colorScheme,
          sizeConfig.badge,
          className
        )}
      >
        {showIcon && (
          <IconComponent className={cn('mr-1', sizeConfig.icon)} />
        )}
        {config.label}
      </Badge>
      
      {/* Additional indicators */}
      <div className="flex items-center gap-1">
        {current && (
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs border-current',
              size === 'sm' ? 'px-1 py-0' : 'px-2 py-0'
            )}
          >
            Current
          </Badge>
        )}
        
        {popular && !current && (
          <Badge 
            variant="secondary" 
            className={cn(
              'text-xs bg-yellow-100 text-yellow-800 border-yellow-200',
              size === 'sm' ? 'px-1 py-0' : 'px-2 py-0'
            )}
          >
            Popular
          </Badge>
        )}
        
        {recommended && !current && (
          <Badge 
            variant="secondary" 
            className={cn(
              'text-xs bg-emerald-100 text-emerald-800 border-emerald-200',
              size === 'sm' ? 'px-1 py-0' : 'px-2 py-0'
            )}
          >
            Recommended
          </Badge>
        )}
      </div>
    </div>
  );
};

/**
 * Utility function to get tier badge color for external use
 */
export const getTierBadgeColor = (tier: PlanTier): string => {
  return TIER_CONFIG[tier].colors.badge;
};

/**
 * Utility function to get tier label for external use
 */
export const getTierLabel = (tier: PlanTier): string => {
  return TIER_CONFIG[tier].label;
};

/**
 * Utility function to get tier icon component for external use
 */
export const getTierIcon = (tier: PlanTier) => {
  return TIER_CONFIG[tier].icon;
};