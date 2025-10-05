/**
 * DomainReputationBadge Component
 * 
 * Displays domain reputation score and status with historical data.
 */

'use client';

import { Shield, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { useDomainReputation } from '@/hooks/homepage';
import { extractDomain } from '@/lib/validations/homepage';
import type { ReputationStatus } from '@/types/homepage';

interface DomainReputationBadgeProps {
  url: string;
  className?: string;
}

export const DomainReputationBadge: React.FC<DomainReputationBadgeProps> = ({
  url,
  className = '',
}) => {
  const domain = extractDomain(url);
  const { data: reputation, isLoading, isError } = useDomainReputation(domain || '', !!domain);

  // Don't render if no domain or error
  if (!domain || isError) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse ${className}`}>
        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    );
  }

  if (!reputation) {
    return null;
  }

  const getStatusConfig = (status: ReputationStatus) => {
    switch (status) {
      case 'TRUSTED':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900',
          textColor: 'text-green-700 dark:text-green-300',
          borderColor: 'border-green-300 dark:border-green-700',
          iconColor: 'text-green-600 dark:text-green-400',
          label: 'Trusted',
        };
      case 'NEUTRAL':
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900',
          textColor: 'text-blue-700 dark:text-blue-300',
          borderColor: 'border-blue-300 dark:border-blue-700',
          iconColor: 'text-blue-600 dark:text-blue-400',
          label: 'Neutral',
        };
      case 'SUSPICIOUS':
        return {
          bgColor: 'bg-yellow-100 dark:bg-yellow-900',
          textColor: 'text-yellow-700 dark:text-yellow-300',
          borderColor: 'border-yellow-300 dark:border-yellow-700',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          label: 'Suspicious',
        };
      case 'MALICIOUS':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900',
          textColor: 'text-red-700 dark:text-red-300',
          borderColor: 'border-red-300 dark:border-red-700',
          iconColor: 'text-red-600 dark:text-red-400',
          label: 'Malicious',
        };
    }
  };

  const config = getStatusConfig(reputation.status);

  return (
    <div className={`group relative inline-block ${className}`}>
      <div
        className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg border ${config.bgColor} ${config.borderColor}`}
      >
        <Shield className={`h-5 w-5 ${config.iconColor}`} />
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${config.textColor}`}>
              {config.label} Domain
            </span>
            <span className={`text-xs ${config.textColor} opacity-75`}>
              {reputation.reputation_score}/100
            </span>
          </div>
          
          {reputation.total_checks > 0 && (
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {reputation.total_checks} checks • {reputation.safe_percentage}% safe
            </span>
          )}
        </div>

        <Info className="h-4 w-4 text-gray-400" />
      </div>

      {/* Tooltip with detailed information */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 px-4 py-3 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <div className="space-y-2">
          <div>
            <p className="font-semibold mb-1">Domain: {reputation.domain}</p>
            <p className="text-gray-300">Reputation Score: {reputation.reputation_score}/100</p>
          </div>

          {reputation.total_checks > 0 && (
            <div className="pt-2 border-t border-gray-600">
              <p className="text-gray-300">
                Historical Data: {reputation.total_checks} total checks
              </p>
              <p className="text-gray-300">
                Safety Rate: {reputation.safe_percentage}%
              </p>
            </div>
          )}

          {reputation.factors && (
            <div className="pt-2 border-t border-gray-600">
              <p className="font-semibold mb-1">Factors:</p>
              {reputation.factors.age_days !== undefined && (
                <p className="text-gray-300">• Domain age: {reputation.factors.age_days} days</p>
              )}
              {reputation.factors.ssl_valid !== undefined && (
                <p className="text-gray-300">
                  • SSL: {reputation.factors.ssl_valid ? 'Valid' : 'Invalid'}
                </p>
              )}
              {reputation.factors.blacklist_count !== undefined && (
                <p className="text-gray-300">
                  • Blacklists: {reputation.factors.blacklist_count}
                </p>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-gray-600 text-gray-400">
            Last checked: {new Date(reputation.last_checked).toLocaleDateString()}
          </div>
        </div>

        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </div>
  );
};
