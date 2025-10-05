/**
 * SkeletonLoaders Components
 * 
 * Skeleton loading placeholders that match actual component layouts.
 * Provides visual feedback while content is loading.
 * 
 * Features:
 * - Shimmer animation
 * - Multiple component-specific skeletons
 * - Responsive layouts
 * - Accessible with ARIA attributes
 */

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Base Skeleton Component
 */
interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

/**
 * ScanResultsSkeleton
 * 
 * Skeleton for URL scan results
 */
export const ScanResultsSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score Gauge */}
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Provider Results */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * CardSkeleton
 * 
 * Generic card skeleton
 */
export const CardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
    </Card>
  );
};

/**
 * TableSkeleton
 * 
 * Skeleton for data tables
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div className="flex gap-4 pb-3 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-5 flex-1" />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * ChartSkeleton
 * 
 * Skeleton for charts and graphs
 */
export const ChartSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart bars */}
          <div className="flex items-end gap-2 h-48">
            {[60, 80, 45, 90, 70, 55, 85].map((height, i) => (
              <Skeleton
                key={i}
                className="flex-1"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * StatCardSkeleton
 * 
 * Skeleton for stat cards
 */
export const StatCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-3 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * ListSkeleton
 * 
 * Skeleton for lists
 */
interface ListSkeletonProps {
  items?: number;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ items = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
};

/**
 * FormSkeleton
 * 
 * Skeleton for forms
 */
export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Form fields */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}

      {/* Submit button */}
      <Skeleton className="h-10 w-32" />
    </div>
  );
};

/**
 * ProfileSkeleton
 * 
 * Skeleton for user profile
 */
export const ProfileSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />

          {/* Info */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-8 w-16 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * GridSkeleton
 * 
 * Skeleton for grid layouts
 */
interface GridSkeletonProps {
  items?: number;
  columns?: 2 | 3 | 4;
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
  items = 6,
  columns = 3,
}) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * AccordionSkeleton
 * 
 * Skeleton for accordion/collapsible content
 */
export const AccordionSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-5" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * TimelineSkeleton
 * 
 * Skeleton for timeline/activity feed
 */
export const TimelineSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <Skeleton className="h-8 w-8 rounded-full" />
            {i < 4 && <div className="w-0.5 h-16 bg-gray-200 my-2" />}
          </div>
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
