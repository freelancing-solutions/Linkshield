import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { notificationsService } from '@/services/notifications.service';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for fetching notifications
 * 
 * @param params - Optional query parameters
 * @example
 * ```tsx
 * const { data, isLoading } = useNotifications({
 *   page: 1,
 *   per_page: 20,
 *   unread_only: true
 * });
 * ```
 */
export function useNotifications(params?: {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
  type?: string;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['notifications', 'list', params],
    queryFn: () => notificationsService.getNotifications(params),
    staleTime: 30 * 1000, // 30 seconds (notifications are time-sensitive)
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated,
    keepPreviousData: true,
  });
}

/**
 * Hook for fetching unread notifications count
 * Refetches every 30 seconds to keep count current
 * 
 * @example
 * ```tsx
 * const { data: { count }, isLoading } = useUnreadNotificationsCount();
 * ```
 */
export function useUnreadNotificationsCount() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsService.getUnreadCount(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    enabled: isAuthenticated,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

/**
 * Hook for marking a notification as read
 * 
 * @example
 * ```tsx
 * const markAsRead = useMarkNotificationAsRead();
 * 
 * const handleClick = async (notificationId) => {
 *   await markAsRead.mutateAsync(notificationId);
 * };
 * ```
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    onError: () => {
      // Silent error - marking as read is not critical
      console.error('Failed to mark notification as read');
    },
  });
}

/**
 * Hook for marking all notifications as read
 * 
 * @example
 * ```tsx
 * const markAllAsRead = useMarkAllNotificationsAsRead();
 * 
 * const handleMarkAllRead = async () => {
 *   await markAllAsRead.mutateAsync();
 * };
 * ```
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });

      toast.success('All notifications marked as read');
    },
    onError: () => {
      toast.error('Failed to mark all as read. Please try again.');
    },
  });
}

/**
 * Hook for deleting a notification
 * 
 * @example
 * ```tsx
 * const deleteNotification = useDeleteNotification();
 * 
 * const handleDelete = async (notificationId) => {
 *   await deleteNotification.mutateAsync(notificationId);
 * };
 * ```
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsService.deleteNotification(notificationId),
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });

      toast.success('Notification deleted');
    },
    onError: () => {
      toast.error('Failed to delete notification. Please try again.');
    },
  });
}

/**
 * Hook for deleting all read notifications
 * 
 * @example
 * ```tsx
 * const deleteAllRead = useDeleteAllReadNotifications();
 * 
 * const handleDeleteAllRead = async () => {
 *   if (confirm('Delete all read notifications?')) {
 *     await deleteAllRead.mutateAsync();
 *   }
 * };
 * ```
 */
export function useDeleteAllReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.deleteAllRead(),
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });

      toast.success('All read notifications deleted');
    },
    onError: () => {
      toast.error('Failed to delete notifications. Please try again.');
    },
  });
}
