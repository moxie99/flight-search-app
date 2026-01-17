// ============================================================================
// Seatmap Hook
// React Query hook for fetching and managing aircraft seatmap data
// ============================================================================

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { amadeusApi } from '../api/amadeus.client';
import { QUERY_KEYS, CACHE_TIME } from '../config/constants';
import type { FlightOffer, SeatmapResponse, Seatmap, ProcessedSeat, CabinSection, Seat, CabinClass } from '../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface UseSeatmapOptions {
  enabled?: boolean;
  onSuccess?: (data: SeatmapResponse) => void;
  onError?: (error: Error) => void;
}

interface UseSeatmapReturn {
  seatmaps: Seatmap[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
  // Processed data helpers
  getSeatmapForSegment: (segmentId: string) => Seatmap | undefined;
  getCabinSections: (seatmap: Seatmap) => CabinSection[];
  processSeats: (seatmap: Seatmap, selectedSeatNumber?: string) => ProcessedSeat[];
}

// -----------------------------------------------------------------------------
// Seat Processing Helpers
// -----------------------------------------------------------------------------

/**
 * Extract row number and column letter from seat number (e.g., "12A" -> { row: 12, column: "A" })
 */
const parseSeatNumber = (seatNumber: string): { row: number; column: string } => {
  const match = seatNumber.match(/^(\d+)([A-Z]+)$/i);
  if (!match) {
    return { row: 0, column: '' };
  }
  return {
    row: parseInt(match[1], 10),
    column: match[2].toUpperCase(),
  };
};

/**
 * Check if seat has a specific characteristic
 */
const hasCharacteristic = (seat: Seat, code: string): boolean => {
  return seat.characteristicsCodes?.includes(code as never) ?? false;
};

/**
 * Process raw seat data into UI-friendly format
 */
const processSeat = (seat: Seat, selectedSeatNumber?: string): ProcessedSeat => {
  const { row, column } = parseSeatNumber(seat.number);
  
  // Determine seat characteristics
  const isWindow = hasCharacteristic(seat, 'W');
  const isAisle = hasCharacteristic(seat, 'A');
  const isMiddle = hasCharacteristic(seat, 'M') || (!isWindow && !isAisle);
  const isExitRow = hasCharacteristic(seat, 'E');
  const isExtraLegroom = hasCharacteristic(seat, 'L');
  const isPremium = hasCharacteristic(seat, 'P') || hasCharacteristic(seat, 'CH');
  
  // Format price if available
  let displayPrice: string | undefined;
  if (seat.travelerPricing?.[0]?.price) {
    const price = seat.travelerPricing[0].price;
    displayPrice = `${price.currency} ${parseFloat(price.total).toFixed(0)}`;
  }
  
  return {
    ...seat,
    row,
    column,
    isWindow,
    isAisle,
    isMiddle,
    isExitRow,
    isExtraLegroom,
    isPremium,
    isSelected: seat.number === selectedSeatNumber,
    displayPrice,
  };
};

/**
 * Group seats by cabin class and organize into sections
 */
const groupSeatsByCabin = (seats: ProcessedSeat[]): CabinSection[] => {
  const cabinGroups = new Map<CabinClass, ProcessedSeat[]>();
  
  // Group seats by cabin
  for (const seat of seats) {
    const existing = cabinGroups.get(seat.cabin) || [];
    existing.push(seat);
    cabinGroups.set(seat.cabin, existing);
  }
  
  // Convert to CabinSection array
  const cabinOrder: CabinClass[] = ['FIRST', 'BUSINESS', 'PREMIUM_ECONOMY', 'ECONOMY'];
  const cabinDisplayNames: Record<CabinClass, string> = {
    'FIRST': 'First Class',
    'BUSINESS': 'Business Class',
    'PREMIUM_ECONOMY': 'Premium Economy',
    'ECONOMY': 'Economy',
  };
  
  const sections: CabinSection[] = [];
  
  for (const cabin of cabinOrder) {
    const cabinSeats = cabinGroups.get(cabin);
    if (!cabinSeats || cabinSeats.length === 0) continue;
    
    // Get unique rows and columns
    const rows = [...new Set(cabinSeats.map(s => s.row))].sort((a, b) => a - b);
    const columns = [...new Set(cabinSeats.map(s => s.column))].sort();
    
    sections.push({
      cabin,
      displayName: cabinDisplayNames[cabin],
      seats: cabinSeats,
      rows,
      columns,
      startRow: Math.min(...rows),
      endRow: Math.max(...rows),
    });
  }
  
  return sections;
};

// -----------------------------------------------------------------------------
// Main Hook
// -----------------------------------------------------------------------------

export const useSeatmap = (
  flightOffer: FlightOffer | null,
  options?: UseSeatmapOptions
): UseSeatmapReturn => {
  const queryOptions: UseQueryOptions<SeatmapResponse, Error> = {
    queryKey: [QUERY_KEYS.SEATMAP, flightOffer?.id],
    queryFn: async () => {
      if (!flightOffer) {
        throw new Error('Flight offer is required');
      }
      return amadeusApi.getSeatmap(flightOffer);
    },
    enabled: !!flightOffer && options?.enabled !== false,
    staleTime: CACHE_TIME.SEATMAP,
    retry: 1,
    refetchOnWindowFocus: false,
  };

  const query = useQuery(queryOptions);

  // Helper to get seatmap for a specific segment
  const getSeatmapForSegment = (segmentId: string): Seatmap | undefined => {
    return query.data?.data?.find(sm => sm.segmentId === segmentId);
  };

  // Helper to get cabin sections from a seatmap
  const getCabinSections = (seatmap: Seatmap): CabinSection[] => {
    const allSeats = seatmap.decks.flatMap(deck => deck.seats || []);
    const processedSeats = allSeats.map(seat => processSeat(seat));
    return groupSeatsByCabin(processedSeats);
  };

  // Helper to process all seats with selection state
  const processSeats = (seatmap: Seatmap, selectedSeatNumber?: string): ProcessedSeat[] => {
    const allSeats = seatmap.decks.flatMap(deck => deck.seats || []);
    return allSeats.map(seat => processSeat(seat, selectedSeatNumber));
  };

  // Call success/error callbacks
  if (query.isSuccess && options?.onSuccess) {
    options.onSuccess(query.data);
  }
  if (query.isError && options?.onError && query.error) {
    options.onError(query.error);
  }

  return {
    seatmaps: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
    getSeatmapForSegment,
    getCabinSections,
    processSeats,
  };
};

export default useSeatmap;
