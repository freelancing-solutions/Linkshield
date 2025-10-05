/**
 * @fileoverview Metrics Chart Component
 * 
 * Displays algorithm health metrics over time using interactive charts.
 * Supports multiple metrics visualization with time range selection and
 * trend analysis for social media platform health monitoring.
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Users, 
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react';
import { AlgorithmHealthData, PlatformType } from '@/types/social-protection';
import { getPlatformColor } from '@/lib/utils/social-protection';
import { cn } from '@/lib/utils';

interface MetricsChartProps {
  /** Platform identifier */
  platformId: string;
  /** Platform type for styling */
  platformType: PlatformType;
  /** Chart data */
  data: AlgorithmHealthData[];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Export handler */
  onExport?: () => void;
  /** Additional CSS classes */
  className?: string;
}

type TimeRange = '24h' | '7d' | '30d' | '90d';
type ChartType = 'line' | 'area';
type MetricType = 'visibility' | 'engagement' | 'reach' | 'content' | 'all';

/**
 * Time range options
 */
const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' }
];

/**
 * Chart type options
 */
const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'line', label: 'Line Chart' },
  { value: 'area', label: 'Area Chart' }
];

/**
 * Metric configuration
 */
const METRICS_CONFIG = {
  visibility: {
    key: 'visibility_score',
    label: 'Visibility Score',
    color: '#3b82f6', // blue-500
    icon: Eye
  },
  engagement: {
    key: 'engagement_quality',
    label: 'Engagement Quality',
    color: '#ef4444', // red-500
    icon: Heart
  },
  reach: {
    key: 'reach_score',
    label: 'Reach Score',
    color: '#10b981', // emerald-500
    icon: Users
  },
  content: {
    key: 'content_performance',
    label: 'Content Performance',
    color: '#f59e0b', // amber-500
    icon: BarChart3
  }
} as const;

/**
 * Custom tooltip component
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="text-sm font-medium text-gray-900 mb-2">
        {new Date(label).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}:</span>
            <span className="text-sm font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Loading state component
 */
const LoadingState: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-80 flex items-center justify-center">
        <div className="space-y-4 w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center h-80 space-y-4">
      <div className="text-center">
        <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Metrics</h3>
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
    <CardContent className="flex flex-col items-center justify-center h-80 space-y-4">
      <div className="text-center">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-sm text-gray-500">
          Metrics data will appear here once platform monitoring begins.
        </p>
      </div>
    </CardContent>
  </Card>
);

/**
 * MetricsChart Component
 * 
 * Displays interactive charts for algorithm health metrics over time.
 * Supports multiple visualization types, time range selection, and metric filtering.
 * 
 * Features:
 * - Interactive line and area charts
 * - Time range selection (24h, 7d, 30d, 90d)
 * - Metric filtering and multi-metric display
 * - Custom tooltips with formatted data
 * - Trend indicators and statistics
 * - Export functionality
 * - Loading and error states
 * - Responsive design
 * 
 * @param props - Component props
 * @returns JSX element representing the metrics chart
 * 
 * Requirements: 4.2, 4.3 - Algorithm health visualization
 */
export const MetricsChart: React.FC<MetricsChartProps> = ({
  platformId,
  platformType,
  data,
  isLoading = false,
  error,
  onRefresh,
  onExport,
  className
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(['visibility', 'engagement', 'reach', 'content']);

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={onRefresh} />;
  }

  // Show empty state
  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  // Filter data based on time range
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.timestamp);
    const now = new Date();
    const cutoff = new Date();

    switch (timeRange) {
      case '24h':
        cutoff.setHours(now.getHours() - 24);
        break;
      case '7d':
        cutoff.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoff.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoff.setDate(now.getDate() - 90);
        break;
    }

    return itemDate >= cutoff;
  });

  // Calculate trend for each metric
  const calculateTrend = (metricKey: string) => {
    if (filteredData.length < 2) return 0;
    const latest = filteredData[filteredData.length - 1][metricKey as keyof AlgorithmHealthData] as number;
    const previous = filteredData[filteredData.length - 2][metricKey as keyof AlgorithmHealthData] as number;
    return latest - previous;
  };

  // Render chart based on type
  const renderChart = () => {
    const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
    const DataComponent = chartType === 'area' ? Area : Line;

    return (
      <ResponsiveContainer width="100%" height={320}>
        <ChartComponent data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
            stroke="#666"
          />
          <YAxis 
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            stroke="#666"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {selectedMetrics.map((metricType) => {
            const config = METRICS_CONFIG[metricType];
            return (
              <DataComponent
                key={metricType}
                type="monotone"
                dataKey={config.key}
                stroke={config.color}
                fill={chartType === 'area' ? config.color : undefined}
                fillOpacity={chartType === 'area' ? 0.1 : undefined}
                strokeWidth={2}
                name={config.label}
                dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
              />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={cn('transition-all duration-200', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Algorithm Health Metrics</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Metric Toggles */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(METRICS_CONFIG).map(([key, config]) => {
            const isSelected = selectedMetrics.includes(key as MetricType);
            const trend = calculateTrend(config.key);
            const IconComponent = config.icon;

            return (
              <Button
                key={key}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (isSelected) {
                    setSelectedMetrics(prev => prev.filter(m => m !== key));
                  } else {
                    setSelectedMetrics(prev => [...prev, key as MetricType]);
                  }
                }}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-3 w-3" />
                {config.label}
                {trend !== 0 && (
                  <div className="flex items-center">
                    {trend > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className="text-xs ml-1">
                      {Math.abs(trend).toFixed(1)}%
                    </span>
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        {selectedMetrics.length === 0 ? (
          <div className="flex items-center justify-center h-80 text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select metrics to display chart</p>
            </div>
          </div>
        ) : (
          renderChart()
        )}

        {/* Summary Statistics */}
        {filteredData.length > 0 && selectedMetrics.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedMetrics.map((metricType) => {
              const config = METRICS_CONFIG[metricType];
              const values = filteredData.map(d => d[config.key as keyof AlgorithmHealthData] as number);
              const latest = values[values.length - 1];
              const average = values.reduce((sum, val) => sum + val, 0) / values.length;
              const trend = calculateTrend(config.key);

              return (
                <div key={metricType} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <config.icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">{config.label}</span>
                  </div>
                  <div className="text-lg font-bold" style={{ color: config.color }}>
                    {latest.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    Avg: {average.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsChart;