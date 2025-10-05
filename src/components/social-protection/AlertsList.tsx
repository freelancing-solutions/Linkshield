/**
 * @fileoverview Alerts List Component
 * 
 * Displays a comprehensive list of crisis alerts with filtering, sorting,
 * and management capabilities. Shows alert severity, platform, type, and status
 * with interactive controls for alert management.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertTriangle, 
  Shield, 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { CrisisAlert, AlertSeverity, AlertStatus, PlatformType } from '@/types/social-protection';
import { getPlatformIcon, getPlatformColor } from '@/lib/utils/social-protection';
import { cn } from '@/lib/utils';

interface AlertsListProps {
  /** List of crisis alerts */
  alerts: CrisisAlert[];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Alert click handler */
  onAlertClick?: (alert: CrisisAlert) => void;
  /** Alert resolve handler */
  onResolveAlert?: (alertId: string) => void;
  /** Refresh handler */
  onRefresh?: () => void;
  /** Additional CSS classes */
  className?: string;
}

type SortField = 'created_at' | 'severity' | 'platform' | 'status';
type SortOrder = 'asc' | 'desc';

/**
 * Severity configuration with colors and priorities
 */
const SEVERITY_CONFIG: Record<AlertSeverity, {
  label: string;
  color: string;
  bgColor: string;
  priority: number;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  critical: {
    label: 'Critical',
    color: 'text-red-700',
    bgColor: 'bg-red-100 border-red-200',
    priority: 4,
    icon: AlertTriangle
  },
  high: {
    label: 'High',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100 border-orange-200',
    priority: 3,
    icon: AlertTriangle
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100 border-yellow-200',
    priority: 2,
    icon: Shield
  },
  low: {
    label: 'Low',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-200',
    priority: 1,
    icon: Shield
  }
};

/**
 * Status configuration
 */
const STATUS_CONFIG: Record<AlertStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: React.ComponentType<{ className?: string }>;
}> = {
  active: {
    label: 'Active',
    variant: 'destructive',
    icon: AlertTriangle
  },
  investigating: {
    label: 'Investigating',
    variant: 'secondary',
    icon: Eye
  },
  resolved: {
    label: 'Resolved',
    variant: 'outline',
    icon: CheckCircle
  },
  dismissed: {
    label: 'Dismissed',
    variant: 'outline',
    icon: X
  }
};

/**
 * Get relative time string
 */
const getRelativeTime = (date: string): string => {
  const now = new Date();
  const alertDate = new Date(date);
  const diffMs = now.getTime() - alertDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return alertDate.toLocaleDateString();
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
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Alerts</h3>
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
      <CheckCircle className="h-12 w-12 text-green-500" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
        <p className="text-sm text-gray-500">
          Great! You don't have any crisis alerts at the moment.
        </p>
      </div>
    </CardContent>
  </Card>
);

/**
 * Individual alert item component
 */
const AlertItem: React.FC<{
  alert: CrisisAlert;
  onAlertClick?: (alert: CrisisAlert) => void;
  onResolveAlert?: (alertId: string) => void;
}> = ({ alert, onAlertClick, onResolveAlert }) => {
  const severityConfig = SEVERITY_CONFIG[alert.severity];
  const statusConfig = STATUS_CONFIG[alert.status];
  const PlatformIcon = getPlatformIcon(alert.platform);
  const platformColor = getPlatformColor(alert.platform);
  const SeverityIcon = severityConfig.icon;
  const StatusIcon = statusConfig.icon;

  return (
    <div 
      className={cn(
        'flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer',
        severityConfig.bgColor,
        alert.severity === 'critical' && 'ring-2 ring-red-200'
      )}
      onClick={() => onAlertClick?.(alert)}
    >
      <div className="flex items-center gap-4">
        {/* Platform Icon */}
        <div className={cn('p-2 rounded', platformColor)}>
          <PlatformIcon className="h-4 w-4 text-white" />
        </div>

        {/* Alert Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <SeverityIcon className={cn('h-4 w-4', severityConfig.color)} />
            <span className="font-medium text-gray-900">{alert.alert_type}</span>
            <Badge variant={statusConfig.variant} className="text-xs">
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-1">{alert.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{alert.platform.charAt(0).toUpperCase() + alert.platform.slice(1)}</span>
            <span>•</span>
            <span>{getRelativeTime(alert.created_at)}</span>
            {alert.signals && alert.signals.length > 0 && (
              <>
                <span>•</span>
                <span>{alert.signals.length} signals</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Badge 
          variant={alert.severity === 'critical' ? 'destructive' : alert.severity === 'high' ? 'secondary' : 'outline'}
          className={severityConfig.color}
        >
          {severityConfig.label}
        </Badge>
        
        {alert.status === 'active' && onResolveAlert && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onResolveAlert(alert.id);
            }}
            className="text-xs"
          >
            Resolve
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * AlertsList Component
 * 
 * Displays a comprehensive list of crisis alerts with advanced filtering,
 * sorting, and management capabilities. Provides real-time alert monitoring
 * and quick action controls.
 * 
 * Features:
 * - Real-time alert list with severity indicators
 * - Advanced filtering by severity, status, and platform
 * - Search functionality across alert content
 * - Sorting by date, severity, platform, and status
 * - Quick resolve actions for active alerts
 * - Loading and error states
 * - Empty state for no alerts
 * - Responsive design with accessibility support
 * 
 * @param props - Component props
 * @returns JSX element representing the alerts list
 * 
 * Requirements: 5.1, 5.2, 5.3 - Crisis alerts management
 */
export const AlertsList: React.FC<AlertsListProps> = ({
  alerts,
  isLoading = false,
  error,
  onAlertClick,
  onResolveAlert,
  onRefresh,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<PlatformType | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={onRefresh} />;
  }

  // Filter and sort alerts
  const filteredAlerts = alerts
    .filter(alert => {
      // Search filter
      if (searchQuery && !alert.alert_type.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !alert.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Severity filter
      if (severityFilter !== 'all' && alert.severity !== severityFilter) {
        return false;
      }
      
      // Status filter
      if (statusFilter !== 'all' && alert.status !== statusFilter) {
        return false;
      }
      
      // Platform filter
      if (platformFilter !== 'all' && alert.platform !== platformFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'severity':
          aValue = SEVERITY_CONFIG[a.severity].priority;
          bValue = SEVERITY_CONFIG[b.severity].priority;
          break;
        case 'platform':
          aValue = a.platform;
          bValue = b.platform;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Show empty state
  if (filteredAlerts.length === 0 && alerts.length === 0) {
    return <EmptyState />;
  }

  // Get unique platforms for filter
  const uniquePlatforms = Array.from(new Set(alerts.map(alert => alert.platform)));

  return (
    <Card className={cn('transition-all duration-200', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Crisis Alerts</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {filteredAlerts.length} of {alerts.length} alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={severityFilter} onValueChange={(value: AlertSeverity | 'all') => setSeverityFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: AlertStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={platformFilter} onValueChange={(value: PlatformType | 'all') => setPlatformFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {uniquePlatforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No alerts match your current filters.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                setSearchQuery('');
                setSeverityFilter('all');
                setStatusFilter('all');
                setPlatformFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onAlertClick={onAlertClick}
                onResolveAlert={onResolveAlert}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsList;