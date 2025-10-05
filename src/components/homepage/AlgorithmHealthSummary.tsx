/**
 * AlgorithmHealthSummary Component
 * 
 * Displays algorithm health metrics with quick analysis actions.
 */

'use client';

import { TrendingUp, TrendingDown, Minus, AlertTriangle, Eye, Heart, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAlgorithmHealth, useAnalyzeVisibility, useAnalyzeEngagement, useDetectPenalties } from '@/hooks/homepage';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Link from 'next/link';

export const AlgorithmHealthSummary = () => {
  const { data: health, isLoading, isError } = useAlgorithmHealth();
  const analyzeVisibility = useAnalyzeVisibility();
  const analyzeEngagement = useAnalyzeEngagement();
  const detectPenalties = useDetectPenalties();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <LoadingSpinner size="md" message="Loading algorithm health..." />
      </div>
    );
  }

  if (isError || !health) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Algorithm Health
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Connect a social media account to monitor algorithm health
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    switch (trend) {
      case 'UP':
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'DOWN':
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'STABLE':
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'HEALTHY' | 'WARNING' | 'CRITICAL') => {
    switch (status) {
      case 'HEALTHY':
        return 'text-green-600 dark:text-green-400';
      case 'WARNING':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'CRITICAL':
        return 'text-red-600 dark:text-red-400';
    }
  };

  const hasPenalties = health.penalties.detected;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Algorithm Health
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Overall Score: <span className="font-semibold">{health.overall_score}/100</span>
            </p>
          </div>
        </div>

        {hasPenalties && (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-xs font-medium">
            <AlertTriangle className="h-3 w-3" />
            <span>{health.penalties.count} Penalties</span>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="space-y-3 mb-4">
        {/* Visibility */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Visibility
              </p>
              <p className={`text-xs ${getStatusColor(health.visibility.status)}`}>
                {health.visibility.score}/100
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon(health.visibility.trend)}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {health.visibility.trend.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Engagement */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Engagement
              </p>
              <p className={`text-xs ${getStatusColor(health.engagement.status)}`}>
                {health.engagement.score}/100
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon(health.engagement.trend)}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {health.engagement.trend.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Penalties Warning */}
        {hasPenalties && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Flag className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  {health.penalties.count} Penalty Detected
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Severity: {health.penalties.severity}
                </p>
                {health.penalties.types.length > 0 && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Types: {health.penalties.types.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Last Analyzed */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Last analyzed: {new Date(health.last_analyzed).toLocaleString()}
      </p>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => analyzeVisibility.mutate()}
          disabled={analyzeVisibility.isPending}
          className="text-xs"
        >
          {analyzeVisibility.isPending ? '...' : 'Visibility'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => analyzeEngagement.mutate()}
          disabled={analyzeEngagement.isPending}
          className="text-xs"
        >
          {analyzeEngagement.isPending ? '...' : 'Engagement'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => detectPenalties.mutate()}
          disabled={detectPenalties.isPending}
          className="text-xs"
        >
          {detectPenalties.isPending ? '...' : 'Penalties'}
        </Button>
      </div>

      {/* View Full Report Link */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/dashboard/social-protection/algorithm-health"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View Full Report →
        </Link>
      </div>
    </div>
  );
};
