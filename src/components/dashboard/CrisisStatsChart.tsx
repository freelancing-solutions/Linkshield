'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, Circle, Square, Triangle, Diamond } from 'lucide-react';
import { useCrisisStats } from '@/hooks/dashboard/use-social-protection';
import { CrisisSeverity, CrisisType } from '@/types/dashboard';

/**
 * Time range options for crisis statistics
 */
const TIME_RANGES = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
] as const;

/**
 * Accessible color mapping for crisis severity levels with high contrast
 */
const SEVERITY_COLORS: Record<CrisisSeverity, string> = {
  critical: '#dc2626', // red-600 - higher contrast
  high: '#ea580c',     // orange-600 - higher contrast
  medium: '#ca8a04',   // yellow-600 - higher contrast
  low: '#16a34a',      // green-600 - higher contrast
};

/**
 * Accessible color mapping for crisis types with high contrast
 */
const TYPE_COLORS: Record<CrisisType, string> = {
  algorithm_penalty: '#7c3aed', // violet-600 - higher contrast
  engagement_drop: '#0891b2',   // cyan-600 - higher contrast
  visibility_loss: '#d97706',   // amber-600 - higher contrast
  content_flagged: '#dc2626',   // red-600 - higher contrast
  account_restriction: '#db2777', // pink-600 - higher contrast
};

/**
 * Pattern/shape mapping for severity levels to supplement color
 */
const SEVERITY_PATTERNS: Record<CrisisSeverity, {
  icon: React.ComponentType<{ className?: string }>;
  pattern: string;
  label: string;
}> = {
  critical: {
    icon: Triangle,
    pattern: 'diagonal-lines',
    label: 'Critical (triangle pattern)'
  },
  high: {
    icon: Diamond,
    pattern: 'dots',
    label: 'High (diamond pattern)'
  },
  medium: {
    icon: Square,
    pattern: 'horizontal-lines',
    label: 'Medium (square pattern)'
  },
  low: {
    icon: Circle,
    pattern: 'solid',
    label: 'Low (circle pattern)'
  },
};

/**
 * Pattern/shape mapping for crisis types to supplement color
 */
const TYPE_PATTERNS: Record<CrisisType, {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}> = {
  algorithm_penalty: { icon: Triangle, label: 'Algorithm Penalty (triangle)' },
  engagement_drop: { icon: TrendingDown, label: 'Engagement Drop (trending down)' },
  visibility_loss: { icon: AlertTriangle, label: 'Visibility Loss (alert triangle)' },
  content_flagged: { icon: AlertTriangle, label: 'Content Flagged (alert triangle)' },
  account_restriction: { icon: Circle, label: 'Account Restriction (circle)' },
};

interface CrisisStatsChartProps {
  /**
   * Additional CSS classes for styling
   */
  className?: string;
}

/**
 * CrisisStatsChart component displays crisis trends over time with accessible charts
 * 
 * Features:
 * - Time range selector (7d, 30d, 90d)
 * - Line chart showing crisis trends over time
 * - Severity distribution pie chart with patterns
 * - Type breakdown visualization with icons
 * - Trend indicators and summary statistics
 * - WCAG AA compliant colors and patterns
 * 
 * @param props - Component props
 * @returns JSX element
 */
