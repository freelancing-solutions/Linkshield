import { useQuery } from '@tanstack/react-query';
import { socialProtectionService } from '@/services/social-protection.service';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for fetching algorithm health for a specific platform
 * 
 * Monitors algorithm performance, engagement rates, and potential issues
 * for connected social media platforms
 */
export function usePlatformHealth(platform: string, enabled: boolean = true) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'algorithm-health', platform],
    queryFn: () => socialProtectionService.getPlatformHealth(platform),
    enabled: enabled && isAuthenticated && !!platform,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes for health monitoring
  });
}

/**
 * Hook for fetching algorithm health trends over time
 * 
 * Provides historical data for trend analysis and performance tracking
 * Supports different timeframes for various analysis needs
 */
export function useHealthTrends(params?: {
  platform?: string;
  timeframe?: '7d' | '30d' | '90d';
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'health-trends', params],
    queryFn: () => socialProtectionService.getHealthTrends(params),
    enabled: isAuthenticated,
    staleTime: 15 * 60 * 1000, // 15 minutes - trends change slowly
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook for monitoring overall algorithm health across all platforms
 * 
 * Aggregates health data from all connected platforms
 * Used for dashboard overview and general health monitoring
 */
export function useOverallAlgorithmHealth() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'overall-algorithm-health'],
    queryFn: async () => {
      // Fetch health trends without platform filter to get all platforms
      const trends = await socialProtectionService.getHealthTrends({
        timeframe: '7d'
      });
      
      // Calculate overall health metrics
      if (trends.length === 0) {
        return {
          overall_score: 0,
          platforms_count: 0,
          healthy_platforms: 0,
          at_risk_platforms: 0,
          critical_platforms: 0,
          trends: []
        };
      }

      const latest = trends[trends.length - 1];
      const healthyCount = trends.filter(t => t.health_score >= 80).length;
      const atRiskCount = trends.filter(t => t.health_score >= 60 && t.health_score < 80).length;
      const criticalCount = trends.filter(t => t.health_score < 60).length;

      return {
        overall_score: latest.health_score,
        platforms_count: trends.length,
        healthy_platforms: healthyCount,
        at_risk_platforms: atRiskCount,
        critical_platforms: criticalCount,
        trends: trends
      };
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for monitoring algorithm health alerts
 * 
 * Tracks significant changes in algorithm performance that require attention
 * Used for proactive monitoring and early warning systems
 */
export function useAlgorithmHealthAlerts() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'algorithm-health-alerts'],
    queryFn: async () => {
      // Get recent trends to identify alerts
      const trends = await socialProtectionService.getHealthTrends({
        timeframe: '7d'
      });

      // Identify platforms with declining health
      const alerts = trends
        .filter(trend => {
          // Alert if health score dropped significantly or is critically low
          return trend.health_score < 70 || 
                 (trend.engagement_rate && trend.engagement_rate < 0.02) ||
                 (trend.reach_decline && trend.reach_decline > 20);
        })
        .map(trend => ({
          platform: trend.platform,
          severity: trend.health_score < 50 ? 'critical' : 
                   trend.health_score < 70 ? 'warning' : 'info',
          message: `Algorithm health declining on ${trend.platform}`,
          health_score: trend.health_score,
          timestamp: trend.timestamp,
        }));

      return alerts;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes - alerts need frequent updates
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Check for new alerts every 5 minutes
  });
}