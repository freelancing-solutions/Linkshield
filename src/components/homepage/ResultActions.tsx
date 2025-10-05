/**
 * ResultActions Component
 * 
 * Action buttons for scan results (save, download, share).
 */

'use client';

import { useState } from 'react';
import { History, Download, Share2, Flag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ResultActionsProps {
  checkId: string;
  url: string;
  isAuthenticated?: boolean;
}

export const ResultActions: React.FC<ResultActionsProps> = ({
  checkId,
  url,
  isAuthenticated = false,
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleViewInHistory = () => {
    router.push(`/dashboard/url-analysis?highlight=${checkId}`);
  };

  const handleDownloadReport = () => {
    // TODO: Implement report download
    console.log('Download report for:', checkId);
  };

  const handleShareResults = async () => {
    const shareUrl = `${window.location.origin}/check/${checkId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleReportURL = () => {
    router.push(`/reports/new?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Actions
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* View in History - Authenticated only */}
        {isAuthenticated ? (
          <Button
            onClick={handleViewInHistory}
            variant="outline"
            className="w-full"
          >
            <History className="mr-2 h-4 w-4" />
            View in History
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <a href="/register">
              <History className="mr-2 h-4 w-4" />
              Save to History
            </a>
          </Button>
        )}

        {/* Download Report - Premium feature */}
        {isAuthenticated ? (
          <Button
            onClick={handleDownloadReport}
            variant="outline"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <a href="/pricing">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </a>
          </Button>
        )}

        {/* Share Results */}
        <Button
          onClick={handleShareResults}
          variant="outline"
          className="w-full"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-600" />
              Link Copied!
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </>
          )}
        </Button>

        {/* Report URL */}
        <Button
          onClick={handleReportURL}
          variant="outline"
          className="w-full"
        >
          <Flag className="mr-2 h-4 w-4" />
          Report URL
        </Button>
      </div>

      {/* Upgrade CTA for Anonymous Users */}
      {!isAuthenticated && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Sign up for free
            </a>
            {' '}to save checks to your history and access advanced features.
          </p>
        </div>
      )}
    </div>
  );
};
