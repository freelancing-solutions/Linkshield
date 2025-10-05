/**
 * @fileoverview Homepage Social Scanner Component
 * 
 * Provides a public social media scanning interface for anonymous users on the homepage.
 * Allows visitors to scan social media profiles and posts without requiring authentication,
 * with URL validation, progress tracking, and comprehensive results display.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Save,
  RefreshCw
} from 'lucide-react';
import { ContentAnalysis } from '@/types/social-protection';
import { ScannerInput } from './ScannerInput';
import { ScanProgress } from './ScanProgress';
import { ScanResults } from './ScanResults';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface HomepageSocialScannerProps {
  /** Whether user is authenticated */
  isAuthenticated?: boolean;
  /** Save scan handler for authenticated users */
  onSaveScan?: (results: ContentAnalysis) => Promise<void>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Supported social media platforms
 */
const SUPPORTED_PLATFORMS = [
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'tiktok.com',
  'linkedin.com',
  'youtube.com',
  'reddit.com'
];

/**
 * Validate social media URL format
 */
const isValidSocialMediaUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return SUPPORTED_PLATFORMS.some(platform => 
      urlObj.hostname.includes(platform) || urlObj.hostname.includes(platform.replace('.com', ''))
    );
  } catch {
    return false;
  }
};

/**
 * Mock API call for content analysis
 * In production, this would call the actual API endpoint
 */
const analyzeContent = async (url: string, anonymous: boolean = true): Promise<ContentAnalysis> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock response based on URL
  const platform = SUPPORTED_PLATFORMS.find(p => url.includes(p)) || 'unknown';
  const isHighRisk = Math.random() > 0.7; // 30% chance of high risk
  
  return {
    id: `scan_${Date.now()}`,
    url,
    platform: platform.replace('.com', '') as any,
    risk_score: isHighRisk ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 50) + 10,
    status: 'completed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    content_risks: isHighRisk ? [
      {
        type: 'misinformation',
        severity: 'high',
        confidence: 0.85,
        description: 'Content contains potentially misleading information',
        evidence: ['Unverified claims', 'Suspicious source patterns']
      },
      {
        type: 'harassment',
        severity: 'medium',
        confidence: 0.72,
        description: 'Aggressive language detected',
        evidence: ['Hostile tone', 'Personal attacks']
      }
    ] : [
      {
        type: 'spam',
        severity: 'low',
        confidence: 0.45,
        description: 'Minor promotional content detected',
        evidence: ['Repetitive messaging']
      }
    ],
    account_info: {
      username: url.split('/').pop() || 'unknown',
      display_name: 'Sample Account',
      verified: Math.random() > 0.5,
      follower_count: Math.floor(Math.random() * 100000) + 1000,
      following_count: Math.floor(Math.random() * 5000) + 100,
      account_age_days: Math.floor(Math.random() * 2000) + 30,
      profile_image_url: null,
      bio: 'Sample bio for demonstration purposes'
    },
    recommendations: isHighRisk ? [
      'Exercise caution when engaging with this content',
      'Verify information from multiple reliable sources',
      'Report if you encounter harassment or abuse',
      'Consider blocking if content continues to be problematic'
    ] : [
      'Content appears to be relatively safe',
      'Continue to practice general social media safety',
      'Report any suspicious activity you may encounter'
    ],
    ai_summary: isHighRisk 
      ? 'This content shows several risk indicators including potential misinformation and aggressive language. Exercise caution when engaging.'
      : 'This content appears to be relatively safe with only minor promotional elements detected. Standard social media precautions apply.'
  };
};

