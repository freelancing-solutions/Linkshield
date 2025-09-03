// src/components/ReportDetails.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ShareButton } from '@/components/ShareButton';
import { ShareModal } from '@/components/ShareModal';
import { 
  Shield, 
  Share2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Brain,
  Target,
  TrendingUp,
  FileText,
  Clock,
  ExternalLink,
  Globe
} from 'lucide-react';

interface ReportData {
  id: string;
  url: string;
  analyzedAt: Date;
  securityScore: number;
  statusCode: number;
  responseTime: number;
  sslValid: boolean;
  meta?: {
    title?: string;
    description?: string;
  };
  redirectChain?: Array<{ statusCode: number; url: string }>;
  isPublic: boolean;
  slug: string | null;
  shareCount: number;
  customTitle: string | null;
  customDescription: string | null;
  ogImageUrl: string | null;
  aiInsights?: {
    qualityScore?: number;
    summary?: string;
    topics?: string[];
    contentLength?: number;
  };
}

interface ReportDetailsProps {
  report: ReportData;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ report: initialReport }) => {
  const [report, setReport] = useState(initialReport);
  const { toast } = useToast();
  const router = useRouter();

  const getSecurityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'bg-green-500', icon: CheckCircle };
    if (score >= 60) return { level: 'Good', color: 'bg-yellow-500', icon: AlertTriangle };
    return { level: 'Poor', color: 'bg-red-500', icon: XCircle };
  };

  const getQualityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { level: 'Good', color: 'text-yellow-600' };
    return { level: 'Needs Improvement', color: 'text-red-600' };
  };

  const securityLevel = getSecurityLevel(report.securityScore);
  const qualityLevel = report.aiInsights?.qualityScore ? getQualityLevel(report.aiInsights.qualityScore) : null;

  const shareUrl = report.slug ? `${window.location.origin}/reports/${report.slug}` : window.location.href;

  const handlePrivacyToggle = async (checked: boolean) => {
    if (!report.slug) {
      toast({
        title: 'Error',
        description: 'Cannot change privacy for a report without a slug.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/reports/${report.slug}/privacy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic: checked }),
      });

      if (response.ok) {
        setReport((prev) => ({ ...prev, isPublic: checked }));
        toast({
          title: 'Success',
          description: `Report is now ${checked ? 'public' : 'private'}.`,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to update privacy.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating privacy:', error);
      toast({
        title: 'Error',
        description: 'Network error or server is unreachable.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              LinkShield Report
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Professional security and content analysis report
          </p>
        </div>

        {/* Report Card */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Security Analysis Report</CardTitle>
                  <CardDescription className="text-lg">
                    <a 
                      href={report.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {report.url}
                    </a>
                  </CardDescription>
                  <p className="text-sm text-gray-500 mt-1">
                    Analyzed on {new Date(report.analyzedAt).toLocaleDateString()} at {new Date(report.analyzedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <securityLevel.icon className={`h-6 w-6 ${securityLevel.color === 'bg-green-500' ? 'text-green-600' : securityLevel.color === 'bg-yellow-500' ? 'text-yellow-600' : 'text-red-600'}`} />
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${securityLevel.color}`}>
                      {securityLevel.level}
                    </span>
                  </div>
                  {report.aiInsights && (
                    <Badge variant="outline" className="text-sm">
                      <Brain className="w-4 h-4 mr-1" />
                      AI Enhanced
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="security" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="security">Security Analysis</TabsTrigger>
                  {report.aiInsights && (
                    <TabsTrigger value="ai">AI Insights</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="security" className="space-y-6">
                  {/* Security Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Security Score</span>
                      <span className="text-2xl font-bold">{report.securityScore}/100</span>
                    </div>
                    <Progress value={report.securityScore} className="h-3" />
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {report.statusCode}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        HTTP Status
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {report.responseTime}ms
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Response Time
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold mb-1 ${report.sslValid ? 'text-green-600' : 'text-red-600'}">
                        {report.sslValid ? 'Valid' : 'Invalid'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        SSL Certificate
                      </div>
                    </div>
                  </div>

                  {/* Meta Information */}
                  {report.meta && (report.meta.title || report.meta.description) && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Page Information</h3>
                      {report.meta.title && (
                        <div className="mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Title:</span>
                          <p className="font-medium">{report.meta.title}</p>
                        </div>
                      )}
                      {report.meta.description && (
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                          <p className="text-gray-700 dark:text-gray-300">{report.meta.description}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Redirect Chain */}
                  {report.redirectChain && report.redirectChain.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Redirect Chain</h3>
                      <div className="space-y-2">
                        {report.redirectChain.map((redirect: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="font-mono text-gray-600 dark:text-gray-400">
                              {redirect.statusCode}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 truncate">
                              {redirect.url}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {report.aiInsights && (
                  <TabsContent value="ai" className="space-y-6">
                    {/* Content Quality Score */}
                    {report.aiInsights.qualityScore && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-5 w-5 text-purple-600" />
                          <span className="text-sm font-medium">Content Quality Score</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-2xl font-bold">{report.aiInsights.qualityScore}/100</span>
                          {qualityLevel && (
                            <span className={`text-sm font-medium ${qualityLevel.color}`}>
                              {qualityLevel.level}
                            </span>
                          )}
                        </div>
                        <Progress value={report.aiInsights.qualityScore} className="h-3" />
                      </div>
                    )}

                    {/* AI Summary */}
                    {report.aiInsights.summary && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold">Content Summary</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          {report.aiInsights.summary}
                        </p>
                      </div>
                    )}

                    {/* Topics */}
                    {report.aiInsights.topics && report.aiInsights.topics.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <h3 className="text-lg font-semibold">Main Topics</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {report.aiInsights.topics.map((topic: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FileText className="h-4 w-4" />
                        <span>Content length: {Math.round(report.aiInsights.contentLength / 1024)}KB</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Estimated reading time: {Math.ceil(report.aiInsights.summary?.split(' ').length / 200 || 1)} min</span>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>

              {/* Share Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Share this report</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Show others that this link has been verified by LinkShield
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShareButton
                      shareData={{
                        url: shareUrl,
                        title: report.customTitle || `LinkShield Security Report for ${report.url}`,
                        text: report.customDescription || `Check out this security report for ${report.url} from LinkShield.`,
                        hashtags: ['LinkShield', 'Security', 'URLAnalysis'],
                        via: 'LinkShieldApp',
                      }}
                      ogImageUrl={report.ogImageUrl || undefined}
                    />
                    <ShareModal
                      shareData={{
                        url: shareUrl,
                        title: report.customTitle || `LinkShield Security Report for ${report.url}`,
                        text: report.customDescription || `Check out this security report for ${report.url} from LinkShield.`,
                        hashtags: ['LinkShield', 'Security', 'URLAnalysis'],
                        via: 'LinkShieldApp',
                      }}
                      ogImageUrl={report.ogImageUrl || undefined}
                    />
                  </div>
                </div>
                {report.slug && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="public-report"
                        checked={report.isPublic}
                        onCheckedChange={handlePrivacyToggle}
                      />
                      <Label htmlFor="public-report">Make Public</Label>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Shared {report.shareCount} time{report.shareCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Branding */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4" />
                  <span>Protected by LinkShield - Instant link safety verification</span>
                </div>
                <div className="mt-2">
                  <a 
                    href="/" 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Globe className="h-4 w-4 inline mr-1" />
                    Analyze another URL
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


export default ReportDetails;