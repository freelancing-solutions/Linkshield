/**
 * @fileoverview Extension Status Component
 * 
 * Displays browser extension installation status, version information,
 * sync status, and provides installation/update actions. Shows real-time
 * extension connectivity and session information.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Chrome, 
  Firefox, 
  Download,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Settings,
  Zap,
  Clock,
  Users,
  Shield,
  Info
} from 'lucide-react';
import { ExtensionStatus as ExtensionStatusType } from '@/types/social-protection';
import { cn } from '@/lib/utils';

interface ExtensionStatusProps {
  /** Extension status data */
  status: ExtensionStatusType | null;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Install extension handler */
  onInstall?: () => void;
  /** Update extension handler */
  onUpdate?: () => void;
  /** View settings handler */
  onViewSettings?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Browser detection utility
 */
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    return { name: 'Chrome', icon: Chrome, color: 'text-blue-600' };
  } else if (userAgent.includes('Firefox')) {
    return { name: 'Firefox', icon: Firefox, color: 'text-orange-600' };
  } else if (userAgent.includes('Edg')) {
    return { name: 'Edge', icon: Chrome, color: 'text-blue-500' };
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return { name: 'Safari', icon: Chrome, color: 'text-gray-600' };
  }
  
  return { name: 'Unknown', icon: Chrome, color: 'text-gray-600' };
};

/**
 * Get relative time string
 */
const getRelativeTime = (date: string): string => {
  const now = new Date();
  const syncDate = new Date(date);
  const diffMs = now.getTime() - syncDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return syncDate.toLocaleDateString();
};

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
  </Card>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Extension Status</h3>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

/**
 * Not installed state component
 */
const NotInstalledState: React.FC<{ 
  browserInfo: ReturnType<typeof getBrowserInfo>;
  onInstall?: () => void;
}> = ({ browserInfo, onInstall }) => {
  const BrowserIcon = browserInfo.icon;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <BrowserIcon className={cn('h-6 w-6', browserInfo.color)} />
          </div>
          <div>
            <CardTitle className="text-lg text-orange-900">Extension Not Installed</CardTitle>
            <p className="text-sm text-orange-700">Install the LinkShield extension for real-time protection</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            The browser extension provides real-time scanning, threat blocking, and content analysis 
            while you browse social media platforms.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Extension Features:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Real-time threat detection and blocking
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              Automatic content analysis
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Multi-platform monitoring
            </li>
          </ul>
        </div>

        <Button onClick={onInstall} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Install Extension for {browserInfo.name}
        </Button>
      </CardContent>
    </Card>
  );
};

/**
 * Installed state component
 */
const InstalledState: React.FC<{
  status: ExtensionStatusType;
  browserInfo: ReturnType<typeof getBrowserInfo>;
  onUpdate?: () => void;
  onViewSettings?: () => void;
  onRefresh?: () => void;
}> = ({ status, browserInfo, onUpdate, onViewSettings, onRefresh }) => {
  const BrowserIcon = browserInfo.icon;
  const isOutdated = status.update_available;

  return (
    <Card className={cn(
      'transition-all duration-200',
      isOutdated ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              isOutdated ? 'bg-yellow-100' : 'bg-green-100'
            )}>
              <BrowserIcon className={cn('h-6 w-6', browserInfo.color)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className={cn(
                  'text-lg',
                  isOutdated ? 'text-yellow-900' : 'text-green-900'
                )}>
                  Extension Installed
                </CardTitle>
                <CheckCircle className={cn(
                  'h-5 w-5',
                  isOutdated ? 'text-yellow-600' : 'text-green-600'
                )} />
              </div>
              <p className={cn(
                'text-sm',
                isOutdated ? 'text-yellow-700' : 'text-green-700'
              )}>
                {isOutdated ? 'Update available' : 'Up to date and running'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="ghost" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {onViewSettings && (
              <Button variant="outline" size="sm" onClick={onViewSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Update Alert */}
        {isOutdated && (
          <Alert className="border-yellow-300 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="flex items-center justify-between">
                <span>
                  Extension update available (v{status.latest_version})
                </span>
                {onUpdate && (
                  <Button variant="outline" size="sm" onClick={onUpdate}>
                    Update Now
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Status Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {status.version || 'Unknown'}
            </div>
            <div className="text-sm text-gray-500">Version</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {status.active_sessions}
            </div>
            <div className="text-sm text-gray-500">Active Sessions</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <div className={cn(
                'h-2 w-2 rounded-full',
                status.last_sync && new Date(status.last_sync).getTime() > Date.now() - 5 * 60 * 1000
                  ? 'bg-green-500'
                  : 'bg-yellow-500'
              )} />
              <span className="text-sm font-medium text-gray-900">
                {status.last_sync ? 'Synced' : 'Never'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {status.last_sync ? getRelativeTime(status.last_sync) : 'No sync'}
            </div>
          </div>
          
          <div className="text-center">
            <Badge variant={isOutdated ? 'secondary' : 'outline'} className="text-xs">
              {isOutdated ? 'Update Available' : 'Latest'}
            </Badge>
            <div className="text-sm text-gray-500 mt-1">Status</div>
          </div>
        </div>

        {/* Last Sync Details */}
        {status.last_sync && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 rounded-lg p-3">
            <Clock className="h-4 w-4" />
            <span>Last synchronized: {new Date(status.last_sync).toLocaleString()}</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href="/downloads" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Downloads
            </a>
          </Button>
          {onViewSettings && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onViewSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * ExtensionStatus Component
 * 
 * Displays comprehensive browser extension status including installation state,
 * version information, sync status, and active sessions. Provides installation
 * guidance and update notifications.
 * 
 * Features:
 * - Browser detection and appropriate extension links
 * - Installation status with visual indicators
 * - Version tracking and update notifications
 * - Sync status with real-time indicators
 * - Active session monitoring
 * - Quick access to settings and downloads
 * - Loading and error states
 * - Responsive design with clear status indicators
 * 
 * @param props - Component props
 * @returns JSX element representing the extension status
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4 - Extension status display and management
 */
export const ExtensionStatus: React.FC<ExtensionStatusProps> = ({
  status,
  isLoading = false,
  error,
  onRefresh,
  onInstall,
  onUpdate,
  onViewSettings,
  className
}) => {
  const browserInfo = getBrowserInfo();

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={onRefresh} />;
  }

  // Show not installed state
  if (!status || !status.extension_installed) {
    return (
      <div className={className}>
        <NotInstalledState 
          browserInfo={browserInfo}
          onInstall={onInstall}
        />
      </div>
    );
  }

  // Show installed state
  return (
    <div className={className}>
      <InstalledState
        status={status}
        browserInfo={browserInfo}
        onUpdate={onUpdate}
        onViewSettings={onViewSettings}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default ExtensionStatus;