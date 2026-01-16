// ============================================================================
// Flight Filters Hook
// Comprehensive filter state management with memoized filtering logic
// ============================================================================

import { useState, useMemo, useCallback } from 'react';
import type {
  FlightOffer,
  FlightFilters,
  StopFilter,
  PriceRange,
  FilteredFlightResults,
  SortOption,
  PriceGraphDataPoint,
} from '../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface UseFlightFiltersOptions {
  flights: FlightOffer[];
  dictionaries?: {
    carriers?: Record<string, string>;
  };
}

interface UseFlightFiltersReturn {
  // Filtered results
  filteredFlights: FlightOffer[];
  priceStats: FilteredFlightResults['priceStats'];
  airlineOptions: FilteredFlightResults['airlineOptions'];
  priceGraphData: PriceGraphDataPoint[];
  
  // Filter state
  filters: FlightFilters;
  sortOption: SortOption;
  
  // Filter actions
  setStopFilters: (stops: StopFilter[]) => void;
  setPriceRange: (range: PriceRange) => void;
  setAirlineFilters: (airlines: string[]) => void;
  setSortOption: (option: SortOption) => void;
  resetFilters: () => void;
  
  // Computed values
  totalFiltered: number;
  hasActiveFilters: boolean;
}

// -----------------------------------------------------------------------------
// Default Values
// -----------------------------------------------------------------------------

const defaultFilters: FlightFilters = {
  stops: [],
  priceRange: { min: 0, max: Infinity },
  airlines: [],
  departureTimeRange: { start: '00:00', end: '23:59' },
  arrivalTimeRange: { start: '00:00', end: '23:59' },
  duration: null,
};

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

const getFlightStops = (flight: FlightOffer): number => {
  return flight.itineraries.reduce((total, itinerary) => {
    const segmentStops = itinerary.segments.reduce(
      (sum, segment) => sum + segment.numberOfStops,
      0
    );
    // Also count connections between segments
    const connections = Math.max(0, itinerary.segments.length - 1);
    return total + segmentStops + connections;
  }, 0);
};

const getFlightPrice = (flight: FlightOffer): number => {
  return parseFloat(flight.price.grandTotal);
};

const getFlightDuration = (flight: FlightOffer): number => {
  // Parse ISO 8601 duration to minutes
  const duration = flight.itineraries[0]?.duration || 'PT0H0M';
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = parseInt(matches?.[1] || '0', 10);
  const minutes = parseInt(matches?.[2] || '0', 10);
  return hours * 60 + minutes;
};

const getDepartureTime = (flight: FlightOffer): Date => {
  return new Date(flight.itineraries[0]?.segments[0]?.departure.at);
};

// -----------------------------------------------------------------------------
// Hook Implementation
// -----------------------------------------------------------------------------

