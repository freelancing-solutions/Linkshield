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
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { AnalysisResultsModal } from './AnalysisResultsModal';
import type { HealthMetric, VisibilityAnalysis, EngagementAnalysis, PenaltyDetection } from '@/types/homepage';

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
   * Renders trend indicator based on metric trend
   */
  const renderTrendIndicator = (trend: HealthMetric['trend']) => {
    switch (trend) {
      case 'UP':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'DOWN':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'STABLE':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
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
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">Failed to load algorithm health data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!health) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Algorithm Health
            </CardTitle>
            <CardDescription>
              Monitor your social media algorithm performance
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getHealthBadgeVariant(health.overall_score)}>
              {getHealthStatus(health.overall_score)} ({health.overall_score}%)
            </Badge>
            <Link href="/dashboard/social-protection/algorithm-health">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Analysis
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Visibility Metric */}
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Visibility</span>
                </div>
                {renderTrendIndicator(health.visibility.trend)}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{health.visibility.score}%</div>
                <Badge 
                  variant={health.visibility.status === 'HEALTHY' ? 'default' : 
                          health.visibility.status === 'WARNING' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {health.visibility.status}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={handleAnalyzeVisibility}
                disabled={analyzeVisibility.isPending || !hasVisibilityAccess}
              >
                {!hasVisibilityAccess ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Lock className="h-3 w-3 mr-2" />
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
                    <Play className="h-3 w-3 mr-2" />
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
                  <Heart className="h-4 w-4 text-pink-500" />
                  <span className="text-sm font-medium">Engagement</span>
                </div>
                {renderTrendIndicator(health.engagement.trend)}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{health.engagement.score}%</div>
                <Badge 
                  variant={health.engagement.status === 'HEALTHY' ? 'default' : 
                          health.engagement.status === 'WARNING' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {health.engagement.status}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={handleAnalyzeEngagement}
                disabled={analyzeEngagement.isPending || !hasEngagementAccess}
              >
                {!hasEngagementAccess ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Lock className="h-3 w-3 mr-2" />
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
                    <Play className="h-3 w-3 mr-2" />
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
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Penalties</span>
                </div>
                <div className="flex items-center gap-1">
                  {health.penalties.detected && (
                    <Badge variant="destructive" className="text-xs">
                      {health.penalties.count} detected
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {health.penalties.detected ? health.penalties.count : 0}
                </div>
                <Badge 
                  variant={health.penalties.severity === 'NONE' ? 'default' : 
                          health.penalties.severity === 'LOW' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {health.penalties.severity}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={handleDetectPenalties}
                disabled={detectPenalties.isPending || !hasPenaltyAccess}
              >
                {!hasPenaltyAccess ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Lock className="h-3 w-3 mr-2" />
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
                    <Play className="h-3 w-3 mr-2" />
                    {detectPenalties.isPending ? 'Analyzing...' : 'Run Analysis'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Last Analyzed Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
          <span>Last analyzed: {new Date(health.last_analyzed).toLocaleString()}</span>
          <Link href="/dashboard/social-protection/algorithm-health" className="hover:underline">
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