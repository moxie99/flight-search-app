// ============================================================================
// React Query Client Configuration
// Enterprise-grade query client with optimal caching and retry strategies
// ============================================================================

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - how long data is considered fresh
      staleTime: 1000 * 60 * 5, // 5 minutes
      
      // Cache time - how long inactive data stays in cache
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      
      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error) {
          const message = error.message.toLowerCase();
          if (
            message.includes('not found') ||
            message.includes('invalid') ||
            message.includes('unauthorized') ||
            message.includes('forbidden')
          ) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch configuration
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      // Network mode
      networkMode: 'online',
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
      networkMode: 'online',
    },
  },
});

// -----------------------------------------------------------------------------
// Query Key Factory
// Centralized query key management for type safety and consistency
// -----------------------------------------------------------------------------

export const queryKeys = {
  // Flight queries
  flights: {
    all: ['flights'] as const,
    searches: () => [...queryKeys.flights.all, 'search'] as const,
    search: (params: Record<string, unknown>) => 
      [...queryKeys.flights.searches(), params] as const,
    offers: () => [...queryKeys.flights.all, 'offers'] as const,
    offer: (id: string) => [...queryKeys.flights.offers(), id] as const,
  },
  
  // Airport queries
  airports: {
    all: ['airports'] as const,
    searches: () => [...queryKeys.airports.all, 'search'] as const,
    search: (keyword: string) => [...queryKeys.airports.searches(), keyword] as const,
    details: () => [...queryKeys.airports.all, 'details'] as const,
    detail: (code: string) => [...queryKeys.airports.details(), code] as const,
  },
  
  // Price analysis queries
  prices: {
    all: ['prices'] as const,
    analysis: () => [...queryKeys.prices.all, 'analysis'] as const,
    trends: (params: Record<string, unknown>) => 
      [...queryKeys.prices.analysis(), params] as const,
  },
} as const;

export default queryClient;
