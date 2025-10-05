/**
 * @fileoverview Alert Card Component
 * 
 * Displays individual crisis alert information in a compact card format.
 * Shows alert severity, platform, type, status, and provides quick actions
 * for alert management.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertTriangle, 
  Shield, 
  MoreVertical,
  Eye,
  CheckCircle,
  X,
  Clock,
  ExternalLink,
  Flag,
  Archive,
  Share2
} from 'lucide-react';
import { CrisisAlert, AlertSeverity, AlertStatus } from '@/types/social-protection';
import { getPlatformIcon, getPlatformColor } from '@/lib/utils/social-protection';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  /** Crisis alert data */
  alert: CrisisAlert;
  /** Loading state */
  isLoading?: boolean;
  /** Card click handler */
  onClick?: (alert: CrisisAlert) => void;
  /** Alert resolve handler */
  onResolve?: (alertId: string) => void;
  /** Alert dismiss handler */
  onDismiss?: (alertId: string) => void;
  /** Alert investigate handler */
  onInvestigate?: (alertId: string) => void;
  /** Alert share handler */
  onShare?: (alert: CrisisAlert) => void;
  /** Show actions menu */
  showActions?: boolean;
  /** Compact mode */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Severity configuration with colors and priorities
 */
const SEVERITY_CONFIG: Record<AlertSeverity, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  priority: number;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  critical: {
    label: 'Critical',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    priority: 4,
    icon: AlertTriangle
  },
  high: {
    label: 'High',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-900',
    priority: 3,
    icon: AlertTriangle
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-900',
    priority: 2,
    icon: Shield
  },
  low: {
    label: 'Low',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
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
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  active: {
    label: 'Active',
    variant: 'destructive',
    color: 'text-red-600',
    icon: AlertTriangle
  },
  investigating: {
    label: 'Investigating',
    variant: 'secondary',
    color: 'text-blue-600',
    icon: Eye
  },
  resolved: {
    label: 'Resolved',
    variant: 'outline',
    color: 'text-green-600',
    icon: CheckCircle
  },
  dismissed: {
    label: 'Dismissed',
    variant: 'outline',
    color: 'text-gray-600',
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
const LoadingCard: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <Card className="transition-all duration-200">
    <CardHeader className={cn('pb-3', compact && 'pb-2')}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded" />
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </CardHeader>
    {!compact && (
      <CardContent className="pt-0">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-3/4" />
      </CardContent>
    )}
  </Card>
);

/**
 * Actions menu component
 */
const ActionsMenu: React.FC<{
  alert: CrisisAlert;
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  onInvestigate?: (alertId: string) => void;
  onShare?: (alert: CrisisAlert) => void;
}> = ({ alert, onResolve, onDismiss, onInvestigate, onShare }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onShare?.(alert)}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Alert
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLink className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {alert.status === 'active' && (
          <>
            <DropdownMenuItem onClick={() => onInvestigate?.(alert.id)}>
              <Eye className="h-4 w-4 mr-2" />
              Mark as Investigating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResolve?.(alert.id)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve Alert
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDismiss?.(alert.id)} className="text-red-600">
              <X className="h-4 w-4 mr-2" />
              Dismiss Alert
            </DropdownMenuItem>
          </>
        )}
        
        {alert.status === 'investigating' && (
          <>
            <DropdownMenuItem onClick={() => onResolve?.(alert.id)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve Alert
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDismiss?.(alert.id)} className="text-red-600">
              <X className="h-4 w-4 mr-2" />
              Dismiss Alert
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Flag className="h-4 w-4 mr-2" />
          Report Issue
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Archive className="h-4 w-4 mr-2" />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * AlertCard Component
 * 
 * Displays individual crisis alert information in a compact, actionable card format.
 * Provides visual severity indicators, platform identification, and quick action controls.
 * 
 * Features:
 * - Severity-based visual styling and indicators
 * - Platform identification with branded icons
 * - Status badges with appropriate colors
 * - Quick action buttons for common operations
 * - Expandable actions menu for advanced operations
 * - Responsive design with compact mode support
 * - Loading state with skeleton placeholders
 * - Accessibility support with proper ARIA labels
 * 
 * @param props - Component props
 * @returns JSX element representing the alert card
 * 
 * Requirements: 5.1, 5.2 - Crisis alerts display and management
 */
export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  isLoading = false,
  onClick,
  onResolve,
  onDismiss,
  onInvestigate,
  onShare,
  showActions = true,
  compact = false,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Show loading state
  if (isLoading) {
    return <LoadingCard compact={compact} />;
  }

  const severityConfig = SEVERITY_CONFIG[alert.severity];
  const statusConfig = STATUS_CONFIG[alert.status];
  const PlatformIcon = getPlatformIcon(alert.platform);
  const platformColor = getPlatformColor(alert.platform);
  const SeverityIcon = severityConfig.icon;
  const StatusIcon = statusConfig.icon;

  return (
    <Card 
      className={cn(
        'transition-all duration-200 cursor-pointer hover:shadow-md',
        severityConfig.bgColor,
        severityConfig.borderColor,
        alert.severity === 'critical' && 'ring-2 ring-red-200',
        isHovered && 'shadow-lg',
        className
      )}
      onClick={() => onClick?.(alert)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className={cn('pb-3', compact && 'pb-2')}>
        <div className="flex items-center justify-between">
          {/* Left side - Platform and Alert Info */}
          <div className="flex items-center gap-3">
            {/* Platform Icon */}
            <div className={cn('p-2 rounded-md', platformColor)}>
              <PlatformIcon className="h-4 w-4 text-white" />
            </div>

            {/* Alert Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SeverityIcon className={cn('h-4 w-4', severityConfig.color)} />
                <span className={cn('font-medium text-sm', severityConfig.textColor)}>
                  {alert.alert_type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="capitalize">{alert.platform}</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
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

          {/* Right side - Status and Actions */}
          <div className="flex items-center gap-2">
            <Badge variant={statusConfig.variant} className="text-xs">
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
            
            <Badge 
              variant={alert.severity === 'critical' ? 'destructive' : alert.severity === 'high' ? 'secondary' : 'outline'}
              className={cn('text-xs', severityConfig.color)}
            >
              {severityConfig.label}
            </Badge>

            {showActions && (
              <ActionsMenu
                alert={alert}
                onResolve={onResolve}
                onDismiss={onDismiss}
                onInvestigate={onInvestigate}
                onShare={onShare}
              />
            )}
          </div>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="pt-0">
          {/* Alert Description */}
          <p className={cn('text-sm mb-3', severityConfig.textColor)}>
            {alert.description}
          </p>

          {/* Quick Actions */}
          {alert.status === 'active' && (
            <div className="flex items-center gap-2">
              {onInvestigate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInvestigate(alert.id);
                  }}
                  className="text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Investigate
                </Button>
              )}
              {onResolve && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolve(alert.id);
                  }}
                  className="text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolve
                </Button>
              )}
            </div>
          )}

          {/* Signals Preview */}
          {alert.signals && alert.signals.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Flag className="h-3 w-3" />
                <span>Recent Signals ({alert.signals.length})</span>
              </div>
              <div className="space-y-1">
                {alert.signals.slice(0, 2).map((signal, index) => (
                  <div key={index} className="text-xs text-gray-600 bg-white/50 rounded px-2 py-1">
                    {signal.type}: {signal.description}
                  </div>
                ))}
                {alert.signals.length > 2 && (
                  <div className="text-xs text-gray-500 italic">
                    +{alert.signals.length - 2} more signals
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default AlertCard;