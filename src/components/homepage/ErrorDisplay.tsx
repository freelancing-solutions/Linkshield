/**
 * ErrorDisplay Component
 * 
 * Displays error messages with appropriate styling and actions.
 * Handles different error types (network, validation, server).
 * 
 * Features:
 * - Multiple error variants
 * - Retry button for retryable errors
 * - Sign-up CTA for auth errors
 * - Upgrade CTA for subscription errors
 * - Detailed error information (optional)
 */

'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertCircle, 
  WifiOff, 
  Clock,
  Server,
  Lock,
  Zap,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { HomepageError } from '@/lib/utils/homepage-errors';

/**
 * Error type for icon selection
 */
type ErrorType = 'network' | 'timeout' | 'server' | 'validation' | 'auth' | 'upgrade' | 'general';

/**
 * Component props
 */
interface ErrorDisplayProps {
  error: HomepageError | Error | string;
  type?: ErrorType;
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
}

/**
 * ErrorDisplay Component
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  type = 'general',
  onRetry,
  showDetails = false,
  className = '',
}) => {
  const router = useRouter();
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  /**
   * Parse error object
   */
  const parseError = (): HomepageError => {
    if (typeof error === 'string') {
      return {
        code: 'UNKNOWN_ERROR',
        message: error,
        userMessage: error,
        retryable: false,
        requiresAuth: false,
        requiresUpgrade: false,
      };
    }

    if ('code' in error && 'userMessage' in error) {
      return error as HomepageError;
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: (error as Error).message || 'An unexpected error occurred',
      userMessage: (error as Error).message || 'An unexpected error occurred',
      retryable: false,
      requiresAuth: false,
      requiresUpgrade: false,
    };
  };

  const parsedError = parseError();

  /**
   * Get icon based on error type
   */
  const getIcon = () => {
    switch (type) {
      case 'network':
        return WifiOff;
      case 'timeout':
        return Clock;
      case 'server':
        return Server;
      case 'auth':
        return Lock;
      case 'upgrade':
        return Zap;
      default:
        return AlertCircle;
    }
  };

  const Icon = getIcon();

  /**
   * Get error title
   */
  const getTitle = (): string => {
    switch (type) {
      case 'network':
        return 'Network Error';
      case 'timeout':
        return 'Request Timeout';
      case 'server':
        return 'Server Error';
      case 'validation':
        return 'Validation Error';
      case 'auth':
        return 'Authentication Required';
      case 'upgrade':
        return 'Upgrade Required';
      default:
        return 'Error';
    }
  };

  /**
   * Handle sign up
   */
  const handleSignUp = () => {
    router.push('/register');
  };

  /**
   * Handle upgrade
   */
  const handleUpgrade = () => {
    router.push('/dashboard/subscriptions');
  };

  /**
   * Render action buttons
   */
  const renderActions = () => {
    const actions = [];

    // Retry button
    if (parsedError.retryable && onRetry) {
      actions.push(
        <Button
          key="retry"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      );
    }

    // Sign up button
    if (parsedError.requiresAuth) {
      actions.push(
        <Button
          key="signup"
          size="sm"
          onClick={handleSignUp}
          className="flex items-center gap-2"
        >
          Sign Up Free
          <ArrowRight className="h-4 w-4" />
        </Button>
      );
    }

    // Upgrade button
    if (parsedError.requiresUpgrade) {
      actions.push(
        <Button
          key="upgrade"
          size="sm"
          onClick={handleUpgrade}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Upgrade Plan
        </Button>
      );
    }

    return actions.length > 0 ? (
      <div className="flex items-center gap-2 mt-3">
        {actions}
      </div>
    ) : null;
  };

  return (
    <Alert variant="destructive" className={className}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{getTitle()}</AlertTitle>
      <AlertDescription>
        <div className="space-y-2">
          <p>{parsedError.userMessage}</p>
          
          {/* Action Buttons */}
          {renderActions()}

          {/* Error Details (Expandable) */}
          {showDetails && parsedError.details && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <button
                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                className="flex items-center gap-2 text-sm text-red-700 hover:text-red-900"
              >
                {isDetailsExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show Details
                  </>
                )}
              </button>
              
              {isDetailsExpanded && (
                <div className="mt-2 p-3 bg-red-50 rounded text-xs font-mono">
                  <pre className="whitespace-pre-wrap break-words">
                    {JSON.stringify(parsedError.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

/**
 * ErrorCard Component
 * 
 * Card variant for full-page errors
 */
interface ErrorCardProps {
  error: HomepageError | Error | string;
  type?: ErrorType;
  onRetry?: () => void;
  className?: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  error,
  type = 'general',
  onRetry,
  className = '',
}) => {
  const router = useRouter();

  /**
   * Parse error object
   */
  const parseError = (): HomepageError => {
    if (typeof error === 'string') {
      return {
        code: 'UNKNOWN_ERROR',
        message: error,
        userMessage: error,
        retryable: false,
        requiresAuth: false,
        requiresUpgrade: false,
      };
    }

    if ('code' in error && 'userMessage' in error) {
      return error as HomepageError;
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: (error as Error).message || 'An unexpected error occurred',
      userMessage: (error as Error).message || 'An unexpected error occurred',
      retryable: false,
      requiresAuth: false,
      requiresUpgrade: false,
    };
  };

  const parsedError = parseError();

  /**
   * Get icon based on error type
   */
  const getIcon = () => {
    switch (type) {
      case 'network':
        return WifiOff;
      case 'timeout':
        return Clock;
      case 'server':
        return Server;
      case 'auth':
        return Lock;
      case 'upgrade':
        return Zap;
      default:
        return AlertCircle;
    }
  };

  const Icon = getIcon();

  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-red-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md">
          {parsedError.userMessage}
        </p>

        <div className="flex items-center gap-3">
          {parsedError.retryable && onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}

          {parsedError.requiresAuth && (
            <Button
              onClick={() => router.push('/register')}
              className="flex items-center gap-2"
            >
              Sign Up Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {parsedError.requiresUpgrade && (
            <Button
              onClick={() => router.push('/dashboard/subscriptions')}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Upgrade Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
