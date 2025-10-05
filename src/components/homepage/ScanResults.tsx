/**
 * ScanResults Component
 * 
 * Main results display showing risk score, threat level, and provider details.
 */

'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { URLCheckResponse } from '@/types/homepage';
import { RiskScoreGauge } from './RiskScoreGauge';
import { ThreatLevelBadge } from './ThreatLevelBadge';
import { ProviderResultsAccordion } from './ProviderResultsAccordion';
import { BrokenLinksTab } from './BrokenLinksTab';
import { ResultActions } from './ResultActions';

interface ScanResultsProps {
  results: URLCheckResponse;
  isAuthenticated?: boolean;
}

export const ScanResults: React.FC<ScanResultsProps> = ({
  results,
  isAuthenticated = false,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const hasBrokenLinks = results.broken_links && results.broken_links.length > 0;

  return (
    <div className="space-y-6">
      {/* Header with URL */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Scanned URL
            </h3>
            <div className="flex items-center gap-2">
              <a
                href={results.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {results.url}
              </a>
              <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Scanned {new Date(results.checked_at).toLocaleString()} • 
              Completed in {(results.scan_duration_ms / 1000).toFixed(2)}s
            </p>
          </div>
          
          <ThreatLevelBadge level={results.threat_level} />
        </div>
      </div>

      {/* Risk Score and Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Gauge */}
        <div className="md:col-span-1">
          <RiskScoreGauge score={results.risk_score} />
        </div>

        {/* Quick Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${
                results.provider_results.filter(p => p.status === 'CLEAN').length === results.provider_results.length
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-yellow-100 dark:bg-yellow-900'
              }`}>
                <CheckCircle className={`h-6 w-6 ${
                  results.provider_results.filter(p => p.status === 'CLEAN').length === results.provider_results.length
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {results.provider_results.filter(p => p.status === 'CLEAN').length}/{results.provider_results.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Providers Clean
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${
                results.provider_results.filter(p => p.status === 'MALICIOUS').length > 0
                  ? 'bg-red-100 dark:bg-red-900'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <XCircle className={`h-6 w-6 ${
                  results.provider_results.filter(p => p.status === 'MALICIOUS').length > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-400'
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {results.provider_results.filter(p => p.status === 'MALICIOUS').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Threats Detected
                </p>
              </div>
            </div>
          </div>

          {hasBrokenLinks && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                  <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {results.broken_links.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Broken Links
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {results.scan_type}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scan Type
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Provider Results</TabsTrigger>
          {hasBrokenLinks && (
            <TabsTrigger value="broken-links">
              Broken Links ({results.broken_links.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ProviderResultsAccordion
            results={results.provider_results}
            isAuthenticated={isAuthenticated}
          />
        </TabsContent>

        {hasBrokenLinks && (
          <TabsContent value="broken-links" className="mt-6">
            <BrokenLinksTab links={results.broken_links} />
          </TabsContent>
        )}
      </Tabs>

      {/* Action Buttons */}
      <ResultActions
        checkId={results.check_id}
        url={results.url}
        isAuthenticated={isAuthenticated}
      />

      {/* Metadata if available */}
      {results.metadata && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Page Information
          </h4>
          <div className="space-y-2">
            {results.metadata.title && (
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Title:</span>
                <p className="text-sm text-gray-900 dark:text-white">{results.metadata.title}</p>
              </div>
            )}
            {results.metadata.description && (
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Description:</span>
                <p className="text-sm text-gray-900 dark:text-white">{results.metadata.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
