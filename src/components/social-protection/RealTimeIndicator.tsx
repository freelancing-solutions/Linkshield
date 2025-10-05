/**
 * Real-Time Status Indicator Component
 * 
 * Displays the current real-time connection status and provides controls
 * for manual refresh and connection management in social protection features.
 * 
 * Features:
 * - Visual connection status indicator
 * - Manual refresh button
 * - Connection error display
 * - Auto-refresh toggle
 * - Last update timestamp
 * - Accessibility support
 */

import React, { useState } from 'react';
import { 
  WifiIcon, 
  WifiOffIcon, 
  RefreshCwIcon, 
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  SettingsIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useRealTime, WebSocketState } from '@/hooks/social-protection/use-real-time';
import { formatSocialDate } from '@/utils/social-protection/date-format';
import { cn } from '@/lib/utils';

/**
 * Props for the RealTimeIndicator component
 */
export interface RealTimeIndicatorProps {
  /** Additional CSS classes */
  className?: string;
  /** Show detailed status information */
  showDetails?: boolean;
  /** Show manual refresh button */
  showRefresh?: boolean;
  /** Show settings popover */
  showSettings?: boolean;
  /** Compact display mode */
  compact?: boolean;
  /** Custom refresh handler */
  onRefresh?: () => void;
}

/**
 * Real-time status indicator component
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function RealTimeIndicator({
  className,
  showDetails = true,
  showRefresh = true,
  showSettings = false,
  compact = false,
  onRefresh,
}: RealTimeIndicatorProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  
  const { 
    wsState, 
    isConnected, 
    connectionError, 
    lastEvent, 
    refresh, 
    connect, 
    disconnect,
    options,
  } = useRealTime();

  /**
   * Handle manual refresh
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      if (onRefresh) {
        onRefresh();
      } else {
        refresh('all');
      }
      
      // Show refresh animation for at least 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Handle connection toggle
   */
  const handleConnectionToggle = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  /**
   * Get status icon based on connection state
   */
  const getStatusIcon = () => {
    switch (wsState) {
      case WebSocketState.CONNECTED:
        return <WifiIcon className="h-4 w-4 text-green-500" />;
      case WebSocketState.CONNECTING:
      case WebSocketState.RECONNECTING:
        return <RefreshCwIcon className="h-4 w-4 text-yellow-500 animate-spin" />;
      case WebSocketState.ERROR:
        return <WifiOffIcon className="h-4 w-4 text-red-500" />;
      case WebSocketState.DISCONNECTED:
      default:
        return <WifiOffIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  /**
   * Get status text based on connection state
   */
  const getStatusText = () => {
    switch (wsState) {
      case WebSocketState.CONNECTED:
        return 'Connected';
      case WebSocketState.CONNECTING:
        return 'Connecting...';
      case WebSocketState.RECONNECTING:
        return 'Reconnecting...';
      case WebSocketState.ERROR:
        return 'Connection Error';
      case WebSocketState.DISCONNECTED:
      default:
        return 'Disconnected';
    }
  };

  /**
   * Get status color based on connection state
   */
  const getStatusColor = () => {
    switch (wsState) {
      case WebSocketState.CONNECTED:
        return 'bg-green-100 text-green-800 border-green-200';
      case WebSocketState.CONNECTING:
      case WebSocketState.RECONNECTING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case WebSocketState.ERROR:
        return 'bg-red-100 text-red-800 border-red-200';
      case WebSocketState.DISCONNECTED:
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn('flex items-center gap-1', className)}>
              {getStatusIcon()}
              {showRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCwIcon className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
                </Button>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className="font-medium">{getStatusText()}</div>
              {connectionError && (
                <div className="text-red-500 text-xs mt-1">{connectionError}</div>
              )}
              {lastEvent && (
                <div className="text-gray-500 text-xs mt-1">
                  Last update: {formatSocialDate(lastEvent.timestamp, { format: 'relative' })}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Status Badge */}
      <Badge variant="outline" className={cn('gap-2', getStatusColor())}>
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </Badge>

      {/* Details */}
      {showDetails && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {lastEvent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{formatSocialDate(lastEvent.timestamp, { format: 'relative' })}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <div>Last event: {lastEvent.type}</div>
                    <div>{formatSocialDate(lastEvent.timestamp, { format: 'detailed' })}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {autoRefreshEnabled && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <CheckCircleIcon className="h-3 w-3 text-green-500" />
                    <span>Auto-refresh</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    Auto-refresh is enabled
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      {/* Error Display */}
      {connectionError && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircleIcon className="h-4 w-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm text-red-600 max-w-xs">
                {connectionError}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Manual Refresh Button */}
      {showRefresh && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCwIcon className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
                {!compact && 'Refresh'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                Manually refresh all data
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Settings Popover */}
      {showSettings && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SettingsIcon className="h-4 w-4" />
              {!compact && 'Settings'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Real-time Settings</h4>
                <Separator />
              </div>

              {/* Connection Control */}
              <div className="flex items-center justify-between">
                <Label htmlFor="connection-toggle" className="text-sm">
                  Real-time Connection
                </Label>
                <Switch
                  id="connection-toggle"
                  checked={isConnected}
                  onCheckedChange={handleConnectionToggle}
                />
              </div>

              {/* Auto-refresh Control */}
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-refresh-toggle" className="text-sm">
                  Auto-refresh
                </Label>
                <Switch
                  id="auto-refresh-toggle"
                  checked={autoRefreshEnabled}
                  onCheckedChange={setAutoRefreshEnabled}
                />
              </div>

              <Separator />

              {/* Connection Info */}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">{getStatusText()}</span>
                </div>
                
                {lastEvent && (
                  <div className="flex justify-between">
                    <span>Last Event:</span>
                    <span className="font-medium">{lastEvent.type}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Dashboard Refresh:</span>
                  <span className="font-medium">
                    {Math.round(options.autoRefresh.dashboardInterval / 1000)}s
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Alerts Refresh:</span>
                  <span className="font-medium">
                    {Math.round(options.autoRefresh.alertsInterval / 1000)}s
                  </span>
                </div>
              </div>

              <Separator />

              {/* Manual Actions */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refresh('dashboard')}
                  className="w-full justify-start"
                >
                  <RefreshCwIcon className="h-3 w-3 mr-2" />
                  Refresh Dashboard
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refresh('alerts')}
                  className="w-full justify-start"
                >
                  <AlertCircleIcon className="h-3 w-3 mr-2" />
                  Refresh Alerts
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refresh('health')}
                  className="w-full justify-start"
                >
                  <CheckCircleIcon className="h-3 w-3 mr-2" />
                  Refresh Health
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

/**
 * Simplified real-time status dot component
 * 
 * @param props - Component props
 * @returns JSX element
 */
export function RealTimeStatusDot({ className }: { className?: string }) {
  const { wsState } = useRealTime();
  
  const getStatusColor = () => {
    switch (wsState) {
      case WebSocketState.CONNECTED:
        return 'bg-green-500';
      case WebSocketState.CONNECTING:
      case WebSocketState.RECONNECTING:
        return 'bg-yellow-500 animate-pulse';
      case WebSocketState.ERROR:
        return 'bg-red-500';
      case WebSocketState.DISCONNECTED:
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('relative', className)}>
            <div className={cn('h-2 w-2 rounded-full', getStatusColor())} />
            {wsState === WebSocketState.CONNECTED && (
              <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            Real-time: {wsState === WebSocketState.CONNECTED ? 'Connected' : 'Disconnected'}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}