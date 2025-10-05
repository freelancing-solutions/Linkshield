/**
 * Real-Time Alerts Component
 * 
 * Displays live crisis alerts with real-time updates via WebSocket connections.
 * Provides alert management, filtering, and notification features for social
 * protection monitoring.
 * 
 * Features:
 * - Real-time alert updates via WebSocket
 * - Alert severity filtering and sorting
 * - Visual alert indicators and animations
 * - Alert acknowledgment and dismissal
 * - Sound notifications for critical alerts
 * - Bulk alert management
 * - Alert history and archiving
 * - Accessibility support
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangleIcon, 
  BellIcon, 
  BellOffIcon,
  CheckIcon,
  XIcon,
  FilterIcon,
  ArchiveIcon,
  VolumeXIcon,
  Volume2Icon,
  RefreshCwIcon,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useRealTimeAlerts } from '@/hooks/social-protection/use-real-time';
import { socialProtectionService } from '@/services/social-protection.service';
import { formatSocialDate } from '@/utils/social-protection/date-format';
import { cn } from '@/lib/utils';
import type { CrisisAlert } from '@/types/social-protection';

/**
 * Alert severity configuration
 */
const ALERT_SEVERITY_CONFIG = {
  low: {
    label: 'Low',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: '🔵',
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: '🟡',
  },
  high: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: '🟠',
  },
  critical: {
    label: 'Critical',
    color: 'bg-red-100 text-red-800 border-red-200',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: '🔴',
  },
} as const;

/**
 * Alert filter options
 */
type AlertFilter = 'all' | 'unread' | 'acknowledged' | 'critical' | 'high' | 'medium' | 'low';

/**
 * Props for the RealTimeAlerts component
 */
export interface RealTimeAlertsProps {
  /** Additional CSS classes */
  className?: string;
  /** Maximum number of alerts to display */
  maxAlerts?: number;
  /** Show alert controls */
  showControls?: boolean;
  /** Enable sound notifications */
  enableSound?: boolean;
  /** Auto-acknowledge alerts after viewing */
  autoAcknowledge?: boolean;
  /** Callback when alert is clicked */
  onAlertClick?: (alert: CrisisAlert) => void;
  /** Callback when alert is acknowledged */
  onAlertAcknowledge?: (alert: CrisisAlert) => void;
}

