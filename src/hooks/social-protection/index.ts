/**
 * Social Protection Hooks
 * 
 * Centralized exports for all social protection React Query hooks
 * Provides data fetching, mutations, and state management for the social protection module
 */

// Dashboard hooks
export { useSocialProtectionDashboard } from './use-dashboard';

// Platform scanning hooks
export {
  useInitiateScan,
  useScanStatus,
  useScans,
  useDisconnectPlatform,
  useTestCredentials,
  useSupportedPlatforms,
} from './use-platform-scanning';

// Content analysis hooks
export {
  useAnalyzeContent,
  useAnalyzeContentAnonymous,
  useAnalysisHistory,
  useRealTimeAnalysis,
} from './use-content-analysis';

// Algorithm health hooks
export {
  usePlatformHealth,
  useHealthTrends,
  useOverallAlgorithmHealth,
  useAlgorithmHealthAlerts,
} from './use-algorithm-health';

// Crisis alerts hooks
export {
  useCrisisAlerts,
  useCrisisAlert,
  useUpdateAlertStatus,
  useBulkUpdateAlerts,
  useResolveAlert,
  useCrisisRecommendations,
  useCrisisStats,
  useUnreadAlertsCount,
} from './use-crisis-alerts';

// Extension management hooks
export {
  useExtensionStatus,
  useExtensionAnalytics,
  useSyncExtension,
  useExtensionDownloads,
  useExtensionHealth,
  useExtensionUsageStats,
} from './use-extension';

// Settings management hooks
export {
  useSocialProtectionSettings,
  useUpdateSettings,
  useResetSettings,
  useUpdateNotificationSettings,
  useUpdateSecuritySettings,
  useUpdatePrivacySettings,
  useUpdateExtensionSettings,
  useValidateSettings,
} from './use-settings';