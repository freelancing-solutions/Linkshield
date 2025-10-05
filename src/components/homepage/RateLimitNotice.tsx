/**
 * RateLimitNotice Component
 * 
 * Displays rate limit information for anonymous users.
 * Shows remaining scans, reset time, and upgrade prompt.
 * 
 * Features:
 * - Parse X-RateLimit-* headers
 * - Display remaining scans
 * - Show reset time countdown
 * - Upgrade CTA
 * - Visual progress indicator
 */

'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Clock, 
  Zap,
  ArrowRight 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Rate limit information
 */
interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
}

/**
 * Component props
 */
interface RateLimitNoticeProps {
  rateLimitInfo?: RateLimitInfo;
  variant?: 'warning' | 'error' | 'info';
  showUpgrade?: boolean;
  className?: string;
}

/**
 * RateLimitNotice Component
 */
export const RateLimitNotice: React.FC<RateLimitNoticeProps> = ({
  rateLimitInfo,
  variant = 'warning',
  showUpgrade = true,
  className = '',
}) => {
  const router = useRouter();
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');

  /**
   * Calculate time until reset
   */
  useEffect(() => {
    if (!rateLimitInfo?.reset) return;

    const updateTimeUntilReset = () => {
      const now = Date.now();
      const resetTime = rateLimitInfo.reset * 1000; // Convert to milliseconds
      const diff = resetTime - now;

      if (diff <= 0) {
        setTimeUntilReset('Now');
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (hours > 0) {
        setTimeUntilReset(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeUntilReset(`${minutes}m ${seconds}s`);
      } else {
        setTimeUntilReset(`${seconds}s`);
      }
    };

    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 1000);

    return () => clearInterval(interval);
  }, [rateLimitInfo?.reset]);

  /**
   * Calculate usage percentage
   */
  const getUsagePercentage = (): number => {
    if (!rateLimitInfo) return 0;
    const used = rateLimitInfo.limit - rateLimitInfo.remaining;
    return (used / rateLimitInfo.limit) * 100;
  };

  /**
   * Get variant styles
   */
  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          alert: 'border-red-200 bg-red-50',
          icon: 'text-red-600',
          text: 'text-red-900',
          badge: 'bg-red-100 text-red-800',
        };
      case 'info':
        return {
          alert: 'border-blue-200 bg-blue-50',
          icon: 'text-blue-600',
          text: 'text-blue-900',
          badge: 'bg-blue-100 text-blue-800',
        };
      default: // warning
        return {
          alert: 'border-yellow-200 bg-yellow-50',
          icon: 'text-yellow-600',
          text: 'text-yellow-900',
          badge: 'bg-yellow-100 text-yellow-800',
        };
    }
  };

  const styles = getVariantStyles();

  /**
   * Handle upgrade click
   */
  const handleUpgrade = () => {
    router.push('/register');
  };

  /**
   * If no rate limit info, show generic message
   */
  if (!rateLimitInfo) {
    return (
      <Alert className={`${styles.alert} ${className}`}>
        <AlertCircle className={`h-4 w-4 ${styles.icon}`} />
        <AlertDescription className={styles.text}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold mb-1">Rate Limit Reached</p>
              <p className="text-sm">
                You've reached the maximum number of free scans. Sign up for unlimited access.
              </p>
            </div>
            {showUpgrade && (
              <Button
                size="sm"
                onClick={handleUpgrade}
                className="ml-4 flex-shrink-0"
              >
                Sign Up Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  /**
   * Determine if rate limit is critical
   */
  const isCritical = rateLimitInfo.remaining === 0;
  const isLow = rateLimitInfo.remaining <= 2 && rateLimitInfo.remaining > 0;

  return (
    <Alert className={`${styles.alert} ${className}`}>
      <AlertCircle className={`h-4 w-4 ${styles.icon}`} />
      <AlertDescription className={styles.text}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold mb-1">
                {isCritical ? 'Rate Limit Reached' : 'Rate Limit Notice'}
              </p>
              <p className="text-sm">
                {isCritical
                  ? 'You have used all your free scans for this hour.'
                  : `You have ${rateLimitInfo.remaining} of ${rateLimitInfo.limit} free scans remaining.`}
              </p>
            </div>
            <Badge className={styles.badge}>
              {rateLimitInfo.remaining}/{rateLimitInfo.limit}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <Progress 
              value={getUsagePercentage()} 
              className="h-2"
            />
            <div className="flex items-center justify-between text-xs">
              <span>
                {rateLimitInfo.limit - rateLimitInfo.remaining} used
              </span>
              <span>
                {rateLimitInfo.remaining} remaining
              </span>
            </div>
          </div>

          {/* Reset Time */}
          {timeUntilReset && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>
                Resets in <strong>{timeUntilReset}</strong>
              </span>
            </div>
          )}

          {/* Upgrade CTA */}
          {showUpgrade && (
            <div className="pt-2 border-t border-current/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Get 100 scans/hour with a free account
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={handleUpgrade}
                  variant="default"
                >
                  Sign Up Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

/**
 * Parse rate limit headers from API response
 */
export const parseRateLimitHeaders = (headers: Headers): RateLimitInfo | null => {
  const limit = headers.get('X-RateLimit-Limit');
  const remaining = headers.get('X-RateLimit-Remaining');
  const reset = headers.get('X-RateLimit-Reset');

  if (!limit || !remaining || !reset) {
    return null;
  }

  return {
    limit: parseInt(limit, 10),
    remaining: parseInt(remaining, 10),
    reset: parseInt(reset, 10),
  };
};
