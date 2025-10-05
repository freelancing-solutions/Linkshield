import { useQuery } from '@tanstack/react-query';
import { socialProtectionService } from '@/services/social-protection.service';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for fetching social protection dashboard overview
 * 
 * Returns comprehensive dashboard data including:
 * - Active platform connections
 * - Overall risk score and trends
 * - Recent crisis alerts
 * - Algorithm health status
 * - Extension status and analytics
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useSocialProtectionDashboard();
 * 
 * if (isLoading) return <DashboardSkeleton />;
 * if (error) return <ErrorMessage error={error} />;
 * 
 * return <SocialProtectionDashboard data={data} />;
 * ```
 */
export function useSocialProtectionDashboard() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'dashboard'],
    queryFn: () => socialProtectionService.getDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes - more frequent updates for security data
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated,
    retry: 2,
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
}