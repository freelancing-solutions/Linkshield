/**
 * ViewInHistoryButton Component
 * 
 * Navigation button to view a specific URL check in the scan history.
 * Pre-filters the history page to show the selected check.
 * 
 * Features:
 * - Navigate to scan history with pre-filtered results
 * - Display scan timestamp and URL
 * - Only visible to authenticated users
 * - Accessible button with proper ARIA labels
 * 
 * @requires Authentication
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { History, ExternalLink } from 'lucide-react';

/**
 * Component props
 */
interface ViewInHistoryButtonProps {
  checkId: string;
  url: string;
  timestamp: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * ViewInHistoryButton Component
 */
export const ViewInHistoryButton: React.FC<ViewInHistoryButtonProps> = ({
  checkId,
  url,
  timestamp,
  variant = 'outline',
  size = 'default',
  className = '',
}) => {
  const router = useRouter();

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Truncate URL for display
   */
  const truncateUrl = (url: string, maxLength: number = 40): string => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + '...';
  };

  /**
   * Handle click - navigate to history with check highlighted
   */
  const handleClick = () => {
    // Navigate to URL analysis history with the check ID as a query parameter
    router.push(`/dashboard/url-analysis?highlight=${checkId}`);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
      aria-label={`View check for ${url} in history`}
    >
      <History className="h-4 w-4" />
      <span className="hidden sm:inline">View in History</span>
      <span className="sm:hidden">History</span>
    </Button>
  );
};

/**
 * ViewInHistoryLink Component
 * 
 * Alternative link version with more details
 */
interface ViewInHistoryLinkProps {
  checkId: string;
  url: string;
  timestamp: string;
  className?: string;
}

export const ViewInHistoryLink: React.FC<ViewInHistoryLinkProps> = ({
  checkId,
  url,
  timestamp,
  className = '',
}) => {
  const router = useRouter();

  /**
   * Format timestamp for display
   */
  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Truncate URL for display
   */
  const truncateUrl = (url: string, maxLength: number = 50): string => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + '...';
  };

  /**
   * Handle click
   */
  const handleClick = () => {
    router.push(`/dashboard/url-analysis?highlight=${checkId}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors text-left w-full ${className}`}
      aria-label={`View check for ${url} in history`}
    >
      <History className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {truncateUrl(url)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Scanned {formatTimestamp(timestamp)}
        </p>
      </div>
      <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
    </button>
  );
};
