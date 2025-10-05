/**
 * @fileoverview Risk Score Card Component
 * 
 * Displays the overall social protection risk score with visual gauge,
 * trend indicators, and breakdown by risk categories.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendIndicator } from '@/components/shared/TrendIndicator';
import { RiskScoreGauge } from '@/components/homepage/RiskScoreGauge';
import { AlertTriangle, Shield, TrendingUp, Info } from 'lucide-react';
import Link from 'next/link';

/**
 * Risk breakdown by category
 */
interface RiskCategory {
  name: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

/**
 * Props for the RiskScoreCard component
 */
interface RiskScoreCardProps {
  /** Overall risk score (0-100) */
  overallScore: number;
  /** Previous period score for trend calculation */
  previousScore?: number;
  /** Risk breakdown by categories */
  categories?: RiskCategory[];
  /** Loading state */
  isLoading?: boolean;
  /** Last updated timestamp */
  lastUpdated?: Date;
}

/**
 * Get risk level description based on score
 */
const getRiskLevel = (score: number): { level: string; description: string; color: string } => {
  if (score <= 30) {
    return {
      level: 'Low Risk',
      description: 'Your social presence is well-protected',
      color: 'text-green-600 dark:text-green-400'
    };
  } else if (score <= 70) {
    return {
      level: 'Medium Risk',
      description: 'Some areas need attention',
      color: 'text-yellow-600 dark:text-yellow-400'
    };
  } else {
    return {
      level: 'High Risk',
      description: 'Immediate action recommended',
      color: 'text-red-600 dark:text-red-400'
    };
  }
};

/**
 * Calculate trend direction from current and previous scores
 */
const calculateTrend = (current: number, previous?: number): 'up' | 'down' | 'stable' => {
  if (!previous) return 'stable';
  const diff = current - previous;
  if (Math.abs(diff) < 2) return 'stable';
  return diff > 0 ? 'up' : 'down';
};

/**
 * Risk Score Card Component
 * 
 * Displays the overall social protection risk score with visual indicators,
 * trend analysis, and category breakdown.
 * 
 * @component
 * @example
 * ```tsx
 * import { RiskScoreCard } from '@/components/social-protection/RiskScoreCard';
 * 
 * function Dashboard() {
 *   const { data } = useSocialProtectionDashboard();
 *   
 *   return (
 *     <RiskScoreCard 
 *       overallScore={data.overallRiskScore}
 *       previousScore={data.previousRiskScore}
 *       categories={data.riskCategories}
 *       lastUpdated={data.lastUpdated}
 *     />
 *   );
 * }
 * ```
 * 
 * @param props - Component props
 * @returns JSX element containing the risk score card
 */
export function RiskScoreCard({ 
  overallScore, 
  previousScore,
  categories = [],
  isLoading = false,
  lastUpdated
}: RiskScoreCardProps) {
  const riskInfo = getRiskLevel(overallScore);
  const trend = calculateTrend(overallScore, previousScore);
  const scoreChange = previousScore ? overallScore - previousScore : 0;

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Risk Score Gauge */}
          <div className="flex justify-center">
            <RiskScoreGauge score={overallScore} size="md" />
          </div>

          {/* Risk Level and Trend */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h3 className={`text-lg font-semibold ${riskInfo.color}`}>
                {riskInfo.level}
              </h3>
              {previousScore && (
                <TrendIndicator
                  direction={trend}
                  value={Math.abs(scoreChange).toFixed(1)}
                  size="sm"
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {riskInfo.description}
            </p>
          </div>

          {/* Risk Categories */}
          {categories.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1">
                <Info className="h-3 w-3" />
                Risk Breakdown
              </h4>
              <div className="space-y-1">
                {categories.slice(0, 3).map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">{category.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{category.score}</span>
                      <TrendIndicator
                        direction={category.trend}
                        value={Math.abs(category.change)}
                        size="sm"
                        iconOnly
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs text-muted-foreground text-center">
              Updated {lastUpdated.toLocaleTimeString()}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Link href="/social-protection/analysis" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                <AlertTriangle className="h-3 w-3 mr-1" />
                View Detailed Analysis
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}