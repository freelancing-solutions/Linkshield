'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  Shield,
  MessageSquare,
  Activity,
  Eye,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Lock,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCrisisAlerts, useResolveCrisisAlert } from '@/hooks/dashboard';
import { useSubscriptionInfo } from '@/hooks/homepage';
import { hasFeatureAccess } from '@/lib/utils/dashboard/feature-gating';
import { UpgradeCTA } from './UpgradeCTA';
import { formatDate } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import type { CrisisAlert, CrisisSeverity, CrisisType } from '@/types/dashboard';

interface CrisisAlertsPanelProps {
  className?: string;
  onViewRecommendations?: (alert: CrisisAlert) => void;
}

/**
 * Crisis Alerts Panel Component
 * 
 * Displays crisis alerts with severity distribution chart and alerts list.
 * Provides quick resolve actions and view recommendations functionality.
 * 
 * Features:
 * - Severity distribution visualization
 * - Crisis alerts list with filtering
 * - Quick resolve actions
 * - View recommendations button
 * - Real-time updates
 */
export function CrisisAlertsPanel({ 
  className,
  onViewRecommendations 
}: CrisisAlertsPanelProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<CrisisSeverity | 'all'>('all');
  
  // Fetch crisis alerts
  const { data: alerts, isLoading, error } = useCrisisAlerts({
    severity: selectedSeverity === 'all' ? undefined : selectedSeverity,
    resolved: false, // Only show active alerts
  });

  // Subscription and feature access
  const { subscription } = useSubscriptionInfo();
  const currentPlan = subscription?.plan || 'FREE';
  const currentStatus = subscription?.status || 'INACTIVE';
  const hasCrisisAccess = hasFeatureAccess('CRISIS_MANAGEMENT', currentPlan, currentStatus);
  const hasRecommendationsAccess = hasFeatureAccess('CRISIS_RECOMMENDATIONS', currentPlan, currentStatus);

  const resolveAlert = useResolveCrisisAlert();

  /**
   * Handle quick resolve action
   */
  const handleQuickResolve = async (alert: CrisisAlert) => {
    try {
      await resolveAlert.mutateAsync({
        alertId: alert.id,
        data: {
          resolution_notes: 'Quick resolved from crisis alerts panel',
          actions_taken: ['Acknowledged', 'Monitoring'],
        },
      });
      toast.success('Crisis alert resolved successfully');
    } catch (error) {
      console.error('Failed to resolve crisis alert:', error);
      toast.error('Failed to resolve crisis alert');
    }
  };

  /**
   * Get crisis type icon
   */
  const getTypeIcon = (type: CrisisType) => {
    switch (type) {
      case 'reputation':
        return <Shield className="h-4 w-4" />;
      case 'security':
        return <AlertTriangle className="h-4 w-4" />;
      case 'misinformation':
        return <MessageSquare className="h-4 w-4" />;
      case 'engagement':
        return <Activity className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  /**
   * Get severity badge variant
   */
  const getSeverityBadgeVariant = (severity: CrisisSeverity) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  /**
   * Get severity color for distribution chart
   */
  const getSeverityColor = (severity: CrisisSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  /**
   * Calculate severity distribution
   */
  const getSeverityDistribution = () => {
    if (!alerts) return [];

    const distribution = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<CrisisSeverity, number>);

    const total = alerts.length;
    const severityOrder: CrisisSeverity[] = ['critical', 'high', 'medium', 'low'];

    return severityOrder.map(severity => ({
      severity,
      count: distribution[severity] || 0,
      percentage: total > 0 ? ((distribution[severity] || 0) / total) * 100 : 0,
    }));
  };

  const severityDistribution = getSeverityDistribution();

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Crisis Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Crisis Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load crisis alerts. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!alerts || alerts.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Crisis Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Active Crises</h3>
            <p className="text-sm text-muted-foreground">
              All clear! No crisis alerts detected at this time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Crisis Alerts
            <Badge variant="outline">{alerts.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedSeverity('all')}
              className={selectedSeverity === 'all' ? 'bg-accent' : ''}
            >
              All
            </Button>
            {(['critical', 'high', 'medium', 'low'] as CrisisSeverity[]).map(severity => (
              <Button
                key={severity}
                variant="outline"
                size="sm"
                onClick={() => setSelectedSeverity(severity)}
                className={`capitalize ${selectedSeverity === severity ? 'bg-accent' : ''}`}
              >
                {severity}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Severity Distribution Chart */}
        <div>
          <h4 className="text-sm font-medium mb-3">Severity Distribution</h4>
          <div className="space-y-2">
            {severityDistribution.map(({ severity, count, percentage }) => (
              <div key={severity} className="flex items-center gap-3">
                <div className="w-16 text-xs capitalize font-medium">
                  {severity}
                </div>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getSeverityColor(severity)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-12 text-xs text-muted-foreground text-right">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crisis Alerts List */}
        <div>
          <h4 className="text-sm font-medium mb-3">Active Alerts</h4>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">{getTypeIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-sm">{alert.title}</h5>
                        <Badge
                          variant={getSeverityBadgeVariant(alert.severity)}
                          className="capitalize"
                        >
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(alert.detected_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Impact: {alert.impact_score}/100
                        </div>
                        {alert.affected_platforms.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {alert.affected_platforms.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickResolve(alert)}
                    disabled={resolveAlert.isPending || !hasCrisisAccess}
                  >
                    {!hasCrisisAccess ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <Lock className="h-3 w-3 mr-1" />
                              Upgrade Required
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Crisis management requires Pro plan or higher</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Quick Resolve
                      </>
                    )}
                  </Button>
                  {onViewRecommendations && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewRecommendations(alert)}
                      disabled={!hasRecommendationsAccess}
                    >
                      {!hasRecommendationsAccess ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <Lock className="h-3 w-3 mr-1" />
                                Upgrade Required
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Crisis recommendations require Pro plan or higher</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <>
                          <FileText className="h-3 w-3 mr-1" />
                          View Recommendations
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}