/**
 * ExtensionStatusCard Component
 * 
 * A status card component that displays the current connection status and activity
 * information for the LinkShield browser extension. Provides visual indicators for
 * connection status, last activity timestamps, and available features based on
 * the user's subscription plan.
 * 
 * Features:
 * - Real-time extension connection status monitoring
 * - Last activity timestamp display with relative formatting
 * - Feature availability indicators based on subscription plan
 * - Loading states with skeleton placeholders
 * - Error handling with user-friendly messages
 * - Visual status indicators with icons and badges
 * - Download/installation links for disconnected extensions
 * - Responsive card layout with proper spacing
 * - Integration with social protection hooks
 * - Accessibility support with proper ARIA labels
 * 
 * @example
 * ```tsx
 * <ExtensionStatusCard />
 * ```
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useExtensionStatus } from '@/hooks/dashboard/use-social-protection';
import { CheckCircle2, XCircle, ExternalLink, Download } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

/**
 * Extension Status Card Component
 * 
 * Displays the current status of the LinkShield browser extension including
 * connection status, last activity, and available features. Handles loading
 * states and provides appropriate actions for different connection states.
 * 
 * @returns {JSX.Element} The rendered extension status card
 * 
 * @example
 * ```tsx
 * // Display extension status in dashboard
 * <ExtensionStatusCard />
 * ```
 * 
 * @features
 * - Connection status monitoring with visual indicators
 * - Last activity tracking with relative timestamps
 * - Feature availability display based on subscription
 * - Loading states with skeleton UI
 * - Error handling with fallback content
 * - Download links for extension installation
 */
export function ExtensionStatusCard() {
  const { data: status, isLoading, error } = useExtensionStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Extension Status</CardTitle>
          <CardDescription>Unable to load extension status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Failed to fetch extension status. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isConnected = status?.is_connected ?? false;
  const lastActivity = status?.last_activity;
  const features = status?.features_by_plan ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Browser Extension</CardTitle>
            <CardDescription>
              {isConnected
                ? 'Your extension is connected and protecting you'
                : 'Install the extension to enable protection'}
            </CardDescription>
          </div>
          <Badge
            variant={isConnected ? 'default' : 'destructive'}
            className="flex items-center gap-1"
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Disconnected
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            {lastActivity && (
              <div className="text-sm text-muted-foreground">
                Last activity:{' '}
                <span className="font-medium text-foreground">
                  {formatDistanceToNow(new Date(lastActivity), { addSuffix: true })}
                </span>
              </div>
            )}

            {features.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Features</h4>
                <ul className="space-y-1">
                  {features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/extension/analytics">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Install the LinkShield browser extension to enable real-time protection across social
              media platforms.
            </p>
            <Button asChild className="w-full">
              <Link href="/extension/install">
                <Download className="h-4 w-4 mr-2" />
                Install Extension
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
