// ============================================================================
// Quick Filters Component
// Horizontal scrollable filter chips for quick access
// ============================================================================

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import {
  FlightTakeoff,
  AttachMoney,
  Schedule,
} from '@mui/icons-material';
import type { StopFilter } from '../../types';

interface QuickFiltersProps {
  selectedStops: StopFilter[];
  onStopsChange: (stops: StopFilter[]) => void;
  cheapestPrice?: number;
  fastestDuration?: string;
  currency?: string;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  selectedStops,
  onStopsChange,
  cheapestPrice,
  fastestDuration,
  currency = 'USD',
}) => {
  const toggleStop = (stop: StopFilter) => {
    if (selectedStops.includes(stop)) {
      onStopsChange(selectedStops.filter((s) => s !== stop));
    } else {
      onStopsChange([...selectedStops, stop]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

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
        <Chip
          icon={<FlightTakeoff sx={{ fontSize: 18 }} />}
          label="Non-stop only"
          onClick={() => toggleStop('non-stop')}
          color={selectedStops.includes('non-stop') ? 'primary' : 'default'}
          variant={selectedStops.includes('non-stop') ? 'filled' : 'outlined'}
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          }}
        />

        {/* 1 Stop filter */}
        <Chip
          label="1 stop max"
          onClick={() => toggleStop('1-stop')}
          color={selectedStops.includes('1-stop') ? 'primary' : 'default'}
          variant={selectedStops.includes('1-stop') ? 'filled' : 'outlined'}
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          }}
        />

        {/* Cheapest indicator */}
        {cheapestPrice && (
          <Chip
            icon={<AttachMoney sx={{ fontSize: 18 }} />}
            label={`Cheapest: ${formatPrice(cheapestPrice)}`}
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

export default QuickFilters;
