// ============================================================================
// Airport Search Hook
// React Query hook for airport autocomplete with debouncing
// ============================================================================

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { amadeusApi } from '../api/amadeus.client';
import { queryKeys } from '../api/queryClient';
import { CACHE_TIME } from '../config/constants';
import type { Airport } from '../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AirportResult {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
  detailedName: string;
  type: string;
}

interface UseAirportSearchReturn {
  airports: AirportResult[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
}

// -----------------------------------------------------------------------------
// Debounce Hook
// -----------------------------------------------------------------------------

const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// -----------------------------------------------------------------------------
// Hook Implementation
// -----------------------------------------------------------------------------

export const useAirportSearch = (
  initialValue: string = '',
  debounceMs: number = 300
): UseAirportSearchReturn => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const query = useQuery({
    queryKey: queryKeys.airports.search(debouncedSearchTerm),
    queryFn: () => amadeusApi.searchAirports(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 2,
    staleTime: CACHE_TIME.AIRPORTS,
    gcTime: CACHE_TIME.AIRPORTS * 2,
  });

  const airports: AirportResult[] = useMemo(() => {
    if (!query.data?.data) return [];

    return query.data.data.map((item) => ({
      iataCode: item.iataCode,
      name: item.name,
      cityName: item.address.cityName,
      countryCode: item.address.countryCode,
      detailedName: item.detailedName,
      type: item.subType,
    }));
  }, [query.data]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    airports,
    isLoading: query.isLoading && debouncedSearchTerm.length >= 2,
    isError: query.isError,
    error: query.error as Error | null,
    searchTerm,
    setSearchTerm,
    clearSearch,
  };
};

// -----------------------------------------------------------------------------
// Convert to Airport type helper
// -----------------------------------------------------------------------------

export const toAirport = (result: AirportResult): Airport => ({
  iataCode: result.iataCode,
  name: result.name,
  cityName: result.cityName,
  countryCode: result.countryCode,
});

export default useAirportSearch;
