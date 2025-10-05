import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/services/search.service';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for global search across features
 * 
 * @param query - Search query string
 * @param params - Optional search parameters
 * @example
 * ```tsx
 * const { data: results, isLoading } = useSearch('security alert', {
 *   types: ['alert', 'project'],
 *   limit: 20
 * });
 * ```
 */
export function useSearch(
  query: string,
  params?: {
    types?: string[];
    limit?: number;
    project_id?: string;
  }
) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['search', query, params],
    queryFn: () => searchService.search(query, params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: isAuthenticated && query.length >= 2, // Only search if query is at least 2 characters
  });
}

/**
 * Hook for search suggestions (autocomplete)
 * 
 * @param query - Partial search query
 * @param limit - Max number of suggestions
 * @example
 * ```tsx
 * const { data: suggestions, isLoading } = useSearchSuggestions('sec', 5);
 * ```
 */
export function useSearchSuggestions(query: string, limit: number = 5) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['search', 'suggestions', query, limit],
    queryFn: () => searchService.getSuggestions(query, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: isAuthenticated && query.length >= 2,
  });
}

/**
 * Hook for fetching recent searches
 * 
 * @param limit - Max number of recent searches
 * @example
 * ```tsx
 * const { data: recentSearches, isLoading } = useRecentSearches(10);
 * ```
 */
export function useRecentSearches(limit: number = 10) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['search', 'recent', limit],
    queryFn: () => searchService.getRecentSearches(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: isAuthenticated,
  });
}
