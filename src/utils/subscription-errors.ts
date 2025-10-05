/**
 * Subscription Error Handling Utilities
 * 
 * Provides comprehensive error handling for subscription-related operations
 * including plan fetching, upgrades, downgrades, and billing issues.
 * 
 * Features:
 * - Standardized error codes and messages
 * - User-friendly error descriptions
 * - Retry logic recommendations
 * - Error classification and severity
 * - Integration with error boundaries
 */

/**
 * Subscription error codes
 */
export enum SubscriptionErrorCode {
  // API/Network Errors
  PLANS_FETCH_FAILED = 'PLANS_FETCH_FAILED',
  USAGE_FETCH_FAILED = 'USAGE_FETCH_FAILED',
  RECOMMENDATIONS_FETCH_FAILED = 'RECOMMENDATIONS_FETCH_FAILED',
  SUBSCRIPTION_UPDATE_FAILED = 'SUBSCRIPTION_UPDATE_FAILED',
  
  // Plan Management Errors
  INVALID_PLAN_ID = 'INVALID_PLAN_ID',
  PLAN_NOT_AVAILABLE = 'PLAN_NOT_AVAILABLE',
  DOWNGRADE_NOT_ALLOWED = 'DOWNGRADE_NOT_ALLOWED',
  UPGRADE_LIMIT_EXCEEDED = 'UPGRADE_LIMIT_EXCEEDED',
  
  // Billing Errors
  PAYMENT_METHOD_REQUIRED = 'PAYMENT_METHOD_REQUIRED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  BILLING_ADDRESS_INVALID = 'BILLING_ADDRESS_INVALID',
  CARD_DECLINED = 'CARD_DECLINED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  
  // Usage Limit Errors
  USAGE_LIMIT_EXCEEDED = 'USAGE_LIMIT_EXCEEDED',
  FEATURE_NOT_AVAILABLE = 'FEATURE_NOT_AVAILABLE',
  TEAM_LIMIT_EXCEEDED = 'TEAM_LIMIT_EXCEEDED',
  API_LIMIT_EXCEEDED = 'API_LIMIT_EXCEEDED',
  
  // Authentication/Authorization Errors
  SUBSCRIPTION_UNAUTHORIZED = 'SUBSCRIPTION_UNAUTHORIZED',
  PLAN_ACCESS_DENIED = 'PLAN_ACCESS_DENIED',
  ADMIN_REQUIRED = 'ADMIN_REQUIRED',
  
  // Trial/Cancellation Errors
  TRIAL_EXPIRED = 'TRIAL_EXPIRED',
  TRIAL_ALREADY_USED = 'TRIAL_ALREADY_USED',
  CANCELLATION_FAILED = 'CANCELLATION_FAILED',
  REACTIVATION_FAILED = 'REACTIVATION_FAILED',
  
