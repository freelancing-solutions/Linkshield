/**
 * ScanTypeSelector Component
 * 
 * Radio button selector for scan types with descriptions and plan gating.
 */

'use client';

import { Lock, Zap, Shield, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ScanType } from '@/types/homepage';

interface ScanTypeOption {
  value: ScanType;
  label: string;
  description: string;
  estimatedTime: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
  requiresPro?: boolean;
}

const SCAN_TYPES: ScanTypeOption[] = [
  {
    value: 'SECURITY',
    label: 'Quick Scan',
    description: 'Basic security check against major threat databases',
    estimatedTime: '~3 seconds',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    value: 'SECURITY_REPUTATION_CONTENT',
    label: 'Comprehensive Scan',
    description: 'Security + domain reputation + content analysis',
    estimatedTime: '~8 seconds',
    icon: <Shield className="h-5 w-5" />,
    requiresAuth: true,
  },
  {
    value: 'DEEP',
    label: 'Deep Scan',
    description: 'Full analysis including broken links and detailed inspection',
    estimatedTime: '~15 seconds',
    icon: <Search className="h-5 w-5" />,
    requiresAuth: true,
    requiresPro: true,
  },
];

interface ScanTypeSelectorProps {
  value: ScanType;
  onChange: (value: ScanType) => void;
  isAuthenticated?: boolean;
  userPlan?: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  disabled?: boolean;
}

export const ScanTypeSelector: React.FC<ScanTypeSelectorProps> = ({
  value,
  onChange,
  isAuthenticated = false,
  userPlan = 'FREE',
  disabled = false,
}) => {
  const isPro = userPlan === 'PRO' || userPlan === 'ENTERPRISE';

  const isOptionDisabled = (option: ScanTypeOption): boolean => {
    if (disabled) return true;
    if (option.requiresAuth && !isAuthenticated) return true;
    if (option.requiresPro && !isPro) return true;
    return false;
  };

  const getOptionBadge = (option: ScanTypeOption): React.ReactNode => {
    if (option.requiresPro && !isPro) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium rounded">
          <Lock className="h-3 w-3" />
          Pro
        </span>
      );
    }
    if (option.requiresAuth && !isAuthenticated) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
          <Lock className="h-3 w-3" />
          Sign Up
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Scan Type</Label>
      
      <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
        {SCAN_TYPES.map((option) => {
          const optionDisabled = isOptionDisabled(option);
          
          return (
            <div
              key={option.value}
              className={`relative flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                optionDisabled
                  ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60 cursor-not-allowed'
                  : value === option.value
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer'
              }`}
            >
              <RadioGroupItem
                value={option.value}
                id={option.value}
                disabled={optionDisabled}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={option.value}
                  className={`flex items-center gap-2 font-medium cursor-pointer ${
                    optionDisabled ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <span className="text-blue-600 dark:text-blue-400">
                    {option.icon}
                  </span>
                  <span>{option.label}</span>
                  {getOptionBadge(option)}
                </Label>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {option.description}
                </p>
                
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {option.estimatedTime}
                </p>
              </div>

              {optionDisabled && (option.requiresAuth || option.requiresPro) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg">
                  <div className="text-center px-4">
                    <Lock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {option.requiresPro
                        ? 'Upgrade to Pro'
                        : 'Sign up to unlock'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </RadioGroup>

      {/* Upgrade CTA for locked features */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Sign up for free</strong> to unlock Comprehensive scans and save your history.
            Upgrade to Pro for Deep scans with broken link detection.
          </p>
        </div>
      )}
      
      {isAuthenticated && !isPro && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Upgrade to Pro</strong> to unlock Deep scans with comprehensive broken link detection 
            and detailed security analysis.
          </p>
        </div>
      )}
    </div>
  );
};
