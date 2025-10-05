/**
 * ProviderResultsAccordion Component
 * 
 * Collapsible accordion showing detailed results from each security provider.
 */

'use client';

import { useState } from 'react';
import { ChevronDown, CheckCircle, XCircle, AlertTriangle, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProviderResult } from '@/types/homepage';

interface ProviderResultsAccordionProps {
  results: ProviderResult[];
  isAuthenticated?: boolean;
}

export const ProviderResultsAccordion: React.FC<ProviderResultsAccordionProps> = ({
  results,
  isAuthenticated = false,
}) => {
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());

  const toggleProvider = (provider: string) => {
    const newExpanded = new Set(expandedProviders);
    if (newExpanded.has(provider)) {
      newExpanded.delete(provider);
    } else {
      newExpanded.add(provider);
    }
    setExpandedProviders(newExpanded);
  };

  const getStatusIcon = (status: ProviderResult['status']) => {
    switch (status) {
      case 'CLEAN':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'MALICIOUS':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'SUSPICIOUS':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-gray-400 animate-spin" />;
      case 'ERROR':
        return <Info className="h-5 w-5 text-gray-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: ProviderResult['status']): string => {
    switch (status) {
      case 'CLEAN':
        return 'Clean';
      case 'MALICIOUS':
        return 'Malicious';
      case 'SUSPICIOUS':
        return 'Suspicious';
      case 'PENDING':
        return 'Checking...';
      case 'ERROR':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: ProviderResult['status']): string => {
    switch (status) {
      case 'CLEAN':
        return 'text-green-700 dark:text-green-300';
      case 'MALICIOUS':
        return 'text-red-700 dark:text-red-300';
      case 'SUSPICIOUS':
        return 'text-yellow-700 dark:text-yellow-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  // Show limited results for anonymous users
  const displayResults = isAuthenticated ? results : results.slice(0, 2);
  const hasMoreResults = !isAuthenticated && results.length > 2;

  return (
    <div className="space-y-3">
      {displayResults.map((result) => {
        const isExpanded = expandedProviders.has(result.provider);

        return (
          <div
            key={result.provider}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Provider Header */}
            <button
              onClick={() => toggleProvider(result.provider)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={isExpanded}
              aria-controls={`provider-${result.provider}`}
            >
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(result.status)}
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {result.provider}
                  </h4>
                  <p className={`text-sm ${getStatusColor(result.status)}`}>
                    {getStatusLabel(result.status)}
                    {result.confidence_score !== undefined && (
                      <span className="ml-2 text-gray-500 dark:text-gray-400">
                        • {result.confidence_score}% confidence
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  isExpanded ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {/* Provider Details */}
            {isExpanded && (
              <div
                id={`provider-${result.provider}`}
                className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="pt-4 space-y-3">
                  {/* Details */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Details:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {result.details || 'No additional details available'}
                    </p>
                  </div>

                  {/* Error Message if present */}
                  {result.error_message && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        <strong>Error:</strong> {result.error_message}
                      </p>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>
                      Checked {new Date(result.checked_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Sign Up CTA for Anonymous Users */}
      {hasMoreResults && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            <strong>Sign up for free</strong> to see results from {results.length - 2} more security providers
            and get detailed analysis reports.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <a href="/register">Sign Up Free</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/login">Log In</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
