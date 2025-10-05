/**
 * ExtensionStatusCard Component
 * 
 * Displays browser extension connection status and protection statistics.
 */

'use client';

import { Shield, CheckCircle, XCircle, Download, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExtensionStatus } from '@/hooks/homepage';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Link from 'next/link';

export const ExtensionStatusCard = () => {
  const { data: status, isLoading, isError } = useExtensionStatus();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <LoadingSpinner size="md" message="Loading extension status..." />
      </div>
    );
  }

  if (isError || !status) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Browser Extension
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Unable to check extension status
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isConnected = status.status === 'CONNECTED';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            isConnected
              ? 'bg-green-100 dark:bg-green-900'
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Shield className={`h-5 w-5 ${
              isConnected
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-400'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Browser Extension
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {isConnected ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Connected
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Not Connected
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {status.version && (
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            v{status.version}
          </span>
        )}
      </div>

      {/* Stats - Only show if connected */}
      {isConnected && status.protection_stats && (
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {status.protection_stats.blocked_today}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Blocked Today
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {status.protection_stats.warnings_today}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Warnings Today
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {status.protection_stats.total_blocked}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Total Blocked
            </p>
          </div>
        </div>
      )}

      {/* Last Activity */}
      {isConnected && status.last_activity && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <Clock className="h-3 w-3" />
          <span>
            Last activity: {new Date(status.last_activity).toLocaleString()}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {isConnected ? (
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/social-protection/analytics">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
        ) : (
          <Button asChild className="flex-1">
            <a href="/extension/download" target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Install Extension
            </a>
          </Button>
        )}
      </div>

      {/* Help Text */}
      {!isConnected && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          Install our browser extension to protect yourself from malicious links in real-time
        </p>
      )}
    </div>
  );
};
