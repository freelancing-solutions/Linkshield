/**
 * @fileoverview Algorithm Health Card Component
 * 
 * Displays algorithm health metrics across connected platforms with
 * trend indicators, performance scores, and visual health indicators.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendIndicator } from '@/components/shared/TrendIndicator';
import { Activity, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { AlgorithmHealth, PlatformType } from '@/types/social-protection';

/**
 * Props for the AlgorithmHealthCard component
 */
interface AlgorithmHealthCardProps {
  /** Array of algorithm health data for different platforms */
  healthData: AlgorithmHealth[];
  /** Loading state */
  isLoading?: boolean;
  /** Last updated timestamp */
  lastUpdated?: Date;
}

/**
 * Platform icon mapping
 */
const getPlatformIcon = (platform: PlatformType): string => {
  const icons = {
    [PlatformType.FACEBOOK]: '📘',
    [PlatformType.INSTAGRAM]: '📷',
    [PlatformType.TWITTER]: '🐦',
    [PlatformType.LINKEDIN]: '💼',
    [PlatformType.TIKTOK]: '🎵',
    [PlatformType.YOUTUBE]: '📺',
    [PlatformType.SNAPCHAT]: '👻',
    [PlatformType.PINTEREST]: '📌',
    [PlatformType.REDDIT]: '🤖',
    [PlatformType.DISCORD]: '🎮',
  };
  return icons[platform] || '🌐';
};

/**
 * Get health status color and description
 */
const getHealthStatus = (score: number): { 
  status: string; 
  color: string; 
  bgColor: string;
  icon: React.ReactNode;
} => {
  if (score >= 80) {
    return {
      status: 'Excellent',
      color: 'text-green-700 dark:text-green-300',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      icon: <CheckCircle className="h-3 w-3" />
    };
  } else if (score >= 60) {
    return {
      status: 'Good',
      color: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      icon: <CheckCircle className="h-3 w-3" />
    };
  } else if (score >= 40) {
    return {
      status: 'Fair',
      color: 'text-yellow-700 dark:text-yellow-300',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      icon: <AlertCircle className="h-3 w-3" />
    };
  } else {
    return {
      status: 'Poor',
      color: 'text-red-700 dark:text-red-300',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      icon: <AlertCircle className="h-3 w-3" />
    };
  }
};

/**
 * Calculate overall health score
 */
const calculateOverallHealth = (healthData: AlgorithmHealth[]): number => {
  if (healthData.length === 0) return 0;
  const totalScore = healthData.reduce((sum, health) => sum + health.overallScore, 0);
  return Math.round(totalScore / healthData.length);
};

/**
 * Calculate trend direction
 */
const calculateTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
  const diff = current - previous;
  if (Math.abs(diff) < 2) return 'stable';
  return diff > 0 ? 'up' : 'down';
};

/**
 * Algorithm Health Card Component
 * 
 * Displays algorithm health metrics with visual indicators and trends
 * across all connected social media platforms.
 * 
 * @component
 * @example
 * ```tsx
 * import { AlgorithmHealthCard } from '@/components/social-protection/AlgorithmHealthCard';
 * 
 * function Dashboard() {
 *   const { data } = usePlatformHealth();
 *   
 *   return (
 *     <AlgorithmHealthCard 
 *       healthData={data}
 *       lastUpdated={new Date()}
 *     />
 *   );
 * }
 * ```
 * 
 * @param props - Component props
 * @returns JSX element containing the algorithm health card
 */
export function AlgorithmHealthCard({ 
  healthData, 
  isLoading = false,
  lastUpdated
}: AlgorithmHealthCardProps) {
  const overallHealth = calculateOverallHealth(healthData);
  const healthStatus = getHealthStatus(overallHealth);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Algorithm Health</CardTitle>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Algorithm Health</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Health Score */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{overallHealth}</div>
              <div className={`flex items-center gap-1 text-sm ${healthStatus.color}`}>
                {healthStatus.icon}
                <span>{healthStatus.status}</span>
              </div>
            </div>
            <Badge className={healthStatus.bgColor}>
              Overall Health
            </Badge>
          </div>

          {/* Platform Health Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Platform Performance</h4>
            
            {healthData.slice(0, 4).map((health) => {
              const platformStatus = getHealthStatus(health.overallScore);
              const trend = health.previousScore 
                ? calculateTrend(health.overallScore, health.previousScore)
                : 'stable';
              const change = health.previousScore 
                ? health.overallScore - health.previousScore
                : 0;

              return (
                <div key={health.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {getPlatformIcon(health.platform)}
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {health.platform.toLowerCase()}
                      </span>
                      {health.previousScore && (
                        <TrendIndicator
                          direction={trend}
                          value={Math.abs(change).toFixed(1)}
                          size="sm"
                          iconOnly
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {health.overallScore}
                      </span>
                      <div className={`flex items-center ${platformStatus.color}`}>
                        {platformStatus.icon}
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={health.overallScore} 
                    className="h-2"
                  />
                  
                  {/* Key metrics */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Reach: {health.metrics.reach.toLocaleString()}</span>
                    <span>Engagement: {health.metrics.engagement.toFixed(1)}%</span>
                    <span>Visibility: {health.metrics.visibility.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show more platforms if there are more than 4 */}
          {healthData.length > 4 && (
            <div className="text-center">
              <Link href="/social-protection/algorithm-health">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all {healthData.length} platforms
                </Button>
              </Link>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Updated {lastUpdated.toLocaleTimeString()}</span>
              </div>
              <Link href="/social-protection/algorithm-health">
                <Button variant="ghost" size="sm" className="text-xs h-6">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  View Trends
                </Button>
              </Link>
            </div>
          )}

          {/* Empty state */}
          {healthData.length === 0 && (
            <div className="text-center py-6">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                No algorithm data available
              </p>
              <p className="text-xs text-muted-foreground">
                Connect platforms to monitor algorithm health
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}