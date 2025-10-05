/**
 * AnalyzeContentModal Component
 * 
 * Modal for analyzing social media content to assess risks before posting or sharing.
 * Provides comprehensive risk assessment with recommendations and safety scores.
 * 
 * Features:
 * - Content input form with platform selection
 * - Real-time content validation
 * - Risk assessment display with detailed analysis
 * - Link safety analysis
 * - Spam detection indicators
 * - Content safety scoring
 * - Actionable recommendations panel
 * - Export analysis results
 * 
 * @example
 * ```tsx
 * <AnalyzeContentModal
 *   isOpen={isModalOpen}
 *   onClose={handleCloseModal}
 *   onAnalysisComplete={handleAnalysisComplete}
 * />
 * ```
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useContentAnalysis } from '@/hooks/social-protection/use-content-analysis';
import { toast } from 'react-hot-toast';
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Music,
  Discord,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Shield,
  AlertCircle,
  TrendingUp,
  Eye,
  Link as LinkIcon,
  FileText,
  Download,
  RefreshCw,
  Info,
  Zap,
  Target,
  Clock,
} from 'lucide-react';

// Types for content analysis
type PlatformType = 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'telegram' | 'discord';
type ContentType = 'post' | 'comment' | 'message' | 'story' | 'reel';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface ContentAnalysisRequest {
  platform: PlatformType;
  content_type: ContentType;
  content_text: string;
  urls?: string[];
  media_urls?: string[];
}

interface LinkRisk {
  url: string;
  safety_score: number;
  risk_level: RiskLevel;
  issues: string[];
  domain_reputation: number;
}

interface SpamIndicator {
  type: string;
  confidence: number;
  description: string;
  patterns: string[];
}

interface ContentRisk {
  category: string;
  score: number;
  risk_level: RiskLevel;
  flagged_elements: string[];
  description: string;
}

interface AnalysisResult {
  overall_risk_score: number;
  risk_level: RiskLevel;
  analysis_id: string;
  timestamp: string;
  link_risks: LinkRisk[];
  spam_indicators: SpamIndicator[];
  content_risks: ContentRisk[];
  recommendations: string[];
  estimated_reach_impact: number;
  algorithm_impact: number;
}

interface AnalyzeContentModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Callback when analysis is completed */
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

