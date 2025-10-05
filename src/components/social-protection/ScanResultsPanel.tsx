'use client';

/**
 * @fileoverview ScanResultsPanel Component
 * 
 * Component for displaying comprehensive scan results from social media platform analysis.
 * Shows risk assessments, algorithm health metrics, security findings, and actionable recommendations.
 * 
 * Features:
 * - Risk score visualization with detailed breakdowns
 * - Algorithm health metrics and trends
 * - Security threat detection and alerts
 * - Content analysis results and insights
 * - Actionable recommendations and next steps
 * - Export and sharing capabilities
 * - Historical comparison views
 * 
 * @author LinkShield Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RiskScoreGauge } from '@/components/homepage/RiskScoreGauge';
import { TrendIndicator } from '@/components/shared/TrendIndicator';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  MessageSquare, 
  Heart, 
  Share, 
  Download, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  FileText,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

interface ScanResultsPanelProps {
  /** Scan results data */
  results: ScanResults;
  /** Platform that was scanned */
  platformId: string;
  /** Callback when user wants to rescan */
  onRescan?: () => void;
  /** Callback when user exports results */
  onExport?: (format: 'pdf' | 'csv' | 'json') => void;
  /** Whether to show detailed analysis */
  showDetailedAnalysis?: boolean;
}

interface ScanResults {
  scanId: string;
  platformId: string;
  timestamp: string;
  overallRiskScore: number;
  previousRiskScore?: number;
  algorithmHealth: AlgorithmHealthMetrics;
  securityFindings: SecurityFinding[];
  contentAnalysis: ContentAnalysisResults;
  recommendations: Recommendation[];
  metrics: PlatformMetrics;
  trends: TrendData[];
}

interface AlgorithmHealthMetrics {
  overallScore: number;
  visibility: number;
  engagement: number;
  reach: number;
  shadowBanRisk: number;
  trends: {
    visibility: number;
    engagement: number;
    reach: number;
  };
}