  // General Errors
  SUBSCRIPTION_NOT_FOUND = 'SUBSCRIPTION_NOT_FOUND',
  INVALID_SUBSCRIPTION_STATE = 'INVALID_SUBSCRIPTION_STATE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
  UNKNOWN_SUBSCRIPTION_ERROR = 'UNKNOWN_SUBSCRIPTION_ERROR'
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Subscription error interface
 */
export interface SubscriptionError {
  code: SubscriptionErrorCode;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  retryable: boolean;
  requiresAuth: boolean;
  requiresUpgrade: boolean;
  requiresPayment: boolean;
  actionRequired?: string;
  helpUrl?: string;
  context?: Record<string, any>;
}

/**
 * Error message mappings
 */
const ERROR_MESSAGES: Record<SubscriptionErrorCode, Omit<SubscriptionError, 'code' | 'context'>> = {
  // API/Network Errors
  [SubscriptionErrorCode.PLANS_FETCH_FAILED]: {
    message: 'Failed to fetch subscription plans from API',
    userMessage: 'Unable to load subscription plans. Please check your connection and try again.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true,
    requiresAuth: false,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Retry loading plans'
  },
  
  [SubscriptionErrorCode.USAGE_FETCH_FAILED]: {
    message: 'Failed to fetch usage data from API',
    userMessage: 'Unable to load your usage information. Please try again.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Retry loading usage data'
  },
  
  [SubscriptionErrorCode.RECOMMENDATIONS_FETCH_FAILED]: {
    message: 'Failed to fetch upgrade recommendations',
    userMessage: 'Unable to load upgrade suggestions. Please try again later.',
    severity: ErrorSeverity.LOW,
    retryable: true,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false
  },
  
  [SubscriptionErrorCode.SUBSCRIPTION_UPDATE_FAILED]: {
    message: 'Failed to update subscription',
    userMessage: 'Unable to update your subscription. Please try again or contact support.',
    severity: ErrorSeverity.HIGH,
    retryable: true,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Contact support if issue persists'
  },
  
  // Plan Management Errors
  [SubscriptionErrorCode.INVALID_PLAN_ID]: {
    message: 'Invalid or unknown plan ID provided',
    userMessage: 'The selected plan is not available. Please choose a different plan.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: false,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Select a valid plan'
  },
  
  [SubscriptionErrorCode.PLAN_NOT_AVAILABLE]: {
    message: 'Requested plan is not available',
    userMessage: 'This plan is currently unavailable. Please choose a different plan.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: false,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Choose an available plan'
  },
  
  [SubscriptionErrorCode.DOWNGRADE_NOT_ALLOWED]: {
    message: 'Downgrade to lower tier not allowed due to usage',
    userMessage: 'You cannot downgrade to this plan because your current usage exceeds its limits.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Reduce usage or choose a higher tier plan',
    helpUrl: '/help/downgrade-restrictions'
  },
  
  [SubscriptionErrorCode.UPGRADE_LIMIT_EXCEEDED]: {
    message: 'Maximum number of plan changes exceeded',
    userMessage: 'You have reached the maximum number of plan changes for this period.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Contact support for assistance'
  },
  
  // Billing Errors
  [SubscriptionErrorCode.PAYMENT_METHOD_REQUIRED]: {
    message: 'Payment method required for paid plan',
    userMessage: 'Please add a payment method to upgrade to a paid plan.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: true,
    actionRequired: 'Add payment method'
  },
  
  [SubscriptionErrorCode.PAYMENT_FAILED]: {
    message: 'Payment processing failed',
    userMessage: 'Your payment could not be processed. Please check your payment details.',
    severity: ErrorSeverity.HIGH,
    retryable: true,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: true,
    actionRequired: 'Update payment method'
  },
  
  [SubscriptionErrorCode.BILLING_ADDRESS_INVALID]: {
    message: 'Invalid billing address provided',
    userMessage: 'Please provide a valid billing address to complete your subscription.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: true,
    actionRequired: 'Update billing address'
  },
  
  [SubscriptionErrorCode.CARD_DECLINED]: {
    message: 'Credit card was declined',
    userMessage: 'Your card was declined. Please try a different payment method.',
    severity: ErrorSeverity.HIGH,
    retryable: true,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: true,
    actionRequired: 'Use different payment method'
  },
  
  [SubscriptionErrorCode.INSUFFICIENT_FUNDS]: {
    message: 'Insufficient funds for payment',
    userMessage: 'Your payment method has insufficient funds. Please use a different method.',
    severity: ErrorSeverity.HIGH,
    retryable: true,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: true,
    actionRequired: 'Use different payment method'
  },
  
  // Usage Limit Errors
  [SubscriptionErrorCode.USAGE_LIMIT_EXCEEDED]: {
    message: 'Usage limit exceeded for current plan',
    userMessage: 'You have exceeded your plan limits. Please upgrade to continue using this feature.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: true,
    requiresPayment: false,
    actionRequired: 'Upgrade your plan'
  },
  
  [SubscriptionErrorCode.FEATURE_NOT_AVAILABLE]: {
    message: 'Feature not available in current plan',
    userMessage: 'This feature is not available in your current plan. Please upgrade to access it.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: true,
    requiresPayment: false,
    actionRequired: 'Upgrade your plan'
  },
  
  [SubscriptionErrorCode.TEAM_LIMIT_EXCEEDED]: {
    message: 'Team member limit exceeded',
    userMessage: 'You have reached your team member limit. Please upgrade to add more members.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: true,
    requiresPayment: false,
    actionRequired: 'Upgrade your plan'
  },
  
  [SubscriptionErrorCode.API_LIMIT_EXCEEDED]: {
    message: 'API call limit exceeded',
    userMessage: 'You have exceeded your API call limit. Please upgrade or wait for the limit to reset.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: true,
    requiresPayment: false,
    actionRequired: 'Upgrade your plan or wait for reset'
  },
  
  // Authentication/Authorization Errors
  [SubscriptionErrorCode.SUBSCRIPTION_UNAUTHORIZED]: {
    message: 'Unauthorized to access subscription information',
    userMessage: 'Please sign in to view your subscription details.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Sign in to your account'
  },
  
  [SubscriptionErrorCode.PLAN_ACCESS_DENIED]: {
    message: 'Access denied for requested plan operation',
    userMessage: 'You do not have permission to perform this action.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Contact your account administrator'
  },
  
  [SubscriptionErrorCode.ADMIN_REQUIRED]: {
    message: 'Administrator privileges required',
    userMessage: 'Only account administrators can perform this action.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Contact your account administrator'
  },
  
  // Trial/Cancellation Errors
  [SubscriptionErrorCode.TRIAL_EXPIRED]: {
    message: 'Free trial has expired',
    userMessage: 'Your free trial has ended. Please choose a paid plan to continue.',
    severity: ErrorSeverity.HIGH,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: true,
    requiresPayment: true,
    actionRequired: 'Choose a paid plan'
  },
  
  [SubscriptionErrorCode.TRIAL_ALREADY_USED]: {
    message: 'Free trial already used',
    userMessage: 'You have already used your free trial. Please choose a paid plan.',
    severity: ErrorSeverity.MEDIUM,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: true,
    requiresPayment: true,
    actionRequired: 'Choose a paid plan'
  },
  
  [SubscriptionErrorCode.CANCELLATION_FAILED]: {
    message: 'Failed to cancel subscription',
    userMessage: 'Unable to cancel your subscription. Please contact support.',
    severity: ErrorSeverity.HIGH,
    retryable: true,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Contact support'
  },
  
  [SubscriptionErrorCode.REACTIVATION_FAILED]: {
    message: 'Failed to reactivate subscription',
    userMessage: 'Unable to reactivate your subscription. Please try again or contact support.',
    severity: ErrorSeverity.HIGH,
    retryable: true,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Contact support if issue persists'
  },
  
  // General Errors
  [SubscriptionErrorCode.SUBSCRIPTION_NOT_FOUND]: {
    message: 'Subscription not found',
    userMessage: 'No subscription found for your account. Please contact support.',
    severity: ErrorSeverity.HIGH,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Contact support'
  },
  
  [SubscriptionErrorCode.INVALID_SUBSCRIPTION_STATE]: {
    message: 'Invalid subscription state',
    userMessage: 'Your subscription is in an invalid state. Please contact support.',
    severity: ErrorSeverity.CRITICAL,
    retryable: false,
    requiresAuth: true,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Contact support immediately'
  },
  
  [SubscriptionErrorCode.RATE_LIMIT_EXCEEDED]: {
    message: 'Rate limit exceeded for subscription operations',
    userMessage: 'Too many requests. Please wait a moment and try again.',
    severity: ErrorSeverity.LOW,
    retryable: true,
    requiresAuth: false,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Wait and retry'
  },
  
  [SubscriptionErrorCode.MAINTENANCE_MODE]: {
    message: 'Subscription service is in maintenance mode',
    userMessage: 'Subscription services are temporarily unavailable for maintenance. Please try again later.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true,
    requiresAuth: false,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Try again later'
  },
  
  [SubscriptionErrorCode.UNKNOWN_SUBSCRIPTION_ERROR]: {
    message: 'Unknown subscription error occurred',
    userMessage: 'An unexpected error occurred. Please try again or contact support.',
    severity: ErrorSeverity.MEDIUM,
    retryable: true,
    requiresAuth: false,
    requiresUpgrade: false,
    requiresPayment: false,
    actionRequired: 'Contact support if issue persists'
  }
};

/**
 * Create a subscription error from an error code
 */
export function createSubscriptionError(
  code: SubscriptionErrorCode,
  context?: Record<string, any>
): SubscriptionError {
  const errorTemplate = ERROR_MESSAGES[code];
  
  if (!errorTemplate) {
    return createSubscriptionError(SubscriptionErrorCode.UNKNOWN_SUBSCRIPTION_ERROR, { originalCode: code });
  }
  
  return {
    code,
    context,
    ...errorTemplate
  };
}

/**
 * Parse API error response to subscription error
 */
export function parseApiError(error: any): SubscriptionError {
  // Handle network errors
  if (!error.response) {
    return createSubscriptionError(SubscriptionErrorCode.PLANS_FETCH_FAILED, {
      originalError: error.message
    });
  }
  
  const { status, data } = error.response;
  
  // Map HTTP status codes to subscription errors
  switch (status) {
    case 401:
      return createSubscriptionError(SubscriptionErrorCode.SUBSCRIPTION_UNAUTHORIZED);
    case 403:
      return createSubscriptionError(SubscriptionErrorCode.PLAN_ACCESS_DENIED);
    case 404:
      return createSubscriptionError(SubscriptionErrorCode.SUBSCRIPTION_NOT_FOUND);
    case 429:
      return createSubscriptionError(SubscriptionErrorCode.RATE_LIMIT_EXCEEDED);
    case 503:
      return createSubscriptionError(SubscriptionErrorCode.MAINTENANCE_MODE);
    default:
      // Try to parse error code from response
      if (data?.error_code) {
        const errorCode = Object.values(SubscriptionErrorCode).find(
          code => code === data.error_code
        );
        if (errorCode) {
          return createSubscriptionError(errorCode, { apiResponse: data });
        }
      }
      
      return createSubscriptionError(SubscriptionErrorCode.UNKNOWN_SUBSCRIPTION_ERROR, {
        status,
        apiResponse: data
      });
  }
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: SubscriptionError): boolean {
  return error.retryable;
}

/**
 * Get retry delay based on error severity
 */
export function getRetryDelay(error: SubscriptionError, attempt: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  
  let multiplier = 1;
  switch (error.severity) {
    case ErrorSeverity.LOW:
      multiplier = 1;
      break;
    case ErrorSeverity.MEDIUM:
      multiplier = 2;
      break;
    case ErrorSeverity.HIGH:
      multiplier = 4;
      break;
    case ErrorSeverity.CRITICAL:
      multiplier = 8;
      break;
  }
  
  const delay = Math.min(baseDelay * multiplier * Math.pow(2, attempt - 1), maxDelay);
  return delay;
}

/**
 * Format error for display in UI
 */
export function formatErrorForDisplay(error: SubscriptionError): {
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
} {
  let title = 'Subscription Error';
  
  switch (error.severity) {
    case ErrorSeverity.LOW:
      title = 'Minor Issue';
      break;
    case ErrorSeverity.MEDIUM:
      title = 'Subscription Issue';
      break;
    case ErrorSeverity.HIGH:
      title = 'Important: Subscription Problem';
      break;
    case ErrorSeverity.CRITICAL:
      title = 'Critical: Subscription Error';
      break;
  }
  
  const result: any = {
    title,
    message: error.userMessage
  };
  
  if (error.actionRequired) {
    result.actionText = error.actionRequired;
  }
  
  if (error.helpUrl) {
    result.actionUrl = error.helpUrl;
  }
  
  return result;
}

/**
 * Log subscription error for monitoring
 */
export function logSubscriptionError(error: SubscriptionError, context?: Record<string, any>): void {
  const logData = {
    code: error.code,
    message: error.message,
    severity: error.severity,
    context: { ...error.context, ...context },
    timestamp: new Date().toISOString()
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Subscription Error:', logData);
  }
  
  // In production, this would send to your monitoring service
  // e.g., Sentry, LogRocket, DataDog, etc.
  try {
    // Example: Sentry.captureException(new Error(error.message), { extra: logData });
  } catch (loggingError) {
    console.error('Failed to log subscription error:', loggingError);
  }
}