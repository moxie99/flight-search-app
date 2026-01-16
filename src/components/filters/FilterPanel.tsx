// ============================================================================
// Filter Panel Component
// Combined filter panel with all filter types
// ============================================================================

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Badge,
} from '@mui/material';
import { FilterList, Close, Refresh } from '@mui/icons-material';
import { StopsFilter } from './StopsFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { AirlineFilter } from './AirlineFilter';
import type { FlightFilters, StopFilter, PriceRange } from '../../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AirlineOption {
  code: string;
  name: string;
  count: number;
}

interface FilterPanelProps {
  filters: FlightFilters;
  airlineOptions: AirlineOption[];
  priceRange: { min: number; max: number };
  onStopsChange: (stops: StopFilter[]) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onAirlinesChange: (airlines: string[]) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  disabled?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// -----------------------------------------------------------------------------
// Filter Content Component
// -----------------------------------------------------------------------------

interface FilterContentProps extends Omit<FilterPanelProps, 'mobileOpen' | 'onMobileClose'> {}

const FilterContent: React.FC<FilterContentProps> = ({
  filters,
  airlineOptions,
  priceRange,
  onStopsChange,
  onPriceRangeChange,
  onAirlinesChange,
  onReset,
  hasActiveFilters,
  disabled = false,
}) => {
  const activeFilterCount =
    filters.stops.length +
    filters.airlines.length +
    (filters.priceRange.min > priceRange.min ||
    filters.priceRange.max < priceRange.max
      ? 1
      : 0);

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          {activeFilterCount > 0 && (
            <Badge
              badgeContent={activeFilterCount}
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<Refresh />}
            onClick={onReset}
            disabled={disabled}
            sx={{ textTransform: 'none' }}
          >
            Reset
          </Button>
        )}
      </Box>

      {/* Stops Filter */}
      <Box sx={{ mb: 3 }}>
        <StopsFilter
          selectedStops={filters.stops}
          onChange={onStopsChange}
          disabled={disabled}
        />
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Price Range Filter */}
      <Box sx={{ mb: 3 }}>
        <PriceRangeFilter
          value={filters.priceRange}
          onChange={onPriceRangeChange}
          min={priceRange.min}
          max={priceRange.max}
          disabled={disabled}
        />
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Airline Filter */}
      <Box>
        <AirlineFilter
          airlines={airlineOptions}
          selectedAirlines={filters.airlines}
          onChange={onAirlinesChange}
          disabled={disabled}
        />
      </Box>
    </Box>
  );
};

// -----------------------------------------------------------------------------
// Main Filter Panel Component
// -----------------------------------------------------------------------------

export const FilterPanel: React.FC<FilterPanelProps> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mobileOpen = false, onMobileClose } = props;

  // Mobile Drawer
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        PaperProps={{
          sx: {
            width: '85%',
            maxWidth: 360,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          <IconButton onClick={onMobileClose} edge="end">
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ overflow: 'auto', flex: 1 }}>
          <FilterContent {...props} />
        </Box>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            fullWidth
            onClick={onMobileClose}
            size="large"
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    );
  }

  // Desktop Panel
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        position: 'sticky',
        top: 24,
      }}
    >
      <FilterContent {...props} />
    </Paper>
  );
};

export default FilterPanel;
