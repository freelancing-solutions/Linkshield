import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialProtectionService } from '@/services/social-protection.service';
import { useAuthStore } from '@/stores/authStore';
import { ScanCredentials, PlatformScan } from '@/types/social-protection';
import { toast } from 'sonner';

/**
 * Hook for initiating a platform scan
 * 
 * Handles the process of connecting to a platform and starting a scan
 * with proper error handling and success notifications
 */
export function useInitiateScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: ScanCredentials) => 
      socialProtectionService.initiateScan(credentials),
    onSuccess: (data: PlatformScan) => {
      toast.success(`Scan initiated for ${data.platform}. Tracking ID: ${data.scan_id}`);
      
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['social-protection', 'scans'] });
      queryClient.invalidateQueries({ queryKey: ['social-protection', 'dashboard'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to initiate scan';
      toast.error(message);
    },
  });
}

/**
 * Hook for polling scan status
 * 
 * Automatically polls scan status until completion
 * Used for real-time progress updates
 */
export function useScanStatus(scanId: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['social-protection', 'scan-status', scanId],
    queryFn: () => socialProtectionService.getScanStatus(scanId!),
    enabled: enabled && !!scanId,
    refetchInterval: (data) => {
      // Stop polling when scan is complete or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      return 3000; // Poll every 3 seconds
    },
    staleTime: 0, // Always fetch fresh data
    gcTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook for fetching all user scans with pagination and filtering
 */
export function useScans(params?: {
  page?: number;
  limit?: number;
  platform?: string;
  status?: string;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['social-protection', 'scans', params],
    queryFn: () => socialProtectionService.getScans(params),
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for disconnecting a platform
 * 
 * Removes platform connection and invalidates related data
 */
export function useDisconnectPlatform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (platform: string) => 
      socialProtectionService.disconnectPlatform(platform),
    onSuccess: (_, platform) => {
      toast.success(`Disconnected from ${platform}`);
      
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['social-protection', 'scans'] });
      queryClient.invalidateQueries({ queryKey: ['social-protection', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['social-protection', 'algorithm-health'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to disconnect platform';
      toast.error(message);
    },
  });
}

/**
 * Hook for testing platform credentials without saving
 * 
 * Validates credentials before initiating a full scan
 */
export function useTestCredentials() {
  return useMutation({
    mutationFn: (credentials: ScanCredentials) => 
      socialProtectionService.testCredentials(credentials),
    onSuccess: (data) => {
      if (data.valid) {
        toast.success('Credentials validated successfully');
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to test credentials';
      toast.error(message);
    },
  });
}

/**
 * Hook for fetching supported platforms and their credential requirements
 * 
 * Used for platform selection and form generation
 */
export function useSupportedPlatforms() {
  return useQuery({
    queryKey: ['social-protection', 'supported-platforms'],
    queryFn: () => socialProtectionService.getSupportedPlatforms(),
    staleTime: 60 * 60 * 1000, // 1 hour - platform info changes rarely
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}