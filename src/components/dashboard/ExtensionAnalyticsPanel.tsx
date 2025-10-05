/**
 * ExtensionAnalyticsPanel Component
 * 
 * A comprehensive analytics panel for displaying browser extension usage statistics
 * and performance metrics. Provides interactive charts, time range selection, and
 * data export functionality for monitoring extension activity.
 * 
 * Features:
 * - Interactive bar charts for analytics visualization
 * - Time range selection (1h, 24h, 7d, 30d)
 * - Data export functionality (JSON format)
 * - Loading states with skeleton placeholders
 * - Responsive chart layout
 * - Real-time data updates
 * - Extension usage metrics display
 * - Performance trend analysis
 * 
 * @example
 * ```tsx
 * <ExtensionAnalyticsPanel />
 * ```
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExtensionAnalytics } from '@/hooks/dashboard/use-social-protection';
import { Download, TrendingUp } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type TimeRange = '1h' | '24h' | '7d' | '30d';

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  '1h': 'Last Hour',
  '24h': 'Last 24 Hours',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
};

/**
 * Extension Analytics Panel Component
 * 
 * Displays comprehensive analytics for browser extension usage with interactive
 * charts and time range selection. Provides data export functionality and
 * real-time metrics visualization.
 * 
 * @returns {JSX.Element} The rendered extension analytics panel
 * 
 * @example
 * ```tsx
 * // Display extension analytics in dashboard
 * <ExtensionAnalyticsPanel />
 * ```
 */
export function ExtensionAnalyticsPanel() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const { data: analytics, isLoading } = useExtensionAnalytics(timeRange);

  const handleExport = () => {
    if (!analytics) return;

    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extension-analytics-${timeRange}-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  const platformData = analytics?.platform_breakdown
    ? Object.entries(analytics.platform_breakdown).map(([platform, count]) => ({
        platform,
        count,
      }))
    : [];

  const totalProtections = analytics?.total_protections ?? 0;
  const blockedThreats = analytics?.blocked_threats ?? 0;
  const warningsShown = analytics?.warnings_shown ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Extension Analytics</CardTitle>
            <CardDescription>
              Protection activity across all platforms
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIME_RANGE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!analytics}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Protections</p>
            <p className="text-2xl font-bold">{totalProtections.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Blocked Threats</p>
            <p className="text-2xl font-bold text-red-600">{blockedThreats.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Warnings Shown</p>
            <p className="text-2xl font-bold text-yellow-600">{warningsShown.toLocaleString()}</p>
          </div>
        </div>

        {/* Platform Breakdown Chart */}
        {platformData.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Platform Breakdown
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <XAxis
                  dataKey="platform"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Protections"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>No analytics data available for the selected time range</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
