/**
 * Social Protection Utilities
 * 
 * Centralized export of all utility functions and types for social protection features.
 * This module provides a single entry point for importing social protection utilities.
 */

// Risk Score Utilities
export {
  RiskLevel,
  type RiskLevelConfig,
  type RiskFactorWeights,
  type RiskFactor,
  type RiskScoreResult,
  normalizeRiskScore,
  getRiskLevel,
  calculateWeightedRiskScore,
  determineRiskTrend,
  generateRiskRecommendations,
  formatRiskScoreDisplay,
  RISK_LEVEL_CONFIGS,
  DEFAULT_RISK_WEIGHTS,
} from './risk-score';

// URL Validation Utilities
export {
  SocialPlatform,
  SecurityLevel,
  type PlatformValidationRule,
  type URLValidationOptions,
  type URLValidationResult,
  type BatchValidationResult,
  validateSocialURL,
  validatePlatformURL,
  normalizeSocialURL,
  detectPlatform,
  validateBatchURLs,
  isSecureURL,
  extractPlatformData,
  validateCustomRules,
  PLATFORM_VALIDATION_RULES,
  DEFAULT_VALIDATION_OPTIONS,
} from './url-validation';

// Date Formatting Utilities
export {
  TimeFormat,
  TimeContext,
  type SocialDateFormatOptions,
  formatSocialDate,
  normalizeDate,
  formatRelativeTime,
  formatAbsoluteTime,
  formatDetailedTime,
  formatCompactTime,
  formatSocialTime,
  isSameDay,
  formatTimeRange,
  formatDuration,
  formatScanTimestamp,
  formatAlertTimestamp,
  formatMonitoringPeriod,
  getTimezoneDisplay,
  isBusinessHours,
  DEFAULT_DATE_OPTIONS,
  TIME_INTERVALS,
} from './date-format';

// Error Message Utilities
export {
  SocialProtectionErrorCode,
  ErrorSeverity,
  ErrorContext,
  RecoveryAction,
  type ErrorMessageConfig,
  getErrorConfig,
  formatError,
  isRetryableError,
  requiresUserAction,
  shouldContactSupport,
  getErrorsByContext,
  getErrorsBySeverity,
  mapApiError,
  ERROR_MESSAGES,
} from './error-messages';

/**
 * Utility function to create a comprehensive social protection context
 * 
 * @param options - Configuration options
 * @returns Social protection utilities context
 */
export function createSocialProtectionUtils(options?: {
  riskWeights?: Partial<RiskFactorWeights>;
  validationOptions?: Partial<URLValidationOptions>;
  dateOptions?: Partial<SocialDateFormatOptions>;
}) {
  return {
    // Risk utilities with custom weights
    risk: {
      calculate: (score: number, factors?: RiskFactor[]) => 
        calculateWeightedRiskScore(score, factors, options?.riskWeights),
      format: formatRiskScoreDisplay,
      getLevel: getRiskLevel,
      getTrend: determineRiskTrend,
      getRecommendations: generateRiskRecommendations,
    },
    
    // URL utilities with custom options
    url: {
      validate: (url: string, platform?: SocialPlatform) => 
        validateSocialURL(url, { ...DEFAULT_VALIDATION_OPTIONS, ...options?.validationOptions }),
      validatePlatform: validatePlatformURL,
      normalize: normalizeSocialURL,
      detectPlatform,
      validateBatch: validateBatchURLs,
    },
    
    // Date utilities with custom options
    date: {
      format: (date: Date | string, context?: TimeContext) => 
        formatSocialDate(date, context, { ...DEFAULT_DATE_OPTIONS, ...options?.dateOptions }),
      relative: formatRelativeTime,
      absolute: formatAbsoluteTime,
      detailed: formatDetailedTime,
      compact: formatCompactTime,
      social: formatSocialTime,
      scanTimestamp: formatScanTimestamp,
      alertTimestamp: formatAlertTimestamp,
      monitoringPeriod: formatMonitoringPeriod,
    },
    
    // Error utilities
    error: {
      format: formatError,
      getConfig: getErrorConfig,
      isRetryable: isRetryableError,
      requiresAction: requiresUserAction,
      shouldContactSupport,
      mapApiError,
    },
  };
}

/**
 * Default social protection utilities instance
 */
export const socialProtectionUtils = createSocialProtectionUtils();