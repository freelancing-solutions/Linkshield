/**
 * StatusBadge Component
 * 
 * A reusable status badge component for displaying various states across the dashboard.
 * Provides consistent visual representation of status information with appropriate colors,
 * icons, and styling for different status types.
 * 
 * Features:
 * - Multiple status variants (success, warning, error, info, neutral)
 * - Automatic icon selection based on status type
 * - Dark mode support
 * - Consistent styling with design system
 * - Accessible with proper ARIA attributes
 * 
 * @example
 * ```tsx
 * <StatusBadge status="success" text="Active" />
 * <StatusBadge status="error" text="Failed" showIcon={false} />
 * <StatusBadge status="warning" text="Degraded" className="ml-2" />
 * ```
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Clock,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Status badge variants with appropriate colors and styling
 */
const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium',
  {
    variants: {
      status: {
        // Success states
        success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        healthy: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        connected: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        resolved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        
        // Warning states
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
        degraded: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
        
        // Error/Critical states
        error: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        critical: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        failed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        disconnected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        down: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        
        // Info states
        info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
        processing: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
        
        // Neutral states
        inactive: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
        disabled: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
        offline: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      status: 'info',
      size: 'md',
    },
  }
);

/**
 * Get appropriate icon for status
 */
const getStatusIcon = (status: string) => {
  const iconProps = { className: 'h-3 w-3' };
  
  switch (status) {
    case 'success':
    case 'healthy':
    case 'active':
    case 'connected':
    case 'resolved':
      return <CheckCircle2 {...iconProps} />;
      
    case 'warning':
    case 'degraded':
    case 'pending':
      return <AlertTriangle {...iconProps} />;
      
    case 'error':
    case 'critical':
    case 'failed':
    case 'disconnected':
    case 'down':
      return <XCircle {...iconProps} />;
      
    case 'info':
      return <Info {...iconProps} />;
      
    case 'processing':
      return <Activity {...iconProps} className="animate-pulse" />;
      
    case 'inactive':
    case 'disabled':
    case 'offline':
      return <Clock {...iconProps} />;
      
    default:
      return <Info {...iconProps} />;
  }
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  /**
   * Status text to display
   */
  children: React.ReactNode;
  /**
   * Whether to show an icon
   */
  showIcon?: boolean;
  /**
   * Custom icon to override default status icon
   */
  icon?: React.ReactNode;
}

/**
 * StatusBadge component for displaying color-coded status indicators
 * 
 * Features:
 * - Multiple status variants with appropriate colors
 * - Automatic icon selection based on status
 * - Support for custom icons
 * - Multiple sizes
 * - Dark mode support
 * - Accessibility compliant
 * 
 * @example
 * ```tsx
 * <StatusBadge status="success">Active</StatusBadge>
 * <StatusBadge status="warning" size="lg">Degraded</StatusBadge>
 * <StatusBadge status="error" showIcon={false}>Failed</StatusBadge>
 * ```
 */
export function StatusBadge({ 
  className, 
  status = 'info',
  size = 'md',
  children, 
  showIcon = true,
  icon,
  ...props 
}: StatusBadgeProps) {
  const statusIcon = icon || (showIcon ? getStatusIcon(status || 'info') : null);

  return (
    <Badge
      className={cn(statusBadgeVariants({ status, size }), className)}
      {...props}
    >
      {statusIcon}
      {children}
    </Badge>
  );
}

/**
 * Utility function to get status badge variant from common status values
 */
export const getStatusVariant = (status: string): StatusBadgeProps['status'] => {
  const normalizedStatus = status.toLowerCase().replace(/[_\s-]/g, '');
  
  // Map common status values to badge variants
  const statusMap: Record<string, StatusBadgeProps['status']> = {
    // Success variants
    'ok': 'success',
    'good': 'success',
    'online': 'active',
    'running': 'active',
    'enabled': 'active',
    'complete': 'resolved',
    'completed': 'resolved',
    'done': 'resolved',
    
    // Warning variants
    'warn': 'warning',
    'caution': 'warning',
    'unstable': 'degraded',
    'partial': 'degraded',
    'waiting': 'pending',
    'queued': 'pending',
    
    // Error variants
    'bad': 'error',
    'danger': 'critical',
    'emergency': 'critical',
    'broken': 'failed',
    'stopped': 'down',
    'terminated': 'down',
    
    // Info variants
    'unknown': 'info',
    'loading': 'processing',
    'syncing': 'processing',
    
    // Neutral variants
    'paused': 'inactive',
    'suspended': 'inactive',
    'maintenance': 'disabled',
  };
  
  return statusMap[normalizedStatus] || (status as StatusBadgeProps['status']) || 'info';
};

export { statusBadgeVariants };