/**
 * HomepageSocialScanner Component
 * 
 * Public social media scanning interface for the homepage. Allows anonymous users
 * to scan social media profiles and posts without authentication. Provides URL
 * validation, real-time progress tracking, and comprehensive results display.
 * 
 * Features:
 * - URL validation for supported social media platforms
 * - Anonymous scanning without authentication
 * - Real-time progress indicators
 * - Comprehensive risk analysis results
 * - Save functionality for authenticated users
 * - Rate limiting handling for anonymous users
 * - Responsive design with mobile optimization
 * - Error handling and user feedback
 * - Platform-specific validation and formatting
 * 
 * @param props - Component props
 * @returns JSX element representing the homepage social scanner
 * 
 * Requirements: 7.1-7.10 - Homepage social media scanner functionality
 */
export const HomepageSocialScanner: React.FC<HomepageSocialScannerProps> = ({
  isAuthenticated = false,
  onSaveScan,
  className
}) => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ContentAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Handle URL input change
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setError(null);
    setResults(null);
  };

  // Handle scan initiation
  const handleScan = async () => {
    // Validate URL format
    if (!url.trim()) {
      setError('Please enter a social media URL');
      return;
    }

    if (!isValidSocialMediaUrl(url)) {
      setError('Please enter a valid social media URL (Twitter, Facebook, Instagram, TikTok, LinkedIn, YouTube, Reddit)');
      return;
    }

    setScanning(true);
    setError(null);
    setResults(null);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Perform analysis
      const analysis = await analyzeContent(url, !isAuthenticated);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Small delay to show 100% completion
      setTimeout(() => {
        setResults(analysis);
        setScanning(false);
        setProgress(0);
      }, 500);

    } catch (error: any) {
      setScanning(false);
      setProgress(0);
      
      // Handle specific error types
      if (error.status === 429) {
        setError('Rate limit exceeded. Please try again in a few minutes or sign up for unlimited scans.');
      } else if (error.status === 400) {
        setError('Invalid URL format. Please check the URL and try again.');
      } else {
        setError('Scan failed. Please check the URL and try again.');
      }
      
      toast.error('Scan failed. Please try again.');
    }
  };

  // Handle save scan for authenticated users
  const handleSaveScan = async () => {
    if (!results || !onSaveScan) return;

    setIsSaving(true);
    try {
      await onSaveScan(results);
      toast.success('Scan results saved to your history');
    } catch (error) {
      toast.error('Failed to save scan results');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setResults(null);
    handleScan();
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          Social Media Scanner
        </h2>
        <p className="text-lg text-gray-600">
          Check the safety of any social media profile or post
        </p>
        <p className="text-sm text-gray-500">
          Supports Twitter, Facebook, Instagram, TikTok, LinkedIn, YouTube, and Reddit
        </p>
      </div>

      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Scan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Section */}
          <ScannerInput
            url={url}
            onUrlChange={handleUrlChange}
            onScan={handleScan}
            isScanning={scanning}
            error={error}
          />

          {/* Progress Section */}
          {scanning && (
            <ScanProgress
              progress={progress}
              stage={
                progress < 30 ? 'Validating URL...' :
                progress < 60 ? 'Analyzing content...' :
                progress < 90 ? 'Checking for risks...' :
                'Finalizing results...'
              }
            />
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={handleRetry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Authentication Notice for Anonymous Users */}
          {!isAuthenticated && !scanning && !results && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>
                    Scanning as guest. <strong>Sign up</strong> for unlimited scans and to save results.
                  </span>
                  <Button variant="outline" size="sm">
                    Sign Up
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <div className="space-y-4">
          <ScanResults results={results} />
          
          {/* Save Results for Authenticated Users */}
          {isAuthenticated && onSaveScan && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Save Scan Results</h4>
                    <p className="text-sm text-gray-500">
                      Add this scan to your history for future reference
                    </p>
                  </div>
                  <Button onClick={handleSaveScan} disabled={isSaving}>
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Scan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Call to Action for Anonymous Users */}
          {!isAuthenticated && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Want to save your results?</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Create a free account to save scan results, get unlimited scans, and access advanced features.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      Sign Up Free
                    </Button>
                    <Button variant="ghost" className="text-blue-600 hover:bg-blue-100">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default HomepageSocialScanner;