/**
 * @fileoverview Scanner Input Component
 * 
 * Provides URL input interface for social media scanning with real-time validation,
 * platform detection, format suggestions, and accessibility features. Supports
 * multiple social media platforms with intelligent URL parsing and error handling.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Loader2,
  Globe,
  Copy,
  Trash2
} from 'lucide-react';
import { getPlatformIcon, getPlatformColor } from '@/lib/utils/social-protection';
import { cn } from '@/lib/utils';

interface ScannerInputProps {
  /** Current URL value */
  url: string;
  /** URL change handler */
  onUrlChange: (url: string) => void;
  /** Scan initiation handler */
  onScan: () => void;
  /** Whether scanning is in progress */
  isScanning?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to show recent URLs */
  showRecent?: boolean;
  /** Recent URLs list */
  recentUrls?: string[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Supported social media platforms with URL patterns
 */
const PLATFORM_PATTERNS = [
  {
    name: 'twitter',
    displayName: 'Twitter/X',
    patterns: [
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+/i,
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/i
    ],
    examples: ['https://twitter.com/username', 'https://x.com/username/status/123456789']
  },
  {
    name: 'facebook',
    displayName: 'Facebook',
    patterns: [
      /^https?:\/\/(www\.)?facebook\.com\/\w+/i,
      /^https?:\/\/(www\.)?facebook\.com\/\w+\/posts\/\d+/i,
      /^https?:\/\/(www\.)?fb\.com\/\w+/i
    ],
    examples: ['https://facebook.com/username', 'https://facebook.com/username/posts/123456789']
  },
  {
    name: 'instagram',
    displayName: 'Instagram',
    patterns: [
      /^https?:\/\/(www\.)?instagram\.com\/\w+/i,
      /^https?:\/\/(www\.)?instagram\.com\/p\/[\w-]+/i,
      /^https?:\/\/(www\.)?instagram\.com\/reel\/[\w-]+/i
    ],
    examples: ['https://instagram.com/username', 'https://instagram.com/p/ABC123DEF456']
  },
  {
    name: 'tiktok',
    displayName: 'TikTok',
    patterns: [
      /^https?:\/\/(www\.)?tiktok\.com\/@\w+/i,
      /^https?:\/\/(www\.)?tiktok\.com\/@\w+\/video\/\d+/i,
      /^https?:\/\/vm\.tiktok\.com\/[\w-]+/i
    ],
    examples: ['https://tiktok.com/@username', 'https://tiktok.com/@username/video/123456789']
  },
  {
    name: 'linkedin',
    displayName: 'LinkedIn',
    patterns: [
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+/i,
      /^https?:\/\/(www\.)?linkedin\.com\/company\/[\w-]+/i,
      /^https?:\/\/(www\.)?linkedin\.com\/posts\/[\w-]+/i
    ],
    examples: ['https://linkedin.com/in/username', 'https://linkedin.com/company/company-name']
  },
  {
    name: 'youtube',
    displayName: 'YouTube',
    patterns: [
      /^https?:\/\/(www\.)?youtube\.com\/c\/[\w-]+/i,
      /^https?:\/\/(www\.)?youtube\.com\/@[\w-]+/i,
      /^https?:\/\/(www\.)?youtube\.com\/channel\/[\w-]+/i,
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/i
    ],
    examples: ['https://youtube.com/@username', 'https://youtube.com/watch?v=ABC123DEF456']
  },
  {
    name: 'reddit',
    displayName: 'Reddit',
    patterns: [
      /^https?:\/\/(www\.)?reddit\.com\/user\/\w+/i,
      /^https?:\/\/(www\.)?reddit\.com\/r\/\w+\/comments\/[\w-]+/i,
      /^https?:\/\/(www\.)?reddit\.com\/r\/\w+/i
    ],
    examples: ['https://reddit.com/user/username', 'https://reddit.com/r/subreddit']
  }
];

/**
 * Detect platform from URL
 */
const detectPlatform = (url: string): string | null => {
  for (const platform of PLATFORM_PATTERNS) {
    if (platform.patterns.some(pattern => pattern.test(url))) {
      return platform.name;
    }
  }
  return null;
};

/**
 * Validate URL format
 */
const validateUrl = (url: string): { isValid: boolean; platform: string | null; error?: string } => {
  if (!url.trim()) {
    return { isValid: false, platform: null, error: 'URL is required' };
  }

  // Check if it's a valid URL
  try {
    new URL(url);
  } catch {
    return { isValid: false, platform: null, error: 'Please enter a valid URL' };
  }

  // Check if it matches supported platforms
  const platform = detectPlatform(url);
  if (!platform) {
    return { 
      isValid: false, 
      platform: null, 
      error: 'URL must be from a supported platform (Twitter, Facebook, Instagram, TikTok, LinkedIn, YouTube, Reddit)' 
    };
  }

  return { isValid: true, platform };
};

/**
 * Format URL suggestions
 */
const getUrlSuggestions = (input: string): string[] => {
  if (!input || input.length < 3) return [];

  const suggestions: string[] = [];
  
  // If input doesn't start with http, suggest adding it
  if (!input.startsWith('http')) {
    if (input.includes('twitter.com') || input.includes('x.com')) {
      suggestions.push(`https://${input}`);
    } else if (input.includes('facebook.com')) {
      suggestions.push(`https://${input}`);
    } else if (input.includes('instagram.com')) {
      suggestions.push(`https://${input}`);
    }
  }

  return suggestions.slice(0, 3); // Limit to 3 suggestions
};

/**
 * ScannerInput Component
 * 
 * URL input interface for social media scanning with intelligent validation,
 * platform detection, and user-friendly error handling. Provides real-time
 * feedback, format suggestions, and accessibility features.
 * 
 * Features:
 * - Real-time URL validation and platform detection
 * - Format suggestions and auto-completion
 * - Platform-specific visual indicators
 * - Recent URLs history (optional)
 * - Copy/paste functionality
 * - Keyboard shortcuts and accessibility
 * - Error handling with helpful messages
 * - Responsive design with mobile optimization
 * - Loading states and visual feedback
 * 
 * @param props - Component props
 * @returns JSX element representing the scanner input
 * 
 * Requirements: 7.2, 7.3 - URL input validation and platform support
 */
export const ScannerInput: React.FC<ScannerInputProps> = ({
  url,
  onUrlChange,
  onScan,
  isScanning = false,
  error,
  placeholder = "Enter social media profile or post URL",
  showRecent = false,
  recentUrls = [],
  className
}) => {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [validation, setValidation] = useState<{ isValid: boolean; platform: string | null; error?: string }>({
    isValid: false,
    platform: null
  });

  // Update validation when URL changes
  useEffect(() => {
    if (url) {
      const result = validateUrl(url);
      setValidation(result);
      setSuggestions(getUrlSuggestions(url));
    } else {
      setValidation({ isValid: false, platform: null });
      setSuggestions([]);
    }
  }, [url]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUrlChange(e.target.value);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && validation.isValid && !isScanning) {
      onScan();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    onUrlChange(suggestion);
    setSuggestions([]);
  };

  // Handle recent URL click
  const handleRecentUrlClick = (recentUrl: string) => {
    onUrlChange(recentUrl);
  };

  // Handle clear input
  const handleClear = () => {
    onUrlChange('');
    setSuggestions([]);
  };

  // Handle paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onUrlChange(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  // Get platform icon and color
  const PlatformIcon = validation.platform ? getPlatformIcon(validation.platform) : Globe;
  const platformColor = validation.platform ? getPlatformColor(validation.platform) : 'bg-gray-500';

  return (
    <div className={cn('space-y-3', className)}>
      {/* Main Input */}
      <div className="relative">
        <div className={cn(
          'relative flex items-center gap-2 p-3 border rounded-lg transition-colors',
          focused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300',
          error ? 'border-red-500' : '',
          validation.isValid ? 'border-green-500' : ''
        )}>
          {/* Platform Icon */}
          <div className={cn('p-2 rounded', platformColor)}>
            <PlatformIcon className="h-4 w-4 text-white" />
          </div>

          {/* Input Field */}
          <Input
            type="url"
            value={url}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="flex-1 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isScanning}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={isScanning}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              disabled={isScanning}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>

            <Button
              onClick={onScan}
              disabled={!validation.isValid || isScanning}
              className="ml-2"
            >
              {isScanning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {isScanning ? 'Scanning...' : 'Scan'}
            </Button>
          </div>
        </div>

        {/* Validation Status */}
        {url && (
          <div className="flex items-center gap-2 mt-2">
            {validation.isValid ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">
                  Valid {validation.platform && PLATFORM_PATTERNS.find(p => p.name === validation.platform)?.displayName} URL
                </span>
                {validation.platform && (
                  <Badge variant="outline" className="text-xs">
                    {PLATFORM_PATTERNS.find(p => p.name === validation.platform)?.displayName}
                  </Badge>
                )}
              </>
            ) : validation.error ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{validation.error}</span>
              </>
            ) : null}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* URL Suggestions */}
      {suggestions.length > 0 && focused && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1">
          <div className="text-xs font-medium text-gray-500 px-2 py-1">Suggestions</div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
            >
              <ExternalLink className="h-3 w-3 text-gray-400" />
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Recent URLs */}
      {showRecent && recentUrls.length > 0 && !url && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Recent Scans</div>
          <div className="grid grid-cols-1 gap-2">
            {recentUrls.slice(0, 3).map((recentUrl, index) => {
              const recentPlatform = detectPlatform(recentUrl);
              const RecentIcon = recentPlatform ? getPlatformIcon(recentPlatform) : Globe;
              const recentColor = recentPlatform ? getPlatformColor(recentPlatform) : 'bg-gray-500';
              
              return (
                <button
                  key={index}
                  onClick={() => handleRecentUrlClick(recentUrl)}
                  className="flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className={cn('p-1 rounded', recentColor)}>
                    <RecentIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 truncate flex-1">{recentUrl}</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Platform Examples */}
      {!url && (
        <div className="text-xs text-gray-500 space-y-1">
          <div className="font-medium">Supported platforms:</div>
          <div className="grid grid-cols-2 gap-1">
            {PLATFORM_PATTERNS.slice(0, 6).map((platform) => (
              <div key={platform.name} className="flex items-center gap-1">
                <div className={cn('p-0.5 rounded', getPlatformColor(platform.name))}>
                  {(() => {
                    const Icon = getPlatformIcon(platform.name);
                    return <Icon className="h-2 w-2 text-white" />;
                  })()}
                </div>
                <span>{platform.displayName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerInput;