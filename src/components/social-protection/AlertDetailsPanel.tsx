/**
 * @fileoverview Alert Details Panel Component
 * 
 * Displays comprehensive crisis alert details including signals, AI summary,
 * recommendations, and management actions. Provides detailed analysis and
 * actionable insights for alert resolution.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  Eye,
  CheckCircle,
  X,
  Clock,
  ExternalLink,
  Flag,
  Brain,
  TrendingUp,
  Users,
  MessageSquare,
  Share2,
  Download,
  RefreshCw,
  ChevronRight,
  Info,
  Zap,
  Target
} from 'lucide-react';
import { CrisisAlert, AlertSeverity, AlertStatus, AlertSignal, AlertRecommendation } from '@/types/social-protection';
import { getPlatformIcon, getPlatformColor } from '@/lib/utils/social-protection';
import { cn } from '@/lib/utils';

interface AlertDetailsPanelProps {
  /** Crisis alert data */
  alert: CrisisAlert;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Alert resolve handler */
  onResolve?: (alertId: string) => void;
  /** Alert dismiss handler */
  onDismiss?: (alertId: string) => void;
  /** Alert investigate handler */
  onInvestigate?: (alertId: string) => void;
  /** Alert share handler */
  onShare?: (alert: CrisisAlert) => void;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Close panel handler */
  onClose?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Severity configuration
 */
const SEVERITY_CONFIG: Record<AlertSeverity, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  critical: {
    label: 'Critical',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    icon: AlertTriangle
  },
  high: {
    label: 'High',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-900',
    icon: AlertTriangle
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-900',
    icon: Shield
  },
  low: {
    label: 'Low',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    icon: Shield
  }
};

/**
 * Status configuration
 */
const STATUS_CONFIG: Record<AlertStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  active: {
    label: 'Active',
    variant: 'destructive',
    color: 'text-red-600',
    icon: AlertTriangle
  },
  investigating: {
    label: 'Investigating',
    variant: 'secondary',
    color: 'text-blue-600',
    icon: Eye
  },
  resolved: {
    label: 'Resolved',
    variant: 'outline',
    color: 'text-green-600',
    icon: CheckCircle
  },
  dismissed: {
    label: 'Dismissed',
    variant: 'outline',
    color: 'text-gray-600',
    icon: X
  }
};

/**
 * Signal type configuration
 */
const SIGNAL_TYPE_CONFIG: Record<string, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = {
  engagement_drop: {
    label: 'Engagement Drop',
    icon: TrendingUp,
    color: 'text-red-600'
  },
  reach_limitation: {
    label: 'Reach Limitation',
    icon: Users,
    color: 'text-orange-600'
  },
  content_warning: {
    label: 'Content Warning',
    icon: Flag,
    color: 'text-yellow-600'
  },
  spam_detection: {
    label: 'Spam Detection',
    icon: Shield,
    color: 'text-purple-600'
  },
  shadow_ban: {
    label: 'Shadow Ban',
    icon: Eye,
    color: 'text-gray-600'
  },
  algorithm_change: {
    label: 'Algorithm Change',
    icon: Zap,
    color: 'text-blue-600'
  }
};

/**
 * Get relative time string
 */
const getRelativeTime = (date: string): string => {
  const now = new Date();
  const alertDate = new Date(date);
  const diffMs = now.getTime() - alertDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return alertDate.toLocaleDateString();
};

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded" />
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
    
    <Skeleton className="h-32 w-full" />
    
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  </div>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Alert Details</h3>
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
 * Signal item component
 */
