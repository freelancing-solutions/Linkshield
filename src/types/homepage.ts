/**
 * Homepage URL Checker Types
 * 
 * Type definitions for the homepage URL checking feature,
 * including scan types, results, and Social Protection integration.
 */

// ============================================================================
// URL Check Types
// ============================================================================

/**
 * Scan type options for URL checking
 */
export type ScanType = 'SECURITY' | 'SECURITY_REPUTATION_CONTENT' | 'DEEP';

/**
 * Threat level classification
 */
export type ThreatLevel = 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS';

/**
 * Provider status for security checks
 */
export type ProviderStatus = 'CLEAN' | 'MALICIOUS' | 'SUSPICIOUS' | 'ERROR' | 'PENDING';

/**
 * Request payload for URL check
 */
export interface URLCheckRequest {
  url: string;
  scan_type: ScanType;
  include_broken_links?: boolean;
}

/**
 * Individual security provider result
 */
export interface ProviderResult {
  provider: string;
  status: ProviderStatus;
  details: string;
  confidence_score?: number;
  checked_at: string;
  error_message?: string;
}

/**
 * Broken link information
 */
export interface BrokenLink {
  url: string;
  status_code: number;
  error_message: string;
  context?: string;
}

/**
 * Complete URL check response
 */
export interface URLCheckResponse {
  check_id: string;
  url: string;
  risk_score: number; // 0-100
  threat_level: ThreatLevel;
  scan_type: ScanType;
  provider_results: ProviderResult[];
  broken_links?: BrokenLink[];
  scan_duration_ms: number;
  checked_at: string;
  metadata?: {
    title?: string;
    description?: string;
    favicon_url?: string;
  };
}

// ============================================================================
// Domain Reputation Types
// ============================================================================

/**
 * Domain reputation status
 */
export type ReputationStatus = 'TRUSTED' | 'NEUTRAL' | 'SUSPICIOUS' | 'MALICIOUS';

/**
 * Domain reputation information
 */
export interface DomainReputation {
  domain: string;
  reputation_score: number; // 0-100
  status: ReputationStatus;
  total_checks: number;
  safe_percentage: number;
  last_checked: string;
  factors?: {
    age_days?: number;
    ssl_valid?: boolean;
    blacklist_count?: number;
  };
}

// ============================================================================
// Social Protection Types
// ============================================================================

/**
 * Browser extension connection status
 */
export type ExtensionConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'UNKNOWN';

/**
 * Extension status information
 */
export interface ExtensionStatus {
  status: ExtensionConnectionStatus;
  last_activity?: string;
  version?: string;
  protection_stats?: {
    blocked_today: number;
    warnings_today: number;
    total_blocked: number;
  };
}

/**
 * Time range for analytics queries
 */
export type AnalyticsTimeRange = '24h' | '7d' | '30d' | '90d';

/**
 * Extension analytics data
 */
export interface ExtensionAnalytics {
  time_range: AnalyticsTimeRange;
  total_blocked: number;
  total_warnings: number;
  blocked_by_category: Record<string, number>;
  timeline: Array<{
    date: string;
    blocked: number;
    warnings: number;
  }>;
}

/**
 * Algorithm health metric
 */
export interface HealthMetric {
  score: number; // 0-100
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  trend: 'UP' | 'DOWN' | 'STABLE';
  last_updated: string;
}

/**
 * Overall algorithm health summary
 */
export interface AlgorithmHealth {
  overall_score: number; // 0-100
  visibility: HealthMetric;
  engagement: HealthMetric;
  penalties: {
    detected: boolean;
    count: number;
    types: string[];
    severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  };
  last_analyzed: string;
}

/**
 * Visibility analysis result
 */
export interface VisibilityAnalysis {
  analysis_id: string;
  score: number;
  reach_metrics: {
    impressions: number;
    reach: number;
    visibility_rate: number;
  };
  recommendations: string[];
  analyzed_at: string;
}

/**
 * Engagement analysis result
 */
export interface EngagementAnalysis {
  analysis_id: string;
  score: number;
  engagement_metrics: {
    likes: number;
    comments: number;
    shares: number;
    engagement_rate: number;
  };
  recommendations: string[];
  analyzed_at: string;
}

/**
 * Penalty detection result
 */
export interface PenaltyDetection {
  detection_id: string;
  penalties_found: boolean;
  penalties: Array<{
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
    detected_at: string;
  }>;
  recommendations: string[];
  analyzed_at: string;
}

// ============================================================================
// Subscription Types
// ============================================================================

/**
 * Subscription plan tier
 */
export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';

/**
 * Subscription status
 */
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL';

/**
 * Subscription information
 */
export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_end?: string;
}

/**
 * Usage statistics for a subscription
 */
export interface UsageStats {
  subscription_id: string;
  period_start: string;
  period_end: string;
  limits: {
    url_checks: number;
    ai_analyses: number;
    api_calls: number;
  };
  usage: {
    url_checks: number;
    ai_analyses: number;
    api_calls: number;
  };
  percentage_used: {
    url_checks: number;
    ai_analyses: number;
    api_calls: number;
  };
}

/**
 * Combined subscription info with usage
 */
export interface SubscriptionInfo {
  subscription: Subscription;
  usage: UsageStats;
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * URL check form state
 */
export interface URLCheckFormState {
  url: string;
  scanType: ScanType;
  isSubmitting: boolean;
  error?: string;
}

/**
 * Scan progress state
 */
export interface ScanProgress {
  status: 'IDLE' | 'VALIDATING' | 'SCANNING' | 'COMPLETE' | 'ERROR';
  progress: number; // 0-100
  estimatedTimeRemaining?: number; // seconds
  message?: string;
}
