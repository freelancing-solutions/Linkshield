import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialProtectionService } from '@/services/social-protection.service';
import { useAuthStore } from '@/stores/authStore';
import { CrisisAlert } from '@/types/social-protection';
import { toast } from 'sonner';

/**
 * Hook for fetching crisis alerts with pagination and filtering
 * 
 * Retrieves security alerts, threats, and crisis notifications
 * Supports real-time updates for critical security monitoring
 */
export function useCrisisAlerts(params?: {
  page?: number;
  limit?: number;
  severity?: string;
  status?: string;
  platform?: string;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'crisis-alerts', params],
    queryFn: () => socialProtectionService.getCrisisAlerts(params),
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds - alerts need frequent updates
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Check for new alerts every minute
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
}

/**
 * Hook for fetching a specific crisis alert by ID
 * 
 * Used for detailed alert views and management
 */
export function useCrisisAlert(alertId: string, enabled: boolean = true) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'crisis-alert', alertId],
    queryFn: () => socialProtectionService.getCrisisAlert(alertId),
    enabled: enabled && isAuthenticated && !!alertId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for updating alert status (acknowledge, resolve, etc.)
 * 
 * Manages alert lifecycle and user responses to security threats
 */
export function useUpdateAlertStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      alertId, 
      status 
    }: { 
      alertId: string; 
      status: 'acknowledged' | 'resolved' 
    }) => socialProtectionService.updateAlertStatus(alertId, status),
    onSuccess: (data: CrisisAlert, variables) => {
      const statusText = variables.status === 'acknowledged' ? 'acknowledged' : 'resolved';
      toast.success(`Alert ${statusText} successfully`);
      
      // Update the specific alert in cache
      queryClient.setQueryData(
        ['social-protection', 'crisis-alert', variables.alertId],
        data
      );
      
      // Invalidate alerts list to refresh counts and status
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'crisis-alerts'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'crisis-stats'] 
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update alert status';
      toast.error(message);
    },
  });
}

/**
 * Hook for bulk updating multiple alerts
 * 
 * Efficiently manages multiple alerts simultaneously
 */
export function useBulkUpdateAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      alertIds, 
      status 
    }: { 
      alertIds: string[]; 
      status: 'acknowledged' | 'resolved' 
    }) => socialProtectionService.bulkUpdateAlerts(alertIds, status),
    onSuccess: (_, variables) => {
      const statusText = variables.status === 'acknowledged' ? 'acknowledged' : 'resolved';
      toast.success(`${variables.alertIds.length} alerts ${statusText} successfully`);
      
      // Invalidate all alert-related queries
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'crisis-alerts'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'crisis-stats'] 
      });
      
      // Invalidate individual alert queries
      variables.alertIds.forEach(alertId => {
        queryClient.invalidateQueries({ 
          queryKey: ['social-protection', 'crisis-alert', alertId] 
        });
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update alerts';
      toast.error(message);
    },
  });
}

/**
 * Hook for resolving a crisis alert
 * 
 * Convenience hook for marking alerts as resolved
 */
export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => 
      socialProtectionService.resolveCrisisAlert(alertId),
    onSuccess: (data: CrisisAlert) => {
      toast.success('Alert resolved successfully');
      
      // Update cache with resolved alert
      queryClient.setQueryData(
        ['social-protection', 'crisis-alert', data.id],
        data
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'crisis-alerts'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'crisis-stats'] 
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to resolve alert';
      toast.error(message);
    },
  });
}

/**
 * Hook for fetching crisis recommendations
 * 
 * Provides AI-generated recommendations for handling security threats
 */
export function useCrisisRecommendations(alertId?: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'crisis-recommendations', alertId],
    queryFn: () => socialProtectionService.getCrisisRecommendations(alertId),
    enabled: isAuthenticated && !!alertId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching crisis statistics
 * 
 * Provides overview metrics for crisis management dashboard
 */
export function useCrisisStats() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'crisis-stats'],
    queryFn: () => socialProtectionService.getCrisisStats(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Update stats every 5 minutes
  });
}

/**
 * Hook for monitoring unread crisis alerts
 * 
 * Tracks new and unacknowledged alerts for notification purposes
 */
export function useUnreadAlertsCount() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'unread-alerts-count'],
    queryFn: async () => {
      const response = await socialProtectionService.getCrisisAlerts({
        status: 'active',
        limit: 1000, // Get all active alerts to count them
      });
      
      return {
        total: response.total,
        critical: response.data.filter(alert => alert.severity === 'critical').length,
        high: response.data.filter(alert => alert.severity === 'high').length,
        medium: response.data.filter(alert => alert.severity === 'medium').length,
      };
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Check every minute
  });
}