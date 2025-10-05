/**
 * @fileoverview Browser Detection Utility
 * 
 * Provides comprehensive browser detection capabilities for recommending
 * appropriate browser extensions. Detects browser type, version, and
 * platform to provide accurate installation guidance.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

/**
 * Supported browser types
 */
export type BrowserType = 
  | 'chrome' 
  | 'firefox' 
  | 'safari' 
  | 'edge' 
  | 'opera' 
  | 'brave'
  | 'unknown';

/**
 * Operating system types
 */
export type OperatingSystem = 
  | 'windows' 
  | 'macos' 
  | 'linux' 
  | 'android' 
  | 'ios' 
  | 'unknown';

/**
 * Browser detection result
 */
export interface BrowserInfo {
  /** Detected browser type */
  type: BrowserType;
  /** Browser name for display */
  name: string;
  /** Browser version */
  version: string;
  /** Operating system */
  os: OperatingSystem;
  /** Whether browser supports extensions */
  supportsExtensions: boolean;
  /** Whether browser is mobile */
  isMobile: boolean;
  /** User agent string */
  userAgent: string;
}

/**
 * Extension store information
 */
export interface ExtensionStore {
  /** Store name */
  name: string;
  /** Store URL */
  url: string;
  /** Installation method */
  installMethod: 'webstore' | 'addon' | 'manual' | 'sideload';
  /** Whether store is available for this browser */
  available: boolean;
}

/**
 * Browser configuration for extensions
 */
interface BrowserConfig {
  name: string;
  supportsExtensions: boolean;
  store?: ExtensionStore;
  minVersion?: string;
  installInstructions: string[];
}

/**
 * Browser configurations
 */
const BROWSER_CONFIGS: Record<BrowserType, BrowserConfig> = {
  chrome: {
    name: 'Google Chrome',
    supportsExtensions: true,
    store: {
      name: 'Chrome Web Store',
      url: 'https://chrome.google.com/webstore/detail/linkshield-social-protection/placeholder-id',
      installMethod: 'webstore',
      available: true
    },
    minVersion: '88.0',
    installInstructions: [
      'Click "Add to Chrome" on the Chrome Web Store page',
      'Confirm by clicking "Add extension" in the popup',
      'The LinkShield icon will appear in your browser toolbar',
      'Click the icon to configure your protection settings'
    ]
  },
  firefox: {
    name: 'Mozilla Firefox',
    supportsExtensions: true,
    store: {
      name: 'Firefox Add-ons',
      url: 'https://addons.mozilla.org/firefox/addon/linkshield-social-protection/',
      installMethod: 'addon',
      available: true
    },
    minVersion: '78.0',
    installInstructions: [
      'Click "Add to Firefox" on the Firefox Add-ons page',
      'Confirm by clicking "Add" in the installation dialog',
      'The LinkShield icon will appear in your browser toolbar',
      'Click the icon to configure your protection settings'
    ]
  },
  edge: {
    name: 'Microsoft Edge',
    supportsExtensions: true,
    store: {
      name: 'Edge Add-ons',
      url: 'https://microsoftedge.microsoft.com/addons/detail/linkshield-social-protection/placeholder-id',
      installMethod: 'webstore',
      available: true
    },
    minVersion: '88.0',
    installInstructions: [
      'Click "Get" on the Edge Add-ons page',
      'Confirm by clicking "Add extension" in the popup',
      'The LinkShield icon will appear in your browser toolbar',
      'Click the icon to configure your protection settings'
    ]
  },
  safari: {
    name: 'Safari',
    supportsExtensions: true,
    store: {
      name: 'Mac App Store',
      url: 'https://apps.apple.com/app/linkshield-social-protection/placeholder-id',
      installMethod: 'manual',
      available: true
    },
    minVersion: '14.0',
    installInstructions: [
      'Download LinkShield from the Mac App Store',
      'Open Safari and go to Preferences > Extensions',
      'Enable the LinkShield extension',
      'The LinkShield icon will appear in your browser toolbar'
    ]
  },
  opera: {
    name: 'Opera',
    supportsExtensions: true,
    store: {
      name: 'Chrome Web Store',
      url: 'https://chrome.google.com/webstore/detail/linkshield-social-protection/placeholder-id',
      installMethod: 'webstore',
      available: true
    },
    minVersion: '74.0',
    installInstructions: [
      'Install "Install Chrome Extensions" from Opera Add-ons (if not already installed)',
      'Visit the Chrome Web Store link',
      'Click "Add to Opera" (or "Add to Chrome")',
      'Confirm the installation in the popup dialog'
    ]
  },
  brave: {
    name: 'Brave Browser',
    supportsExtensions: true,
    store: {
      name: 'Chrome Web Store',
      url: 'https://chrome.google.com/webstore/detail/linkshield-social-protection/placeholder-id',
      installMethod: 'webstore',
      available: true
    },
    minVersion: '1.25',
    installInstructions: [
      'Click "Add to Chrome" on the Chrome Web Store page',
      'Confirm by clicking "Add extension" in the popup',
      'The LinkShield icon will appear in your browser toolbar',
      'Click the icon to configure your protection settings'
    ]
  },
  unknown: {
    name: 'Unknown Browser',
    supportsExtensions: false,
    installInstructions: [
      'Your browser is not currently supported',
      'Please use Chrome, Firefox, Edge, Safari, Opera, or Brave',
      'Contact support if you need assistance'
    ]
  }
};

