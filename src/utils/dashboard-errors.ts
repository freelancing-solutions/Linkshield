/**
 * Dashboard Error Handling Utilities
 * 
 * Dashboard-specific error handling utilities that extend the base error handling.
 * Provides specialized error handling for dashboard components and operations.
 * 
 * Features:
 * - Dashboard-specific error codes and messages
 * - Retry logic with exponential backoff
 * - Error classification and recovery strategies
 * - Integration with existing error utilities
 */

import { 
  getErrorMessage, 
  getErrorFromResponse, 
  isNetworkError, 
  isTimeoutError 
} from './error-messages';

/**
 * Dashboard-specific error codes
 */
export enum DashboardErrorCode {
  // Data Loading Errors
  DASHBOARD_DATA_LOAD_FAILED = 'DASHBOARD_DATA_LOAD_FAILED',
  KPI_DATA_UNAVAILABLE = 'KPI_DATA_UNAVAILABLE',
  CHART_DATA_LOAD_FAILED = 'CHART_DATA_LOAD_FAILED',
  
  // Real-time Updates
  WEBSOCKET_CONNECTION_FAILED = 'WEBSOCKET_CONNECTION_FAILED',
  REAL_TIME_UPDATE_FAILED = 'REAL_TIME_UPDATE_FAILED',
  
  // Component Errors
  COMPONENT_RENDER_ERROR = 'COMPONENT_RENDER_ERROR',
  COMPONENT_DATA_ERROR = 'COMPONENT_DATA_ERROR',
  
  // Algorithm & Analysis
  ALGORITHM_HEALTH_CHECK_FAILED = 'ALGORITHM_HEALTH_CHECK_FAILED',
  ANALYSIS_EXECUTION_FAILED = 'ANALYSIS_EXECUTION_FAILED',
  PENALTY_DETECTION_FAILED = 'PENALTY_DETECTION_FAILED',
  
  // Project & Session Management
  PROJECT_LOAD_FAILED = 'PROJECT_LOAD_FAILED',
  SESSION_DATA_UNAVAILABLE = 'SESSION_DATA_UNAVAILABLE',
  TEAM_DATA_LOAD_FAILED = 'TEAM_DATA_LOAD_FAILED',
  
  // Extension & Integration
  EXTENSION_STATUS_CHECK_FAILED = 'EXTENSION_STATUS_CHECK_FAILED',
  SOCIAL_PROTECTION_DATA_FAILED = 'SOCIAL_PROTECTION_DATA_FAILED',
  
  // Crisis & Alerts
  CRISIS_ALERTS_LOAD_FAILED = 'CRISIS_ALERTS_LOAD_FAILED',
  ALERT_ACTION_FAILED = 'ALERT_ACTION_FAILED',
}

/**
 * Dashboard error messages
 */
