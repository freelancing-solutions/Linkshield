/**
 * @fileoverview Enhanced Usage Progress Panel Component
 * 
 * Displays detailed usage metrics with progress bars, warnings, and upgrade
 * recommendations. Supports all usage types from the six-tier system with
 * visual indicators for approaching limits.
 * 
 * @author LinkShield Team
 * @version 2.0.0
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  BarChart3, 
  Zap, 
  Search, 
  Users, 
  Database,
  Calendar,
  ArrowUp
} from 'lucide-react';
import type { UsageProgressPanelProps } from '@/types/subscription.types';
import type { DetailedUsage, PlanLimits, LimitWarning } from '@/types/user.types';

/**
 * Usage type configuration with icons and labels
 */
const USAGE_CONFIG = {
  url_checks_per_day: {
    icon: <Search className="h-4 w-4" />,
    label: 'URL Checks',
    unit: 'per day',
    color: 'blue'
  },
  deep_scans_per_month: {
    icon: <BarChart3 className="h-4 w-4" />,
    label: 'Deep Scans',
    unit: 'per month',
    color: 'purple'
  },
  bulk_checks_per_month: {
    icon: <Zap className="h-4 w-4" />,
    label: 'Bulk Checks',
    unit: 'per month',
    color: 'green'
  },
  api_calls_per_day: {
    icon: <Database className="h-4 w-4" />,
    label: 'API Calls',
    unit: 'per day',
    color: 'orange'
  },
  projects_limit: {
    icon: <Users className="h-4 w-4" />,
    label: 'Projects',
    unit: 'total',
    color: 'indigo'
  },
  team_members_limit: {
    icon: <Users className="h-4 w-4" />,
    label: 'Team Members',
    unit: 'total',
    color: 'pink'
  }
};

/**
 * Warning level configuration
 */
const WARNING_CONFIG = {
  info: {
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <TrendingUp className="h-4 w-4" />
  },
  warning: {
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: <AlertTriangle className="h-4 w-4" />
  },
  critical: {
    color: 'bg-red-50 border-red-200 text-red-800',
    icon: <AlertTriangle className="h-4 w-4" />
  }
};

/**
 * Enhanced Usage Progress Panel Component
 * 
 * Displays comprehensive usage tracking with:
 * - Progress bars for all usage types
 * - Warning indicators for approaching limits
 * - Historical usage trends
 * - Upgrade recommendations
 * - Time remaining in current period
 */
export const UsageProgressPanel: React.FC<UsageProgressPanelProps> = ({
  usage,
  limits,
  showWarnings = true
}) => {
  /**
   * Calculate usage percentage
   */
  const calculatePercentage = (current: number, limit: number): number => {
    if (limit === -1) return 0; // Unlimited
    if (limit === 0) return 100; // No allowance
    return Math.min((current / limit) * 100, 100);
  };

  /**
   * Get progress bar color based on usage percentage
   */
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    if (percentage >= 60) return 'bg-blue-500';
    return 'bg-green-500';
  };

  /**
   * Format usage value for display
   */
  const formatUsageValue = (value: number, limit: number): string => {
    if (limit === -1) return `${value.toLocaleString()} / Unlimited`;
    return `${value.toLocaleString()} / ${limit.toLocaleString()}`;
  };

  /**
   * Get current usage for a specific type
   */
  const getCurrentUsage = (usageType: string): number => {
    // This would be populated from the actual usage data
    // For now, we'll use placeholder logic
    const today = usage.daily_usage[usage.daily_usage.length - 1];
    if (!today) return 0;

    switch (usageType) {
      case 'url_checks_per_day':
        return today.url_checks;
      case 'api_calls_per_day':
        return today.api_calls;
      case 'deep_scans_per_month':
        return usage.monthly_usage.reduce((sum, month) => sum + month.deep_scans, 0);
      case 'bulk_checks_per_month':
        return usage.monthly_usage.reduce((sum, month) => sum + month.bulk_checks, 0);
      case 'projects_limit':
        return usage.monthly_usage.reduce((sum, month) => sum + month.projects_created, 0);
      case 'team_members_limit':
        return 1; // Placeholder
      default:
        return 0;
    }
  };

  /**
   * Format time remaining in current period
   */
  const formatTimeRemaining = (): string => {
    const days = usage.current_period.days_remaining;
    if (days === 1) return '1 day remaining';
    if (days < 7) return `${days} days remaining`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks remaining`;
    return `${Math.ceil(days / 30)} months remaining`;
  };

  return (
    <div className="space-y-6">
      {/* Current Period Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Usage Period
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatTimeRemaining()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Period: {new Date(usage.current_period.start_date).toLocaleDateString()} - {new Date(usage.current_period.end_date).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Usage Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(USAGE_CONFIG).map(([usageType, config]) => {
            const limit = limits[usageType as keyof PlanLimits] as number;
            const current = getCurrentUsage(usageType);
            const percentage = calculatePercentage(current, limit);
            const isUnlimited = limit === -1;

            return (
              <div key={usageType} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded bg-${config.color}-100 text-${config.color}-600`}>
                      {config.icon}
                    </div>
                    <span className="font-medium">{config.label}</span>
                    <span className="text-sm text-gray-500">({config.unit})</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatUsageValue(current, limit)}
                    </div>
                    {!isUnlimited && (
                      <div className="text-sm text-gray-500">
                        {percentage.toFixed(1)}% used
                      </div>
                    )}
                  </div>
                </div>
                
                {!isUnlimited && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}

                {isUnlimited && (
                  <div className="text-sm text-green-600 font-medium">
                    ✨ Unlimited usage
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Warnings and Alerts */}
      {showWarnings && usage.approaching_limits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Usage Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {usage.approaching_limits.map((warning: LimitWarning, index) => {
              const config = WARNING_CONFIG[warning.warning_level];
              const usageConfig = USAGE_CONFIG[warning.usage_type as keyof typeof USAGE_CONFIG];
              
              return (
                <Alert key={index} className={config.color}>
                  <div className="flex items-start gap-3">
                    {config.icon}
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="font-medium mb-1">
                          {usageConfig?.label || warning.usage_type} limit approaching
                        </div>
                        <div className="text-sm">
                          You've used {warning.current_usage.toLocaleString()} of {warning.limit.toLocaleString()} 
                          ({warning.percentage_used.toFixed(1)}%) for this period.
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Upgrade Recommendations */}
      {usage.upgrade_recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-blue-500" />
              Upgrade Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {usage.upgrade_recommendations.map((recommendation, index) => (
              <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Upgrade to {recommendation.recommended_plan}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      {recommendation.reason}
                    </p>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      {recommendation.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    {recommendation.estimated_savings && (
                      <div className="mt-2 text-sm font-medium text-green-600">
                        Potential savings: ${recommendation.estimated_savings}/month
                      </div>
                    )}
                  </div>
                  <Button size="sm" className="ml-4">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};