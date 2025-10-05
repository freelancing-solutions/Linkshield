'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToggleMonitoring } from '@/hooks/dashboard';
import { useSubscriptionInfo } from '@/hooks/homepage';
import { hasFeatureAccess } from '@/lib/utils/dashboard/feature-gating';
import { Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface MonitoringToggleProps {
  projectId: string;
  projectName: string;
  enabled: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'default';
}

/**
 * Monitoring Toggle Component
 * 
 * Toggle switch for enabling/disabling project monitoring with confirmation dialog.
 * Uses optimistic updates for immediate UI feedback.
 */
export function MonitoringToggle({
  projectId,
  projectName,
  enabled,
  showLabel = true,
  size = 'default',
}: MonitoringToggleProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingState, setPendingState] = useState<boolean | null>(null);
  
  const toggleMonitoring = useToggleMonitoring();
  const { subscription } = useSubscriptionInfo();

  // Feature access checks
  const currentPlan = subscription?.plan || 'FREE';
  const currentStatus = subscription?.status || 'INACTIVE';
  const hasMonitoringAccess = hasFeatureAccess('social_automated_monitoring', currentPlan, currentStatus);

  const handleToggle = (checked: boolean) => {
    // Check if user has access to monitoring features
    if (!hasMonitoringAccess) {
      toast.error('Automated monitoring requires Pro plan or higher');
      return;
    }

    // If disabling, show confirmation dialog
    if (!checked) {
      setPendingState(checked);
      setShowConfirmDialog(true);
    } else {
      // If enabling, toggle immediately
      performToggle(checked);
    }
  };

  const performToggle = async (newState: boolean) => {
    try {
      await toggleMonitoring.mutateAsync({
        projectId,
        enabled: newState,
      });

      toast.success(
        newState
          ? 'Monitoring enabled successfully'
          : 'Monitoring disabled successfully'
      );
    } catch (error) {
      // Error is already handled by the mutation hook
      console.error('Failed to toggle monitoring:', error);
    }
  };

  const handleConfirm = () => {
    if (pendingState !== null) {
      performToggle(pendingState);
      setPendingState(null);
    }
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setPendingState(null);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {toggleMonitoring.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : !hasMonitoringAccess ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={false}
                    onCheckedChange={handleToggle}
                    disabled={true}
                    className={size === 'sm' ? 'scale-90' : ''}
                  />
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Automated monitoring requires Pro plan or higher</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={toggleMonitoring.isPending}
            className={size === 'sm' ? 'scale-90' : ''}
          />
        )}
        {showLabel && (
          <Label
            className={`cursor-pointer ${
              size === 'sm' ? 'text-sm' : ''
            } ${toggleMonitoring.isPending || !hasMonitoringAccess ? 'opacity-50' : ''}`}
          >
            {!hasMonitoringAccess 
              ? 'Monitoring Disabled (Upgrade Required)' 
              : enabled 
                ? 'Monitoring Enabled' 
                : 'Monitoring Disabled'
            }
          </Label>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Monitoring?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disable monitoring for{' '}
              <span className="font-semibold">{projectName}</span>?
              <br />
              <br />
              This will stop all automated scans and alerts for this project. You
              can re-enable monitoring at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Disable Monitoring
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
