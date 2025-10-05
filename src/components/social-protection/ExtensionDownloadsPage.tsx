/**
 * @fileoverview Extension Downloads Page Component
 * 
 * Provides a comprehensive browser extension download page with automatic
 * browser detection, installation guidance, and feature showcase.
 * Supports multiple browsers with tailored installation instructions.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  Download,
  ExternalLink,
  CheckCircle,
  Star,
  Zap,
  Eye,
  Globe,
  Activity,
  Users,
  Clock,
  Smartphone,
  Monitor,
  AlertTriangle,
  Info,
  Chrome,
  Firefox,
  Safari,
  Edge,
  Opera,
  Brave
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  detectBrowser, 
  getBrowserConfig, 
  getExtensionStore, 
  supportsExtensions,
  getInstallationInstructions,
  getSupportedBrowsers,
  getBrowserCompatibility,
  formatBrowserName,
  type BrowserType,
  type BrowserInfo
} from '@/utils/BrowserDetector';

interface ExtensionDownloadsPageProps {
  /** Whether user is authenticated */
  isAuthenticated?: boolean;
  /** Callback for viewing extension status */
  onViewStatus?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Browser icons mapping
 */
const BROWSER_ICONS: Record<BrowserType, React.ComponentType<any>> = {
  chrome: Chrome,
  firefox: Firefox,
  safari: Safari,
  edge: Edge,
  opera: Opera,
  brave: Brave,
  unknown: Globe
};

/**
 * Extension features
 */
