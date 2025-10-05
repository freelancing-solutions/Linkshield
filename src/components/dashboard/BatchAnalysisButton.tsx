/**
 * BatchAnalysisButton Component
 * 
 * Provides batch analysis functionality for Pro+ users.
 * Shows upgrade CTA for users on lower plans.
 */

'use client';

import React, { useState } from 'react';
import { Play, Crown, Zap, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSubscriptionInfo } from '@/hooks/homepage';
import { useBatchAnalyze } from '@/hooks/homepage/use-social-protection';
import { hasFeatureAccess } from '@/lib/utils/dashboard/feature-gating';
import { UpgradeCTA } from './UpgradeCTA';
import { toast } from 'sonner';
import Link from 'next/link';

interface BatchAnalysisFormData {
  urls: string[];
  includeVisibility: boolean;
  includeEngagement: boolean;
  includePenalties: boolean;
}

export const BatchAnalysisButton: React.FC = () => {
  const { subscription, isLoading: subscriptionLoading } = useSubscriptionInfo();
  const batchAnalyze = useBatchAnalyze();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [urlsText, setUrlsText] = useState('');
  const [formData, setFormData] = useState<BatchAnalysisFormData>({
    urls: [],
    includeVisibility: true,
    includeEngagement: true,
    includePenalties: true,
  });

  // Check feature access using the new feature gating system
  const currentPlan = subscription?.plan || 'FREE';
  const currentStatus = subscription?.status || 'INACTIVE';
  const hasBatchAccess = hasFeatureAccess('BATCH_ANALYSIS', currentPlan, currentStatus);

  // Legacy check for backward compatibility
  const isPro = subscription?.plan === 'PRO' || subscription?.plan === 'ENTERPRISE';
  const isActive = subscription?.status === 'ACTIVE';
  const hasProAccess = isPro && isActive;

  /**
   * Parse URLs from textarea input
   */
  const parseUrls = (text: string): string[] => {
    return text
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0 && url.startsWith('http'));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    const urls = parseUrls(urlsText);
    
    if (urls.length === 0) {
      toast.error('Please enter at least one valid URL');
      return;
    }

    if (urls.length > 50) {
      toast.error('Maximum 50 URLs allowed per batch');
      return;
    }

    if (!formData.includeVisibility && !formData.includeEngagement && !formData.includePenalties) {
      toast.error('Please select at least one analysis type');
      return;
    }

    try {
      await batchAnalyze.mutateAsync({
        urls,
        analysis_types: {
          visibility: formData.includeVisibility,
          engagement: formData.includeEngagement,
          penalties: formData.includePenalties,
        },
      });

      toast.success('Batch analysis started successfully');
      setModalOpen(false);
      setUrlsText('');
      setFormData({
        urls: [],
        includeVisibility: true,
        includeEngagement: true,
        includePenalties: true,
      });
    } catch (error) {
      // Error handling is done by the hook
      console.error('Batch analysis failed:', error);
    }
  };

  /**
   * Handle URL text change
   */
  const handleUrlsChange = (value: string) => {
    setUrlsText(value);
    const urls = parseUrls(value);
    setFormData(prev => ({ ...prev, urls }));
  };

  // Show loading state while checking subscription
  if (subscriptionLoading) {
    return (
      <Button disabled size="sm" variant="outline">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  // Show upgrade CTA for users without batch analysis access
  if (!hasBatchAccess) {
    return (
      <UpgradeCTA
        feature="BATCH_ANALYSIS"
        currentPlan={currentPlan}
        currentStatus={currentStatus}
        variant="card"
        title="Batch Analysis - Pro Feature"
        description="Analyze multiple social media accounts simultaneously with comprehensive insights"
      />
    );
  }

  // Show batch analysis button for Pro+ users
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
          <Play className="mr-2 h-4 w-4" />
          Batch Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-purple-600" />
            Batch Analysis
            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              Pro Feature
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* URLs Input */}
          <div className="space-y-2">
            <Label htmlFor="urls">Social Media URLs</Label>
            <Textarea
              id="urls"
              placeholder="Enter social media URLs (one per line)&#10;https://instagram.com/username&#10;https://twitter.com/username&#10;https://facebook.com/username"
              value={urlsText}
              onChange={(e) => handleUrlsChange(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{formData.urls.length} valid URLs detected</span>
              <span>Maximum 50 URLs</span>
            </div>
          </div>

          {/* Analysis Types */}
          <div className="space-y-3">
            <Label>Analysis Types</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="visibility"
                  checked={formData.includeVisibility}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, includeVisibility: !!checked }))
                  }
                />
                <Label htmlFor="visibility" className="text-sm font-normal">
                  Visibility Analysis
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    Check shadowbanning and reach limitations
                  </span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="engagement"
                  checked={formData.includeEngagement}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, includeEngagement: !!checked }))
                  }
                />
                <Label htmlFor="engagement" className="text-sm font-normal">
                  Engagement Analysis
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    Analyze likes, comments, and engagement rates
                  </span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="penalties"
                  checked={formData.includePenalties}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, includePenalties: !!checked }))
                  }
                />
                <Label htmlFor="penalties" className="text-sm font-normal">
                  Penalty Detection
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    Detect algorithm penalties and restrictions
                  </span>
                </Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Analysis will be processed in the background
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={batchAnalyze.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={batchAnalyze.isPending || formData.urls.length === 0}
              >
                {batchAnalyze.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Analysis...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Batch Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};