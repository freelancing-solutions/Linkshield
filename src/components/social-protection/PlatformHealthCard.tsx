/**
 * @fileoverview Platform Health Card Component
 * 
 * Displays algorithm health metrics for a specific social media platform including
 * visibility score, engagement quality, penalty indicators, and shadow-ban risk.
 * Provides detailed metrics visualization and trend indicators.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Heart, 
  Shield,
  ExternalLink,
  RefreshCw,
  Info
} from 'lucide-react';
import { ConnectedPlatform, AlgorithmHealthMetrics } from '@/types/social-protection';
import { getPlatformIcon, getPlatformColor } from '@/lib/utils/social-protection';
import { cn } from '@/lib/utils';

interface PlatformHealthCardProps {
  /** Platform data with health metrics */
  platform: ConnectedPlatform & { health?: AlgorithmHealthMetrics };
  /** Loading state */
  isLoading?: boolean;
  /** Click handler for detailed view */
  onViewDetails?: (platformId: string) => void;
  /** Click handler for refresh metrics */
  onRefresh?: (platformId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get health score color based on score value
 */
const getHealthScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get health score background color for progress bars
 */
const getHealthScoreBackground = (score: number): string => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

/**
 * Get trend icon based on trend value
 */
const getTrendIcon = (trend: number) => {
  if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <div className="h-4 w-4" />; // Empty space for neutral trend
};

/**
 * Get penalty status badge
 */
const getPenaltyBadge = (hasPenalty: boolean, penaltyType?: string) => {
  if (!hasPenalty) {
    return (
      <Badge variant="outline" className="text-green-600 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        No Penalties
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      <AlertTriangle className="h-3 w-3 mr-1" />
      {penaltyType || 'Penalty Detected'}
    </Badge>
  );
};

/**
 * Get shadow-ban risk badge
 */
const getShadowBanBadge = (risk: 'low' | 'medium' | 'high') => {
  const config = {
    low: { variant: 'outline' as const, color: 'text-green-600 border-green-200', label: 'Low Risk' },
    medium: { variant: 'secondary' as const, color: 'text-yellow-600', label: 'Medium Risk' },
    high: { variant: 'destructive' as const, color: '', label: 'High Risk' }
  };

  const { variant, color, label } = config[risk];

  return (
    <Badge variant={variant} className={color}>
      <Shield className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
};

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded" />
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
    </CardContent>
  </Card>
);

/**
 * PlatformHealthCard Component
 * 
 * Displays comprehensive algorithm health metrics for a connected social media platform.
 * Shows visibility score, engagement quality, penalty status, and shadow-ban risk with
 * visual indicators and trend analysis.
 * 
 * Features:
 * - Real-time health metrics display
 * - Color-coded progress indicators
 * - Trend analysis with directional icons
 * - Penalty and shadow-ban status badges
 * - Detailed view and refresh actions
 * - Loading states with skeleton placeholders
 * - Responsive design
 * 
 * @param props - Component props
 * @returns JSX element representing the platform health card
 * 
 * Requirements: 4.1, 4.2, 4.3 - Algorithm health monitoring
 */
export const PlatformHealthCard: React.FC<PlatformHealthCardProps> = ({
  platform,
  isLoading = false,
  onViewDetails,
  onRefresh,
  className
}) => {
  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  const PlatformIcon = getPlatformIcon(platform.platform);
  const platformColor = getPlatformColor(platform.platform);
  const health = platform.health;

  // Show basic card if no health data
  if (!health) {
    return (
      <Card className={cn('transition-all duration-200 hover:shadow-md', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded', platformColor)}>
                <PlatformIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">{platform.name}</CardTitle>
                <p className="text-xs text-muted-foreground">@{platform.username}</p>
              </div>
            </div>
            <Badge variant="secondary">No Data</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Health metrics not available. Connect platform to start monitoring.
          </p>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRefresh(platform.id)}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Health
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('transition-all duration-200 hover:shadow-md', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded', platformColor)}>
              <PlatformIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{platform.name}</CardTitle>
              <p className="text-xs text-muted-foreground">@{platform.username}</p>
            </div>
          </div>
          <Badge 
            variant={health.overall_score >= 70 ? 'default' : health.overall_score >= 50 ? 'secondary' : 'destructive'}
          >
            {health.overall_score}% Health
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Health Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Visibility Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">Visibility</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn('text-xs font-medium', getHealthScoreColor(health.visibility_score))}>
                  {health.visibility_score}%
                </span>
                {getTrendIcon(health.visibility_trend)}
              </div>
            </div>
            <Progress 
              value={health.visibility_score} 
              className="h-2"
            />
          </div>

          {/* Engagement Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">Engagement</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn('text-xs font-medium', getHealthScoreColor(health.engagement_quality))}>
                  {health.engagement_quality}%
                </span>
                {getTrendIcon(health.engagement_trend)}
              </div>
            </div>
            <Progress 
              value={health.engagement_quality} 
              className="h-2"
            />
          </div>

          {/* Reach Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">Reach</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn('text-xs font-medium', getHealthScoreColor(health.reach_score))}>
                  {health.reach_score}%
                </span>
                {getTrendIcon(health.reach_trend)}
              </div>
            </div>
            <Progress 
              value={health.reach_score} 
              className="h-2"
            />
          </div>

          {/* Content Performance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Info className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">Content</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn('text-xs font-medium', getHealthScoreColor(health.content_performance))}>
                  {health.content_performance}%
                </span>
                {getTrendIcon(health.content_trend)}
              </div>
            </div>
            <Progress 
              value={health.content_performance} 
              className="h-2"
            />
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {getPenaltyBadge(health.has_penalty, health.penalty_type)}
          {getShadowBanBadge(health.shadowban_risk)}
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated {new Date(health.last_updated).toLocaleDateString()}</span>
          <div className="flex gap-1">
            {onRefresh && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRefresh(platform.id)}
                className="h-6 px-2"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
            {onViewDetails && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onViewDetails(platform.id)}
                className="h-6 px-2"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformHealthCard;