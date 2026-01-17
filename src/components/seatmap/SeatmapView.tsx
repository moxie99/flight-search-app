// ============================================================================
// SeatmapView Component
// Main container for aircraft seatmap display with state management
// ============================================================================

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Alert,
  AlertTitle,
  Button,
  Skeleton,
  Tabs,
  Tab,
  Paper,
  alpha,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Refresh,
  AirlineSeatReclineNormal,
  ErrorOutline,
} from '@mui/icons-material';
import { CabinLayout } from './CabinLayout';
import { SeatLegend } from './SeatLegend';
import { SeatDetailsPanel } from './SeatDetailsPanel';
import { useSeatmap } from '../../hooks';
import type { FlightOffer, ProcessedSeat, SelectedSeat, Seatmap, CabinSection, Seat, CabinClass } from '../../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SeatmapViewProps {
  flightOffer: FlightOffer;
  onSeatSelect?: (segmentId: string, seat: SelectedSeat) => void;
  onSeatConfirm?: (segmentId: string, seat: SelectedSeat) => void;
}

interface SegmentSeatmapProps {
  seatmap: Seatmap;
  selectedSeat: ProcessedSeat | null;
  onSeatSelect: (seat: ProcessedSeat) => void;
  onSeatConfirm?: (seat: ProcessedSeat) => void;
  onSeatClear: () => void;
  seatSize: 'small' | 'medium' | 'large';
  isMobile: boolean;
}

// -----------------------------------------------------------------------------
// Seat Processing Helpers
// -----------------------------------------------------------------------------

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

const hasCharacteristic = (seat: Seat, code: string): boolean => {
  return seat.characteristicsCodes?.includes(code as never) ?? false;
};

const processSeat = (seat: Seat, selectedSeatNumber?: string): ProcessedSeat => {
  const { row, column } = parseSeatNumber(seat.number);
  
  const isWindow = hasCharacteristic(seat, 'W');
  const isAisle = hasCharacteristic(seat, 'A');
  const isMiddle = hasCharacteristic(seat, 'M') || (!isWindow && !isAisle);
  const isExitRow = hasCharacteristic(seat, 'E');
  const isExtraLegroom = hasCharacteristic(seat, 'L');
  const isPremium = hasCharacteristic(seat, 'P') || hasCharacteristic(seat, 'CH');
  
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

const groupSeatsByCabin = (seats: ProcessedSeat[]): CabinSection[] => {
  const cabinGroups = new Map<CabinClass, ProcessedSeat[]>();
  
  for (const seat of seats) {
    const existing = cabinGroups.get(seat.cabin) || [];
    existing.push(seat);
    cabinGroups.set(seat.cabin, existing);
  }
  
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
// Segment Seatmap Component
// -----------------------------------------------------------------------------

const SegmentSeatmap: React.FC<SegmentSeatmapProps> = ({
  seatmap,
  selectedSeat,
  onSeatSelect,
  onSeatConfirm,
  onSeatClear,
  seatSize,
  isMobile,
}) => {
  // Process seats and group by cabin
  const cabinSections = useMemo(() => {
    const allSeats = seatmap.decks.flatMap(deck => deck.seats || []);
    const processedSeats = allSeats.map(seat => 
      processSeat(seat, selectedSeat?.number)
    );
    return groupSeatsByCabin(processedSeats);
  }, [seatmap, selectedSeat?.number]);

  return (
    <Grid container spacing={3}>
      {/* Seat Map */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Box
          sx={{
            overflowX: 'auto',
            pb: 2,
            // Scrollbar styling
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha('#718096', 0.1),
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha('#718096', 0.3),
              borderRadius: 4,
              '&:hover': {
                backgroundColor: alpha('#718096', 0.5),
              },
            },
          }}
        >
          <CabinLayout
            cabinSections={cabinSections}
            selectedSeatNumber={selectedSeat?.number}
            onSeatSelect={onSeatSelect}
            seatSize={seatSize}
            showPrices={!isMobile}
          />
        </Box>
      </Grid>

      {/* Sidebar */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Box
          sx={{
            position: { md: 'sticky' },
            top: { md: 20 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Seat Details */}
          <SeatDetailsPanel
            seat={selectedSeat}
            onConfirm={onSeatConfirm}
            onClear={onSeatClear}
          />

          {/* Legend */}
          <SeatLegend compact={isMobile} />
        </Box>
      </Grid>
    </Grid>
  );
};

// -----------------------------------------------------------------------------
// Loading Skeleton
// -----------------------------------------------------------------------------

const SeatmapSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <CircularProgress size={24} />
        <Typography color="text.secondary">Loading seat map...</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
        </Grid>
      </Grid>
    </Box>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const SeatmapView: React.FC<SeatmapViewProps> = ({
  flightOffer,
  onSeatSelect,
  onSeatConfirm,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  // State
  const [activeSegment, setActiveSegment] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<Record<string, ProcessedSeat>>({});

  // Fetch seatmap data
  const { seatmaps, isLoading, isError, error, refetch, isFetching } = useSeatmap(flightOffer);

  // Get segments info from flight offer
  const segments = useMemo(() => {
    return flightOffer.itineraries.flatMap((itinerary, itineraryIndex) =>
      itinerary.segments.map((segment, segmentIndex) => ({
        id: segment.id,
        itineraryIndex,
        segmentIndex,
        departure: segment.departure,
        arrival: segment.arrival,
        label: itineraryIndex === 0 ? 'Outbound' : 'Return',
      }))
    );
  }, [flightOffer]);

  // Match seatmaps to segments
  const segmentSeatmaps = useMemo(() => {
    const map = new Map<string, Seatmap>();
    seatmaps.forEach(sm => {
      if (sm.segmentId) {
        map.set(sm.segmentId, sm);
      }
    });
    return map;
  }, [seatmaps]);

  // Handlers
  const handleSeatSelect = useCallback((segmentId: string, seat: ProcessedSeat) => {
    setSelectedSeats(prev => ({
      ...prev,
      [segmentId]: seat,
    }));
    
    if (onSeatSelect) {
      onSeatSelect(segmentId, {
        seatNumber: seat.number,
        segmentId,
        cabin: seat.cabin,
        characteristics: seat.characteristicsCodes,
        price: seat.travelerPricing?.[0]?.price,
      });
    }
  }, [onSeatSelect]);

  const handleSeatConfirm = useCallback((segmentId: string, seat: ProcessedSeat) => {
    if (onSeatConfirm) {
      onSeatConfirm(segmentId, {
        seatNumber: seat.number,
        segmentId,
        cabin: seat.cabin,
        characteristics: seat.characteristicsCodes,
        price: seat.travelerPricing?.[0]?.price,
      });
    }
  }, [onSeatConfirm]);

  const handleSeatClear = useCallback((segmentId: string) => {
    setSelectedSeats(prev => {
      const newState = { ...prev };
      delete newState[segmentId];
      return newState;
    });
  }, []);

  // Determine seat size
  const seatSize = isSmall ? 'small' : isMobile ? 'medium' : 'medium';

  // Loading state
  if (isLoading) {
    return <SeatmapSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          icon={<ErrorOutline />}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              disabled={isFetching}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle>Unable to Load Seat Map</AlertTitle>
          {error?.message || 'An error occurred while fetching the seat map. Please try again.'}
        </Alert>
      </Box>
    );
  }

  // No seatmaps available
  if (seatmaps.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: alpha('#718096', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <AirlineSeatReclineNormal sx={{ fontSize: 40, color: 'text.disabled' }} />
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Seat Map Not Available
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Seat selection is not available for this flight.
          Please contact the airline directly for seat assignments.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 2 }}>
      {/* Segment Tabs (if multiple segments) */}
      {segments.length > 1 && (
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={activeSegment}
            onChange={(_, value) => setActiveSegment(value)}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{
              backgroundColor: alpha('#f7fafc', 0.5),
              '& .MuiTab-root': {
                minHeight: 56,
                textTransform: 'none',
              },
            }}
          >
            {segments.map((segment, index) => (
              <Tab
                key={segment.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {index === 0 ? (
                      <FlightTakeoff sx={{ fontSize: 18 }} />
                    ) : (
                      <FlightLand sx={{ fontSize: 18 }} />
                    )}
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {segment.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {segment.departure.iataCode} → {segment.arrival.iataCode}
                      </Typography>
                    </Box>
                    {selectedSeats[segment.id] && (
                      <Box
                        sx={{
                          ml: 1,
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          backgroundColor: 'success.main',
                          color: 'white',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                        }}
                      >
                        {selectedSeats[segment.id].number}
                      </Box>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>
      )}

      {/* Active Segment Seatmap */}
      {segments[activeSegment] && (
        <Box>
          {/* Flight info header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2,
              p: 2,
              backgroundColor: alpha('#1a365d', 0.04),
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'white',
              }}
            >
              {activeSegment === 0 ? (
                <FlightTakeoff sx={{ fontSize: 20 }} />
              ) : (
                <FlightLand sx={{ fontSize: 20 }} />
              )}
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {segments[activeSegment].departure.iataCode} →{' '}
                {segments[activeSegment].arrival.iataCode}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Select your seat for this flight segment
              </Typography>
            </Box>
          </Box>

          {/* Seatmap */}
          {segmentSeatmaps.get(segments[activeSegment].id) ? (
            <SegmentSeatmap
              seatmap={segmentSeatmaps.get(segments[activeSegment].id)!}
              selectedSeat={selectedSeats[segments[activeSegment].id] || null}
              onSeatSelect={(seat) => handleSeatSelect(segments[activeSegment].id, seat)}
              onSeatConfirm={(seat) => handleSeatConfirm(segments[activeSegment].id, seat)}
              onSeatClear={() => handleSeatClear(segments[activeSegment].id)}
              seatSize={seatSize}
              isMobile={isMobile}
            />
          ) : (
            <Alert severity="info">
              Seat map not available for this segment.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SeatmapView;
