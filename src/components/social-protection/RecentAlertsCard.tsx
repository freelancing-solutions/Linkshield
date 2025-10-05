/**
 * @fileoverview Recent Alerts Card Component
 * 
 * Displays the most recent crisis alerts with severity indicators,
 * timestamps, and quick actions for alert management.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Eye, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { CrisisAlert, AlertSeverity, AlertStatus } from '@/types/social-protection';
import { formatDistanceToNow } from 'date-fns';

/**
 * Props for the RecentAlertsCard component
 */
interface RecentAlertsCardProps {
  /** Array of recent crisis alerts */
  alerts: CrisisAlert[];
  /** Loading state */
  isLoading?: boolean;
  /** Callback for viewing alert details */
  onViewAlert?: (alertId: string) => void;
  /** Callback for resolving an alert */
  onResolveAlert?: (alertId: string) => void;
}

/**
 * Get severity color and icon
 */
const getSeverityInfo = (severity: AlertSeverity): { 
  color: string; 
  bgColor: string; 
  icon: React.ReactNode;
} => {
  switch (severity) {
    case AlertSeverity.CRITICAL:
      return {
        color: 'text-red-700 dark:text-red-300',
        bgColor: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
        icon: <XCircle className="h-3 w-3" />
      };
    case AlertSeverity.HIGH:
      return {
        color: 'text-orange-700 dark:text-orange-300',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
        icon: <AlertTriangle className="h-3 w-3" />
      };
    case AlertSeverity.MEDIUM:
      return {
        color: 'text-yellow-700 dark:text-yellow-300',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
        icon: <AlertTriangle className="h-3 w-3" />
      };
    case AlertSeverity.LOW:
      return {
        color: 'text-blue-700 dark:text-blue-300',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
        icon: <AlertTriangle className="h-3 w-3" />
      };
    default:
      return {
        color: 'text-gray-700 dark:text-gray-300',
        bgColor: 'bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800',
        icon: <AlertTriangle className="h-3 w-3" />
      };
  }
};

/**
 * Get status badge color
 */
const getStatusColor = (status: AlertStatus): string => {
  switch (status) {
    case AlertStatus.ACTIVE:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case AlertStatus.ACKNOWLEDGED:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case AlertStatus.RESOLVED:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case AlertStatus.DISMISSED:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

/**
 * Recent Alerts Card Component
 * 
 * Displays the most recent crisis alerts with interactive elements
 * for quick alert management and navigation.
 * 
 * @component
 * @example
 * ```tsx
 * import { RecentAlertsCard } from '@/components/social-protection/RecentAlertsCard';
 * 
 * function Dashboard() {
 *   const { data } = useCrisisAlerts({ limit: 5 });
 *   
 *   return (
 *     <RecentAlertsCard 
 *       alerts={data.alerts}
 *       onViewAlert={(id) => router.push(`/alerts/${id}`)}
 *       onResolveAlert={resolveAlertMutation.mutate}
 *     />
 *   );
 * }
 * ```
 * 
 * @param props - Component props
 * @returns JSX element containing the recent alerts card
 */
export function RecentAlertsCard({ 
  alerts, 
  isLoading = false, 
  onViewAlert,
  onResolveAlert
}: RecentAlertsCardProps) {
  const activeAlerts = alerts.filter(alert => alert.status === AlertStatus.ACTIVE);
  const criticalAlerts = alerts.filter(alert => alert.severity === AlertSeverity.CRITICAL);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
        <div className="flex items-center gap-2">
          {criticalAlerts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {criticalAlerts.length} Critical
            </Badge>
          )}
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Alert summary */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {activeAlerts.length} active of {alerts.length} total
            </span>
            <Link href="/social-protection/alerts">
              <Button variant="ghost" size="sm" className="text-xs h-6">
                View All
              </Button>
            </Link>
          </div>

          {/* Recent alerts list */}
          <div className="space-y-2">
            {alerts.slice(0, 4).map((alert) => {
              const severityInfo = getSeverityInfo(alert.severity);
              
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${severityInfo.bgColor}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`flex items-center gap-1 ${severityInfo.color}`}>
                          {severityInfo.icon}
                          <span className="text-xs font-medium uppercase">
                            {alert.severity}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(alert.status)}
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      
                      <h4 className="text-sm font-medium truncate mb-1">
                        {alert.title}
                      </h4>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {alert.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                        </span>
                        {alert.platform && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{alert.platform.toLowerCase()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onViewAlert?.(alert.id)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      
                      {alert.status === AlertStatus.ACTIVE && onResolveAlert && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                          onClick={() => onResolveAlert(alert.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {alerts.length === 0 && (
            <div className="text-center py-6">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No recent alerts
              </p>
              <p className="text-xs text-muted-foreground">
                Your social presence is secure
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}