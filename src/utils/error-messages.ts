/**
 * Error message mapping utility
 * Maps backend error codes to user-friendly messages
 */

export const ERROR_MESSAGES: Record<string, string> = {
  // Authentication Errors
  EMAIL_ALREADY_EXISTS:
    'This email is already registered. Try logging in instead or use a different email.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please check your credentials and try again.',
  ACCOUNT_LOCKED:
    'Your account has been locked due to too many failed login attempts. Please try again in 30 minutes or contact support.',
  EMAIL_NOT_VERIFIED:
    'Please verify your email address before logging in. Check your inbox for the verification link.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_TOKEN: 'This link is invalid or has expired. Please request a new one.',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED:
    'Too many requests. Please slow down and try again in a few minutes.',
  DAILY_LIMIT_REACHED:
    'You have reached your daily limit. Upgrade your plan for more capacity.',

  // Validation Errors
  INVALID_URL: 'Please enter a valid URL starting with http:// or https://.',
  URL_TOO_LONG: 'URL is too long. Maximum length is 2048 characters.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_WEAK:
    'Password does not meet security requirements. It must be at least 8 characters with uppercase, lowercase, number, and special character.',

  // Resource Errors
  RESOURCE_NOT_FOUND: 'The requested resource was not found.',
  DUPLICATE_RESOURCE: 'This resource already exists.',
  SESSION_NOT_FOUND: 'Session not found or already revoked.',

  // Permission Errors
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action.',
  SUBSCRIPTION_REQUIRED: 'This feature requires an active subscription. Please upgrade your plan.',
  PLAN_UPGRADE_REQUIRED:
    'Please upgrade your plan to access this feature. Visit the subscriptions page to learn more.',

  // Service Errors
  SERVICE_UNAVAILABLE:
    'This service is temporarily unavailable. Please try again in a few minutes.',
  EXTERNAL_SERVICE_ERROR:
    'An external service is experiencing issues. Please try again later.',

  // Password Errors
  INCORRECT_PASSWORD: 'Current password is incorrect. Please try again.',
  SAME_PASSWORD: 'New password must be different from your current password.',
  PASSWORD_RECENTLY_USED: 'This password was recently used. Please choose a different password.',

  // Email Errors
  EMAIL_SEND_FAILED: 'Failed to send email. Please try again or contact support.',
  VERIFICATION_ALREADY_SENT:
    'A verification email was recently sent. Please check your inbox or wait a few minutes before requesting another.',

  // Session Errors
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_SESSION: 'Invalid session. Please log in again.',
  TOO_MANY_SESSIONS: 'You have too many active sessions. Please revoke some sessions and try again.',

  // Generic Errors
  INTERNAL_SERVER_ERROR:
    'An unexpected error occurred. Please try again or contact support if the problem persists.',
  BAD_REQUEST: 'Invalid request. Please check your input and try again.',
  UNAUTHORIZED: 'You must be logged in to perform this action.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'This action conflicts with existing data. Please refresh and try again.',
  UNPROCESSABLE_ENTITY: 'The request could not be processed. Please check your input.',
};

/**
 * Get user-friendly error message for a given error code
 * @param code - Error code from backend
 * @returns User-friendly error message
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || 'An unexpected error occurred. Please try again.';
}

/**
 * Get error message from error object
 * Handles various error formats from API responses
 */
export function getErrorFromResponse(error: any): string {
  // Check for error_code in response data
  if (error?.response?.data?.error_code) {
    return getErrorMessage(error.response.data.error_code);
  }

  // Check for message in response data
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Check for status code
  const status = error?.response?.status;
  if (status === 401) {
    return 'Authentication required. Please log in.';
  }
  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (status === 404) {
    return 'The requested resource was not found.';
  }
  if (status === 429) {
    return 'Too many requests. Please try again later.';
  }
  if (status === 500) {
    return 'Server error. Please try again later.';
  }

  // Default error message
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return !error.response && error.request;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: any): boolean {
  return error.code === 'ECONNABORTED' || error.message?.includes('timeout');
}
