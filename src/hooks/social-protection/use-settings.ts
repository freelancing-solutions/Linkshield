import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialProtectionService } from '@/services/social-protection.service';
import { useAuthStore } from '@/stores/authStore';
import { SocialProtectionSettings } from '@/types/social-protection';
import { toast } from 'sonner';

/**
 * Hook for fetching social protection settings
 * 
 * Retrieves user preferences, notification settings, and security configurations
 * Provides centralized settings management for the social protection module
 */
export function useSocialProtectionSettings() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'settings'],
    queryFn: () => socialProtectionService.getSettings(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes - settings change infrequently
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook for updating social protection settings
 * 
 * Handles partial updates to user settings with optimistic updates
 * Provides immediate feedback and error handling
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<SocialProtectionSettings>) => 
      socialProtectionService.updateSettings(settings),
    onMutate: async (newSettings) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ['social-protection', 'settings'] 
      });

      // Snapshot previous value
      const previousSettings = queryClient.getQueryData<SocialProtectionSettings>(
        ['social-protection', 'settings']
      );

      // Optimistically update settings
      if (previousSettings) {
        queryClient.setQueryData<SocialProtectionSettings>(
          ['social-protection', 'settings'],
          { ...previousSettings, ...newSettings }
        );
      }

      return { previousSettings };
    },
    onSuccess: (data) => {
      toast.success('Settings updated successfully');
      
      // Update cache with server response
      queryClient.setQueryData(['social-protection', 'settings'], data);
    },
    onError: (error: any, _, context) => {
      // Rollback optimistic update
      if (context?.previousSettings) {
        queryClient.setQueryData(
          ['social-protection', 'settings'],
          context.previousSettings
        );
      }
      
      const message = error?.response?.data?.message || 'Failed to update settings';
      toast.error(message);
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'settings'] 
      });
    },
  });
}

/**
 * Hook for resetting settings to default values
 * 
 * Provides a way to restore default configuration
 * Useful for troubleshooting and onboarding
 */
export function useResetSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialProtectionService.resetSettings(),
    onSuccess: (data) => {
      toast.success('Settings reset to defaults');
      
      // Update cache with default settings
      queryClient.setQueryData(['social-protection', 'settings'], data);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to reset settings';
      toast.error(message);
    },
  });
}

/**
 * Hook for updating notification preferences
 * 
 * Convenience hook for managing notification settings specifically
 * Provides granular control over different notification types
 */
export function useUpdateNotificationSettings() {
  const updateSettings = useUpdateSettings();

  return useMutation({
    mutationFn: (notifications: SocialProtectionSettings['notifications']) =>
      updateSettings.mutateAsync({ notifications }),
    onSuccess: () => {
      toast.success('Notification preferences updated');
    },
  });
}

/**
 * Hook for updating security preferences
 * 
 * Manages security-related settings like scan frequency and risk thresholds
 * Ensures security configurations are properly validated
 */
export function useUpdateSecuritySettings() {
  const updateSettings = useUpdateSettings();

  return useMutation({
    mutationFn: (security: Partial<SocialProtectionSettings['security']>) => {
      // Validate security settings before updating
      if (security.risk_threshold && (security.risk_threshold < 0 || security.risk_threshold > 100)) {
        throw new Error('Risk threshold must be between 0 and 100');
      }
      
      if (security.scan_frequency && !['real-time', 'hourly', 'daily'].includes(security.scan_frequency)) {
        throw new Error('Invalid scan frequency');
      }

      return updateSettings.mutateAsync({ 
        security: security as SocialProtectionSettings['security']
      });
    },
    onSuccess: () => {
      toast.success('Security settings updated');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to update security settings';
      toast.error(message);
    },
  });
}

/**
 * Hook for updating privacy preferences
 * 
 * Manages data collection and sharing preferences
 * Ensures compliance with privacy regulations
 */
export function useUpdatePrivacySettings() {
  const updateSettings = useUpdateSettings();

  return useMutation({
    mutationFn: (privacy: SocialProtectionSettings['privacy']) =>
      updateSettings.mutateAsync({ privacy }),
    onSuccess: () => {
      toast.success('Privacy settings updated');
    },
  });
}

/**
 * Hook for managing extension settings
 * 
 * Controls browser extension behavior and integration
 * Syncs settings between web app and extension
 */
export function useUpdateExtensionSettings() {
  const updateSettings = useUpdateSettings();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (extension: SocialProtectionSettings['extension']) =>
      updateSettings.mutateAsync({ extension }),
    onSuccess: () => {
      toast.success('Extension settings updated');
      
      // Trigger extension sync to apply new settings
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'extension-status'] 
      });
    },
  });
}

/**
 * Hook for validating settings before save
 * 
 * Provides client-side validation for settings forms
 * Prevents invalid configurations from being submitted
 */
export function useValidateSettings() {
  return useMutation({
    mutationFn: async (settings: Partial<SocialProtectionSettings>) => {
      const errors: Record<string, string> = {};

      // Validate notification settings
      if (settings.notifications) {
        const { notifications } = settings;
        if (notifications.email_frequency && 
            !['immediate', 'hourly', 'daily', 'weekly'].includes(notifications.email_frequency)) {
          errors.email_frequency = 'Invalid email frequency';
        }
      }

      // Validate security settings
      if (settings.security) {
        const { security } = settings;
        if (security.risk_threshold !== undefined && 
            (security.risk_threshold < 0 || security.risk_threshold > 100)) {
          errors.risk_threshold = 'Risk threshold must be between 0 and 100';
        }
        
        if (security.scan_frequency && 
            !['real-time', 'hourly', 'daily'].includes(security.scan_frequency)) {
          errors.scan_frequency = 'Invalid scan frequency';
        }
      }

      if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors));
      }

      return { valid: true };
    },
  });
}