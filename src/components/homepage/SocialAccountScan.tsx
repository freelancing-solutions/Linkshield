/**
 * SocialAccountScan Component
 * 
 * Provides interface for scanning social media accounts for algorithm health,
 * visibility, engagement, and penalties. Supports multiple platforms.
 * 
 * Features:
 * - Platform selection (Twitter, Instagram, Facebook, LinkedIn)
 * - Profile URL input with validation
 * - Visibility and engagement analysis
 * - Penalty detection
 * - Real-time scan progress
 * - Results display with recommendations
 * 
 * @requires Authentication
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    useAnalyzeVisibility,
    useAnalyzeEngagement,
    useDetectPenalties
} from '@/hooks/homepage/use-social-protection';
import {
    Twitter,
    Instagram,
    Facebook,
    Linkedin,
    AlertCircle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Minus,
    Loader2,
    ExternalLink
} from 'lucide-react';
import type {
    VisibilityAnalysis,
    EngagementAnalysis,
    PenaltyDetection
} from '@/types/homepage';

/**
 * Supported social media platforms
 */
type SocialPlatform = 'twitter' | 'instagram' | 'facebook' | 'linkedin';

/**
 * Analysis type
 */
type AnalysisType = 'visibility' | 'engagement' | 'penalties';

/**
 * Platform configuration
 */
interface PlatformConfig {
    id: SocialPlatform;
    name: string;
    icon: typeof Twitter;
    urlPattern: RegExp;
    placeholder: string;
    color: string;
}

/**
 * Platform configurations
 */
const PLATFORMS: PlatformConfig[] = [
    {
        id: 'twitter',
        name: 'Twitter/X',
        icon: Twitter,
        urlPattern: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
        placeholder: 'https://twitter.com/username',
        color: 'text-blue-500',
    },
    {
        id: 'instagram',
        name: 'Instagram',
        icon: Instagram,
        urlPattern: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/,
        placeholder: 'https://instagram.com/username',
        color: 'text-pink-500',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: Facebook,
        urlPattern: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
        placeholder: 'https://facebook.com/username',
        color: 'text-blue-600',
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Linkedin,
        urlPattern: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+\/?$/,
        placeholder: 'https://linkedin.com/in/username',
        color: 'text-blue-700',
    },
];

/**
 * Component props
 */
interface SocialAccountScanProps {
    className?: string;
}

/**
 * SocialAccountScan Component
 */