export const DASHBOARD_ERROR_MESSAGES: Record<string, string> = {
  // Data Loading Errors
  [DashboardErrorCode.DASHBOARD_DATA_LOAD_FAILED]: 
    'Failed to load dashboard data. Please refresh the page or try again later.',
  [DashboardErrorCode.KPI_DATA_UNAVAILABLE]: 
    'KPI data is currently unavailable. Some metrics may not be displayed.',
  [DashboardErrorCode.CHART_DATA_LOAD_FAILED]: 
    'Unable to load chart data. Charts may appear empty or outdated.',
  
  // Real-time Updates
  [DashboardErrorCode.WEBSOCKET_CONNECTION_FAILED]: 
    'Real-time updates are unavailable. Data may not be current.',
  [DashboardErrorCode.REAL_TIME_UPDATE_FAILED]: 
    'Failed to receive real-time updates. Please refresh to see latest data.',
  
  // Component Errors
  [DashboardErrorCode.COMPONENT_RENDER_ERROR]: 
    'A component failed to render properly. Please refresh the page.',
  [DashboardErrorCode.COMPONENT_DATA_ERROR]: 
    'Component data is corrupted or unavailable.',
  
  // Algorithm & Analysis
  [DashboardErrorCode.ALGORITHM_HEALTH_CHECK_FAILED]: 
    'Unable to check algorithm health. Status may be outdated.',
  [DashboardErrorCode.ANALYSIS_EXECUTION_FAILED]: 
    'Analysis failed to execute. Please try again or contact support.',
  [DashboardErrorCode.PENALTY_DETECTION_FAILED]: 
    'Penalty detection analysis failed. Please try again later.',
  
  // Project & Session Management
  [DashboardErrorCode.PROJECT_LOAD_FAILED]: 
    'Failed to load project data. Some project information may be unavailable.',
  [DashboardErrorCode.SESSION_DATA_UNAVAILABLE]: 
    'Session data is currently unavailable. Recent activity may not be shown.',
  [DashboardErrorCode.TEAM_DATA_LOAD_FAILED]: 
    'Unable to load team information. Team data may be outdated.',
  
  // Extension & Integration
  [DashboardErrorCode.EXTENSION_STATUS_CHECK_FAILED]: 
    'Cannot check extension status. Extension information may be outdated.',
  [DashboardErrorCode.SOCIAL_PROTECTION_DATA_FAILED]: 
    'Social protection data is unavailable. Protection status may not be current.',
  
  // Crisis & Alerts
  [DashboardErrorCode.CRISIS_ALERTS_LOAD_FAILED]: 
    'Failed to load crisis alerts. Alert information may be outdated.',
  [DashboardErrorCode.ALERT_ACTION_FAILED]: 
    'Alert action failed to execute. Please try again.',
};

/**
 * Dashboard error interface
 */
export interface DashboardError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  component?: string;
  timestamp: Date;
  context?: Record<string, any>;
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
 * Recovery strategy types
 */
export enum RecoveryStrategy {
  RETRY = 'retry',
  REFRESH = 'refresh',
  FALLBACK = 'fallback',
  MANUAL = 'manual',
  IGNORE = 'ignore',
}

/**
 * Error classification
 */
export interface ErrorClassification {
  severity: ErrorSeverity;
  strategy: RecoveryStrategy;
  retryable: boolean;
  maxRetries: number;
  retryDelay: number;
}

/**
 * Get dashboard-specific error message
 */
export function getDashboardErrorMessage(code: string): string {
  return DASHBOARD_ERROR_MESSAGES[code] || getErrorMessage(code);
}

/**
 * Create dashboard error from API error
 */
export function createDashboardError(
  error: any,
  component?: string,
  context?: Record<string, any>
): DashboardError {
  const code = error?.response?.data?.error_code || 'UNKNOWN_ERROR';
  const message = error?.message || 'Unknown error occurred';
  const userMessage = getDashboardErrorMessage(code);
  
  return {
    code,
    message,
    userMessage,
    retryable: isRetryableError(error),
    component,
    timestamp: new Date(),
    context,
  };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network and timeout errors are retryable
  if (isNetworkError(error) || isTimeoutError(error)) {
    return true;
  }
  
  // 5xx server errors are retryable
  const status = error?.response?.status;
  if (status >= 500 && status < 600) {
    return true;
  }
  
  // Rate limit errors are retryable (with delay)
  if (status === 429) {
    return true;
  }
  
  // Specific dashboard errors that are retryable
  const retryableCodes = [
    DashboardErrorCode.DASHBOARD_DATA_LOAD_FAILED,
    DashboardErrorCode.KPI_DATA_UNAVAILABLE,
    DashboardErrorCode.CHART_DATA_LOAD_FAILED,
    DashboardErrorCode.WEBSOCKET_CONNECTION_FAILED,
    DashboardErrorCode.ALGORITHM_HEALTH_CHECK_FAILED,
    DashboardErrorCode.EXTENSION_STATUS_CHECK_FAILED,
    DashboardErrorCode.CRISIS_ALERTS_LOAD_FAILED,
  ];
  
  const errorCode = error?.response?.data?.error_code;
  return retryableCodes.includes(errorCode);
}

/**
 * Classify error for recovery strategy
 */
