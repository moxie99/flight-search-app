// ============================================================================
// Quick Filters Component
// Horizontal scrollable filter chips (optimized with memoization)
// ============================================================================

import React, { useCallback, useMemo } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import {
  FlightTakeoff,
  AttachMoney,
  Schedule,
} from '@mui/icons-material';
import type { StopFilter } from '../../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface QuickFiltersProps {
  selectedStops: StopFilter[];
  onStopsChange: (stops: StopFilter[]) => void;
  cheapestPrice?: number;
  fastestDuration?: string;
  currency?: string;
}

// -----------------------------------------------------------------------------
// Filter Chip (Memoized)
// -----------------------------------------------------------------------------

interface StopFilterChipProps {
  stop: StopFilter;
  label: string;
  icon?: React.ReactElement;
  isSelected: boolean;
  onToggle: (stop: StopFilter) => void;
}

const StopFilterChip: React.FC<StopFilterChipProps> = React.memo(
  ({ stop, label, icon, isSelected, onToggle }) => {
    const handleClick = useCallback(() => {
      onToggle(stop);
    }, [stop, onToggle]);

    return (
      <Chip
        icon={icon}
        label={label}
        onClick={handleClick}
        color={isSelected ? 'primary' : 'default'}
        variant={isSelected ? 'filled' : 'outlined'}
        sx={{
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        }}
      />
    );
  }
);

StopFilterChip.displayName = 'StopFilterChip';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const QuickFiltersComponent: React.FC<QuickFiltersProps> = ({
  selectedStops,
  onStopsChange,
  cheapestPrice,
  fastestDuration,
  currency = 'USD',
}) => {
  // Memoized selected stops set for O(1) lookup
  const selectedSet = useMemo(
    () => new Set(selectedStops),
    [selectedStops]
  );

  // Memoized toggle handler
  const toggleStop = useCallback(
    (stop: StopFilter) => {
      if (selectedStops.includes(stop)) {
        onStopsChange(selectedStops.filter((s) => s !== stop));
      } else {
        onStopsChange([...selectedStops, stop]);
      }
    },
    [selectedStops, onStopsChange]
  );

  // Memoized price formatter
  const formattedCheapest = useMemo(() => {
    if (!cheapestPrice) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(cheapestPrice);
  }, [cheapestPrice, currency]);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Quick filters
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {/* Non-stop filter */}
        <StopFilterChip
          stop="non-stop"
          label="Non-stop only"
          icon={<FlightTakeoff sx={{ fontSize: 18 }} />}
          isSelected={selectedSet.has('non-stop')}
          onToggle={toggleStop}
        />

        {/* 1 Stop filter */}
        <StopFilterChip
          stop="1-stop"
          label="1 stop max"
          isSelected={selectedSet.has('1-stop')}
          onToggle={toggleStop}
        />

        {/* Cheapest indicator */}
        {formattedCheapest && (
          <Chip
            icon={<AttachMoney sx={{ fontSize: 18 }} />}
            label={`Cheapest: ${formattedCheapest}`}
            color="success"
            variant="outlined"
            sx={{
              borderStyle: 'dashed',
            }}
          />
        )}

        {/* Fastest indicator */}
        {fastestDuration && (
          <Chip
            icon={<Schedule sx={{ fontSize: 18 }} />}
            label={`Fastest: ${fastestDuration}`}
            color="info"
            variant="outlined"
            sx={{
              borderStyle: 'dashed',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

// Custom comparison for memoization
const arePropsEqual = (
  prevProps: QuickFiltersProps,
  nextProps: QuickFiltersProps
): boolean => {
  // Compare selected stops
  if (prevProps.selectedStops.length !== nextProps.selectedStops.length) return false;
  if (prevProps.selectedStops.some((stop, i) => stop !== nextProps.selectedStops[i])) {
    return false;
  }
  
  // Compare other props
  return (
    prevProps.cheapestPrice === nextProps.cheapestPrice &&
    prevProps.fastestDuration === nextProps.fastestDuration &&
    prevProps.currency === nextProps.currency
  );
};

export const QuickFilters = React.memo(QuickFiltersComponent, arePropsEqual);

export default QuickFilters;