export const useFlightFilters = ({
  flights,
  dictionaries,
}: UseFlightFiltersOptions): UseFlightFiltersReturn => {
  const [filters, setFilters] = useState<FlightFilters>(defaultFilters);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');

  // Calculate price range from all flights
  const globalPriceRange = useMemo((): PriceRange => {
    if (flights.length === 0) return { min: 0, max: 1000 };
    const prices = flights.map(getFlightPrice);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  // Calculate available airline options
  const airlineOptions = useMemo(() => {
    const airlineCounts = new Map<string, number>();
    
    flights.forEach((flight) => {
      flight.validatingAirlineCodes.forEach((code) => {
        airlineCounts.set(code, (airlineCounts.get(code) || 0) + 1);
      });
    });

    return Array.from(airlineCounts.entries())
      .map(([code, count]) => ({
        code,
        name: dictionaries?.carriers?.[code] || code,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [flights, dictionaries]);

  // Apply filters
  const filteredFlights = useMemo(() => {
    let result = [...flights];

    // Filter by stops
    if (filters.stops.length > 0) {
      result = result.filter((flight) => {
        const stops = getFlightStops(flight);
        return filters.stops.some((filter) => {
          if (filter === 'non-stop') return stops === 0;
          if (filter === '1-stop') return stops === 1;
          if (filter === '2+-stops') return stops >= 2;
          return true;
        });
      });
    }

    // Filter by price range
    if (filters.priceRange.min > 0 || filters.priceRange.max < Infinity) {
      const minPrice = filters.priceRange.min || globalPriceRange.min;
      const maxPrice = filters.priceRange.max === Infinity 
        ? globalPriceRange.max 
        : filters.priceRange.max;
      
      result = result.filter((flight) => {
        const price = getFlightPrice(flight);
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Filter by airlines
    if (filters.airlines.length > 0) {
      result = result.filter((flight) =>
        flight.validatingAirlineCodes.some((code) =>
          filters.airlines.includes(code)
        )
      );
    }

    // Filter by duration
    if (filters.duration !== null) {
      result = result.filter((flight) => {
        const duration = getFlightDuration(flight);
        return duration <= filters.duration!;
      });
    }

    // Sort results
    result.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return getFlightPrice(a) - getFlightPrice(b);
        case 'price-desc':
          return getFlightPrice(b) - getFlightPrice(a);
        case 'duration-asc':
          return getFlightDuration(a) - getFlightDuration(b);
        case 'departure-asc':
          return getDepartureTime(a).getTime() - getDepartureTime(b).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [flights, filters, sortOption, globalPriceRange]);

  // Calculate price statistics for filtered flights
  const priceStats = useMemo(() => {
    if (filteredFlights.length === 0) {
      return { min: 0, max: 0, average: 0 };
    }
    const prices = filteredFlights.map(getFlightPrice);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: prices.reduce((a, b) => a + b, 0) / prices.length,
    };
  }, [filteredFlights]);

  // Generate price graph data
  const priceGraphData = useMemo((): PriceGraphDataPoint[] => {
    if (filteredFlights.length === 0) return [];

    // Group flights by price buckets for visualization
    const bucketCount = Math.min(10, filteredFlights.length);
    const priceStep = (priceStats.max - priceStats.min) / bucketCount || 1;
    
    const buckets = new Array(bucketCount).fill(0).map((_, i) => ({
      date: `$${Math.round(priceStats.min + i * priceStep)}`,
      price: 0,
      label: `$${Math.round(priceStats.min + i * priceStep)} - $${Math.round(priceStats.min + (i + 1) * priceStep)}`,
    }));

    filteredFlights.forEach((flight) => {
      const price = getFlightPrice(flight);
      const bucketIndex = Math.min(
        Math.floor((price - priceStats.min) / priceStep),
        bucketCount - 1
      );
      if (bucketIndex >= 0 && bucketIndex < buckets.length) {
        buckets[bucketIndex].price++;
      }
    });

    return buckets;
  }, [filteredFlights, priceStats]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.stops.length > 0 ||
      filters.airlines.length > 0 ||
      filters.priceRange.min > globalPriceRange.min ||
      filters.priceRange.max < globalPriceRange.max ||
      filters.duration !== null
    );
  }, [filters, globalPriceRange]);

  // Filter actions
  const setStopFilters = useCallback((stops: StopFilter[]) => {
    setFilters((prev) => ({ ...prev, stops }));
  }, []);

  const setPriceRange = useCallback((range: PriceRange) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  }, []);

  const setAirlineFilters = useCallback((airlines: string[]) => {
    setFilters((prev) => ({ ...prev, airlines }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSortOption('price-asc');
  }, []);

  return {
    filteredFlights,
    priceStats,
    airlineOptions,
    priceGraphData,
    filters,
    sortOption,
    setStopFilters,
    setPriceRange,
    setAirlineFilters,
    setSortOption,
    resetFilters,
    totalFiltered: filteredFlights.length,
    hasActiveFilters,
  };
};

export default useFlightFilters;
