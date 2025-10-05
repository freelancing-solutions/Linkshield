'use client';

/**
 * @fileoverview ScanProgressIndicator Component
 * 
 * Component for displaying real-time scan progress with visual indicators,
 * status updates, and detailed progress information for social media platform scans.
 * 
 * Features:
 * - Real-time progress tracking with percentage and visual progress bar
 * - Step-by-step scan process visualization
 * - Platform-specific scan status indicators
 * - Estimated time remaining calculations
 * - Error handling and retry mechanisms
 * - Cancellation support
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useScanStatus } from '@/hooks/social-protection';
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  X, 
  RefreshCw,
  Shield,
  Search,
  Database,
  BarChart3,
  FileText
} from 'lucide-react';

interface ScanProgressIndicatorProps {
  /** Scan ID to track progress for */
  scanId: string;
  /** Platform being scanned */
  platformId: string;
  /** Callback when scan completes successfully */
  onScanComplete?: (scanId: string, results: any) => void;
  /** Callback when scan fails */
  onScanError?: (scanId: string, error: string) => void;
  /** Callback when scan is cancelled */
  onScanCancel?: (scanId: string) => void;
  /** Whether to show detailed progress steps */
  showDetailedSteps?: boolean;
  /** Whether to allow scan cancellation */
  allowCancel?: boolean;
}

interface ScanStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  progress?: number;
  error?: string;
  estimatedDuration?: number;
}

/**
 * ScanProgressIndicator Component
 * 
 * Displays real-time progress of social media platform scans with:
 * - Overall progress percentage and visual progress bar
 * - Step-by-step scan process breakdown
 * - Platform-specific status indicators
 * - Time estimates and completion predictions
 * - Error handling and retry options
 */
