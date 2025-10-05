'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  ExternalLink,
  Copy,
  Share2,
} from 'lucide-react';
import { useCrisisRecommendations } from '@/hooks/dashboard';
import { toast } from 'sonner';
import type { CrisisAlert, CrisisRecommendation, RecommendationPriority } from '@/types/dashboard';

interface CrisisRecommendationsDrawerProps {
  alert: CrisisAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Crisis Recommendations Drawer Component
 * 
 * Displays AI-generated recommendations for crisis alerts in a slide-in drawer.
 * Shows prioritized recommendations with action buttons and implementation guidance.
 * 
 * Features:
 * - Prioritized recommendations list
 * - Action buttons for each recommendation
 * - Copy and share functionality
 * - Implementation guidance
 * - Real-time updates
 */
export function CrisisRecommendationsDrawer({
  alert,
  open,
  onOpenChange,
}: CrisisRecommendationsDrawerProps) {
  const [copiedRecommendation, setCopiedRecommendation] = useState<string | null>(null);

  // Fetch crisis recommendations
  const { data: recommendations, isLoading, error } = useCrisisRecommendations(
    alert?.id || '',
    {
      enabled: !!alert?.id && open,
    }
  );

  /**
   * Get priority badge variant
   */
  const getPriorityBadgeVariant = (priority: RecommendationPriority) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  /**
   * Get priority color
   */
  const getPriorityColor = (priority: RecommendationPriority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  /**
   * Handle copy recommendation
   */
  const handleCopyRecommendation = async (recommendation: CrisisRecommendation) => {
    try {
      const text = `${recommendation.title}\n\n${recommendation.description}\n\nAction Items:\n${recommendation.action_items.map(item => `• ${item}`).join('\n')}\n\nEstimated Impact: ${recommendation.estimated_impact}`;
      
      await navigator.clipboard.writeText(text);
      setCopiedRecommendation(recommendation.id);
      toast.success('Recommendation copied to clipboard');
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedRecommendation(null), 2000);
    } catch (error) {
      toast.error('Failed to copy recommendation');
    }
  };

  /**
   * Handle share recommendation
   */
  const handleShareRecommendation = async (recommendation: CrisisRecommendation) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Crisis Recommendation: ${recommendation.title}`,
          text: recommendation.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      handleCopyRecommendation(recommendation);
    }
  };

  /**
   * Handle implement recommendation
   */
  const handleImplementRecommendation = (recommendation: CrisisRecommendation) => {
    // This would typically open a task creation modal or redirect to implementation
    toast.info('Implementation tracking coming soon');
  };

  if (!alert) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Crisis Recommendations
          </SheetTitle>
          <SheetDescription>
            AI-generated recommendations for resolving this crisis alert
          </SheetDescription>
        </SheetHeader>

        {/* Alert Summary */}
        <div className="mt-6 p-4 rounded-lg border bg-muted/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">{alert.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    alert.severity === 'critical' || alert.severity === 'high'
                      ? 'destructive'
                      : 'default'
                  }
                  className="capitalize"
                >
                  {alert.severity}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {alert.type}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  Impact: {alert.impact_score}/100
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Recommendations Content */}
        <ScrollArea className="flex-1 -mx-6 px-6">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 w-full" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to load recommendations. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {recommendations && recommendations.length === 0 && (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Recommendations Available</h3>
              <p className="text-sm text-muted-foreground">
                No specific recommendations are available for this crisis alert at this time.
              </p>
            </div>
          )}

          {recommendations && recommendations.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recommendations</h3>
                <Badge variant="outline">{recommendations.length} items</Badge>
              </div>

              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <div
                    key={recommendation.id}
                    className={`rounded-lg border p-4 space-y-4 ${getPriorityColor(recommendation.priority)}`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <Badge
                            variant={getPriorityBadgeVariant(recommendation.priority)}
                            className="capitalize"
                          >
                            {recommendation.priority}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-base mb-2">
                          {recommendation.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {recommendation.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Items */}
                    {recommendation.action_items.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-2">Action Items:</h5>
                        <ul className="space-y-1">
                          {recommendation.action_items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Estimated Impact */}
                    {recommendation.estimated_impact && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Estimated Impact:</span>
                        <span className="text-muted-foreground">
                          {recommendation.estimated_impact}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => handleImplementRecommendation(recommendation)}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Implement
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyRecommendation(recommendation)}
                      >
                        {copiedRecommendation === recommendation.id ? (
                          <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                        {copiedRecommendation === recommendation.id ? 'Copied' : 'Copy'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShareRecommendation(recommendation)}
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer Actions */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} available
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button onClick={() => toast.info('Bulk implementation coming soon')}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Implement All
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}