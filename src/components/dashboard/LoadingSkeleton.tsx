/**
 * LoadingSkeleton Components for Dashboard
 * 
 * Dashboard-specific skeleton loading placeholders that match actual component layouts.
 * Provides visual feedback while dashboard content is loading.
 * 
 * Features:
 * - Component-specific skeletons for dashboard elements
 * - Shimmer animation
 * - Responsive layouts
 * - Accessible with ARIA attributes
 */

'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/SkeletonLoaders';

/**
 * KPICardsSkeleton
 * 
 * Skeleton for KPI cards grid
 */
export const KPICardsSkeleton: React.FC = () => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      role="status"
      aria-label="Loading KPI cards"
    >
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/**
 * AlertsListSkeleton
 * 
 * Skeleton for alerts list
 */
interface AlertsListSkeletonProps {
  items?: number;
}

export const AlertsListSkeleton: React.FC<AlertsListSkeletonProps> = ({ 
  items = 5 
}) => {
  return (
    <div 
      className="space-y-3"
      role="status"
      aria-label="Loading alerts list"
    >
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

/**
 * CrisisAlertsPanelSkeleton
 * 
 * Skeleton for crisis alerts panel
 */
export const CrisisAlertsPanelSkeleton: React.FC = () => {
  return (
    <Card role="status" aria-label="Loading crisis alerts panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

/**
 * ExtensionStatusCardSkeleton
 * 
 * Skeleton for extension status card
 */
export const ExtensionStatusCardSkeleton: React.FC = () => {
  return (
    <Card role="status" aria-label="Loading extension status">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * SessionsTableSkeleton
 * 
 * Skeleton for sessions table
 */
interface SessionsTableSkeletonProps {
  rows?: number;
}

export const SessionsTableSkeleton: React.FC<SessionsTableSkeletonProps> = ({ 
  rows = 10 
}) => {
  return (
    <Card role="status" aria-label="Loading sessions table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="flex gap-4 pb-3 border-b">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 py-3 items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * QuickActionsPanelSkeleton
 * 
 * Skeleton for quick actions panel
 */
export const QuickActionsPanelSkeleton: React.FC = () => {
  return (
    <Card role="status" aria-label="Loading quick actions panel">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

/**
 * ProjectsTableSkeleton
 * 
 * Skeleton for projects table
 */
interface ProjectsTableSkeletonProps {
  rows?: number;
}

export const ProjectsTableSkeleton: React.FC<ProjectsTableSkeletonProps> = ({ 
  rows = 5 
}) => {
  return (
    <Card role="status" aria-label="Loading projects table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="flex gap-4 pb-3 border-b">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 py-3 items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * TeamMembersTableSkeleton
 * 
 * Skeleton for team members table
 */
interface TeamMembersTableSkeletonProps {
  rows?: number;
}

export const TeamMembersTableSkeleton: React.FC<TeamMembersTableSkeletonProps> = ({ 
  rows = 5 
}) => {
  return (
    <Card role="status" aria-label="Loading team members table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="flex gap-4 pb-3 border-b">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 py-3 items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * AlgorithmHealthPanelSkeleton
 * 
 * Skeleton for algorithm health panel
 */
export const AlgorithmHealthPanelSkeleton: React.FC = () => {
  return (
    <Card role="status" aria-label="Loading algorithm health panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Score */}
        <div className="text-center space-y-3">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-6 w-20 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-6 w-16" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>

        {/* Analysis Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * SocialProtectionOverviewSkeleton
 * 
 * Skeleton for social protection overview panel
 */
export const SocialProtectionOverviewSkeleton: React.FC = () => {
  return (
    <Card role="status" aria-label="Loading social protection overview">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-8 w-8 rounded-full mx-auto" />
              <Skeleton className="h-6 w-12 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};