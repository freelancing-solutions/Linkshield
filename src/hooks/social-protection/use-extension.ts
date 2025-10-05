import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialProtectionService } from '@/services/social-protection.service';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

/**
 * Hook for fetching extension status
 * 
 * Monitors browser extension installation, version, and connectivity
 * Provides real-time status updates for extension management
 */
export function useExtensionStatus() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'extension-status'],
    queryFn: () => socialProtectionService.getExtensionStatus(),
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Check status every minute
    refetchOnWindowFocus: true, // Check when user returns to tab
  });
}

/**
 * Hook for fetching extension analytics
 * 
 * Provides usage statistics, performance metrics, and user engagement data
 * Supports different timeframes for comprehensive analysis
 */
export function useExtensionAnalytics(params?: {
  timeframe?: '24h' | '7d' | '30d' | '90d';
  platform?: string;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'extension-analytics', params],
    queryFn: () => socialProtectionService.getExtensionAnalytics(params),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook for syncing extension data
 * 
 * Manually triggers synchronization between extension and backend
 * Used for troubleshooting and ensuring data consistency
 */
export function useSyncExtension() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialProtectionService.syncExtension(),
    onSuccess: () => {
      toast.success('Extension synchronized successfully');
      
      // Invalidate extension-related queries to refresh data
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'extension-status'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'extension-analytics'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'dashboard'] 
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to sync extension';
      toast.error(message);
    },
  });
}

/**
 * Hook for fetching extension download links
 * 
 * Provides download URLs for different browsers
 * Used in public-facing download pages
 */
export function useExtensionDownloads() {
  return useQuery({
    queryKey: ['social-protection', 'extension-downloads'],
    queryFn: () => socialProtectionService.getExtensionDownloads(),
    staleTime: 60 * 60 * 1000, // 1 hour - download links change rarely
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

/**
 * Hook for monitoring extension health
 * 
 * Tracks extension performance, errors, and connectivity issues
 * Provides proactive monitoring for extension reliability
 */
export function useExtensionHealth() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'extension-health'],
    queryFn: async () => {
      const [status, analytics] = await Promise.all([
        socialProtectionService.getExtensionStatus(),
        socialProtectionService.getExtensionAnalytics({ timeframe: '24h' })
      ]);

      // Calculate health score based on status and recent activity
      let healthScore = 100;
      
      if (!status.installed) healthScore -= 50;
      if (!status.connected) healthScore -= 30;
      if (status.version_outdated) healthScore -= 20;
      
      // Factor in recent activity
      if (analytics.scans_today === 0) healthScore -= 10;
      if (analytics.error_rate > 0.05) healthScore -= 15; // More than 5% error rate
      
      return {
        health_score: Math.max(0, healthScore),
        status,
        analytics,
        issues: [
          ...(status.installed ? [] : ['Extension not installed']),
          ...(status.connected ? [] : ['Extension not connected']),
          ...(status.version_outdated ? [] : ['Extension version outdated']),
          ...(analytics.scans_today === 0 ? [] : ['No recent activity']),
          ...(analytics.error_rate > 0.05 ? [] : ['High error rate detected']),
        ],
        recommendations: [
          ...(status.installed ? [] : ['Install the LinkShield browser extension']),
          ...(status.connected ? [] : ['Check extension permissions and refresh the page']),
          ...(status.version_outdated ? [] : ['Update extension to the latest version']),
        ]
      };
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Check health every 5 minutes
  });
}

/**
 * Hook for extension usage statistics
 * 
 * Provides detailed usage metrics for dashboard display
 * Includes trends and comparative analysis
 */
export function useExtensionUsageStats(timeframe: '7d' | '30d' | '90d' = '7d') {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'extension-usage-stats', timeframe],
    queryFn: async () => {
      const analytics = await socialProtectionService.getExtensionAnalytics({ 
        timeframe 
      });

      // Calculate additional metrics
      const avgScansPerDay = analytics.total_scans / (timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90);
      const threatDetectionRate = analytics.threats_detected / analytics.total_scans;
      
      return {
        ...analytics,
        avg_scans_per_day: Math.round(avgScansPerDay * 100) / 100,
        threat_detection_rate: Math.round(threatDetectionRate * 10000) / 100, // Percentage with 2 decimals
        activity_trend: analytics.scans_today > avgScansPerDay ? 'increasing' : 'decreasing',
      };
    },
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}