/**
 * Detect browser type from user agent
 */
const detectBrowserType = (userAgent: string): BrowserType => {
  const ua = userAgent.toLowerCase();

  // Check for specific browsers in order of specificity
  if (ua.includes('brave')) return 'brave';
  if (ua.includes('edg/') || ua.includes('edge/')) return 'edge';
  if (ua.includes('opr/') || ua.includes('opera/')) return 'opera';
  if (ua.includes('chrome/') && !ua.includes('edg/')) return 'chrome';
  if (ua.includes('firefox/')) return 'firefox';
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'safari';

  return 'unknown';
};

/**
 * Extract browser version from user agent
 */
const extractBrowserVersion = (userAgent: string, browserType: BrowserType): string => {
  const ua = userAgent.toLowerCase();
  let versionRegex: RegExp;

  switch (browserType) {
    case 'chrome':
      versionRegex = /chrome\/([0-9.]+)/;
      break;
    case 'firefox':
      versionRegex = /firefox\/([0-9.]+)/;
      break;
    case 'safari':
      versionRegex = /version\/([0-9.]+)/;
      break;
    case 'edge':
      versionRegex = /edg\/([0-9.]+)/;
      break;
    case 'opera':
      versionRegex = /opr\/([0-9.]+)/;
      break;
    case 'brave':
      versionRegex = /chrome\/([0-9.]+)/; // Brave uses Chrome engine
      break;
    default:
      return 'unknown';
  }

  const match = ua.match(versionRegex);
  return match ? match[1] : 'unknown';
};

/**
 * Detect operating system from user agent
 */
const detectOperatingSystem = (userAgent: string): OperatingSystem => {
  const ua = userAgent.toLowerCase();

  if (ua.includes('windows')) return 'windows';
  if (ua.includes('mac os x') || ua.includes('macos')) return 'macos';
  if (ua.includes('linux')) return 'linux';
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';

  return 'unknown';
};

/**
 * Check if device is mobile
 */
const isMobileDevice = (userAgent: string): boolean => {
  const ua = userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
};

/**
 * Compare version strings
 */
const compareVersions = (version1: string, version2: string): number => {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);
  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }

  return 0;
};

/**
 * Check if browser version meets minimum requirements
 */
const meetsMinimumVersion = (currentVersion: string, minVersion?: string): boolean => {
  if (!minVersion || currentVersion === 'unknown') return true;
  return compareVersions(currentVersion, minVersion) >= 0;
};

/**
 * Main browser detection function
 */
