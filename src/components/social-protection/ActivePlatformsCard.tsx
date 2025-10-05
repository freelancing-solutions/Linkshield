/**
 * @fileoverview Active Platforms Card Component
 * 
 * Displays the number of connected platforms with status indicators and quick actions.
 * Shows platform icons, connection status, and provides navigation to platform management.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Settings, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ConnectedPlatform, PlatformType } from '@/types/social-protection';

/**
 * Props for the ActivePlatformsCard component
 */
interface ActivePlatformsCardProps {
  /** Array of connected platforms */
  platforms: ConnectedPlatform[];
  /** Loading state */
  isLoading?: boolean;
  /** Callback for connecting new platform */
  onConnectPlatform?: () => void;
}

/**
 * Platform icon mapping
 */
const getPlatformIcon = (platform: PlatformType): string => {
  const icons = {
    facebook: '📘',
    instagram: '📷',
    twitter: '🐦',
    linkedin: '💼',
    tiktok: '🎵',
    telegram: '📱',
    discord: '🎮',
  };
  return icons[platform] || '🌐';
};

/**
 * Get status color for platform connection
 */
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'connected':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'disconnected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'error':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

/**
 * Active Platforms Card Component
 * 
 * Displays connected social media platforms with their status and provides
 * quick actions for managing platform connections.
 * 
 * @component
 * @example
 * ```tsx
 * import { ActivePlatformsCard } from '@/components/social-protection/ActivePlatformsCard';
 * 
 * function Dashboard() {
 *   const { data } = useSocialProtectionDashboard();
 *   
 *   return (
 *     <ActivePlatformsCard 
 *       platforms={data.connectedPlatforms}
 *       onConnectPlatform={() => setShowConnectModal(true)}
 *     />
 *   );
 * }
 * ```
 * 
 * @param props - Component props
 * @returns JSX element containing the active platforms card
 */
export function ActivePlatformsCard({ 
  platforms, 
  isLoading = false, 
  onConnectPlatform 
}: ActivePlatformsCardProps) {
  const connectedCount = platforms.filter(p => p.status === 'connected').length;
  const totalCount = platforms.length;

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Connected Platforms</CardTitle>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Connected Platforms</CardTitle>
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Platform count summary */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{connectedCount}</div>
              <p className="text-xs text-muted-foreground">
                of {totalCount} platforms active
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onConnectPlatform}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Connect
            </Button>
          </div>

          {/* Platform list */}
          <div className="space-y-2">
            {platforms.slice(0, 4).map((platform) => (
              <div
                key={platform.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getPlatformIcon(platform.platform)}
                  </span>
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {platform.platform.toLowerCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {platform.username}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={getStatusColor(platform.status)}
                >
                  {platform.status}
                </Badge>
              </div>
            ))}
          </div>

          {/* Show more platforms if there are more than 4 */}
          {platforms.length > 4 && (
            <div className="text-center">
              <Link href="/social-protection/platforms">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all {platforms.length} platforms
                </Button>
              </Link>
            </div>
          )}

          {/* Empty state */}
          {platforms.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">
                No platforms connected yet
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onConnectPlatform}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Connect Your First Platform
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}