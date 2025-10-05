/**
 * @fileoverview LoadingStates Component
 * 
 * Shared loading state components for consistent loading UI across the social protection feature.
 * Provides various loading states for different component types and layouts.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Props for loading state components
 */
interface LoadingStateProps {
  /** Custom className */
  className?: string;
}

/**
 * Props for card loading state
 */
interface CardLoadingStateProps extends LoadingStateProps {
  /** Whether to show header */
  showHeader?: boolean;
  /** Number of content lines to show */
  contentLines?: number;
  /** Height of the card */
  height?: string;
}

/**
 * Props for list loading state
 */
interface ListLoadingStateProps extends LoadingStateProps {
  /** Number of items to show */
  itemCount?: number;
  /** Whether items have avatars */
  showAvatars?: boolean;
}

/**
 * Props for dashboard loading state
 */
interface DashboardLoadingStateProps extends LoadingStateProps {
  /** Number of cards to show */
  cardCount?: number;
}

/**
 * Basic Card Loading State
 * 
 * Generic loading state for card components with customizable content.
 * 
 * @param props - Component props
 * @returns JSX element representing the card loading state
 */
export const CardLoadingState: React.FC<CardLoadingStateProps> = ({
  className,
  showHeader = true,
  contentLines = 3,
  height = 'h-full'
}) => {
  return (
    <Card className={cn(height, className)}>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: contentLines }).map((_, index) => (
          <Skeleton 
            key={index} 
            className={cn(
              'h-4',
              index === contentLines - 1 ? 'w-2/3' : 'w-full'
            )} 
          />
        ))}
      </CardContent>
    </Card>
  );
};

/**
 * List Loading State
 * 
 * Loading state for list components with optional avatars.
 * 
 * @param props - Component props
 * @returns JSX element representing the list loading state
 */
export const ListLoadingState: React.FC<ListLoadingStateProps> = ({
  className,
  itemCount = 3,
  showAvatars = false
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
          {showAvatars && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      ))}
    </div>
  );
};

/**
 * Dashboard Loading State
 * 
 * Loading state for dashboard overview with multiple cards.
 * 
 * @param props - Component props
 * @returns JSX element representing the dashboard loading state
 */
export const DashboardLoadingState: React.FC<DashboardLoadingStateProps> = ({
  className,
  cardCount = 4
}) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {Array.from({ length: cardCount }).map((_, index) => (
        <CardLoadingState key={index} showHeader={false} contentLines={2} height="h-32" />
      ))}
    </div>
  );
};

/**
 * Table Loading State
 * 
 * Loading state for table components.
 * 
 * @param props - Component props
 * @returns JSX element representing the table loading state
 */
export const TableLoadingState: React.FC<LoadingStateProps & { rows?: number; columns?: number }> = ({
  className,
  rows = 5,
  columns = 4
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex space-x-4 pb-2 border-b">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={cn(
                'h-4 flex-1',
                colIndex === 0 ? 'w-1/4' : colIndex === columns - 1 ? 'w-1/6' : 'w-full'
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Chart Loading State
 * 
 * Loading state for chart components.
 * 
 * @param props - Component props
 * @returns JSX element representing the chart loading state
 */
export const ChartLoadingState: React.FC<LoadingStateProps & { height?: string }> = ({
  className,
  height = 'h-64'
}) => {
  return (
    <Card className={cn(height, className)}>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-32" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between h-32 space-x-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton 
              key={index} 
              className={cn(
                'w-8 rounded-t',
                `h-${Math.floor(Math.random() * 20) + 8}`
              )} 
            />
          ))}
        </div>
        <div className="flex justify-between mt-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-8" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Form Loading State
 * 
 * Loading state for form components.
 * 
 * @param props - Component props
 * @returns JSX element representing the form loading state
 */
export const FormLoadingState: React.FC<LoadingStateProps & { fields?: number }> = ({
  className,
  fields = 4
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded" />
        </div>
      ))}
      <div className="flex justify-end space-x-2 pt-4">
        <Skeleton className="h-10 w-20 rounded" />
        <Skeleton className="h-10 w-24 rounded" />
      </div>
    </div>
  );
};

/**
 * Modal Loading State
 * 
 * Loading state for modal components.
 * 
 * @param props - Component props
 * @returns JSX element representing the modal loading state
 */
export const ModalLoadingState: React.FC<LoadingStateProps> = ({
  className
}) => {
  return (
    <div className={cn('space-y-6 p-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        <FormLoadingState fields={3} />
      </div>
    </div>
  );
};

/**
 * Spinner Loading State
 * 
 * Simple spinner for inline loading states.
 * 
 * @param props - Component props
 * @returns JSX element representing the spinner
 */
export const SpinnerLoadingState: React.FC<LoadingStateProps & { size?: 'sm' | 'md' | 'lg' }> = ({
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size]
        )}
      />
    </div>
  );
};

/**
 * Default export for backward compatibility
 */
export const LoadingStates = {
  Card: CardLoadingState,
  List: ListLoadingState,
  Dashboard: DashboardLoadingState,
  Table: TableLoadingState,
  Chart: ChartLoadingState,
  Form: FormLoadingState,
  Modal: ModalLoadingState,
  Spinner: SpinnerLoadingState
};

export default LoadingStates;