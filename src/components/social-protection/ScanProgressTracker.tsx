/**
 * Scan Progress Tracker Component
 * 
 * Displays real-time progress tracking for social media platform scans
 * with visual progress indicators, status updates, and completion notifications.
 * 
 * Features:
 * - Real-time progress updates via WebSocket and polling
 * - Visual progress bar and percentage display
 * - Status indicators with appropriate colors
 * - Estimated time remaining
 * - Cancel scan functionality
 * - Error handling and retry options
 * - Accessibility support
 */

import React, { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertCircleIcon,
  ClockIcon,
  RefreshCwIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useScanProgress } from '@/hooks/social-protection/use-real-time';
import { socialProtectionService } from '@/services/social-protection.service';
import { formatSocialDate, formatDuration } from '@/utils/social-protection/date-format';
import { cn } from '@/lib/utils';
import type { PlatformScan } from '@/types/social-protection';

/**
 * Scan status configuration
 */
const SCAN_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: ClockIcon,
  },
  running: {
    label: 'Scanning',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: RefreshCwIcon,
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircleIcon,
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircleIcon,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: StopIcon,
  },
  paused: {
    label: 'Paused',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: PauseIcon,
  },
} as const;

/**
 * Props for the ScanProgressTracker component
 */
export interface ScanProgressTrackerProps {
  /** Scan ID to track */
  scanId: string;
  /** Additional CSS classes */
  className?: string;
  /** Show detailed progress information */
  showDetails?: boolean;
  /** Show control buttons */
  showControls?: boolean;
  /** Compact display mode */
  compact?: boolean;
  /** Callback when scan completes */
  onComplete?: (scan: PlatformScan) => void;
  /** Callback when scan fails */
  onError?: (scan: PlatformScan, error?: string) => void;
  /** Callback when scan is cancelled */
  onCancel?: (scan: PlatformScan) => void;
}