const SignalItem: React.FC<{ signal: AlertSignal }> = ({ signal }) => {
  const config = SIGNAL_TYPE_CONFIG[signal.type] || {
    label: signal.type,
    icon: Flag,
    color: 'text-gray-600'
  };
  const SignalIcon = config.icon;

  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
      <div className={cn('p-2 rounded-md bg-gray-100', config.color)}>
        <SignalIcon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{config.label}</h4>
          <span className="text-xs text-gray-500">{getRelativeTime(signal.detected_at)}</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{signal.description}</p>
        {signal.confidence && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Confidence:</span>
            <Badge variant="outline" className="text-xs">
              {Math.round(signal.confidence * 100)}%
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Recommendation item component
 */
const RecommendationItem: React.FC<{ recommendation: AlertRecommendation }> = ({ recommendation }) => {
  const priorityColors = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-orange-600 bg-orange-50 border-orange-200',
    low: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  return (
    <div className={cn('p-4 rounded-lg border', priorityColors[recommendation.priority])}>
      <div className="flex items-start gap-3">
        <Target className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium mb-2">{recommendation.title}</h4>
          <p className="text-sm mb-3">{recommendation.description}</p>
          {recommendation.action_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={recommendation.action_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Take Action
              </a>
            </Button>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          {recommendation.priority}
        </Badge>
      </div>
    </div>
  );
};

/**
 * AlertDetailsPanel Component
 * 
 * Displays comprehensive crisis alert details with full analysis, signals,
 * AI-generated summary, and actionable recommendations. Provides complete
 * context for alert investigation and resolution.
 * 
 * Features:
 * - Comprehensive alert overview with severity and status
 * - Detailed signal analysis with confidence scores
 * - AI-generated summary and insights
 * - Actionable recommendations with priority levels
 * - Timeline view of alert progression
 * - Export and sharing capabilities
 * - Real-time updates and refresh functionality
 * - Responsive design with tabbed interface
 * - Loading and error states
 * 
 * @param props - Component props
 * @returns JSX element representing the alert details panel
 * 
 * Requirements: 5.2, 5.3 - Crisis alerts detailed view and management
 */
export const AlertDetailsPanel: React.FC<AlertDetailsPanelProps> = ({
  alert,
  isLoading = false,
  error,
  onResolve,
  onDismiss,
  onInvestigate,
  onShare,
  onRefresh,
  onClose,
  className
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <LoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={onRefresh} />;
  }

  const severityConfig = SEVERITY_CONFIG[alert.severity];
  const statusConfig = STATUS_CONFIG[alert.status];
  const PlatformIcon = getPlatformIcon(alert.platform);
  const platformColor = getPlatformColor(alert.platform);
  const SeverityIcon = severityConfig.icon;
  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn('p-3 rounded-lg', platformColor)}>
            <PlatformIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SeverityIcon className={cn('h-5 w-5', severityConfig.color)} />
              <h1 className="text-xl font-semibold text-gray-900">{alert.alert_type}</h1>
              <Badge variant={statusConfig.variant}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="capitalize">{alert.platform}</span>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{getRelativeTime(alert.created_at)}</span>
              <span>•</span>
              <Badge variant="outline" className={severityConfig.color}>
                {severityConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onShare && (
            <Button variant="outline" size="sm" onClick={() => onShare(alert)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Alert Description */}
      <Card className={cn(severityConfig.bgColor, severityConfig.borderColor)}>
        <CardContent className="p-6">
          <p className={cn('text-base', severityConfig.textColor)}>{alert.description}</p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {alert.status === 'active' && (
        <div className="flex items-center gap-3">
          {onInvestigate && (
            <Button onClick={() => onInvestigate(alert.id)} className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Mark as Investigating
            </Button>
          )}
          {onResolve && (
            <Button onClick={() => onResolve(alert.id)} variant="outline" className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve Alert
            </Button>
          )}
          {onDismiss && (
            <Button onClick={() => onDismiss(alert.id)} variant="outline" className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="signals">
            Signals {alert.signals && `(${alert.signals.length})`}
          </TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Alert Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Alert ID</label>
                  <p className="text-sm text-gray-900 font-mono">{alert.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">{new Date(alert.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Platform</label>
                  <p className="text-sm text-gray-900 capitalize">{alert.platform}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-sm text-gray-900">{alert.alert_type}</p>
                </div>
              </div>
              
              {alert.metadata && (
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Additional Information</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(alert.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Detection Signals
                {alert.signals && (
                  <Badge variant="outline">{alert.signals.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alert.signals && alert.signals.length > 0 ? (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {alert.signals.map((signal, index) => (
                      <SignalItem key={index} signal={signal} />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <Flag className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No signals available for this alert.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Analysis & Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alert.ai_summary ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Summary</h4>
                    <p className="text-sm text-blue-800">{alert.ai_summary}</p>
                  </div>
                  
                  {alert.confidence_score && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Confidence Score:</span>
                      <Badge variant="outline">
                        {Math.round(alert.confidence_score * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">AI analysis is being generated...</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alert.recommendations && alert.recommendations.length > 0 ? (
                <div className="space-y-4">
                  {alert.recommendations.map((recommendation, index) => (
                    <RecommendationItem key={index} recommendation={recommendation} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No specific recommendations available.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    General actions are available in the alert header.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertDetailsPanel;