import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { preferencesService } from '@/services/preferences.service';
import { useAuthStore } from '@/stores/authStore';
import type { DashboardPreferences } from '@/types/dashboard';

/**
 * Hook for fetching dashboard preferences
 * 
 * @example
 * ```tsx
 * const { data: preferences, isLoading } = useDashboardPreferences();
 * ```
 */
export function useDashboardPreferences() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['preferences', 'dashboard'],
    queryFn: () => preferencesService.getDashboardPreferences(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: isAuthenticated,
  });
}

/**
 * Hook for updating dashboard preferences
 * 
 * @example
 * ```tsx
 * const updatePreferences = useUpdateDashboardPreferences();
 * 
 * const handleUpdate = async (preferences) => {
 *   await updatePreferences.mutateAsync(preferences);
 * };
 * ```
 */
export function useUpdateDashboardPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Partial<DashboardPreferences>) =>
      preferencesService.updateDashboardPreferences(preferences),
    onMutate: async (newPreferences) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['preferences', 'dashboard'] });

      // Snapshot previous value
      const previousPreferences = queryClient.getQueryData<DashboardPreferences>([
        'preferences',
        'dashboard',
      ]);

      // Optimistically update
      queryClient.setQueryData<DashboardPreferences>(['preferences', 'dashboard'], (old) => {
        if (!old) return old;
        return { ...old, ...newPreferences };
      });

      return { previousPreferences };
    },
    onSuccess: (updatedPreferences) => {
      // Update cache with server response
      queryClient.setQueryData(['preferences', 'dashboard'], updatedPreferences);

      toast.success('Preferences updated successfully');
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPreferences) {
        queryClient.setQueryData(['preferences', 'dashboard'], context.previousPreferences);
      }

      toast.error('Failed to update preferences. Please try again.');
    },
  });
}

/**
 * Hook for resetting dashboard preferences to default
 * 
 * @example
 * ```tsx
 * const resetPreferences = useResetDashboardPreferences();
 * 
 * const handleReset = async () => {
 *   if (confirm('Reset to default preferences?')) {
 *     await resetPreferences.mutateAsync();
 *   }
 * };
 * ```
 */
export function useResetDashboardPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => preferencesService.resetDashboardPreferences(),
    onSuccess: (defaultPreferences) => {
      // Update cache with default preferences
      queryClient.setQueryData(['preferences', 'dashboard'], defaultPreferences);

      toast.success('Preferences reset to default');
    },
    onError: () => {
      toast.error('Failed to reset preferences. Please try again.');
    },
  });
}

/**
 * Hook for updating widget positions
 * 
 * @example
 * ```tsx
 * const updateWidgetPositions = useUpdateWidgetPositions();
 * 
 * const handleDragEnd = async (positions) => {
 *   await updateWidgetPositions.mutateAsync(positions);
 * };
 * ```
 */
export function useUpdateWidgetPositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (positions: Record<string, any>) =>
      preferencesService.updateWidgetPositions(positions),
    onMutate: async (newPositions) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['preferences', 'dashboard'] });

      // Snapshot previous value
      const previousPreferences = queryClient.getQueryData<DashboardPreferences>([
        'preferences',
        'dashboard',
      ]);

      // Optimistically update
      queryClient.setQueryData<DashboardPreferences>(['preferences', 'dashboard'], (old) => {
        if (!old) return old;
        return {
          ...old,
          widget_positions: newPositions,
        };
      });

      return { previousPreferences };
    },
    onSuccess: () => {
      // Invalidate to get fresh data
      queryClient.invalidateQueries({ queryKey: ['preferences', 'dashboard'] });

      // Silent success - no toast for drag operations
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPreferences) {
        queryClient.setQueryData(['preferences', 'dashboard'], context.previousPreferences);
      }

      toast.error('Failed to save widget positions. Please try again.');
    },
  });
}

/**
 * Hook for toggling widget visibility
 * 
 * @example
 * ```tsx
 * const toggleWidget = useToggleWidget();
 * 
 * const handleToggle = async (widgetId, visible) => {
 *   await toggleWidget.mutateAsync({ widgetId, visible });
 * };
 * ```
 */
export function useToggleWidget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ widgetId, visible }: { widgetId: string; visible: boolean }) =>
      preferencesService.toggleWidget(widgetId, visible),
    onSuccess: (_, { widgetId, visible }) => {
      // Invalidate preferences
      queryClient.invalidateQueries({ queryKey: ['preferences', 'dashboard'] });

      toast.success(`Widget ${visible ? 'shown' : 'hidden'}`);
    },
    onError: () => {
      toast.error('Failed to toggle widget. Please try again.');
    },
  });
}

/**
 * Hook for setting default role
 * 
 * @example
 * ```tsx
 * const setDefaultRole = useSetDefaultRole();
 * 
 * const handleRoleChange = async (role) => {
 *   await setDefaultRole.mutateAsync(role);
 * };
 * ```
 */
export function useSetDefaultRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: string) => preferencesService.setDefaultRole(role),
    onSuccess: (_, role) => {
      // Invalidate preferences
      queryClient.invalidateQueries({ queryKey: ['preferences', 'dashboard'] });

      toast.success(`Default role set to ${role}`);
    },
    onError: () => {
      toast.error('Failed to set default role. Please try again.');
    },
  });
}