export const CrisisStatsChart: React.FC<CrisisStatsChartProps> = ({
  className = '',
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useCrisisStats(selectedTimeRange);

  /**
   * Handle time range selection change
   */
  const handleTimeRangeChange = (timeRange: '7d' | '30d' | '90d') => {
    setSelectedTimeRange(timeRange);
  };

  /**
   * Format timeline data for the line chart
   */
  const formatTimelineData = () => {
    if (!stats?.timeline) return [];
    
    return stats.timeline.map((point) => ({
      date: new Date(point.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      total: point.count,
      critical: point.severity_distribution.critical || 0,
      high: point.severity_distribution.high || 0,
      medium: point.severity_distribution.medium || 0,
      low: point.severity_distribution.low || 0,
    }));
  };

  /**
   * Format severity breakdown data for pie chart with accessibility info
   */
  const formatSeverityData = () => {
    if (!stats?.severity_breakdown) return [];
    
    return stats.severity_breakdown.map((item) => ({
      name: item.severity.charAt(0).toUpperCase() + item.severity.slice(1),
      value: item.count,
      percentage: item.percentage,
      color: SEVERITY_COLORS[item.severity],
      pattern: SEVERITY_PATTERNS[item.severity],
    }));
  };

  /**
   * Format type breakdown data for pie chart with accessibility info
   */
  const formatTypeData = () => {
    if (!stats?.type_breakdown) return [];
    
    return stats.type_breakdown.map((item) => ({
      name: item.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: item.count,
      percentage: item.percentage,
      color: TYPE_COLORS[item.type],
      pattern: TYPE_PATTERNS[item.type],
    }));
  };

  /**
   * Calculate trend direction and percentage
   */
  const getTrendInfo = () => {
    const timeline = stats?.timeline || [];
    if (timeline.length < 2) return null;
    
    const recent = timeline.slice(-7); // Last 7 days
    const previous = timeline.slice(-14, -7); // Previous 7 days
    
    const recentAvg = recent.reduce((sum, point) => sum + point.count, 0) / recent.length;
    const previousAvg = previous.reduce((sum, point) => sum + point.count, 0) / previous.length;
    
    if (previousAvg === 0) return null;
    
    const change = ((recentAvg - previousAvg) / previousAvg) * 100;
    
    return {
      direction: change > 0 ? 'up' : 'down',
      percentage: Math.abs(change),
      isSignificant: Math.abs(change) > 10,
    };
  };

  const trendInfo = getTrendInfo();
  const timelineData = formatTimelineData();
  const severityData = formatSeverityData();
  const typeData = formatTypeData();

  if (isLoading) {
    return (
      <Card className={`crisis-stats-chart ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              {TIME_RANGES.map((range) => (
                <Skeleton key={range.value} className="h-8 w-16" />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`crisis-stats-chart ${className}`}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load Crisis statistics. Please try again.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className={`crisis-stats-chart ${className}`}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No crisis data available for the selected time range.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`crisis-stats-chart ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Crisis Trends
            </CardTitle>
            {trendInfo && (
              <Badge
                variant={trendInfo.direction === 'up' ? 'destructive' : 'secondary'}
                className="flex items-center gap-1"
                title={`Crisis trend is ${trendInfo.direction} by ${trendInfo.percentage.toFixed(1)}%`}
              >
                {trendInfo.direction === 'up' ? (
                  <TrendingUp className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3 w-3" aria-hidden="true" />
                )}
                {trendInfo.percentage.toFixed(1)}%
              </Badge>
            )}
          </div>
          
          {/* Time Range Selector */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg" role="tablist" aria-label="Time range selector">
            {TIME_RANGES.map((range) => (
              <Button
                key={range.value}
                variant={selectedTimeRange === range.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleTimeRangeChange(range.value)}
                className="h-8 px-3"
                role="tab"
                aria-selected={selectedTimeRange === range.value}
                aria-label={`Show data for ${range.label}`}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Summary Stats with accessible color indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              {stats.total_crises}
            </div>
            <div className="text-sm text-muted-foreground">Total Crises</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-2">
              <Circle className="h-5 w-5" aria-hidden="true" />
              {stats.active_crises}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
              <Circle className="h-5 w-5 fill-current" aria-hidden="true" />
              {stats.resolved_crises}
            </div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              <Square className="h-5 w-5" aria-hidden="true" />
              {stats.avg_resolution_time}h
            </div>
            <div className="text-sm text-muted-foreground">Avg Resolution</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timeline Chart */}
        <div>
          <h4 className="text-sm font-medium mb-3">Crisis Timeline</h4>
          <div className="h-64" role="img" aria-label="Crisis timeline chart showing trends over time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={SEVERITY_COLORS.critical}
                  strokeWidth={3}
                  dot={{ fill: SEVERITY_COLORS.critical, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: SEVERITY_COLORS.critical, strokeWidth: 2 }}
                  name="Total Crises"
                />
                <Line
                  type="monotone"
                  dataKey="critical"
                  stroke={SEVERITY_COLORS.critical}
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={false}
                  name="Critical"
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke={SEVERITY_COLORS.high}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  name="High"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Severity Breakdown */}
          <div>
            <h4 className="text-sm font-medium mb-3">By Severity</h4>
            <div className="h-48" role="img" aria-label="Crisis breakdown by severity level">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell 
                        key={`severity-${index}`} 
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value} (${props.payload.percentage.toFixed(1)}%)`,
                      props.payload.pattern.label,
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                    formatter={(value, entry: any) => (
                      <span className="flex items-center gap-1">
                        {entry.payload && entry.payload.pattern && (
                          <entry.payload.pattern.icon className="h-3 w-3" aria-hidden="true" />
                        )}
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Accessible legend with patterns */}
            <div className="mt-2 space-y-1">
              {severityData.map((item, index) => {
                const PatternIcon = item.pattern.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <PatternIcon className="h-3 w-3" aria-hidden="true" />
                    <span>{item.name}: {item.value} ({item.percentage.toFixed(1)}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Type Breakdown */}
          <div>
            <h4 className="text-sm font-medium mb-3">By Type</h4>
            <div className="h-48" role="img" aria-label="Crisis breakdown by type">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell 
                        key={`type-${index}`} 
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value} (${props.payload.percentage.toFixed(1)}%)`,
                      props.payload.pattern.label,
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                    formatter={(value, entry: any) => (
                      <span className="flex items-center gap-1">
                        {entry.payload && entry.payload.pattern && (
                          <entry.payload.pattern.icon className="h-3 w-3" aria-hidden="true" />
                        )}
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Accessible legend with patterns */}
            <div className="mt-2 space-y-1">
              {typeData.map((item, index) => {
                const PatternIcon = item.pattern.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <PatternIcon className="h-3 w-3" aria-hidden="true" />
                    <span>{item.name}: {item.value} ({item.percentage.toFixed(1)}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};