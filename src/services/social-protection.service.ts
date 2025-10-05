/**
 * Social Protection Service
 * 
 * Handles all Social Protection API calls including extension status,
 * algorithm health monitoring, and social media analysis.
 * 
 * Note: All endpoints require authentication.
 */

import { apiClient } from './api';
import type {
  ExtensionStatus,
  ExtensionAnalytics,
  AnalyticsTimeRange,
  AlgorithmHealth,
  VisibilityAnalysis,
  EngagementAnalysis,
  PenaltyDetection,
} from '@/types/homepage';
import type {
  SocialProtectionOverview,
  ExtensionSettings,
  BotHealth,
  CrisisAlert,
  CrisisAlertFilters,
  ResolveCrisisAlertData,
  CrisisRecommendation,
  CrisisStats,
  BatchAnalysisRequest,
  BatchAnalysisResult,
} from '@/types/dashboard';

export const socialProtectionService = {
  /**
   * Get browser extension connection status
   * 
   * @returns Promise with extension status
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const status = await socialProtectionService.getExtensionStatus();
   * console.log('Extension:', status.status);
   * ```
   */
  getExtensionStatus: async (): Promise<ExtensionStatus> => {
    return apiClient.get<ExtensionStatus>('/social-protection/extension/status');
  },

  /**
   * Get extension analytics for a time range
   * 
   * @param timeRange - Time range for analytics (24h, 7d, 30d, 90d)
   * @returns Promise with analytics data
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const analytics = await socialProtectionService.getExtensionAnalytics('7d');
   * console.log('Blocked:', analytics.total_blocked);
   * ```
   */
  getExtensionAnalytics: async (
    timeRange: AnalyticsTimeRange = '7d'
  ): Promise<ExtensionAnalytics> => {
    return apiClient.get<ExtensionAnalytics>(
      '/social-protection/extension/analytics',
      { params: { time_range: timeRange } }
    );
  },

  /**
   * Get algorithm health summary
   * 
   * @returns Promise with algorithm health data
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const health = await socialProtectionService.getAlgorithmHealth();
   * console.log('Overall score:', health.overall_score);
   * ```
   */
  getAlgorithmHealth: async (): Promise<AlgorithmHealth> => {
    return apiClient.get<AlgorithmHealth>('/social/algorithm-health/health');
  },

  /**
   * Trigger visibility analysis
   * 
   * @returns Promise with visibility analysis results
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const analysis = await socialProtectionService.analyzeVisibility();
   * console.log('Visibility score:', analysis.score);
   * ```
   */
  analyzeVisibility: async (): Promise<VisibilityAnalysis> => {
    return apiClient.post<VisibilityAnalysis>(
      '/social/algorithm-health/visibility/analyze'
    );
  },

  /**
   * Trigger engagement analysis
   * 
   * @returns Promise with engagement analysis results
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const analysis = await socialProtectionService.analyzeEngagement();
   * console.log('Engagement score:', analysis.score);
   * ```
   */
  analyzeEngagement: async (): Promise<EngagementAnalysis> => {
    return apiClient.post<EngagementAnalysis>(
      '/social/algorithm-health/engagement/analyze'
    );
  },

  /**
   * Trigger penalty detection
   * 
   * @returns Promise with penalty detection results
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const detection = await socialProtectionService.detectPenalties();
   * console.log('Penalties found:', detection.penalties_found);
   * ```
   */
  detectPenalties: async (): Promise<PenaltyDetection> => {
    return apiClient.post<PenaltyDetection>(
      '/social/algorithm-health/penalty/detect'
    );
  },

  // ============================================================================
  // Dashboard-Specific Methods
  // ============================================================================

  /**
   * Get social protection overview for dashboard
   * 
   * @param projectId - Optional project ID to filter by
   * @returns Promise with social protection overview
   * @requires Authentication
   */
  getSocialProtectionOverview: async (
    projectId?: string
  ): Promise<SocialProtectionOverview> => {
    return apiClient.get('/dashboard/social-protection/overview', {
      params: projectId ? { project_id: projectId } : undefined,
    });
  },

  /**
   * Get extension settings
   * 
   * @returns Promise with extension settings
   * @requires Authentication
   */
  getExtensionSettings: async (): Promise<ExtensionSettings> => {
    return apiClient.get('/social-protection/extension/settings');
  },

  /**
   * Update extension settings
   * 
   * @param settings - Settings to update
   * @returns Promise with updated settings
   * @requires Authentication
   */
  updateExtensionSettings: async (
    settings: Partial<ExtensionSettings>
  ): Promise<ExtensionSettings> => {
    return apiClient.put('/social-protection/extension/settings', settings);
  },

  /**
   * Sync extension data manually
   * 
   * @returns Promise that resolves when sync is complete
   * @requires Authentication
   */
  syncExtension: async (): Promise<void> => {
    return apiClient.post('/social-protection/extension/sync');
  },

  /**
   * Batch analyze multiple accounts (Pro+ feature)
   * 
   * @param data - Batch analysis request data
   * @returns Promise with batch analysis result
   * @requires Authentication
   * @requires Pro+ subscription
   */
  batchAnalyze: async (data: BatchAnalysisRequest): Promise<BatchAnalysisResult> => {
    return apiClient.post('/social/algorithm-health/batch/analyze', data);
  },

  /**
   * Get batch analysis status
   * 
   * @param jobId - Batch analysis job ID
   * @returns Promise with batch analysis result
   * @requires Authentication
   */
  getBatchAnalysisStatus: async (jobId: string): Promise<BatchAnalysisResult> => {
    return apiClient.get(`/social/algorithm-health/batch/${jobId}`);
  },

  // ============================================================================
  // Crisis Alerts
  // ============================================================================

  /**
   * Get crisis alerts with filters
   * 
   * @param filters - Optional filters for crisis alerts
   * @returns Promise with crisis alerts array
   * @requires Authentication
   */
  getCrisisAlerts: async (filters?: CrisisAlertFilters): Promise<CrisisAlert[]> => {
    return apiClient.get('/social-protection/crisis/alerts', { params: filters });
  },

  /**
   * Get single crisis alert by ID
   * 
   * @param alertId - Crisis alert ID
   * @returns Promise with crisis alert
   * @requires Authentication
   */
  getCrisisAlert: async (alertId: string): Promise<CrisisAlert> => {
    return apiClient.get(`/social-protection/crisis/alerts/${alertId}`);
  },

  /**
   * Resolve a crisis alert
   * 
   * @param alertId - Crisis alert ID
   * @param data - Resolution data
   * @returns Promise that resolves when alert is resolved
   * @requires Authentication
   */
  resolveCrisisAlert: async (
    alertId: string,
    data: ResolveCrisisAlertData
  ): Promise<void> => {
    return apiClient.put(`/social-protection/crisis/alerts/${alertId}`, {
      status: 'resolved',
      ...data,
    });
  },

  /**
   * Get recommendations for a crisis alert
   * 
   * @param alertId - Crisis alert ID
   * @returns Promise with recommendations array
   * @requires Authentication
   */
  getCrisisRecommendations: async (
    alertId: string
  ): Promise<CrisisRecommendation[]> => {
    return apiClient.get(`/social-protection/crisis/alerts/${alertId}/recommendations`);
  },

  /**
   * Get crisis statistics for a time range
   * 
   * @param timeRange - Time range (7d, 30d, 90d)
   * @returns Promise with crisis stats
   * @requires Authentication
   */
  getCrisisStats: async (timeRange: string = '30d'): Promise<CrisisStats> => {
    return apiClient.get('/social-protection/crisis/stats', {
      params: { time_range: timeRange },
    });
  },

  // ============================================================================
  // Bot Health
  // ============================================================================

  /**
   * Get bot health status
   * 
   * @returns Promise with bot health data
   * @requires Authentication
   */
  getBotHealth: async (): Promise<BotHealth> => {
    return apiClient.get('/bots/health');
  },

  /**
   * Restart a bot service
   * 
   * @param serviceName - Name of the bot service to restart
   * @returns Promise that resolves when restart is initiated
   * @requires Authentication
   */
  restartBot: async (serviceName: string): Promise<void> => {
    return apiClient.post(`/bots/${serviceName}/restart`);
  },
};
