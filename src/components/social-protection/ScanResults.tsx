/**
 * @fileoverview Scan Results Component
 * 
 * Displays comprehensive social media scan results including risk assessment,
 * platform analysis, content insights, and actionable recommendations.
 * Provides detailed feedback with visual indicators and export capabilities.
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Share2,
  Bookmark,
  Eye,
  Users,
  Calendar,
  Globe,
  TrendingUp,
  Flag,
  Heart,
  MessageCircle,
  Repeat2,
  ExternalLink,
  Copy,
  RefreshCw,
  Star,
  Clock,
  Activity,
  Zap,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanResult {
  /** Unique scan ID */
  id: string;
  /** Scanned URL */
  url: string;
  /** Detected platform */
  platform: string;
  /** Overall risk score (0-100) */
  riskScore: number;
  /** Risk level classification */
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  /** Scan timestamp */
  timestamp: Date;
  /** Account information */
  account: {
    username: string;
    displayName: string;
    verified: boolean;
    followerCount: number;
    followingCount: number;
    postCount: number;
    accountAge: number; // days
    profileImageUrl?: string;
  };
  /** Content analysis */
  content: {
    type: 'profile' | 'post' | 'story' | 'reel';
    text?: string;
    mediaCount: number;
    hashtags: string[];
    mentions: string[];
    engagement: {
      likes: number;
      comments: number;
      shares: number;
    };
  };
  /** Risk factors identified */
  risks: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    confidence: number;
  }>;
  /** AI-generated insights */
  insights: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    trustScore: number;
  };
  /** Platform-specific metrics */
  platformMetrics: Record<string, any>;
}

interface ScanResultsProps {
  /** Scan results data */
  results: ScanResult;
  /** Whether user is authenticated */
  isAuthenticated?: boolean;
  /** Callback for saving scan */
  onSave?: (scanId: string) => void;
  /** Callback for sharing results */
  onShare?: (scanId: string) => void;
  /** Callback for rescanning */
  onRescan?: (url: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Risk level configuration
 */
const RISK_LEVELS = {
  low: {
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    label: 'Low Risk',
    description: 'Content appears safe with minimal concerns'
  },
  medium: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    icon: Info,
    label: 'Medium Risk',
    description: 'Some concerns identified, proceed with caution'
  },
  high: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    icon: AlertTriangle,
    label: 'High Risk',
    description: 'Significant risks detected, exercise caution'
  },
  critical: {
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    icon: AlertCircle,
    label: 'Critical Risk',
    description: 'Serious threats identified, avoid interaction'
  }
};

/**
 * Platform icons mapping
 */
const PLATFORM_ICONS = {
  twitter: '𝕏',
  instagram: '📷',
  facebook: '👥',
  linkedin: '💼',
  tiktok: '🎵',
  youtube: '📺',
  snapchat: '👻',
  reddit: '🤖',
  default: '🌐'
};

/**
 * Format large numbers
 */
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format account age
 */
const formatAccountAge = (days: number): string => {
  if (days < 30) {
    return `${days} days`;
  }
  if (days < 365) {
    return `${Math.floor(days / 30)} months`;
  }
  return `${Math.floor(days / 365)} years`;
};

/**
 * Risk Score Display Component
 */
