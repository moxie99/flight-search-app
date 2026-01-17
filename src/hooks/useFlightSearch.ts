// ============================================================================
// Flight Search Hook
// React Query hook for searching flights with comprehensive state management
// ============================================================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { amadeusApi } from '../api/amadeus.client';
import { queryKeys } from '../api/queryClient';
import { CACHE_TIME } from '../config/constants';
import type {
  FlightSearchParams,
  FlightOffer,
  AmadeusFlightSearchResponse,
} from '../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface UseFlightSearchOptions {
  enabled?: boolean;
  onSuccess?: (data: AmadeusFlightSearchResponse) => void;
  onError?: (error: Error) => void;
}

interface UseFlightSearchReturn {
  flights: FlightOffer[];
  dictionaries: AmadeusFlightSearchResponse['dictionaries'];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  isSuccess: boolean;
  refetch: () => void;
  totalResults: number;
}

// -----------------------------------------------------------------------------
// Hook Implementation
// -----------------------------------------------------------------------------

export const useFlightSearch = (
  params: FlightSearchParams | null,
  options: UseFlightSearchOptions = {}
): UseFlightSearchReturn => {
  const { enabled = true, onSuccess, onError } = options;

  const isValidParams = useMemo(() => {
    if (!params) return false;
    return !!(
      params.originLocationCode &&
      params.destinationLocationCode &&
      params.departureDate &&
      params.adults > 0
    );
  }, [params]);

  const query = useQuery({
    queryKey: queryKeys.flights.search(params as unknown as Record<string, unknown>),
    queryFn: async () => {
      if (!params) throw new Error('Search parameters are required');
      const result = await amadeusApi.searchFlights(params);
      onSuccess?.(result);
      return result;
    },
    enabled: enabled && isValidParams,
    staleTime: CACHE_TIME.FLIGHTS,
    gcTime: CACHE_TIME.FLIGHTS * 2,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Handle error callback
  useMemo(() => {
    if (query.error && onError) {
      onError(query.error as Error);
    }
  }, [query.error, onError]);

  return {
    flights: query.data?.data ?? [],
    dictionaries: query.data?.dictionaries,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
    totalResults: query.data?.meta?.count ?? 0,
  };
};

// -----------------------------------------------------------------------------
// Prefetch Hook
// For optimistic data loading
// -----------------------------------------------------------------------------

export const usePrefetchFlights = () => {
  const queryClient = useQueryClient();

  const prefetch = async (params: FlightSearchParams) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.flights.search(params as unknown as Record<string, unknown>),
      queryFn: () => amadeusApi.searchFlights(params),
      staleTime: CACHE_TIME.FLIGHTS,
    });
  };

  return { prefetch };
};

export default useFlightSearch;
