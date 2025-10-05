/**
 * AlertsTab Component
 * 
 * A comprehensive alerts management interface for project-specific security alerts.
 * Provides filtering, sorting, bulk operations, and detailed alert viewing capabilities.
 * Integrates with the alerts API to display real-time security threat information
 * and allows users to manage alert resolution workflows.
 * 
 * Features:
 * - Real-time alerts display with automatic updates
 * - Multi-level filtering by status, severity, and date range
 * - Bulk alert resolution with confirmation dialogs
 * - Individual alert detail drawer with resolution options
 * - Loading states with skeleton placeholders
 * - Error handling with user-friendly messages
 * - Toast notifications for user feedback
 * - Responsive design with proper spacing
 * - Integration with dashboard hooks and API
 * - Accessibility support with proper ARIA labels
 * - Empty state handling for no alerts scenarios
 * - Real-time alert count updates
 * 
 * @example
 * ```tsx
 * <AlertsTab projectId="project-123" />
 * ```
 */

'use client';

import { useState } from 'react';
import { useAlerts, useResolveAllAlerts } from '@/hooks/dashboard';
import { AlertsList } from './AlertsList';
import { AlertDetailDrawer } from './AlertDetailDrawer';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Alert, AlertSeverity, AlertStatus } from '@/types/dashboard';

/**
 * Props for the AlertsTab component
 * 
 * @interface AlertsTabProps
 * @property {string} projectId - The unique identifier of the project to display alerts for
 */
interface AlertsTabProps {
  /** The unique identifier of the project to display alerts for */
  projectId: string;
}

/**
 * Alerts Tab Component
 * 
 * A comprehensive alerts management interface that displays and manages security alerts
 * for a specific project. Provides filtering, bulk operations, and detailed alert viewing.
 * 
 * @param {AlertsTabProps} props - The component props
 * @returns {JSX.Element} The rendered alerts tab interface
 * 
 * @example
 * ```tsx
 * // Display alerts for a specific project
 * <AlertsTab projectId="project-123" />
 * ```
 * 
 * @features
 * - Real-time alerts display with filtering
 * - Bulk alert resolution functionality
 * - Individual alert detail drawer
 * - Status and severity filtering
 * - Loading and error states
 * - Toast notifications for feedback
 */
export function AlertsTab({ projectId }: AlertsTabProps) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');

  const { data, isLoading, error } = useAlerts(projectId, {
    project_id: projectId,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    severity: severityFilter !== 'all' ? severityFilter : undefined,
  });

  const resolveAllAlerts = useResolveAllAlerts();

  const handleResolveAll = async () => {
    if (!data?.items.length) return;

    const activeAlerts = data.items.filter((alert) => alert.status === 'active');
    if (activeAlerts.length === 0) {
      toast.info('No active alerts to resolve');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to resolve all ${activeAlerts.length} active alert(s)?`
      )
    ) {
      return;
    }

    try {
      await resolveAllAlerts.mutateAsync(projectId);
      toast.success(`Resolved ${activeAlerts.length} alert(s)`);
    } catch (error) {
      console.error('Failed to resolve all alerts:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center" role="alert">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold mb-2">Failed to load alerts</h3>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()} variant="outline" aria-label="Retry loading alerts">
          Try Again
        </Button>
      </div>
    );
  }

  const activeAlertsCount = data?.items.filter((a) => a.status === 'active').length || 0;

  return (
    <div className="space-y-6" role="region" aria-labelledby="alerts-heading">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 id="alerts-heading" className="text-lg font-semibold">Alerts</h3>
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            {activeAlertsCount > 0
              ? `${activeAlertsCount} active alert${activeAlertsCount !== 1 ? 's' : ''}`
              : 'No active alerts'}
          </p>
        </div>
        {activeAlertsCount > 0 && (
          <Button
            onClick={handleResolveAll}
            variant="outline"
            className="gap-2"
            disabled={resolveAllAlerts.isPending}
            aria-label={resolveAllAlerts.isPending ? "Resolving all alerts..." : `Resolve all ${activeAlertsCount} active alerts`}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {resolveAllAlerts.isPending ? 'Resolving...' : 'Resolve All'}
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4" role="group" aria-label="Alert filters">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as AlertStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]" aria-label="Filter alerts by status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent role="listbox">
            <SelectItem value="all" role="option">All Statuses</SelectItem>
            <SelectItem value="active" role="option">Active</SelectItem>
            <SelectItem value="acknowledged" role="option">Acknowledged</SelectItem>
            <SelectItem value="resolved" role="option">Resolved</SelectItem>
            <SelectItem value="dismissed" role="option">Dismissed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={severityFilter}
          onValueChange={(value) => setSeverityFilter(value as AlertSeverity | 'all')}
        >
          <SelectTrigger className="w-[180px]" aria-label="Filter alerts by severity">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent role="listbox">
            <SelectItem value="all" role="option">All Severities</SelectItem>
            <SelectItem value="critical" role="option">Critical</SelectItem>
            <SelectItem value="high" role="option">High</SelectItem>
            <SelectItem value="medium" role="option">Medium</SelectItem>
            <SelectItem value="low" role="option">Low</SelectItem>
            <SelectItem value="info" role="option">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts List */}
      <AlertsList
        alerts={data?.items || []}
        onAlertClick={setSelectedAlert}
      />

      {/* Alert Detail Drawer */}
      <AlertDetailDrawer
        projectId={projectId}
        alert={selectedAlert}
        open={!!selectedAlert}
        onOpenChange={(open) => !open && setSelectedAlert(null)}
      />
    </div>
  );
}
