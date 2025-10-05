'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * TrendIndicator component displays trend direction with icon and optional value
 * 
 * Features:
 * - Visual trend indicators (up, down, stable)
 * - Color-coded icons and text
 * - Optional percentage/value display
 * - Customizable size and styling
 * - Accessible with proper ARIA labels
 */

export type TrendDirection = 'up' | 'down' | 'stable';

export interface TrendIndicatorProps {
  /** The trend direction */
  direction: TrendDirection;
  /** Optional value to display (e.g., percentage, number) */
  value?: string | number;
  /** Optional label for additional context */
  label?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show only the icon */
  iconOnly?: boolean;
  /** Custom className for styling */
  className?: string;
  /** Whether the trend is significant (affects styling intensity) */
  isSignificant?: boolean;
}

/**
 * Get the appropriate icon component for the trend direction
 */
const getTrendIcon = (direction: TrendDirection, size: string) => {
  const iconClass = cn(size, {
    'text-green-600 dark:text-green-400': direction === 'up',
    'text-red-600 dark:text-red-400': direction === 'down',
    'text-gray-500 dark:text-gray-400': direction === 'stable',
  });

  switch (direction) {
    case 'up':
      return <TrendingUp className={iconClass} />;
    case 'down':
      return <TrendingDown className={iconClass} />;
    case 'stable':
      return <Minus className={iconClass} />;
    default:
      return <Minus className={iconClass} />;
  }
};

/**
 * Get text color classes based on trend direction
 */
const getTrendTextColor = (direction: TrendDirection, isSignificant?: boolean) => {
  const baseColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    stable: 'text-gray-500 dark:text-gray-400',
  };

  // If not significant, use muted colors
  if (!isSignificant && direction !== 'stable') {
    return {
      up: 'text-green-500/70 dark:text-green-400/70',
      down: 'text-red-500/70 dark:text-red-400/70',
      stable: 'text-gray-500 dark:text-gray-400',
    }[direction];
  }

  return baseColors[direction];
};

/**
 * Get size classes for icons and text
 */
const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        icon: 'h-3 w-3',
        text: 'text-xs',
        gap: 'gap-1',
      };
    case 'lg':
      return {
        icon: 'h-5 w-5',
        text: 'text-base',
        gap: 'gap-2',
      };
    case 'md':
    default:
      return {
        icon: 'h-4 w-4',
        text: 'text-sm',
        gap: 'gap-1.5',
      };
  }
};

/**
 * Get ARIA label for accessibility
 */
const getAriaLabel = (direction: TrendDirection, value?: string | number, label?: string) => {
  const directionText = {
    up: 'increasing',
    down: 'decreasing',
    stable: 'stable',
  }[direction];

  let ariaLabel = `Trend ${directionText}`;
  
  if (value) {
    ariaLabel += ` by ${value}`;
  }
  
  if (label) {
    ariaLabel += ` ${label}`;
  }

  return ariaLabel;
};

export function TrendIndicator({
  direction,
  value,
  label,
  size = 'md',
  iconOnly = false,
  className,
  isSignificant = true,
}: TrendIndicatorProps) {
  const sizeClasses = getSizeClasses(size);
  const textColor = getTrendTextColor(direction, isSignificant);
  const ariaLabel = getAriaLabel(direction, value, label);

  if (iconOnly) {
    return (
      <span
        className={cn('inline-flex', className)}
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        {getTrendIcon(direction, sizeClasses.icon)}
      </span>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center',
        sizeClasses.gap,
        className
      )}
      aria-label={ariaLabel}
    >
      {getTrendIcon(direction, sizeClasses.icon)}
      
      {value && (
        <span className={cn(sizeClasses.text, textColor, 'font-medium')}>
          {value}
        </span>
      )}
      
      {label && (
        <span className={cn(sizeClasses.text, 'text-muted-foreground')}>
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * Utility function to determine trend direction from numeric values
 */
export const calculateTrendDirection = (
  current: number,
  previous: number,
  threshold: number = 0
): TrendDirection => {
  const change = current - previous;
  
  if (Math.abs(change) <= threshold) {
    return 'stable';
  }
  
  return change > 0 ? 'up' : 'down';
};

/**
 * Utility function to calculate percentage change
 */
export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  
  return ((current - previous) / Math.abs(previous)) * 100;
};

/**
 * Utility function to format trend value with appropriate suffix
 */
export const formatTrendValue = (
  value: number,
  type: 'percentage' | 'number' | 'currency' = 'percentage'
): string => {
  switch (type) {
    case 'percentage':
      return `${Math.abs(value).toFixed(1)}%`;
    case 'currency':
      return `$${Math.abs(value).toLocaleString()}`;
    case 'number':
    default:
      return Math.abs(value).toLocaleString();
  }
};