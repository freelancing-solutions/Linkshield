/**
 * @fileoverview Trend Indicators Component
 * 
 * Displays trend analysis and indicators for algorithm health metrics.
 * Shows directional trends, percentage changes, and visual indicators
 * for various social media platform health metrics.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Eye, 
  Heart, 
  Users, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw
} from 'lucide-react';
import { AlgorithmHealthTrend, TrendPeriod } from '@/types/social-protection';
import { cn } from '@/lib/utils';

interface TrendIndicatorsProps {
  /** Trend data for different metrics */
  trends: AlgorithmHealthTrend[];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Period for trend calculation */
  period?: TrendPeriod;
  /** Show detailed view */
  showDetails?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Metric configuration with icons and colors
 */
const METRICS_CONFIG = {
  visibility_score: {
    label: 'Visibility',
    icon: Eye,
    description: 'How visible your content is to your audience'
  },
  engagement_quality: {
    label: 'Engagement',
    icon: Heart,
    description: 'Quality and rate of audience interactions'
  },
  reach_score: {
    label: 'Reach',
    icon: Users,
    description: 'Number of unique users seeing your content'
  },
  content_performance: {
    label: 'Content',
    icon: BarChart3,
    description: 'Overall performance of your content'
  },
  overall_score: {
    label: 'Overall Health',
    icon: CheckCircle,
    description: 'Combined health score across all metrics'
  }
} as const;

/**
 * Get trend icon based on direction and significance
 */
const getTrendIcon = (direction: 'up' | 'down' | 'stable', isSignificant: boolean) => {
  const iconClass = cn(
    'h-4 w-4',
    isSignificant ? 'opacity-100' : 'opacity-60'
  );

  switch (direction) {
    case 'up':
      return <TrendingUp className={cn(iconClass, 'text-green-600')} />;
    case 'down':
      return <TrendingDown className={cn(iconClass, 'text-red-600')} />;
    case 'stable':
      return <Minus className={cn(iconClass, 'text-gray-500')} />;
  }
};

/**
 * Get trend color based on direction and significance
 */
const getTrendColor = (direction: 'up' | 'down' | 'stable', isSignificant: boolean) => {
  if (!isSignificant) return 'text-gray-500';
  
  switch (direction) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    case 'stable':
      return 'text-gray-600';
  }
};

/**
 * Get trend badge variant
 */
const getTrendBadge = (direction: 'up' | 'down' | 'stable', isSignificant: boolean) => {
  if (!isSignificant) {
    return { variant: 'secondary' as const, label: 'Stable' };
  }

  switch (direction) {
    case 'up':
      return { variant: 'default' as const, label: 'Improving' };
    case 'down':
      return { variant: 'destructive' as const, label: 'Declining' };
    case 'stable':
      return { variant: 'secondary' as const, label: 'Stable' };
  }
};

/**
 * Format percentage change
 */
const formatPercentageChange = (change: number): string => {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

/**
 * Get significance level description
 */
const getSignificanceDescription = (isSignificant: boolean, change: number): string => {
  if (!isSignificant) return 'Minor change';
  
  const absChange = Math.abs(change);
  if (absChange >= 20) return 'Major change';
  if (absChange >= 10) return 'Significant change';
  return 'Moderate change';
};

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Trends</h3>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

/**
 * Empty state component
 */
const EmptyState: React.FC = () => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
      <BarChart3 className="h-12 w-12 text-gray-400" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Trend Data</h3>
        <p className="text-sm text-gray-500">
          Trend analysis will appear here once sufficient data is collected.
        </p>
      </div>
    </CardContent>
  </Card>
);

/**
 * Individual trend item component
 */
