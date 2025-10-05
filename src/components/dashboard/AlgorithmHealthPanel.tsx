'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  useAlgorithmHealth, 
  useAnalyzeVisibility, 
  useAnalyzeEngagement, 
  useDetectPenalties 
} from '@/hooks/dashboard/use-social-protection';
import { useSubscriptionInfo } from '@/hooks/homepage';
import { hasFeatureAccess } from '@/lib/utils/dashboard/feature-gating';
import { UpgradeCTA } from './UpgradeCTA';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Eye, 
  Heart, 
  AlertTriangle,
  Play,
  ExternalLink,
  Activity,
  Loader2,
  Lock,
  CheckCircle,
  XCircle,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { AnalysisResultsModal } from './AnalysisResultsModal';
import type { HealthMetric, VisibilityAnalysis, EngagementAnalysis, PenaltyDetection } from '@/types/homepage';

// Health status configuration with icons and patterns for accessibility
const HEALTH_STATUS_CONFIG = {
  HEALTHY: {
    variant: 'default' as const,
    icon: CheckCircle,
    label: 'Healthy',
    description: 'All systems operating normally'
  },
  WARNING: {
    variant: 'secondary' as const,
    icon: AlertTriangle,
    label: 'Warning',
    description: 'Some issues detected, monitoring required'
  },
  CRITICAL: {
    variant: 'destructive' as const,
    icon: XCircle,
    label: 'Critical',
    description: 'Immediate attention required'
  }
};

// Metric type configuration with icons for better visual distinction
const METRIC_TYPE_CONFIG = {
  visibility: {
    icon: Eye,
    label: 'Visibility',
    description: 'Content visibility and reach metrics'
  },
  engagement: {
    icon: Heart,
    label: 'Engagement',
    description: 'User interaction and engagement metrics'
  },
  penalties: {
    icon: Shield,
    label: 'Penalties',
    description: 'Algorithm penalties and restrictions'
  }
};

/**
 * AlgorithmHealthPanel Component
 * 
 * Displays algorithm health metrics with mini cards for Visibility, Engagement, and Penalties.
 * Includes trend indicators, run analysis buttons, and health badge.
 * 
 * Features:
 * - Mini cards for each health metric
 * - Trend arrows (up/down/stable)
 * - "Run Analysis" buttons for each metric
 * - Overall health badge
 * - Link to full analysis view
 */