export function ScanProgressIndicator({
  scanId,
  platformId,
  onScanComplete,
  onScanError,
  onScanCancel,
  showDetailedSteps = true,
  allowCancel = true
}: ScanProgressIndicatorProps) {
  // State for scan steps and timing
  const [scanSteps, setScanSteps] = useState<ScanStep[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [estimatedCompletion, setEstimatedCompletion] = useState<Date | null>(null);

  // API hook for scan status
  const { 
    data: scanStatus, 
    isLoading, 
    error,
    refetch 
  } = useScanStatus(scanId, {
    refetchInterval: 2000, // Poll every 2 seconds
    enabled: !!scanId
  });

  // Initialize scan steps and timing
  useEffect(() => {
    if (scanStatus && scanSteps.length === 0) {
      const steps: ScanStep[] = [
        {
          id: 'initialize',
          title: 'Initializing Scan',
          description: 'Setting up scan parameters and authentication',
          status: 'pending',
          estimatedDuration: 5000
        },
        {
          id: 'authenticate',
          title: 'Platform Authentication',
          description: 'Verifying platform credentials and permissions',
          status: 'pending',
          estimatedDuration: 10000
        },
        {
          id: 'collect',
          title: 'Data Collection',
          description: 'Gathering posts, interactions, and engagement metrics',
          status: 'pending',
          estimatedDuration: 30000
        },
        {
          id: 'analyze',
          title: 'Content Analysis',
          description: 'Analyzing content for risks and algorithm patterns',
          status: 'pending',
          estimatedDuration: 20000
        },
        {
          id: 'generate',
          title: 'Report Generation',
          description: 'Compiling results and generating recommendations',
          status: 'pending',
          estimatedDuration: 10000
        }
      ];
      
      setScanSteps(steps);
      setStartTime(new Date());
      
      // Calculate estimated completion time
      const totalDuration = steps.reduce((sum, step) => sum + (step.estimatedDuration || 0), 0);
      setEstimatedCompletion(new Date(Date.now() + totalDuration));
    }
  }, [scanStatus, scanSteps.length]);

  // Update scan steps based on current status
  useEffect(() => {
    if (scanStatus && scanSteps.length > 0) {
      setScanSteps(prevSteps => {
        const updatedSteps = [...prevSteps];
        const currentStepIndex = Math.floor((scanStatus.progress / 100) * updatedSteps.length);
        
        // Update step statuses based on progress
        updatedSteps.forEach((step, index) => {
          if (index < currentStepIndex) {
            step.status = 'completed';
            step.progress = 100;
          } else if (index === currentStepIndex) {
            step.status = 'in_progress';
            step.progress = ((scanStatus.progress / 100) * updatedSteps.length - index) * 100;
          } else {
            step.status = 'pending';
            step.progress = 0;
          }
        });

        // Handle error states
        if (scanStatus.status === 'failed' && scanStatus.error) {
          const errorStepIndex = Math.min(currentStepIndex, updatedSteps.length - 1);
          updatedSteps[errorStepIndex].status = 'error';
          updatedSteps[errorStepIndex].error = scanStatus.error;
        }

        return updatedSteps;
      });
    }
  }, [scanStatus, scanSteps.length]);

  // Handle scan completion
  useEffect(() => {
    if (scanStatus?.status === 'completed' && scanStatus.results) {
      onScanComplete?.(scanId, scanStatus.results);
    } else if (scanStatus?.status === 'failed' && scanStatus.error) {
      onScanError?.(scanId, scanStatus.error);
    }
  }, [scanStatus, scanId, onScanComplete, onScanError]);

  /**
   * Calculate elapsed time since scan started
   */
  const getElapsedTime = (): string => {
    if (!startTime) return '0s';
    
    const elapsed = Date.now() - startTime.getTime();
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  /**
   * Calculate estimated time remaining
   */
  const getTimeRemaining = (): string => {
    if (!estimatedCompletion || !scanStatus) return 'Calculating...';
    
    const remaining = estimatedCompletion.getTime() - Date.now();
    if (remaining <= 0) return 'Almost done...';
    
    const seconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `~${minutes}m ${seconds % 60}s remaining`;
    }
    return `~${seconds}s remaining`;
  };

  /**
   * Get step icon based on status
   */
  const getStepIcon = (step: ScanStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      default:
        return <div className="h-4 w-4 border-2 border-muted rounded-full" />;
    }
  };

  /**
   * Get step-specific icon
   */
  const getStepTypeIcon = (stepId: string) => {
    switch (stepId) {
      case 'initialize':
        return <Shield className="h-3 w-3" />;
      case 'authenticate':
        return <CheckCircle className="h-3 w-3" />;
      case 'collect':
        return <Database className="h-3 w-3" />;
      case 'analyze':
        return <Search className="h-3 w-3" />;
      case 'generate':
        return <FileText className="h-3 w-3" />;
      default:
        return <BarChart3 className="h-3 w-3" />;
    }
  };

  /**
   * Handle scan cancellation
   */
  const handleCancelScan = () => {
    onScanCancel?.(scanId);
  };

  /**
   * Handle scan retry
   */
  const handleRetryScan = () => {
    refetch();
  };

  if (isLoading && !scanStatus) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading scan status...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>Scan Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load scan status. Please try again.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleRetryScan}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scanStatus) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <span>Scanning {platformId}</span>
            </CardTitle>
            <CardDescription>
              {scanStatus.status === 'completed' 
                ? 'Scan completed successfully'
                : scanStatus.status === 'failed'
                ? 'Scan failed'
                : 'Analyzing your social media presence'
              }
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={
                scanStatus.status === 'completed' ? 'default' :
                scanStatus.status === 'failed' ? 'destructive' :
                'secondary'
              }
            >
              {scanStatus.status}
            </Badge>
            {allowCancel && scanStatus.status === 'running' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelScan}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(scanStatus.progress)}%</span>
          </div>
          <Progress value={scanStatus.progress} className="h-2" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Elapsed: {getElapsedTime()}</span>
            {scanStatus.status === 'running' && (
              <span>{getTimeRemaining()}</span>
            )}
          </div>
        </div>

        {/* Detailed Steps */}
        {showDetailedSteps && scanSteps.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Scan Progress</span>
            </h4>
            
            <div className="space-y-2">
              {scanSteps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getStepIcon(step)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {getStepTypeIcon(step.id)}
                      <p className="text-sm font-medium">{step.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {step.error || step.description}
                    </p>
                    
                    {step.status === 'in_progress' && step.progress !== undefined && (
                      <div className="mt-1">
                        <Progress value={step.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                  
                  {step.status === 'completed' && (
                    <Badge variant="outline" className="text-xs">
                      Done
                    </Badge>
                  )}
                  
                  {step.status === 'error' && (
                    <Badge variant="destructive" className="text-xs">
                      Error
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Activity */}
        {scanStatus.currentActivity && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{scanStatus.currentActivity}</span>
          </div>
        )}

        {/* Error Display */}
        {scanStatus.status === 'failed' && scanStatus.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {scanStatus.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Completion Message */}
        {scanStatus.status === 'completed' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Scan completed successfully! Results are now available for review.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}