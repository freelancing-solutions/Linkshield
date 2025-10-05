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

interface AlertsTabProps {
  projectId: string;
}

/**
 * Alerts Tab Component
 * 
 * Displays project-specific alerts with filters for status, severity, and date range.
 * Includes bulk resolve functionality and alert detail drawer.
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
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load alerts</h3>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  const activeAlertsCount = data?.items.filter((a) => a.status === 'active').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Alerts</h3>
          <p className="text-sm text-muted-foreground">
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
          >
            <CheckCircle2 className="h-4 w-4" />
            {resolveAllAlerts.isPending ? 'Resolving...' : 'Resolve All'}
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as AlertStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={severityFilter}
          onValueChange={(value) => setSeverityFilter(value as AlertSeverity | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="info">Info</SelectItem>
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
