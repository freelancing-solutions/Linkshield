import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { dashboardService } from '@/services/dashboard.service';
import { useAuthStore } from '@/stores/authStore';
import type { AlertFilters, ResolveAlertData, Alert } from '@/types/dashboard';

/**
 * Hook for fetching alerts with filters
 * 
 * @param filters - Optional filters for alerts
 * @example
 * ```tsx
 * const { data, isLoading } = useAlerts({
 *   project_id: 'project-123',
 *   severity: 'high',
 *   status: 'active'
 * });
 * ```
 */
export function useAlerts(filters?: AlertFilters) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['alerts', 'list', filters],
    queryFn: () => dashboardService.getAlerts(filters),
    staleTime: 1 * 60 * 1000, // 1 minute (alerts are time-sensitive)
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated,
    keepPreviousData: true,
  });
}

/**
 * Hook for fetching single alert by ID
 * 
 * @param projectId - Project ID
 * @param alertId - Alert ID
 * @example
 * ```tsx
 * const { data: alert, isLoading } = useAlert('project-123', 'alert-456');
 * ```
 */
export function useAlert(projectId: string, alertId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['alerts', 'detail', projectId, alertId],
    queryFn: () => dashboardService.getAlert(projectId, alertId),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated && !!projectId && !!alertId,
  });
}

/**
 * Hook for resolving an alert
 * 
 * @example
 * ```tsx
 * const resolveAlert = useResolveAlert();
 * 
 * const handleResolve = async (projectId, alertId, notes) => {
 *   await resolveAlert.mutateAsync({
 *     projectId,
 *     alertId,
 *     data: { resolution_notes: notes }
 *   });
 * };
 * ```
 */
export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      alertId,
      data,
    }: {
      projectId: string;
      alertId: string;
      data?: ResolveAlertData;
    }) => dashboardService.resolveAlert(projectId, alertId, data),
    onMutate: async ({ projectId, alertId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['alerts', 'detail', projectId, alertId] });

      // Snapshot previous value
      const previousAlert = queryClient.getQueryData<Alert>([
        'alerts',
        'detail',
        projectId,
        alertId,
      ]);

      // Optimistically update
      queryClient.setQueryData<Alert>(['alerts', 'detail', projectId, alertId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        };
      });

      return { previousAlert };
    },
    onSuccess: (_, { projectId, alertId }) => {
      // Invalidate alerts list
      queryClient.invalidateQueries({ queryKey: ['alerts', 'list'] });

      // Invalidate alert detail
      queryClient.invalidateQueries({ queryKey: ['alerts', 'detail', projectId, alertId] });

      // Invalidate project detail (active_alerts count might change)
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', projectId] });

      // Invalidate dashboard overview
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });

      toast.success('Alert resolved successfully');
    },
    onError: (error, { projectId, alertId }, context) => {
      // Rollback on error
      if (context?.previousAlert) {
        queryClient.setQueryData(
          ['alerts', 'detail', projectId, alertId],
          context.previousAlert
        );
      }

      toast.error('Failed to resolve alert. Please try again.');
    },
  });
}

/**
 * Hook for acknowledging an alert
 * 
 * @example
 * ```tsx
 * const acknowledgeAlert = useAcknowledgeAlert();
 * 
 * const handleAcknowledge = async (projectId, alertId) => {
 *   await acknowledgeAlert.mutateAsync({ projectId, alertId });
 * };
 * ```
 */
export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, alertId }: { projectId: string; alertId: string }) =>
      dashboardService.acknowledgeAlert(projectId, alertId),
    onMutate: async ({ projectId, alertId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['alerts', 'detail', projectId, alertId] });

      // Snapshot previous value
      const previousAlert = queryClient.getQueryData<Alert>([
        'alerts',
        'detail',
        projectId,
        alertId,
      ]);

      // Optimistically update
      queryClient.setQueryData<Alert>(['alerts', 'detail', projectId, alertId], (old) => {
        if (!old) return old;
        return { ...old, status: 'acknowledged' };
      });

      return { previousAlert };
    },
    onSuccess: (_, { projectId, alertId }) => {
      // Invalidate alerts list
      queryClient.invalidateQueries({ queryKey: ['alerts', 'list'] });

      // Invalidate alert detail
      queryClient.invalidateQueries({ queryKey: ['alerts', 'detail', projectId, alertId] });

      toast.success('Alert acknowledged');
    },
    onError: (error, { projectId, alertId }, context) => {
      // Rollback on error
      if (context?.previousAlert) {
        queryClient.setQueryData(
          ['alerts', 'detail', projectId, alertId],
          context.previousAlert
        );
      }

      toast.error('Failed to acknowledge alert. Please try again.');
    },
  });
}

/**
 * Hook for dismissing an alert
 * 
 * @example
 * ```tsx
 * const dismissAlert = useDismissAlert();
 * 
 * const handleDismiss = async (projectId, alertId) => {
 *   await dismissAlert.mutateAsync({ projectId, alertId });
 * };
 * ```
 */
export function useDismissAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, alertId }: { projectId: string; alertId: string }) =>
      dashboardService.dismissAlert(projectId, alertId),
    onSuccess: (_, { projectId, alertId }) => {
      // Invalidate alerts list
      queryClient.invalidateQueries({ queryKey: ['alerts', 'list'] });

      // Invalidate alert detail
      queryClient.invalidateQueries({ queryKey: ['alerts', 'detail', projectId, alertId] });

      toast.success('Alert dismissed');
    },
    onError: () => {
      toast.error('Failed to dismiss alert. Please try again.');
    },
  });
}

/**
 * Hook for bulk resolving alerts
 * 
 * @example
 * ```tsx
 * const bulkResolveAlerts = useBulkResolveAlerts();
 * 
 * const handleBulkResolve = async (projectId, alertIds) => {
 *   await bulkResolveAlerts.mutateAsync({
 *     projectId,
 *     alertIds,
 *     data: { resolution_notes: 'Bulk resolved' }
 *   });
 * };
 * ```
 */
export function useBulkResolveAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      alertIds,
      data,
    }: {
      projectId: string;
      alertIds: string[];
      data?: ResolveAlertData;
    }) => dashboardService.bulkResolveAlerts(projectId, alertIds, data),
    onSuccess: (_, { projectId, alertIds }) => {
      // Invalidate alerts list
      queryClient.invalidateQueries({ queryKey: ['alerts', 'list'] });

      // Invalidate project detail
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', projectId] });

      // Invalidate dashboard overview
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] });

      toast.success(`${alertIds.length} alert(s) resolved successfully`);
    },
    onError: () => {
      toast.error('Failed to resolve alerts. Please try again.');
    },
  });
}