/**
 * Scan progress tracker component
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function ScanProgressTracker({
  scanId,
  className,
  showDetails = true,
  showControls = true,
  compact = false,
  onComplete,
  onError,
  onCancel,
}: ScanProgressTrackerProps) {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const { progress, isPolling, isComplete, isFailed } = useScanProgress(scanId);

  // Track scan start time
  useEffect(() => {
    if (progress?.status === 'running' && !startTime) {
      setStartTime(new Date(progress.started_at || Date.now()));
    }
  }, [progress?.status, progress?.started_at, startTime]);

  // Handle completion callbacks
  useEffect(() => {
    if (progress) {
      if (isComplete && onComplete) {
        onComplete(progress);
      } else if (isFailed && onError) {
        onError(progress, progress.error_message);
      }
    }
  }, [progress, isComplete, isFailed, onComplete, onError]);

  /**
   * Handle scan cancellation
   */
  const handleCancel = async () => {
    if (!progress || isActionLoading) return;
    
    setIsActionLoading(true);
    setActionError(null);
    
    try {
      await socialProtectionService.cancelScan(scanId);
      
      if (onCancel) {
        onCancel(progress);
      }
    } catch (error) {
      setActionError('Failed to cancel scan');
      console.error('Cancel scan error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Handle scan retry
   */
  const handleRetry = async () => {
    if (!progress || isActionLoading) return;
    
    setIsActionLoading(true);
    setActionError(null);
    
    try {
      await socialProtectionService.retryScan(scanId);
      setStartTime(new Date());
    } catch (error) {
      setActionError('Failed to retry scan');
      console.error('Retry scan error:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Calculate estimated time remaining
   */
  const getEstimatedTimeRemaining = (): string | null => {
    if (!progress || !startTime || progress.status !== 'running') {
      return null;
    }

    const elapsed = Date.now() - startTime.getTime();
    const progressPercent = progress.progress || 0;
    
    if (progressPercent <= 0) {
      return null;
    }

    const estimatedTotal = (elapsed / progressPercent) * 100;
    const remaining = estimatedTotal - elapsed;
    
    if (remaining <= 0) {
      return 'Almost done';
    }

    return formatDuration(remaining);
  };

  /**
   * Get progress percentage
   */
  const getProgressPercentage = (): number => {
    if (!progress) return 0;
    
    // Handle different status states
    switch (progress.status) {
      case 'completed':
        return 100;
      case 'failed':
      case 'cancelled':
        return progress.progress || 0;
      case 'running':
        return Math.min(progress.progress || 0, 99); // Never show 100% until completed
      case 'pending':
      default:
        return 0;
    }
  };

  /**
   * Get status configuration
   */
  const getStatusConfig = () => {
    if (!progress) {
      return SCAN_STATUS_CONFIG.pending;
    }
    
    return SCAN_STATUS_CONFIG[progress.status] || SCAN_STATUS_CONFIG.pending;
  };

  if (!progress) {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <div className="flex items-center gap-2 text-gray-500">
          <RefreshCwIcon className="h-4 w-4 animate-spin" />
          <span>Loading scan progress...</span>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const progressPercentage = getProgressPercentage();
  const estimatedTime = getEstimatedTimeRemaining();

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        {/* Status Badge */}
        <Badge variant="outline" className={cn('gap-1', statusConfig.color)}>
          <StatusIcon className={cn('h-3 w-3', progress.status === 'running' && 'animate-spin')} />
          <span className="text-xs">{statusConfig.label}</span>
        </Badge>

        {/* Progress Bar */}
        <div className="flex-1 min-w-0">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Percentage */}
        <span className="text-sm font-medium text-gray-600 min-w-0">
          {Math.round(progressPercentage)}%
        </span>

        {/* Controls */}
        {showControls && progress.status === 'running' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isActionLoading}
            className="h-6 w-6 p-0"
          >
            <StopIcon className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <StatusIcon className={cn('h-5 w-5', progress.status === 'running' && 'animate-spin')} />
            Scan Progress
          </CardTitle>
          
          <Badge variant="outline" className={cn('gap-2', statusConfig.color)}>
            <span className="font-medium">{statusConfig.label}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Details */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Platform:</span>
              <span className="ml-2 font-medium capitalize">{progress.platform}</span>
            </div>
            
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium capitalize">{progress.scan_type}</span>
            </div>
            
            {progress.started_at && (
              <div>
                <span className="text-gray-600">Started:</span>
                <span className="ml-2 font-medium">
                  {formatSocialDate(progress.started_at, { format: 'relative' })}
                </span>
              </div>
            )}
            
            {estimatedTime && (
              <div>
                <span className="text-gray-600">ETA:</span>
                <span className="ml-2 font-medium">{estimatedTime}</span>
              </div>
            )}
            
            {progress.items_processed !== undefined && progress.total_items !== undefined && (
              <div>
                <span className="text-gray-600">Items:</span>
                <span className="ml-2 font-medium">
                  {progress.items_processed} / {progress.total_items}
                </span>
              </div>
            )}
            
            {progress.completed_at && (
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-medium">
                  {formatSocialDate(progress.completed_at, { format: 'relative' })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Real-time Indicator */}
        {isPolling && progress.status === 'running' && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Real-time updates active</span>
          </div>
        )}

        {/* Error Message */}
        {progress.error_message && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{progress.error_message}</AlertDescription>
          </Alert>
        )}

        {/* Action Error */}
        {actionError && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        {showControls && (
          <div className="flex items-center gap-2 pt-2">
            {progress.status === 'running' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isActionLoading}
                className="gap-2"
              >
                <StopIcon className="h-4 w-4" />
                Cancel
              </Button>
            )}
            
            {(progress.status === 'failed' || progress.status === 'cancelled') && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isActionLoading}
                className="gap-2"
              >
                <RefreshCwIcon className={cn('h-4 w-4', isActionLoading && 'animate-spin')} />
                Retry
              </Button>
            )}
            
            {progress.status === 'completed' && progress.results_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(progress.results_url, '_blank')}
                className="gap-2"
              >
                <TrendingUpIcon className="h-4 w-4" />
                View Results
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Multiple scan progress tracker component
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function MultipleScanProgressTracker({
  scanIds,
  className,
  onAllComplete,
}: {
  scanIds: string[];
  className?: string;
  onAllComplete?: () => void;
}) {
  const [completedScans, setCompletedScans] = useState<Set<string>>(new Set());

  const handleScanComplete = (scanId: string) => {
    setCompletedScans(prev => {
      const newSet = new Set(prev);
      newSet.add(scanId);
      
      // Check if all scans are complete
      if (newSet.size === scanIds.length && onAllComplete) {
        onAllComplete();
      }
      
      return newSet;
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {scanIds.map(scanId => (
        <ScanProgressTracker
          key={scanId}
          scanId={scanId}
          compact
          showControls={false}
          onComplete={() => handleScanComplete(scanId)}
        />
      ))}
      
      {/* Overall Progress */}
      <div className="pt-2 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium">
            {completedScans.size} / {scanIds.length} completed
          </span>
        </div>
        <Progress 
          value={(completedScans.size / scanIds.length) * 100} 
          className="h-2 mt-2" 
        />
      </div>
    </div>
  );
}