const EXTENSION_FEATURES = [
  {
    icon: Shield,
    title: 'Real-time Scanning',
    description: 'Automatically scans social media content as you browse',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Zap,
    title: 'Threat Blocking',
    description: 'Blocks malicious links and suspicious content instantly',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    icon: Eye,
    title: 'Content Analysis',
    description: 'Analyzes posts, profiles, and media for potential risks',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: Activity,
    title: 'Platform Monitoring',
    description: 'Monitors multiple social media platforms simultaneously',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
];

/**
 * System requirements
 */
const SYSTEM_REQUIREMENTS = {
  chrome: { minVersion: '88.0', ram: '4GB', storage: '50MB' },
  firefox: { minVersion: '78.0', ram: '4GB', storage: '50MB' },
  edge: { minVersion: '88.0', ram: '4GB', storage: '50MB' },
  safari: { minVersion: '14.0', ram: '4GB', storage: '50MB' },
  opera: { minVersion: '74.0', ram: '4GB', storage: '50MB' },
  brave: { minVersion: '1.25', ram: '4GB', storage: '50MB' },
  unknown: { minVersion: 'N/A', ram: '4GB', storage: '50MB' }
};

/**
 * Extension Card Component
 */
const ExtensionCard: React.FC<{
  browserType: BrowserType;
  browserInfo: BrowserInfo;
  isRecommended: boolean;
  isCurrentBrowser: boolean;
}> = ({ browserType, browserInfo, isRecommended, isCurrentBrowser }) => {
  const config = getBrowserConfig(browserType);
  const store = getExtensionStore(browserType);
  const compatibility = getBrowserCompatibility(browserInfo);
  const Icon = BROWSER_ICONS[browserType];
  const requirements = SYSTEM_REQUIREMENTS[browserType];

  const handleInstall = () => {
    if (store && store.available) {
      window.open(store.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className={cn(
      'relative transition-all duration-200 hover:shadow-lg',
      isRecommended && 'ring-2 ring-blue-500 ring-opacity-50',
      !compatibility.supported && 'opacity-60'
    )}>
      {isRecommended && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-blue-600 text-white">
            <Star className="h-3 w-3 mr-1" />
            Recommended
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="p-4 rounded-full bg-gray-100">
            <Icon className="h-8 w-8 text-gray-700" />
          </div>
        </div>
        <CardTitle className="text-lg">{config.name}</CardTitle>
        {isCurrentBrowser && (
          <Badge variant="outline" className="mx-auto">
            Your Browser
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Compatibility Status */}
        {compatibility.supported ? (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Compatible</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Not Compatible</span>
            </div>
            <p className="text-xs text-gray-600">{compatibility.reason}</p>
            {compatibility.recommendation && (
              <p className="text-xs text-blue-600">{compatibility.recommendation}</p>
            )}
          </div>
        )}

        {/* System Requirements */}
        <div className="space-y-2">
          <h5 className="font-medium text-sm text-gray-900">Requirements</h5>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Version: {requirements.minVersion}+</div>
            <div>RAM: {requirements.ram}</div>
            <div>Storage: {requirements.storage}</div>
          </div>
        </div>

        {/* Store Information */}
        {store && (
          <div className="space-y-2">
            <h5 className="font-medium text-sm text-gray-900">Available on</h5>
            <p className="text-xs text-gray-600">{store.name}</p>
          </div>
        )}

        {/* Install Button */}
        <Button
          onClick={handleInstall}
          disabled={!compatibility.supported || !store?.available}
          className="w-full"
          variant={isRecommended ? 'default' : 'outline'}
        >
          {store?.available ? (
            <>
              <Download className="h-4 w-4 mr-2" />
              Install for {config.name}
            </>
          ) : (
            <>
              <Info className="h-4 w-4 mr-2" />
              Coming Soon
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

/**
 * Installation Guide Component
 */
const InstallationGuide: React.FC<{ browserType: BrowserType }> = ({ browserType }) => {
  const instructions = getInstallationInstructions(browserType);
  const config = getBrowserConfig(browserType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Installation Guide - {config.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {instructions.map((instruction, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{instruction}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

/**
 * Features Showcase Component
 */
const FeaturesShowcase: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Extension Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXTENSION_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <div className={cn('p-2 rounded-full', feature.bgColor)}>
                  <Icon className={cn('h-4 w-4', feature.color)} />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-900">{feature.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Browser Detection Display Component
 */
const BrowserDetectionDisplay: React.FC<{ browserInfo: BrowserInfo }> = ({ browserInfo }) => {
  const compatibility = getBrowserCompatibility(browserInfo);
  const Icon = BROWSER_ICONS[browserInfo.type];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-gray-700" />
            <div>
              <h3 className="font-medium text-gray-900">
                {formatBrowserName(browserInfo)}
              </h3>
              <p className="text-sm text-gray-600">
                {browserInfo.os} • {browserInfo.isMobile ? 'Mobile' : 'Desktop'}
              </p>
            </div>
          </div>
          <div className="text-right">
            {compatibility.supported ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Supported
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-200">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Not Supported
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * ExtensionDownloadsPage Component
 * 
 * Comprehensive browser extension download page with automatic browser detection,
 * installation guidance, and feature showcase. Provides tailored recommendations
 * based on user's current browser and platform.
 * 
 * Features:
 * - Automatic browser detection and recommendations
 * - Support for Chrome, Firefox, Edge, Safari, Opera, and Brave
 * - Installation instructions with step-by-step guides
 * - System requirements and compatibility checking
 * - Extension features showcase
 * - Mobile device detection and appropriate messaging
 * - Responsive design with mobile optimization
 * - Accessibility features and screen reader support
 * - Integration with extension stores and download links
 * - Real-time compatibility status updates
 * 
 * @param props - Component props
 * @returns JSX element representing the extension downloads page
 * 
 * Requirements: 8 - Extension Downloads Page with browser detection
 */
export const ExtensionDownloadsPage: React.FC<ExtensionDownloadsPageProps> = ({
  isAuthenticated = false,
  onViewStatus,
  className
}) => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [selectedBrowser, setSelectedBrowser] = useState<BrowserType>('chrome');

  // Detect browser on component mount
  useEffect(() => {
    const detected = detectBrowser();
    setBrowserInfo(detected);
    
    // Set selected browser to detected browser if supported
    if (detected.type !== 'unknown' && supportsExtensions(detected)) {
      setSelectedBrowser(detected.type);
    }
  }, []);

  const supportedBrowsers = getSupportedBrowsers();

  if (!browserInfo) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Detecting your browser...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('max-w-6xl mx-auto space-y-8', className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Browser Extensions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get real-time social media protection directly in your browser. 
          Automatically scan content, block threats, and stay safe online.
        </p>
        
        {isAuthenticated && onViewStatus && (
          <Button onClick={onViewStatus} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            View Extension Status
          </Button>
        )}
      </div>

      {/* Browser Detection */}
      <BrowserDetectionDisplay browserInfo={browserInfo} />

      {/* Mobile Warning */}
      {browserInfo.isMobile && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Smartphone className="h-6 w-6 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900">Mobile Device Detected</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Browser extensions are not available on mobile devices. 
                  Please visit this page on a desktop computer to install the LinkShield extension.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportedBrowsers.map((browserType) => (
          <ExtensionCard
            key={browserType}
            browserType={browserType}
            browserInfo={browserInfo}
            isRecommended={browserType === browserInfo.type}
            isCurrentBrowser={browserType === browserInfo.type}
          />
        ))}
      </div>

      {/* Detailed Information Tabs */}
      <Tabs value={selectedBrowser} onValueChange={(value) => setSelectedBrowser(value as BrowserType)}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {supportedBrowsers.map((browserType) => {
            const config = getBrowserConfig(browserType);
            const Icon = BROWSER_ICONS[browserType];
            return (
              <TabsTrigger key={browserType} value={browserType} className="flex items-center gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{config.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {supportedBrowsers.map((browserType) => (
          <TabsContent key={browserType} value={browserType} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InstallationGuide browserType={browserType} />
              <FeaturesShowcase />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* System Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            System Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Minimum Requirements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 4GB RAM</li>
                <li>• 50MB free storage</li>
                <li>• Internet connection</li>
                <li>• Supported browser</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Supported Platforms</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Windows 10+</li>
                <li>• macOS 10.15+</li>
                <li>• Linux (Ubuntu 18.04+)</li>
                <li>• Chrome OS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Read browsing history</li>
                <li>• Access active tab</li>
                <li>• Modify web pages</li>
                <li>• Network requests</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Is the extension free?</h4>
            <p className="text-sm text-gray-600">
              Yes, the LinkShield browser extension is completely free. Premium features are available with a LinkShield account.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Does it slow down my browser?</h4>
            <p className="text-sm text-gray-600">
              No, LinkShield is optimized for performance and runs efficiently in the background without impacting browser speed.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">What data does it collect?</h4>
            <p className="text-sm text-gray-600">
              LinkShield only analyzes content for security purposes and does not store personal data. See our privacy policy for details.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Can I use it on multiple devices?</h4>
            <p className="text-sm text-gray-600">
              Yes, you can install LinkShield on all your devices and sync settings with a LinkShield account.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to Protect Your Social Media?
          </h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Join thousands of users who trust LinkShield to keep them safe online. 
            Install the extension now and start browsing with confidence.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-5 w-5 mr-2" />
              Install Extension
            </Button>
            <Button variant="outline" size="lg">
              <ExternalLink className="h-5 w-5 mr-2" />
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtensionDownloadsPage;