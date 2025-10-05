/**
 * Risk Score Utilities for Social Protection
 * 
 * Centralized utilities for calculating, categorizing, and formatting risk scores
 * across social protection features. Provides consistent risk assessment logic.
 * 
 * Features:
 * - Risk level categorization with thresholds
 * - Color coding for visual indicators
 * - Score validation and normalization
 * - Trend calculation and comparison
 * - Risk factor weighting and aggregation
 */

/**
 * Risk level categories with thresholds
 */
export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Risk level configuration with thresholds and styling
 */
export interface RiskLevelConfig {
  level: RiskLevel;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  threshold: {
    min: number;
    max: number;
  };
}

/**
 * Risk level configurations
 */
export const RISK_LEVELS: Record<RiskLevel, RiskLevelConfig> = {
  [RiskLevel.LOW]: {
    level: RiskLevel.LOW,
    label: 'Low Risk',
    description: 'Your social media presence appears secure with minimal threats detected.',
    color: '#10b981', // green-500
    bgColor: '#dcfce7', // green-100
    textColor: '#065f46', // green-800
    threshold: { min: 0, max: 30 },
  },
  [RiskLevel.MODERATE]: {
    level: RiskLevel.MODERATE,
    label: 'Moderate Risk',
    description: 'Some potential issues detected. Regular monitoring recommended.',
    color: '#f59e0b', // amber-500
    bgColor: '#fef3c7', // amber-100
    textColor: '#92400e', // amber-800
    threshold: { min: 31, max: 60 },
  },
  [RiskLevel.HIGH]: {
    level: RiskLevel.HIGH,
    label: 'High Risk',
    description: 'Multiple threats detected. Immediate attention recommended.',
    color: '#ef4444', // red-500
    bgColor: '#fee2e2', // red-100
    textColor: '#991b1b', // red-800
    threshold: { min: 61, max: 85 },
  },
  [RiskLevel.CRITICAL]: {
    level: RiskLevel.CRITICAL,
    label: 'Critical Risk',
    description: 'Severe threats detected. Urgent action required to protect your accounts.',
    color: '#dc2626', // red-600
    bgColor: '#fecaca', // red-200
    textColor: '#7f1d1d', // red-900
    threshold: { min: 86, max: 100 },
  },
};

/**
 * Risk factor weights for score calculation
 */
export interface RiskFactorWeights {
  algorithmHealth: number;
  visibilityPenalties: number;
  engagementDrops: number;
  contentFlags: number;
  accountSecurity: number;
  privacySettings: number;
  suspiciousActivity: number;
}

/**
 * Default risk factor weights (should sum to 1.0)
 */
export const DEFAULT_RISK_WEIGHTS: RiskFactorWeights = {
  algorithmHealth: 0.25,
  visibilityPenalties: 0.20,
  engagementDrops: 0.15,
  contentFlags: 0.15,
  accountSecurity: 0.10,
  privacySettings: 0.10,
  suspiciousActivity: 0.05,
};

/**
 * Individual risk factor data
 */
export interface RiskFactor {
  name: string;
  score: number; // 0-100 (higher = more risk)
  weight: number;
  description: string;
  severity: RiskLevel;
  lastUpdated: Date;
}

/**
 * Risk score calculation result
 */
export interface RiskScoreResult {
  overallScore: number;
  level: RiskLevel;
  config: RiskLevelConfig;
  factors: RiskFactor[];
  trend: {
    direction: 'up' | 'down' | 'stable';
    change: number;
    period: string;
  };
  recommendations: string[];
}

/**
 * Normalize risk score to 0-100 range
 * 
 * @param score - Raw risk score
 * @returns Normalized score between 0 and 100
 */
export function normalizeRiskScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get risk level configuration based on score
 * 
 * @param score - Risk score (0-100)
 * @returns Risk level configuration
 */
export function getRiskLevel(score: number): RiskLevelConfig {
  const normalizedScore = normalizeRiskScore(score);
  
  for (const config of Object.values(RISK_LEVELS)) {
    if (normalizedScore >= config.threshold.min && normalizedScore <= config.threshold.max) {
      return config;
    }
  }
  
  // Fallback to critical if score is somehow out of range
  return RISK_LEVELS[RiskLevel.CRITICAL];
}

/**
 * Calculate weighted risk score from individual factors
 * 
 * @param factors - Array of risk factors with scores and weights
 * @returns Calculated overall risk score
 */
export function calculateWeightedRiskScore(factors: RiskFactor[]): number {
  if (factors.length === 0) return 0;
  
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  if (totalWeight === 0) return 0;
  
  const weightedSum = factors.reduce((sum, factor) => {
    return sum + (factor.score * factor.weight);
  }, 0);
  
  return normalizeRiskScore(weightedSum / totalWeight);
}