export const detectBrowser = (): BrowserInfo => {
  // Handle server-side rendering
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      type: 'unknown',
      name: 'Unknown Browser',
      version: 'unknown',
      os: 'unknown',
      supportsExtensions: false,
      isMobile: false,
      userAgent: ''
    };
  }

  const userAgent = navigator.userAgent;
  const browserType = detectBrowserType(userAgent);
  const browserVersion = extractBrowserVersion(userAgent, browserType);
  const os = detectOperatingSystem(userAgent);
  const isMobile = isMobileDevice(userAgent);
  const config = BROWSER_CONFIGS[browserType];

  return {
    type: browserType,
    name: config.name,
    version: browserVersion,
    os,
    supportsExtensions: config.supportsExtensions && !isMobile,
    isMobile,
    userAgent
  };
};

/**
 * Get browser configuration
 */
export const getBrowserConfig = (browserType: BrowserType): BrowserConfig => {
  return BROWSER_CONFIGS[browserType];
};

/**
 * Get extension store information for a browser
 */
export const getExtensionStore = (browserType: BrowserType): ExtensionStore | null => {
  const config = BROWSER_CONFIGS[browserType];
  return config.store || null;
};

/**
 * Check if browser supports extensions
 */
export const supportsExtensions = (browserInfo: BrowserInfo): boolean => {
  const config = BROWSER_CONFIGS[browserInfo.type];
  const meetsVersion = meetsMinimumVersion(browserInfo.version, config.minVersion);
  return config.supportsExtensions && !browserInfo.isMobile && meetsVersion;
};

/**
 * Get installation instructions for a browser
 */
export const getInstallationInstructions = (browserType: BrowserType): string[] => {
  const config = BROWSER_CONFIGS[browserType];
  return config.installInstructions;
};

/**
 * Get recommended browser for current platform
 */
export const getRecommendedBrowser = (os: OperatingSystem): BrowserType => {
  switch (os) {
    case 'macos':
      return 'safari';
    case 'windows':
    case 'linux':
      return 'chrome';
    default:
      return 'chrome';
  }
};

/**
 * Get all supported browsers
 */
export const getSupportedBrowsers = (): BrowserType[] => {
  return Object.keys(BROWSER_CONFIGS).filter(
    browser => browser !== 'unknown' && BROWSER_CONFIGS[browser as BrowserType].supportsExtensions
  ) as BrowserType[];
};

/**
 * Format browser display name with version
 */
export const formatBrowserName = (browserInfo: BrowserInfo): string => {
  if (browserInfo.version === 'unknown') {
    return browserInfo.name;
  }
  return `${browserInfo.name} ${browserInfo.version}`;
};

/**
 * Check if current browser is supported
 */
export const isCurrentBrowserSupported = (): boolean => {
  const browserInfo = detectBrowser();
  return supportsExtensions(browserInfo);
};

/**
 * Get browser compatibility status
 */
export interface CompatibilityStatus {
  supported: boolean;
  reason?: string;
  recommendation?: string;
}

export const getBrowserCompatibility = (browserInfo: BrowserInfo): CompatibilityStatus => {
  const config = BROWSER_CONFIGS[browserInfo.type];

  if (browserInfo.type === 'unknown') {
    return {
      supported: false,
      reason: 'Browser not recognized',
      recommendation: 'Please use Chrome, Firefox, Edge, Safari, Opera, or Brave'
    };
  }

  if (browserInfo.isMobile) {
    return {
      supported: false,
      reason: 'Mobile browsers are not supported',
      recommendation: 'Please use a desktop browser for extension installation'
    };
  }

  if (!config.supportsExtensions) {
    return {
      supported: false,
      reason: 'Browser does not support extensions',
      recommendation: 'Please use a browser that supports extensions'
    };
  }

  if (!meetsMinimumVersion(browserInfo.version, config.minVersion)) {
    return {
      supported: false,
      reason: `Browser version ${browserInfo.version} is too old`,
      recommendation: `Please update to version ${config.minVersion} or later`
    };
  }

  return {
    supported: true
  };
};

export default {
  detectBrowser,
  getBrowserConfig,
  getExtensionStore,
  supportsExtensions,
  getInstallationInstructions,
  getRecommendedBrowser,
  getSupportedBrowsers,
  formatBrowserName,
  isCurrentBrowserSupported,
  getBrowserCompatibility
};