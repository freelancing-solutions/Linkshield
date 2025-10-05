'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useSocialProtectionDashboard } from '@/hooks/social-protection';
import { Button } from '@/components/ui/button';
import { 
  ActivePlatformsCard,
  RiskScoreCard,
  RecentAlertsCard,
  AlgorithmHealthCard,
  ConnectedPlatformsList
} from '@/components/social-protection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, RefreshCw, Shield, TrendingUp, AlertTriangle, Activity, Users, Zap } from 'lucide-react';
import Link from 'next/link';

/**
 * Social Protection Dashboard Page
 * 
 * Main dashboard for social media protection features including:
 * - Platform connection status
 * - Risk assessment overview
 * - Crisis alerts summary
 * - Algorithm health monitoring
 * - Extension status and analytics
 */
export default function SocialProtectionPage() {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useSocialProtectionDashboard();

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 w-80 bg-muted animate-pulse rounded" />
          <div className="h-5 w-96 bg-muted animate-pulse rounded mt-2" />
        </div>
        
        {/* Overview Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Social Protection Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your social media security and algorithm health
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-12 px-4 bg-muted/50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load dashboard</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
            We couldn't load your social protection data. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Helper function to get risk level color
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Helper function to get platform status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'scanning': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      case 'disconnected': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Social Protection Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your social media security and algorithm health
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ActivePlatformsCard 
          platforms={data.connectedPlatforms}
          onConnectPlatform={() => {
            // TODO: Open connect platform modal
            console.log('Connect platform clicked');
          }}
        />

        <RiskScoreCard 
          overallScore={data.overallRiskScore}
          previousScore={data.previousRiskScore}
          lastUpdated={data.lastUpdated}
        />

        <RecentAlertsCard 
          alerts={data.recentAlerts}
          onViewAlert={(alertId) => {
            // TODO: Navigate to alert details
            console.log('View alert:', alertId);
          }}
          onResolveAlert={(alertId) => {
            // TODO: Resolve alert
            console.log('Resolve alert:', alertId);
          }}
        />

        <AlgorithmHealthCard 
          healthData={data.algorithmHealthData}
          lastUpdated={data.lastUpdated}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConnectedPlatformsList 
          platforms={data.connectedPlatforms}
          onManagePlatform={(platformId) => {
            // TODO: Open platform management modal
            console.log('Manage platform:', platformId);
          }}
          onDisconnectPlatform={(platformId) => {
            // TODO: Disconnect platform
            console.log('Disconnect platform:', platformId);
          }}
        />

        {/* Recent Crisis Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Crisis Alerts</CardTitle>
            <CardDescription>
              Latest security threats and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recent_alerts.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All clear!</h3>
                <p className="text-sm text-muted-foreground">
                  No active security alerts at this time
                </p>
              </div>
            ) : (
              data.recent_alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'high' ? 'text-orange-500' :
                    alert.severity === 'medium' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {alert.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getRiskColor(alert.severity)}
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))
            )}
            {data.recent_alerts.length > 0 && (
              <Button variant="outline" className="w-full" asChild>
                <Link href="/social-protection/alerts">
                  View All Alerts
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Extension Status */}
      <Card>
        <CardHeader>
          <CardTitle>Extension Status</CardTitle>
          <CardDescription>
            Browser extension connectivity and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                data.extension_status.installed ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="font-medium">Installation</p>
                <p className="text-sm text-muted-foreground">
                  {data.extension_status.installed ? 'Installed' : 'Not installed'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                data.extension_status.connected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="font-medium">Connection</p>
                <p className="text-sm text-muted-foreground">
                  {data.extension_status.connected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Scans Today</p>
                <p className="text-sm text-muted-foreground">
                  {data.extension_analytics.scans_today} scans
                </p>
              </div>
            </div>
          </div>
          
          {!data.extension_status.installed && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">Install Browser Extension</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Install our browser extension for real-time protection while browsing social media.
                  </p>
                  <Button size="sm" className="mt-3" asChild>
                    <Link href="/social-protection/extension">
                      Download Extension
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}