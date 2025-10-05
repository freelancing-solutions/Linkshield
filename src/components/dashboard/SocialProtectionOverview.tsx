'use client';

import { useState } from 'react';
import { useSocialProtectionOverview, useExtensionStatus, useExtensionAnalytics, useBotHealth, useExtensionSettings, useUpdateExtensionSettings, useSyncExtension, useRestartBot } from '@/hooks/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Activity, AlertTriangle, TrendingUp, Settings, RefreshCw, Play, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SocialProtectionOverviewProps {
  projectId?: string;
}

/**
 * Social Protection Overview Component
 * 
 * Comprehensive overview of social protection features including:
 * - Extension status and settings
 * - Bot health and management
 * - Algorithm health analysis
 * - Crisis alerts monitoring
 */
export function SocialProtectionOverview({ projectId }: SocialProtectionOverviewProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestartingBot, setIsRestartingBot] = useState<string | null>(null);

  // Data queries
  const { data: overview, isLoading: isLoadingOverview, error: overviewError } = useSocialProtectionOverview(projectId);
  const { data: extensionStatus, isLoading: isLoadingStatus } = useExtensionStatus();
  const { data: extensionAnalytics, isLoading: isLoadingAnalytics } = useExtensionAnalytics();
  const { data: botHealth, isLoading: isLoadingBotHealth } = useBotHealth();
  const { data: extensionSettings, isLoading: isLoadingSettings } = useExtensionSettings();

  // Mutations
  const updateSettings = useUpdateExtensionSettings();
  const syncExtension = useSyncExtension();
  const restartBot = useRestartBot();

  const isLoading = isLoadingOverview || isLoadingStatus || isLoadingAnalytics || isLoadingBotHealth || isLoadingSettings;

  const handleSettingChange = async (setting: string, value: boolean) => {
    try {
      await updateSettings.mutateAsync({ [setting]: value });
      toast.success('Extension settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncExtension.mutateAsync();
      toast.success('Extension sync completed');
    } catch (error) {
      toast.error('Extension sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleBotRestart = async (serviceName: string) => {
    setIsRestartingBot(serviceName);
    try {
      await restartBot.mutateAsync(serviceName);
      toast.success(`${serviceName} service restarted successfully`);
    } catch (error) {
      toast.error(`Failed to restart ${serviceName} service`);
    } finally {
      setIsRestartingBot(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (overviewError) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">Failed to load social protection data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!overview || !extensionStatus || !extensionAnalytics || !botHealth || !extensionSettings) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Protection Overview</h2>
          <p className="text-muted-foreground">Monitor and manage your social media protection</p>
        </div>
        <Button onClick={handleSync} disabled={isSyncing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          Sync Extension
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Extension Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Extension Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {extensionStatus.installed ? 'Connected' : 'Not Installed'}
            </div>
            <p className="text-xs text-muted-foreground">
              Version {extensionStatus.version}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">
                {extensionStatus.total_scans.toLocaleString()} scans
              </p>
              <p className="text-xs text-muted-foreground">
                {extensionStatus.threats_blocked} threats blocked
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bot Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {botHealth.overall_status}
            </div>
            <p className="text-xs text-muted-foreground">
              {botHealth.services.length} services
            </p>
            <div className="mt-2 space-y-1">
              {botHealth.services.map((service) => (
                <div key={service.service_name} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{service.service_name}</span>
                  <Badge variant={service.status === 'online' ? 'success' : 'destructive'} className="text-xs">
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Algorithm Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {overview.algorithm_health.overall_health}
            </div>
            <p className="text-xs text-muted-foreground">
              Visibility: {overview.algorithm_health.visibility_score}%
            </p>
            <p className="text-xs text-muted-foreground">
              Engagement: {overview.algorithm_health.engagement_score}%
            </p>
          </CardContent>
        </Card>

        {/* Crisis Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crisis Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.crisis_alerts_count}</div>
            <p className="text-xs text-muted-foreground">
              {overview.recent_analyses} recent analyses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Extension Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Extension Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Real-time Analysis</p>
                <p className="text-sm text-muted-foreground">Analyze content in real-time</p>
              </div>
              <Switch
                checked={extensionSettings.real_time_analysis}
                onCheckedChange={(checked) => handleSettingChange('real_time_analysis', checked)}
                aria-label="Real-time Analysis"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Advanced Warnings</p>
                <p className="text-sm text-muted-foreground">Get early warning notifications</p>
              </div>
              <Switch
                checked={extensionSettings.advanced_warnings}
                onCheckedChange={(checked) => handleSettingChange('advanced_warnings', checked)}
                aria-label="Advanced Warnings"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Sync</p>
                <p className="text-sm text-muted-foreground">Automatically sync extension data</p>
              </div>
              <Switch
                checked={extensionSettings.auto_sync}
                onCheckedChange={(checked) => handleSettingChange('auto_sync', checked)}
                aria-label="Auto Sync"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bot Management */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bot Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {botHealth.services.map((service) => (
                <div key={service.service_name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'online' ? 'bg-green-500' : 
                      service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium capitalize">{service.service_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Uptime: {service.uptime_percentage}%
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleBotRestart(service.service_name)}
                    disabled={isRestartingBot === service.service_name || service.status === 'online'}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    {isRestartingBot === service.service_name ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                    Restart
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Visibility Score</p>
                  <p className="text-2xl font-bold">{overview.algorithm_health.visibility_score}%</p>
                </div>
                <Button size="sm" variant="outline">
                  Analyze Visibility
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Engagement Score</p>
                  <p className="text-2xl font-bold">{overview.algorithm_health.engagement_score}%</p>
                </div>
                <Button size="sm" variant="outline">
                  Analyze Engagement
                </Button>
              </div>
              {overview.algorithm_health.penalty_detected && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="font-medium">Penalty Detected</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Algorithm penalty detected on your account
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}