export function classifyError(error: any): ErrorClassification {
  const status = error?.response?.status;
  const errorCode = error?.response?.data?.error_code;
  
  // Critical errors (authentication, authorization)
  if (status === 401 || status === 403) {
    return {
      severity: ErrorSeverity.CRITICAL,
      strategy: RecoveryStrategy.MANUAL,
      retryable: false,
      maxRetries: 0,
      retryDelay: 0,
    };
  }
  
  // High severity (server errors)
  if (status >= 500) {
    return {
      severity: ErrorSeverity.HIGH,
      strategy: RecoveryStrategy.RETRY,
      retryable: true,
      maxRetries: 3,
      retryDelay: 2000,
    };
  }
  
  // Medium severity (rate limits, timeouts)
  if (status === 429 || isTimeoutError(error)) {
    return {
      severity: ErrorSeverity.MEDIUM,
      strategy: RecoveryStrategy.RETRY,
      retryable: true,
      maxRetries: 2,
      retryDelay: 5000,
    };
  }
  
  // Network errors
  if (isNetworkError(error)) {
    return {
      severity: ErrorSeverity.MEDIUM,
      strategy: RecoveryStrategy.RETRY,
      retryable: true,
      maxRetries: 3,
      retryDelay: 1000,
    };
  }
  
  // Component-specific errors
  const componentErrors = [
    DashboardErrorCode.COMPONENT_RENDER_ERROR,
    DashboardErrorCode.COMPONENT_DATA_ERROR,
  ];
  
  if (componentErrors.includes(errorCode)) {
    return {
      severity: ErrorSeverity.HIGH,
      strategy: RecoveryStrategy.REFRESH,
      retryable: false,
      maxRetries: 0,
      retryDelay: 0,
    };
  }
  
  // Data loading errors (low severity, use fallback)
  const dataErrors = [
    DashboardErrorCode.KPI_DATA_UNAVAILABLE,
    DashboardErrorCode.CHART_DATA_LOAD_FAILED,
    DashboardErrorCode.SESSION_DATA_UNAVAILABLE,
  ];
  
  if (dataErrors.includes(errorCode)) {
    return {
      severity: ErrorSeverity.LOW,
      strategy: RecoveryStrategy.FALLBACK,
      retryable: true,
      maxRetries: 1,
      retryDelay: 1000,
    };
  }
  
  // Default classification
  return {
    severity: ErrorSeverity.MEDIUM,
    strategy: RecoveryStrategy.RETRY,
    retryable: isRetryableError(error),
    maxRetries: 2,
    retryDelay: 2000,
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Don't retry non-retryable errors
      if (!isRetryableError(error)) {
        break;
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Create error handler for dashboard components
 */
export function createErrorHandler(component: string) {
  return (error: any, context?: Record<string, any>) => {
    const dashboardError = createDashboardError(error, component, context);
    const classification = classifyError(error);
    
    // Log error for debugging
    console.error(`Dashboard Error in ${component}:`, {
      error: dashboardError,
      classification,
    });
    
    return {
      error: dashboardError,
      classification,
    };
  };
}

/**
 * Format error for user display
 */
export function formatErrorForDisplay(error: DashboardError): {
  title: string;
  message: string;
  actions: string[];
} {
  const classification = classifyError({ response: { data: { error_code: error.code } } });
  
  let title = 'Something went wrong';
  let actions: string[] = [];
  
  switch (classification.severity) {
    case ErrorSeverity.CRITICAL:
      title = 'Critical Error';
      actions = ['Contact Support', 'Refresh Page'];
      break;
    case ErrorSeverity.HIGH:
      title = 'Error';
      actions = classification.strategy === RecoveryStrategy.REFRESH 
        ? ['Refresh Page', 'Try Again'] 
        : ['Try Again', 'Contact Support'];
      break;
    case ErrorSeverity.MEDIUM:
      title = 'Temporary Issue';
      actions = ['Try Again', 'Refresh'];
      break;
    case ErrorSeverity.LOW:
      title = 'Data Unavailable';
      actions = ['Refresh', 'Continue'];
      break;
  }
  
  return {
    title,
    message: error.userMessage,
    actions,
  };
}