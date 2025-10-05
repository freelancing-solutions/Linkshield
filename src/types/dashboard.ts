/**
 * Dashboard Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the LinkShield Dashboard.
 * These types are based on the dashboard requirements and design specifications.
 */

// ============================================================================
// User Roles and Personas
// ============================================================================

export type UserRole = 'web_developer' | 'social_media' | 'brand_manager' | 'news_media' | 'executive';

// ============================================================================
// Dashboard Overview
// ============================================================================

export interface DashboardOverview {
    user_role: UserRole;
    available_roles: UserRole[];
    web_developer?: WebDeveloperMetrics;
    social_media?: SocialMediaMetrics;
    brand_manager?: BrandManagerMetrics;
    news_media?: NewsMediaMetrics;
    executive?: ExecutiveMetrics;
    extension_status?: ExtensionStatus;
    bot_status?: BotStatus;
    notifications_count: number;
}

// ============================================================================
// Role-Specific Metrics
// ============================================================================

export interface WebDeveloperMetrics {
    total_projects: number;
    active_monitoring: number;
    total_scans: number;
    active_alerts: number;
    api_usage: APIUsage;
}

export interface SocialMediaMetrics {
    connected_platforms: number;
    risk_score: number;
    algorithm_health: number;
    active_crises: number;
    recent_analyses: number;
}

export interface BrandManagerMetrics {
    brand_mentions: number;
    reputation_score: number;
    active_crises: number;
    competitor_alerts: number;
    sentiment_score: number;
}

export interface NewsMediaMetrics {
    content_verified: number;
    sources_checked: number;
    misinformation_detected: number;
    fact_checks_performed: number;
    credibility_score: number;
}

export interface ExecutiveMetrics {
    overall_risk_score: number;
    threats_prevented: number;
    cost_savings: number;
    team_performance: number;
    roi_percentage: number;
}

// ============================================================================
// API Usage
// ============================================================================

export interface APIUsage {
    current_usage: number;
    limit: number;
    percentage: number;
    reset_date: string;
}

// ============================================================================
// Projects
// ============================================================================

export interface Project {
    id: string;
    name: string;
    description?: string;
    domain?: string;
    status: ProjectStatus;
    monitoring_enabled: boolean;
    health_score: number;
    team_size: number;
    active_alerts: number;
    created_at: string;
    updated_at?: string;
}

export type ProjectStatus = 'active' | 'paused' | 'archived';

