'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useResolveAlert } from '@/hooks/dashboard';
import {
  AlertTriangle,
  Shield,
  Activity,
  FileCheck,
  Info,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import type { Alert, AlertSeverity, AlertType } from '@/types/dashboard';

interface AlertsListProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
}

/**
 * Alerts List Component
 * 
 * Displays alerts grouped by severity with type icons and quick resolve buttons.
 * Clicking an alert opens the detail drawer.
 */
export function AlertsList({ alerts, onAlertClick }: AlertsListProps) {
  const resolveAlert = useResolveAlert();

  const handleQuickResolve = async (e: React.MouseEvent, alert: Alert) => {
    e.stopPropagation(); // Prevent opening detail drawer

    try {
      await resolveAlert.mutateAsync({
        projectId: alert.project_id,
        alertId: alert.id,
        data: {
          resolution_notes: 'Quick resolved from alerts list',
        },
      });
      toast.success('Alert resolved successfully');
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'security':
        return <Shield className="h-4 w-4" aria-hidden="true" />;
      case 'performance':
        return <Activity className="h-4 w-4" aria-hidden="true" />;
      case 'availability':
        return <Clock className="h-4 w-4" aria-hidden="true" />;
      case 'compliance':
        return <FileCheck className="h-4 w-4" aria-hidden="true" />;
      default:
        return <Info className="h-4 w-4" aria-hidden="true" />;
    }
  };

  const getSeverityBadgeVariant = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'info':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Group alerts by severity
  const groupedAlerts = alerts.reduce((acc, alert) => {
    if (!acc[alert.severity]) {
      acc[alert.severity] = [];
    }
    acc[alert.severity].push(alert);
    return acc;
  }, {} as Record<AlertSeverity, Alert[]>);

  const severityOrder: AlertSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];

  // Empty state
  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center" role="status" aria-live="polite">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <CheckCircle2 className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No alerts</h3>
        <p className="text-sm text-muted-foreground">
          All clear! There are no alerts for this project.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="region" aria-label="Alerts list">
      {severityOrder.map((severity) => {
        const severityAlerts = groupedAlerts[severity];
        if (!severityAlerts || severityAlerts.length === 0) return null;

        return (
          <div key={severity} role="group" aria-labelledby={`severity-${severity}`}>
            <div className="flex items-center gap-2 mb-3">
              <Badge 
                variant={getSeverityBadgeVariant(severity)} 
                className="capitalize"
                id={`severity-${severity}`}
              >
                {severity}
              </Badge>
              <span className="text-sm text-muted-foreground" role="status">
                {severityAlerts.length} alert{severityAlerts.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-2" role="list">
              {severityAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => onAlertClick(alert)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onAlertClick(alert);
                    }
                  }}
                  tabIndex={0}
                  role="listitem button"
                  aria-label={`${alert.severity} ${alert.type} alert: ${alert.title}`}
                  className={`
                    rounded-lg border p-4 cursor-pointer transition-colors
                    hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${getSeverityColor(alert.severity)}
                  `}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5" aria-hidden="true">{getTypeIcon(alert.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{alert.title}</h4>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                            aria-label={`Alert type: ${alert.type}`}
                          >
                            {alert.type}
                          </Badge>
                          {alert.status !== 'active' && (
                            <Badge 
                              variant="secondary" 
                              className="text-xs capitalize"
                              aria-label={`Alert status: ${alert.status}`}
                            >
                              {alert.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {alert.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(alert.created_at)}
                        </p>
                      </div>
                    </div>

                    {alert.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 shrink-0"
                        onClick={(e) => handleQuickResolve(e, alert)}
                        disabled={resolveAlert.isPending}
                        aria-label={`Resolve alert: ${alert.title}`}
                      >
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
