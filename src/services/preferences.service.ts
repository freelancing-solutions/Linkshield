import { apiClient } from './api';
import type { DashboardPreferences } from '@/types/dashboard';

/**
 * User Preferences API Service
 * 
 * Handles user dashboard preferences and customization settings
 */
export const preferencesService = {
  /**
   * Get user dashboard preferences
   * 
   * @returns Promise with dashboard preferences
   * @requires Authentication
   */
  getDashboardPreferences: async (): Promise<DashboardPreferences> => {
    return apiClient.get('/user/dashboard-preferences');
  },

  /**
   * Update user dashboard preferences
   * 
   * @param preferences - Preferences to update (partial)
   * @returns Promise with updated preferences
   * @requires Authentication
   */
  updateDashboardPreferences: async (
    preferences: Partial<DashboardPreferences>
  ): Promise<DashboardPreferences> => {
    return apiClient.put('/user/dashboard-preferences', preferences);
  },

  /**
   * Reset dashboard preferences to default
   * 
   * @returns Promise with default preferences
   * @requires Authentication
   */
  resetDashboardPreferences: async (): Promise<DashboardPreferences> => {
    return apiClient.post('/user/dashboard-preferences/reset');
  },

  /**
   * Update widget positions
   * 
   * @param positions - Widget positions object
   * @returns Promise that resolves when updated
   * @requires Authentication
   */
  updateWidgetPositions: async (positions: Record<string, any>): Promise<void> => {
    return apiClient.patch('/user/dashboard-preferences/widgets', {
      widget_positions: positions,
    });
  },

  /**
   * Toggle widget visibility
   * 
   * @param widgetId - Widget ID to toggle
   * @param visible - Whether widget should be visible
   * @returns Promise that resolves when updated
   * @requires Authentication
   */
  toggleWidget: async (widgetId: string, visible: boolean): Promise<void> => {
    return apiClient.patch('/user/dashboard-preferences/widgets/toggle', {
      widget_id: widgetId,
      visible,
    });
  },

  /**
   * Set default role
   * 
   * @param role - User role to set as default
   * @returns Promise that resolves when updated
   * @requires Authentication
   */
  setDefaultRole: async (role: string): Promise<void> => {
    return apiClient.patch('/user/dashboard-preferences/default-role', {
      default_role: role,
    });
  },
};
