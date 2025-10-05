/**
 * URL Check Service
 * 
 * Handles all URL checking and domain reputation API calls.
 * Supports both anonymous and authenticated requests.
 */

import { apiClient } from './api';
import type {
  URLCheckRequest,
  URLCheckResponse,
  DomainReputation,
} from '@/types/homepage';

export const urlCheckService = {
  /**
   * Check a URL for security threats
   * 
   * @param url - The URL to check
   * @param scanType - Type of scan to perform
   * @returns Promise with check results
   * 
   * @example
   * ```ts
   * const result = await urlCheckService.checkURL('https://example.com', 'SECURITY');
   * console.log('Risk score:', result.risk_score);
   * ```
   */
  checkURL: async (
    url: string,
    scanType: URLCheckRequest['scan_type']
  ): Promise<URLCheckResponse> => {
    const payload: URLCheckRequest = {
      url,
      scan_type: scanType,
      include_broken_links: scanType === 'DEEP',
    };

    return apiClient.post<URLCheckResponse>('/url-check/check', payload);
  },

  /**
   * Get domain reputation information
   * 
   * @param domain - The domain to check (e.g., 'example.com')
   * @returns Promise with reputation data
   * 
   * @example
   * ```ts
   * const reputation = await urlCheckService.getDomainReputation('example.com');
   * console.log('Reputation:', reputation.status);
   * ```
   */
  getDomainReputation: async (domain: string): Promise<DomainReputation> => {
    return apiClient.get<DomainReputation>(`/url-check/reputation/${domain}`);
  },
};
