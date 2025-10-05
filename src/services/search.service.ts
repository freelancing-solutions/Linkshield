import { apiClient } from './api';
import type { SearchResponse } from '@/types/dashboard';

/**
 * Search API Service
 * 
 * Handles global search across all dashboard features
 */
export const searchService = {
  /**
   * Perform global search across features
   * 
   * @param query - Search query string
   * @param params - Optional search parameters
   * @returns Promise with search results
   * @requires Authentication
   * 
   * @example
   * ```ts
   * const results = await searchService.search('security alert', {
   *   types: ['alert', 'project'],
   *   limit: 20
   * });
   * ```
   */
  search: async (
    query: string,
    params?: {
      types?: string[]; // Filter by result types
      limit?: number; // Max results per type
      project_id?: string; // Filter by project
    }
  ): Promise<SearchResponse> => {
    return apiClient.get('/search', {
      params: {
        q: query,
        ...params,
      },
    });
  },

  /**
   * Get search suggestions (autocomplete)
   * 
   * @param query - Partial search query
   * @param limit - Max number of suggestions
   * @returns Promise with suggestion strings
   * @requires Authentication
   */
  getSuggestions: async (query: string, limit: number = 5): Promise<string[]> => {
    return apiClient.get('/search/suggestions', {
      params: { q: query, limit },
    });
  },

  /**
   * Get recent searches for the user
   * 
   * @param limit - Max number of recent searches
   * @returns Promise with recent search queries
   * @requires Authentication
   */
  getRecentSearches: async (limit: number = 10): Promise<string[]> => {
    return apiClient.get('/search/recent', {
      params: { limit },
    });
  },

  /**
   * Clear recent searches
   * 
   * @returns Promise that resolves when cleared
   * @requires Authentication
   */
  clearRecentSearches: async (): Promise<void> => {
    return apiClient.delete('/search/recent');
  },
};