/**
 * Real-time alerts component
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function RealTimeAlerts({
  className,
  maxAlerts = 50,
  showControls = true,
  enableSound = true,
  autoAcknowledge = false,
  onAlertClick,
  onAlertAcknowledge,
}: RealTimeAlertsProps) {
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  const [isLoading, setIsLoading] = useState(false);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { alerts, isConnected, clearAlerts, hasNewAlerts } = useRealTimeAlerts();

  // Initialize audio for notifications
  useEffect(() => {
    if (soundEnabled && typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/alert-notification.mp3');
      audioRef.current.volume = 0.5;
    }
  }, [soundEnabled]);

  // Play sound for new critical alerts
  useEffect(() => {
    if (soundEnabled && audioRef.current && hasNewAlerts) {
      const criticalAlerts = alerts.filter(alert => 
        alert.severity === 'critical' && !acknowledgedAlerts.has(alert.id)
      );
      
      if (criticalAlerts.length > 0) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [alerts, hasNewAlerts, soundEnabled, acknowledgedAlerts]);

  /**
   * Filter alerts based on current filter
   */
  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unread':
        return !acknowledgedAlerts.has(alert.id);
      case 'acknowledged':
        return acknowledgedAlerts.has(alert.id);
      case 'critical':
      case 'high':
      case 'medium':
      case 'low':
        return alert.severity === filter;
      case 'all':
      default:
        return true;
    }
  }).slice(0, maxAlerts);

  /**
   * Handle alert acknowledgment
   */
  const handleAcknowledgeAlert = async (alert: CrisisAlert) => {
    setIsLoading(true);
    
    try {
      await socialProtectionService.acknowledgeAlert(alert.id);
      setAcknowledgedAlerts(prev => new Set(prev).add(alert.id));
      
      if (onAlertAcknowledge) {
        onAlertAcknowledge(alert);
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle bulk alert acknowledgment
   */
  const handleBulkAcknowledge = async () => {
    if (selectedAlerts.size === 0) return;
    
    setIsLoading(true);
    
    try {
      await Promise.all(
        Array.from(selectedAlerts).map(alertId =>
          socialProtectionService.acknowledgeAlert(alertId)
        )
      );
      
      setAcknowledgedAlerts(prev => {
        const newSet = new Set(prev);
        selectedAlerts.forEach(id => newSet.add(id));
        return newSet;
      });
      
      setSelectedAlerts(new Set());
    } catch (error) {
      console.error('Failed to acknowledge alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle alert selection
   */
  const handleAlertSelection = (alertId: string, checked: boolean) => {
    setSelectedAlerts(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(alertId);
      } else {
        newSet.delete(alertId);
      }
      return newSet;
    });
  };

  /**
   * Handle select all alerts
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAlerts(new Set(filteredAlerts.map(alert => alert.id)));
    } else {
      setSelectedAlerts(new Set());
    }
  };

  /**
   * Handle alert click
   */
  const handleAlertClick = (alert: CrisisAlert) => {
    if (autoAcknowledge && !acknowledgedAlerts.has(alert.id)) {
      handleAcknowledgeAlert(alert);
    }
    
    if (onAlertClick) {
      onAlertClick(alert);
    }
  };

  /**
   * Get unread alert count
   */
  const unreadCount = alerts.filter(alert => !acknowledgedAlerts.has(alert.id)).length;

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            Real-time Alerts
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <div className={cn(
                      'h-2 w-2 rounded-full',
                      isConnected ? 'bg-green-500' : 'bg-red-500'
                    )} />
                    {isConnected && (
                      <div className="absolute h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    Real-time: {isConnected ? 'Connected' : 'Disconnected'}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Sound Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="h-8 w-8 p-0"
                  >
                    {soundEnabled ? (
                      <Volume2Icon className="h-4 w-4" />
                    ) : (
                      <VolumeXIcon className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    {soundEnabled ? 'Disable' : 'Enable'} sound notifications
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-between gap-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-gray-500" />
              <Select value={filter} onValueChange={(value: AlertFilter) => setFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="unread">Unread ({unreadCount})</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <Separator />
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedAlerts.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedAlerts.size} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkAcknowledge}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  Acknowledge
                </Button>
              </div>
            )}

            {/* Clear All */}
            <Button
              variant="outline"
              size="sm"
              onClick={clearAlerts}
              className="gap-2"
            >
              <ArchiveIcon className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        )}

        {/* Select All */}
        {filteredAlerts.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={selectedAlerts.size === filteredAlerts.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-gray-600">Select all visible alerts</span>
          </div>
        )}

        {/* Alerts List */}
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BellOffIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No alerts to display</p>
                {filter !== 'all' && (
                  <p className="text-sm mt-1">Try changing the filter</p>
                )}
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const severityConfig = ALERT_SEVERITY_CONFIG[alert.severity];
                const isAcknowledged = acknowledgedAlerts.has(alert.id);
                const isSelected = selectedAlerts.has(alert.id);

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm',
                      severityConfig.bgColor,
                      severityConfig.borderColor,
                      isAcknowledged && 'opacity-60',
                      isSelected && 'ring-2 ring-blue-500',
                      !isAcknowledged && 'animate-pulse-subtle'
                    )}
                    onClick={() => handleAlertClick(alert)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Selection Checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => 
                          handleAlertSelection(alert.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />

                      {/* Alert Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{severityConfig.icon}</span>
                              <Badge variant="outline" className={cn('text-xs', severityConfig.color)}>
                                {severityConfig.label}
                              </Badge>
                              {!isAcknowledged && (
                                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                                  New
                                </Badge>
                              )}
                            </div>
                            
                            <h4 className="font-medium text-sm mb-1 line-clamp-2">
                              {alert.title}
                            </h4>
                            
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {alert.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                Platform: {alert.platform}
                              </span>
                              <span>
                                {formatSocialDate(alert.created_at, { format: 'relative' })}
                              </span>
                              {alert.affected_accounts && (
                                <span>
                                  {alert.affected_accounts} accounts
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {!isAcknowledged && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAcknowledgeAlert(alert);
                                      }}
                                      disabled={isLoading}
                                      className="h-6 w-6 p-0"
                                    >
                                      <CheckIcon className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-sm">Acknowledge alert</div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            
                            {isAcknowledged && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="h-6 w-6 flex items-center justify-center">
                                      <EyeOffIcon className="h-3 w-3 text-gray-400" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-sm">Acknowledged</div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </span>
          <span>
            {isConnected ? 'Live updates active' : 'Offline mode'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Compact real-time alerts component for dashboard
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function CompactRealTimeAlerts({
  className,
  maxAlerts = 5,
  onViewAll,
}: {
  className?: string;
  maxAlerts?: number;
  onViewAll?: () => void;
}) {
  const { alerts, isConnected } = useRealTimeAlerts();
  const recentAlerts = alerts.slice(0, maxAlerts);

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BellIcon className="h-4 w-4" />
            Recent Alerts
            {alerts.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {alerts.length}
              </Badge>
            )}
          </CardTitle>
          
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {recentAlerts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <BellOffIcon className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent alerts</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentAlerts.map(alert => {
              const severityConfig = ALERT_SEVERITY_CONFIG[alert.severity];
              
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'p-2 rounded border text-sm',
                    severityConfig.bgColor,
                    severityConfig.borderColor
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm">{severityConfig.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1 mb-1">
                        {alert.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{alert.platform}</span>
                        <span>•</span>
                        <span>{formatSocialDate(alert.created_at, { format: 'relative' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Connection Status */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-2 border-t">
          <span>Real-time updates</span>
          <div className="flex items-center gap-1">
            <div className={cn(
              'h-1.5 w-1.5 rounded-full',
              isConnected ? 'bg-green-500' : 'bg-red-500'
            )} />
            <span>{isConnected ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}