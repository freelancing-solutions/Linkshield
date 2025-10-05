'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon, FileX, Search, Plus, AlertCircle, CheckCircle2, Users, FolderOpen } from 'lucide-react';

/**
 * EmptyState component displays a consistent empty state UI across the application
 * 
 * Features:
 * - Customizable icon, title, and description
 * - Optional action button with callback
 * - Multiple predefined variants for common scenarios
 * - Responsive design with proper spacing
 * - Accessible with proper ARIA labels
 */

export type EmptyStateVariant = 
  | 'no-data'
  | 'no-results' 
  | 'no-projects'
  | 'no-alerts'
  | 'no-members'
  | 'success'
  | 'error'
  | 'custom';

export interface EmptyStateProps {
  /** Predefined variant or custom */
  variant?: EmptyStateVariant;
  /** Custom icon component */
  icon?: LucideIcon;
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Action button text */
  actionText?: string;
  /** Action button click handler */
  onAction?: () => void;
  /** Action button variant */
  actionVariant?: 'default' | 'outline' | 'secondary';
  /** Custom className for styling */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show border */
  showBorder?: boolean;
}

/**
 * Predefined configurations for common empty state scenarios
 */
const variantConfigs: Record<EmptyStateVariant, {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}> = {
  'no-data': {
    icon: FileX,
    title: 'No data available',
    description: 'There is no data to display at the moment.',
    iconBgColor: 'bg-muted',
    iconColor: 'text-muted-foreground',
  },
  'no-results': {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search criteria or filters.',
    iconBgColor: 'bg-muted',
    iconColor: 'text-muted-foreground',
  },
  'no-projects': {
    icon: FolderOpen,
    title: 'No projects yet',
    description: 'Get started by creating your first project.',
    iconBgColor: 'bg-muted',
    iconColor: 'text-muted-foreground',
  },
  'no-alerts': {
    icon: CheckCircle2,
    title: 'No alerts',
    description: 'All clear! There are no alerts at the moment.',
    iconBgColor: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  'no-members': {
    icon: Users,
    title: 'No team members',
    description: 'Invite team members to collaborate on this project.',
    iconBgColor: 'bg-muted',
    iconColor: 'text-muted-foreground',
  },
  'success': {
    icon: CheckCircle2,
    title: 'All done!',
    description: 'Everything is working perfectly.',
    iconBgColor: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  'error': {
    icon: AlertCircle,
    title: 'Something went wrong',
    description: 'Please try again or contact support if the problem persists.',
    iconBgColor: 'bg-red-100 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  'custom': {
    icon: FileX,
    title: 'Empty',
    description: 'No content available.',
    iconBgColor: 'bg-muted',
    iconColor: 'text-muted-foreground',
  },
};

/**
 * Get size classes for different components
 */
const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        container: 'p-6',
        icon: 'w-8 h-8',
        iconContainer: 'w-10 h-10 mb-3',
        title: 'text-base font-medium mb-1',
        description: 'text-sm',
        spacing: 'mb-3',
      };
    case 'lg':
      return {
        container: 'p-16',
        icon: 'w-8 h-8',
        iconContainer: 'w-16 h-16 mb-6',
        title: 'text-xl font-semibold mb-3',
        description: 'text-base',
        spacing: 'mb-6',
      };
    case 'md':
    default:
      return {
        container: 'p-12',
        icon: 'w-6 h-6',
        iconContainer: 'w-12 h-12 mb-4',
        title: 'text-lg font-semibold mb-2',
        description: 'text-sm',
        spacing: 'mb-4',
      };
  }
};

export function EmptyState({
  variant = 'no-data',
  icon: CustomIcon,
  title: customTitle,
  description: customDescription,
  actionText,
  onAction,
  actionVariant = 'default',
  className,
  size = 'md',
  showBorder = true,
}: EmptyStateProps) {
  const config = variantConfigs[variant];
  const sizeClasses = getSizeClasses(size);
  
  // Use custom props or fall back to variant config
  const Icon = CustomIcon || config.icon;
  const title = customTitle || config.title;
  const description = customDescription || config.description;
  const iconBgColor = config.iconBgColor;
  const iconColor = config.iconColor;

  return (
    <div
      className={cn(
        'text-center',
        sizeClasses.container,
        showBorder && 'rounded-lg border border-dashed',
        className
      )}
      role="status"
      aria-label={`Empty state: ${title}`}
    >
      {/* Icon */}
      <div
        className={cn(
          'mx-auto rounded-full flex items-center justify-center',
          sizeClasses.iconContainer,
          iconBgColor
        )}
      >
        <Icon className={cn(sizeClasses.icon, iconColor)} />
      </div>

      {/* Title */}
      <h3 className={cn(sizeClasses.title, 'text-foreground')}>
        {title}
      </h3>

      {/* Description */}
      <p className={cn(sizeClasses.description, 'text-muted-foreground', sizeClasses.spacing)}>
        {description}
      </p>

      {/* Action Button */}
      {actionText && onAction && (
        <Button
          variant={actionVariant}
          onClick={onAction}
          className="mt-2"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}

/**
 * Specialized empty state components for common scenarios
 */

export function NoProjectsEmptyState({ 
  onCreateProject,
  className 
}: { 
  onCreateProject?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      variant="no-projects"
      actionText="Create Project"
      onAction={onCreateProject}
      className={className}
    />
  );
}

export function NoAlertsEmptyState({ 
  className 
}: { 
  className?: string;
}) {
  return (
    <EmptyState
      variant="no-alerts"
      className={className}
    />
  );
}

export function NoResultsEmptyState({ 
  onClearFilters,
  className 
}: { 
  onClearFilters?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      variant="no-results"
      actionText="Clear Filters"
      onAction={onClearFilters}
      actionVariant="outline"
      className={className}
    />
  );
}

export function NoMembersEmptyState({ 
  onInviteMembers,
  className 
}: { 
  onInviteMembers?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      variant="no-members"
      actionText="Invite Members"
      onAction={onInviteMembers}
      className={className}
    />
  );
}

export function ErrorEmptyState({ 
  onRetry,
  title,
  description,
  className 
}: { 
  onRetry?: () => void;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <EmptyState
      variant="error"
      title={title}
      description={description}
      actionText="Try Again"
      onAction={onRetry}
      actionVariant="outline"
      className={className}
    />
  );
}