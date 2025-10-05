/**
 * Error Message Utilities for Social Protection
 * 
 * Comprehensive error handling and messaging utilities specifically designed
 * for social protection features. Provides context-aware error messages,
 * recovery suggestions, and user-friendly error displays.
 * 
 * Features:
 * - Social protection specific error codes
 * - Context-aware error messages
 * - Recovery action suggestions
 * - Error severity classification
 * - User-friendly error formatting
 * - Internationalization support
 */

/**
 * Social Protection error codes
 */
export enum SocialProtectionErrorCode {
  // Authentication & Authorization
  EXTENSION_NOT_CONNECTED = 'EXTENSION_NOT_CONNECTED',
  PLATFORM_AUTH_FAILED = 'PLATFORM_AUTH_FAILED',
  PLATFORM_AUTH_EXPIRED = 'PLATFORM_AUTH_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  
  // Platform Connection
  PLATFORM_CONNECTION_FAILED = 'PLATFORM_CONNECTION_FAILED',
  PLATFORM_RATE_LIMITED = 'PLATFORM_RATE_LIMITED',
  PLATFORM_TEMPORARILY_UNAVAILABLE = 'PLATFORM_TEMPORARILY_UNAVAILABLE',
  UNSUPPORTED_PLATFORM = 'UNSUPPORTED_PLATFORM',
  PLATFORM_API_ERROR = 'PLATFORM_API_ERROR',
  
  // Scanning & Analysis
  SCAN_INITIALIZATION_FAILED = 'SCAN_INITIALIZATION_FAILED',
  SCAN_TIMEOUT = 'SCAN_TIMEOUT',
  SCAN_INTERRUPTED = 'SCAN_INTERRUPTED',
  ANALYSIS_FAILED = 'ANALYSIS_FAILED',
  CONTENT_ANALYSIS_ERROR = 'CONTENT_ANALYSIS_ERROR',
  ALGORITHM_HEALTH_CHECK_FAILED = 'ALGORITHM_HEALTH_CHECK_FAILED',
  
  // Data & Content
  INVALID_CONTENT_TYPE = 'INVALID_CONTENT_TYPE',
  CONTENT_NOT_ACCESSIBLE = 'CONTENT_NOT_ACCESSIBLE',
  CONTENT_DELETED = 'CONTENT_DELETED',
  CONTENT_PRIVATE = 'CONTENT_PRIVATE',
  MEDIA_PROCESSING_FAILED = 'MEDIA_PROCESSING_FAILED',
  
  // Monitoring & Alerts
  MONITORING_SETUP_FAILED = 'MONITORING_SETUP_FAILED',
  ALERT_DELIVERY_FAILED = 'ALERT_DELIVERY_FAILED',
  REAL_TIME_CONNECTION_LOST = 'REAL_TIME_CONNECTION_LOST',
  WEBHOOK_DELIVERY_FAILED = 'WEBHOOK_DELIVERY_FAILED',
  
  // Settings & Configuration
  SETTINGS_SAVE_FAILED = 'SETTINGS_SAVE_FAILED',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
  PRIVACY_SETTINGS_ERROR = 'PRIVACY_SETTINGS_ERROR',
  NOTIFICATION_SETUP_FAILED = 'NOTIFICATION_SETUP_FAILED',
  
  // Dashboard & Reporting
  DASHBOARD_DATA_LOAD_FAILED = 'DASHBOARD_DATA_LOAD_FAILED',
  REPORT_GENERATION_FAILED = 'REPORT_GENERATION_FAILED',
  EXPORT_FAILED = 'EXPORT_FAILED',
  CHART_RENDERING_ERROR = 'CHART_RENDERING_ERROR',
  
  // Network & System
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
  
