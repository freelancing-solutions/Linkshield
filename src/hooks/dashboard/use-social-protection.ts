import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { socialProtectionService } from '@/services/social-protection.service';
import { useAuthStore } from '@/stores/authStore';
import type {
  BatchAnalysisRequest,
  CrisisAlertFilters,
  ResolveCrisisAlertData,
  ExtensionSettings,
} from '@/types/dashboard';

// ============================================================================
// Dashboard Overview
// ============================================================================

/**
 * Hook for fetching social protection overview
 * 
 * @param projectId - Optional project ID to filter by
 * @example
 * ```tsx
 * const { data, isLoading } = useSocialProtectionOverview('project-123');
 * ```
 */
export function useSocialProtectionOverview(projectId?: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'overview', projectId],
    queryFn: () => socialProtectionService.getSocialProtectionOverview(projectId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: isAuthenticated,
  });
}

// ============================================================================
// Extension Status and Analytics
// ============================================================================

/**
 * Hook for fetching extension status
 * Refetches every minute to keep status current
 * 
 * @example
 * ```tsx
 * const { data: status, isLoading } = useExtensionStatus();
 * ```
 */
export function useExtensionStatus() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['extension', 'status'],
    queryFn: () => socialProtectionService.getExtensionStatus(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated,
    refetchInterval: 1 * 60 * 1000, // Refetch every minute
  });
}

/**
 * Hook for fetching extension analytics
 * 
 * @param timeRange - Time range for analytics (1h, 24h, 7d, 30d)
 * @example
 * ```tsx
 * const { data: analytics, isLoading } = useExtensionAnalytics('7d');
 * ```
 */
export function useExtensionAnalytics(timeRange: string = '7d') {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['extension', 'analytics', timeRange],
    queryFn: () => socialProtectionService.getExtensionAnalytics(timeRange as any),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: isAuthenticated,
  });
}

/**
 * Hook for fetching extension settings
 * 
 * @example
 * ```tsx
 * const { data: settings, isLoading } = useExtensionSettings();
 * ```
 */
export function useExtensionSettings() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['extension', 'settings'],
    queryFn: () => socialProtectionService.getExtensionSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: isAuthenticated,
  });
}

/**
 * Hook for updating extension settings
 * 
 * @example
 * ```tsx
 * const updateSettings = useUpdateExtensionSettings();
 * 
 * const handleUpdate = async (settings) => {
 *   await updateSettings.mutateAsync(settings);
 * };
 * ```
 */
export function useUpdateExtensionSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<ExtensionSettings>) =>
      socialProtectionService.updateExtensionSettings(settings),
    onSuccess: (updatedSettings) => {
      // Update cache
      queryClient.setQueryData(['extension', 'settings'], updatedSettings);

      toast.success('Extension settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings. Please try again.');
    },
  });
}

/**
 * Hook for manually syncing extension data
 * 
 * @example
 * ```tsx
 * const syncExtension = useSyncExtension();
 * 
 * const handleSync = async () => {
 *   await syncExtension.mutateAsync();
 * };
 * ```
 */
export function useSyncExtension() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialProtectionService.syncExtension(),
    onSuccess: () => {
      // Invalidate extension data
      queryClient.invalidateQueries({ queryKey: ['extension'] });

      toast.success('Extension synced successfully');
    },
    onError: () => {
      toast.error('Failed to sync extension. Please try again.');
    },
  });
}

// ============================================================================
// Algorithm Health
// ============================================================================

/**
 * Hook for fetching algorithm health
 * 
 * @example
 * ```tsx
 * const { data: health, isLoading } = useAlgorithmHealth();
 * ```
 */
export function useAlgorithmHealth() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['algorithm-health'],
    queryFn: () => socialProtectionService.getAlgorithmHealth(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: isAuthenticated,
  });
}

/**
 * Hook for triggering visibility analysis
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
export function useAnalyzeVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialProtectionService.analyzeVisibility(),
    onSuccess: () => {
      // Invalidate algorithm health
      queryClient.invalidateQueries({ queryKey: ['algorithm-health'] });

      toast.success('Visibility analysis completed');
    },
    onError: () => {
      toast.error('Failed to analyze visibility. Please try again.');
    },
  });
}

/**
 * Hook for triggering engagement analysis
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
export function useAnalyzeEngagement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialProtectionService.analyzeEngagement(),
    onSuccess: () => {
      // Invalidate algorithm health
      queryClient.invalidateQueries({ queryKey: ['algorithm-health'] });

      toast.success('Engagement analysis completed');
    },
    onError: () => {
      toast.error('Failed to analyze engagement. Please try again.');
    },
  });
}

/**
 * Hook for triggering penalty detection
 * 
 * @example
 * ```tsx
 * const detectPenalties = useDetectPenalties();
 * 
 * const handleDetect = async () => {
 *   const result = await detectPenalties.mutateAsync();
 *   if (result.detected) {
 *     console.log('Penalty detected:', result.type);
 *   }
 * };
 * ```
 */
export function useDetectPenalties() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialProtectionService.detectPenalties(),
    onSuccess: (result) => {
      // Invalidate algorithm health
      queryClient.invalidateQueries({ queryKey: ['algorithm-health'] });

      if (result.detected) {
        toast.error('Penalty detected! Check recommendations.');
      } else {
        toast.success('No penalties detected');
      }
    },
    onError: () => {
      toast.error('Failed to detect penalties. Please try again.');
    },
  });
}

/**
 * Hook for batch analysis (Pro+ feature)
 * 
 * @example
 * ```tsx
 * const batchAnalyze = useBatchAnalyze();
 * 
 * const handleBatchAnalyze = async (data) => {
 *   const result = await batchAnalyze.mutateAsync(data);
 *   console.log('Job ID:', result.job_id);
 * };
 * ```
 */