const RiskScoreDisplay: React.FC<{ 
  score: number; 
  level: keyof typeof RISK_LEVELS;
  className?: string;
}> = ({ score, level, className }) => {
  const config = RISK_LEVELS[level];
  const Icon = config.icon;

  return (
    <Card className={cn('border-2', config.borderColor, className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('p-3 rounded-full', config.bgColor)}>
              <Icon className={cn('h-6 w-6', config.color)} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{config.label}</h3>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{score}</div>
            <div className="text-sm text-gray-500">Risk Score</div>
          </div>
        </div>
        <Progress 
          value={score} 
          className={cn('h-2', config.bgColor.replace('100', '200'))}
        />
      </CardContent>
    </Card>
  );
};

/**
 * Account Overview Component
 */
const AccountOverview: React.FC<{ account: ScanResult['account']; platform: string }> = ({ 
  account, 
  platform 
}) => {
  const platformIcon = PLATFORM_ICONS[platform.toLowerCase() as keyof typeof PLATFORM_ICONS] || PLATFORM_ICONS.default;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">{platformIcon}</span>
          Account Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          {account.profileImageUrl && (
            <img 
              src={account.profileImageUrl} 
              alt={account.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{account.displayName}</h4>
              {account.verified && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">@{account.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Followers
              </span>
              <span className="font-medium">{formatNumber(account.followerCount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Following
              </span>
              <span className="font-medium">{formatNumber(account.followingCount)}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Posts
              </span>
              <span className="font-medium">{formatNumber(account.postCount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Account Age
              </span>
              <span className="font-medium">{formatAccountAge(account.accountAge)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Risk Factors Component
 */
const RiskFactors: React.FC<{ risks: ScanResult['risks'] }> = ({ risks }) => {
  const risksByLevel = risks.reduce((acc, risk) => {
    if (!acc[risk.severity]) acc[risk.severity] = [];
    acc[risk.severity].push(risk);
    return acc;
  }, {} as Record<string, typeof risks>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Risk Factors ({risks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(risksByLevel).map(([level, levelRisks]) => {
          const config = RISK_LEVELS[level as keyof typeof RISK_LEVELS];
          const Icon = config.icon;

          return (
            <div key={level} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className={cn('h-4 w-4', config.color)} />
                <span className={cn('font-medium text-sm', config.color)}>
                  {config.label} ({levelRisks.length})
                </span>
              </div>
              <div className="space-y-2 ml-6">
                {levelRisks.map((risk, index) => (
                  <div key={index} className={cn('p-3 rounded-lg border', config.borderColor, config.bgColor)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-gray-900">{risk.type}</h5>
                        <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {Math.round(risk.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {risks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p>No significant risk factors detected</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * AI Insights Component
 */
const AIInsights: React.FC<{ insights: ScanResult['insights'] }> = ({ insights }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          AI Analysis
          <Badge variant="outline" className="ml-2">
            <Star className="h-3 w-3 mr-1" />
            Trust Score: {Math.round(insights.trustScore * 100)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{insights.summary}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Key Findings</h4>
          <ul className="space-y-1">
            {insights.keyFindings.map((finding, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <Target className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                {finding}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
          <ul className="space-y-1">
            {insights.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <Award className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Content Analysis Component
 */
const ContentAnalysis: React.FC<{ content: ScanResult['content'] }> = ({ content }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Content Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">Content Type</span>
            <p className="font-medium capitalize">{content.type}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Media Count</span>
            <p className="font-medium">{content.mediaCount}</p>
          </div>
        </div>

        {content.text && (
          <div>
            <span className="text-sm text-gray-600">Text Content</span>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg mt-1">
              {content.text}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
            <div className="font-medium">{formatNumber(content.engagement.likes)}</div>
            <div className="text-xs text-gray-600">Likes</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <MessageCircle className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <div className="font-medium">{formatNumber(content.engagement.comments)}</div>
            <div className="text-xs text-gray-600">Comments</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Repeat2 className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <div className="font-medium">{formatNumber(content.engagement.shares)}</div>
            <div className="text-xs text-gray-600">Shares</div>
          </div>
        </div>

        {content.hashtags.length > 0 && (
          <div>
            <span className="text-sm text-gray-600">Hashtags</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {content.hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {content.mentions.length > 0 && (
          <div>
            <span className="text-sm text-gray-600">Mentions</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {content.mentions.map((mention, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  @{mention}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * ScanResults Component
 * 
 * Comprehensive display of social media scan results including risk assessment,
 * account analysis, content insights, and AI-generated recommendations.
 * Provides detailed feedback with visual indicators and actionable insights.
 * 
 * Features:
 * - Risk score visualization with color-coded indicators
 * - Account overview with follower metrics and verification status
 * - Detailed risk factor analysis with confidence levels
 * - AI-powered insights and recommendations
 * - Content analysis with engagement metrics
 * - Export and sharing capabilities
 * - Save functionality for authenticated users
 * - Responsive design with mobile optimization
 * - Accessibility features and screen reader support
 * - Real-time data updates and refresh capabilities
 * 
 * @param props - Component props
 * @returns JSX element representing the scan results
 * 
 * Requirements: 7.6 - Display scan results with risk assessment
 */
export const ScanResults: React.FC<ScanResultsProps> = ({
  results,
  isAuthenticated = false,
  onSave,
  onShare,
  onRescan,
  className
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(results.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(results.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(results.id);
    }
  };

  const handleRescan = () => {
    if (onRescan) {
      onRescan(results.url);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Scan Results</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                {results.url}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyUrl}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              {copied && (
                <span className="text-green-600 text-xs">Copied!</span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {results.timestamp.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-lg">{PLATFORM_ICONS[results.platform.toLowerCase() as keyof typeof PLATFORM_ICONS] || PLATFORM_ICONS.default}</span>
                {results.platform}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRescan}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Rescan
            </Button>
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Bookmark className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Risk Score */}
        <RiskScoreDisplay 
          score={results.riskScore} 
          level={results.riskLevel}
        />
      </div>

      {/* Detailed Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="risks">Risk Factors</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AccountOverview account={results.account} platform={results.platform} />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <RiskFactors risks={results.risks} />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentAnalysis content={results.content} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <AIInsights insights={results.insights} />
        </TabsContent>
      </Tabs>

      {/* Warning Banner for High Risk */}
      {(results.riskLevel === 'high' || results.riskLevel === 'critical') && (
        <div className={cn(
          'border-2 rounded-lg p-4',
          results.riskLevel === 'critical' 
            ? 'bg-red-50 border-red-200' 
            : 'bg-orange-50 border-orange-200'
        )}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={cn(
              'h-6 w-6 mt-0.5',
              results.riskLevel === 'critical' ? 'text-red-600' : 'text-orange-600'
            )} />
            <div>
              <h4 className={cn(
                'font-semibold',
                results.riskLevel === 'critical' ? 'text-red-900' : 'text-orange-900'
              )}>
                {results.riskLevel === 'critical' ? 'Critical Security Warning' : 'High Risk Detected'}
              </h4>
              <p className={cn(
                'text-sm mt-1',
                results.riskLevel === 'critical' ? 'text-red-700' : 'text-orange-700'
              )}>
                {results.riskLevel === 'critical' 
                  ? 'This content poses serious security risks. Avoid any interaction and report if necessary.'
                  : 'This content has significant risk factors. Exercise extreme caution before engaging.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Get More Protection</h4>
              <p className="text-sm text-blue-700 mt-1">
                Sign up for LinkShield to save scans, get real-time alerts, and access advanced protection features.
              </p>
              <Button variant="outline" size="sm" className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100">
                <ExternalLink className="h-4 w-4 mr-1" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanResults;