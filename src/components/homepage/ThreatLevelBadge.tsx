/**
 * ThreatLevelBadge Component
 * 
 * Badge displaying threat level with appropriate colors and icons.
 */

'use client';

import { Shield, AlertTriangle, XCircle } from 'lucide-react';
import type { ThreatLevel } from '@/types/homepage';

interface ThreatLevelBadgeProps {
  level: ThreatLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ThreatLevelBadge: React.FC<ThreatLevelBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
}) => {
  const config = {
    SAFE: {
      label: 'Safe',
      icon: Shield,
      bgColor: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-300 dark:border-green-700',
      iconColor: 'text-green-600 dark:text-green-400',
      description: 'No threats detected',
    },
    SUSPICIOUS: {
      label: 'Suspicious',
      icon: AlertTriangle,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      borderColor: 'border-yellow-300 dark:border-yellow-700',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      description: 'Potential security concerns detected',
    },
    MALICIOUS: {
      label: 'Dangerous',
      icon: XCircle,
      bgColor: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-300 dark:border-red-700',
      iconColor: 'text-red-600 dark:text-red-400',
      description: 'Malicious content detected - Do not visit',
    },
  };

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'h-3 w-3',
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'h-4 w-4',
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'h-5 w-5',
    },
  };

  const { label, icon: Icon, bgColor, textColor, borderColor, iconColor, description } = config[level];
  const { container, icon: iconSize } = sizeClasses[size];

  return (
    <div className="group relative inline-block">
      <div
        className={`inline-flex items-center gap-2 rounded-full border font-semibold ${container} ${bgColor} ${textColor} ${borderColor}`}
        role="status"
        aria-label={`Threat level: ${label}`}
      >
        {showIcon && <Icon className={`${iconSize} ${iconColor}`} />}
        <span>{label}</span>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
        {description}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </div>
  );
};
