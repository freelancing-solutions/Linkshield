/**
 * Social Protection Feature Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the social protection
 * feature, including dashboard overview, platform scanning, content analysis,
 * algorithm health monitoring, crisis alerts, extension management, and settings.
 */

// ============================================================================
// Platform Types
// ============================================================================

export type PlatformType = 
  | 'twitter' 
  | 'facebook' 
  | 'instagram' 
  | 'tiktok' 
  | 'linkedin' 
  | 'telegram' 
  | 'discord';

// ============================================================================
// Dashboard Overview Types
// ============================================================================

export interface DashboardOverview {
  active_platforms: number;
  risk_score: number;
  recent_alerts: number;
  algorithm_health: 'excellent' | 'good' | 'fair' | 'poor';
  connected_platforms: ConnectedPlatform[];
  last_scan?: string;
}

export interface ConnectedPlatform {
  platform: PlatformType;
  username: string;
  connected_at: string;
  last_scan?: string;
  risk_score?: number;
  status: 'active' | 'error' | 'pending';
}

// ============================================================================
// Platform Scan Types
// ============================================================================

export interface PlatformScan {
  scan_id: string;
  platform: PlatformType;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  progress?: number;
  risk_score?: number;
  issues_found?: number;
  recommendations?: Recommendation[];
  created_at: string;
  completed_at?: string;
  error?: string;
}

export interface ScanCredentials {
  platform: PlatformType;
  username?: string;
  api_key?: string;
  access_token?: string;
  [key: string]: any;
}

// ============================================================================
// Content Analysis Types
// ============================================================================

export interface ContentAnalysis {
  analysis_id: string;
  platform: PlatformType;
  content_type: 'post' | 'comment' | 'message';
  risk_score: number;
  link_risks: LinkRisk[];
  spam_indicators: SpamIndicators;
  content_risks: ContentRisks;
  recommendations: Recommendation[];
  analyzed_at: string;
}

export interface ContentAnalysisRequest {
  platform: PlatformType;
  content_type: 'post' | 'comment' | 'message';
  content?: string;
  url?: string;
  anonymous?: boolean;
}

export interface LinkRisk {
  url: string;
  safety_score: number;
  threats: string[];
  reputation: 'safe' | 'suspicious' | 'malicious';
}

export interface SpamIndicators {
  spam_probability: number;
  patterns_detected: string[];
  confidence: number;
}

export interface ContentRisks {
  safety_score: number;
  flagged_elements: string[];
  policy_violations: string[];
}

// ============================================================================
// Algorithm Health Types
// ============================================================================

export interface AlgorithmHealth {
  platform: PlatformType;
  visibility_score: number;
  engagement_quality: number;
  penalty_indicators: PenaltyIndicator[];
  shadow_ban_risk: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
  metrics: HealthMetrics;
  last_updated: string;
}

export interface PenaltyIndicator {
  type: string;
  severity: 'low' | 'medium' | 'high';
  detected_at: string;
  description: string;
}

export interface HealthMetrics {
  reach: number;
  impressions: number;
  engagement_rate: number;
  follower_growth: number;
}

// ============================================================================
// Crisis Alert Types
// ============================================================================

export interface CrisisAlert {
  alert_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  platform: PlatformType;
  alert_type: string;
  status: 'active' | 'acknowledged' | 'resolved';
  signals: DetectionSignal[];
  ai_summary: string;
  recommendations?: Recommendation[];
  created_at: string;
  updated_at?: string;
}

export interface DetectionSignal {
  signal_type: string;
  value: number;
  threshold: number;
  description: string;
}

// ============================================================================
// Extension Types
// ============================================================================

export interface ExtensionStatus {
  extension_installed: boolean;
  version?: string;
  last_sync?: string;
  active_sessions: number;
  update_available: boolean;
  latest_version?: string;
}

export interface ExtensionAnalytics {
  total_scans: number;
  threats_blocked: number;
  content_analyzed: number;
  platforms_monitored: string[];
  time_series: AnalyticsDataPoint[];
}

export interface AnalyticsDataPoint {
  date: string;
  scans: number;
  threats: number;
}

export interface ExtensionSettings {
  auto_scan: boolean;
  real_time_alerts: boolean;
  platform_filters: PlatformType[];
  scan_sensitivity: 'low' | 'medium' | 'high';
  notification_preferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email_alerts: boolean;
  push_notifications: boolean;
  alert_severity_threshold: 'low' | 'medium' | 'high';
  alert_channels: string[];
}

// ============================================================================
// Settings Types
// ============================================================================

export interface SocialProtectionSettings {
  monitoring: MonitoringSettings;
  alerts: AlertSettings;
  privacy: PrivacySettings;
  platforms: ConnectedPlatform[];
}

export interface MonitoringSettings {
  auto_scan: boolean;
  real_time_monitoring: boolean;
  deep_analysis: boolean;
  scan_frequency: 'hourly' | 'daily' | 'weekly';
}

export interface AlertSettings {
  email_alerts: boolean;
  push_notifications: boolean;
  alert_severity_threshold: 'low' | 'medium' | 'high';
  alert_channels: string[];
}

export interface PrivacySettings {
  data_retention: number; // days
  anonymous_scanning: boolean;
  share_threat_intelligence: boolean;
}

// ============================================================================
// Common Types
// ============================================================================

export interface Recommendation {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  action_url?: string;
}

// ============================================================================
// Credential Field Types (for forms)
// ============================================================================

export interface CredentialField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'url';
  required: boolean;
  placeholder?: string;
  description?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// ============================================================================
// Error Types
// ============================================================================

export interface SocialProtectionError {
  error_code: string;
  message: string;
  details?: Record<string, any>;
}

// ============================================================================
// Utility Types
// ============================================================================

export type RiskLevel = 'minimal' | 'low' | 'medium' | 'high' | 'critical';
export type ScanStatus = 'pending' | 'processing' | 'complete' | 'failed';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type PlatformStatus = 'active' | 'error' | 'pending';
export type HealthTrend = 'up' | 'down' | 'stable';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';