  // Validation
  INVALID_URL = 'INVALID_URL',
  INVALID_PLATFORM_URL = 'INVALID_PLATFORM_URL',
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  
  // Subscription & Limits
  FEATURE_NOT_AVAILABLE = 'FEATURE_NOT_AVAILABLE',
  USAGE_LIMIT_EXCEEDED = 'USAGE_LIMIT_EXCEEDED',
  SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',
  PLAN_UPGRADE_REQUIRED = 'PLAN_UPGRADE_REQUIRED',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error context for different features
 */
export enum ErrorContext {
  DASHBOARD = 'dashboard',
  SCANNING = 'scanning',
  MONITORING = 'monitoring',
  SETTINGS = 'settings',
  ALERTS = 'alerts',
  PLATFORM_CONNECTION = 'platform_connection',
  CONTENT_ANALYSIS = 'content_analysis',
  GENERAL = 'general',
}

/**
 * Recovery action types
 */
export enum RecoveryAction {
  RETRY = 'retry',
  REFRESH = 'refresh',
  RECONNECT = 'reconnect',
  UPGRADE = 'upgrade',
  CONTACT_SUPPORT = 'contact_support',
  CHECK_SETTINGS = 'check_settings',
  WAIT_AND_RETRY = 'wait_and_retry',
  MANUAL_ACTION = 'manual_action',
}

/**
 * Error message configuration
 */
export interface ErrorMessageConfig {
  code: SocialProtectionErrorCode;
  title: string;
  message: string;
  description?: string;
  severity: ErrorSeverity;
  context: ErrorContext[];
  recoveryActions: RecoveryAction[];
  retryable: boolean;
  userActionRequired: boolean;
  supportContact: boolean;
}

/**
 * Error message configurations
 */
export const ERROR_MESSAGES: Record<SocialProtectionErrorCode, ErrorMessageConfig> = {
  // Authentication & Authorization
  [SocialProtectionErrorCode.EXTENSION_NOT_CONNECTED]: {
    code: SocialProtectionErrorCode.EXTENSION_NOT_CONNECTED,
    title: 'Extension Not Connected',
    message: 'The Linkshield browser extension is not connected or installed.',
    description: 'To use social protection features, you need to install and connect the browser extension.',
    severity: ErrorSeverity.HIGH,
    context: [ErrorContext.PLATFORM_CONNECTION, ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.MANUAL_ACTION, RecoveryAction.REFRESH],
    retryable: true,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.PLATFORM_AUTH_FAILED]: {
    code: SocialProtectionErrorCode.PLATFORM_AUTH_FAILED,
    title: 'Platform Authentication Failed',
    message: 'Failed to authenticate with the social media platform.',
    description: 'Your account credentials may be incorrect or the platform may be experiencing issues.',
    severity: ErrorSeverity.HIGH,
    context: [ErrorContext.PLATFORM_CONNECTION],
    recoveryActions: [RecoveryAction.RECONNECT, RecoveryAction.CHECK_SETTINGS],
    retryable: true,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.PLATFORM_AUTH_EXPIRED]: {
    code: SocialProtectionErrorCode.PLATFORM_AUTH_EXPIRED,
    title: 'Authentication Expired',
    message: 'Your authentication with this platform has expired.',
    description: 'Please reconnect your account to continue monitoring.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.PLATFORM_CONNECTION, ErrorContext.MONITORING],
    recoveryActions: [RecoveryAction.RECONNECT],
    retryable: true,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.INSUFFICIENT_PERMISSIONS]: {
    code: SocialProtectionErrorCode.INSUFFICIENT_PERMISSIONS,
    title: 'Insufficient Permissions',
    message: 'Your account does not have the required permissions for this action.',
    description: 'Some features may require additional permissions or account privileges.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.PLATFORM_CONNECTION, ErrorContext.CONTENT_ANALYSIS],
    recoveryActions: [RecoveryAction.CHECK_SETTINGS, RecoveryAction.CONTACT_SUPPORT],
    retryable: false,
    userActionRequired: true,
    supportContact: true,
  },
  
  // Platform Connection
  [SocialProtectionErrorCode.PLATFORM_CONNECTION_FAILED]: {
    code: SocialProtectionErrorCode.PLATFORM_CONNECTION_FAILED,
    title: 'Connection Failed',
    message: 'Unable to connect to the social media platform.',
    description: 'The platform may be experiencing issues or your internet connection may be unstable.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.PLATFORM_CONNECTION],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.WAIT_AND_RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.PLATFORM_RATE_LIMITED]: {
    code: SocialProtectionErrorCode.PLATFORM_RATE_LIMITED,
    title: 'Rate Limited',
    message: 'Too many requests to the platform. Please wait before trying again.',
    description: 'Social media platforms limit the number of requests to prevent abuse.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.SCANNING, ErrorContext.MONITORING],
    recoveryActions: [RecoveryAction.WAIT_AND_RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.UNSUPPORTED_PLATFORM]: {
    code: SocialProtectionErrorCode.UNSUPPORTED_PLATFORM,
    title: 'Unsupported Platform',
    message: 'This social media platform is not currently supported.',
    description: 'We are constantly adding support for new platforms. Check back later or contact support.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.PLATFORM_CONNECTION],
    recoveryActions: [RecoveryAction.CONTACT_SUPPORT],
    retryable: false,
    userActionRequired: false,
    supportContact: true,
  },
  
  // Scanning & Analysis
  [SocialProtectionErrorCode.SCAN_INITIALIZATION_FAILED]: {
    code: SocialProtectionErrorCode.SCAN_INITIALIZATION_FAILED,
    title: 'Scan Failed to Start',
    message: 'Unable to initialize the scanning process.',
    description: 'There may be an issue with your account connection or the platform.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.SCANNING],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.CHECK_SETTINGS],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.SCAN_TIMEOUT]: {
    code: SocialProtectionErrorCode.SCAN_TIMEOUT,
    title: 'Scan Timed Out',
    message: 'The scan took too long to complete and was cancelled.',
    description: 'This may happen with large amounts of content or slow platform responses.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.SCANNING],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.WAIT_AND_RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.ANALYSIS_FAILED]: {
    code: SocialProtectionErrorCode.ANALYSIS_FAILED,
    title: 'Analysis Failed',
    message: 'Unable to complete the content analysis.',
    description: 'The analysis engine encountered an error while processing your content.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.CONTENT_ANALYSIS],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.CONTACT_SUPPORT],
    retryable: true,
    userActionRequired: false,
    supportContact: true,
  },
  
  // Data & Content
  [SocialProtectionErrorCode.CONTENT_NOT_ACCESSIBLE]: {
    code: SocialProtectionErrorCode.CONTENT_NOT_ACCESSIBLE,
    title: 'Content Not Accessible',
    message: 'The requested content is not accessible or may have been removed.',
    description: 'Content may be private, deleted, or restricted by the platform.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.CONTENT_ANALYSIS, ErrorContext.SCANNING],
    recoveryActions: [RecoveryAction.MANUAL_ACTION],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.CONTENT_PRIVATE]: {
    code: SocialProtectionErrorCode.CONTENT_PRIVATE,
    title: 'Private Content',
    message: 'This content is private and cannot be analyzed.',
    description: 'Only public content can be analyzed for security threats.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.CONTENT_ANALYSIS],
    recoveryActions: [RecoveryAction.MANUAL_ACTION],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  // Monitoring & Alerts
  [SocialProtectionErrorCode.MONITORING_SETUP_FAILED]: {
    code: SocialProtectionErrorCode.MONITORING_SETUP_FAILED,
    title: 'Monitoring Setup Failed',
    message: 'Unable to set up monitoring for your accounts.',
    description: 'There may be an issue with your account permissions or platform connection.',
    severity: ErrorSeverity.HIGH,
    context: [ErrorContext.MONITORING],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.CHECK_SETTINGS, RecoveryAction.CONTACT_SUPPORT],
    retryable: true,
    userActionRequired: false,
    supportContact: true,
  },
  
  [SocialProtectionErrorCode.REAL_TIME_CONNECTION_LOST]: {
    code: SocialProtectionErrorCode.REAL_TIME_CONNECTION_LOST,
    title: 'Real-time Connection Lost',
    message: 'Lost connection to real-time updates.',
    description: 'You may not receive immediate notifications. The connection will be restored automatically.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.MONITORING, ErrorContext.ALERTS],
    recoveryActions: [RecoveryAction.REFRESH, RecoveryAction.WAIT_AND_RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  // Settings & Configuration
  [SocialProtectionErrorCode.SETTINGS_SAVE_FAILED]: {
    code: SocialProtectionErrorCode.SETTINGS_SAVE_FAILED,
    title: 'Settings Save Failed',
    message: 'Unable to save your settings changes.',
    description: 'There may be a temporary issue with the server. Your changes were not saved.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.SETTINGS],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.REFRESH],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.INVALID_CONFIGURATION]: {
    code: SocialProtectionErrorCode.INVALID_CONFIGURATION,
    title: 'Invalid Configuration',
    message: 'The configuration settings are invalid or incomplete.',
    description: 'Please check your settings and ensure all required fields are properly filled.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.SETTINGS],
    recoveryActions: [RecoveryAction.CHECK_SETTINGS, RecoveryAction.MANUAL_ACTION],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  // Dashboard & Reporting
  [SocialProtectionErrorCode.DASHBOARD_DATA_LOAD_FAILED]: {
    code: SocialProtectionErrorCode.DASHBOARD_DATA_LOAD_FAILED,
    title: 'Dashboard Load Failed',
    message: 'Unable to load dashboard data.',
    description: 'There may be a temporary issue with the server or your internet connection.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.DASHBOARD],
    recoveryActions: [RecoveryAction.REFRESH, RecoveryAction.RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.REPORT_GENERATION_FAILED]: {
    code: SocialProtectionErrorCode.REPORT_GENERATION_FAILED,
    title: 'Report Generation Failed',
    message: 'Unable to generate the requested report.',
    description: 'The report generation service may be temporarily unavailable.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.DASHBOARD],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.WAIT_AND_RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  // Network & System
  [SocialProtectionErrorCode.NETWORK_ERROR]: {
    code: SocialProtectionErrorCode.NETWORK_ERROR,
    title: 'Network Error',
    message: 'A network error occurred. Please check your internet connection.',
    description: 'This may be a temporary connectivity issue.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.REFRESH],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.SERVICE_UNAVAILABLE]: {
    code: SocialProtectionErrorCode.SERVICE_UNAVAILABLE,
    title: 'Service Unavailable',
    message: 'The service is temporarily unavailable.',
    description: 'We are working to restore service as quickly as possible.',
    severity: ErrorSeverity.HIGH,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.WAIT_AND_RETRY, RecoveryAction.CONTACT_SUPPORT],
    retryable: true,
    userActionRequired: false,
    supportContact: true,
  },
  
  // Validation
  [SocialProtectionErrorCode.INVALID_URL]: {
    code: SocialProtectionErrorCode.INVALID_URL,
    title: 'Invalid URL',
    message: 'The provided URL is not valid.',
    description: 'Please enter a valid URL starting with http:// or https://.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.SCANNING, ErrorContext.CONTENT_ANALYSIS],
    recoveryActions: [RecoveryAction.MANUAL_ACTION],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.INVALID_PLATFORM_URL]: {
    code: SocialProtectionErrorCode.INVALID_PLATFORM_URL,
    title: 'Invalid Platform URL',
    message: 'The URL does not match the expected format for this platform.',
    description: 'Please ensure you are using a valid social media profile or content URL.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.PLATFORM_CONNECTION, ErrorContext.SCANNING],
    recoveryActions: [RecoveryAction.MANUAL_ACTION],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  // Subscription & Limits
  [SocialProtectionErrorCode.FEATURE_NOT_AVAILABLE]: {
    code: SocialProtectionErrorCode.FEATURE_NOT_AVAILABLE,
    title: 'Feature Not Available',
    message: 'This feature is not available on your current plan.',
    description: 'Upgrade your subscription to access advanced social protection features.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.UPGRADE],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.USAGE_LIMIT_EXCEEDED]: {
    code: SocialProtectionErrorCode.USAGE_LIMIT_EXCEEDED,
    title: 'Usage Limit Exceeded',
    message: 'You have reached your usage limit for this feature.',
    description: 'Upgrade your plan or wait for your limit to reset.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.SCANNING, ErrorContext.MONITORING],
    recoveryActions: [RecoveryAction.UPGRADE, RecoveryAction.WAIT_AND_RETRY],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  // Additional error codes with minimal configs for brevity
  [SocialProtectionErrorCode.ACCOUNT_SUSPENDED]: {
    code: SocialProtectionErrorCode.ACCOUNT_SUSPENDED,
    title: 'Account Suspended',
    message: 'Your account has been suspended.',
    severity: ErrorSeverity.CRITICAL,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.CONTACT_SUPPORT],
    retryable: false,
    userActionRequired: true,
    supportContact: true,
  },
  
  [SocialProtectionErrorCode.PLATFORM_TEMPORARILY_UNAVAILABLE]: {
    code: SocialProtectionErrorCode.PLATFORM_TEMPORARILY_UNAVAILABLE,
    title: 'Platform Temporarily Unavailable',
    message: 'The social media platform is temporarily unavailable.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.PLATFORM_CONNECTION],
    recoveryActions: [RecoveryAction.WAIT_AND_RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.PLATFORM_API_ERROR]: {
    code: SocialProtectionErrorCode.PLATFORM_API_ERROR,
    title: 'Platform API Error',
    message: 'The platform API returned an error.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.PLATFORM_CONNECTION],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.WAIT_AND_RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.SCAN_INTERRUPTED]: {
    code: SocialProtectionErrorCode.SCAN_INTERRUPTED,
    title: 'Scan Interrupted',
    message: 'The scan was interrupted and could not complete.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.SCANNING],
    recoveryActions: [RecoveryAction.RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.CONTENT_ANALYSIS_ERROR]: {
    code: SocialProtectionErrorCode.CONTENT_ANALYSIS_ERROR,
    title: 'Content Analysis Error',
    message: 'An error occurred during content analysis.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.CONTENT_ANALYSIS],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.CONTACT_SUPPORT],
    retryable: true,
    userActionRequired: false,
    supportContact: true,
  },
  
  [SocialProtectionErrorCode.ALGORITHM_HEALTH_CHECK_FAILED]: {
    code: SocialProtectionErrorCode.ALGORITHM_HEALTH_CHECK_FAILED,
    title: 'Algorithm Health Check Failed',
    message: 'Unable to check algorithm health status.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.MONITORING],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.REFRESH],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.INVALID_CONTENT_TYPE]: {
    code: SocialProtectionErrorCode.INVALID_CONTENT_TYPE,
    title: 'Invalid Content Type',
    message: 'The content type is not supported for analysis.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.CONTENT_ANALYSIS],
    recoveryActions: [RecoveryAction.MANUAL_ACTION],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.CONTENT_DELETED]: {
    code: SocialProtectionErrorCode.CONTENT_DELETED,
    title: 'Content Deleted',
    message: 'The content has been deleted and is no longer available.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.CONTENT_ANALYSIS],
    recoveryActions: [RecoveryAction.MANUAL_ACTION],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.MEDIA_PROCESSING_FAILED]: {
    code: SocialProtectionErrorCode.MEDIA_PROCESSING_FAILED,
    title: 'Media Processing Failed',
    message: 'Unable to process media content.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.CONTENT_ANALYSIS],
    recoveryActions: [RecoveryAction.RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.ALERT_DELIVERY_FAILED]: {
    code: SocialProtectionErrorCode.ALERT_DELIVERY_FAILED,
    title: 'Alert Delivery Failed',
    message: 'Unable to deliver alert notification.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.ALERTS],
    recoveryActions: [RecoveryAction.CHECK_SETTINGS, RecoveryAction.RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.WEBHOOK_DELIVERY_FAILED]: {
    code: SocialProtectionErrorCode.WEBHOOK_DELIVERY_FAILED,
    title: 'Webhook Delivery Failed',
    message: 'Unable to deliver webhook notification.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.ALERTS],
    recoveryActions: [RecoveryAction.CHECK_SETTINGS, RecoveryAction.RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.PRIVACY_SETTINGS_ERROR]: {
    code: SocialProtectionErrorCode.PRIVACY_SETTINGS_ERROR,
    title: 'Privacy Settings Error',
    message: 'Unable to update privacy settings.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.SETTINGS],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.CHECK_SETTINGS],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.NOTIFICATION_SETUP_FAILED]: {
    code: SocialProtectionErrorCode.NOTIFICATION_SETUP_FAILED,
    title: 'Notification Setup Failed',
    message: 'Unable to set up notifications.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.SETTINGS],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.CHECK_SETTINGS],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.EXPORT_FAILED]: {
    code: SocialProtectionErrorCode.EXPORT_FAILED,
    title: 'Export Failed',
    message: 'Unable to export data.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.DASHBOARD],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.WAIT_AND_RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.CHART_RENDERING_ERROR]: {
    code: SocialProtectionErrorCode.CHART_RENDERING_ERROR,
    title: 'Chart Rendering Error',
    message: 'Unable to render chart.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.DASHBOARD],
    recoveryActions: [RecoveryAction.REFRESH, RecoveryAction.RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.SERVER_ERROR]: {
    code: SocialProtectionErrorCode.SERVER_ERROR,
    title: 'Server Error',
    message: 'An internal server error occurred.',
    severity: ErrorSeverity.HIGH,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.CONTACT_SUPPORT],
    retryable: true,
    userActionRequired: false,
    supportContact: true,
  },
  
  [SocialProtectionErrorCode.MAINTENANCE_MODE]: {
    code: SocialProtectionErrorCode.MAINTENANCE_MODE,
    title: 'Maintenance Mode',
    message: 'The service is currently under maintenance.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.WAIT_AND_RETRY],
    retryable: true,
    userActionRequired: false,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.VALIDATION_FAILED]: {
    code: SocialProtectionErrorCode.VALIDATION_FAILED,
    title: 'Validation Failed',
    message: 'Input validation failed.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.MANUAL_ACTION],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.INVALID_INPUT]: {
    code: SocialProtectionErrorCode.INVALID_INPUT,
    title: 'Invalid Input',
    message: 'The provided input is invalid.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.MANUAL_ACTION],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.SUBSCRIPTION_REQUIRED]: {
    code: SocialProtectionErrorCode.SUBSCRIPTION_REQUIRED,
    title: 'Subscription Required',
    message: 'An active subscription is required for this feature.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.UPGRADE],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
  
  [SocialProtectionErrorCode.PLAN_UPGRADE_REQUIRED]: {
    code: SocialProtectionErrorCode.PLAN_UPGRADE_REQUIRED,
    title: 'Plan Upgrade Required',
    message: 'Please upgrade your plan to access this feature.',
    severity: ErrorSeverity.LOW,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.UPGRADE],
    retryable: false,
    userActionRequired: true,
    supportContact: false,
  },
};

/**
 * Get error message configuration by code
 * 
 * @param code - Error code
 * @returns Error message configuration
 */
export function getErrorConfig(code: SocialProtectionErrorCode): ErrorMessageConfig {
  return ERROR_MESSAGES[code] || {
    code,
    title: 'Unknown Error',
    message: 'An unknown error occurred.',
    severity: ErrorSeverity.MEDIUM,
    context: [ErrorContext.GENERAL],
    recoveryActions: [RecoveryAction.RETRY, RecoveryAction.CONTACT_SUPPORT],
    retryable: true,
    userActionRequired: false,
    supportContact: true,
  };
}

/**
 * Format error for user display
 * 
 * @param code - Error code
 * @param context - Optional context for customization
 * @returns Formatted error object
 */
export function formatError(
  code: SocialProtectionErrorCode,
  context?: Partial<ErrorMessageConfig>
): {
  title: string;
  message: string;
  description?: string;
  severity: ErrorSeverity;
  actions: string[];
} {
  const config = getErrorConfig(code);
  const merged = { ...config, ...context };
  
  const actions = merged.recoveryActions.map(action => {
    switch (action) {
      case RecoveryAction.RETRY:
        return 'Try Again';
      case RecoveryAction.REFRESH:
        return 'Refresh Page';
      case RecoveryAction.RECONNECT:
        return 'Reconnect Account';
      case RecoveryAction.UPGRADE:
        return 'Upgrade Plan';
      case RecoveryAction.CONTACT_SUPPORT:
        return 'Contact Support';
      case RecoveryAction.CHECK_SETTINGS:
        return 'Check Settings';
      case RecoveryAction.WAIT_AND_RETRY:
        return 'Wait and Retry';
      case RecoveryAction.MANUAL_ACTION:
        return 'Review Input';
      default:
        return 'Take Action';
    }
  });
  
  return {
    title: merged.title,
    message: merged.message,
    description: merged.description,
    severity: merged.severity,
    actions,
  };
}

/**
 * Check if error is retryable
 * 
 * @param code - Error code
 * @returns True if error is retryable
 */
export function isRetryableError(code: SocialProtectionErrorCode): boolean {
  return getErrorConfig(code).retryable;
}

/**
 * Check if error requires user action
 * 
 * @param code - Error code
 * @returns True if user action is required
 */
export function requiresUserAction(code: SocialProtectionErrorCode): boolean {
  return getErrorConfig(code).userActionRequired;
}

/**
 * Check if error should show support contact option
 * 
 * @param code - Error code
 * @returns True if support contact should be shown
 */
export function shouldContactSupport(code: SocialProtectionErrorCode): boolean {
  return getErrorConfig(code).supportContact;
}

/**
 * Get errors by context
 * 
 * @param context - Error context
 * @returns Array of error codes for the context
 */
export function getErrorsByContext(context: ErrorContext): SocialProtectionErrorCode[] {
  return Object.values(SocialProtectionErrorCode).filter(code => {
    const config = getErrorConfig(code);
    return config.context.includes(context);
  });
}

/**
 * Get errors by severity
 * 
 * @param severity - Error severity
 * @returns Array of error codes with the specified severity
 */
export function getErrorsBySeverity(severity: ErrorSeverity): SocialProtectionErrorCode[] {
  return Object.values(SocialProtectionErrorCode).filter(code => {
    const config = getErrorConfig(code);
    return config.severity === severity;
  });
}

/**
 * Create user-friendly error message from API error
 * 
 * @param apiError - API error object
 * @returns Formatted error message
 */
export function mapApiError(apiError: any): {
  code: string;
  title: string;
  message: string;
  severity: ErrorSeverity;
  retryable: boolean;
} {
  // Extract error code from various API response formats
  const errorCode = apiError?.response?.data?.error_code || 
                   apiError?.response?.data?.code ||
                   apiError?.code ||
                   'UNKNOWN_ERROR';
  
  // Try to match with known error codes
  const knownCode = Object.values(SocialProtectionErrorCode).find(code => code === errorCode);
  
  if (knownCode) {
    const config = getErrorConfig(knownCode);
    return {
      code: config.code,
      title: config.title,
      message: config.message,
      severity: config.severity,
      retryable: config.retryable,
    };
  }
  
  // Fallback for unknown errors
  return {
    code: errorCode,
    title: 'Error',
    message: apiError?.message || 'An unexpected error occurred.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true,
  };
}