// Platform configurations
const PLATFORMS: Record<PlatformType, { name: string; icon: typeof Twitter; color: string }> = {
  twitter: { name: 'Twitter/X', icon: Twitter, color: 'text-blue-500' },
  facebook: { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  instagram: { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  tiktok: { name: 'TikTok', icon: Music, color: 'text-black' },
  linkedin: { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  telegram: { name: 'Telegram', icon: MessageCircle, color: 'text-blue-400' },
  discord: { name: 'Discord', icon: Discord, color: 'text-indigo-500' },
};

const CONTENT_TYPES: Record<ContentType, string> = {
  post: 'Post',
  comment: 'Comment',
  message: 'Message',
  story: 'Story',
  reel: 'Reel/Video',
};

// Risk level configurations
const RISK_LEVELS: Record<RiskLevel, { color: string; bgColor: string; icon: typeof CheckCircle }> = {
  low: { color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle },
  medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: AlertCircle },
  high: { color: 'text-orange-600', bgColor: 'bg-orange-50', icon: AlertTriangle },
  critical: { color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle },
};

export function AnalyzeContentModal({ isOpen, onClose, onAnalysisComplete }: AnalyzeContentModalProps) {
  // Form state
  const [platform, setPlatform] = useState<PlatformType>('twitter');
  const [contentType, setContentType] = useState<ContentType>('post');
  const [contentText, setContentText] = useState('');
  const [urls, setUrls] = useState('');
  const [mediaUrls, setMediaUrls] = useState('');
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hooks
  const { mutate: analyzeContent } = useContentAnalysis();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPlatform('twitter');
      setContentType('post');
      setContentText('');
      setUrls('');
      setMediaUrls('');
      setAnalysisResult(null);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentStep('');
      setErrors({});
    }
  }, [isOpen]);

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!contentText.trim()) {
      newErrors.contentText = 'Content text is required';
    } else if (contentText.length > 5000) {
      newErrors.contentText = 'Content text must be less than 5000 characters';
    }

    // Validate URLs if provided
    if (urls.trim()) {
      const urlList = urls.split('\n').filter(url => url.trim());
      const urlRegex = /^https?:\/\/.+/;
      const invalidUrls = urlList.filter(url => !urlRegex.test(url.trim()));
      if (invalidUrls.length > 0) {
        newErrors.urls = `Invalid URLs: ${invalidUrls.join(', ')}`;
      }
    }

    // Validate media URLs if provided
    if (mediaUrls.trim()) {
      const mediaUrlList = mediaUrls.split('\n').filter(url => url.trim());
      const urlRegex = /^https?:\/\/.+/;
      const invalidMediaUrls = mediaUrlList.filter(url => !urlRegex.test(url.trim()));
      if (invalidMediaUrls.length > 0) {
        newErrors.mediaUrls = `Invalid media URLs: ${invalidMediaUrls.join(', ')}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleAnalyze = async () => {
    if (!validateForm()) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep('Preparing analysis...');

    try {
      // Simulate analysis progress
      const progressSteps = [
        { progress: 20, step: 'Analyzing content structure...' },
        { progress: 40, step: 'Checking link safety...' },
        { progress: 60, step: 'Detecting spam indicators...' },
        { progress: 80, step: 'Assessing content risks...' },
        { progress: 100, step: 'Generating recommendations...' },
      ];

      for (const { progress, step } of progressSteps) {
        setAnalysisProgress(progress);
        setCurrentStep(step);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const analysisRequest: ContentAnalysisRequest = {
        platform,
        content_type: contentType,
        content_text: contentText,
        urls: urls.trim() ? urls.split('\n').filter(url => url.trim()) : undefined,
        media_urls: mediaUrls.trim() ? mediaUrls.split('\n').filter(url => url.trim()) : undefined,
      };

      analyzeContent(analysisRequest, {
        onSuccess: (result) => {
          setAnalysisResult(result);
          setIsAnalyzing(false);
          onAnalysisComplete?.(result);
          toast.success('Content analysis completed successfully');
        },
        onError: (error) => {
          setIsAnalyzing(false);
          setAnalysisProgress(0);
          setCurrentStep('');
          toast.error('Failed to analyze content. Please try again.');
          console.error('Analysis error:', error);
        },
      });
    } catch (error) {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentStep('');
      toast.error('An unexpected error occurred during analysis');
      console.error('Analysis error:', error);
    }
  };

  // Handle export results
  const handleExportResults = () => {
    if (!analysisResult) return;

    const exportData = {
      analysis_id: analysisResult.analysis_id,
      timestamp: analysisResult.timestamp,
      platform,
      content_type: contentType,
      content_preview: contentText.substring(0, 100) + (contentText.length > 100 ? '...' : ''),
      overall_risk_score: analysisResult.overall_risk_score,
      risk_level: analysisResult.risk_level,
      recommendations: analysisResult.recommendations,
      link_risks: analysisResult.link_risks,
      spam_indicators: analysisResult.spam_indicators,
      content_risks: analysisResult.content_risks,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-analysis-${analysisResult.analysis_id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Analysis results exported successfully');
  };

  // Get risk level styling
  const getRiskStyling = (riskLevel: RiskLevel) => RISK_LEVELS[riskLevel];

  // Render content input form
  const renderContentInputForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select value={platform} onValueChange={(value: PlatformType) => setPlatform(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PLATFORMS).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      {config.name}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contentType">Content Type</Label>
          <Select value={contentType} onValueChange={(value: ContentType) => setContentType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CONTENT_TYPES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contentText">Content Text *</Label>
        <Textarea
          id="contentText"
          placeholder="Enter the content you want to analyze..."
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          className="min-h-[120px] resize-none"
          maxLength={5000}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{errors.contentText && <span className="text-red-500">{errors.contentText}</span>}</span>
          <span>{contentText.length}/5000</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="urls">URLs (optional)</Label>
        <Textarea
          id="urls"
          placeholder="Enter URLs (one per line)..."
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        {errors.urls && <p className="text-sm text-red-500">{errors.urls}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mediaUrls">Media URLs (optional)</Label>
        <Textarea
          id="mediaUrls"
          placeholder="Enter media URLs (one per line)..."
          value={mediaUrls}
          onChange={(e) => setMediaUrls(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        {errors.mediaUrls && <p className="text-sm text-red-500">{errors.mediaUrls}</p>}
      </div>
    </div>
  );

  // Render analysis progress
  const renderAnalysisProgress = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-semibold mb-2">Analyzing Content</h3>
        <p className="text-muted-foreground">{currentStep}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{analysisProgress}%</span>
        </div>
        <Progress value={analysisProgress} className="w-full" />
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This analysis typically takes 30-60 seconds. We're checking your content for potential risks,
          analyzing links, and generating personalized recommendations.
        </AlertDescription>
      </Alert>
    </div>
  );

  // Render risk assessment display
  const renderRiskAssessment = () => {
    if (!analysisResult) return null;

    const riskStyling = getRiskStyling(analysisResult.risk_level);
    const RiskIcon = riskStyling.icon;

    return (
      <div className="space-y-6">
        {/* Overall Risk Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Overall Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${riskStyling.bgColor}`}>
                  <RiskIcon className={`h-6 w-6 ${riskStyling.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analysisResult.overall_risk_score}/100</div>
                  <Badge variant="outline" className={`${riskStyling.color} border-current`}>
                    {analysisResult.risk_level.toUpperCase()} RISK
                  </Badge>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>Analysis ID: {analysisResult.analysis_id}</div>
                <div>{new Date(analysisResult.timestamp).toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <div className="text-sm font-medium">Reach Impact</div>
                <div className="text-lg font-bold">{analysisResult.estimated_reach_impact}%</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Eye className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                <div className="text-sm font-medium">Algorithm Impact</div>
                <div className="text-lg font-bold">{analysisResult.algorithm_impact}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="links" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Link Risks ({analysisResult.link_risks.length})
            </TabsTrigger>
            <TabsTrigger value="spam" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Spam Indicators ({analysisResult.spam_indicators.length})
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content Risks ({analysisResult.content_risks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-4">
            {analysisResult.link_risks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <LinkIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No links detected in your content</p>
              </div>
            ) : (
              analysisResult.link_risks.map((link, index) => {
                const linkRiskStyling = getRiskStyling(link.risk_level);
                const LinkRiskIcon = linkRiskStyling.icon;
                
                return (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <LinkRiskIcon className={`h-5 w-5 mt-0.5 ${linkRiskStyling.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">{link.url}</code>
                            <Badge variant="outline" className={`${linkRiskStyling.color} border-current`}>
                              {link.risk_level}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Safety Score: {link.safety_score}/100 | Domain Reputation: {link.domain_reputation}/100
                          </div>
                          {link.issues.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-sm font-medium">Issues:</div>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {link.issues.map((issue, i) => (
                                  <li key={i}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="spam" className="space-y-4">
            {analysisResult.spam_indicators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No spam indicators detected</p>
              </div>
            ) : (
              analysisResult.spam_indicators.map((indicator, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{indicator.type}</span>
                          <Badge variant="outline">
                            {Math.round(indicator.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{indicator.description}</p>
                        {indicator.patterns.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Detected Patterns:</div>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {indicator.patterns.map((pattern, i) => (
                                <li key={i}>{pattern}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            {analysisResult.content_risks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No content risks detected</p>
              </div>
            ) : (
              analysisResult.content_risks.map((risk, index) => {
                const contentRiskStyling = getRiskStyling(risk.risk_level);
                const ContentRiskIcon = contentRiskStyling.icon;
                
                return (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <ContentRiskIcon className={`h-5 w-5 mt-0.5 ${contentRiskStyling.color}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{risk.category}</span>
                            <Badge variant="outline" className={`${contentRiskStyling.color} border-current`}>
                              {risk.risk_level}
                            </Badge>
                            <span className="text-sm text-muted-foreground">Score: {risk.score}/100</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                          {risk.flagged_elements.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-sm font-medium">Flagged Elements:</div>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {risk.flagged_elements.map((element, i) => (
                                  <li key={i}>{element}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Render recommendations panel
  const renderRecommendationsPanel = () => {
    if (!analysisResult || analysisResult.recommendations.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommendations
          </CardTitle>
          <CardDescription>
            Actionable steps to improve your content safety and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisResult.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Analyze Content
          </DialogTitle>
          <DialogDescription>
            Analyze your social media content for potential risks, spam indicators, and safety issues
            before posting or sharing.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="space-y-6 pr-4">
            {isAnalyzing ? (
              renderAnalysisProgress()
            ) : analysisResult ? (
              <>
                {renderRiskAssessment()}
                {renderRecommendationsPanel()}
              </>
            ) : (
              renderContentInputForm()
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {analysisResult && (
              <>
                <Button
                  variant="outline"
                  onClick={handleExportResults}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Results
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysisResult(null);
                    setIsAnalyzing(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Analyze New Content
                </Button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              {analysisResult ? 'Close' : 'Cancel'}
            </Button>
            {!analysisResult && !isAnalyzing && (
              <Button
                onClick={handleAnalyze}
                disabled={!contentText.trim()}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Analyze Content
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AnalyzeContentModal;