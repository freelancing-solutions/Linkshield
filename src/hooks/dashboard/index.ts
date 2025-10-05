/**
 * Dashboard Hooks
 * 
 * This file exports all dashboard-related React Query hooks.
 */

// Dashboard Overview
export { useDashboardOverview } from './use-dashboard';

// Projects
export {
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useToggleMonitoring,
} from './use-projects';

// Team
export {
  useTeamMembers,
  useInviteTeamMember,
  useRemoveTeamMember,
  useUpdateTeamMemberRole,
} from './use-team';

// Alerts
export {
  useAlerts,
  useAlert,
  useResolveAlert,
  useAcknowledgeAlert,
  useDismissAlert,
  useBulkResolveAlerts,
} from './use-alerts';

// Social Protection
export {
  useSocialProtectionOverview,
  useExtensionStatus,
  useExtensionAnalytics,
  useExtensionSettings,
  useUpdateExtensionSettings,
  useSyncExtension,
  useAlgorithmHealth,
  useAnalyzeVisibility,
  useAnalyzeEngagement,
  useDetectPenalties,
  useBatchAnalyze,
  useBatchAnalysisStatus,
  useCrisisAlerts,
  useCrisisAlert,
  useResolveCrisisAlert,
  useCrisisRecommendations,
  useCrisisStats,
  useBotHealth,
  useRestartBot,
} from './use-social-protection';

// Notifications
export {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  useDeleteAllReadNotifications,
} from './use-notifications';

// Search
export { useSearch, useSearchSuggestions, useRecentSearches } from './use-search';

// Preferences
export {
  useDashboardPreferences,
  useUpdateDashboardPreferences,
  useResetDashboardPreferences,
  useUpdateWidgetPositions,
  useToggleWidget,
  useSetDefaultRole,
} from './use-preferences';
