/**
 * URL Validation Utilities for Social Protection
 * 
 * Comprehensive URL validation utilities specifically designed for social protection
 * features. Provides platform-specific validation, security checks, and normalization.
 * 
 * Features:
 * - Social media platform URL validation
 * - Security and safety checks
 * - URL normalization and sanitization
 * - Platform detection and extraction
 * - Batch URL validation
 * - Custom validation rules
 */

/**
 * Supported social media platforms
 */
export enum SocialPlatform {
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  TIKTOK = 'tiktok',
  YOUTUBE = 'youtube',
  REDDIT = 'reddit',
  SNAPCHAT = 'snapchat',
  PINTEREST = 'pinterest',
  DISCORD = 'discord',
}

/**
 * Platform-specific URL patterns and validation rules
 */
export interface PlatformConfig {
  name: string;
  displayName: string;
  domains: string[];
  patterns: RegExp[];
  maxLength: number;
  requiresAuth: boolean;
  supportedContentTypes: string[];
}

/**
 * Platform configurations for URL validation
 */
export const PLATFORM_CONFIGS: Record<SocialPlatform, PlatformConfig> = {
  [SocialPlatform.TWITTER]: {
    name: 'twitter',
    displayName: 'Twitter/X',
    domains: ['twitter.com', 'x.com', 'mobile.twitter.com', 'm.twitter.com'],
    patterns: [
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/\d+\/?$/,
    ],
    maxLength: 500,
    requiresAuth: false,
    supportedContentTypes: ['profile', 'tweet', 'thread'],
  },
  [SocialPlatform.FACEBOOK]: {
    name: 'facebook',
    displayName: 'Facebook',
    domains: ['facebook.com', 'fb.com', 'm.facebook.com', 'mobile.facebook.com'],
    patterns: [
      /^https?:\/\/(www\.)?(facebook\.com|fb\.com)\/[a-zA-Z0-9.]+\/?$/,
      /^https?:\/\/(www\.)?(facebook\.com|fb\.com)\/[a-zA-Z0-9.]+\/posts\/\d+\/?$/,
      /^https?:\/\/(www\.)?(facebook\.com|fb\.com)\/profile\.php\?id=\d+$/,
    ],
    maxLength: 500,
    requiresAuth: true,
    supportedContentTypes: ['profile', 'page', 'post'],
  },
  [SocialPlatform.INSTAGRAM]: {
    name: 'instagram',
    displayName: 'Instagram',
    domains: ['instagram.com', 'instagr.am'],
    patterns: [
      /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/,
      /^https?:\/\/(www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+\/?$/,
      /^https?:\/\/(www\.)?instagram\.com\/reel\/[a-zA-Z0-9_-]+\/?$/,
    ],
    maxLength: 500,
    requiresAuth: false,
    supportedContentTypes: ['profile', 'post', 'reel', 'story'],
  },
  [SocialPlatform.LINKEDIN]: {
    name: 'linkedin',
    displayName: 'LinkedIn',
    domains: ['linkedin.com'],
    patterns: [
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
      /^https?:\/\/(www\.)?linkedin\.com\/company\/[a-zA-Z0-9-]+\/?$/,
      /^https?:\/\/(www\.)?linkedin\.com\/posts\/[a-zA-Z0-9-_]+$/,
    ],
    maxLength: 500,
    requiresAuth: false,
    supportedContentTypes: ['profile', 'company', 'post'],
  },
  [SocialPlatform.TIKTOK]: {
    name: 'tiktok',
    displayName: 'TikTok',
    domains: ['tiktok.com', 'vm.tiktok.com'],
    patterns: [
      /^https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9_.]+\/?$/,
      /^https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9_.]+\/video\/\d+\/?$/,
      /^https?:\/\/vm\.tiktok\.com\/[a-zA-Z0-9]+\/?$/,
    ],
    maxLength: 500,
    requiresAuth: false,
    supportedContentTypes: ['profile', 'video'],
  },
  [SocialPlatform.YOUTUBE]: {
    name: 'youtube',
    displayName: 'YouTube',
    domains: ['youtube.com', 'youtu.be', 'm.youtube.com'],
    patterns: [
      /^https?:\/\/(www\.)?youtube\.com\/channel\/[a-zA-Z0-9_-]+\/?$/,
      /^https?:\/\/(www\.)?youtube\.com\/@[a-zA-Z0-9_-]+\/?$/,
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/,
      /^https?:\/\/youtu\.be\/[a-zA-Z0-9_-]+\/?$/,
    ],
    maxLength: 500,
    requiresAuth: false,
    supportedContentTypes: ['channel', 'video', 'playlist'],
  },
  [SocialPlatform.REDDIT]: {
    name: 'reddit',
    displayName: 'Reddit',
    domains: ['reddit.com', 'old.reddit.com', 'm.reddit.com'],
    patterns: [
      /^https?:\/\/(www\.|old\.|m\.)?reddit\.com\/user\/[a-zA-Z0-9_-]+\/?$/,
      /^https?:\/\/(www\.|old\.|m\.)?reddit\.com\/r\/[a-zA-Z0-9_]+\/?$/,
      /^https?:\/\/(www\.|old\.|m\.)?reddit\.com\/r\/[a-zA-Z0-9_]+\/comments\/[a-zA-Z0-9]+\/.*$/,
    ],
    maxLength: 500,
    requiresAuth: false,
    supportedContentTypes: ['user', 'subreddit', 'post'],
  },
  [SocialPlatform.SNAPCHAT]: {
    name: 'snapchat',
    displayName: 'Snapchat',
    domains: ['snapchat.com'],
    patterns: [
      /^https?:\/\/(www\.)?snapchat\.com\/add\/[a-zA-Z0-9_.]+\/?$/,
    ],
    maxLength: 500,
    requiresAuth: false,
    supportedContentTypes: ['profile'],
  },
  [SocialPlatform.PINTEREST]: {
    name: 'pinterest',
    displayName: 'Pinterest',
    domains: ['pinterest.com', 'pin.it'],
    patterns: [
      /^https?:\/\/(www\.)?pinterest\.com\/[a-zA-Z0-9_]+\/?$/,
      /^https?:\/\/(www\.)?pinterest\.com\/pin\/\d+\/?$/,
      /^https?:\/\/pin\.it\/[a-zA-Z0-9]+\/?$/,
    ],
    maxLength: 500,
    requiresAuth: false,
    supportedContentTypes: ['profile', 'pin', 'board'],
  },
  [SocialPlatform.DISCORD]: {
    name: 'discord',
    displayName: 'Discord',
    domains: ['discord.com', 'discord.gg'],
    patterns: [
      /^https?:\/\/discord\.gg\/[a-zA-Z0-9]+\/?$/,
      /^https?:\/\/(www\.)?discord\.com\/invite\/[a-zA-Z0-9]+\/?$/,
    ],
    maxLength: 500,
    requiresAuth: false,
    supportedContentTypes: ['server', 'invite'],
  },
};

/**
 * URL validation result
 */
export interface URLValidationResult {
  isValid: boolean;
  platform: SocialPlatform | null;
  platformConfig: PlatformConfig | null;
  contentType: string | null;
  normalizedUrl: string;
  errors: string[];
  warnings: string[];
  securityFlags: string[];
}

/**
 * Batch validation result
 */
export interface BatchValidationResult {
  totalUrls: number;
  validUrls: number;
  invalidUrls: number;
  results: URLValidationResult[];
  platformBreakdown: Record<string, number>;
}

/**
 * Security check flags
 */
export enum SecurityFlag {
  SUSPICIOUS_DOMAIN = 'suspicious_domain',
  SHORTENED_URL = 'shortened_url',
  UNUSUAL_PARAMETERS = 'unusual_parameters',
  POTENTIAL_PHISHING = 'potential_phishing',
  INSECURE_PROTOCOL = 'insecure_protocol',
}

/**
 * Known URL shorteners and suspicious patterns
 */
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'short.link', 'ow.ly', 'buff.ly',
  't.co', 'goo.gl', 'is.gd', 'tiny.cc', 'rebrand.ly'
];

const SUSPICIOUS_PATTERNS = [
  /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses
  /[a-z0-9]{20,}\.com/, // Long random domains
  /\.(tk|ml|ga|cf)$/, // Suspicious TLDs
];

/**
 * Validate basic URL format
 * 
 * @param url - URL string to validate
 * @returns Basic validation result
 */
export function isValidURL(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Detect social media platform from URL
 * 
 * @param url - URL to analyze
 * @returns Detected platform or null
 */
export function detectPlatform(url: string): SocialPlatform | null {
  if (!isValidURL(url)) return null;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
    
    for (const [platform, config] of Object.entries(PLATFORM_CONFIGS)) {
      if (config.domains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))) {
        return platform as SocialPlatform;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Normalize URL for consistent processing
 * 
 * @param url - URL to normalize
 * @returns Normalized URL
 */
export function normalizeURL(url: string): string {
  if (!isValidURL(url)) return url;
  
  try {
    const urlObj = new URL(url);
    
    // Remove tracking parameters
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'ref', 'source', 'campaign'
    ];
    
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // Normalize hostname
    urlObj.hostname = urlObj.hostname.toLowerCase();
    
    // Remove trailing slash for consistency
    if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Perform security checks on URL
 * 
 * @param url - URL to check
 * @returns Array of security flags
 */
export function performSecurityChecks(url: string): string[] {
  const flags: string[] = [];
  
  if (!isValidURL(url)) return flags;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check for insecure protocol
    if (urlObj.protocol === 'http:') {
      flags.push(SecurityFlag.INSECURE_PROTOCOL);
    }
    
    // Check for URL shorteners
    if (URL_SHORTENERS.some(shortener => hostname.includes(shortener))) {
      flags.push(SecurityFlag.SHORTENED_URL);
    }
    
    // Check for suspicious patterns
    if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(hostname))) {
      flags.push(SecurityFlag.SUSPICIOUS_DOMAIN);
    }
    
    // Check for unusual parameters
    const paramCount = Array.from(urlObj.searchParams.keys()).length;
    if (paramCount > 10) {
      flags.push(SecurityFlag.UNUSUAL_PARAMETERS);
    }
    
    // Check for potential phishing indicators
    const phishingIndicators = ['secure', 'verify', 'update', 'confirm', 'login'];
    if (phishingIndicators.some(indicator => hostname.includes(indicator))) {
      flags.push(SecurityFlag.POTENTIAL_PHISHING);
    }
    
  } catch {
    // URL parsing failed, already flagged as invalid
  }
  
  return flags;
}

/**
 * Validate social media URL comprehensively
 * 
 * @param url - URL to validate
 * @returns Comprehensive validation result
 */
export function validateSocialMediaURL(url: string): URLValidationResult {
  const result: URLValidationResult = {
    isValid: false,
    platform: null,
    platformConfig: null,
    contentType: null,
    normalizedUrl: url,
    errors: [],
    warnings: [],
    securityFlags: [],
  };
  
  // Basic URL validation
  if (!url || typeof url !== 'string') {
    result.errors.push('URL is required');
    return result;
  }
  
  if (url.length > 2048) {
    result.errors.push('URL is too long (maximum 2048 characters)');
    return result;
  }
  
  if (!isValidURL(url)) {
    result.errors.push('Invalid URL format');
    return result;
  }
  
  // Normalize URL
  result.normalizedUrl = normalizeURL(url);
  
  // Detect platform
  const platform = detectPlatform(result.normalizedUrl);
  if (!platform) {
    result.errors.push('Unsupported social media platform');
    return result;
  }
  
  result.platform = platform;
  result.platformConfig = PLATFORM_CONFIGS[platform];
  
  // Validate against platform patterns
  const config = result.platformConfig;
  const isPatternMatch = config.patterns.some(pattern => pattern.test(result.normalizedUrl));
  
  if (!isPatternMatch) {
    result.errors.push(`Invalid ${config.displayName} URL format`);
    return result;
  }
  
  // Check URL length against platform limits
  if (result.normalizedUrl.length > config.maxLength) {
    result.errors.push(`URL exceeds ${config.displayName} maximum length`);
    return result;
  }
  
  // Perform security checks
  result.securityFlags = performSecurityChecks(result.normalizedUrl);
  
  // Add warnings for security flags
  if (result.securityFlags.includes(SecurityFlag.INSECURE_PROTOCOL)) {
    result.warnings.push('URL uses insecure HTTP protocol');
  }
  
  if (result.securityFlags.includes(SecurityFlag.SHORTENED_URL)) {
    result.warnings.push('URL appears to be shortened, which may hide the actual destination');
  }
  
  if (result.securityFlags.includes(SecurityFlag.SUSPICIOUS_DOMAIN)) {
    result.warnings.push('Domain appears suspicious, please verify authenticity');
  }
  
  // Determine content type (basic detection)
  result.contentType = detectContentType(result.normalizedUrl, config);
  
  // Mark as valid if no errors
  result.isValid = result.errors.length === 0;
  
  return result;
}

/**
 * Detect content type from URL
 * 
 * @param url - Normalized URL
 * @param config - Platform configuration
 * @returns Detected content type
 */
function detectContentType(url: string, config: PlatformConfig): string | null {
  const urlLower = url.toLowerCase();
  
  // Platform-specific content type detection
  switch (config.name) {
    case 'twitter':
      if (urlLower.includes('/status/')) return 'tweet';
      return 'profile';
    
    case 'instagram':
      if (urlLower.includes('/p/')) return 'post';
      if (urlLower.includes('/reel/')) return 'reel';
      return 'profile';
    
    case 'youtube':
      if (urlLower.includes('/watch?v=') || urlLower.includes('youtu.be/')) return 'video';
      if (urlLower.includes('/channel/') || urlLower.includes('/@')) return 'channel';
      return 'channel';
    
    case 'linkedin':
      if (urlLower.includes('/company/')) return 'company';
      if (urlLower.includes('/posts/')) return 'post';
      return 'profile';
    
    case 'reddit':
      if (urlLower.includes('/user/')) return 'user';
      if (urlLower.includes('/r/') && urlLower.includes('/comments/')) return 'post';
      if (urlLower.includes('/r/')) return 'subreddit';
      return 'user';
    
    default:
      return 'profile';
  }
}

/**
 * Validate multiple URLs in batch
 * 
 * @param urls - Array of URLs to validate
 * @returns Batch validation result
 */
export function validateURLsBatch(urls: string[]): BatchValidationResult {
  const results = urls.map(url => validateSocialMediaURL(url));
  const validResults = results.filter(r => r.isValid);
  
  // Calculate platform breakdown
  const platformBreakdown: Record<string, number> = {};
  validResults.forEach(result => {
    if (result.platform) {
      const platformName = result.platformConfig?.displayName || result.platform;
      platformBreakdown[platformName] = (platformBreakdown[platformName] || 0) + 1;
    }
  });
  
  return {
    totalUrls: urls.length,
    validUrls: validResults.length,
    invalidUrls: urls.length - validResults.length,
    results,
    platformBreakdown,
  };
}

/**
 * Extract username/handle from social media URL
 * 
 * @param url - Social media URL
 * @returns Extracted username or null
 */
export function extractUsername(url: string): string | null {
  const validation = validateSocialMediaURL(url);
  if (!validation.isValid || !validation.platform) return null;
  
  try {
    const urlObj = new URL(validation.normalizedUrl);
    const pathname = urlObj.pathname;
    
    switch (validation.platform) {
      case SocialPlatform.TWITTER:
        const twitterMatch = pathname.match(/^\/([a-zA-Z0-9_]+)/);
        return twitterMatch ? twitterMatch[1] : null;
      
      case SocialPlatform.INSTAGRAM:
        const instagramMatch = pathname.match(/^\/([a-zA-Z0-9_.]+)/);
        return instagramMatch ? instagramMatch[1] : null;
      
      case SocialPlatform.LINKEDIN:
        const linkedinMatch = pathname.match(/^\/in\/([a-zA-Z0-9-]+)/);
        return linkedinMatch ? linkedinMatch[1] : null;
      
      case SocialPlatform.TIKTOK:
        const tiktokMatch = pathname.match(/^\/@([a-zA-Z0-9_.]+)/);
        return tiktokMatch ? tiktokMatch[1] : null;
      
      case SocialPlatform.YOUTUBE:
        const youtubeMatch = pathname.match(/^\/@([a-zA-Z0-9_-]+)/) || 
                            pathname.match(/^\/channel\/([a-zA-Z0-9_-]+)/);
        return youtubeMatch ? youtubeMatch[1] : null;
      
      default:
        return null;
    }
  } catch {
    return null;
  }
}

/**
 * Check if URL requires authentication to access
 * 
 * @param url - URL to check
 * @returns True if authentication is required
 */
export function requiresAuthentication(url: string): boolean {
  const validation = validateSocialMediaURL(url);
  return validation.platformConfig?.requiresAuth || false;
}

/**
 * Get supported content types for a platform
 * 
 * @param platform - Social media platform
 * @returns Array of supported content types
 */
export function getSupportedContentTypes(platform: SocialPlatform): string[] {
  return PLATFORM_CONFIGS[platform]?.supportedContentTypes || [];
}

/**
 * Format validation errors for user display
 * 
 * @param result - Validation result
 * @returns User-friendly error message
 */
export function formatValidationErrors(result: URLValidationResult): string {
  if (result.isValid) return '';
  
  if (result.errors.length === 1) {
    return result.errors[0];
  }
  
  return `Multiple issues found: ${result.errors.join(', ')}`;
}