export const SocialAccountScan: React.FC<SocialAccountScanProps> = ({
    className = ''
}) => {
    // State
    const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('twitter');
    const [profileUrl, setProfileUrl] = useState('');
    const [urlError, setUrlError] = useState<string | null>(null);
    const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType | null>(null);

    // Results state
    const [visibilityResult, setVisibilityResult] = useState<VisibilityAnalysis | null>(null);
    const [engagementResult, setEngagementResult] = useState<EngagementAnalysis | null>(null);
    const [penaltyResult, setPenaltyResult] = useState<PenaltyDetection | null>(null);

    // Hooks
    const analyzeVisibility = useAnalyzeVisibility();
    const analyzeEngagement = useAnalyzeEngagement();
    const detectPenalties = useDetectPenalties();

    // Get current platform config
    const currentPlatform = PLATFORMS.find(p => p.id === selectedPlatform)!;
    const PlatformIcon = currentPlatform.icon;

    /**
     * Validate profile URL
     */
    const validateUrl = (url: string): boolean => {
        if (!url) {
            setUrlError('Profile URL is required');
            return false;
        }

        if (!currentPlatform.urlPattern.test(url)) {
            setUrlError(`Invalid ${currentPlatform.name} profile URL`);
            return false;
        }

        setUrlError(null);
        return true;
    };

    /**
     * Handle visibility analysis
     */
    const handleAnalyzeVisibility = async () => {
        if (!validateUrl(profileUrl)) return;

        setActiveAnalysis('visibility');
        try {
            const result = await analyzeVisibility.mutateAsync();
            setVisibilityResult(result);
        } finally {
            setActiveAnalysis(null);
        }
    };

    /**
     * Handle engagement analysis
     */
    const handleAnalyzeEngagement = async () => {
        if (!validateUrl(profileUrl)) return;

        setActiveAnalysis('engagement');
        try {
            const result = await analyzeEngagement.mutateAsync();
            setEngagementResult(result);
        } finally {
            setActiveAnalysis(null);
        }
    };

    /**
     * Handle penalty detection
     */
    const handleDetectPenalties = async () => {
        if (!validateUrl(profileUrl)) return;

        setActiveAnalysis('penalties');
        try {
            const result = await detectPenalties.mutateAsync();
            setPenaltyResult(result);
        } finally {
            setActiveAnalysis(null);
        }
    };

    /**
     * Clear results
     */
    const clearResults = () => {
        setVisibilityResult(null);
        setEngagementResult(null);
        setPenaltyResult(null);
    };

    /**
     * Handle platform change
     */
    const handlePlatformChange = (platform: SocialPlatform) => {
        setSelectedPlatform(platform);
        setProfileUrl('');
        setUrlError(null);
        clearResults();
    };

    /**
     * Get loading state
     */
    const isLoading = activeAnalysis !== null;
    const isAnalyzingVisibility = activeAnalysis === 'visibility';
    const isAnalyzingEngagement = activeAnalysis === 'engagement';
    const isDetectingPenalties = activeAnalysis === 'penalties';

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Social Account Analysis</CardTitle>
                <CardDescription>
                    Analyze your social media account for visibility, engagement, and potential penalties
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Platform Selection */}
                <div className="space-y-2">
                    <Label>Select Platform</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {PLATFORMS.map((platform) => {
                            const Icon = platform.icon;
                            const isSelected = selectedPlatform === platform.id;

                            return (
                                <Button
                                    key={platform.id}
                                    variant={isSelected ? 'default' : 'outline'}
                                    onClick={() => handlePlatformChange(platform.id)}
                                    disabled={isLoading}
                                    className="flex items-center gap-2"
                                >
                                    <Icon className={`h-4 w-4 ${isSelected ? '' : platform.color}`} />
                                    <span className="hidden sm:inline">{platform.name}</span>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Profile URL Input */}
                <div className="space-y-2">
                    <Label htmlFor="profile-url">
                        {currentPlatform.name} Profile URL
                    </Label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                id="profile-url"
                                type="url"
                                value={profileUrl}
                                onChange={(e) => {
                                    setProfileUrl(e.target.value);
                                    setUrlError(null);
                                }}
                                placeholder={currentPlatform.placeholder}
                                disabled={isLoading}
                                aria-invalid={!!urlError}
                                aria-describedby={urlError ? 'url-error' : undefined}
                            />
                            {urlError && (
                                <p id="url-error" className="text-sm text-red-600 mt-1" role="alert">
                                    {urlError}
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">
                        Enter the full URL of your {currentPlatform.name} profile
                    </p>
                </div>

                {/* Analysis Actions */}
                <div className="space-y-2">
                    <Label>Run Analysis</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Button
                            onClick={handleAnalyzeVisibility}
                            disabled={isLoading || !profileUrl}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            {isAnalyzingVisibility && <Loader2 className="h-4 w-4 animate-spin" />}
                            <TrendingUp className="h-4 w-4" />
                            Analyze Visibility
                        </Button>

                        <Button
                            onClick={handleAnalyzeEngagement}
                            disabled={isLoading || !profileUrl}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            {isAnalyzingEngagement && <Loader2 className="h-4 w-4 animate-spin" />}
                            <TrendingUp className="h-4 w-4" />
                            Analyze Engagement
                        </Button>

                        <Button
                            onClick={handleDetectPenalties}
                            disabled={isLoading || !profileUrl}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            {isDetectingPenalties && <Loader2 className="h-4 w-4 animate-spin" />}
                            <AlertCircle className="h-4 w-4" />
                            Detect Penalties
                        </Button>
                    </div>
                </div>

                {/* Loading Progress */}
                {isLoading && (
                    <Alert>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <AlertDescription>
                            Analyzing your {currentPlatform.name} account... This may take a few moments.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Results Tabs */}
                {(visibilityResult || engagementResult || penaltyResult) && (
                    <Tabs defaultValue="visibility" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="visibility" disabled={!visibilityResult}>
                                Visibility
                                {visibilityResult && (
                                    <Badge variant="secondary" className="ml-2">
                                        {visibilityResult.score}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="engagement" disabled={!engagementResult}>
                                Engagement
                                {engagementResult && (
                                    <Badge variant="secondary" className="ml-2">
                                        {engagementResult.score}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="penalties" disabled={!penaltyResult}>
                                Penalties
                                {penaltyResult?.penalties_found && (
                                    <Badge variant="destructive" className="ml-2">
                                        {penaltyResult.penalties.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        {/* Visibility Results */}
                        {visibilityResult && (
                            <TabsContent value="visibility" className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">Visibility Score</h4>
                                        <Badge
                                            variant={visibilityResult.score >= 70 ? 'default' : visibilityResult.score >= 40 ? 'secondary' : 'destructive'}
                                        >
                                            {visibilityResult.score}/100
                                        </Badge>
                                    </div>
                                    <Progress value={visibilityResult.score} className="h-2" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Impressions</p>
                                        <p className="text-2xl font-bold">
                                            {visibilityResult.reach_metrics.impressions.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Reach</p>
                                        <p className="text-2xl font-bold">
                                            {visibilityResult.reach_metrics.reach.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Visibility Rate</p>
                                        <p className="text-2xl font-bold">
                                            {(visibilityResult.reach_metrics.visibility_rate * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>

                                {visibilityResult.recommendations.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold">Recommendations</h4>
                                        <ul className="space-y-2">
                                            {visibilityResult.recommendations.map((rec, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm">{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500">
                                    Analyzed: {new Date(visibilityResult.analyzed_at).toLocaleString()}
                                </p>
                            </TabsContent>
                        )}

                        {/* Engagement Results */}
                        {engagementResult && (
                            <TabsContent value="engagement" className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">Engagement Score</h4>
                                        <Badge
                                            variant={engagementResult.score >= 70 ? 'default' : engagementResult.score >= 40 ? 'secondary' : 'destructive'}
                                        >
                                            {engagementResult.score}/100
                                        </Badge>
                                    </div>
                                    <Progress value={engagementResult.score} className="h-2" />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Likes</p>
                                        <p className="text-2xl font-bold">
                                            {engagementResult.engagement_metrics.likes.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Comments</p>
                                        <p className="text-2xl font-bold">
                                            {engagementResult.engagement_metrics.comments.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Shares</p>
                                        <p className="text-2xl font-bold">
                                            {engagementResult.engagement_metrics.shares.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Engagement Rate</p>
                                        <p className="text-2xl font-bold">
                                            {(engagementResult.engagement_metrics.engagement_rate * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>

                                {engagementResult.recommendations.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold">Recommendations</h4>
                                        <ul className="space-y-2">
                                            {engagementResult.recommendations.map((rec, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm">{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500">
                                    Analyzed: {new Date(engagementResult.analyzed_at).toLocaleString()}
                                </p>
                            </TabsContent>
                        )}

                        {/* Penalty Results */}
                        {penaltyResult && (
                            <TabsContent value="penalties" className="space-y-4">
                                {penaltyResult.penalties_found ? (
                                    <>
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                {penaltyResult.penalties.length} penalty(ies) detected on your account
                                            </AlertDescription>
                                        </Alert>

                                        <div className="space-y-3">
                                            {penaltyResult.penalties.map((penalty, index) => (
                                                <Card key={index}>
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="font-semibold">{penalty.type}</h4>
                                                                    <Badge
                                                                        variant={
                                                                            penalty.severity === 'HIGH' ? 'destructive' :
                                                                                penalty.severity === 'MEDIUM' ? 'secondary' :
                                                                                    'outline'
                                                                        }
                                                                    >
                                                                        {penalty.severity}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-gray-600">{penalty.description}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    Detected: {new Date(penalty.detected_at).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Alert>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <AlertDescription>
                                            No penalties detected on your account. Your account is in good standing!
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {penaltyResult.recommendations.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold">Recommendations</h4>
                                        <ul className="space-y-2">
                                            {penaltyResult.recommendations.map((rec, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm">{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500">
                                    Analyzed: {new Date(penaltyResult.analyzed_at).toLocaleString()}
                                </p>
                            </TabsContent>
                        )}
                    </Tabs>
                )}

                {/* Help Text */}
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Analysis results are based on publicly available data and platform algorithms.
                        For best results, ensure your profile is public during analysis.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
};
