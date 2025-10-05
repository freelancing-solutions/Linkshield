'use client';

import { useState } from 'react';
import { useSocialProtectionOverview } from '@/hooks/dashboard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Activity, AlertTriangle, TrendingUp } from 'lucide-react';

interface SocialProtectionOverviewPanelProps {
  projects?: Array<{ id: string; name: string }>;
}

/**
 * Social Protection Overview Panel Component
 * 
 * Displays high-level metrics for social protection features including
 * extension status, bot status, and algorithm health.
 */
export function SocialProtectionOverviewPanel({
  projects,
}: SocialProtectionOverviewPanelProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
    undefined
  );

  const { data, isLoading, error } = useSocialProtectionOverview(selectedProjectId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {projects && projects.length > 0 && (
          <Skeleton className="h-10 w-[200px]" />
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
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

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Project Filter */}
      {projects && projects.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by project:</span>
          <Select
            value={selectedProjectId || 'all'}
            onValueChange={(value) =>
              setSelectedProjectId(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Extension Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Extension</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.extension_status.installed ? 'Connected' : 'Not Installed'}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.extension_status.installed
                ? `${data.extension_status.threats_blocked} threats blocked`
                : 'Install to start protecting'}
            </p>
          </CardContent>
        </Card>

        {/* Bot Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bot_status.active_bots}</div>
            <p className="text-xs text-muted-foreground">
              {data.bot_status.total_analyses} analyses performed
            </p>
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
              {data.algorithm_health.overall_health}
            </div>
            <p className="text-xs text-muted-foreground">
              Visibility: {data.algorithm_health.visibility_score}%
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
            <div className="text-2xl font-bold">{data.crisis_alerts_count}</div>
            <p className="text-xs text-muted-foreground">
              {data.recent_analyses} recent analyses
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
