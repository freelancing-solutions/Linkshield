/**
 * @fileoverview Connected Platforms List Component
 * 
 * Displays a detailed list of connected social media platforms with
 * status information, last sync times, and management actions.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Settings, 
  MoreVertical, 
  RefreshCw, 
  Unplug, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { ConnectedPlatform, PlatformType } from '@/types/social-protection';
import { formatDistanceToNow } from 'date-fns';

/**
 * Props for the ConnectedPlatformsList component
 */
interface ConnectedPlatformsListProps {
  /** Array of connected platforms */
  platforms: ConnectedPlatform[];
  /** Loading state */
  isLoading?: boolean;
  /** Callback for connecting new platform */
  onConnectPlatform?: () => void;
  /** Callback for disconnecting platform */
  onDisconnectPlatform?: (platformId: string) => void;
  /** Callback for syncing platform */
  onSyncPlatform?: (platformId: string) => void;
  /** Callback for viewing platform details */
  onViewPlatform?: (platformId: string) => void;
}

/**
 * Platform icon and display name mapping
 */
const getPlatformInfo = (platform: PlatformType): { icon: string; name: string; color: string } => {
  const platformInfo = {
    [PlatformType.FACEBOOK]: { icon: '📘', name: 'Facebook', color: 'bg-blue-100 text-blue-800' },
    [PlatformType.INSTAGRAM]: { icon: '📷', name: 'Instagram', color: 'bg-pink-100 text-pink-800' },
    [PlatformType.TWITTER]: { icon: '🐦', name: 'Twitter', color: 'bg-sky-100 text-sky-800' },
    [PlatformType.LINKEDIN]: { icon: '💼', name: 'LinkedIn', color: 'bg-blue-100 text-blue-800' },
    [PlatformType.TIKTOK]: { icon: '🎵', name: 'TikTok', color: 'bg-purple-100 text-purple-800' },
    [PlatformType.YOUTUBE]: { icon: '📺', name: 'YouTube', color: 'bg-red-100 text-red-800' },
    [PlatformType.SNAPCHAT]: { icon: '👻', name: 'Snapchat', color: 'bg-yellow-100 text-yellow-800' },
    [PlatformType.PINTEREST]: { icon: '📌', name: 'Pinterest', color: 'bg-red-100 text-red-800' },
    [PlatformType.REDDIT]: { icon: '🤖', name: 'Reddit', color: 'bg-orange-100 text-orange-800' },
    [PlatformType.DISCORD]: { icon: '🎮', name: 'Discord', color: 'bg-indigo-100 text-indigo-800' },
  };
  return platformInfo[platform] || { icon: '🌐', name: 'Unknown', color: 'bg-gray-100 text-gray-800' };
};

/**
 * Get status information with color and icon
 */
const getStatusInfo = (status: string): { 
  color: string; 
  icon: React.ReactNode;
  description: string;
} => {
  switch (status.toLowerCase()) {
    case 'connected':
      return {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        icon: <CheckCircle className="h-3 w-3" />,
        description: 'Active and syncing'
      };
    case 'disconnected':
      return {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        icon: <AlertCircle className="h-3 w-3" />,
        description: 'Connection lost'
      };
    case 'syncing':
      return {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        icon: <RefreshCw className="h-3 w-3 animate-spin" />,
        description: 'Syncing data'
      };
    case 'error':
      return {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        icon: <AlertCircle className="h-3 w-3" />,
        description: 'Needs attention'
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        icon: <Clock className="h-3 w-3" />,
        description: 'Unknown status'
      };
  }
};

/**
 * Connected Platforms List Component
 * 
 * Displays a comprehensive list of connected platforms with management
 * capabilities and detailed status information.
 * 
 * @component
 * @example
 * ```tsx
 * import { ConnectedPlatformsList } from '@/components/social-protection/ConnectedPlatformsList';
 * 
 * function PlatformsPage() {
 *   const { data } = useSocialProtectionDashboard();
 *   
 *   return (
 *     <ConnectedPlatformsList 
 *       platforms={data.connectedPlatforms}
 *       onConnectPlatform={() => setShowConnectModal(true)}
 *       onDisconnectPlatform={disconnectMutation.mutate}
 *       onSyncPlatform={syncMutation.mutate}
 *     />
 *   );
 * }
 * ```
 * 
 * @param props - Component props
 * @returns JSX element containing the connected platforms list
 */
export function ConnectedPlatformsList({ 
  platforms, 
  isLoading = false,
  onConnectPlatform,
  onDisconnectPlatform,
  onSyncPlatform,
  onViewPlatform
}: ConnectedPlatformsListProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Connected Platforms</CardTitle>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Connected Platforms</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {platforms.length} platform{platforms.length !== 1 ? 's' : ''} connected
          </p>
        </div>
        <Button
          onClick={onConnectPlatform}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Connect Platform
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {platforms.map((platform) => {
            const platformInfo = getPlatformInfo(platform.platform);
            const statusInfo = getStatusInfo(platform.status);
            
            return (
              <div
                key={platform.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* Platform Icon */}
                  <div className={`p-2 rounded-full ${platformInfo.color}`}>
                    <span className="text-lg">{platformInfo.icon}</span>
                  </div>
                  
                  {/* Platform Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{platformInfo.name}</h3>
                      <Badge className={statusInfo.color}>
                        <div className="flex items-center gap-1">
                          {statusInfo.icon}
                          <span className="capitalize">{platform.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>@{platform.username}</span>
                      {platform.lastSync && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              Synced {formatDistanceToNow(new Date(platform.lastSync), { addSuffix: true })}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {statusInfo.description}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Quick sync button for connected platforms */}
                  {platform.status === 'connected' && onSyncPlatform && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSyncPlatform(platform.id)}
                      className="h-8 w-8 p-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {/* More actions dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onViewPlatform && (
                        <DropdownMenuItem onClick={() => onViewPlatform(platform.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem asChild>
                        <Link href={`/social-protection/platforms/${platform.id}/settings`}>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      
                      {onSyncPlatform && (
                        <DropdownMenuItem onClick={() => onSyncPlatform(platform.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </DropdownMenuItem>
                      )}
                      
                      {onDisconnectPlatform && (
                        <DropdownMenuItem 
                          onClick={() => onDisconnectPlatform(platform.id)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Unplug className="h-4 w-4 mr-2" />
                          Disconnect
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
          
          {/* Empty state */}
          {platforms.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No platforms connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your social media accounts to start monitoring your digital presence.
              </p>
              <Button onClick={onConnectPlatform} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Connect Your First Platform
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}