export function useBatchAnalyze() {
  return useMutation({
    mutationFn: (data: BatchAnalysisRequest) => socialProtectionService.batchAnalyze(data),
    onSuccess: (result) => {
      toast.success(`Batch analysis started. Job ID: ${result.job_id}`);
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;

      if (errorCode === 'PLAN_UPGRADE_REQUIRED') {
        toast.error('Batch analysis requires a Pro+ subscription.');
      } else {
        toast.error('Failed to start batch analysis. Please try again.');
      }
    },
  });
}

/**
 * Hook for fetching batch analysis status
 * 
 * @param jobId - Batch analysis job ID
 * @example
 * ```tsx
 * const { data: status, isLoading } = useBatchAnalysisStatus('job-123');
 * ```
 */
export function useBatchAnalysisStatus(jobId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['batch-analysis', jobId],
    queryFn: () => socialProtectionService.getBatchAnalysisStatus(jobId),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated && !!jobId,
    refetchInterval: (data) => {
      // Stop refetching if completed or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      return 5000; // Refetch every 5 seconds while processing
    },
  });
}

// ============================================================================
// Crisis Alerts
// ============================================================================

/**
 * Hook for fetching crisis alerts
 * 
 * @param filters - Optional filters for crisis alerts
 * @example
 * ```tsx
 * const { data: alerts, isLoading } = useCrisisAlerts({
 *   severity: 'high',
 *   resolved: false
 * });
 * ```
 */
export function useCrisisAlerts(filters?: CrisisAlertFilters) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['crisis-alerts', 'list', filters],
    queryFn: () => socialProtectionService.getCrisisAlerts(filters),
    staleTime: 1 * 60 * 1000, // 1 minute (crises are time-sensitive)
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated,
  });
}

/**
 * Hook for fetching single crisis alert
 * 
 * @param alertId - Crisis alert ID
 * @example
 * ```tsx
 * const { data: alert, isLoading } = useCrisisAlert('alert-123');
 * ```
 */
export function useCrisisAlert(alertId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['crisis-alerts', 'detail', alertId],
    queryFn: () => socialProtectionService.getCrisisAlert(alertId),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated && !!alertId,
  });
}

/**
 * Hook for resolving a crisis alert
 * 
 * @example
 * ```tsx
 * const resolveCrisisAlert = useResolveCrisisAlert();
 * 
 * const handleResolve = async (alertId, data) => {
 *   await resolveCrisisAlert.mutateAsync({ alertId, data });
 * };
 * ```
 */
export function useResolveCrisisAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, data }: { alertId: string; data: ResolveCrisisAlertData }) =>
      socialProtectionService.resolveCrisisAlert(alertId, data),
    onSuccess: (_, { alertId }) => {
      // Invalidate crisis alerts list
      queryClient.invalidateQueries({ queryKey: ['crisis-alerts', 'list'] });

      // Invalidate alert detail
      queryClient.invalidateQueries({ queryKey: ['crisis-alerts', 'detail', alertId] });

      // Invalidate social protection overview
      queryClient.invalidateQueries({ queryKey: ['social-protection', 'overview'] });

      toast.success('Crisis alert resolved successfully');
    },
    onError: () => {
      toast.error('Failed to resolve crisis alert. Please try again.');
    },
  });
}

/**
 * Hook for fetching crisis recommendations
 * 
 * @param alertId - Crisis alert ID
 * @example
 * ```tsx
 * const { data: recommendations, isLoading } = useCrisisRecommendations('alert-123');
 * ```
 */
export function useCrisisRecommendations(alertId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['crisis-alerts', alertId, 'recommendations'],
    queryFn: () => socialProtectionService.getCrisisRecommendations(alertId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: isAuthenticated && !!alertId,
  });
}

/**
 * Hook for fetching crisis statistics
 * 
 * @param timeRange - Time range for stats (7d, 30d, 90d)
 * @example
 * ```tsx
 * const { data: stats, isLoading } = useCrisisStats('30d');
 * ```
 */
export function useCrisisStats(timeRange: string = '30d') {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['crisis-alerts', 'stats', timeRange],
    queryFn: () => socialProtectionService.getCrisisStats(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: isAuthenticated,
  });
}

// ============================================================================
// Bot Health
// ============================================================================

/**
 * Hook for fetching bot health status
 * Refetches every 5 minutes to keep status current
 * 
 * @example
 * ```tsx
 * const { data: health, isLoading } = useBotHealth();
 * ```
 */
export function useBotHealth() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['bot-health'],
    queryFn: () => socialProtectionService.getBotHealth(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: isAuthenticated,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * Hook for restarting a bot service
 * 
 * @example
 * ```tsx
 * const restartBot = useRestartBot();
 * 
 * const handleRestart = async (serviceName) => {
 *   await restartBot.mutateAsync(serviceName);
 * };
 * ```
 */
export function useRestartBot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceName: string) => socialProtectionService.restartBot(serviceName),
    onSuccess: (_, serviceName) => {
      // Invalidate bot health
      queryClient.invalidateQueries({ queryKey: ['bot-health'] });

      toast.success(`Bot service "${serviceName}" restart initiated`);
    },
    onError: (error: any) => {
      const errorCode = error.response?.data?.error_code;

      if (errorCode === 'INSUFFICIENT_PERMISSIONS') {
        toast.error('You do not have permission to restart bot services.');
      } else {
        toast.error('Failed to restart bot service. Please try again.');
      }
    },
  });
}