interface SecurityFinding {
  id: string;
  type: 'vulnerability' | 'threat' | 'privacy' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

interface ContentAnalysisResults {
  totalPosts: number;
  riskyCosts: number;
  flaggedContent: number;
  sentimentScore: number;
  topicDistribution: { topic: string; percentage: number }[];
  engagementPatterns: EngagementPattern[];
}

interface EngagementPattern {
  type: 'likes' | 'comments' | 'shares' | 'views';
  average: number;
  trend: number;
  anomalies: number;
}

interface Recommendation {
  id: string;
  category: 'security' | 'algorithm' | 'content' | 'engagement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actionItems: string[];
  estimatedImpact: string;
  timeToImplement: string;
}

interface PlatformMetrics {
  followers: number;
  following: number;
  posts: number;
  avgEngagement: number;
  reachRate: number;
  impressions: number;
}

interface TrendData {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * ScanResultsPanel Component
 * 
 * Displays comprehensive scan results with multiple views:
 * - Overview: Risk scores and key metrics
 * - Algorithm Health: Visibility and engagement analysis
 * - Security: Threat detection and vulnerabilities
 * - Content: Content analysis and recommendations
 * - Recommendations: Actionable next steps
 */
export function ScanResultsPanel({
  results,
  platformId,
  onRescan,
  onExport,
  showDetailedAnalysis = true
}: ScanResultsPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');

  /**
   * Get risk level based on score
   */
  const getRiskLevel = (score: number): { level: string; color: string } => {
    if (score <= 30) return { level: 'Low', color: 'text-green-600' };
    if (score <= 60) return { level: 'Medium', color: 'text-yellow-600' };
    if (score <= 80) return { level: 'High', color: 'text-orange-600' };
    return { level: 'Critical', color: 'text-red-600' };
  };

  /**
   * Get severity badge variant
   */
  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  /**
   * Get priority badge variant
   */
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  /**
   * Format number with appropriate suffix
   */
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  /**
   * Render overview tab content
   */
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Risk Score Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Overall Risk Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <RiskScoreGauge 
              score={results.overallRiskScore} 
              size="large"
              showLabel={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Algorithm Health</span>
                <div className="flex items-center space-x-2">
                  <Progress value={results.algorithmHealth.overallScore} className="w-20 h-2" />
                  <span className="text-sm font-medium">{results.algorithmHealth.overallScore}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Security Score</span>
                <div className="flex items-center space-x-2">
                  <Progress value={85} className="w-20 h-2" />
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Content Safety</span>
                <div className="flex items-center space-x-2">
                  <Progress value={92} className="w-20 h-2" />
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Followers</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{formatNumber(results.metrics.followers)}</div>
              <TrendIndicator 
                value={5.2} 
                showValue={true} 
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg. Engagement</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{results.metrics.avgEngagement.toFixed(1)}%</div>
              <TrendIndicator 
                value={-2.1} 
                showValue={true} 
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Reach Rate</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{results.metrics.reachRate.toFixed(1)}%</div>
              <TrendIndicator 
                value={1.8} 
                showValue={true} 
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Impressions</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{formatNumber(results.metrics.impressions)}</div>
              <TrendIndicator 
                value={8.5} 
                showValue={true} 
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Findings</CardTitle>
          <CardDescription>Key issues discovered in this scan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.securityFindings.slice(0, 3).map((finding) => (
              <div key={finding.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {finding.severity === 'critical' || finding.severity === 'high' ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Shield className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{finding.title}</p>
                    <Badge variant={getSeverityVariant(finding.severity)}>
                      {finding.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {finding.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  /**
   * Render algorithm health tab content
   */
  const renderAlgorithmHealth = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Visibility Score</span>
                <div className="flex items-center space-x-2">
                  <Progress value={results.algorithmHealth.visibility} className="w-24 h-2" />
                  <span className="text-sm font-medium">{results.algorithmHealth.visibility}%</span>
                  <TrendIndicator value={results.algorithmHealth.trends.visibility} />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Engagement Rate</span>
                <div className="flex items-center space-x-2">
                  <Progress value={results.algorithmHealth.engagement} className="w-24 h-2" />
                  <span className="text-sm font-medium">{results.algorithmHealth.engagement}%</span>
                  <TrendIndicator value={results.algorithmHealth.trends.engagement} />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Reach Score</span>
                <div className="flex items-center space-x-2">
                  <Progress value={results.algorithmHealth.reach} className="w-24 h-2" />
                  <span className="text-sm font-medium">{results.algorithmHealth.reach}%</span>
                  <TrendIndicator value={results.algorithmHealth.trends.reach} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shadow Ban Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {results.algorithmHealth.shadowBanRisk}%
              </div>
              <Badge 
                variant={results.algorithmHealth.shadowBanRisk > 70 ? 'destructive' : 
                        results.algorithmHealth.shadowBanRisk > 40 ? 'default' : 'secondary'}
              >
                {results.algorithmHealth.shadowBanRisk > 70 ? 'High Risk' :
                 results.algorithmHealth.shadowBanRisk > 40 ? 'Medium Risk' : 'Low Risk'}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Based on engagement patterns and visibility metrics
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {results.contentAnalysis.engagementPatterns.map((pattern) => (
              <div key={pattern.type} className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {pattern.type === 'likes' && <Heart className="h-5 w-5 text-red-500" />}
                  {pattern.type === 'comments' && <MessageSquare className="h-5 w-5 text-blue-500" />}
                  {pattern.type === 'shares' && <Share className="h-5 w-5 text-green-500" />}
                  {pattern.type === 'views' && <Eye className="h-5 w-5 text-purple-500" />}
                </div>
                <div className="text-lg font-semibold capitalize">{pattern.type}</div>
                <div className="text-2xl font-bold">{formatNumber(pattern.average)}</div>
                <TrendIndicator value={pattern.trend} showValue={true} className="text-xs" />
                {pattern.anomalies > 0 && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {pattern.anomalies} anomalies
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  /**
   * Render security findings tab content
   */
  const renderSecurityFindings = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {results.securityFindings.filter(f => f.severity === 'critical' || f.severity === 'high').length}
            </div>
            <div className="text-sm text-muted-foreground">High/Critical Issues</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {results.securityFindings.filter(f => f.severity === 'medium').length}
            </div>
            <div className="text-sm text-muted-foreground">Medium Issues</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {results.securityFindings.filter(f => f.severity === 'low').length}
            </div>
            <div className="text-sm text-muted-foreground">Low Issues</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Findings</CardTitle>
          <CardDescription>Detailed security analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.securityFindings.map((finding) => (
              <div key={finding.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{finding.title}</h4>
                    <Badge variant={getSeverityVariant(finding.severity)}>
                      {finding.severity}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {finding.type}
                    </Badge>
                  </div>
                  <Badge 
                    variant={finding.status === 'resolved' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {finding.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {finding.description}
                </p>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Impact:</span>
                    <p className="text-sm">{finding.impact}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Recommendation:</span>
                    <p className="text-sm">{finding.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  /**
   * Render recommendations tab content
   */
  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {['critical', 'high', 'medium', 'low'].map((priority) => (
          <Card key={priority}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {results.recommendations.filter(r => r.priority === priority).length}
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {priority} Priority
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {results.recommendations.map((recommendation) => (
          <Card key={recommendation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-base">{recommendation.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getPriorityVariant(recommendation.priority)}>
                    {recommendation.priority}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {recommendation.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {recommendation.description}
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h5 className="text-sm font-medium mb-2">Action Items:</h5>
                  <ul className="space-y-1">
                    {recommendation.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <Target className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Impact:</strong> {recommendation.estimatedImpact}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Time:</strong> {recommendation.timeToImplement}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scan Results</h2>
          <p className="text-muted-foreground">
            Scanned {platformId} on {new Date(results.timestamp).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {onExport && (
            <Button variant="outline" onClick={() => onExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          {onRescan && (
            <Button onClick={onRescan}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Rescan
            </Button>
          )}
        </div>
      </div>

      {/* Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm Health</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>
        
        <TabsContent value="algorithm" className="mt-6">
          {renderAlgorithmHealth()}
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          {renderSecurityFindings()}
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-6">
          {renderRecommendations()}
        </TabsContent>
      </Tabs>
    </div>
  );
}