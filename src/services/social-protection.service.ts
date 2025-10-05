/**
 * Social Protection Service
 * 
 * Handles all Social Protection API calls including extension status,
 * algorithm health monitoring, social media analysis, platform scanning,
 * content analysis, crisis alerts, and settings management.
 * 
 * Note: All endpoints require authentication unless specified as public.
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
import type {
  DashboardOverview,
  PlatformScan,
  ScanCredentials,
  ContentAnalysis,
  ContentAnalysisRequest,
  SocialProtectionSettings,
  Recommendation,
  ApiResponse,
  PaginatedResponse,
} from '@/types/social-protection';

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

  // ============================================================================
  // New Social Protection Endpoints (Kiro Spec Implementation)
  // ============================================================================

  /**
   * Get social protection dashboard overview
   * Returns active platforms, risk scores, alerts, and algorithm health
   */
  getDashboard: async (): Promise<DashboardOverview> => {
    const response = await apiClient.get<ApiResponse<DashboardOverview>>(
      '/social-protection/user/dashboard'
    );
    return response.data.data;
  },

  /**
   * Initiate a platform scan with provided credentials
   * Returns scan object with tracking ID for status polling
   */
  initiateScan: async (credentials: ScanCredentials): Promise<PlatformScan> => {
    const response = await apiClient.post<ApiResponse<PlatformScan>>(
      '/social-protection/user/scan',
      credentials
    );
    return response.data.data;
  },

  /**
   * Get scan status and progress by scan ID
   * Used for polling scan progress until completion
   */
  getScanStatus: async (scanId: string): Promise<PlatformScan> => {
    const response = await apiClient.get<ApiResponse<PlatformScan>>(
      `/social-protection/user/scan/${scanId}`
    );
    return response.data.data;
  },

  /**
   * Get all scans for the current user
   * Supports pagination and filtering
   */
  getScans: async (params?: {
    page?: number;
    limit?: number;
    platform?: string;
    status?: string;
  }): Promise<PaginatedResponse<PlatformScan>> => {
    const response = await apiClient.get<PaginatedResponse<PlatformScan>>(
      '/social-protection/user/scans',
      { params }
    );
    return response.data;
  },

  /**
   * Delete/disconnect a platform connection
   */
  disconnectPlatform: async (platform: string): Promise<void> => {
    await apiClient.delete(`/social-protection/user/platforms/${platform}`);
  },

  /**
   * Analyze social media content for risks and threats
   * Supports both authenticated and anonymous analysis
   */
  analyzeContent: async (content: ContentAnalysisRequest): Promise<ContentAnalysis> => {
    const response = await apiClient.post<ApiResponse<ContentAnalysis>>(
      '/social-protection/user/analyze',
      content
    );
    return response.data.data;
  },

  /**
   * Get content analysis history
   */
  getAnalysisHistory: async (params?: {
    page?: number;
    limit?: number;
    platform?: string;
    risk_level?: string;
  }): Promise<PaginatedResponse<ContentAnalysis>> => {
    const response = await apiClient.get<PaginatedResponse<ContentAnalysis>>(
      '/social-protection/user/analysis-history',
      { params }
    );
    return response.data;
  },

  /**
   * Get algorithm health for a specific platform
   */
  getPlatformHealth: async (platform: string): Promise<AlgorithmHealth> => {
    const response = await apiClient.get<ApiResponse<AlgorithmHealth>>(
      `/social-protection/user/algorithm-health/${platform}`
    );
    return response.data.data;
  },

  /**
   * Get algorithm health trends over time
   */
  getHealthTrends: async (params?: {
    platform?: string;
    timeframe?: '7d' | '30d' | '90d';
  }): Promise<AlgorithmHealth[]> => {
    const response = await apiClient.get<ApiResponse<AlgorithmHealth[]>>(
      '/social-protection/user/algorithm-health/trends',
      { params }
    );
    return response.data.data;
  },

  /**
   * Update alert status (acknowledge, resolve, etc.)
   */
  updateAlertStatus: async (
    alertId: string, 
    status: 'acknowledged' | 'resolved'
  ): Promise<CrisisAlert> => {
    const response = await apiClient.put<ApiResponse<CrisisAlert>>(
      `/social-protection/crisis/alerts/${alertId}`,
      { status }
    );
    return response.data.data;
  },

  /**
   * Bulk update multiple alerts
   */
  bulkUpdateAlerts: async (
    alertIds: string[],
    status: 'acknowledged' | 'resolved'
  ): Promise<void> => {
    await apiClient.put('/social-protection/crisis/alerts/bulk', {
      alert_ids: alertIds,
      status,
    });
  },

  /**
   * Get all social protection settings
   */
  getSettings: async (): Promise<SocialProtectionSettings> => {
    const response = await apiClient.get<ApiResponse<SocialProtectionSettings>>(
      '/social-protection/user/settings'
    );
    return response.data.data;
  },

  /**
   * Update social protection settings
   */
  updateSettings: async (
    settings: Partial<SocialProtectionSettings>
  ): Promise<SocialProtectionSettings> => {
    const response = await apiClient.put<ApiResponse<SocialProtectionSettings>>(
      '/social-protection/user/settings',
      settings
    );
    return response.data.data;
  },

  /**
   * Reset settings to default values
   */
  resetSettings: async (): Promise<SocialProtectionSettings> => {
    const response = await apiClient.post<ApiResponse<SocialProtectionSettings>>(
      '/social-protection/user/settings/reset'
    );
    return response.data.data;
  },

  /**
   * Analyze content anonymously (for homepage scanner)
   * Does not require authentication
   */
  analyzeContentAnonymous: async (url: string): Promise<ContentAnalysis> => {
    const response = await apiClient.post<ApiResponse<ContentAnalysis>>(
      '/social-protection/public/analyze',
      { url, anonymous: true }
    );
    return response.data.data;
  },

  /**
   * Get extension download links for different browsers
   */
  getExtensionDownloads: async (): Promise<{
    chrome: string;
    firefox: string;
    edge: string;
    safari: string;
  }> => {
    const response = await apiClient.get<ApiResponse<{
      chrome: string;
      firefox: string;
      edge: string;
      safari: string;
    }>>('/social-protection/public/extension-downloads');
    return response.data.data;
  },

  /**
   * Test platform credentials without saving
   */
  testCredentials: async (credentials: ScanCredentials): Promise<{
    valid: boolean;
    error?: string;
  }> => {
    const response = await apiClient.post<ApiResponse<{
      valid: boolean;
      error?: string;
    }>>('/social-protection/user/test-credentials', credentials);
    return response.data.data;
  },

  /**
   * Get supported platforms and their credential requirements
   */
  getSupportedPlatforms: async (): Promise<{
    platform: string;
    name: string;
    icon: string;
    credential_fields: Array<{
      name: string;
      label: string;
      type: string;
      required: boolean;
      description?: string;
    }>;
  }[]> => {
    const response = await apiClient.get<ApiResponse<any>>(
      '/social-protection/public/supported-platforms'
    );
    return response.data.data;
  },

};
