/**
 * SocialProtectionPanel Component
 * 
 * Main panel for Social Protection features (authenticated users only).
 * Displays extension status, algorithm health, and social account scanning.
 */

'use client';

import { Shield, TrendingUp, Users } from 'lucide-react';
import { ExtensionStatusCard } from './ExtensionStatusCard';
import { AlgorithmHealthSummary } from './AlgorithmHealthSummary';

interface SocialProtectionPanelProps {
  className?: string;
}

export const SocialProtectionPanel: React.FC<SocialProtectionPanelProps> = ({
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Social Protection
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monitor your social media security and algorithm health
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Extension Status Card */}
        <ExtensionStatusCard />

        {/* Algorithm Health Summary */}
        <AlgorithmHealthSummary />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Social Account Protection
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Connect your social media accounts to monitor for shadowbans, algorithm penalties,
              and engagement issues across platforms.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                Connect Twitter
              </button>
              <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors">
                Connect Instagram
              </button>
              <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors">
                Connect Facebook
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                Connect LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
