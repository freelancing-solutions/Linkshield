/**
 * Social Protection Hooks
 * 
 * React Query hooks for Social Protection features including
 * extension status, algorithm health, and social media analysis.
 * 
 * Note: All hooks require authentication.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { socialProtectionService } from '@/services/social-protection.service';
import type { AnalyticsTimeRange } from '@/types/homepage';

/**
 * Hook for fetching extension status
 * 
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query hook with extension status
 * 
 * @example
 * ```tsx
 * const { data: status, isLoading } = useExtensionStatus();
 * 
 * if (status?.status === 'CONNECTED') {
 *   return <ConnectedBadge />;
 * }
 * ```
 */
export const useExtensionStatus = (enabled = true) => {
  return useQuery({
    queryKey: ['extension-status'],
    queryFn: () => socialProtectionService.getExtensionStatus(),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

/**
 * Hook for fetching extension analytics
 * 
 * @param timeRange - Time range for analytics (24h, 7d, 30d, 90d)
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query hook with analytics data
 * 
 * @example
 * ```tsx
 * const { data: analytics } = useExtensionAnalytics('7d');
 * 
 * return (
 *   <div>
 *     <p>Blocked: {analytics?.total_blocked}</p>
 *   </div>
 * );
 * ```
 */
export const useExtensionAnalytics = (
  timeRange: AnalyticsTimeRange = '7d',
  enabled = true
) => {
  return useQuery({
    queryKey: ['extension-analytics', timeRange],
    queryFn: () => socialProtectionService.getExtensionAnalytics(timeRange),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for fetching algorithm health
 * 
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query hook with algorithm health data
 * 
 * @example
 * ```tsx
 * const { data: health, isLoading } = useAlgorithmHealth();
 * 
 * if (health?.penalties.detected) {
 *   return <PenaltyWarning />;
 * }
 * ```
 */
export const useAlgorithmHealth = (enabled = true) => {
  return useQuery({
    queryKey: ['algorithm-health'],
    queryFn: () => socialProtectionService.getAlgorithmHealth(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for triggering visibility analysis
 * 
 * @returns Mutation hook for visibility analysis
 * 
 * @example
 * ```tsx
 * const analyzeVisibility = useAnalyzeVisibility();
 * 
 * const handleAnalyze = async () => {
 *   const result = await analyzeVisibility.mutateAsync();
 *   console.log('Visibility score:', result.score);
 * };
 * ```
 */
export const useAnalyzeVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialProtectionService.analyzeVisibility(),
    onSuccess: () => {
      // Invalidate algorithm health to refresh
      queryClient.invalidateQueries({ queryKey: ['algorithm-health'] });
      toast.success('Visibility analysis complete!');
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;
      
      if (errorCode === 'RATE_LIMIT_EXCEEDED') {
        toast.error('Analysis limit reached. Please try again later.');
      } else {
        toast.error('Failed to analyze visibility. Please try again.');
      }
    },
  });
};

/**
 * Hook for triggering engagement analysis
 * 
 * @returns Mutation hook for engagement analysis
 * 
 * @example
 * ```tsx
 * const analyzeEngagement = useAnalyzeEngagement();
 * 
 * const handleAnalyze = async () => {
 *   const result = await analyzeEngagement.mutateAsync();
 *   console.log('Engagement score:', result.score);
 * };
 * ```
 */
export const useAnalyzeEngagement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialProtectionService.analyzeEngagement(),
    onSuccess: () => {
      // Invalidate algorithm health to refresh
      queryClient.invalidateQueries({ queryKey: ['algorithm-health'] });
      toast.success('Engagement analysis complete!');
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;
      
      if (errorCode === 'RATE_LIMIT_EXCEEDED') {
        toast.error('Analysis limit reached. Please try again later.');
      } else {
        toast.error('Failed to analyze engagement. Please try again.');
      }
    },
  });
};

/**
 * Hook for triggering penalty detection
 * 
 * @returns Mutation hook for penalty detection
 * 
 * @example
 * ```tsx
 * const detectPenalties = useDetectPenalties();
 * 
 * const handleDetect = async () => {
 *   const result = await detectPenalties.mutateAsync();
 *   if (result.penalties_found) {
 *     console.log('Penalties:', result.penalties);
 *   }
 * };
 * ```
 */
export const useDetectPenalties = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialProtectionService.detectPenalties(),
    onSuccess: (data) => {
      // Invalidate algorithm health to refresh
      queryClient.invalidateQueries({ queryKey: ['algorithm-health'] });
      
      if (data.penalties_found) {
        toast.warning(`${data.penalties.length} penalty(ies) detected!`);
      } else {
        toast.success('No penalties detected!');
      }
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;
      
      if (errorCode === 'RATE_LIMIT_EXCEEDED') {
        toast.error('Detection limit reached. Please try again later.');
      } else {
        toast.error('Failed to detect penalties. Please try again.');
      }
    },
  });
};