export interface ProjectsResponse {
    items: Project[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export interface CreateProjectData {
    name: string;
    description?: string;
    domain?: string;
    monitoring_enabled?: boolean;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    domain?: string;
    monitoring_enabled?: boolean;
    status?: ProjectStatus;
}

// ============================================================================
// Team Members
// ============================================================================

export interface TeamMember {
    id: string;
    user_id: string;
    project_id: string;
    email: string;
    full_name: string;
    role: TeamMemberRole;
    avatar_url?: string;
    joined_at: string;
    last_active?: string;
}

export type TeamMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface InviteTeamMemberData {
    email: string;
    role: TeamMemberRole;
}

// ============================================================================
// Alerts
// ============================================================================

export interface Alert {
    id: string;
    project_id: string;
    type: AlertType;
    severity: AlertSeverity;
    title: string;
    description: string;
    status: AlertStatus;
    created_at: string;
    resolved_at?: string;
    resolved_by?: string;
    resolution_notes?: string;
}

export type AlertType = 'security' | 'performance' | 'availability' | 'compliance' | 'other';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';

export interface AlertsResponse {
    items: Alert[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export interface AlertFilters {
    project_id?: string;
    type?: AlertType;
    severity?: AlertSeverity;
    status?: AlertStatus;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}

export interface ResolveAlertData {
    resolution_notes?: string;
}

// ============================================================================
// Browser Extension Integration
// ============================================================================

export interface ExtensionStatus {
    installed: boolean;
    version?: string;
    last_sync?: string;
    total_scans: number;
    threats_blocked: number;
    sites_protected: number;
    update_available: boolean;
}

export interface ExtensionAnalytics {
    time_range: string;
    total_scans: number;
    threats_blocked: number;
    sites_protected: number;
    daily_activity: DailyActivity[];
    threat_types_breakdown: ThreatTypeBreakdown[];
    protected_platforms: PlatformStats[];
}

export interface DailyActivity {
    date: string;
    scans: number;
    threats: number;
}

export interface ThreatTypeBreakdown {
    type: string;
    count: number;
    percentage: number;
}

export interface PlatformStats {
    platform: string;
    scans: number;
    threats: number;
}

export interface ExtensionSettings {
    real_time_analysis: boolean;
    advanced_warnings: boolean;
    auto_sync: boolean;
    sync_interval: number;
}

// ============================================================================
// Social Media Bot Integration
// ============================================================================

export interface BotStatus {
    active_bots: number;
    total_analyses: number;
    threats_detected: number;
    avg_response_time: number;
    platform_breakdown: Record<string, BotPlatformStats>;
}

export interface BotPlatformStats {
    platform: string;
    status: BotHealthStatus;
    analyses: number;
    threats: number;
    last_activity: string;
}

export type BotHealthStatus = 'online' | 'offline' | 'error' | 'degraded';

export interface BotHealth {
    overall_status: BotHealthStatus;
    services: BotServiceHealth[];
    last_check: string;
}

export interface BotServiceHealth {
    service_name: string;
    status: BotHealthStatus;
    uptime_percentage: number;
    last_error?: string;
    last_error_time?: string;
}

// ============================================================================
// Social Protection Overview
// ============================================================================

export interface SocialProtectionOverview {
    project_id?: string;
    extension_status: ExtensionStatus;
    bot_status: BotStatus;
    algorithm_health: AlgorithmHealth;
    crisis_alerts_count: number;
    recent_analyses: number;
}

// ============================================================================
// Algorithm Health
// ============================================================================

export interface AlgorithmHealth {
    visibility_score: number;
    engagement_score: number;
    penalty_detected: boolean;
    overall_health: HealthStatus;
    last_analysis: string;
    platforms: PlatformHealth[];
}

export type HealthStatus = 'good' | 'warning' | 'critical';

export interface PlatformHealth {
    platform: string;
    visibility_score: number;
    engagement_score: number;
    penalty_detected: boolean;
    health_status: HealthStatus;
}

export interface VisibilityAnalysis {
    score: number;
    trend: TrendDirection;
    factors: AnalysisFactor[];
    recommendations: string[];
}

export interface EngagementAnalysis {
    score: number;
    trend: TrendDirection;
    metrics: EngagementMetrics;
    recommendations: string[];
}

export interface EngagementMetrics {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    engagement_rate: number;
}

export interface PenaltyDetection {
    detected: boolean;
    severity?: PenaltySeverity;
    type?: string;
    description?: string;
    detected_at?: string;
    recommendations: string[];
}

export type PenaltySeverity = 'minor' | 'moderate' | 'severe';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface AnalysisFactor {
    name: string;
    value: number;
    impact: 'positive' | 'negative' | 'neutral';
}

export interface BatchAnalysisRequest {
    accounts: string[];
    platforms: string[];
    analysis_types: AnalysisType[];
}

export type AnalysisType = 'visibility' | 'engagement' | 'penalty';

export interface BatchAnalysisResult {
    job_id: string;
    status: BatchAnalysisStatus;
    total_accounts: number;
    completed: number;
    failed: number;
    results: AccountAnalysisResult[];
}

export type BatchAnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AccountAnalysisResult {
    account: string;
    platform: string;
    visibility?: VisibilityAnalysis;
    engagement?: EngagementAnalysis;
    penalty?: PenaltyDetection;
}

// ============================================================================
// Crisis Alerts
// ============================================================================

export interface CrisisAlert {
    id: string;
    brand?: string;
    severity: CrisisSeverity;
    type: CrisisType;
    title: string;
    description: string;
    status: CrisisStatus;
    detected_at: string;
    resolved_at?: string;
    impact_score: number;
    affected_platforms: string[];
}

export type CrisisSeverity = 'critical' | 'high' | 'medium' | 'low';
export type CrisisType = 'reputation' | 'security' | 'misinformation' | 'engagement' | 'other';
export type CrisisStatus = 'active' | 'monitoring' | 'resolved';

export interface CrisisAlertFilters {
    brand?: string;
    severity?: CrisisSeverity;
    status?: CrisisStatus;
    resolved?: boolean;
    limit?: number;
    offset?: number;
}

export interface ResolveCrisisAlertData {
    resolution_notes: string;
    actions_taken: string[];
}

export interface CrisisRecommendation {
    id: string;
    priority: RecommendationPriority;
    title: string;
    description: string;
    action_items: string[];
    estimated_impact: string;
}

export type RecommendationPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface CrisisStats {
    time_range: string;
    total_crises: number;
    active_crises: number;
    resolved_crises: number;
    avg_resolution_time: number;
    severity_breakdown: SeverityBreakdown[];
    type_breakdown: TypeBreakdown[];
    timeline: CrisisTimelinePoint[];
}

export interface SeverityBreakdown {
    severity: CrisisSeverity;
    count: number;
    percentage: number;
}

export interface TypeBreakdown {
    type: CrisisType;
    count: number;
    percentage: number;
}

export interface CrisisTimelinePoint {
    date: string;
    count: number;
    severity_distribution: Record<CrisisSeverity, number>;
}

// ============================================================================
// Notifications
// ============================================================================

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    severity?: AlertSeverity;
    read: boolean;
    created_at: string;
    link?: string;
    metadata?: Record<string, any>;
}

export type NotificationType = 'alert' | 'system' | 'team' | 'update';

export interface NotificationsResponse {
    items: Notification[];
    total: number;
    unread_count: number;
}

// ============================================================================
// Dashboard Preferences
// ============================================================================

export interface DashboardPreferences {
    default_role: UserRole;
    layout: DashboardLayout;
    visible_widgets: string[];
    widget_positions: Record<string, WidgetPosition>;
    theme: ThemeMode;
    notifications_enabled: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface DashboardLayout {
    sidebar_collapsed: boolean;
    panel_sizes: Record<string, number>;
    custom_order: string[];
}

export interface WidgetPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

// ============================================================================
// Search
// ============================================================================

export interface SearchResult {
    type: SearchResultType;
    id: string;
    title: string;
    description?: string;
    url: string;
    metadata?: Record<string, any>;
}

export type SearchResultType = 'project' | 'alert' | 'content' | 'report' | 'setting';

export interface SearchResponse {
    query: string;
    results: SearchResult[];
    grouped_results: Record<SearchResultType, SearchResult[]>;
    total: number;
}

// ============================================================================
// Subscription Integration
// ============================================================================

export interface SubscriptionInfo {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    usage: SubscriptionUsage;
}

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface SubscriptionUsage {
    api_calls: UsageMetric;
    scans: UsageMetric;
    team_members: UsageMetric;
    projects: UsageMetric;
}

export interface UsageMetric {
    used: number;
    limit: number;
    percentage: number;
}

// ============================================================================
// Feature Gating
// ============================================================================

export interface FeatureAccess {
    feature: string;
    available: boolean;
    required_plan?: SubscriptionPlan;
    reason?: string;
}

// ============================================================================
// WebSocket Events
// ============================================================================

export interface WebSocketMessage {
    type: WebSocketEventType;
    payload: any;
    timestamp: string;
}

export type WebSocketEventType =
    | 'alert_created'
    | 'alert_updated'
    | 'scan_completed'
    | 'extension_threat_detected'
    | 'bot_analysis_completed'
    | 'crisis_detected'
    | 'notification_received';

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
    data?: T;
    error_code?: string;
    message?: string;
    details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}
