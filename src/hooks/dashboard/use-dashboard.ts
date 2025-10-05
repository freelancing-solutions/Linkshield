import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for fetching dashboard overview
 * 
 * Returns unified dashboard data including:
 * - User role and available roles
 * - Role-specific metrics
 * - Extension and bot status
 * - Notifications count
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useDashboardOverview();
 * 
 * if (isLoading) return <LoadingSkeleton />;
 * if (error) return <ErrorMessage error={error} />;
 * 
 * return <DashboardOverview data={data} />;
 * ```
 */
export function useDashboardOverview() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardService.getOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: isAuthenticated,
    retry: 2,
  });
}