const TrendItem: React.FC<{ 
  trend: AlgorithmHealthTrend; 
  showDetails: boolean;
}> = ({ trend, showDetails }) => {
  const config = METRICS_CONFIG[trend.metric as keyof typeof METRICS_CONFIG];
  if (!config) return null;

  const IconComponent = config.icon;
  const trendIcon = getTrendIcon(trend.direction, trend.is_significant);
  const trendColor = getTrendColor(trend.direction, trend.is_significant);
  const badge = getTrendBadge(trend.direction, trend.is_significant);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <IconComponent className="h-4 w-4 text-gray-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{config.label}</span>
            {trendIcon}
          </div>
          {showDetails && (
            <p className="text-xs text-gray-500 mt-1">{config.description}</p>
          )}
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('font-medium', trendColor)}>
            {formatPercentageChange(trend.percentage_change)}
          </span>
          <Badge variant={badge.variant} className="text-xs">
            {badge.label}
          </Badge>
        </div>
        {showDetails && (
          <div className="text-xs text-gray-500">
            <div>{getSignificanceDescription(trend.is_significant, trend.percentage_change)}</div>
            <div>Current: {trend.current_value.toFixed(1)}%</div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * TrendIndicators Component
 * 
 * Displays comprehensive trend analysis for algorithm health metrics.
 * Shows directional trends, percentage changes, significance indicators,
 * and detailed breakdowns for each metric.
 * 
 * Features:
 * - Visual trend indicators with icons
 * - Percentage change calculations
 * - Significance analysis
 * - Detailed and compact view modes
 * - Color-coded trend directions
 * - Loading and error states
 * - Refresh functionality
 * - Responsive design
 * 
 * @param props - Component props
 * @returns JSX element representing the trend indicators
 * 
 * Requirements: 4.2, 4.3 - Algorithm health trend analysis
 */
export const TrendIndicators: React.FC<TrendIndicatorsProps> = ({
  trends,
  isLoading = false,
  error,
  onRefresh,
  period = '7d',
  showDetails = false,
  className
}) => {
  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={onRefresh} />;
  }

  // Show empty state
  if (!trends || trends.length === 0) {
    return <EmptyState />;
  }

  // Calculate summary statistics
  const improvingCount = trends.filter(t => t.direction === 'up' && t.is_significant).length;
  const decliningCount = trends.filter(t => t.direction === 'down' && t.is_significant).length;
  const stableCount = trends.filter(t => t.direction === 'stable' || !t.is_significant).length;

  const overallTrend = trends.find(t => t.metric === 'overall_score');

  return (
    <Card className={cn('transition-all duration-200', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Trend Analysis</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Changes over the last {period === '24h' ? '24 hours' : period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{improvingCount} Improving</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium">{decliningCount} Declining</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">{stableCount} Stable</span>
          </div>
        </div>

        {/* Overall Trend Highlight */}
        {overallTrend && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Overall Health</span>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(overallTrend.direction, overallTrend.is_significant)}
                <span className={cn('font-bold', getTrendColor(overallTrend.direction, overallTrend.is_significant))}>
                  {formatPercentageChange(overallTrend.percentage_change)}
                </span>
              </div>
            </div>
            {showDetails && (
              <p className="text-sm text-blue-700 mt-2">
                Current score: {overallTrend.current_value.toFixed(1)}% • 
                {getSignificanceDescription(overallTrend.is_significant, overallTrend.percentage_change)}
              </p>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {trends
            .filter(trend => trend.metric !== 'overall_score') // Overall trend shown in header
            .map((trend) => (
              <TrendItem 
                key={trend.metric} 
                trend={trend} 
                showDetails={showDetails}
              />
            ))}
        </div>

        {/* Trend Insights */}
        {showDetails && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-900">Insights</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              {improvingCount > decliningCount && (
                <p>✅ Your metrics are trending positively overall. Keep up the good work!</p>
              )}
              {decliningCount > improvingCount && (
                <p>⚠️ Several metrics are declining. Consider reviewing your content strategy.</p>
              )}
              {improvingCount === decliningCount && stableCount > 0 && (
                <p>📊 Your metrics show mixed trends. Monitor closely for emerging patterns.</p>
              )}
              {trends.some(t => t.is_significant && Math.abs(t.percentage_change) >= 20) && (
                <p>🚨 Significant changes detected. Review recent activity for potential causes.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendIndicators;