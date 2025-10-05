'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  RefreshCw,
  Server,
  Zap
} from 'lucide-react';
import { useBotHealth, useRestartBot } from '@/hooks/dashboard/use-social-protection';
import { BotHealthStatus } from '@/types/dashboard';

/**
 * Status color mapping for bot health states
 */
const STATUS_CONFIG: Record<BotHealthStatus, {
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = {
  online: {
    color: 'text-green-600',
    bgColor: 'bg-green-100 border-green-200',
    icon: CheckCircle,
    label: 'Healthy',
  },
  degraded: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 border-yellow-200',
    icon: AlertTriangle,
    label: 'Degraded',
  },
  error: {
    color: 'text-red-600',
    bgColor: 'bg-red-100 border-red-200',
    icon: XCircle,
    label: 'Error',
  },
  offline: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 border-gray-200',
    icon: Clock,
    label: 'Offline',
  },
};

interface BotHealthBadgeProps {
  /**
   * Additional CSS classes for styling
   */
  className?: string;
  
  /**
   * Whether to show detailed service breakdown
   */
  showDetails?: boolean;
  
  /**
   * Whether to show restart actions
   */
  showActions?: boolean;
}

/**
 * BotHealthBadge component displays bot health status with service breakdown
 * 
 * Features:
 * - Overall health status badge
 * - Individual service status indicators
 * - Uptime percentages
 * - Error details and timestamps
 * - Restart service actions
 * - Auto-refresh every 5 minutes
 * - Link to detailed logs (if available)
 * 
 * @param props - Component props
 * @returns JSX element
 */
export const BotHealthBadge: React.FC<BotHealthBadgeProps> = ({
  className = '',
  showDetails = true,
  showActions = true,
}) => {
  const {
    data: health,
    isLoading,
    error,
    refetch,
  } = useBotHealth();

  const restartBot = useRestartBot();

  /**
   * Handle service restart
   */
  const handleRestartService = async (serviceName: string) => {
    try {
      await restartBot.mutateAsync(serviceName);
    } catch (error) {
      // Error is handled by the hook's onError callback
    }
  };

  /**
   * Format uptime percentage with color coding
   */
  const formatUptime = (percentage: number) => {
    const color = percentage >= 99 ? 'text-green-600' : 
                  percentage >= 95 ? 'text-yellow-600' : 'text-red-600';
    return (
      <span className={color}>
        {percentage.toFixed(1)}%
      </span>
    );
  };

  /**
   * Format last error time
   */
  const formatErrorTime = (timestamp?: string) => {
    if (!timestamp) return null;
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return `${Math.floor(diffMins / 1440)}d ago`;
    }
  };

  if (isLoading) {
    return (
      <Card className={`bot-health-badge ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        {showDetails && (
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        )}
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bot-health-badge ${className}`}>
        <CardContent className="p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load bot health status.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!health) {
    return (
      <Card className={`bot-health-badge ${className}`}>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No bot health data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = STATUS_CONFIG[health.overall_status];
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={`bot-health-badge ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Bot Health
          </CardTitle>
          
          {/* Overall Status Badge */}
          <Badge
            variant="outline"
            className={`${statusConfig.bgColor} ${statusConfig.color} border`}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
        
        {/* Last Check Time */}
        <div className="text-xs text-muted-foreground">
          Last checked: {new Date(health.last_check).toLocaleTimeString()}
        </div>
      </CardHeader>

      {showDetails && health.services.length > 0 && (
        <CardContent className="space-y-3">
          <Separator />
          
          {/* Service Status List */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Services ({health.services.length})
            </h4>
            
            {health.services.map((service) => {
              const serviceStatusConfig = STATUS_CONFIG[service.status];
              const ServiceStatusIcon = serviceStatusConfig.icon;
              
              return (
                <div
                  key={service.service_name}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <ServiceStatusIcon 
                      className={`h-3 w-3 ${serviceStatusConfig.color}`} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {service.service_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Uptime: {formatUptime(service.uptime_percentage)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Actions */}
                  {showActions && service.status !== 'online' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestartService(service.service_name)}
                      disabled={restartBot.isPending}
                      className="h-7 px-2 text-xs"
                    >
                      {restartBot.isPending ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Zap className="h-3 w-3 mr-1" />
                          Restart
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Error Details */}
          {health.services.some(service => service.last_error) && (
            <div className="space-y-2">
              <Separator />
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recent Errors
              </h4>
              
              {health.services
                .filter(service => service.last_error)
                .map((service) => (
                  <Alert key={`error-${service.service_name}`} variant="destructive" className="py-2">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      <div className="font-medium">{service.service_name}</div>
                      <div className="text-muted-foreground mt-1">
                        {service.last_error}
                      </div>
                      {service.last_error_time && (
                        <div className="text-muted-foreground mt-1">
                          {formatErrorTime(service.last_error_time)}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="text-xs"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            {/* Link to detailed logs - placeholder for future implementation */}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              disabled
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Logs
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};