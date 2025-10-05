/**
 * Homepage Error Handling Utilities
 * 
 * Utilities for handling errors in homepage components.
 * Maps API error codes to user-friendly messages and provides retry logic.
 */

/**
 * Error codes from the API
 */
export enum HomepageErrorCode {
  // URL Check Errors
  INVALID_URL_FORMAT = 'INVALID_URL_FORMAT',
  URL_TOO_LONG = 'URL_TOO_LONG',
  SCAN_TIMEOUT = 'SCAN_TIMEOUT',
  SCAN_FAILED = 'SCAN_FAILED',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  DAILY_LIMIT_REACHED = 'DAILY_LIMIT_REACHED',
  
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FEATURE_NOT_AVAILABLE = 'FEATURE_NOT_AVAILABLE',
  SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',
  
  // Social Protection
  EXTENSION_NOT_CONNECTED = 'EXTENSION_NOT_CONNECTED',
  ANALYSIS_FAILED = 'ANALYSIS_FAILED',
  
  // Network Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  SERVER_ERROR = 'SERVER_ERROR',
}

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // URL Check Errors
  [HomepageErrorCode.INVALID_URL_FORMAT]: 
    'Please enter a valid URL (e.g., https://example.com)',
  [HomepageErrorCode.URL_TOO_LONG]: 
    'URL is too long. Maximum length is 2048 characters.',
  [HomepageErrorCode.SCAN_TIMEOUT]: 
    'The scan took too long to complete. Please try again.',
  [HomepageErrorCode.SCAN_FAILED]: 
    'Unable to scan this URL. Please try again or contact support.',
  
  // Rate Limiting
  [HomepageErrorCode.RATE_LIMIT_EXCEEDED]: 
    'You have reached your rate limit. Please wait a moment or sign up for more scans.',
  [HomepageErrorCode.DAILY_LIMIT_REACHED]: 
    'You have reached your daily limit. Upgrade your plan for more scans.',
  
  // Authentication & Authorization
  [HomepageErrorCode.UNAUTHORIZED]: 
    'Please log in to access this feature.',
  [HomepageErrorCode.FEATURE_NOT_AVAILABLE]: 
    'This feature is not available on your current plan. Please upgrade.',
  [HomepageErrorCode.SUBSCRIPTION_REQUIRED]: 
    'An active subscription is required to use this feature.',
  
  // Social Protection
  [HomepageErrorCode.EXTENSION_NOT_CONNECTED]: 
    'Browser extension is not connected. Please install or reconnect the extension.',
  [HomepageErrorCode.ANALYSIS_FAILED]: 
    'Analysis failed. Please try again or check your account connection.',
  
  // Network Errors
  [HomepageErrorCode.NETWORK_ERROR]: 
    'Network error. Please check your internet connection and try again.',
  [HomepageErrorCode.TIMEOUT]: 
    'Request timed out. Please try again.',
  [HomepageErrorCode.SERVER_ERROR]: 
    'Server error. Please try again later.',
};

/**
 * Error with additional context
 */
export interface HomepageError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  requiresAuth: boolean;
  requiresUpgrade: boolean;
  details?: Record<string, any>;
}

/**
 * Map API error to HomepageError
 */
export const mapApiError = (error: any): HomepageError => {
  // Extract error code from response
  const errorCode = error?.response?.data?.error_code || 
                    error?.code || 
                    'UNKNOWN_ERROR';
  
  // Extract error message
  const apiMessage = error?.response?.data?.message || 
                     error?.message || 
                     'An unexpected error occurred';
  
  // Get user-friendly message
  const userMessage = ERROR_MESSAGES[errorCode] || apiMessage;
  
  // Determine if error is retryable
  const retryable = [
    HomepageErrorCode.SCAN_TIMEOUT,
    HomepageErrorCode.NETWORK_ERROR,
    HomepageErrorCode.TIMEOUT,
    HomepageErrorCode.SERVER_ERROR,
  ].includes(errorCode as HomepageErrorCode);
  
  // Determine if error requires authentication
  const requiresAuth = [
    HomepageErrorCode.UNAUTHORIZED,
    HomepageErrorCode.FEATURE_NOT_AVAILABLE,
  ].includes(errorCode as HomepageErrorCode);
  
  // Determine if error requires upgrade
  const requiresUpgrade = [
    HomepageErrorCode.FEATURE_NOT_AVAILABLE,
    HomepageErrorCode.SUBSCRIPTION_REQUIRED,
    HomepageErrorCode.DAILY_LIMIT_REACHED,
  ].includes(errorCode as HomepageErrorCode);
  
  return {
    code: errorCode,
    message: apiMessage,
    userMessage,
    retryable,
    requiresAuth,
    requiresUpgrade,
    details: error?.response?.data?.details,
  };
};

/**
 * Retry configuration
 */
interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> => {
  const { maxAttempts, delayMs, backoffMultiplier } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };
  
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable
      const mappedError = mapApiError(error);
      if (!mappedError.retryable) {
        throw error;
      }
      
      // Don't wait after last attempt
      if (attempt === maxAttempts) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  return (
    !error.response ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ERR_NETWORK' ||
    error.message === 'Network Error'
  );
};

/**
 * Check if error is a timeout
 */
export const isTimeoutError = (error: any): boolean => {
  return (
    error.code === 'ECONNABORTED' ||
    error.code === 'ETIMEDOUT' ||
    error.message?.includes('timeout')
  );
};

/**
 * Check if error is a rate limit error
 */
export const isRateLimitError = (error: any): boolean => {
  return (
    error?.response?.status === 429 ||
    error?.response?.data?.error_code === HomepageErrorCode.RATE_LIMIT_EXCEEDED
  );
};

/**
 * Check if error requires authentication
 */
export const requiresAuthentication = (error: any): boolean => {
  return (
    error?.response?.status === 401 ||
    error?.response?.data?.error_code === HomepageErrorCode.UNAUTHORIZED
  );
};

/**
 * Check if error requires upgrade
 */
export const requiresUpgrade = (error: any): boolean => {
  return (
    error?.response?.status === 402 ||
    [
      HomepageErrorCode.FEATURE_NOT_AVAILABLE,
      HomepageErrorCode.SUBSCRIPTION_REQUIRED,
    ].includes(error?.response?.data?.error_code)
  );
};

/**
 * Get retry delay from error response
 */
export const getRetryDelay = (error: any): number | null => {
  // Check for Retry-After header
  const retryAfter = error?.response?.headers?.['retry-after'];
  if (retryAfter) {
    const delay = parseInt(retryAfter, 10);
    if (!isNaN(delay)) {
      return delay * 1000; // Convert to milliseconds
    }
  }
  
  // Check for X-RateLimit-Reset header
  const resetTime = error?.response?.headers?.['x-ratelimit-reset'];
  if (resetTime) {
    const reset = parseInt(resetTime, 10);
    if (!isNaN(reset)) {
      const now = Math.floor(Date.now() / 1000);
      const delay = reset - now;
      return delay > 0 ? delay * 1000 : null;
    }
  }
  
  return null;
};

/**
 * Format error for logging
 */
export const formatErrorForLogging = (error: any): Record<string, any> => {
  return {
    code: error?.response?.data?.error_code || error?.code,
    message: error?.message,
    status: error?.response?.status,
    url: error?.config?.url,
    method: error?.config?.method,
    timestamp: new Date().toISOString(),
    details: error?.response?.data?.details,
  };
};
