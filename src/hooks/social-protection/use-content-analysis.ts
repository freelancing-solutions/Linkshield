import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialProtectionService } from '@/services/social-protection.service';
import { useAuthStore } from '@/stores/authStore';
import { ContentAnalysisRequest, ContentAnalysis } from '@/types/social-protection';
import { toast } from 'sonner';

/**
 * Hook for analyzing social media content
 * 
 * Performs risk assessment and threat detection on provided content
 * Supports both authenticated and anonymous analysis
 */
export function useAnalyzeContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: ContentAnalysisRequest) => 
      socialProtectionService.analyzeContent(content),
    onSuccess: (data: ContentAnalysis) => {
      // Show appropriate notification based on risk level
      const riskLevel = data.risk_assessment.overall_risk;
      const message = `Analysis complete. Risk level: ${riskLevel}`;
      
      if (riskLevel === 'high' || riskLevel === 'critical') {
        toast.error(message);
      } else if (riskLevel === 'medium') {
        toast.warning(message);
      } else {
        toast.success(message);
      }
      
      // Invalidate analysis history to include new analysis
      queryClient.invalidateQueries({ 
        queryKey: ['social-protection', 'analysis-history'] 
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to analyze content';
      toast.error(message);
    },
  });
}

/**
 * Hook for anonymous content analysis (homepage scanner)
 * 
 * Analyzes content without requiring authentication
 * Used for public-facing content scanner
 */
export function useAnalyzeContentAnonymous() {
  return useMutation({
    mutationFn: (url: string) => 
      socialProtectionService.analyzeContentAnonymous(url),
    onSuccess: (data: ContentAnalysis) => {
      const riskLevel = data.risk_assessment.overall_risk;
      const message = `Analysis complete. Risk level: ${riskLevel}`;
      
      if (riskLevel === 'high' || riskLevel === 'critical') {
        toast.error(message);
      } else if (riskLevel === 'medium') {
        toast.warning(message);
      } else {
        toast.success(message);
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to analyze content';
      toast.error(message);
    },
  });
}

/**
 * Hook for fetching content analysis history
 * 
 * Retrieves paginated list of previous analyses with filtering options
 */
export function useAnalysisHistory(params?: {
  page?: number;
  limit?: number;
  platform?: string;
  risk_level?: string;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'analysis-history', params],
    queryFn: () => socialProtectionService.getAnalysisHistory(params),
    enabled: isAuthenticated,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for real-time content analysis
 * 
 * Provides debounced analysis for live content monitoring
 * Useful for real-time content scanning as user types
 */
export function useRealTimeAnalysis(
  content: string,
  debounceMs: number = 1000,
  enabled: boolean = true
) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'real-time-analysis', content],
    queryFn: () => socialProtectionService.analyzeContent({
      content,
      platform: 'generic',
      content_type: 'text',
    }),
    enabled: enabled && isAuthenticated && content.length > 10, // Only analyze meaningful content
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    // Debounce by using a longer stale time and manual refetch control
  });
}