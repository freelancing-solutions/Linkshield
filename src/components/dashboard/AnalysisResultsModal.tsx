'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  Heart, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  MessageCircle,
  Share2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import type { 
  VisibilityAnalysis, 
  EngagementAnalysis, 
  PenaltyDetection 
} from '@/types/homepage';

type AnalysisResult = VisibilityAnalysis | EngagementAnalysis | PenaltyDetection;
type AnalysisType = 'visibility' | 'engagement' | 'penalties';

interface AnalysisResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: AnalysisResult | null;
  type: AnalysisType;
}

/**
 * Analysis Results Modal Component
 * 
 * Displays detailed analysis results in a modal dialog.
 * Supports visibility analysis, engagement analysis, and penalty detection results.
 * 
 * Features:
 * - Type-specific result display
 * - Metrics visualization
 * - Recommendations list
 * - Severity indicators
 * - Timestamp information
 */
export function AnalysisResultsModal({
  open,
  onOpenChange,
  result,
  type,
}: AnalysisResultsModalProps) {
  if (!result) return null;

  const renderVisibilityResults = (analysis: VisibilityAnalysis) => (
    <div className="space-y-6">
      {/* Score Header */}
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {analysis.score}%
        </div>
        <p className="text-muted-foreground">Visibility Score</p>
      </div>

      <Separator />

      {/* Reach Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Reach Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analysis.reach_metrics.impressions.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Impressions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {analysis.reach_metrics.reach.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Reach</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(analysis.reach_metrics.visibility_rate * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">Visibility Rate</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <div className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderEngagementResults = (analysis: EngagementAnalysis) => (
    <div className="space-y-6">
      {/* Score Header */}
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {analysis.score}%
        </div>
        <p className="text-muted-foreground">Engagement Score</p>
      </div>

      <Separator />

      {/* Engagement Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Engagement Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">
                {analysis.engagement_metrics.likes.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Likes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {analysis.engagement_metrics.comments.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Comments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {analysis.engagement_metrics.shares.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Shares</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">
                {(analysis.engagement_metrics.engagement_rate * 100).toFixed(2)}%
              </div>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <div className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPenaltyResults = (detection: PenaltyDetection) => (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {detection.penalties_found ? (
            <XCircle className="h-8 w-8 text-red-500" />
          ) : (
            <CheckCircle className="h-8 w-8 text-green-500" />
          )}
          <div className="text-2xl font-bold">
            {detection.penalties_found ? 'Penalties Detected' : 'No Penalties Found'}
          </div>
        </div>
        <p className="text-muted-foreground">
          {detection.penalties_found 
            ? `${detection.penalties.length} penalty(ies) detected`
            : 'Your account appears to be in good standing'
          }
        </p>
      </div>

      <Separator />

      {/* Penalties List */}
      {detection.penalties_found && detection.penalties.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Detected Penalties
          </h3>
          <div className="space-y-3">
            {detection.penalties.map((penalty, index) => (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{penalty.type}</h4>
                    <Badge 
                      variant={
                        penalty.severity === 'HIGH' ? 'destructive' : 
                        penalty.severity === 'MEDIUM' ? 'secondary' : 'outline'
                      }
                    >
                      {penalty.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {penalty.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Detected: {new Date(penalty.detected_at).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {detection.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <div className="space-y-2">
            {detection.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const getModalTitle = () => {
    switch (type) {
      case 'visibility':
        return 'Visibility Analysis Results';
      case 'engagement':
        return 'Engagement Analysis Results';
      case 'penalties':
        return 'Penalty Detection Results';
      default:
        return 'Analysis Results';
    }
  };

  const getModalIcon = () => {
    switch (type) {
      case 'visibility':
        return <Eye className="h-5 w-5" />;
      case 'engagement':
        return <Heart className="h-5 w-5" />;
      case 'penalties':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const renderResults = () => {
    switch (type) {
      case 'visibility':
        return renderVisibilityResults(result as VisibilityAnalysis);
      case 'engagement':
        return renderEngagementResults(result as EngagementAnalysis);
      case 'penalties':
        return renderPenaltyResults(result as PenaltyDetection);
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getModalIcon()}
            {getModalTitle()}
          </DialogTitle>
          <DialogDescription>
            Detailed analysis results and recommendations for your social media account.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {renderResults()}
          
          {/* Analysis Timestamp */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Analyzed: {new Date(
                'analyzed_at' in result ? result.analyzed_at : Date.now()
              ).toLocaleString()}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}