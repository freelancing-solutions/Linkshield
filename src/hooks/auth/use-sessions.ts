import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for fetching user sessions
 */
export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => authService.getSessions(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
}

/**
 * Hook for revoking a specific session
 */
export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
    onSuccess: () => {
      // Invalidate sessions query to refetch
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session revoked successfully');
    },
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 404) {
        toast.error('Session not found or already revoked.');
      } else {
        toast.error('Failed to revoke session. Please try again.');
      }

      // Refetch sessions to get current state
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

/**
 * Hook for terminating all sessions except current
 */
export function useTerminateAllSessions() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.terminateAllSessions(),
    onSuccess: () => {
      toast.success('All other sessions terminated successfully');

      // Invalidate sessions query
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: () => {
      toast.error('Failed to terminate sessions. Please try again.');
    },
  });
}
