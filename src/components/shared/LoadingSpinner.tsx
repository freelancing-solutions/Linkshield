/**
 * LoadingSpinner Component
 * 
 * Displays loading animation during API calls and long-running operations.
 * Supports multiple sizes and optional progress indicators.
 * 
 * Features:
 * - Multiple size variants (sm, md, lg, xl)
 * - Optional progress percentage
 * - Optional estimated time remaining
 * - Optional loading message
 * - Accessible with ARIA attributes
 */

'use client';

import { Loader2 } from 'lucide-react';

/**
 * Component props
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  progress?: number; // 0-100
  estimatedTime?: number; // seconds
  message?: string;
  className?: string;
}

/**
 * LoadingSpinner Component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  progress,
  estimatedTime,
  message,
  className = '',
}) => {
  /**
   * Get size classes
   */
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-12 w-12';
      case 'xl':
        return 'h-16 w-16';
      default: // md
        return 'h-8 w-8';
    }
  };

  /**
   * Format estimated time
   */
  const formatEstimatedTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 
      ? `${minutes}m ${remainingSeconds}s` 
      : `${minutes}m`;
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Spinner */}
      <Loader2 
        className={`animate-spin text-primary ${getSizeClasses()}`}
        aria-hidden="true"
      />

      {/* Progress Percentage */}
      {progress !== undefined && (
        <div className="mt-3 text-center">
          <p className="text-sm font-semibold text-gray-700">
            {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* Message */}
      {message && (
        <p className="mt-2 text-sm text-gray-600 text-center max-w-xs">
          {message}
        </p>
      )}

      {/* Estimated Time */}
      {estimatedTime !== undefined && estimatedTime > 0 && (
        <p className="mt-1 text-xs text-gray-500">
          About {formatEstimatedTime(estimatedTime)} remaining
        </p>
      )}

      {/* Screen reader text */}
      <span className="sr-only">
        {message || 'Loading...'}
        {progress !== undefined && ` ${Math.round(progress)}% complete`}
      </span>
    </div>
  );
};

/**
 * InlineLoadingSpinner Component
 * 
 * Smaller inline variant for buttons and inline text
 */
interface InlineLoadingSpinnerProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const InlineLoadingSpinner: React.FC<InlineLoadingSpinnerProps> = ({
  size = 'sm',
  className = '',
}) => {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <Loader2 
      className={`animate-spin ${sizeClass} ${className}`}
      aria-hidden="true"
    />
  );
};

/**
 * FullPageLoadingSpinner Component
 * 
 * Full-page loading overlay
 */
interface FullPageLoadingSpinnerProps {
  message?: string;
  progress?: number;
  estimatedTime?: number;
}

export const FullPageLoadingSpinner: React.FC<FullPageLoadingSpinnerProps> = ({
  message = 'Loading...',
  progress,
  estimatedTime,
}) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-4">
        <LoadingSpinner
          size="xl"
          message={message}
          progress={progress}
          estimatedTime={estimatedTime}
        />
      </div>
    </div>
  );
};

/**
 * LoadingDots Component
 * 
 * Alternative loading indicator with animated dots
 */
interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-1.5 w-1.5';
      case 'lg':
        return 'h-3 w-3';
      default: // md
        return 'h-2 w-2';
    }
  };

  const dotClass = `rounded-full bg-primary ${getSizeClasses()}`;

  return (
    <div className={`flex items-center gap-1 ${className}`} role="status" aria-label="Loading">
      <div className={`${dotClass} animate-bounce [animation-delay:-0.3s]`} />
      <div className={`${dotClass} animate-bounce [animation-delay:-0.15s]`} />
      <div className={`${dotClass} animate-bounce`} />
    </div>
  );
};

/**
 * LoadingBar Component
 * 
 * Horizontal progress bar
 */
interface LoadingBarProps {
  progress: number; // 0-100
  height?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  progress,
  height = 'md',
  showPercentage = false,
  className = '',
}) => {
  const getHeightClass = () => {
    switch (height) {
      case 'sm':
        return 'h-1';
      case 'lg':
        return 'h-4';
      default: // md
        return 'h-2';
    }
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={className}>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getHeightClass()}`}>
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-gray-600 text-center mt-1">
          {Math.round(clampedProgress)}%
        </p>
      )}
    </div>
  );
};