/**
 * Calculate risk trend based on current and previous scores
 * 
 * @param currentScore - Current risk score
 * @param previousScore - Previous risk score
 * @param period - Time period for the comparison
 * @returns Risk trend information
 */
export function calculateRiskTrend(
  currentScore: number,
  previousScore: number,
  period: string = '24h'
): { direction: 'up' | 'down' | 'stable'; change: number; period: string } {
  const change = currentScore - previousScore;
  const threshold = 2; // Minimum change to consider significant
  
  let direction: 'up' | 'down' | 'stable';
  if (Math.abs(change) < threshold) {
    direction = 'stable';
  } else if (change > 0) {
    direction = 'up';
  } else {
    direction = 'down';
  }
  
  return {
    direction,
    change: Math.round(Math.abs(change)),
    period,
  };
}

/**
 * Generate risk-based recommendations
 * 
 * @param score - Current risk score
 * @param factors - Risk factors contributing to the score
 * @returns Array of actionable recommendations
 */
export function generateRiskRecommendations(
  score: number,
  factors: RiskFactor[]
): string[] {
  const recommendations: string[] = [];
  const level = getRiskLevel(score);
  
  // High-impact factors (score > 70)
  const highRiskFactors = factors.filter(f => f.score > 70);
  
  // General recommendations based on risk level
  switch (level.level) {
    case RiskLevel.CRITICAL:
      recommendations.push(
        'Immediately review all account security settings',
        'Enable two-factor authentication on all platforms',
        'Consider temporarily limiting public content'
      );
      break;
    case RiskLevel.HIGH:
      recommendations.push(
        'Review recent content for potential policy violations',
        'Check privacy settings on all connected platforms',
        'Monitor engagement metrics closely'
      );
      break;
    case RiskLevel.MODERATE:
      recommendations.push(
        'Schedule regular account health checks',
        'Review content strategy for algorithm compliance',
        'Monitor visibility metrics weekly'
      );
      break;
    case RiskLevel.LOW:
      recommendations.push(
        'Continue current security practices',
        'Maintain regular monitoring schedule',
        'Keep privacy settings up to date'
      );
      break;
  }
  
  // Factor-specific recommendations
  highRiskFactors.forEach(factor => {
    switch (factor.name.toLowerCase()) {
      case 'algorithm_health':
        recommendations.push('Adjust content strategy to improve algorithm performance');
        break;
      case 'visibility_penalties':
        recommendations.push('Review recent posts for potential policy violations');
        break;
      case 'engagement_drops':
        recommendations.push('Analyze content performance and adjust posting strategy');
        break;
      case 'content_flags':
        recommendations.push('Review flagged content and appeal if necessary');
        break;
      case 'account_security':
        recommendations.push('Update passwords and enable additional security measures');
        break;
      case 'privacy_settings':
        recommendations.push('Review and tighten privacy controls');
        break;
      case 'suspicious_activity':
        recommendations.push('Investigate unusual account activity immediately');
        break;
    }
  });
  
  return [...new Set(recommendations)]; // Remove duplicates
}

/**
 * Get risk score color for UI components
 * 
 * @param score - Risk score (0-100)
 * @returns Color hex code
 */
export function getRiskScoreColor(score: number): string {
  return getRiskLevel(score).color;
}

/**
 * Get risk score background color for UI components
 * 
 * @param score - Risk score (0-100)
 * @returns Background color hex code
 */
export function getRiskScoreBgColor(score: number): string {
  return getRiskLevel(score).bgColor;
}

/**
 * Get risk score text color for UI components
 * 
 * @param score - Risk score (0-100)
 * @returns Text color hex code
 */
export function getRiskScoreTextColor(score: number): string {
  return getRiskLevel(score).textColor;
}

/**
 * Format risk score for display
 * 
 * @param score - Risk score (0-100)
 * @param includeLevel - Whether to include risk level text
 * @returns Formatted risk score string
 */
export function formatRiskScore(score: number, includeLevel: boolean = false): string {
  const normalizedScore = normalizeRiskScore(score);
  const level = getRiskLevel(normalizedScore);
  
  if (includeLevel) {
    return `${normalizedScore}/100 (${level.label})`;
  }
  
  return `${normalizedScore}/100`;
}

/**
 * Check if risk score indicates immediate action needed
 * 
 * @param score - Risk score (0-100)
 * @returns True if immediate action is recommended
 */
export function requiresImmediateAction(score: number): boolean {
  const level = getRiskLevel(score);
  return level.level === RiskLevel.CRITICAL || level.level === RiskLevel.HIGH;
}

/**
 * Calculate risk score change percentage
 * 
 * @param currentScore - Current risk score
 * @param previousScore - Previous risk score
 * @returns Percentage change (positive = increase in risk)
 */
export function calculateRiskScoreChange(
  currentScore: number,
  previousScore: number
): number {
  if (previousScore === 0) return 0;
  return Math.round(((currentScore - previousScore) / previousScore) * 100);
}