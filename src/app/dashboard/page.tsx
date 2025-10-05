'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useDashboardOverview } from '@/hooks/dashboard';
import { KPICards } from '@/components/dashboard/KPICards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useDashboardOverview();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 w-64 bg-muted animate-pulse rounded" />
          <div className="h-5 w-96 bg-muted animate-pulse rounded mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.full_name}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your account
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-12 px-4 bg-muted/50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load dashboard</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
            We couldn't load your dashboard data. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.full_name}!</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your account
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards data={data} />

      {/* Recent Activity */}
      <RecentActivity
        activities={[
          // Mock data for now - will be replaced with real data from API
          {
            id: '1',
            type: 'scan',
            title: 'URL scan completed',
            description: 'Scanned https://example.com - No threats detected',
            timestamp: new Date().toISOString(),
            link: '/dashboard/url-analysis',
          },
          {
            id: '2',
            type: 'project',
            title: 'New project created',
            description: 'Created project "My Website"',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            link: '/dashboard/projects',
          },
          {
            id: '3',
            type: 'alert',
            title: 'Security alert resolved',
            description: 'Resolved high-priority security alert',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            link: '/dashboard/alerts',
          },
        ]}
      />
    </div>
  );
}