export function AlgorithmHealthPanel() {
  const { data: health, isLoading, error } = useAlgorithmHealth();
  const { subscription } = useSubscriptionInfo();
  const analyzeVisibility = useAnalyzeVisibility();
  const analyzeEngagement = useAnalyzeEngagement();
  const detectPenalties = useDetectPenalties();

  // Feature access checks
  const currentPlan = subscription?.plan || 'FREE';
  const currentStatus = subscription?.status || 'INACTIVE';
  const hasVisibilityAccess = hasFeatureAccess('VISIBILITY_ANALYSIS', currentPlan, currentStatus);
  const hasEngagementAccess = hasFeatureAccess('ENGAGEMENT_ANALYSIS', currentPlan, currentStatus);
  const hasPenaltyAccess = hasFeatureAccess('PENALTY_DETECTION', currentPlan, currentStatus);

  // State for analysis results modal
  const [modalOpen, setModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisibilityAnalysis | EngagementAnalysis | PenaltyDetection | null>(null);
  const [analysisType, setAnalysisType] = useState<'visibility' | 'engagement' | 'penalties'>('visibility');

  // Handle analysis with result display
  const handleAnalyzeVisibility = async () => {
    try {
      const result = await analyzeVisibility.mutateAsync();
      setAnalysisResult(result);
      setAnalysisType('visibility');
      setModalOpen(true);
    } catch (error) {
      // Error is handled by the hook's onError callback
    }
  };

  const handleAnalyzeEngagement = async () => {
    try {
      const result = await analyzeEngagement.mutateAsync();
      setAnalysisResult(result);
      setAnalysisType('engagement');
      setModalOpen(true);
    } catch (error) {
      // Error is handled by the hook's onError callback
    }
  };

  const handleDetectPenalties = async () => {
    try {
      const result = await detectPenalties.mutateAsync();
      setAnalysisResult(result);
      setAnalysisType('penalties');
      setModalOpen(true);
    } catch (error) {
      // Error is handled by the hook's onError callback
    }
  };

  /**
   * Renders a health badge with icon and accessibility features
   * @param status - Health status (HEALTHY, WARNING, CRITICAL)
   * @param className - Additional CSS classes
   * @returns JSX element with accessible health badge
   */
  const renderHealthBadge = (status: keyof typeof HEALTH_STATUS_CONFIG, className?: string) => {
    const config = HEALTH_STATUS_CONFIG[status];
    const Icon = config.icon;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={config.variant} 
              className={className}
              role="status"
              aria-label={`${config.label}: ${config.description}`}
            >
              <Icon className="h-3 w-3 mr-1" aria-hidden="true" />
              {config.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{config.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  /**
   * Renders trend indicator based on metric trend
   */
  const renderTrendIndicator = (trend: HealthMetric['trend']) => {
    switch (trend) {
      case 'UP':
        return <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />;
      case 'DOWN':
        return <TrendingDown className="h-4 w-4 text-red-500" aria-hidden="true" />;
      case 'STABLE':
        return <Minus className="h-4 w-4 text-gray-500" aria-hidden="true" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" aria-hidden="true" />;
    }
  };

  /**
   * Gets health badge color based on overall score
   */
  const getHealthBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'; // Green
    if (score >= 60) return 'secondary'; // Yellow
    return 'destructive'; // Red
  };

  /**
   * Gets health status text based on overall score
   */
  const getHealthStatus = (score: number) => {
    if (score >= 80) return 'Healthy';
    if (score >= 60) return 'Warning';
    return 'Critical';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/10" role="alert">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            <p className="text-sm font-medium">Failed to load algorithm health data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!health) return null;

  return (
    <Card role="region" aria-labelledby="algorithm-health-title">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle id="algorithm-health-title" className="flex items-center gap-2">
              <Activity className="h-5 w-5" aria-hidden="true" />
              Algorithm Health
            </CardTitle>
            <CardDescription>
              Monitor your social media algorithm performance
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={getHealthBadgeVariant(health.overall_score)}
              role="status"
              aria-label={`Algorithm health status: ${getHealthStatus(health.overall_score)} with ${health.overall_score}% score`}
            >
              {getHealthStatus(health.overall_score)} ({health.overall_score}%)
            </Badge>
            <Link href="/dashboard/social-protection/algorithm-health">
              <Button 
                variant="outline" 
                size="sm"
                aria-label="View full algorithm health analysis"
              >
                <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                Full Analysis
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="group" aria-label="Algorithm health metrics">
          {/* Visibility Metric */}
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" aria-hidden="true" />
                  <span className="text-sm font-medium">Visibility</span>
                </div>
                <div aria-label={`Visibility trend: ${health.visibility.trend.toLowerCase()}`}>
                  {renderTrendIndicator(health.visibility.trend)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold" aria-label={`Visibility score: ${health.visibility.score} percent`}>
                  {health.visibility.score}%
                </div>
                <Badge 
                  variant={health.visibility.status === 'HEALTHY' ? 'default' : 
                          health.visibility.status === 'WARNING' ? 'secondary' : 'destructive'}
                  className="text-xs"
                  role="status"
                  aria-label={`Visibility status: ${health.visibility.status}`}
                >
                  {health.visibility.status === 'HEALTHY' && <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />}
                  {health.visibility.status === 'WARNING' && <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />}
                  {health.visibility.status === 'CRITICAL' && <XCircle className="h-3 w-3 mr-1" aria-hidden="true" />}
                  {health.visibility.status}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={handleAnalyzeVisibility}
                disabled={analyzeVisibility.isPending || !hasVisibilityAccess}
                aria-label={!hasVisibilityAccess ? "Visibility analysis requires upgrade" : 
                           analyzeVisibility.isPending ? "Analyzing visibility..." : "Run visibility analysis"}
              >
                {!hasVisibilityAccess ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Lock className="h-3 w-3 mr-2" aria-hidden="true" />
                          Upgrade Required
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Visibility analysis requires Pro plan or higher</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-2" aria-hidden="true" />
                    {analyzeVisibility.isPending ? 'Analyzing...' : 'Run Analysis'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Engagement Metric */}
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" aria-hidden="true" />
                  <span className="text-sm font-medium">Engagement</span>
                </div>
                <div aria-label={`Engagement trend: ${health.engagement.trend.toLowerCase()}`}>
                  {renderTrendIndicator(health.engagement.trend)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold" aria-label={`Engagement score: ${health.engagement.score} percent`}>
                  {health.engagement.score}%
                </div>
                <Badge 
                  variant={health.engagement.status === 'HEALTHY' ? 'default' : 
                          health.engagement.status === 'WARNING' ? 'secondary' : 'destructive'}
                  className="text-xs"
                  role="status"
                  aria-label={`Engagement status: ${health.engagement.status}`}
                >
                  {health.engagement.status === 'HEALTHY' && <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />}
                  {health.engagement.status === 'WARNING' && <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />}
                  {health.engagement.status === 'CRITICAL' && <XCircle className="h-3 w-3 mr-1" aria-hidden="true" />}
                  {health.engagement.status}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={handleAnalyzeEngagement}
                disabled={analyzeEngagement.isPending || !hasEngagementAccess}
                aria-label={!hasEngagementAccess ? "Engagement analysis requires upgrade" : 
                           analyzeEngagement.isPending ? "Analyzing engagement..." : "Run engagement analysis"}
              >
                {!hasEngagementAccess ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Lock className="h-3 w-3 mr-2" aria-hidden="true" />
                          Upgrade Required
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Engagement analysis requires Pro plan or higher</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <>
                    {analyzeEngagement.isPending ? (
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" aria-hidden="true" />
                    ) : (
                      <Play className="h-3 w-3 mr-2" aria-hidden="true" />
                    )}
                    {analyzeEngagement.isPending ? 'Analyzing...' : 'Run Analysis'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Penalties Metric */}
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-500" aria-hidden="true" />
                  <span className="text-sm font-medium">Penalties</span>
                </div>
                <div className="flex items-center gap-1">
                  {health.penalties.detected && (
                    <Badge 
                      variant="destructive" 
                      className="text-xs"
                      role="status"
                      aria-label={`${health.penalties.count} penalties detected`}
                    >
                      {health.penalties.count} detected
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold" aria-label={`Penalties count: ${health.penalties.detected ? health.penalties.count : 0}`}>
                  {health.penalties.detected ? health.penalties.count : 0}
                </div>
                <Badge 
                  variant={health.penalties.severity === 'NONE' ? 'default' : 
                          health.penalties.severity === 'LOW' ? 'secondary' : 'destructive'}
                  className="text-xs"
                  role="status"
                  aria-label={`Penalty severity: ${health.penalties.severity}`}
                >
                  {health.penalties.severity === 'NONE' && <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />}
                  {health.penalties.severity === 'LOW' && <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />}
                  {(health.penalties.severity === 'MEDIUM' || health.penalties.severity === 'HIGH') && <XCircle className="h-3 w-3 mr-1" aria-hidden="true" />}
                  {health.penalties.severity}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={handleDetectPenalties}
                disabled={detectPenalties.isPending || !hasPenaltyAccess}
                aria-label={!hasPenaltyAccess ? "Penalty detection requires upgrade" : 
                           detectPenalties.isPending ? "Detecting penalties..." : "Run penalty detection"}
              >
                {!hasPenaltyAccess ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Lock className="h-3 w-3 mr-2" aria-hidden="true" />
                          Upgrade Required
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Penalty detection requires Pro plan or higher</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <>
                    {detectPenalties.isPending ? (
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" aria-hidden="true" />
                    ) : (
                      <Play className="h-3 w-3 mr-2" aria-hidden="true" />
                    )}
                    {detectPenalties.isPending ? 'Analyzing...' : 'Run Analysis'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Last Analyzed Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
          <span role="status" aria-live="polite">
            Last analyzed: {new Date(health.last_analyzed).toLocaleString()}
          </span>
          <Link 
            href="/dashboard/social-protection/algorithm-health" 
            className="hover:underline"
            aria-label="View detailed algorithm health analysis"
          >
            View detailed analysis →
          </Link>
        </div>
      </CardContent>

      {/* Analysis Results Modal */}
      <AnalysisResultsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        analysisType={analysisType}
        result={analysisResult}
      />
    </Card>
  );
}