/**
 * @fileoverview Extension Analytics Component
 * 
 * Displays comprehensive browser extension analytics including scan statistics,
 * threat blocking metrics, content analysis data, and platform monitoring
 * information with interactive charts and time-series data.
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  Shield, 
  Zap,
  Eye,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Activity,
  Target
} from 'lucide-react';
import { ExtensionAnalytics as ExtensionAnalyticsType, AnalyticsDataPoint } from '@/types/social-protection';
import { getPlatformIcon, getPlatformColor } from '@/lib/utils/social-protection';
import { cn } from '@/lib/utils';

interface ExtensionAnalyticsProps {
  /** Extension analytics data */
  analytics: ExtensionAnalyticsType | null;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Time range for analytics */
  timeRange?: '7d' | '30d' | '90d';
  /** Time range change handler */
  onTimeRangeChange?: (range: '7d' | '30d' | '90d') => void;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Export handler */
  onExport?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Time range configuration
 */
const TIME_RANGE_CONFIG = {
  '7d': { label: 'Last 7 Days', days: 7 },
  '30d': { label: 'Last 30 Days', days: 30 },
  '90d': { label: 'Last 90 Days', days: 90 }
};

/**
 * Chart colors
 */
const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

/**
 * Platform colors for pie chart
 */
const PLATFORM_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

/**
 * Format number with abbreviations
 */
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Calculate percentage change
 */
const calculateChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
  if (previous === 0) return { value: 0, isPositive: true };
  const change = ((current - previous) / previous) * 100;
  return { value: Math.abs(change), isPositive: change >= 0 };
};

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Analytics</h3>
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
 * Empty state component
 */
const EmptyState: React.FC = () => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
      <Activity className="h-12 w-12 text-gray-400" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-sm text-gray-500">
          Start using the extension to see analytics data here.
        </p>
      </div>
    </CardContent>
  </Card>
);

/**
 * Metric card component
 */
const MetricCard: React.FC<{
  title: string;
  value: number;
  change?: { value: number; isPositive: boolean };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = ({ title, value, change, icon: Icon, color }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
          {change && (
            <div className={cn(
              'flex items-center gap-1 text-sm',
              change.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              {change.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{change.value.toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-full', color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Custom tooltip component
 */
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">{formatNumber(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * ExtensionAnalytics Component
 * 
 * Displays comprehensive browser extension analytics with interactive charts,
 * key performance metrics, and platform-specific insights. Provides detailed
 * analysis of extension usage, threat detection, and content scanning activities.
 * 
 * Features:
 * - Key metrics dashboard with trend indicators
 * - Interactive time-series charts for scans and threats
 * - Platform distribution analysis
 * - Threat detection effectiveness metrics
 * - Time range selection and filtering
 * - Export functionality for reports
 * - Real-time data refresh capabilities
 * - Responsive design with mobile optimization
 * - Loading and error states
 * 
 * @param props - Component props
 * @returns JSX element representing the extension analytics
 * 
 * Requirements: 6.5, 6.6, 6.7 - Extension analytics display and visualization
 */
export const ExtensionAnalytics: React.FC<ExtensionAnalyticsProps> = ({
  analytics,
  isLoading = false,
  error,
  timeRange = '30d',
  onTimeRangeChange,
  onRefresh,
  onExport,
  className
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'scans' | 'threats'>('scans');

  // Show loading state
  if (isLoading) {
    return (
      <div className={className}>
        <LoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={onRefresh} />;
  }

  // Show empty state
  if (!analytics) {
    return <EmptyState />;
  }

  // Prepare chart data
  const chartData = analytics.time_series.map(point => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    scans: point.scans,
    threats: point.threats
  }));

  // Prepare platform data for pie chart
  const platformData = analytics.platforms_monitored.map((platform, index) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: Math.floor(Math.random() * 100) + 20, // Mock data - replace with real platform-specific metrics
    color: PLATFORM_COLORS[index % PLATFORM_COLORS.length]
  }));

  // Calculate trends (mock calculation - replace with real trend data)
  const totalScansChange = calculateChange(analytics.total_scans, analytics.total_scans * 0.8);
  const threatsBlockedChange = calculateChange(analytics.threats_blocked, analytics.threats_blocked * 0.9);
  const contentAnalyzedChange = calculateChange(analytics.content_analyzed, analytics.content_analyzed * 0.85);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Extension Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor your extension's performance and protection metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TIME_RANGE_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Scans"
          value={analytics.total_scans}
          change={totalScansChange}
          icon={Eye}
          color="bg-blue-500"
        />
        <MetricCard
          title="Threats Blocked"
          value={analytics.threats_blocked}
          change={threatsBlockedChange}
          icon={Shield}
          color="bg-red-500"
        />
        <MetricCard
          title="Content Analyzed"
          value={analytics.content_analyzed}
          change={contentAnalyzedChange}
          icon={Zap}
          color="bg-green-500"
        />
        <MetricCard
          title="Platforms Monitored"
          value={analytics.platforms_monitored.length}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
              <Select value={selectedMetric} onValueChange={(value: 'scans' | 'threats') => setSelectedMetric(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scans">Scans</SelectItem>
                  <SelectItem value="threats">Threats</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={selectedMetric === 'scans' ? CHART_COLORS.primary : CHART_COLORS.danger}
                  fill={selectedMetric === 'scans' ? CHART_COLORS.primary : CHART_COLORS.danger}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Platform Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Detailed Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="scans"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                name="Scans"
              />
              <Line
                type="monotone"
                dataKey="threats"
                stroke={CHART_COLORS.danger}
                strokeWidth={2}
                name="Threats Blocked"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Monitored Platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.platforms_monitored.map((platform, index) => {
              const PlatformIcon = getPlatformIcon(platform);
              const platformColor = getPlatformColor(platform);
              
              return (
                <div key={platform} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className={cn('p-2 rounded', platformColor)}>
                    <PlatformIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">{platform}</h4>
                    <p className="text-sm text-gray-500">Active monitoring</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                    Active
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtensionAnalytics;