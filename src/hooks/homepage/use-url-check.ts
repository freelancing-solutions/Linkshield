/**
 * URL Check Hooks
 * 
 * React Query hooks for URL checking and domain reputation.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { urlCheckService } from '@/services/url-check.service';
import type { ScanType } from '@/types/homepage';

/**
 * Hook for checking URLs
 * 
 * @returns Mutation hook for URL checking
 * 
 * @example
 * ```tsx
 * const checkURL = useCheckURL();
 * 
 * const handleSubmit = async () => {
 *   try {
 *     const result = await checkURL.mutateAsync({
 *       url: 'https://example.com',
 *       scanType: 'SECURITY'
 *     });
 *     console.log('Risk score:', result.risk_score);
 *   } catch (error) {
 *     console.error('Check failed:', error);
 *   }
 * };
 * ```
 */
export const useCheckURL = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ url, scanType }: { url: string; scanType: ScanType }) =>
            urlCheckService.checkURL(url, scanType),
        onSuccess: (data) => {
            // Cache the result
            queryClient.setQueryData(['url-check', data.check_id], data);

            // Show success message based on threat level
            if (data.threat_level === 'SAFE') {
                toast.success('URL is safe!');
            } else if (data.threat_level === 'SUSPICIOUS') {
                toast.warning('URL appears suspicious. Review the details.');
            } else {
                toast.error('Warning: Malicious URL detected!');
            }
        },
        onError: (error: any) => {
            const errorCode = error.response?.data?.error_code;

            if (errorCode === 'RATE_LIMIT_EXCEEDED') {
                toast.error('Rate limit reached. Sign up for more checks!');
            } else if (errorCode === 'INVALID_URL_FORMAT') {
                toast.error('Invalid URL format. Please check and try again.');
            } else if (errorCode === 'SCAN_TIMEOUT') {
                toast.error('URL analysis timed out. Please try again.');
            } else {
                toast.error('Failed to check URL. Please try again.');
            }
        },
    });
};

/**
 * Hook for fetching domain reputation
 * 
 * @param domain - The domain to check (e.g., 'example.com')
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query hook with reputation data
 * 
 * @example
 * ```tsx
 * const { data: reputation, isLoading } = useDomainReputation('example.com');
 * 
 * if (isLoading) return <Spinner />;
 * if (reputation) {
 *   return <Badge status={reputation.status} />;
 * }
 * ```
 */
export const useDomainReputation = (domain: string, enabled = true) => {
    return useQuery({
        queryKey: ['domain-reputation', domain],
        queryFn: () => urlCheckService.getDomainReputation(domain),
        enabled: enabled && !!domain && domain.length > 0,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        retry: 1,
        // Don't show error toast for reputation failures (it's optional data)
        onError: () => {
            // Silently fail - reputation is supplementary information
        },
    });
};
