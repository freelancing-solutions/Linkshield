import { apiClient } from './api';
import type { Notification, NotificationsResponse } from '@/types/dashboard';

/**
 * Notifications API Service
 * 
 * Handles all notification-related API calls including:
 * - Fetching notifications
 * - Marking notifications as read
 * - Managing notification preferences
 */
export const notificationsService = {
  /**
   * Get user notifications
   * 
   * @param params - Optional query parameters
   * @returns Promise with notifications response
   * @requires Authentication
   */
  getNotifications: async (params?: {
    page?: number;
    per_page?: number;
    unread_only?: boolean;
    type?: string;
  }): Promise<NotificationsResponse> => {
    return apiClient.get('/notifications', { params });
  },

  /**
   * Get single notification by ID
   * 
   * @param notificationId - Notification ID
   * @returns Promise with notification
   * @requires Authentication
   */
  getNotification: async (notificationId: string): Promise<Notification> => {
    return apiClient.get(`/notifications/${notificationId}`);
  },

  /**
   * Mark a notification as read
   * 
   * @param notificationId - Notification ID
   * @returns Promise that resolves when marked as read
   * @requires Authentication
   */
  markAsRead: async (notificationId: string): Promise<void> => {
    return apiClient.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   * 
   * @returns Promise that resolves when all marked as read
   * @requires Authentication
   */
  markAllAsRead: async (): Promise<void> => {
    return apiClient.post('/notifications/mark-all-read');
  },

  /**
   * Delete a notification
   * 
   * @param notificationId - Notification ID
   * @returns Promise that resolves when deleted
   * @requires Authentication
   */
  deleteNotification: async (notificationId: string): Promise<void> => {
    return apiClient.delete(`/notifications/${notificationId}`);
  },

  /**
   * Delete all read notifications
   * 
   * @returns Promise that resolves when deleted
   * @requires Authentication
   */
  deleteAllRead: async (): Promise<void> => {
    return apiClient.delete('/notifications/read');
  },

  /**
   * Get unread notifications count
   * 
   * @returns Promise with unread count
   * @requires Authentication
   */
  getUnreadCount: async (): Promise<{ count: number }> => {
    return apiClient.get('/notifications/unread-count');
  },
};
