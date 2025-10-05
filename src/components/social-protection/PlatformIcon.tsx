/**
 * @fileoverview PlatformIcon Component
 * 
 * Shared component for displaying social media platform icons with consistent styling.
 * Supports all major social media platforms with proper color coding and sizing.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  MessageCircle, 
  Music, 
  Youtube,
  MessageSquare,
  Globe,
  Hash
} from 'lucide-react';
import { PlatformType } from '@/types/social-protection';
import { cn } from '@/lib/utils';

/**
 * Props for PlatformIcon component
 */
interface PlatformIconProps {
  /** Platform type */
  platform: PlatformType;
  /** Icon size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Custom className */
  className?: string;
  /** Whether to show background color */
  showBackground?: boolean;
  /** Whether to use white icon color (for colored backgrounds) */
  whiteIcon?: boolean;
}

/**
 * Platform icon mapping
 */
const PLATFORM_ICONS = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  tiktok: Music,
  youtube: Youtube,
  reddit: MessageSquare,
  discord: MessageCircle,
  telegram: MessageCircle,
  default: Globe
} as const;

/**
 * Platform color mapping
 */
const PLATFORM_COLORS = {
  twitter: 'bg-blue-500',
  facebook: 'bg-blue-600',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  linkedin: 'bg-blue-700',
  tiktok: 'bg-black',
  youtube: 'bg-red-600',
  reddit: 'bg-orange-500',
  discord: 'bg-indigo-600',
  telegram: 'bg-blue-400',
  default: 'bg-gray-500'
} as const;

/**
 * Size mapping for icons
 */
const SIZE_CLASSES = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8'
} as const;

/**
 * Size mapping for containers
 */
const CONTAINER_SIZE_CLASSES = {
  xs: 'p-1',
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
  xl: 'p-3'
} as const;

/**
 * Get platform icon component
 */
export const getPlatformIcon = (platform: PlatformType) => {
  return PLATFORM_ICONS[platform] || PLATFORM_ICONS.default;
};

/**
 * Get platform color class
 */
export const getPlatformColor = (platform: PlatformType): string => {
  return PLATFORM_COLORS[platform] || PLATFORM_COLORS.default;
};

/**
 * Get platform display name
 */
export const getPlatformName = (platform: PlatformType): string => {
  const names = {
    twitter: 'Twitter',
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    reddit: 'Reddit',
    discord: 'Discord',
    telegram: 'Telegram'
  };
  return names[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
};

/**
 * PlatformIcon Component
 * 
 * Displays a social media platform icon with consistent styling and optional background.
 * Supports all major platforms with proper color coding and multiple sizes.
 * 
 * Features:
 * - Consistent icon styling across platforms
 * - Multiple size options (xs, sm, md, lg, xl)
 * - Optional colored backgrounds
 * - White icon variant for colored backgrounds
 * - Fallback to generic globe icon for unknown platforms
 * - Responsive design support
 * 
 * @param props - Component props
 * @returns JSX element representing the platform icon
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <PlatformIcon platform="twitter" />
 * 
 * // With background and custom size
 * <PlatformIcon 
 *   platform="facebook" 
 *   size="lg" 
 *   showBackground 
 *   whiteIcon 
 * />
 * 
 * // Custom styling
 * <PlatformIcon 
 *   platform="instagram" 
 *   className="hover:scale-110 transition-transform" 
 * />
 * ```
 */
export const PlatformIcon: React.FC<PlatformIconProps> = ({
  platform,
  size = 'md',
  className,
  showBackground = false,
  whiteIcon = false
}) => {
  const IconComponent = getPlatformIcon(platform);
  const platformColor = getPlatformColor(platform);
  const iconSizeClass = SIZE_CLASSES[size];
  const containerSizeClass = CONTAINER_SIZE_CLASSES[size];

  if (showBackground) {
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center',
          platformColor,
          containerSizeClass,
          className
        )}
      >
        <IconComponent 
          className={cn(
            iconSizeClass,
            whiteIcon ? 'text-white' : 'text-current'
          )} 
        />
      </div>
    );
  }

  return (
    <IconComponent 
      className={cn(
        iconSizeClass,
        whiteIcon ? 'text-white' : 'text-current',
        className
      )} 
    />
  );
};

export default PlatformIcon;